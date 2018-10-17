(function(){
    var vulsTable;
    var userDialog;
    var parsley;
    var filterParam=[];
    $(document).ready(function(){
        parsley=$("#vulsForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });
    var __init__={
        initView:function(){
            vulsTable=$("#vulsTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Admin/VulsPolicy/showlist',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": ''},
                    {"mDataProp": 'vid'},
                    {"mDataProp": 'vname'},
                    {"mDataProp": 'level'},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['vid']+"'>");
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    editBtn.bind("click",function(){
                        __functions__.viewEdit(aData['vid']);
                    });
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    deleteBtn.bind("click",function(){
                        __functions__._delete(aData["vid"]);
                    });
                    $('td:eq(4)', nRow).append(editBtn).append(deleteBtn);

                },

                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
            //初始化 角色列表
            var select=$("[name='level']",$(".user-dialog-content"));
            select.html("").append("<option value=''>请选择漏洞策略级别</option>");
            select.append("<option value='high'>high</option>");
            select.append("<option value='mid'>mid</option>");
            select.append("<option value='low'>low</option>");
            select.append("<option value='info'>info</option>");
            // console.info(parsley);
            userDialog=new BootstrapDialog({
                title: '<h3>添加漏洞策略</h3>',
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
                                __functions__.submit(function(isSuccess){
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
        },
        addHandler:function(){
            $(".btn-add-user").bind("click",function(){
                var form=$("#vulsForm");
                form.resetForm();
                $("#id_id").val("");
                $("[name='vid']",form).removeAttr("readOnly");
                parsley.reset();
                userDialog.setTitle("<h3>添加漏洞策略</h3>");
                userDialog.open();
            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                filterParam.push({name:"currentpage",value:1});
                vulsTable._fnDraw(false);
            });
            $(".bth-batch-delete").bind("click",function(){
                var vids=storm.getTableSelectedIds($("#vulsTable"));
                __functions__._delete(vids);
            });
        }


    };
    var __functions__={
        //修改是显示页面
        viewEdit:function(id){
            $("#id_id").val("22222");
            var form=$("#vulsForm");
            $.post(__ROOT__+"/Admin/VulsPolicy/getOneByVid",{vid:id}).success(function(json){
                parsley.reset();
                userDialog.setTitle("<h3>修改漏洞策略</h3>");
                form.resetForm();
                $("[name='vid']",form).attr("readOnly",true);

                storm.initForm(form,json);
                userDialog.open();
            });
        },
        submit:function(callback){
            var form=$("#vulsForm");
            $(form).ajaxSubmit({
                "type":"POST",
                "dataType":"json",
                "success":function(json){
                    if(json.code>0){
                        storm.showMsg(json.msg);
                        filterParam.push({name:"currentpage",value:1});
                        vulsTable.fnDraw(false);
                    }else{
                        storm.alert(json.msg);
                    }
                    callback&&callback.call(this,json.code>0);
                }
            });
        },
        _delete:function(vids){
            if(vids == ''){
                storm.alert("请选择待删除记录");
                return ;
            }
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__+"/Admin/VulsPolicy/delete",{vids:vids}).success(function(json){
                    if(json.code>0){
                        storm.showMsg(json.msg);
                        filterParam.push({name:"currentpage",value:1});
                        vulsTable.fnDraw(false);
                    }else{
                        storm.alert(json.msg);
                    }
                });
            });
        }
    };

})();