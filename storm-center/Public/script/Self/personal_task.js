/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var taskTable;

    var parsley;
    var filterParam=[];

    $(document).ready(function(){
        //parsley=$("#roleForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });

    var __init__={
        initView:function(){
            taskTable=$("#taskTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Self/Task/queryPersonalTask',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": ''},
                    {"mDataProp": 'create_time'},
                    {"sDefaultContent": ''},
                    {"mDataProp": 'apply_reason'},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var audit_state = aData['audit_state'];
                    if(audit_state == 0){
                        $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['form_id']+"'>");
                    }

                    var siteList = aData['siteList'];
                    var list = [];
                    $.each(siteList, function(point, item){
                        list.push(item['website_domain']);
                    });
                    var domainList = list.join(", ");

                    var label = $("<span></span>");
                    label.attr("title", domainList);
                    if(domainList.length > 50){
                        label.text(domainList.substr(0, 50) + "...");
                    }else{
                        label.text(domainList);
                    }
                    $('td:eq(2)', nRow).append(label);

                    var status = "";

                    var report_status = aData['form_report_status'];
                    if(audit_state == 0){
                        status = "未审核";
                    }else if(audit_state == -1){
                        status = "审核失败";
                    }else if(audit_state == -2){
                        status = "已撤销";
                    }else if(audit_state == 1){
                        if(report_status == 0){
                            status = "未生成";
                        }else if(report_status == 1){
                            status = "已生成";
                        }
                    }

                    $('td:eq(4)', nRow).text(status);

                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看任务</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/Self/Task/showDetail?form_id=" + aData["form_id"];
                        location.href = path;
                    });

                    var undoBtn=$('<a class="btn red-stripe mini" href="#">撤销任务</a>');
                    undoBtn.bind("click",function(){
                        __function__.beathUndo(aData["form_id"]);
                    });

                    var exportBtn=$('<a class="btn green-stripe mini" href="#">导出报告</a>');
                    exportBtn.bind("click",function(){
                        __function__.exportReport(aData["form_id"],aData["form_report_path"]);
                    });

                    $('td:eq(5)', nRow).append(editBtn);
                    if(audit_state == 0){
                        $('td:eq(5)', nRow).append(undoBtn);
                    }
                    if(status == "已生成"){
                        $('td:eq(5)', nRow).append(exportBtn);
                        //alert(aData["form_report_path"]);
                    }
                },

                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
        },
        addHandler:function(){
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#taskTable"));
                __function__.beathUndo(ids);
            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                var audit_state = $("#audit_state_id").val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"groupName",value:param});
                }
                if(audit_state!=''){
                    filterParam.push({name:"audit_state",value:audit_state});
                }
                taskTable.fnDraw(false);
            });

        }
    };

    var __function__ = {
        /** 撤销任务 */
        beathUndo : function(ids){
            if(ids == ''){
                alert('请选择待撤销记录！');
                return;
            }
            $.post(__ROOT__ + "/Self/Task/batchUndo", {"ids":ids}).success(function(json){
                if(json.code > 0){
                    alert(json.msg);
                    taskTable.fnDraw(false);
                } else {
                    alert('操作失败');
                }

            });
        },
        exportReport : function(form_id,form_report_path){
            var path = __ROOT__+'/Self/Task/exportReport?form_id=' + form_id + '&form_report_path=' + form_report_path;
            window.open(path);
        }
    }
})();