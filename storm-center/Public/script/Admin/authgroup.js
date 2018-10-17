(function(){
    var roleTable;
    var roleDialog;
    var optTree;
    var parsley;
    var filterParam=[];

    var listGroup = [];
    var mTypeGroup = [{"id":1, "name":"公共模块"},{"id":2, "name":"大数据搜索平台"},{"id":3, "name":"安全事件"},{"id":4, "name":"自助报告"},{"id":8, "name":"MSSP"},{"id":6, "name":"云观测数据中心"},{"id":7, "name":"运营中心"}]

    $(document).ready(function(){
        parsley=$("#roleForm").parsley();

        $.post(__ROOT__+'/Admin/AuthGroup/listAllAuthGroup', null).success(function(json){
            listGroup = json.rows;
        });


        __init__.initView();
        __init__.addHandler();
    });

    var __init__={
        initView:function(){
            roleTable=$("#roleTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Admin/AuthGroup/listAuthGroup',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'title'},
                    {"sDefaultContent" : ''},
                    {"sDefaultContent" : ''},
                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                    $.each(listGroup, function(point, item){
                        if(aData['pid'] == item.id){
                            $('td:eq(2)', nRow).html(item.title);
                        }
                    });

                    $.each(mTypeGroup, function(point, item){
                        if(aData['m_type'] == item.id){
                            $('td:eq(3)', nRow).html(item.name);
                        }
                    });

                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    editBtn.bind("click",function(){
                        __functions__.viewEdit(aData['id']);
                    });
                    deleteBtn.bind("click",function(){
                        __functions__._delete(aData["id"]);
                    });
                    $('td:eq(4)', nRow).append(editBtn).append(deleteBtn);
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
            $.post(__ROOT__+"/Admin/AuthRule/listAllAuthRule").success(function(json){
                optTree= $.fn.zTree.init($("#optZtree"), setting, json.rows);
            });
            roleDialog=new BootstrapDialog({
                title: '<h3>添加模块</h3>',
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
                roleDialog.setTitle("<h3>添加模块</h3>");
                __functions__.resetSelect();
                $("#m_type_id").select2({"val":1});
                $("#m_type_id").trigger('change');
                $("#pid_id").select2({"val":0});
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
                roleTable.fnDraw(false);
            });

            $("#m_type_id").bind("change", function(){
                var pidSele = $("#pid_id");
                pidSele.html("");
                var value = $(this).val()
                pidSele.append($("<option value='0'>请选择</option>"));
                $.each(listGroup, function(point, item){
                    if(item.m_type == value){
                        pidSele.append($("<option value='" + item.id + "'>" + item.title + "</option>"));
                    }
                });
            });
        }
    };
    var __functions__={
        _delete:function(ids){
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__+"/Admin/AuthGroup/delete",{ids:ids}).success(function(json){
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
            $.post(__ROOT__+"/Admin/AuthGroup/getRoleById",{id:id}).success(function(json){
                //var item = json[0];
                parsley.reset();
                roleDialog.setTitle("<h3>修改模块</h3>");
                form.resetForm();
                __functions__.resetSelect();
                __functions__.resetTree();
                roleDialog.open();

                $("[name='id']",form).val(json[0].id);

                $("#m_type_id").select2({"val":2});
                $("#m_type_id").trigger('change');
                $("#pid_id").select2({"val":0});

                //$("#m_type_id").select2({"val":2});
                //$("#pid_id").select2({'val':json[0].pid});

                $("[name='name']",form).val(json[0].title);
                $("[name='page_action']",form).val(json[0].page_action);
                $("[name='seq']",form).val(json[0].seq);
                if(json[0].rules){
                    setTimeout(function(){
                        __functions__.setTreeSelected(json[0].rules.split(","));
                    },500);
                }
            });
        },
        getTreeSelectedIds:function(){
            var ids=[];
            $.each(optTree.getCheckedNodes(),function(i,node){
                ids.push(node.id);
            });
            return ids.join(",");
        },
        resetTree:function(){
           optTree.checkAllNodes(false);
        },
        resetSelect:function(){
            var pidSele = $("#pid_id");
            pidSele.append($("<option value='0'>请选择</option>"));
            var mTypeSele = $("#m_type_id");
            $.each(mTypeGroup, function(point, item){
                mTypeSele.append($("<option value='" + item.id + "'>" + item.name + "</option>"));
            });

        },
        setTreeSelected:function(ids){
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
            var id=$("[name='id']",$("#roleForm")).val();
            var pid=$("#pid_id").val();
            var mtype=$("#m_type_id").val();
            var name=$("[name='name']",$("#roleForm")).val();
            var action=$("[name='page_action']",$("#roleForm")).val();
            var seq = $("[name='seq']",$("#roleForm")).val();
            var rules = groups;
            var param = {}
            param['id'] = id;
            param['pid'] = pid;
            param['m_type'] = mtype;
            param['title'] = name;
            param['page_action'] = action;
            param['seq'] = seq;
            param['rules'] = rules;
            $.post(__ROOT__+"/Admin/AuthGroup/addOrUpdateRole",param).success(function(json){
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