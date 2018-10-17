/**
 *@name
 *@author song
 *@date 2015/5/22
 *@desc
 */
$(function() {
    var mt = "全国";
    var map;
    $(document).ready(function () {
        _init_.initMap();
        _init_bind.bindFunction();
        _init_query.query(0,10,1);// 初始化查询
    });

    // 定义条件选项的点击事件
    var _init_bind = {
        // 查询点击事件
        bindFunction : function(){

            $(".btn-query").bind("click", function(){
                _init_query.query(0,10,1);
            });

            $(".btn-query-export").bind("click", function(){
                var queryParam = $("#params").val();
                if(queryParam == ""){
                    return false;
                }else{
                    var href = __ROOT__ + "/Report/showReport?query-param=" + queryParam + "&area=" + mt;
                    window.open(href);
                }
            });

            $(document).keydown(function(event) {
                if (event.keyCode == 13) {
                    $(".btn-query").trigger("click");
                }
            });
        },

        // 按钮可用
        query_button_on : function(){
            $(".btn-query").attr("disabled", false);
            $(".btn-query").html("搜索一下");
        },

        // 按钮不可用
        query_button_off : function(){
            $(".btn-query").attr("disabled", true);
            $(".btn-query").html("<i class='fa fa-spinner fa-spin fa-2x'></i>");
        }
    }

    // 初始化选项
    var _init_ = {
        initMap:function(){
            map=$(".area-container").mapcount({
                selectItem:function(parentKey,key){
                    _init_query.areaQuery(parentKey,key);
                },
                createItem:function(key,value,per,wraper){
                    var valueWraper = $("<div style='display:inline-block;float:right'>");
                    valueWraper.append($("<span>" + value + "</span>"));
                    valueWraper.append($("<div style='display: inline-block;background-color: #464547;float:right; height:18px;width:" + parseInt(per) + "px'></div>"));
                    var values = $("<a href='javascript:void(0)'>"+key+"</a>");
                    wraper.append(values);
                    wraper.append(valueWraper);
                    wraper.css("margin-top,","5px").css("margin-bottom","5px");
                },
                backBtn:function(){
                    var back=$("<a href='javascript:void(0)' class='fa fa-reply '></a>");
                    return  back;
                },
                setStyle:function(ul){
                    ul.css("list-style","none").css("padding","0px");
                },
                limit:10
            });
        }
    }

    // 从服务器获取数据
    var _init_query = {
        // 初始化数据
        query : function(start, limit, type){
            _init_bind.query_button_off();
            $.post("queryByParam", {start:start, limit:limit, type:type, query_param:$("#params").val()}).success(function(json){
                if(json['code']){
                    _init_page.valueToPage(json['data'], json['total'], json['time']);
                    $(".pagination").pagination(json['total'], _init_page_option.option());// 设置分页
                    if(type){
                        _init_page.bindAreaData(json['areacount']);
                    }
                    _init_bind.query_button_on();// 取消
                }
            });

        },

        // 区域选择
        areaQuery : function(parentArea,area){
            if($("#params").val() == ""){
                return;
            }
            var region = "";
            if(area != '全国'){
                if(parentArea){
                    if(_init_data[parentArea]){
                        region = _init_data[parentArea];
                    }else{
                        region = parentArea + "省";
                    }
                    if(area != "未知"){
                        region = region + area;
                        region = "*" + region + "*";
                    }
                }else{
                    if(_init_data[area]){
                        region = _init_data[area];
                    }else{
                        region = area + "省";
                    }
                    region = "*" + region + "*";
                }
            }
            _init_bind.query_button_off();
            $.post("queryByParam", {start:0, limit:10, type:0, query_param:$("#params").val(), area:region}).success(function(json){
                if(json['code']){
                    _init_page.valueToPage(json['data'], json['total'], json['time']);// 将结果输出到页面详情模块
                    $(".pagination").pagination(json['total'], _init_page_option.option());// 设置分页
                    _init_bind.query_button_on();// 取消
                    if(mt == "未知省"){
                        mt = '*未知*';
                    }else{
                        mt = region;
                    }
                }
            });
        },

        // 分页功能
        queryByPage : function(pageNow, pageRow){
            var param = {start:pageNow * 10, limit:10, type:0, query_param:$("#params").val()};
            if(mt != '全国'){
                $.extend(param, {"area" : mt });
            }
            $.post("queryByParam", param).success(function(json){
                if(json['code']){
                    _init_page.valueToPage(json['data'], json['total'], json['time']);
                    _init_bind.query_button_on();// 取消
                }
            });
        }


    }

    var _init_page = {
        // 查询某个域名的详细信息
        queryDomainCensusInfo : function(domain, id, secids, dangerid, value){
            var level;
            if(!value || value.status == "unknow"){
                $("#" + id).html("共发现0个");
                $("#" + secids).html("共发生" + 0 + "个安全事件");
                level = $("<button type='button' class='btn btn-primary' disabled='disabled'>未发现</button>");
            }else{
                var high = value.high;
                var mid = value.mid;
                var low = value.low;
                var info = value.info;
                var security = value.security;
                var count = high + mid + low + info;
                $("#" + id).html("共发现" + count + "漏洞。" + "其中高危" + high + "个，" + "中危" + mid + "个，" + "低危" + low + "个，" + "信息" + info + "个");
                $("#" + secids).html("共发生" + security + "个安全事件");
                if(high > 0 || security > 0){
                    level = $("<button type='button' class='btn btn-danger' disabled='disabled'>高危</button>");
                }else if(mid > 0){
                    level = $("<button type='button' class='btn btn-warning' disabled='disabled'>中危</button>");
                }else if(low > 0){
                    level = $("<button type='button' class='btn btn-info' disabled='disabled'>低危</button>");
                }else if(info > 0){
                    level = $("<button type='button' class='btn btn-info' disabled='disabled'>信息</button>");
                }
            }
            level.appendTo($("#" + dangerid));
        },

        bindAreaData : function(data){
            map.clear();
            var array = {};
            $.each(data, function(point, item){
                array[item.name]=item.value;
            });
            map.load(array);
        },

        // 将数据渲染到页面
        valueToPage : function(data, total, time){
            $(".query-result-value").html("");
            var countNum = total;
            var time = time;
            $(".select-count").html(countNum);
            $(".select-time").html(time);
            $.each(data, function(point, item){
                var domain = item.domain;

                var title = item.title||domain||"";
                var imgPointPath = __PUBLIC__ + "/image/search-icon/point.png"
                var wraper = $("#one-result").clone().removeAttr("id");

                var hrefs = __ROOT__ + "/Report/domainReport?url=";
                if(title.length > 15){
                    title = title.substr(0, 15) + "...";
                }
                $(".one-result-title-domain",wraper).html("<a href='http://" + domain + "' target='_black'>" + title + "</a>");

                $(".one-domain-safe-href", wraper).attr("href", __ROOT__ + "/Report/safeWeb?url=" + domain + "&ip=" + item.ip);

                var city = item.province + " " + item.city;
                if(city != " "){
                    $(".one-result-body-area",wraper).html(city);
                }else{
                    $(".one-result-body-area",wraper).html("未知");
                }

                $(".one-result-body-time",wraper).html(item.timestamp);

                $(".one-domain-href", wraper).attr("href", hrefs + item.encodeDomain);

                $(".one-result-body-ip",wraper).html(item.ip);

                var target = __ROOT__ + "/Report/safeWeb?url=" + domain;
                $(".one-result-body-security-event",wraper).append("<a href='" + target + "' target='_Blank' title='点击查看安全态势'><img class='' src='" + imgPointPath + "'/></a>");

                if(item.type != ""){
                    $(".one-result-body-type",wraper).html(item.type);
                }else{
                    $(".one-result-body-type",wraper).html("其他");
                }

                $(".one-result-foot-domain", wraper).html(item.domain);

                var ids = "one-result-body-result-" + point
                $(".one-result-body-result", wraper).attr("id", ids);
                var secids = "one-result-body-security-" + point
                $(".one-result-body-security", wraper).attr("id", secids);
                var dangerid = "one-danger-lever-" + point;
                $(".one-danger-lever", wraper).attr("id", dangerid);
                wraper.show().appendTo($(".query-result-value"));
                _init_page.queryDomainCensusInfo(domain, ids, secids, dangerid, item.vulsinfo);

            });
        }
    }

    // 页面渲染【分页】
    var _init_page_option = {
        option : function(){
            var option = {
                callback:_init_query.queryByPage,//点击分页按钮的回调函数	函数	function(){return false;}
                items_per_page:10,//	每页每页显示的记录条数	数字	10
                num_display_entries:10,	//最多显示的页码数	数字	11
                next_text:'下一页',	//‘下一页’显示的文字	字符串	Next
                next_show_always:false,	//如果设置为false‘下一页’按钮只有在还能增加页码的情况下才显示	布尔值	true
                prev_show_always:false,//	如果设置为false‘上一页’按钮只有在还能导航到前一页的情况下才显示	布尔值	true
                prev_text:'上一页',//	‘上一页’显示的文字	字符串	Previous
                num_edge_entries:0//	如果设为1，那么永远会显示首页和末页	1或0	0
            }
            return option;
        }
    }

    var _init_data = {
        "北京":"北京市北京市",
        "天津":"天津市天津市",
        "上海":"上海市上海市",
        "重庆":"重庆市重庆市",
        "内蒙古":"内蒙古自治区",
        "宁夏":"宁夏回族自治区",
        "新疆":"新疆维吾尔自治区",
        "西藏":"西藏自治区",
        "广西":"广西壮族自治区",
        "香港":"香港特别行政区",
        "澳门":"澳门特别行政区"
    }

});

