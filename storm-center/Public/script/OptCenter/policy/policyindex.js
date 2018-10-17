/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var policyTable;

    var filterParam=[];

    $(document).ready(function(){
        __init__.initView();
        __init__.addHandler();
    });

    var __init__={
        initView:function(){
            policyTable=$("#policy-table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/Policy/query',//请求URL
                "aoColumns": [ //参数映射
                    //{"mDataProp": 'id'},
                    {"mDataProp": 'id'},
                    {"mDataProp": 'name'},
                    {"mDataProp": 'has_danger'},
                    {"mDataProp": 'level'},
                    {"mDataProp": 'desc'},
                    {"mDataProp": 'repair_advice'},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[2],"mRender":function(value,type,aData){
                        var level = "<span class='badge badge-info'>无危害</span>";
                        if(value){
                            level = "<span class='badge badge-important'>有危害</span>";
                        }
                        return level;
                    }},
                    {"aTargets":[3],"mRender":function(value,type,aData){
                        var level = "<span class='badge badge-info'>信息</span>";
                        if(value == 30){
                            level = "<span class='badge'>低危</span>";
                        }else if(value == 40){
                            level = "<span class='badge badge-warning'>中危</span>";
                        }else if(value == 50){
                            level = "<span class='badge badge-important'>高危</span>";
                        }else if(value == 60){
                            level = "<span class='badge badge-important'>安全事件</span>";
                        }
                        return level;
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var desc = aData['desc'];
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/OptCenter/Policy/policyDetail?id=" + aData["id"];
                        location.href = path;
                    });
                    $('td:eq(6)', nRow).append(editBtn);
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
                var level = $("#policy-level").val();
                if(param!=''){
                    filterParam.push({name:"name",value:param});
                }
                if(level){
                    filterParam.push({name:"level",value:level});
                }
                policyTable.fnPageChange(0);
                policyTable.fnDraw();
            });
        }
    };
})();