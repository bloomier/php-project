/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var image_path = $("#image_path").val();
    var eventInfoTable;

    var filterParam=[];

    $(document).ready(function(){

        __init__.initView();

        __init__.initImg();

        //__init__.initTimeLine();

        __bind__.bind();

        __init__.initDate();

        __init__.initDomain();

        __init__.initDesc();

    });

    var __init__={

        initDomain : function(){
            var domain = $("#webDomain").val();
            var count = 0;
            var repairCount = 0;
            var unRepair = 0;
            // 总数
            $.post(__ROOT__+'/Security/Event/query', {web_domain:domain,currentpage:1,limit:0,audit_state:1}).success(function(json){
                count = json.total;
                // 修复数
                $.post(__ROOT__+'/Security/Event/query', {web_domain:domain, deal_state:4,currentpage:1,limit:0, audit_state:1}).success(function(json2){
                    repairCount = json2.total;
                    unRepair = count - repairCount;
                    $(".total").html(count);
                    $(".repair").html(repairCount);
                    $(".unrepair").html(unRepair);
                });
            });


        },

        initImg : function(){
            var imgPath = $("#eventSnapshot").val();
            if(!imgPath){
                imgPath = "security/2015-16-07/1437038593.png";
            }
            $("#aSrc").attr("href", image_path + "/upload/" + imgPath);
            $("#imgSrc").attr("src", image_path + "/upload/" + imgPath);
        },

        initDesc : function(){
            var desc = $("#eventDesc").val();

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

            $(".web-desc").html(desc);
        },

        initDate : function(){
            var dealState = $("#dealState").val();
            var webState = "未修复";
            if(dealState == 3){
                webState = "已修复";
            }
            $(".event_repair").html(webState);
        },

        initView:function(){
            var eventId = $("#eventId").val();
            var path = __ROOT__ + "/Security/Event/history/event_id/" + eventId ;
            $(".history-event-href").attr("href",path);
            eventInfoTable=$("#web_event_log").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/Event/queryEventLog',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'logDesc'},
                    {"mDataProp": 'createDate'},
                    {"mDataProp":''},
                    {"mDataProp": 'createUser'},
                    {"mDataProp": 'responseDesc'}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    var condition = aData['logDesc'];
                    var status = "";
                    if(condition == '1'){
                        status = "新发现";
                    }else if(condition == "2"){
                        status = "审核";
                    }else if(condition == "3"){
                        status = "发信息";
                    }else if(condition == "4"){
                        status = "修复";
                    }
                    $('td:eq(0)', nRow).html(status);
                    //var report_address=aData['report_address'].length>=20?aData['report_address'].substring(0,20):aData['report_address'];
                    var report_type={"1":"短信","2":"邮箱","4":"微信","8":"密信"}[aData['notifyType']] || "";
                    var report_to="";
                    if(aData['report_to'] && aData['report_address']){
                        report_to="【"+report_type+"】"+aData['report_to']+"&lt;"+aData['report_address']+"&gt;";
                    }else{
                        if(aData['report_to']){
                            report_to="【"+report_type+"】"+aData['report_to'];
                        }
                        if(aData['report_address']){
                            report_to="【"+report_type+"】"+aData['report_address'];
                        }
                    }
                    $('td:eq(2)',nRow).html(report_to);

                },

                "fnServerParams":function(aoData){//查询条件
                    filterParam.push({"name":"eventId","value":$("#eventId").val()});
                    $.merge(aoData,filterParam);

                }
            }));
        },

        initTimeLine : function(){
            var param = {"eventId":$("#eventId").val()};
            $.post(__ROOT__+'/Security/Event/queryEventLog', param).success(function(json){

                if(json.code > 0){
                    $.each(json.rows, function(point, item){
                        var wraper = $("#one-event-time").clone().removeAttr("id");
                        var time = item.createDate;
                        var eventTypeCn = $("#eventType").val();

                        var url = $("#eventUrl").val();
                        $(".one-event-create-time", wraper).html(time);
                        $(".one-event-time-type", wraper).html(eventTypeCn);
                        $(".one-event-time-url", wraper).html(url);

                        if(item.logDesc == "1"){
                            $(".one-event-time-detail", wraper).html("被发现");
                            wraper.show().appendTo($(".discover-event"));
                        }else if(item.logDesc == "2"){
                            $(".one-event-time-detail", wraper).html("审核");
                            wraper.show().appendTo($(".audit-event"));
                        }else if(item.logDesc == "4"){
                            $(".one-event-time-detail", wraper).html("已修复");
                            wraper.show().appendTo($(".repair-event"));
                        }else if(item.logDesc == "3"){
                            $(".one-event-time-detail", wraper).html("发信息");
                            wraper.show().appendTo($(".send-event"));
                        }
                    });
                }
            });
        }
    };



    var __bind__ = {
        bind : function(){
            $(".fancybox-button").fancybox({
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
            //$('.timeline li label').click(function(){
            //    $('.event_year>li').removeClass('current');
            //    $(this).parent('li').addClass('current');
            //    var year = $(this).attr('for');
            //    $('#'+year).parent().prevAll('div').slideUp(800);
            //    $('#'+year).parent().slideDown(800).nextAll('div').slideDown(800);
            //});

            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"remark",value:param});
                }

                filterParam.push({"name":"eventId","value":$("#eventId").val()});

                var logDesc = $("#logDesc").val();

                if(logDesc){
                    filterParam.push({name:"logDesc",value:logDesc});
                }
                eventInfoTable.fnDraw(false);
            });
        }
    }
})();