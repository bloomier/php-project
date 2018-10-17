/**
 * Created by jianghaifeng on 2016/4/12.
 */
(function(){

    var common_func = {
        init_region : function(info){
            var location = "";
            if(info["location"]){
                if(info["location"]["province"]){
                    location = location + info["location"]["province"];
                }
                if(info["location"]["city"]){
                    location = location + info["location"]["city"];
                }
                return location;
            }
            return location;
        },

        init_admin_region : function(info){
            var location = "";
            if(info["admin_location"]){
                if(info["admin_location"]["province"]){
                    location = location + info["admin_location"]["province"];
                }
                if(info["admin_location"]["city"]){
                    location = location + info["admin_location"]["city"];
                }
                if(info["admin_location"]["district"]){
                    location = location + info["admin_location"]["district"];
                }
            }
            return location;
        },

        init_finger : function(info){
            var finger = "";
            if(info["finger"]){
                var count = 0;
                $.each(info["finger"], function(point, item){
                    finger = finger + '【' + point + '】' + item + "  ";
                    count++;
                    if(count&2 || count&4 || count&6 || count&8){
                        finger = finger + "<br>";
                    }
                });
            }
            return finger;
        },

        parseRate : function(now, total){
            var rate = now * 100 / total;
            if(String(rate).indexOf(".") > -1){
                rate = rate.toFixed(2);
            }
            return rate;
        },

        init_pie_option : function(option, color, now, total){
            var w = this;
            var option = $.extend({}, option);
            option.color = color;
            var rate = common_func.parseRate(now, total);
            var subRate = 100 - rate;
            option.series[0].data[0].value = rate;
            option.series[0].data[1].value = subRate;
            return option;
        },

        deal_event : function(eventList){
            var result = {};
            $.each(eventList, function(point, item){
                var year = item["happen_year"];
                var month = item["happen_month"];
                var day = item["happen_day"];
                if(!result[year]){
                    result[year] = {};
                }
                if(!result[year][month]){
                    result[year][month] = {};
                }
                if(!result[year][month][day]){
                    result[year][month][day] = [];
                }
                result[year][month][day].push(item);
            });
            var yearTmp = [];
            $.each(result, function(year, year_list){
                var monthTmp = [];
                $.each(year_list, function(month, month_list){
                    var dayTmp = [];
                    $.each(month_list, function(day, day_list){
                        dayTmp.push({name:day, value:day_list});
                    });
                    dayTmp.sort(function(a, b){
                        return b.name - a.name;
                    });
                    monthTmp.push({name:month, value:dayTmp});
                });
                monthTmp.sort(function(a, b){
                    return b.name - a.name;
                });
                yearTmp.push({name:year, value:monthTmp});
            });
            yearTmp.sort(function(a, b){
                return b.name - a.name;
            });
            return yearTmp;
        },

        initSecurityYear:function(point, item, eventType, vidList){
            var year = point;
            $(".event_year").append($("<li><label for='" + year + "'>" + year + "</label></li>"));
            var yearDiv = $("<div class='list'></div>");
            $.each(item, function(p, v){
                yearDiv.append($("<h3 id='" + year + "'>" + v["name"] + "月</h3>"));
                common_func.initSecurityMonth(v["name"], v["value"], yearDiv, eventType, vidList);
                yearDiv.appendTo($(".event_list"));
            });
        },

        initSecurityMonth:function(point, item, yearDiv, eventType, vidList){
            var month = point;
            $.each(item, function(p, v){
                common_func.initSecurityDay(v["name"], v["value"], yearDiv, eventType, vidList)
            });
        },

        initSecurityDay:function(point, item, yearDiv, typeMapper, vidList){
            $.each(item, function(p, v){
                var wraper = $("#one-event-time").clone().removeAttr("id");
                var type = v["type"];
                var eventType = v["event_type"];
                var typeName = "";
                if(type == 1){
                    typeName = "【" + typeMapper[eventType] + "】";
                }else{
                    typeName = vidList[eventType];
                }
                $(".event_date",wraper).html(point + "号");
                $(".this_event_url",wraper).html(v['url']);
                var status = "未审核";
                $(".status",wraper).html(status);
                $(".type",wraper).html(typeName);
                wraper.show().appendTo(yearDiv);
            });
        },

        showHtml : function(value){
            var divWrapper = $("<div></div>");
            divWrapper.html(value);
            return value;
        },

        getMethod : function(reqHeader){
            reqHeader = reqHeader.toUpperCase();
            if(reqHeader.indexOf("GET") == 0){
                return "GET";
            }
            if(reqHeader.indexOf("POST") == 0){
                return "POST";
            }
            if(reqHeader.indexOf("HEAD") == 0){
                return "HEAD";
            }
            if(reqHeader.indexOf("TRACE") == 0){
                return "TRACE";
            }
            if(reqHeader.indexOf("PUT") == 0){
                return "PUT";
            }
            if(reqHeader.indexOf("DELETE") == 0){
                return "DELETE";
            }
            if(reqHeader.indexOf("OPTIONS") == 0){
                return "OPTIONS";
            }
            if(reqHeader.indexOf("CONNECT") == 0){
                return "CONNECT";
            }
            return "";
        }

    }

    var Report = function(){
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        pie_option : {
            color: [],
            calculable : false,
            series : [
                {
                    name:'漏洞统计',
                    type:'pie',
                    center: ['50%','50%'],
                    radius : ['50%', '70%'],
                    itemStyle : {
                        normal : {
                            label : {
                                show : false
                            },
                            labelLine : {
                                show : false
                            }
                        },
                        emphasis : {
                            label : {
                                show : false
                            }
                        }
                    },
                    data:[
                        {
                            value:0,
                            name:'漏洞',
                            itemStyle : {
                                normal : {
                                    label : {
                                        show : true,
                                        position: 'center',
                                        formatter : '{c}'+'%',
                                        textStyle: {
                                            fontSize: 24
                                        }
                                    },
                                    labelLine : {
                                        show : false
                                    }
                                }

                            }
                        },
                        {
                            value:0,
                            name:'其他'
                        }
                    ]
                }
            ]
        },
        map_option : {
            title:{
                show:true,
                text:"",
                x:"center",
                textStyle:{
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            },

            dataRange: {
                show: false,
                textStyle: {
                    color: '#eee'
                },
                x: -10,
                y: 'bottom',
                calculable: false,
                splitList: [
                    {start: 0, end: 300, color: 'green',label: '0~0.3秒'},
                    {start: 300, end: 1000, color: '#b36715',label: '0.3~1秒'},
                    {start: 1000, end: 10000, color: '#f9e400',label: '1~10秒'},
                    {start: 10000, color: 'grey',label: '>10秒'},
                    {end: 0, color: 'red',label: '无法访问'}
                ]
            },
            series : [
                {
                    name: '全国地图',
                    type: 'map',
                    mapType: 'china',
                    showLegendSymbol:false,
                    itemStyle:{
                        normal: {
                            borderColor: 'rgba(19, 105,167, 1)',
                            borderWidth:.5,
                            areaStyle: {
                                color: 'rgba(2, 89,255, .2)'
                            }
                        }
                    },
                    data:[

                    ]
                }
            ]
        },
        bar_option : {
            title : {
                show:false
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:["连接时间",'解析时间', '总时间']
            },

            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : false,
            xAxis : [
                {
                    type : 'category',
                    data : []
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'连接时间',
                    type:'bar',
                    stack:'时间',
                    data:[]
                },
                {
                    name:'解析时间',
                    type:'bar',
                    stack:'时间',
                    data:[]
                },
                {
                    name:'总时间',
                    type:'bar',
                    data:[]
                }
            ]
        },
        source_info : "",
        web_level : {
            high:"高",
            mid:"中",
            low:"低",
            info:"信息",
            safe:"安全",
            unknow:"未知"
        },
        vuls_level_map : {
            "high":"高危漏洞",
            "mid":"中危漏洞",
            "low":"低危漏洞",
            "info":"信息"
        },
        pie_color : {
            "high":['#d32a03', '#ddd'],
            "mid":['#ff7a04', '#ddd'],
            "low":['#ffcd04', '#ddd'],
            "info":['#CDE71B', '#ddd']
        },
        flag : true
    }

    var init_view = {
        // 初始化echart元素大小
        init_component : function(){
            var w = this;
            var height= $(window).height();
            $("#vuls_high_hole").height(height*0.2);
            $("#vuls_mid_hole").height(height*0.2);
            $("#vuls_low_hole").height(height*0.2);
            $("#vuls_info_hole").height(height*0.2);
            $("#service-map").height(height*0.4);
            $("#service-bar").height(height*0.4);
        },

        // 初始化echart元素
        init_echart : function(callback){
            var w = this;
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/pie',
                    'echarts/chart/map'
                ],
                function (ec) {
                    w.vuls_high_hole = ec.init(document.getElementById('vuls_high_hole'));
                    w.vuls_mid_hole = ec.init(document.getElementById("vuls_mid_hole"));
                    w.vuls_low_hole = ec.init(document.getElementById("vuls_low_hole"));
                    w.vuls_info_hole = ec.init(document.getElementById("vuls_info_hole"));
                    w.service_map = ec.init(document.getElementById("service-map"));
                    w.service_bar = ec.init(document.getElementById("service-bar"));
                    w.service_map.showLoading();
                    w.service_bar.showLoading();
                    w.vuls_high_hole.showLoading();
                    w.vuls_mid_hole.showLoading();
                    w.vuls_low_hole.showLoading();
                    w.vuls_info_hole.showLoading();
                    $(".service-li-tab li a:first").trigger("click");
                    callback && callback.call(w);
                }
            );
        },

        // 网站基础信息
        init_domain_info : function(){
            var w = this;
            var wrapper = $("#webInfo-nav");
            $(".title", wrapper).text(w.setting.source_info.info["title"]);
            $(".ip", wrapper).text(w.setting.source_info.info["ip"]);
            $(".domain", wrapper).text(w.setting.source_info.info["_id"]);
            $(".region", wrapper).text(common_func.init_region(w.setting.source_info.info));
            $(".admin_region", wrapper).text(common_func.init_admin_region(w.setting.source_info.info));
            $(".domain_finger", wrapper).html(common_func.init_finger(w.setting.source_info.info));
            if(w.setting.source_info.info["whois"]){
                if(w.setting.source_info.info.whois["registration_date"]){
                    $(".registration_date", wrapper).text(w.setting.source_info.info.whois["registration_date"]);
                }
                if(w.setting.source_info.info.whois["expiration_date"]){
                    $(".expiration_date", wrapper).text(w.setting.source_info.info.whois["expiration_date"]);
                }
            }
            $(".registration_date", wrapper).text();
        },

        // 网站综合评级
        init_domain_level : function(){
            var w = this;
            var wrapper = $("#rank-nav");
            // 漏洞
            if(w.setting.source_info.info["vuls"]){
                $(".vuls_level", wrapper).html(w.setting.web_level[w.setting.source_info.info.vuls["level"]]);
                if(w.setting.source_info.info.vuls["level_detail"]){
                    $(".vuls_high_total", wrapper).text(w.setting.source_info.info.vuls.level_detail["high"] || 0);
                    $(".vuls_mid_total", wrapper).text(w.setting.source_info.info.vuls.level_detail["mid"] || 0);
                }
            }
            // 服务质量

            // 安全事件
        },

        init_domain_vuls : function(){
            var w = this;
            var total = 0;
            var wrapper = $("#holeInfo-nav");
            if(w.setting.source_info.info.vuls["level"] == "safe"){
                wrapper.hide();
                return;
            }
            if(w.setting.source_info.info.vuls && w.setting.source_info.info.vuls["level_detail"] && w.setting.source_info.vuls){
                $.each(w.setting.source_info.info.vuls["level_detail"], function(point, item){
                    total += parseInt(item);
                });
                var highNow = w.setting.source_info.info.vuls.level_detail["high"];
                w.vuls_high_hole.setOption(common_func.init_pie_option(w.setting.pie_option, w.setting.pie_color["high"], highNow, total));
                $(".vuls_highHole_total", wrapper).text(highNow);
                w.vuls_high_hole.hideLoading();
                if(highNow){
                    if(w.setting.source_info.vuls["50"]){
                        w.init_view.init_append_vuls.call(w, "high", w.setting.source_info.vuls["50"]);
                    }
                }

                var midNow = w.setting.source_info.info.vuls.level_detail["mid"];
                w.vuls_mid_hole.setOption(common_func.init_pie_option(w.setting.pie_option, w.setting.pie_color["mid"], midNow, total));
                $(".vuls_midHole_total", wrapper).text(midNow);
                w.vuls_mid_hole.hideLoading();
                if(midNow){
                    w.init_view.init_append_vuls.call(w, "mid", w.setting.source_info.vuls["40"]);
                }

                var lowNow = w.setting.source_info.info.vuls.level_detail["low"];
                w.vuls_low_hole.setOption(common_func.init_pie_option(w.setting.pie_option, w.setting.pie_color["low"], lowNow, total));
                $(".vuls_lowHole_total", wrapper).text(lowNow);
                w.vuls_low_hole.hideLoading();
                if(lowNow){
                    w.init_view.init_append_vuls.call(w, "low", w.setting.source_info.vuls["30"]);
                }

                var infoNow = w.setting.source_info.info.vuls.level_detail["info"];
                w.vuls_info_hole.setOption(common_func.init_pie_option(w.setting.pie_option, w.setting.pie_color["info"],infoNow , total));
                $(".vuls_infoHole_total", wrapper).text(infoNow);
                w.vuls_info_hole.hideLoading();
                if(infoNow){
                    w.init_view.init_append_vuls.call(w, "info", w.setting.source_info.vuls["20"]);
                }
            }else{
                // 隐藏vuls
            }
        },

        init_append_vuls : function(level, list){
            if(!list){
                list = {count:0};
            }
            var w = this;
            var wrapper = $("#holeInfo-nav");
            var tab = $("#myTab", wrapper);
            var tabParentDiv = $(".tab-content", wrapper);
            var divId = level + "_vuls_info_tag";
            var liClone = $("#one-vuls-tab-li").clone().removeAttr("id");
            $(".tab-href-set", liClone).attr("href", "#" + divId).html(w.setting.vuls_level_map[level]);
            liClone.show().appendTo(tab);
            var tabDiv = $("#tab-vuls-tag").clone().removeAttr("id");
            tabDiv.attr("id", divId);
            $.each(list['vulsinfo'] || {}, function(p, i){
                var colspanId = "colsapn_" + level + "_" + p;
                w.init_view.appendOneTable(colspanId, i, tabDiv, w.setting.source_info.vid["vuls_name_mapper"]);
            });

            tabDiv.show().removeAttr("style").appendTo(tabParentDiv);

            $(".panel-title a:first",tabDiv).trigger("click");
            $(".table", $(".vuls-tab")).DataTable($.extend({
                destroy: true,
                lengthChange:false,
                searching:false
            },_dataTable_setting._static()));

            var firstTab = $('#myTab a:first');
            firstTab.tab('show');
        },

        appendOneTable:function(colspanId,item, div, vidMapper){
            var vid=item['vid'];
            var vname = vidMapper[item['vname'] || item['vid']];
            var table = $("#tab-vuls-table").clone().removeAttr("id");
            var tbody = $(".tab-vuls-tbody", table);
            var aHref = $(".col-span-href", table);
            aHref.attr("href", "#" + colspanId);
            aHref.html(vname);
            $(".dataTables_wrapper", table).attr("id", colspanId);
            $.each(item['vuls_detail'], function(p, i){
                var tr=$("<tr></tr>");
                tr.append($("<td>" + (p+1) + "</td>"));
                if(i['url'].length > 60){
                    i['url'] = i['url'].substr(0, 60) + "...";
                }
                tr.append($("<td></td>").text(i['url']));
                if(i['arg'].length > 40){
                    i['arg'] = i['arg'].substr(0, 40) + "...";
                }
                tr.append($("<td></td>").text(i['arg']));
                tr.append($("<td></td>").text(common_func.getMethod(i["req"])));
                var showPocBtn = $('<button class="btn btn-primary btn-xs poc-btn">查看poc</button>');
                showPocBtn.data("rowkey", i["rowkey"]);
                var td = $("<td></td>");
                showPocBtn.appendTo(td);
                tr.append(td);
                tr.appendTo(tbody);
            });
            div.append(table.show());
        },

        // 初始化网站安全事件
        init_domain_security : function(){
            var w = this;
            if(w.setting.source_info.event && w.setting.source_info.event){

                var sortEvent = common_func.deal_event(w.setting.source_info.event);
                $.each(sortEvent, function(point, item){
                    common_func.initSecurityYear(item["name"], item["value"], w.setting.source_info["event_type"]["event_type_name_mapper"], w.setting.source_info["vid"]["vuls_name_mapper"]);
                });
                var wrapper = $("#rank-nav");
                $(".rank_security_total", wrapper).html(w.setting.source_info.event.length);
                var data = new Date();
                if(sortEvent[data.getFullYear()]){
                    var yearEvent = sortEvent[data.getFullYear()];
                    var month = data.getMonth() + 1;
                    if(yearEvent[month]){
                        var count = 0;
                        $.each(yearEvent[month], function(point, item){
                            count += item.length;
                        });
                        $(".rank_security_month_total", wrapper).html(count);
                    }
                }
            }else{
                $("#event-nav").hide();
            }
        },

        // 初始化网站服务质量
        init_domain_service : function(){
            var w = this;
            var wrapper = $("#rank-nav");
            if(w.setting.source_info.info.survey["visit_data"]){
                var region = [];
                var countTime = [];
                var connect = [];
                var nslook = [];
                var tbody = $(".service_tab_content", $("#web-service-nav"));
                $.each(w.setting.source_info.info.survey["visit_data"], function(point, item){
                    region.push(point);
                    var count = 0;
                    var tr = $("<tr></tr>");
                    tr.append($("<td>" + point + "</td>"));
                    var connect_time = $("<td></td>");
                    if(item["connect_time"] && item["connect_time"] > 0){
                        count += item["connect_time"];
                        connect.push(item["connect_time"]);
                        connect_time.html(item["connect_time"].toFixed(2));
                    }else{
                        connect.push(0);
                        connect_time.html("-");
                    }
                    tr.append(connect_time);
                    var nslook_time = $("<td></td>");
                    if(item["nslookup_time"] && item["nslookup_time"] > 0){
                        count += item["nslookup_time"];
                        nslook.push(item["nslookup_time"]);
                        nslook_time.html(item["nslookup_time"].toFixed(2));
                    }else{
                        nslook.push(0);
                        nslook_time.html("-");
                    }
                    tr.append(nslook_time);
                    if(count == 0){
                        tr.append($("<td>-</td>"));
                    }else{
                        tr.append($("<td>" + count.toFixed(2) + "</td>"));
                    }
                    tbody.append(tr);
                    if(count > 0){
                        w.setting.map_option.series[0].data.push({
                            name:point,
                            value:count
                        });
                    }else{
                        w.setting.map_option.series[0].data.push({
                            name:point,
                            value:100000
                        });
                    }
                    countTime.push(count);
                });
                w.setting.bar_option.xAxis[0].data = region;
                w.setting.bar_option.series[0].data = connect;
                w.setting.bar_option.series[1].data = nslook;
                w.setting.bar_option.series[2].data = countTime;
            }
            w.service_map.setOption(w.setting.map_option);
            w.service_map.hideLoading();
            w.service_bar.setOption(w.setting.bar_option);
            w.service_bar.hideLoading();
            if(w.setting.source_info.info["survey"]){
                if(w.setting.source_info.info.survey["visit_state"]){
                    $(".service_level", wrapper).html("低");
                }else{
                    $(".service_level", wrapper).html("高");
                }
                if(countTime.length > 0){
                    countTime.sort(function(a, b){
                        return b - a;
                    });
                    $(".service_connect_time", wrapper).html(countTime[0].toFixed(2));
                }else{
                    $(".service_connect_time", wrapper).html("-");
                }
            }
        }
    }

    var init_bind = {
        bind:function(){
            var w = this;
            w.myModal = $("#poc-modal");

            w.myModal.on('hidden.bs.modal', function(){
                $(".textareasize").html("");
            });
            // 时间轴绑定事件
            $('.timeline li label').click(function(){
                $('.event_year>li').removeClass('current');
                $(this).parent('li').addClass('current');
                var year = $(this).attr('for');
                $('#'+year).parent().prevAll('div').slideUp(800);
                $('#'+year).parent().slideDown(800).nextAll('div').slideDown(800);
            });
            // 触发时间轴事件
            $('.timeline li label:first').trigger("click");
            // 触发poc click事件
            $(".vuls-tab").on("click", ".poc-btn", function(){
                var target = $(this);
                var rowkey = target.data("rowkey");
                if(w.setting.flag && rowkey){
                    $.post(__WEBROOT__ + "/Home/AssetReport/queryPoc", {rowkey:rowkey}).success(function(json){
                        if(json["code"] == 0){
                            var map =json["map"];
                            if(map.request_header){
                                $("#req-header", w.myModal).html(common_func.showHtml(map.request_header));
                            }
                            if(map.response && map.response.length > 0){
                                if(map.response.indexOf("\r\n\r\n") > -1){
                                    var point = map.response.indexOf("\r\n\r\n");
                                    var resHeader = map.response.substr(0, map.response.indexOf("\r\n\r\n"));
                                    var resBody = map.response.substr(point + 4, map.response.length);
                                    $("#res-header", w.myModal).text(resHeader);
                                    $("#res-body", w.myModal).text(resBody);
                                }else{
                                    $("#res-body", w.myModal).text(common_func.showHtml(map.response));
                                }
                            }
                            if($.trim((map.request_header || "")).length>0 || $.trim(map.response.length) > 0){
                                w.myModal.modal("show");
                            }else{
                                $("#req-header", w.myModal).html("");
                                $("#res-header", w.myModal).text("");
                                $("#res-body", w.myModal).text("");
                                swal({ title: "Success!", text: "无POC信息！",    type: "success",   confirmButtonText: "确定" });
                            }
                        }else{
                            swal({   title: "Error!",   text: "信息获取失败！",   type: "error",   confirmButtonText: "确定" });
                        }
                    });
                }
            });
        }
    }

    var init = function(){
        var w = this;
        var sourceInfo = $("#source_info").val();
        var flag = $("#report_flag").val();
        if(flag){
            w.setting.flag = false;
        }
        w.setting.source_info = $.parseJSON(decodeURIComponent(sourceInfo));
        w.init_view.init_component.call(w);
        w.init_view.init_domain_info.call(w);
        w.init_view.init_domain_level.call(w);
        w.init_view.init_echart.call(w, function(){
            w.init_view.init_domain_vuls.call(w);// 漏洞
            w.init_view.init_domain_service.call(w);// 服务质量
        });
        w.init_view.init_domain_security.call(w);
        w.init_bind.bind.call(w);
    }

    $(document).ready(function(){
        var report = new Report();
        report.init.call(report);
    });

})();
