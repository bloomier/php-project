(function(){
    var chartElementInfo = {"high":"vuls_highHole", "mid":"vuls_midHole", "low":"vuls_lowHole", "info":"vuls_infoHole"};
    var echartPart = ["high", 'mid', 'low', 'info'];
    var vulsLevelMap = {"high":"高危漏洞", "mid":"中危漏洞", "low":"低危漏洞", "info":"信息"}
    var chartElementColor = {
        "high":['#d32a03', '#ddd'],
        "mid":['#ff7a04', '#ddd'],
        "low":['#ffcd04', '#ddd'],
        "info":['#CDE71B', '#ddd']
    }
    var vulsInfo;

    var o={
        init:function(){
            var w=this;
            var vulsContent = vulsInfo['vulsInfo']['vuls'];
            var wrapper = $("#holeInfo-nav");
            view.init.call(this,function(){
                var total = vulsContent['vulscount'] || 100;
                $.each(echartPart, function(point, item){
                    var vuls = vulsContent[item];
                    var now = 0;
                    var sub = 100 -now;
                    var count = 0;
                    if(vuls){
                        var now = vuls['count'] * 100/total;
                        var sub = 100 - now;
                        count = vuls['count'];
                        if(String(now).indexOf(".")>-1){
                            now = now.toFixed(2);
                            sub = sub.toFixed(2);
                        }
                    }
                    $("." + chartElementInfo[item] + "_total").html(count);
                    w.echartEle[item].setOption(option.holePieOption(now,sub, chartElementColor[item]));
                });
            });
            append.init();
            scoller.init();
        }
    }

    var content = {
        init : function(){
            vulsInfo = $("#vuls_info_content_src").val();
            vulsInfo = decodeURIComponent(vulsInfo);
            vulsInfo = $.parseJSON(vulsInfo);
            console.info(vulsInfo);
        }
    }

    var view = {
        init: function (callback) {
            var w=this;
            w.echartEle=[];
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map',
                    'echarts/chart/line',
                    'echarts/chart/bar',
                    'echarts/chart/pie'
                ],
                function (ec) {
                    var height = window.screen.height;
                    $.each(chartElementInfo, function(point, item){
                        $('#' + item).height("200px");
                    });
                    $.each(echartPart, function(point, item){
                        w.echartEle[item] = ec.init(document.getElementById(chartElementInfo[item]));
                    });
                    callback&&callback.call(w);
                }
            );
        }
    }

    var append={
        init:function(param){
            var w = this;
            w.initWebsiteInfo(vulsInfo['websiteInfo']);
            w.initWebLevel(vulsInfo['vulsInfo']['web_rank']);
            w.initWebVuls(vulsInfo['vulsInfo']['vuls']);
            w.initWebSecurity(vulsInfo['vulsInfo']['security']);
            w.initWebSafeState(vulsInfo['vulsInfo']['safe_status']);
            w.initBind();
        },
        initBind:function(){
            $('.timeline li label').click(function(){
                $('.event_year>li').removeClass('current');
                $(this).parent('li').addClass('current');
                var year = $(this).attr('for');
                //console.info(year);
                $('#'+year).parent().prevAll('div').slideUp(800);
                $('#'+year).parent().slideDown(800).nextAll('div').slideDown(800);
            });
            $('.timeline li label:last').trigger("click");
        },
        initWebsiteInfo:function(param){
            var wrapper = $("#webInfo");
            var item = ["domain_title", "domain_ip", "domain_web", "domain_region"];
            $.each(item, function(point, item){
                var value = param[item];
                if(item=='domain_title' || item == "domain_web"){
                    value = value.length > 15 ? "<abbr title='" + value + "'>" + value.substr(0,15) + "...</abbr>" : value;
                }
                $("." + item, wrapper).html(value);
            });
        },
        initWebLevel:function(param){
            var wrapper = $("#rank");
            $.each(param, function(point, item){
                $("." + point, wrapper).html(item);
            });
        },
        initWebSecurity:function(param){
            var w = this;
            if(param.length == 0){
                $("#event-nav").hide();
                $(".security-tag", $("#bs-example-navbar-collapse-1")).hide();
                return;
            }
            $.each(param, function(point, item){
                if(point!='count'){
                    w.initSecurityYear(point, item);
                }
            });
        },
        initSecurityYear:function(point, item){
            var year = point;
            var w = this;
            $(".event_year").append($("<li><label for='" + point + "'>" + point + "</label></li>"));
            var yearDiv = $("<div class='list'></div>");
            $.each(item, function(p, v){
                if(p != 'count'){
                    yearDiv.append($("<h3 id='" + point + "'>" + p + "</h3>"));
                    w.initSecurityMonth(p, v, yearDiv);
                    yearDiv.appendTo($(".event_list"));
                }
            });
        },
        initSecurityMonth:function(point, item, yearDiv){
            var month = point;
            var w = this;
            $.each(item, function(p, v){
                if(p != 'count'){
                    w.initSecurityDay(p, v, yearDiv)
                }
            });
        },
        initSecurityDay:function(point, item, yearDiv){
            var month = point;
            var w = this;
            $.each(item, function(p, v){
                if(p != 'count'){
                    var deal_state=v['event_deal_state'];
                    var event_id = v['event_id'];
                    var event_snapshot = v['event_snapshot'] || "";
                    var audit_date = v['audit_date'] || "";
                    var event_poc = v['event_poc'];
                    var wraper = $("#one-event-time").clone().removeAttr("id");
                    $(".event_date",wraper).html(point);
                    $(".type",wraper).html(v['event_type']);
                    $(".this_event_url",wraper).html(v['event_url'])
                    $(".repair",wraper).html("未审核");
                    wraper.show().appendTo(yearDiv);
                }
            });
        },
        initWebSafeState:function(param){
            var wrapper = $("#status-nav");
            var w = this;
            if(!param){
                return;
            }
            if(param['sub_domain']){
                w.initSafeState(param['sub_domain'], $("#safe-web-sub"));
            }
            if(param['room_domain']){
                w.initSafeState(param['room_domain'], $("#safe-web-room"));
            }
            if(param['ip_domain']){
                w.initSafeState(param['ip_domain'], $("#safe-web-ip"));
            }
            $(".table", $(".safe-state-table")).dataTable(storm.defaultStaticGridSetting());
        },
        initSafeState:function(param, div){
            var tbody = $(".tbody_value", div);
            if(!param){
                return;
            }
            $.each(param, function(point, item){
                var title = (item['title'] || item['domain'] || item['sid'] || item);
                if(title.length > 15){
                    title = "<abbr title='" + title + "'>" + title.substr(0,15) + "...</abbr>";
                }
                if(item['info']){
                    var encrptyDomain = $("<a class='btn btn-default' target='_black' role='button'>查看报告</a>");
                    var path = "domainReport?url=" + encodeURIComponent(item['encryptDomain']);
                    encrptyDomain.attr("href", path);
                }else{
                    if(item['info']){
                        var encrptyDomain = '-';
                    }
                }
                var status = {"high":"高","mid":"中","low":"低","info":"信息"}
                var tr = $("<tr></tr>");
                tr.append($("<td>" + title + "</td>"));
                tr.append($("<td>" + ((item['info'] && status[item['info']['status']]) || '-') + "</td>"));
                tr.append($("<td>" + ((item['info'] && item['info']['security']) || '-') + "</td>"));
                tr.append($("<td>" + ((item['info'] && item['info']['high']) || '-') + "</td>"));
                tr.append($("<td>" + ((item['info'] && item['info']['mid']) || '-') + "</td>"));
                tr.append($("<td>" + ((item['info'] && item['info']['low']) || '-') + "</td>"));
                tr.append($("<td>" + ((item['info'] && item['info']['info']) || '-') + "</td>"));
                var option = $("<td></td>");
                option.append(encrptyDomain);
                tr.append(option);

                tbody.append(tr);
            });
        },
        initWebVuls:function(param){
            var w = this;
            var wrapper = $("#holeInfo-nav");
            var tab = $("#myTab", wrapper);
            var tabParentDiv = $(".tab-content", wrapper);
            if(param['vulscount'] == 0){
                $("#holeInfo-nav").hide();
                $(".vuls-tag", $("#bs-example-navbar-collapse-1")).hide();
                return;
            }
            $.each(echartPart, function(point, item){
                var vuls = param[item];

                if(vuls){
                    var divId = item + "_vuls_info_tag";
                    var liClone = $("#one-vuls-tab-li").clone().removeAttr("id");
                    $(".tab-href-set", liClone).attr("href", "#" + divId).html(vulsLevelMap[item]);

                    liClone.show().appendTo(tab);
                    var tabDiv = $("#tab-vuls-tag").clone().removeAttr("id");
                    tabDiv.attr("id", divId);
                    $.each(vuls['vulsinfo'], function(p, i){
                        var colspanId = "colsapn_" + item + "_" + p;
                        w.appendOneTable(colspanId, i, tabDiv);
                    });
                    tabDiv.show().removeAttr("style").appendTo(tabParentDiv);
                    $(".panel-title a:first",tabDiv).trigger("click");
                }
            });
            $(".table", $(".vuls-tab")).dataTable(storm.defaultStaticGridSetting());
            var firstTab = $('#myTab a:first');
            firstTab.tab('show');
        },
        appendOneTable:function(colspanId,item, div){
            var vid=item['vid'];
            var vname = item['vname'] || item['vid'];
            var table = $("#tab-vuls-table").clone().removeAttr("id");
            var tbody = $(".tab-vuls-tbody", table);
            var aHref = $(".col-span-href", table);
            aHref.attr("href", "#" + colspanId);
            aHref.html(vname);
            $(".dataTables_wrapper", table).attr("id", colspanId);
            $.each(item['vuls_detail'], function(p, i){
                var tr=$("<tr></tr>");
                tr.append($("<td>" + (p+1) + "</td>"));
                tr.append($("<td></td>").text(i['url']));
                tr.append($("<td>查看</td>"));
                tr.appendTo(tbody);
            });
            div.append(table.show());
        }
    }

    var scoller = {
        init:function(){
            var w = this;
            /*页面滚动*/
            $(window).scroll( function() {
                var scrollValue=$(window).scrollTop();
                scrollValue > 100 ? $('.scroll').slideDown():$('.scroll').slideUp();
            });

            $('.scroll').click(function(){
                $("html,body").animate({scrollTop:0},200);
            });

            $(".domina-report-export").bind("click", function(){
                var href ="exportReport?url=" + $("#vuls_src_url").val();
                window.open(href);
            });
        }
    }

    var option = {
        holePieOption:function(now, sub, color){
            var option = {
                color: color,
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
                                value:now,
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
                                value:sub,
                                name:'其他'
                            }
                        ]
                    }
                ]
            }
            return option;
        }
    }

    $(document).ready(function(){
        content.init();// 请求数据
        o.init();
    });
})();


