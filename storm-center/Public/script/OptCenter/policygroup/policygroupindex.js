/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var policyGroupTable;

    var filterParam=[];

    $(document).ready(function(){
        __init__.initView();
        __init__.addHandler();
    });

    var __init__={
        initView:function(){
            policyGroupTable=$("#policy-group-table").dataTable($.extend(storm.defaultGridSetting(),{
                //'bStateSave': true,
                "sAjaxSource": __ROOT__+'/OptCenter/PolicyGroup/query',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'name'},
                    {"mDataProp": 'remark'},
                    {"mDataProp": 'enable'},
                    {"mDataProp": 'last_update_time'},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[2],"mRender":function(value,type,aData){
                        return value ? '有效':'无效';
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/OptCenter/PolicyGroup/policyGroupDetail?id=" + aData["id"];
                        location.href = path;
                    });
                    var type = aData['enable'] ? '启用':'禁用';
                    var enableBtn = $('<a class="btn yellow-stripe mini policy-enable-update" href="#">' + type + '</a>');
                    enableBtn.data("enable",aData['enable']);
                    enableBtn.data("policy-group-id",aData['id']);

                    $('td:eq(4)', nRow).append(editBtn).append(enableBtn);
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
                filterParam=[];
                var level = $("#policy-group-enable").val();
                if(param!=''){
                    filterParam.push({name:"name",value:param});
                }
                if(level > -1){
                    filterParam.push({name:"enable",value:level});
                }
                policyGroupTable.fnPageChange(0);
                policyGroupTable.fnDraw();
            });

            $('.policy-enable-update').live('click', function(){
                var type=$(this).data("enable");
                var id = $(this).data("policy-group-id");
                var nextType=(type==1 ? 0 : 1);
                $.post(__ROOT__ + "/OptCenter/PolicyGroup/update",{'id':id,'enable':nextType}).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                    policyGroupTable.fnDraw(false);
                });
            });

            // 绑定添加事件
            $(".btn-add-policy-group").bind("click", function(){
                var path = __ROOT__ + "/OptCenter/PolicyGroup/policyGroupToAdd";
                location.href = path;
            });


        }
    };
})();