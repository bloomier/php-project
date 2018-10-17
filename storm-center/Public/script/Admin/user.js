(function(){
    var userTable;
    var userDialog;
    var parsley;
    var filterParam=[];
    $(document).ready(function(){
        parsley=$("#userForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });
    var __init__={
        
        initView:function(){
            userTable=$("#userTable").dataTable($.extend(storm.defaultGridSetting(),{
                'bStateSave': true,
                "sAjaxSource": __ROOT__+'/Admin/User/listUser',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'username'},
                    {"mDataProp": 'name'},
                    {"mDataProp": 'email'},
                    {"mDataProp": 'role_name'},
                    {"mDataProp": 'is_follow'},
                    {"mDataProp": 'expired_date'},
                    {"sDefaultContent": ''}

                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[5],"mRender":function(value,type,aData){
                        if(value==1){
                            return "是";
                        } else {
                            return "否";
                        }
                    }},
                    {"aTargets":[6],"mRender":function(value,type,aData){
                        if(value && value.indexOf("00") != 0){
                            return value.substr(0,10);
                        } else {
                            return "";
                        }
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                    if(aData['id']==1){
                        $('td:eq(0)', nRow).html("");
                        $('td:eq(4)', nRow).html("root");
                    }else{
                        $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                        var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                        var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                        var unLockBtn=$('<a class="btn green-stripe mini" href="#">解锁</a>');
                        var lockBtn=$('<a class="btn yellow-stripe mini" href="#">锁定</a>');
                        editBtn.bind("click",function(){
                            __functions__.viewEdit(aData['id']);
                        });
                        deleteBtn.bind("click",function(){
                            __functions__._delete(aData["id"]);
                        });
                        unLockBtn.bind("click",function(){
                            __functions__.unLock(aData["id"]);
                        });
                        lockBtn.bind("click",function(){
                            __functions__.lock(aData["id"]);
                        });
                        $('td:eq(7)', nRow).append(editBtn).append(deleteBtn);
                        if(aData['is_lock'] == 1){
                            $('td:eq(7)', nRow).append(unLockBtn);
                        } else {
                            $('td:eq(7)', nRow).append(lockBtn);
                        }
                    }

                },

                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
            //初始化 角色列表
            $.post(__ROOT__+"/Admin/Role/listAllRole").success(function(json){
                var select=$("[name='role_id']",$(".user-dialog-content"));
                select.html("").append("<option value=''>请选择用户角色</option>");
                $.each(json,function(i,role){
                    select.append("<option value='"+role.id+"'>"+role.name+"</option>");
                });
            });
            //区域select初始化
            $(".citys",$(".user-dialog-content")).citySelect({nodata:"none",required:false});

           //console.info(parsley);
            userDialog=new BootstrapDialog({
                title: '<h3>添加用户</h3>',
                type:BootstrapDialog.TYPE_DEFAULT,
                autodestroy:false,
                message: function(){
                    return $(".user-dialog-content").show();
                },
                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){

                            parsley.validate();

                            if(parsley.isValid()){
                                var password=$("#tmppassword").val();
                                if(password==''){
                                    $("[name='password']",$("#userForm")).val("");

                                }else{

                                    $("[name='password']",$("#userForm")).val($.md5(password));

                                }
                                var expired_date = $("[name='expired_date']",$("#userForm")).val();

                                if(expired_date == "0000-00-00" || expired_date == ""){
                                    $("[name='expired_date']",$("#userForm")).val("");
                                }

                                //__functions__.submit(dialogItself);
                                dialogItself.enableButtons(false);
                                dialogItself.setClosable(false);
                                __functions__.submit(function(isSuccess){
                                    //$(".icon-spin").remove();
                                    dialogItself.enableButtons(true);
                                    dialogItself.setClosable(true);
                                    if(isSuccess){
                                        dialogItself.close();

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

//            userDialog.close();


        },
        addHandler:function(){
            $(".btn-add-user").bind("click",function(){
                var form=$("#userForm");
                form.resetForm();
                $("#userId").val("");
                $("[name='username']",form).removeAttr("readOnly");
                parsley.reset();
                userDialog.setTitle("<h3>添加用户</h3>");
                var p=$("input[type='password']",form);
                p.attr("required",true);
                userDialog.open();
            });

            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#userTable"));
                __functions__._delete(ids);
            });

            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);

                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                userTable.fnDraw(true);


            });
        }

    };
    var __functions__={
      _delete:function(ids){

          storm.confirm("确定要删除吗?",function(){
              $.post(__ROOT__+"/Admin/User/delete",{ids:ids}).success(function(json){
                  if(json.code>0){
                      storm.showMsg(json.msg);
                      userTable.fnDraw(false);
                  }else{
                      storm.alert(json.msg);
                  }

              });
            });

      },
      unLock:function(ids){
          storm.confirm("确定要解锁吗?",function(){
              $.post(__ROOT__+"/Admin/User/unLock",{ids:ids}).success(function(json){
                  if(json.code>0){
                      storm.showMsg(json.msg);
                      userTable.fnDraw(false);
                  }else{
                      storm.alert(json.msg);

                  }

              });
          });
      },
      lock:function(ids){
            storm.confirm("确定要锁定用户吗?",function(){
                $.post(__ROOT__+"/Admin/User/lock",{ids:ids}).success(function(json){
                    if(json.code>0){
                        storm.showMsg(json.msg);
                        userTable.fnDraw(false);
                    }else{
                        storm.alert(json.msg);

                    }

                });
            });
      },
      viewEdit:function(id){
          var form=$("#userForm");
          $.post(__ROOT__+"/Admin/User/getUserById",{id:id}).success(function(json){
              parsley.reset();
              userDialog.setTitle("<h3>修改用户</h3>");
              form.resetForm();
              $("[name='username']",form).attr("readOnly",true);

              storm.initForm(form,json);
              var p=$("input[type='password']",form);
              p.attr("required",false);
              var expired_date = "";
              if(json.expired_date){
                  expired_date = json.expired_date.substr(0,10);
              }
              $("[name='expired_date']",form).val(expired_date);
              var password = "";
              if(json.password){
                  password = json.password;
              }
              $("[name='tmppassword']",form).val(password);
              $("[name='repassword']",form).val(password);

              $(".citys",form).citySelect({prov:json.province,city:json.city});

              $("[name='is_follow']",form).select2({'val':json.is_follow});
              $("[name='role_id']",form).select2({'val':json.role_id});

              userDialog.open();

          });

      },
      submit:function(callback){
          var form=$("#userForm");
          $(form).ajaxSubmit({
              "type":"POST",
              "dataType":"json",
              "success":function(json){
                  if(json.code>0){
                      storm.showMsg(json.msg);
                      userTable.fnDraw(false);
                  }else{
                      storm.alert(json.msg);
                  }
                  callback&&callback.call(this,json.code>0);
              }
          });
      }

    };
})();