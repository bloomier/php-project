/**
 * Created by jianghaifeng on 2016/3/15.
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
        },
        initView: function(){
            var w = this;
            w.dialog = new BootstrapDialog({
                title: '<h3 style="color: #fff;">选择IP组</h3>',
                //type: BootstrapDialog.TYPE_DEFAULT,
                type: BootstrapDialog.TYPE_INFO,
                //type:  BootstrapDialog.TYPE_SUCCESS,
                //size: BootstrapDialog.SIZE_LARGE,
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
                            //if(w.parsley.isValid()){


                                //var param=storm.form.serialize($("#roleForm"));
                                //var nodes=__functions__.getTreeSelectedIds.call(w);
                                //if(nodes==''){
                                //    storm.showMsg("至少选择一个模块",0);
                                //}else{
                                //    storm.before_dialog_submit(dialogItself);
                                //    param=param+"&rules="+nodes;
                                //    $.post(__WEBROOT__ + "/Admin/Role/addOrUpdate", param).success(function(json){
                                //        storm.dialog_submit(dialogItself, w.table,json);
                                //
                                //    });
                                //}
                            //}

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
            // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
            var setting = {
                check:{
                    enable: true, //显示复选框
                    //autoCheckTrigger: false,
                    //chkboxType:{"Y":"ps","N":"ps"},
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
            // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
            var zNodes = [
                {id: 0, pId: -1,name:"ROOT", open:true, children:[
                    {id: 1, pId: 0,name:"DNS", open:true, children:[
                        {id: 11, pId: 1, name:"DNS协议",children:[{name:"DNS协议1"},{name:"DNS协议2"}],icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/3.png"},
                        {id: 12, pId: 1,name:"mDNS协议",icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/2.png"}
                    ]
                    },
                    {id: 2, pId: 0,name:"CCTV", open:true, children:[
                        {id: 21, pId: 2,name:"CCTV-1",icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/4.png"},
                        {id: 22, pId: 2,name:"CCTV-2",icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/5.png"}
                    ]},
                    {id: 3, pId: 0,name:"体育", open:true, children:[
                        {id: 31, pId: 3,name:"NBA",icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/6.png"},
                        {id: 32, pId: 3,name:"CBA",icon: __PUBLIC__ + "/asset/js/plugins/zTree_v3/css/zTreeStyle/img/diy/7.png"}
                    ]}
                ]}
            ];
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);


            $(".btn-delete").bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    //alert("请先选择一个节点");
                    storm.alertMsg("请先选择一个节点");
                    return;
                }
                zTree.removeNode(treeNode);
            });

            $(".btn-add").bind("click", function(){
                var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                    nodes = zTree.getSelectedNodes(),
                    treeNode = nodes[0];
                if (nodes.length == 0) {
                    storm.alertMsg("请先选择一个节点");
                    return;
                }
                if (treeNode) {
                    treeNode = zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id,  name:"new node" + (newCount++)});
                }
                //else {
                //    //treeNode = zTree.addNodes(null, {id:(100 + newCount), pId:0, name:"new node" + (newCount++)});
                //}
                if (treeNode) {
                    zTree.editName(treeNode[0]);
                } else {
                    storm.alertMsg("叶子节点被锁定，无法增加子节点");
                }
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
        }

    };


    function selectAll() {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.setting.edit.editNameSelectAll =  $("#selectAll").attr("checked");
    }


    var __functions__ = {
        zTreeOnDblClick: function(event, treeId, treeNode){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.editName(treeNode);
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
        tree.init();


    });
})();
