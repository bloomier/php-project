/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var roleTable;

    var parsley;
    var filterParam=[];

    $(document).ready(function(){

        if($("#srcState").val()){
            $("#aduitState").val($("#srcState").val());
        }

        __init__.initView();
        __init__.addHandler();

    });

    var __init__={
        initView:function(){
            roleTable=$("#roleTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Self/TaskAdmin/queryApplyForm',//请求URL
                "aoColumns": [ //参数映射
                    //{"mDataProp": 'formId'},
                    {"mDataProp": 'create_time'},
                    {"sDefaultContent": ''},
                    {"mDataProp": 'apply_reason'},
                    {"sDefaultContent": ''},
                    {"mDataProp": 'apply_name'},
                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    //$('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['groupId']+"'>");

                    var siteList = aData['siteList'];
                    var list = [];
                    $.each(siteList, function(point, item){
                        list.push(item['website_domain']);
                    });
                    var domainList = list.join(",");

                    var label = $("<span></span>");
                    label.attr("title", domainList);
                    if(domainList.length > 50){
                        label.text(domainList.substr(0, 50) + "...");
                    }else{
                        label.text(domainList);
                    }
                    $('td:eq(1)', nRow).append(label);

                    var status = "";
                    var audit_state = aData['audit_state'];
                    if(audit_state == 0){
                        status = "未审核";
                    }else if(audit_state == -1){
                        status = "审核失败";
                    }else if(audit_state == -2){
                        status = "已撤销";
                    }else if(audit_state == 1){
                        var report_status = aData['form_report_status'];
                        if(report_status == 0){
                            status = "未生成";
                        }else if(report_status == 1){
                            status = "已生成";
                        }
                    }

                    $('td:eq(3)', nRow).text(status);

                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');

                    if(audit_state == 0){
                        editBtn.bind("click",function(){
                            var path = __ROOT__ + "/Self/TaskAdmin/toAuditDetail?formId=" + aData["form_id"];
                            location.href = path;
                        });
                    }else{
                        editBtn.bind("click",function(){
                            var path = __ROOT__ + "/Self/TaskAdmin/showDetail?formId=" + aData["form_id"];
                            location.href = path;
                        });
                    }



                    $('td:eq(5)', nRow).append(editBtn);
                },

                "fnServerParams":function(aoData){//查询条件


                    //var auditState = $("#aduitState").val();
                    //if(auditState > 0){
                    //    filterParam.push({name:"auditState", value:auditState});
                    //}

                    $.merge(aoData,filterParam);
                }
            }));
        },
        addHandler:function(){
            $(".btn-add-role").attr("href", __ROOT__ + "/Security/NotifyGroup/toAdd");
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#roleTable"));
                __function__.beathDelete(ids);

            });
            $(".btn-search").bind("click",function(){

                var param=$(this).prev().val();
                console.info(param);
                param= $.trim(param);
                filterParam=[];
                var auditState = $("#aduitState").val();
                if(auditState > 0){
                    filterParam.push({name:"auditState", value:auditState});
                }
                if(param!=''){
                    filterParam.push({name:"apply_name",value:param});
                }
                roleTable.fnPageChange(0);
                //roleTable.fnDraw(false);
            });

        }
    };

    var __function__ = {
        beathDelete : function(ids){
            $.post(__ROOT__ + "/Security/NotifyGroup/beatchDelete", {"ids":ids}).success(function(json){
                Message.init({
                    text: json.msg,
                    type: 'success' //info success warning danger
                });
                roleTable.fnDraw(false);
            });
        }
    }
})();