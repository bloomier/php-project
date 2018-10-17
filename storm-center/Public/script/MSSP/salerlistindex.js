/**
 *@name
 *@author Sean.xiang
 *@date 2015/9/18
 *@example
 */

(function(){
    var salerListTable;
    var filterParam=[];

    $(document).ready(function(){
        __init__.initView();
        __init__.addHandler();
    });

    var __init__={
        initView:function(){
           salerListTable=$("#policy-group-table").dataTable($.extend(storm.defaultGridSetting(),{
                //'bStateSave': true,
                "sAjaxSource": __ROOT__+'/MSSP/Saler/query',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'name'},
                    {"mDataProp": 'desc'},
                    {"mDataProp": 'phone'},
                    {"mDataProp": 'email'},
                    {"mDataProp": 'state'},
                    {"sDefaultContent": ''}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                    var astate=aData['state']==0?'无效':'有效';
                    $('td:eq(5)',nRow).html(astate);
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/MSSP/Saler/toUpdate?id=" + aData["id"];
                        location.href = path;
                    });
                    var deleteBtn = $('<a class="btn yellow-stripe mini policy-enable-update" href="#">删除</a>');
                    deleteBtn.bind("click",function(){
                        $.post(__ROOT__ + "/MSSP/Saler/beatchDelete", {"ids":aData["id"]}).success(function(json){
                            Message.init({
                                text: json.msg,
                                type: 'success' //info success warning danger
                            });
                            salerListTable.fnDraw(false);
                        });
                    });

                    if(aData['state'] != 0){
                        $('td:eq(6)', nRow).append(editBtn).append(deleteBtn);
                    }else{
                        $('td:eq(0)', nRow).html("");
                        $('td:eq(6)', nRow).append(editBtn);
                    }
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
        },
        addHandler:function(){
            // 查询事件
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                var state=$("#task-state").val();
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"name",value:param});
                }
                if(state){
                    filterParam.push({name:"state",value:state});
                }else{
                    filterParam.push({name:"state",value:0});
                }
                salerListTable.fnPageChange(0);
                salerListTable.fnDraw();
            });


            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#policy-group-table"));
                console.info(ids);
                __function__.beathDelete(ids);
            });


            var __function__ = {
                beathDelete : function(ids){
                    $.post(__ROOT__ + "/MSSP/Saler/beatchDelete", {"ids":ids}).success(function(json){
                        Message.init({
                            text: json.msg,
                            type: 'success' //info success warning danger
                        });
                        salerListTable.fnDraw(false);
                    });
                }
            }

            // 绑定添加事件
            $(".btn-add-policy-group").bind("click", function(){
                var path = __ROOT__ + "/MSSP/Saler/add";
                location.href = path;
            });


        }
    };
})();


