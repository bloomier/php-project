(function(){
    var roleTable;
    var roleDialog;
    var zTree,optTree;
    var parsley;
    var filterParam=[];

    $(document).ready(function(){
        parsley=$("#roleForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });

    var __init__={
        initView:function(){
            roleTable=$("#roleTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Admin/Role/listRole',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'name'},

                    {"sDefaultContent": ''}

                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");

                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");



                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    editBtn.bind("click",function(){
                        __functions__.viewEdit(aData['id']);
                    });
                    deleteBtn.bind("click",function(){
                        __functions__._delete(aData["id"]);
                    });

                    $('td:eq(2)', nRow).append(editBtn).append(deleteBtn);


                },

                "fnServerParams":function(aoData){//查询条件
                    //$.merge(aoData,filterParam);
                    $.merge(aoData,filterParam);

                }
            }));

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

            $.post(__ROOT__+"/Admin/Role/listAllRoleGroup").success(function(json){
                optTree= $.fn.zTree.init($("#optZtree"), setting, json.opts);

               // var treeObj = $.fn.zTree.getZTreeObj("ztree");
                var mNodes=[];
                var _id=-1;
                $.each(json.moudels,function(k,pms){
                    var rootNode={title:k,id:_id,children:[],nocheck:true};
                    mNodes.push(rootNode);
                    $.each(pms,function(i,pm){
                        rootNode.children.push(pm);
                    });

                    _id--;


                });
                zTree= $.fn.zTree.init($("#ztree"), setting,mNodes);

                //初始化group权限列表

            });

            //添加/修改角色dialog

            roleDialog=new BootstrapDialog({
                title: '<h3>添加角色</h3>',
                type:BootstrapDialog.TYPE_DEFAULT,
                autodestroy:false,
                message: function(){
                    return $(".rolw-dialog-content").show();
                },

                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){

                            parsley.validate();

                            if(parsley.isValid()){
                                var nodes=__functions__.getTreeSelectedIds();
                                if(nodes==''){
                                    storm.alert("至少选择一个模块");
                                }else{
                                    dialogItself.enableButtons(false);
                                    dialogItself.setClosable(false);
                                    __functions__.submit(nodes,function(isSuccess){
                                        dialogItself.enableButtons(true);
                                        dialogItself.setClosable(true);
                                        if(isSuccess){
                                            dialogItself.close();
                                        }
                                    });
                                }

                            }
                            //  dialogItself.close();
                        }
                    },

                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]


            });



        },
        addHandler:function(){
            $(".btn-add-role").bind("click",function(){
                var form=$("#roleForm");
                form.resetForm();
                $("#roleId").val("");
                roleDialog.setTitle("<h3>添加角色</h3>");
                __functions__.resetTree();

                roleDialog.open();
            });
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#roleTable"));
                __functions__._delete(ids);
            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                roleTable.fnPageChange(0);
                //roleTable.fnDraw(false);


            });
        }
    };
    var __functions__={
        _delete:function(ids){
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__+"/Admin/Role/delete",{ids:ids}).success(function(json){
                    if(json.code>0){
                        storm.alert(json.msg);
                        roleTable.fnDraw(false);
                    }else{
                        storm.alert(json.msg);

                    }

                });
            });

        },
        viewEdit:function(id){
            var form=$("#roleForm");

            $.post(__ROOT__+"/Admin/Role/getRoleById",{id:id}).success(function(json){
                parsley.reset();
                roleDialog.setTitle("<h3>修改角色</h3>");
                form.resetForm();
                __functions__.resetTree();
                roleDialog.open();

                storm.initForm(form,json);
                if(json.groups){
                    setTimeout(function(){
                        __functions__.setTreeSelected(json.groups.split(","));

                    },500);
                }

            });

        },
        getTreeSelectedIds:function(){
            var ids=[];
            $.each(zTree.getCheckedNodes(),function(i,node){
                if(node.id>0){
                    ids.push(node.id);

                }
            });
            $.each(optTree.getCheckedNodes(),function(i,node){
                ids.push(node.id);
            });
            return ids.join(",");
        },
        resetTree:function(){
           zTree.checkAllNodes(false);
           optTree.checkAllNodes(false);
        },
        setTreeSelected:function(ids){
            zTree.checkAllNodes(true);
            var nodes=zTree.getCheckedNodes();
            $.each(nodes,function(i,node){
               var nodeId=node.id;
                if($.inArray(nodeId,ids)==-1){
                    zTree.checkNode(node,false);
                }
            });
            optTree.checkAllNodes(true);
            var optNodes=optTree.getCheckedNodes();
            $.each(optNodes,function(i,node){
                var nodeId=node.id;
                if($.inArray(nodeId,ids)==-1){
                    optTree.checkNode(node,false);
                }
            });





        },

        submit:function(groups,callback){
            var name= $.trim($("[name='name']",$("#roleForm")).val());
            var id=$("[name='id']",$("#roleForm")).val();
            $.post(__ROOT__+"/Admin/Role/addOrUpdateRole",{name:name,id:id,groups:groups}).success(function(json){
                if(json.code>0){
                    storm.alert(json.msg);

                    roleTable.fnDraw(false);
                }else{
                    storm.alert(json.msg);
                }
                callback&&callback.call(this,json.code>0);
            });

        }

    }
})();