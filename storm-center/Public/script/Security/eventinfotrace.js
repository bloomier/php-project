/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var eventInfoTable;

    var filterParam=[];


    $(document).ready(function(){

        __init__.initView();

        __bind__.bindFunction();
    });

    var __init__={

        initView:function(){
            var defaultDealState = $("#defaultDealState").val();
            if(defaultDealState != null && defaultDealState != '{$default_deal_state}'){
                $("#deal_state").val(defaultDealState);
            }

            eventInfoTable=$("#eventInfoTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/Event/query',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'event_id'},
                    {"mDataProp": 'web_title'},
                    {"mDataProp": 'web_url'},
                    {"mDataProp": 'event_type_cn'},
                    {"mDataProp": 'happen_time'},
                    {"mDataProp": 'deal_state'},
                    {"mDataProp": 'audit_date'},
                    //{"mDataProp": 'remark'},
                    {"sDefaultContent": ''}
                ],

                "oLanguage": {
                    "sProcessing":   "处理中...",
                    "sLengthMenu":   "_MENU_ 记录/页",
                    "sZeroRecords":  "没有匹配的记录",
                    "sInfo":         "显示第 _START_ 至 _END_ 项记录，共  _TOTAL_项",
                    "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                    "sInfoPostFix":  "",
                    "sSearch":       "过滤:",
                    "sUrl":          "",
                    "oPaginate": {
                        "sFirst":    "首页",
                        "sPrevious": "上页",
                        "sNext":     "下页",
                        "sLast":     "末页"
                    }
                },
                "bSortable": false,
                "aTargets": [ 0 ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("");
                    var title = aData['web_title'];
                    var titleLabel = "";
                    if(title.length > 20){
                        titleLabel = $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + title + "'>" + title.substr(0,20) + "...</span>");
                    }else{
                        titleLabel = $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + title + "'>" + title + "</span>");
                    }

                    $('td:eq(1)', nRow).html(titleLabel);

                    var url=aData['web_url'];
                    var urlLabel="";
                    if(url.length>50){
                        urlLabel=$("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + url + "'>" + url.substr(0,50) + "...</span>");
                    }else{
                        urlLabel = $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + url + "'>" + url + "</span>");
                    }
                    $('td:eq(2)',nRow).html(urlLabel);


                    var condition = "";
                    var auditState = aData['audit_state'];
                    var dealState = aData['deal_state'];
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');

                    var deleteBtn="";
                    var repairBtn = "";
                    if(auditState == 0){
                        condition = $("<button type='button' class='btn btn-xs' disabled='disabled'>未审核</button>");
                        deleteBtn=$('<a class="btn yellow-stripe mini" href="#">通报</a>');
                        //repairBtn = $('<a href="#" class="btn red-stripe mini">修复</a>');
                    }else if(auditState == 1){
                        if(dealState == 1){
                            condition = $("<button type='button' class='btn yellow btn-xs' disabled='disabled'>已审核</button>");
                            deleteBtn=$('<a class="btn yellow-stripe mini" href="#">通报</a>');
                            repairBtn = $('<a href="#" class="btn red-stripe mini">修复</a>');
                        }else if(dealState == 2){
                            $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['event_id']+"'>");
                            condition = $("<button type='button' class='btn red btn-xs' disabled='disabled'>已通报</button>");
                            repairBtn = $('<a href="#" class="btn red-stripe mini">修复</a>');
                        }else if(dealState == 3){
                            condition = $("<button type='button' class='btn green btn-xs' disabled='disabled'>已修复</button>");
                        }
                    }else if(auditState == -1){
                        condition = $("<button type='button' class='btn blue btn-xs' disabled='disabled'>未通过</button>");
                    }

                    $('td:eq(5)', nRow).html(condition);


                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/Security/Event/traceView?eventId=" + aData["event_id"];
                        location.href = path;
                    });

                    if(deleteBtn != ""){
                        deleteBtn.bind("click",function(){
                            $.post(__ROOT__+"/Security/Event/query", {event_id:aData['event_id'], currentpage:1, limit: 1}).success(function(json){
                                var item = json.rows[0];
                                var wraper = $("#myModal");
                                var ip = item.web_ip;
                                var region = item.web_ip_addr;
                                var time = item.create_date;
                                var type = item.event_type;
                                var typeCh = item.event_type_cn;
                                var user = item.create_user;
                                var url = item.web_url;
                                var title = item.web_title;
                                var source = item.event_source;
                                var desc = item.event_desc;
                                var id = item.event_id;
                                var pic = item.event_snapshot;
                                var province = item.web_ip_province;
                                var city = item.web_ip_city;
                                if(!pic){
                                    pic = "security/2015-16-07/1437038593.png";
                                }
                                if(desc){
                                    if(desc.indexOf("[") == 0 && (desc.lastIndexOf("]") + 1) == desc.length){
                                        desc = desc.substr(1, desc.length -1);
                                        var value = "";
                                        $.each(desc.split("}, {"), function(point, item){
                                            if(item.indexOf("{") == 0){
                                                item = item.substr(1);
                                            }
                                            if(item.lastIndexOf("}]") != -1){
                                                item = item.split("}]")[0];
                                            }
                                            value = value + item + "\n";
                                        })
                                        desc = value;
                                    }
                                }
                                var contactTarget = item.list;
                                $("#this_event_id", wraper).val(item.event_id);
                                $(".one-event-ip",wraper).html(ip);
                                $(".one-event-addr",wraper).html(region);
                                $(".one-event-time",wraper).html(time);
                                $(".one-event-type",wraper).html(typeCh);
                                $(".one-event-submiter",wraper).html(user);
                                $(".one-event-url",wraper).html(url);
                                $(".one-event-title",wraper).html(title);
                                $(".one-event-source",wraper).html(source);
                                $(".one-event-desc",wraper).html(desc);
                                $(".one-event-addr",wraper).html(region);
                                $(".one-event-ip",wraper).html(ip);
                                $(".one-event-pass", wraper).attr("event_id", id);
                                $(".one-event-default", wraper).attr("event_id", id);
                                var a = [];
                                $.each(contactTarget, function(point, item){
                                    a.push(item.groupName);
                                });
                                $(".select2", wraper).val(a.join(","));
                                var select = $(".select2", wraper);
                                select.select2({tags:a});
                                $(".citys",wraper).citySelect({prov:province,city:city});
                                $(".one-event-pic",wraper).attr("href", "http://172.16.2.40/imgserver/upload/" + pic);
                                $(".one-event-pic-show",wraper).attr("src", "http://172.16.2.40/imgserver/upload/" + pic);
                                $(".fancybox-button", wraper).fancybox({
                                    groupAttr: 'data-rel',
                                    prevEffect: 'none',
                                    nextEffect: 'none',
                                    closeBtn: true,
                                    helpers: {
                                        title: {
                                            type: 'inside'
                                        }
                                    }
                                });
                                $("#myModal").modal("show");
                            });
                        });

                    }
                    if(repairBtn != ""){
                        repairBtn.bind("click", function(){
                            $.post(__ROOT__+"/Security/Event/update", {id:aData["event_id"],deal_state:3}).success(function(json){
                                Message.init({
                                    text: json.msg,
                                    type: 'success' //info success warning danger
                                });
                                eventInfoTable.fnDraw(false);
                            });
                        });

                    }

                    $('td:eq(7)', nRow).append(editBtn).append(deleteBtn).append(repairBtn);
                },

                "fnServerParams":function(aoData){//查询条件
                    //var value = $("#deal_state").val();
                    //if(value){
                    //    filterParam.push({name:"deal_state",value:value});
                    //    if(value == 1){
                    //        filterParam.push({name:"audit_state", value:0});
                    //    }else{
                    //        filterParam.push({name:"audit_state", value:1});
                    //    }
                    //}
                    $.merge(aoData,filterParam);
                }
            }));
        }

    };


    var __bind__ = {
        bindFunction : function(){
            $('.j-edit').live("click",function(){
                var v = $(this).parent().prev().text();
                var input = $('<input type="text" class="form-control m-wrap" value=" '+v+'">');
                $(this).parent().hide();
                $(this).parent().prev().hide();
                $(this).closest('div').append(input);
                input.click(function() { return false; });

                input.trigger("focus");
                input.blur(function() {
                    var newtxt = $(this).val();
                    $(this).parent().find('span').show();
                    $(this).parent().find('a').show();
                    $(this).parent().find('span').text(newtxt);
                    $(this).remove();
                });
            });


            $(".one-event-pass-btn").live("click", function(){
                var param = {};
                var thisInfo = $(".modal-body");
                var url = $(".one-event-url", thisInfo).html();
                var title = $(".one-event-title", thisInfo).html();
                var source = $(".one-event-source", thisInfo).html();
                var desc = $(".one-event-desc", thisInfo).html();
                var id = $("#this_event_id").val();
                var contact = $("input:hidden", thisInfo).val();
                var deal_state = $("input:radio:checked", thisInfo).val();
                var audit = 1;
                $.extend(param, {"url" : url, "title" : title, "source" : source, "desc" : desc, "id" : id, "audit" : audit, "contact":contact, "deal_state":deal_state});
                $.post(__ROOT__+"/Security/Event/update", param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });

                    $("#myModal").modal("hide");
                    eventInfoTable.fnDraw(false);

                });

            });

            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                var event_type = $("#event_type").val();
                var deal_state = $("#deal_state").val();
                if(event_type){
                    filterParam.push({name:"event_type",value:event_type});
                }
                if(deal_state > 0){
                    filterParam.push({name:"deal_state",value:deal_state});
                }
                //else{
                //    filterParam.push({name:"audit_state", value:deal_state});
                //}
                eventInfoTable.fnDraw(false);
            });

            $(".bth-batch-repair").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#eventInfoTable"));
                if(ids==''){
                    Message.init({
                        text: "请选择要修复的记录！",
                        type: 'success' //info success warning danger
                    });
                }else{
                    $.post(__ROOT__+"/Security/Event/beatchRepair", {ids:ids}).success(function(json){
                        Message.init({
                            text: json.msg,
                            type: 'success' //info success warning danger
                        });
                        eventInfoTable.fnDraw(false);
                    });
                }
            });

            $('.m-wrap').live("dblclick",function(){
                var v = $(this).text();

                var input = $('<input type="text" class="form-control m-wrap" value=" '+v+'">');
                $(this).hide();
                //$(this).parent().hide();
                //$(this).parent().prev().hide();
                $(this).closest('div').append(input);
                input.click(function() { return false; });

                input.trigger("focus");
                input.blur(function() {
                    var newtxt = $(this).val();
                    $(this).parent().find('.m-wrap').show();
                    $(this).parent().find('a').show();
                    $(this).parent().find('span').text(newtxt);
                    $(this).remove();
                });
            });

        }
    }
})();