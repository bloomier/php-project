/**
 * Created by jianghaifeng on 2016/1/5.
 */
var vuls;
(function(){

    var chartElementColor = {
        "high":['#d32a03', '#ddd'],
        "mid":['#ff7a04', '#ddd'],
        "low":['#ffcd04', '#ddd'],
        "info":['#CDE71B', '#ddd']
    }

    var policyNameMap = {

    }

    var vlusPart = ["high", 'mid', 'low', 'info'];
    var vulsLevelMap = {"high":"高危漏洞", "mid":"中危漏洞", "low":"低危漏洞", "info":"信息"};

    var __function__={
        commonOption:function(){
            var option={
                color: "",
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
            }
            return option;
        },
        initVulsPieInfo:function(obj, option, value, total ,color){
            option.color=color;
            var now = 0;
            var sub = 100 -now;
            var count = 0;
            if(value){
                var now = value['count'] * 100/total;
                var sub = 100 - now;
                count = value['count'];
                if(String(now).indexOf(".")>-1){
                    now = now.toFixed(2);
                    sub = sub.toFixed(2);
                }
            }
            option.series[0].data[0].value=now;
            option.series[0].data[1].value=sub;
            obj.setOption(option);
        },
        appendOneTable:function(colspanId, item, div){
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
        },
        initSecurity:function(point, item, obj, tabObj){
            var tmpDiv = $("#one_year_security_event").clone().removeAttr("id");
            tmpDiv.attr("id", point);
            $.each(item, function(month_p, month_v){
                if(month_p != 'count'){
                    $.each(month_v, function(day_p, day_v){
                        if(day_p != 'count'){
                            $.each(day_v, function(event_p, event_v){
                                if(event_p != 'count'){
                                    var deal_state=event_v['event_deal_state'];
                                    var audit_date = event_v['audit_date'] || "";
                                    var wraper = $("#one_security_event_div").clone().removeAttr("id");
                                    $(".event_time",wraper).html(day_p);// 审核时间
                                    var tempEventType = event_v['event_type'];
                                    if(policyNameMap[event_v['event_type']]){
                                        tempEventType = policyNameMap[event_v['event_type']];
                                    }
                                    $(".event_type",wraper).html(tempEventType);
                                    $(".event_url",wraper).html(event_v['event_url']);
                                    $(".event_status",wraper).html(deal_state);
                                    wraper.show().appendTo(tmpDiv);
                                }
                            });
                        }
                    });
                }
            });
            tmpDiv.show().appendTo(obj);
            tabObj.append($("<li><a href='#" + point + "' data-toggle='tab'>" + point + "年</a></li>"));
        },
        fnClearDataTable:function(name){
            var w=this;
            if(w[name]){
                w[name].fnClearTable();
            }
        },
        fnDrawDataTable:function(name,dom,lineNum){
            var w=this;
            if(!w[name]){
                w[name]= dom.dataTable(storm.defaultStaticGridSetting());
            }else{
                w[name].fnDestroy();
                w[name]=dom.dataTable(storm.defaultStaticGridSetting());
            }
            w[name].fnDraw();
        },
        initSafeState:function(param, obj, tableName){
            __function__.fnClearDataTable(tableName);
            var tbody = $(".tbody_value", obj);
            if(!param){
                return;
            }
            $.each(param, function(point, item){
                //console.info(item);
                var title = (item['title'] || item['domain'] || item['sid'] || item);
                if(title.length > 15){
                    title = "<abbr title='" + title + "'>" + title.substr(0,15) + "...</abbr>";
                }
                var encrptyDomain = '-';
                if(item['info']){
                    //encrptyDomain = $("<a class='btn btn-default' target='_black' role='button'>查看报告</a>");
                    //var path = "domainReport?url=" + encodeURIComponent(item['encryptDomain']);
                    //encrptyDomain.attr("href", path);
                }else{
                    if(item['info']){
                        encrptyDomain = '-';
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
                //tr.append($("<td>" + encrptyDomain + "</td>"));
                var option = $("<td></td>");
                option.append(encrptyDomain);
                tr.append(option);
                tbody.append(tr);
            });
            //__function__.fnDrawDataTable(tableName,$("#"+tableName),8);
            $("#"+tableName).DataTable(_dataTable_setting._report());
        }
    }


    vuls={
        init:function(currentDateKey,domain,callback){
            var w=this;
            w.domain=domain;
            //初始化策略信息
            vuls.view.initPolicy(w);
            vuls.loadData.call(w,w.domain,function(){
                vuls.view.load.call(w);
                callback&&callback();
            });

        },
        options:{
            high_vuls_pie:__function__.commonOption(),
            mid_vuls_pie:__function__.commonOption(),
            low_vuls_pie:__function__.commonOption(),
            info_vuls_pie:__function__.commonOption()
        },

        loadData:function(domain,callback){
            //var w=this;
            //$.post(__ROOT__+"/Home/DailyReport/vulsData",{domain:domain}).success(function(json){
            //    w.vulsData=json;
            //    callback&&callback();
            //});

            var w=this;
            //var monitorDataValue = $("#monitorDataSrc").val();
            var vulsJson = $.parseJSON($("#vuls_data").text());
            if(vulsJson){
                w.vulsData = vulsJson;
                //console.info(vulsJson);
                callback&&callback();
            }else{
                //domain = 'www.dbappsecurity.com.cn';
                $.post(__ROOT__+"/Home/DailyReport/vulsData",{domain:domain}).success(function(json){
                    w.vulsData=json;
                    callback&&callback();
                });
            }

        },
        view:{
            initPolicy: function(){
                $.ajax({
                    async: false,
                    type : "POST",
                    dataType : 'json',
                    url: __ROOT__ + "/Home/DailyReport/getPolicyData",
                    success:function(json){
                        policyNameMap = json;
                    }
                });
            },
            load:function(){
                var w=this;
                vuls.view.initVulsSummary.call(w, w.vulsData['vulsInfo']['web_rank']);// web level
                vuls.view.echarts_prepare.call(w,function(){ // web vuls pie
                    var vulsCount = w.vulsData['vulsInfo']['vuls']['vulscount'] || 100;
                    var vulsInfo = w.vulsData['vulsInfo']['vuls'];
                    __function__.initVulsPieInfo.call(w, w.high_vuls_pie, vuls.options.high_vuls_pie, vulsInfo['high'], vulsCount,chartElementColor['high']);
                    __function__.initVulsPieInfo.call(w, w.mid_vuls_pie, vuls.options.mid_vuls_pie, vulsInfo['mid'], vulsCount,chartElementColor['mid']);
                    __function__.initVulsPieInfo.call(w, w.low_vuls_pie, vuls.options.low_vuls_pie, vulsInfo['low'], vulsCount,chartElementColor['low']);
                    __function__.initVulsPieInfo.call(w, w.info_vuls_pie, vuls.options.info_vuls_pie, vulsInfo['info'], vulsCount,chartElementColor['info']);
                });
                vuls.view.initWebVuls.call(w, w.vulsData['vulsInfo']['vuls']); // web vuls info

                vuls.view.initWebSecurity.call(w, w.vulsData['vulsInfo']['security']); // web security info

                vuls.view.initSafeState.call(w, w.vulsData['vulsInfo']['safe_status']);
            },
            initVulsSummary:function(param){
                var summary = $("#vuls_summary");
                $.each(param, function(point, item){
                    $("." + point, summary).html(item);
                });
            },
            initWebVuls:function(param){
                var w = this;
                var tab = $("#vuls_tag_page");
                var tabParentDiv = $("#vuls_tag_content");
                tab.html("");
                tabParentDiv.html("");
                if(param['vulscount'] == 0){
                    $("#vuls_tag_page,#vuls_tag_content").hide();
                    return;
                }
                $.each(vlusPart, function(point, item){
                    var vuls = param[item];
                    if(vuls){
                        // 添加 page_tag
                        var divId = item + "_vuls_info_tag";
                        var liClone = $("#one-vuls-tab-li").clone().removeAttr("id");
                        $(".tab-href-set", liClone).attr("href", "#" + divId).html(vulsLevelMap[item]);
                        liClone.show().appendTo(tab);

                        // 添加tag_content
                        var tabDiv = $("#tab-vuls-tag").clone().removeAttr("id");
                        tabDiv.attr("id", divId);
                        $.each(vuls['vulsinfo'], function(p, i){
                            var colspanId = "colsapn_" + item + "_" + p;
                            __function__.appendOneTable(colspanId, i, tabDiv);
                        });
                        tabDiv.show().removeAttr("style").appendTo(tabParentDiv);
                        $(".panel-title a:first",tabDiv).trigger("click");
                    }
                });
                //$(".table", $(".vuls-tab")).dataTable(storm.defaultStaticGridSetting());
                $(".table", $(".vuls-tab")).DataTable(_dataTable_setting._report());
                var firstTab = $('#vuls_tag_page a:first');
                firstTab.tab('show');
            },

            initWebSecurity:function(values){
                var wrapper = $("#web_vuls_security");
                var parentWrapper = $("#web_vuls_security_wrapper");
                var parentWrapperTag = $("#web_vuls_security_tag");
                if(values.length == 0){
                    wrapper.hide();
                }
                parentWrapper.html("");
                parentWrapperTag.html("");
                $.each(values, function(point, item){
                    if(point!='count'){
                        __function__.initSecurity(point, item, parentWrapper, parentWrapperTag);
                    }
                });
                var firstTab = $('#web_vuls_security_tag a:first');
                firstTab.tab('show');
            },

            initSafeState:function(values){
                //console.info(values);
                if(!values){
                    return;
                }
                if(values['sub_domain']){
                    __function__.initSafeState(values['sub_domain'], $("#web_safe_sub_table"), "web_safe_sub_table");
                }
                if(values['room_domain']){
                    __function__.initSafeState(values['room_domain'], $("#web_safe_room_table"), "web_safe_room_table");
                }
                if(values['ip_domain']){
                    __function__.initSafeState(values['ip_domain'], $("#web_safe_ip_table"), "web_safe_ip_table");
                }
            },

            echarts_prepare:function(callback){
                var w=this;
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });
                require(
                    [
                        'echarts',
                        'echarts/chart/pie'
                    ],
                    function (ec) {
                        if(!w.echartInited){
                            $(".vuls_echarts",$("#vuls")).each(function(i,obj){
                                var objEle = $(obj);
                                objEle.height("200px");
                                var _id=objEle.attr("id");
                                w[_id]=ec.init(document.getElementById(_id));
                            });
                            w.echartInited=true;
                        }
                        callback&&callback.call(w);
                    });
            }
        }

    }


})();
