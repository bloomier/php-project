/**
 * Created by jianghaifeng on 2016/2/18.
 */
(function(){
    var o={
        init:function(){
            this.parsley = $("#roleForm").parsley();
            o.view();
            o.handler();
        },
        view:function(){
            var w=this;

            //加载权限树
            $.post(__ROOT__+"/Admin/Role/listActions").success(function(json){
                var arr=[];
                $.each(json,function(i,row){
                    delete row['icon'];
                    arr.push(row);
                });

                w.zTree= $.fn.zTree.init($("#ztree"), {

                    check:{
                        enable:true
                    },
                    data:{
                        key:{
                            name:"title"
                        },
                        simpleData:{
                            enable:true,
                            idKey:"_id",
                            pIdKey:"pid"
                        }
                    }
                },arr);
            });

            w.table=$("#role_table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'name' },
                    { data: ''}
                ],
                columnDefs:[
                    {orderable:false,targets:[1]}
                ],
                rowCallback:function( row, data, index ){

                    var editBtn=$('<a class="btn-edit btn btn-xs  btn-info " href="javascript:void(0)"><i class="fa fa-pencil"></i>&nbsp;修改</a>');
                    var deleteBtn=$('<a class="btn-delete btn btn-xs btn-danger mg-l-5 " href="javascript:void(0)"><i class="fa fa-trash"></i>&nbsp;删除</a>');

                    $("td:eq(1)",row).addClass('text-center').html("").append(editBtn).append(deleteBtn);

                },
                initComplete:function(){
                    var addBtn=$('<a class="btn-add btn btn-sm  btn-primary  " href="javascript:void(0)"><i class="fa fa-plus"></i>&nbsp;添加</a>');
                    $(".datatable-btn-warper").html(addBtn);
                }
            }));
            $.post(__ROOT__+"/Admin/Role/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
            w.dialog=new BootstrapDialog({
                title: '<h3>角色</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
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
                            w.parsley.validate();
                            if(w.parsley.isValid()){


                                var param=storm.form.serialize($("#roleForm"));
                                var nodes=__functions__.getTreeSelectedIds.call(w);
                                if(nodes==''){
                                    storm.showMsg("至少选择一个模块",0);
                                }else{
                                    storm.before_dialog_submit(dialogItself);
                                    param=param+"&rules="+nodes;
                                    $.post(__WEBROOT__ + "/Admin/Role/addOrUpdate", param).success(function(json){
                                        storm.dialog_submit(dialogItself, w.table,json);

                                    });
                                }
                            }

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
        handler:function(){
            var w=this;
            $("body").on("click",'.btn-add',function(){
                storm.form.reset($("#roleForm"));
                __functions__.resetTree.call(w);
                w.dialog.setTitle("<h3>添加角色</h3>");
                w.dialog.setData("row", null);
                w.dialog.open();
            });
            $("#role_table").on("click",'.btn-edit',function(){

                var row= w.table.row($(this).closest("tr"));
                var form = $("#roleForm");
                storm.form.init(form,row.data());
                var nodes=row.data()['rules'];
                __functions__.setTreeSelected.call(w,nodes);
                w.dialog.setTitle("<h3>修改角色</h3>");
                w.dialog.setData("row", row);
                w.dialog.open();

            });
            $("#role_table").on("click",'.btn-delete',function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要删除吗?",function(){
                    $.post(__ROOT__+"/Admin/Role/delete",{_id:_id}).success(function(json){
                        if(json.code){
                            row.remove().draw();
                        }
                        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
                    });
                });


            });
        }
    };
    var __functions__={
        getTreeSelectedIds:function(){
            var w=this;
            var ids=[];
            $.each(w.zTree.getCheckedNodes(),function(i,node){
                if(node._id>0){
                    ids.push(node._id);

                }
            });

            return ids.join(",");
        },
        resetTree:function(){
            var w=this;
            w.zTree.checkAllNodes(false);
        },
        setTreeSelected:function(ids){
            var w=this;
            w.zTree.checkAllNodes(true);
            var nodes= w.zTree.getCheckedNodes();
            $.each(nodes,function(i,node){
                var nodeId=node._id;

                if($.inArray(nodeId,ids)==-1){
                    w.zTree.checkNode(node,false);
                }
            });

        }
    }
    $(document).ready(function(){
        o.init();
    });

})();
