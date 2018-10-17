/**
 * Created by shijiaoyun on 2016/3/15.
 */
var __PUBLIC__ = "";
var newCount = 1;

(function(){
    var zTreeObj;
    var tree = {
        init:function(){
            __PUBLIC__ = $("#public_id").val();
            tree.initView();
            tree.initEvent();
            __initData__.getTreeNode();
        },
        initView: function(){
            var w = this;
            w.dialog = new BootstrapDialog({
                title: '<h3 style="color: #fff;">新增IP/IP组</h3>',
                type: BootstrapDialog.TYPE_INFO,
                cssClass: 'login-dialog',
                autodestroy: false,
                cssClass:"inmodal",
                message: function () {
                    return $(".role-dialog-content").show();
                },
                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){
                            __initData__.insertOrUpdate(dialogItself);

                        }
                    },
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
            });
            //dialog.open();
        },
        initEvent:function(){
            var w = this;

            $(".btn-delete").bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    //alert("请先选择一个节点");
                    nisp3.alertMsg("请先选择一个节点");
                    return;
                }
                zTree.removeNode(treeNode);
            });

            $(".btn-add").bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                	nisp3.alertMsg("请先选择一个节点");
                    return;
                }
                w.dialog.open();
                //if (treeNode) {
                //    treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id,  name:"new node" + (newCount++)});
                //}
                ////else {
                ////    //treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, name:"new node" + (newCount++)});
                ////}
                //if (treeNode) {
                //    zTree.editName(treeNode[0]);
                //} else {
                //    alert("叶子节点被锁定，无法增加子节点");
                //}
            });

            $(".btn-alert").bind("click", function(){
                //w.dialog.setTitle("<h3>修改角色</h3>");
                //w.dialog.setData("row", row);
                $.fn.zTree.init($("#ztree"), setting, zNodes);
                //dialog.getModalFooter().hide();
                //dialog.getModalBody().css('background-color', '#0088cc');
                //w.dialog.getModalBody().css('background-color', '#0088cc');
                w.dialog.open();

            });
            
            $(".isIpOrGroup").bind("click",function(){
            	var isIpOrGroup = $('input[name="isIpOrGroup"]:checked ').val();
            	if(isIpOrGroup == 'ip'){
            		$(".isShowForIP").show();
            	} else {
            		$(".isShowForIP").hide();
            	}
            });
        }

    };


    function selectAll() {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
    }

    var __initData__ = {
        insertOrUpdate: function(dialogItself){
            var isIpOrGroup = $('input[name="isIpOrGroup"]:checked ').val();
            console.info(isIpOrGroup);
            var ip_name = $(".ip_name").val();
            console.info("ip_name:" + ip_name);
            if(ip_name == ''){
                nisp3.alertMsg("请填写名称！");
                return false;
            }
            var ipList = $(".ipList").val();
            console.info("iplist: " + ipList);
            if(isIpOrGroup == 'ip'){
                if(ipList == ''){
                    nisp3.alertMsg("请填写IP或者IP段！")
                    return false;
                }
            }
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var sNodes = treeObj.getSelectedNodes();
            if (sNodes.length == 0) {
                nisp3.alertMsg("请先选中一个节点！")
                return false;
            }
            var parentNode = sNodes[0].getParentNode();

            var id_id = $(".id_id").val();
            var nId = id_id > 0 ? sNodes[0].id : '';
            console.info(sNodes[0]);
            var pId = id_id > 0 ? sNodes[0].pId: sNodes[0].id;


            var params = {
                id: id_id,
                nId: nId,
                pId: pId,
                name: ip_name,
                desc: $(".desc").val()
            }
            console.info(params);
            //$.post(__ROOT__ + "/modules/business/ipgroup/insertOrUpdate",params).success(function(json){
            $.post(__ROOT__ + "/Home/Index/insertOrUpdate",params).success(function(json){
                if(json.code == 1){
                    $(".id_id").val('0');
                    if(id_id > 0){
                        params.nId = json.nId;
                        __functions__.addNode(params);
                    } else {
                        __functions__.updateNode(params);
                    }
                    dialogItself.close();
                }
                nisp3.alertMsg(json.msg);
            });
        },
        getTreeNode: function(){
            //$.post(__ROOT__ + "/modules/business/ipgroup/getTreeNodes").success(function(json){
            $.post(__ROOT__ + "/Home/Index/getTreeNodes").success(function(json){
            	//json = $.parseJSON(json);
                console.info(json.treeNodes);
                var setting = {
                    check:{
                        enable: true, //显示复选框
                        chkStyle: "checkbox"
                    },
                    edit: {
                        enable: true,
                        //editNameSelectAll: true,
                        showRemoveBtn: false,
                        showRenameBtn: false
                        //showRemoveBtn: showRemoveBtn,
                        //showRenameBtn: showRenameBtn
                    },
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onDblClick: __functions__.zTreeOnDblClick
                        //beforeDrag: beforeDrag,
                        //beforeEditName: beforeEditName,
                        //beforeRemove: beforeRemove,
                        //beforeRename: beforeRename,
                        //onRemove: onRemove,
                        //onRename: onRename
                    }
                };
                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, json.treeNodes);
            });
        }
    }


    var __functions__ = {
        addNode: function(object){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            if (treeNode) {
                treeNode = zTree.addNodes(treeNode, {id:object.nId, pId:treeNode.id,  name: object.name, id_id: object.id, desc: object.desc});
            }
        },
        updateNode: function(object){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                nodes = zTree.getSelectedNodes(),
                treeNode = nodes[0];
            treeNode.name = object.name;
            treeNode.desc = object.desc;
        },
        zTreeOnDblClick: function(event, treeId, treeNode){
            var id_id = treeNode.id_id;
            $(".id_id").val(id_id);
            //var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            //zTree.editName(treeNode);
        },
        selectAll: function(flag){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll =  true;
        },
        getAllChildrenNodes : function(treeNode){
            var nodes = array();
            var childrenNodes = treeNode.children;
            if (childrenNodes) {
                for (var i = 0; i < childrenNodes.length; i++) {
                    nodes.push(childrenNodes)
                }
            }
            return nodes;
        },
        getAllChildrenNodeIds : function(treeNode){
            var ids = array();
            var childrenNodes = treeNode.children;
            if (childrenNodes) {
                for (var i = 0; i < childrenNodes.length; i++) {
                    ids.push(childrenNodes[i].id)
                }
            }
            return ids;
        }


    }

    $(document).ready(function(){
    	console.info('welcome');
        tree.init();


    });
})();
