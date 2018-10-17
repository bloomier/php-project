/**
 * Created by jianghaifeng on 2016/2/18.
 */
(function(){
    var role_mapper={};
    var o={
        init:function(){
            this.parsley = $("#userForm").parsley();
            o.view();
            o.handler();
        },
        reloadTableData: function(){
            var w = this;
            $.post(__ROOT__+"/Admin/User/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
        },
        view:function(){
            var w=this;

            //角色加载
            $.post(__ROOT__+"/Admin/Role/listAll").success(function(json){
                var select=$("#select_role");
                select.html("");
               json.forEach(function(role){
                   role_mapper[role._id]=role;
                   var option=$("<option value='"+role._id+"'>"+role.name+"</option>");
                   select.append(option);
               });

            });

            w.table=$("#user_table").DataTable($.extend(_dataTable_setting._static(),{
                //ajax:{
                //    url: __ROOT__+"/Admin/User/listAll",
                //    type:"post",
                //    dataSrc:"items",
                //    data: function ( d ) {
                //        var wraper=$(".location-wraper");
                //        d.param = $.trim($('#extra').val());
                //
                //    }
                //},
                //stateSave: true,
                columns: [
                    {data: 'username',width:"15%" },
                    {data: 'name',width:"15%"},
                    {data: 'roles',visible:false},
                    {data: 'role_name',width:"10%"},
                    {data: 'email',width:"15%"},
                    {data: 'phone',width:"10%"},
                    {data: ''}
                ],
                columnDefs:[
                    {orderable:false,targets:[3,4,5]}
                ],
                rowCallback:function( row, data, index ){

                    var roleText="";
                    if(data['_id']!=1){

                        var roleText="";
                        data.roles.forEach(function(role){
                            if(role_mapper[role]){
                                roleText+=role_mapper[role]['name']+",";
                            }

                        });
                        roleText=roleText.substr(roleText,roleText.length-1);
                    }else{
                        roleText="超级管理员";
                    }
                    $("td:eq(2)",row).html(roleText);
                    var data=w.table.row(row).data();
                    data['role_name']=roleText;
                    w.table.row(row).data(data);
                    if(data['_id'] != 1){
                        //var editBtn=$('<a class="btn-edit green-label" style="margin-left: 5px;" href="javascript:void(0)">修改</a>');
                        //var deleteBtn=$('<a class="btn-delete red-label" style="margin-left: 5px;" href="javascript:void(0)">删除</a>');
                        //var restPassword=$('<a class="btn-reserpwd yellow-label" style="margin-left: 5px;" href="javascript:void(0)">重置密码</a>');
                        var editBtn      = $('<a class="btn-edit" href="javascript:void(0)" title="修改"><i class="fa fa-pencil"></i></a>');
                        var deleteBtn    = $('<a class="btn-delete" href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                        var restPassword = $('<a class="btn-reserpwd" href="javascript:void(0)" title="重置密码"><i class="fa fa-cog"></i></a>');
                        $("td:eq(5)",row).addClass('text-center').html("").append(editBtn).append(deleteBtn).append(restPassword);

                        if(data['isLock'] == 1){
                            var unlockBtn = $('<a class="btn-unlock" href="javascript:void(0)" title="解锁"><i class="fa fa-lock"></i></a>');
                            $("td:eq(5)",row).append(unlockBtn);
                        }
                    }


                },
                initComplete:function(){
                    //var addBtn=$('<a class="btn-add btn  " href="javascript:void(0)">添加</a>');
                    var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-default" ><i class="fa fa-plus"></i> 添加用户</a>');
                    $(".datatable-btn-warper").html(addBtn);
                }
            }));


            o.reloadTableData();
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
                                storm.before_dialog_submit(dialogItself);
                                var param=storm.form.serialize($("#userForm"));
                                $.post(__WEBROOT__ + "/Admin/User/addOrUpdate", param).success(function(json){
                                   storm.dialog_submit(dialogItself, w.table,json);
                                    if(json.code>0&&json.randPwd){
                                        storm.alert("添加用户成功,该用户的初始密码:"+json.randPwd);
                                    }

                                });

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
                storm.form.reset($("#userForm"));
                $("input[name='username']", $("#userForm")).attr("disabled", false);
                w.dialog.setTitle("<h3>添加用户</h3>");
                w.dialog.setData("row", null);
                w.dialog.open();
            });
            $(".btn-edit").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                var form = $("#userForm");
                storm.form.init(form,row.data());
                $("input[name='username']", $("#userForm")).attr("disabled", true);

                w.dialog.setTitle("<h3>修改用户</h3>");
                w.dialog.setData("row", row);
                w.dialog.open();
            });
            $(".btn-delete").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要删除吗?",function(){
                    $.post(__ROOT__+"/Admin/User/delete",{_id:_id}).success(function(json){
                        if(json.code){
                            row.remove().draw(false);
                        }
                        storm.showMsg(json.msg,json.code);
                    });
                });

            });
            $(".btn-reserpwd").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要重置密码吗?",function(){
                    $.post(__ROOT__+"/Admin/User/resetPwd",{_id:_id}).success(function(json){
                        storm.alert(json.msg);
                    });
                });

            });

            $(".btn-unlock").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                var _id=row.data()['_id'];
                $.post(__ROOT__+"/Admin/User/lockUser",{_id:_id,isLock:0}).success(function(json){
                    o.reloadTableData();
                    storm.alertMsg(json['msg'],"success");
                });
            });

        }
    };

    $(document).ready(function(){
        o.init();
    });

})();
