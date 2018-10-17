/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */

(function(){

    var policygroupid = $("#policygroupid").val();
    var thisPolicyList = $("#thisPolicyList").val();
    var srcPolicyList = $("#srcPolicyList").val();
    var leaveIds = $("#leaveIds").val();
    var enable = $("#enableValue").val();

    $(document).ready(function(){

        // 初始化数据
        thisPolicyList = __function__.convert(thisPolicyList);
        srcPolicyList = __function__.convert(srcPolicyList);
        leaveIds = __function__.convert(leaveIds);

        $("input:radio[name='policy-group-enable'][value='" + enable + "']").attr("checked",true);

        __init__.initView();

        __bind__.bindFunction();
    });

    var __init__={

        initView : function(){
            var srcNode = __function__.initNode(leaveIds);
            __init__.initTree("srcTree", srcNode,src_setting);
            var targetNode = __function__.initNode(thisPolicyList);
            __init__.initTree("destTree", targetNode, dest_setting);
        },
        // 初始化树
        initTree:function(target, zNodes, setting){
            var treeObj = $("#" + target + "");
            $.fn.zTree.init(treeObj, setting, zNodes);
            treeObj.hover(function () {
                if (!treeObj.hasClass("showIcon")) {
                    treeObj.addClass("showIcon");
                }
            }, function() {
                treeObj.removeClass("showIcon");
            });
        }
    };

    var __bind__ = {
        bindFunction:function(){

            $(".policy-query-reset").bind("click", function(){
                var tmp = $(".policy-query-param").val();
                var srcNode = [];
                if(tmp == ''){
                    srcNode = __function__.initNode(leaveIds);

                }else{
                    srcNode = __function__.initNode(leaveIds, tmp);
                }
                __init__.initTree("srcTree", srcNode,src_setting);
                return false;
            });

            // 将左边全部添加到右边
            $(".all-right").bind("click", function(){
                var srcNode = __function__.initNode({});
                __init__.initTree("srcTree", srcNode,src_setting);
                $.extend(thisPolicyList, leaveIds);
                var tmp = $(".policy-query-param").val();
                tmp = $.trim(tmp);
                var targetNode=[];
                if(tmp == ''){
                    targetNode = __function__.initNode(thisPolicyList);
                }else{
                    targetNode = __function__.initNode(thisPolicyList, tmp);
                }
                __init__.initTree("destTree", targetNode, dest_setting);
            });

            // 将右边全部添加到左边
            $(".all-left").bind("click", function(){
                var srcNode = __function__.initNode({});
                __init__.initTree("destTree", srcNode,src_setting);

                $.extend(thisPolicyList, leaveIds);
                var tmp = $(".policy-query-param").val();
                tmp = $.trim(tmp);
                var targetNode=[];
                if(tmp == ''){
                    targetNode = __function__.initNode(thisPolicyList);
                }else{
                    targetNode = __function__.initNode(thisPolicyList, tmp);
                }
                __init__.initTree("srcTree", targetNode, src_setting);
            });

            /**
             * 更新
             */
            $(".update-policy-group").bind("click", function(){
                var enable = $('input[name="policy-group-enable"]:checked').val();// 获取radio的值
                var name = $(".policy-group-name").val();
                var desc = $.trim($(".policy-group-desc").val());// 获取备注
                var dest = $.fn.zTree.getZTreeObj("destTree");

                var nodes = dest.getNodes();
                var policyIds = [];

                $.each(nodes, function(point, item){
                    if(item.isParent){
                        $.each(item.children, function(p, i){
                            policyIds.push(i.id);
                        });
                    }
                });
                var policy_ids = policyIds.join(",");
                var param = {id:policygroupid,enable:enable};
                if(name){
                    $.extend(param, {name:name});
                }else{
                    Message.init({
                        text: "策略名称不能为空！",
                        type: 'success' //info success warning danger
                    });
                    return false;
                }

                if(policy_ids){
                    $.extend(param, {policy_ids:policy_ids});
                }else{
                    Message.init({
                        text: "策略编号不能为空！",
                        type: 'success' //info success warning danger
                    });
                    return false;
                }

                if(desc){
                    $.extend(param, {desc:desc});
                }else{
                    Message.init({
                        text: "描述不能为空！",
                        type: 'success' //info success warning danger
                    });
                    return false;
                }

                $.post(__ROOT__ + "/OptCenter/PolicyGroup/update",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                    var href = __ROOT__ + "/OptCenter/PolicyGroup/index";
                    window.location.href = href;
                });


            });
        }

    };

    var __tree__ = {

        // 自定义样式
        addDiyDom : function(treeId, treeNode){
            var spaceWidth = 5;
            var switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico");
            switchObj.remove();
            icoObj.before(switchObj);
            if (treeNode.level > 1) {
                var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                switchObj.before(spaceStr);
            }
        },

        // 添加节点
        addNode:function(treeNode, src, dest){
            if(treeNode['pId']){
                src.removeNode(treeNode);
                var pId = treeNode['pId'];
                var parentNode = dest.getNodeByParam('id', pId);
                if(!parentNode){
                    var typeName = "";
                    if(pId == 20){
                        typeName = "信息";
                    }else if(pId == 30){
                        typeName = "低危";
                    }else if(pId == 40){
                        typeName = "中危";
                    }else if(pId == 50){
                        typeName = "高危";
                    }else if(pId == 60){
                        typeName = "安全事件";
                    }
                    parentNode = {id:pId, pId:0, name:typeName};
                    dest.addNodes(null,parentNode);
                }
                parentNode = dest.getNodeByParam('id', pId);
                var have = dest.getNodeByParam('id', treeNode['id']);
                if(!have){
                    dest.addNodes(parentNode, {id:treeNode['id'], pId:pId, name:treeNode['name'], open:true});
                }

                var childList = src.getNodesByParam('pId', pId);
                if(childList.length == 0){
                    var srcParentNode = src.getNodeByParam("id", pId);
                    src.removeNode(srcParentNode)
                }
            }
        },

        // 左侧的双击事件
        srcDbclick : function(event, treeId, treeNode){
            var src = $.fn.zTree.getZTreeObj("srcTree");
            var dest = $.fn.zTree.getZTreeObj("destTree");
            __tree__.addNode(treeNode, src, dest);
        },

        // 右侧的双击事件
        destDbclick : function(event, treeId, treeNode){
            var src = $.fn.zTree.getZTreeObj("destTree");
            var dest = $.fn.zTree.getZTreeObj("srcTree");
            __tree__.addNode(treeNode, src, dest);
        }

    };

    // 源操作
    var src_setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: true,
            dblClickExpand: false,
            addDiyDom: __tree__.addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onDblClick:__tree__.srcDbclick
        }
    };

    // 目标操作
    var dest_setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: true,
            dblClickExpand: false,
            addDiyDom: __tree__.addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onDblClick:__tree__.destDbclick
        }
    };

    var __function__ = {
        convert:function(value){
            value = decodeURIComponent(value);
            value = $.parseJSON(value);
            return value;
        },
        initNode : function(src, param){
            var srcNode = [];
            var node = [];
            var nodeId = 100;
            if(!src || src.length == 0){
                return node;
            }
            $.each(src, function(point, item){
                var policyInfo = __function__.getNodeValue(item);
                if(policyInfo){
                    var pId = policyInfo['level'];

                    if(pId){
                        if(param){
                            if(policyInfo['id'].indexOf(param) > -1 || policyInfo['name'].indexOf(param) > -1){
                                srcNode.push(pId);
                                node.push({id:policyInfo['id'], pId:pId, name:policyInfo['name'], value:policyInfo['id']});
                            }
                        }else{
                            srcNode.push(pId);
                            node.push({id:policyInfo['id'], pId:pId, name:policyInfo['name'], value:policyInfo['id']});
                        }
                    }
                }
            });
            var uniqueSrcNode = [];
            $.each(srcNode, function(point, item){
                var have = 1;
                $.each(uniqueSrcNode, function(p, i){
                    if(item == i){
                        have = 0;
                    }
                });
                if(have){
                    uniqueSrcNode.push(item);
                }
            });
            $.each(uniqueSrcNode, function(point, item){
                var typeName = "";
                if(item == 20){
                    typeName = "信息";
                }else if(item == 30){
                    typeName = "低危";
                }else if(item == 40){
                    typeName = "中危";
                }else if(item == 50){
                    typeName = "高危";
                }else if(item == 60){
                    typeName = "安全事件";
                }
                node.push({id:item, pId:0, name:typeName});
            });
            return node;
        },

        getNodeValue : function(policy_id){
            for(var i = 0; i < srcPolicyList.length; i++){
                var item = srcPolicyList[i];
                if(item['id']==policy_id){
                    return item;
                }
            }
        }
    }

})();