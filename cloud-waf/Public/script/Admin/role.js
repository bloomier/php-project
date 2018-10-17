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
                },json);
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
                    if(data['name'] != '系统管理员'){
                        var editBtn = $('<a class="btn-edit" href="javascript:void(0)" title="修改"><i class="fa fa-pencil"></i></a>');
                        // var editBtn=$('<a class="btn-edit green-label" style="margin-left:15px;" href="javascript:void(0)">修改</a>');
                        // var deleteBtn=$('<a class="btn-delete red-label" style="margin-left:10px;" href="javascript:void(0)">删除</a>');
                        var deleteBtn = $('<a class="btn-delete" href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                        $("td:eq(1)",row).addClass('text-center').html("").append(editBtn).append(deleteBtn);
                    }
                },
                initComplete:function(){
                    //var addBtn=$('<a class="btn-add btn  " href="javascript:void(0)">添加</a>');
                    var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-default" ><i class="fa fa-plus"></i> 添加角色</a>');
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
            $(".btn-add").live("click",function(){
                storm.form.reset($("#roleForm"));
                __functions__.resetTree.call(w);
                w.dialog.setTitle("<h3>添加角色</h3>");
                w.dialog.setData("row", null);
                w.dialog.open();
            });
            $(".btn-edit").live("click",function(){

                var row= w.table.row($(this).closest("tr"));
                var form = $("#roleForm");
                storm.form.init(form,row.data());
                var nodes=row.data()['rules'];
                __functions__.setTreeSelected.call(w,nodes);
                w.dialog.setTitle("<h3>修改角色</h3>");
                w.dialog.setData("row", row);
                w.dialog.open();

            });
            $(".btn-delete").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要删除吗?",function(){
                    $.post(__ROOT__+"/Admin/Role/delete",{_id:_id}).success(function(json){
                        if(json.code){
                            row.remove().draw(false);
                        }
                        storm.showMsg(json.msg,json.code);
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
