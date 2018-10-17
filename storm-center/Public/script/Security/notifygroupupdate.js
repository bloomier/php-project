/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */

(function(){


    var zTree;

    $(document).ready(function(){

        var target = $("#defaultNotifyTarget").val();
        var city = target.split("-");
        if(city.length == 2){
            $("#citys").citySelect({prov:city[0], city:city[1]});
        }else{
            $("#citys").citySelect({prov:city[0]});
        }

        var groupType = $("#defaultNotifyGroupType").val();
        $("#groupType").find("option[value='" + groupType + "']").attr("selected",true);
        var root = $("#rootPath").val();
        $(".groupHref").attr("href", root+"/Security/NotifyGroup");

        __init__.bind_function();
        __init__.init_tree($("#defaultNotifyGroupId").val());

    });

    var __init__={
        bind_function : function(){
            $(".notify-group-save").bind("click", function(){
                var subList = [];
                $.each(zTree.getCheckedNodes(true),function(point, item){
                    subList.push(item.id);
                });
                var groupId = $("#defaultNotifyGroupId").val()
                var param = {"groupId":groupId};
                var groupName= $.trim($("[name='groupName']").val());
                var groupPinyin= $.trim($("[name='groupPinyin']").val());
                var groupType= $.trim($("[name='groupType']").val());
                var province= $.trim($("[name='province']").val());
                var city= $.trim($("[name='city']").val());
                var remark= $.trim($("[name='remark']").val());
                subList.join(",");
                
                $.extend(param,{"groupName":groupName});
                $.extend(param,{"groupPinyin":groupPinyin});
                $.extend(param,{"groupType":groupType});
                $.extend(param,{"province":province});
                $.extend(param,{"city":city});
                $.extend(param,{"remark":remark});
                $.extend(param,{"subList":subList.join(",")});
                $.post($("#rootPath").val()+ "/Security/NotifyGroup/update",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                });
            });

            $(".btn-search").bind("click", function(){
                var value = $("#search_id").val();
                if(value == ''){
                    storm.alert("请输入查询条件");
                    return ;
                }

                _tree_.searchByFlag_ztree('ztree',value,'');
            });
        },

        init_tree : function(groupId){
            $.post($("#rootPath").val()+"/Security/NotifyGroup/queryUserGroup", {groupId:groupId}).success(function(json){
                var mNodes = [];
                var id = -1;
                $.each(json.rows, function(point, item){
                    var rootNode = {title:item.firm,name:item.firm,id:id,children:[],nocheck:true};
                    mNodes.push(rootNode);
                    $.each(item.list, function(subPoint, subItem){
                        var childNode;
                        if(subItem.checked && subItem.checked != null && subItem.checked != 'null'){
                            childNode = {title:subItem.user_NAME,name:subItem.user_NAME, id:subItem.user_ID, checked:true};
                        }else{
                            childNode = {title:subItem.user_NAME,name:subItem.user_NAME, id:subItem.user_ID};
                        }

                        rootNode.children.push(childNode);
                    });
                    id--;
                });
                zTree= $.fn.zTree.init($("#ztree"), setting,mNodes);
            });
        }
    };

    var _tree_ = {
        searchByFlag_ztree: function(treeId, searchCondition, flag){
            //<2>.得到模糊匹配搜索条件的节点数组集合
            var highlightNodes = new Array();
            if (searchCondition != "") {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                highlightNodes = treeObj.getNodesByParamFuzzy("name", searchCondition, null);
            }
            //<3>.高亮显示并展示【指定节点s】
            _tree_.highlightAndExpand_ztree(treeId, highlightNodes, flag);
        },
        expand_ztree: function(treeId){
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            treeObj.expandAll(true);
        },
        close_ztree: function(treeId){
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var nodes = treeObj.transformToArray(treeObj.getNodes());
            var nodeLength = nodes.length;
            for (var i = 0; i < nodeLength; i++) {
                if (nodes[i].id == '0') {
                    //根节点：展开
                    treeObj.expandNode(nodes[i], true, true, false);
                } else {
                    //非根节点：收起
                    treeObj.expandNode(nodes[i], false, true, false);
                }
            }
        },
        highlightAndExpand_ztree: function(treeId, highlightNodes, flag){
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            //<1>. 先把全部节点更新为普通样式
            var treeNodes = treeObj.transformToArray(treeObj.getNodes());
            for (var i = 0; i < treeNodes.length; i++) {
                treeNodes[i].highlight = false;
                treeObj.setting.view.fontCss["color"]= "#000";
                treeObj.updateNode(treeNodes[i]);
            }
            //<2>.收起树, 只展开根节点下的一级节点
            _tree_.close_ztree(treeId);
            //<3>.把指定节点的样式更新为高亮显示，并展开
            if (highlightNodes != null) {
                for (var i = 0; i < highlightNodes.length; i++) {
                    if (flag != null && flag != "") {
                        if (highlightNodes[i].flag == flag) {
                            //高亮显示节点，并展开
                            highlightNodes[i].highlight = true;
                            treeObj.updateNode(highlightNodes[i]);
                            //高亮显示节点的父节点的父节点....直到根节点，并展示
                            var parentNode = highlightNodes[i].getParentNode();
                            var parentNodes = _tree_.getParentNodes_ztree(treeId, parentNode);
                            _tree_.setFontCss_ztree(treeObj);
                            treeObj.expandNode(parentNodes, true, false, true);
                            treeObj.expandNode(parentNode, true, false, true);
                        }
                    } else {
                        //高亮显示节点，并展开
                        highlightNodes[i].highlight = true;
                        treeObj.setting.view.fontCss["color"]= "#00F";
                        treeObj.updateNode(highlightNodes[i]);
                        // alert(highlightNodes[i].name);
                        //高亮显示节点的父节点的父节点....直到根节点，并展示
                        var parentNode = highlightNodes[i].getParentNode();
                        var parentNodes = _tree_.getParentNodes_ztree(treeId, parentNode);
                        treeObj.expandNode(parentNodes, true, false, true);
                        treeObj.expandNode(parentNode, true, false, true);
                    }
                }
            }
        },
        getParentNodes_ztree: function(treeId, node){
            if (node != null) {
                var treeObj = $.fn.zTree.getZTreeObj(treeId);
                var parentNode = node.getParentNode();
                return _tree_.getParentNodes_ztree(treeId, parentNode);
            } else {
                return node;
            }
        }
    };

    var setting = {

        check:{
            enable:true
        },
        data:{
            key:{
                name:"title"
            }
        }
    };


})();