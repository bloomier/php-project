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
            o.reloadTableData();
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
            w.viewConfig= $.parseJSON($("#viewConfig").text());
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
                columns: [
                    {data: 'username',width:"15%" },
                    {data: 'name',width:"15%"},
                    {data: 'roles',visible:false},
                    {data: 'role_name',width:"20%"},
                    {data: 'email',width:"15%"},
                    {data: 'phone',width:"10%"},
                    {data: ''}
                ],
                columnDefs:[
                    {orderable:false,targets:[3,4,5]}
                ],
                rowCallback:function( row, data, index ){
                    var roleText="";
                    if(data['_id'] != 1){
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
                        var editBtn=$('<a class="btn-edit btn btn-xs  btn-info " href="javascript:void(0)"><i class="fa fa-pencil"></i>&nbsp;修改</a>');
                        var deleteBtn=$('<a class="btn-delete btn btn-xs btn-danger mg-l-5" href="javascript:void(0)"><i class="fa fa-trash"></i>&nbsp;删除</a>');
                        var restPassword=$('<a class="btn-reserpwd btn  btn-xs  btn-success mg-l-5 " href="javascript:void(0)"><i class="fa fa-upload"></i>&nbsp;重置密码</a>');
                        $("td:eq(5)",row).addClass('text-center').html("").append(editBtn).append(deleteBtn).append(restPassword);
                    }

                    if(data['isLock'] == 1){
                        var unlockBtn = $('<a class="btn-unlock  btn  btn-xs  btn-primary mg-l-5" href="javascript:void(0)"><i class="fa fa-lock"></i>&nbsp;解锁</a>');
                        $("td:eq(5)",row).append(unlockBtn);
                    }


                },
                initComplete:function(){
                    var addBtn=$('<a class="btn-add btn btn-sm  btn-primary " href="javascript:void(0)"><i class="fa fa-plus"></i>&nbsp;添加</a>');
                    $(".datatable-btn-warper").html(addBtn);
                }
            }));
            //$.post(__ROOT__+"/Admin/User/listAll").success(function(json){
            //    w.table.clear();
            //    w.table.rows.add( json);
            //    w.table.draw();
            //});
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
                                storm.before_dialog_submit(dialogItself);
                                var param=storm.form.simpleSerialize($("#userForm"), true);
                                $.post(__WEBROOT__ + "/Admin/User/addOrUpdate", param).success(function(json){
                                   storm.dialog_submit(dialogItself, w.table,json);
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
            $("body").on("click",'.btn-add',function(){

                storm.form.reset($("#userForm"));
                $("input[name='username']", $("#userForm")).attr("disabled", false);
                w.dialog.setTitle("<h3>添加用户</h3>");
                w.dialog.setData("row", null);
                w.dialog.open();

            });

            $("#user_table").on("click",'.btn-edit',function(){

                var row= w.table.row($(this).closest("tr"));
                var form = $("#userForm");
                storm.form.reset($("#userForm"));
                storm.form.init(form,row.data());
                var data_config=row.data()['data_config']||{};
                $("input[name='username']", $("#userForm")).attr("disabled", true);
                w.dialog.setTitle("<h3>修改用户</h3>");
                w.dialog.setData("row", row);
                w.dialog.open();
            });

            $("#user_table").on("click",'.btn-delete',function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要删除吗?",function(){
                    $.post(__ROOT__+"/Admin/User/delete",{_id:_id}).success(function(json){
                        if(json.code){
                            row.remove().draw();
                        }
                        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
                    });
                });

            });

            $("#user_table").on("click",'.btn-reserpwd',function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                storm.confirm("确定要重置密码吗?",function(){
                    $.post(__ROOT__+"/Admin/User/resetPwd",{_id:_id}).success(function(json){
                        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
                    });
                });

            });


            //$(".btn-unlock").live("click",function(){
            $("#user_table").on("click",'.btn-unlock',function(){
                var row= w.table.row($(this).closest("tr"));
                var _id=row.data()['_id'];
                $.post(__ROOT__+"/Admin/User/lockUser",{_id:_id,isLock:0}).success(function(json){
                    o.reloadTableData();
                    //storm.alertMsg(json['msg'],"success");
                    swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
                });
            });
        }
    };

    $(document).ready(function(){
        o.init();
    });

})();
