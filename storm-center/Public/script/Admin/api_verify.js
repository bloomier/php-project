(function(){
    var apiTable;
    var apiDialog;
    var zTree;
    var parsley;
    var filterParam=[];

    $(document).ready(function(){
        parsley=$("#apiForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });

    var __init__={
        initView:function(){
            apiTable=$("#apiTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Admin/ApiVerify/listApi',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": ''},
                    {"mDataProp": 'key'},
                    {"mDataProp": 'province'},
                    {"mDataProp": 'hour_count'},
                    {"mDataProp": 'title'},
                    {"sDefaultContent": ''}

                ],
                // "iDisplayLength" : 25, //每页默认显示多少条记录 10,25,50,100

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['key']+"'>");



                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    editBtn.bind("click",function(){
                        __functions__.viewEdit(aData['key']);
                    });
                    deleteBtn.bind("click",function(){
                        __functions__._delete(aData["key"]);
                    });

                    $('td:eq(5)', nRow).append(editBtn).append(deleteBtn);


                },

                "fnServerParams":function(aoData){//查询条件
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
            //初始化树
            $.post(__ROOT__+"/Admin/ApiVerify/listAllApiGroup").success(function(json){

                zTree= $.fn.zTree.init($("#ztree"), setting,json);

            });

            //添加/修改APIdialog

            apiDialog=new BootstrapDialog({
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
                                    //storm.alert(nodes);
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
            $(".btn-add-api").bind("click",function(){
                var form=$("#apiForm");
                form.resetForm();
                $("#key_id").val("");
                apiDialog.setTitle("<h3>添加角色</h3>");
                __functions__.resetTree();

                apiDialog.open();
            });
            $(".bth-batch-delete").bind("click",function(){
                var keys=storm.getTableSelectedIds($("#apiTable"));
                if(keys == ''){
                    storm.alert("请选择待删除记录");
                    return ;
                }
                __functions__._delete(keys);
            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                apiTable.fnDraw(false);


            });
        }
    };
    var __functions__={
        _delete:function(keys){
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__+"/Admin/ApiVerify/delete",{keys:keys}).success(function(json){
                    if(json.code>0){
                        storm.alert(json.msg);
                        apiTable.fnDraw(false);
                    }else{
                        storm.alert(json.msg);
                    }
                });
            });

        },
        viewEdit:function(key){
            var form=$("#apiForm");
            $.post(__ROOT__+"/Admin/ApiVerify/getApiByKey",{key:key}).success(function(json){
                parsley.reset();
                apiDialog.setTitle("<h3>修改角色</h3>");
                form.resetForm();
                __functions__.resetTree();
                if(json.province != ''){
                    $(".prov-location").val(json.province);
                }
                apiDialog.open();
                storm.initForm(form,json);
                if(json.rules){
                    setTimeout(function(){
                        __functions__.setTreeSelected(json.rules.split(","));
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
            return ids.join(",");
        },
        resetTree:function(){
           zTree.checkAllNodes(false);
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
        },

        submit:function(rules,callback){
            var title= $.trim($("[name='title']",$("#apiForm")).val());
            var key=$("[name='key']",$("#apiForm")).val();
            var province = $.trim($("[name='province']",$("#apiForm")).val());
            var hour_count = $.trim($("[name='hour_count']",$("#apiForm")).val());
            $.post(__ROOT__+"/Admin/ApiVerify/addOrUpdateApi",{title:title,key:key,province:province,hour_count:hour_count,rules:rules}).success(function(json){
                if(json.code>0){
                    storm.showMsg(json.msg);
                    apiTable.fnDraw(false);
                }else{
                    storm.alert(json.msg);
                }
                callback&&callback.call(this,json.code>0);
            });

        }

    }
})();