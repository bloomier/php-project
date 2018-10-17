/**
 *@name
 *@author song
 *@date 2015/5/22
 *@desc
 */
$(function() {

    $(document).ready(function () {

        // 时间控件绑定
        $('.form_datetime').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1
        });

        _bind_function.bindQuery();// 绑定查询按钮事件

        _bind_function.modelClose();// 绑定关闭事件

        _bind_function.bindDealWith();// 绑定处理操作

    });

    var organizeParam = function(start, limit){
        var imgType = $("#imgType").val();
        var status = $("#status").val();
        var param = $("#params").val();
        var startTime = $("#startTime").val();
        var endTime = $("#endTime").val();
        var aoData = {"imgType":imgType,"status":status,"params":param,"startTime":startTime,"endTime":endTime,"start":start,"limit":limit};
        return aoData;
    }

    var _bind_function = {
        queryByPage : function(pageNow, pageRow){
            $(".btn-query").bind("click", function(){
                var queryData = organizeParam(pageNow * 5, 5);//{"start":pageNow * 5, "limit":5, "params":$("#params").val()};
                $.ajax({"dataType":'json', "type":"POST", "url": "query", "data":queryData, "success":function(data) {
                    appendTo(data.list);
                }});
            });
        },

        bindQuery : function(){
            $(".btn-query").bind("click", function(){
                var queryData = organizeParam(0,5);
                $.ajax({"dataType":'json', "type":"POST", "url": "query", "data":queryData, "success":function(data) {
                    appendTo(data.list);
                    _init_page(data.count);
                }});
            });
        },

        bindDealWith : function(){
            $(".dealWith").live("click", function(){
                var status = $(this).attr("status");
                var id = $(this).attr("event_id");
                var param = {"status":status,"event_id":id};
                $.ajax({"dataType":'json', "type":"POST", "url": "dealWithEvent", "data":param, "success":function(data) {
                    $(".sendResult").text("");
                    $(".sendResult").text(data);
                    $("#resultModal").modal("show");
                }});
            });
        },

        modelClose : function(){
            $("#pocModelClose").live("click",function(){
                $("#resultModal").modal("hide");
                $(".btn-query").click();
            });
        }
    }

    // 页面渲染【分页】
    var _init_page_option = {
        option : function(){
            var option = {
                callback:_bind_function.queryByPage,//点击分页按钮的回调函数	函数	function(){return false;}
                //current_page:1,//	初始化时选中的页码	数字	0
                items_per_page:10,//	每页每页显示的记录条数	数字	10
                //link_to	分页链接	字符串	#
                num_display_entries:10,	//最多显示的页码数	数字	11
                next_text:'下一页',	//‘下一页’显示的文字	字符串	Next
                next_show_always:false,	//如果设置为false‘下一页’按钮只有在还能增加页码的情况下才显示	布尔值	true
                prev_show_always:false,//	如果设置为false‘上一页’按钮只有在还能导航到前一页的情况下才显示	布尔值	true
                prev_text:'上一页',//	‘上一页’显示的文字	字符串	Previous
                num_edge_entries:0//	如果设为1，那么永远会显示首页和末页	1或0	0
                //ellipse_text	从当前页码段到首页或末页之间的标识字符串	字符串	…
                //load_first_page:false//	如果设置为true，那么回调函数将在插件初始化时就执行	布尔值	true
            }
            return option;
        }
    }

    var _init_page = function(count){
        $(".pagination").pagination(count, _init_page_option.option());// 设置分页
    }

    // 将数据渲染到页面
    var appendTo = function(data){

        $(".query-result-value").html("");

        $.each(data, function(point, item){
            var id = item.security_event_id;
            var domain = item.security_event_domain;
            var title = item.security_event_title;
            var type = item.security_event_type;
            var error = item.security_event_error_info;
            if(type == 1){
                type = "博彩";
            }else if(type == 2){
                type = "反共";
            }else if(type == 3){
                type = "暗链";
            }
            var time = item.security_event_time;
            var province = item.security_event_province;
            var city = item.security_event_city;
            var sender = item.security_event_sender;
            var description = item.security_event_description;
            var status = item.security_event_status;
            var wraper = $("#one-result").clone().removeAttr("id");
            $(".one-result-title-domain", wraper).html(domain);
            $(".one-result-body-area", wraper).html(province + "-" + city);
            $(".one-result-body-time", wraper).html(time);
            $(".one-result-body-type", wraper).html(type);
            $(".one-result-body-description", wraper).html(description);
            $(".one-result-body-title", wraper).html(title);
            $(".one-result-body-sender", wraper).html(sender);
            $(".one-result-body-event-img", wraper).attr("src", __ROOT__ + "/SecurityEvent/getImg?id=" + id);
            var pass = $("<button type='button' class='btn btn-default dealWith' event_id='" + id + "' status='1'>通过</button>");
            var unpass = $("<button type='button' class='btn btn-default dealWith'  event_id='" + id + "' status='0'>不通过</button>");
            var del = $("<button type='button' class='btn btn-default dealWith'  event_id='" + id + "' status='2'>删除</button>");
            if(status == 1){
                status = "未处理";
                $(".one-result-body-status", wraper).append(pass);
                $(".one-result-body-status", wraper).append(unpass);
                $(".one-result-body-status", wraper).append(del);
            }else if(status == 2){
                status = "已提交";
                pass.attr("disabled","disabled");
                $(".one-result-body-status", wraper).html(pass);
            }else if(status == 3){
                status = "未通过";
                unpass.attr("disabled","disabled");
                $(".one-result-body-status", wraper).html(pass);
            }else if(status == 4){
                status = "提交失败";
                $(".one-result-body-error", wraper).html(error);
                $(".one-result-body-status", wraper).append(pass);
                $(".one-result-body-status", wraper).append(unpass);
                $(".one-result-body-status", wraper).append(del);
            }
            $(".one-result-title-status-info", wraper).append($("<button type='button' class='btn btn-default dealWith' disabled='disabled'>" + status + "</button>"));
            wraper.show().appendTo($(".query-result-value"));
        });
    }


});

