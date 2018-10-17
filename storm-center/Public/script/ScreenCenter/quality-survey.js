(function(){
    var mySwiper;
    var QualitySurvey=function(){
        this.__constants__=__constants__;
        this.scoller=scollers;
        this.__functions__=__functions__;
        this.config=config;
        this.mapCharts=mapCharts;
        this.handler=handler;
        this.init=init;

    }
    var __constants__={
        animation:"a-flipinY a-flipoutY",
        intervals:{
            warning_refresh:60*1000,
            errorDomain_refresh:60*1000,
            sends_refresh:60*1000,
            nodeState_refresh:5*60*1000,
            domainState_refresh:60*1000,
            siteAvail_refresh:60*1000,
            siteAlert_refresh:60*1000
        },
         msg_type:{
        "sms":"短信告警",
        "mail":"邮件通知",
        "mixin":"密信告警"
        }
    }
    var __functions__={
        getShowDomain:function(type){ // type为0表示前一个， type为1表示下一个
            var w = this;
            var modal = $("#alert_modal");
            var nowDomain = $(".now_domain", modal).val();
            var result = [];
            var i = 0;
            for(; i < w.alert_data_info.length; i++){
                var tmp = w.alert_data_info[i];
                if(tmp.domain == nowDomain){
                    break;
                }
            }
            if(type){
                i = i + 1;
                result.domain = w.alert_data_info[i];
            }else{
                i = i - 1;
                if(i >= 0){
                    result.domain = w.alert_data_info[i];
                }
            }
            if(i == (w.alert_data_info.length - 1)){
                result.type = 1;
            }
            return result;
        },

        cutstr:function(str,len){
            if(str.length>len){
                return str.substr(0,len)+"...";
            }else{
                return str;
            }
        },
        convertLong2Time:function(millSecs){
            var secs= Math.floor(millSecs/1000);
            var day= Math.floor(secs/86400);
            var hour= Math.floor(secs%86400/3600);
            var min= Math.floor(secs%3600/60);
            var second= Math.floor(secs%60);
            var s="";
            if(day>0){
                s=s+day+"天";
            }
            if(hour>0){
                s=s+hour+"小时";
            }
            if(min>0){
                s=s+min+"分";
            }
            if(second>0){
                s=s+second+"秒";
            }
            return s;
        },
        mapBindDomain:function(mapId,domain){
            $("#"+mapId).attr("domain",domain);
        },
        showMapByMapId:function(mapId){
            var w=this;
            if( $("#"+mapId).attr("domain")){
                $("#"+mapId).prev().removeClass(w.__constants__.animation).addClass('a-flipoutY').hide();
                $("#"+mapId).removeClass(w.__constants__.animation).addClass('a-flipinY').show();
            }
        },
        getMapBindDomains:function(){
            var  maps=$(".mapChart");
            var domains=[];
            $.each(maps,function(i,map){
                if($(map).attr("domain")){
                    domains.push($(map).attr("domain"));
                }
            });
            return domains;
        },
        getMapCharIdByDomain:function(domain){
            return $("[domain='"+domain+"']",".map").attr("id");
        },
        scroll: function(dom){
            var y = 0;
            var innerEl = $('#'+dom);
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);
            d3.timer(function(){
                y = y - 0.2;
                innerEl.css({
                    top: y
                });
                waitEl.css({
                    top: y + innerEl.height()
                });

                if(y * -1 > innerEl.height()){
                    y = 0;
                    var tmp = innerEl;

                    innerEl = waitEl;
                    waitEl = tmp;
                }
            });
           /* var time;
            function start(){
                time = setInterval(function(){
                    y = y - 0.2;
                    innerEl.css({
                        top: y
                    });
                    waitEl.css({
                        top: y + innerEl.height()
                    });

                    if(y * -1 > innerEl.height()){
                        y = 0;
                        var tmp = innerEl;

                        innerEl = waitEl;
                        waitEl = tmp;
                    }
                },speed||20);
            }
            function stop(){
                clearInterval(time);
            }
            innerEl.mouseenter(function(){
                stop();
            });
            innerEl.mouseleave(function(){
                start();
            });
            start();*/
        },
        swiper : function () {
            mySwiper = new Swiper('.swiper-container', {
                loop: true,
                observer:true,
                slidesPerView: 3,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                preloadImages: true,
                updateOnImagesReady : true,
                spaceBetween: 5,
                autoplay: 4000,
                autoplayDisableOnInteraction: false
            });
            //$('.swiper-container').hover(function () {
            //    mySwiper.stopAutoplay();
            //}, function () {
            //    mySwiper.startAutoplay();
            //});

        },
        slider: function(dom,item){
            var x = 0;
            var innerEl = $('#'+dom);
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            //innerEl.width( item*)
            rollEl.append(waitEl);
            d3.timer(function(){
                x = x - innerEl.width()/item;
                innerEl.css({
                    left: x
                });
                waitEl.css({
                    left: x + innerEl.width()/item
                });

                if(x * -1 > innerEl.width()/item){
                    x = 0;
                    var tmp = innerEl;

                    innerEl = waitEl;
                    waitEl = tmp;
                }
            });

        }

    };
    var init=function(){
        this.config.call(this);
        this.scoller.init.call(this);
        this.mapCharts.init.call(this);
        this.handler.init.call(this);
    }
    var config=function(){
        var w=this;
        w.domainMapper={};
        w.contractIds=$("#contractIds").val();
        var config_domains=$("#config_domains").val().split(",");
        var  index=0;
        config_domains.forEach(function(domain){
            index++;
            w.__functions__.mapBindDomain("map"+index,domain);
        });
        $.ajax({
            url:__WEBROOT__+"/ScreenCenter/QualitySurvey/domainList",
            data: {ids: w.contractIds},
            type: "POST",
            async:false,
            success:function(json){
                if(json.code>0){
                    w.domainMapper=json.data;
                    $.each(json.data,function(domain,title){
                        $(".select").append("<option value='"+domain+"'>"+title+"</option>");
                    });
                    $(".select").select2();
                }
            }
        });
        $(".h-select").hide();
    };
    var scollers={
        init:function(){
            var w=this;
            w.__functions__.scroll('fault');
            w.__functions__.scroll('info');
            w.__functions__.scroll('errors');

            w.scoller.warnings.call(w);
            w.scoller.nodes.call(w);
            w.scoller.domains.call(w);
            w.scoller.sends.call(w);
            w.scoller.errorDomains.call(w);
            setInterval(function(){
                w.scoller.warnings.call(w);
            }, w.__constants__.intervals.warning_refresh);


            setInterval(function(){
                w.scoller.nodes.call(w);
            }, w.__constants__.intervals.nodeState_refresh);
            setInterval(function(){
                w.scoller.domains.call(w);
            }, w.__constants__.intervals.domainState_refresh);
            setInterval(function(){
                w.scoller.sends.call(w);
            }, w.__constants__.intervals.sends_refresh);
            setInterval(function(){
                w.scoller.errorDomains.call(w);
            }, w.__constants__.intervals.errorDomain_refresh);

            w.scoller.domainDetails.call(w);

            w.scoller.loadImg.call(w);

        },
        warnings:function(){
            var w=this;
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/warning",{ids:w.contractIds}).success(function(json){
                if(json.code>0){
                    var data=json.data;

                    var arrs=[];
                    var jsonArr={};
                    $.each(data,function(k,d){
                        arrs.push(d[d.length-1]);
                        d.forEach(function(_item){
                            if(_item.status==0){
                                if(!jsonArr[_item.domain]){
                                    jsonArr[_item.domain]={count:1,domain:_item.domain,title:_item.title,continueTime:_item.continueTime};
                                }else{
                                    var _data=jsonArr[_item.domain];
                                    _data.count=_data.count+1;
                                    _data.continueTime=_data.continueTime+_item.continueTime;
                                    jsonArr[_item.domain]=_data;
                                }
                            }

                        });
                    });

                    arrs.sort(function(a,b){
                        var da = new Date(a.happen_time.replace(/-/g, "/"));
                        var db = new Date(b.happen_time.replace(/-/g, "/"));
                        return db.getTime()- da.getTime();
                    });

                    var warper=$('.fault-tracing',$(".view-warning"));
                    warper.html();
                    arrs.forEach(function(d){
                        var statusCls=(d.status==0?"f-status-bad":"f-status-ok");
                       var item ="<div class='f-list'><div class='f-status "+statusCls+"'>"+ (d.status==0?"网站故障":"恢复正常")+"</div>" +
                            "<div class='f-content'><div class='f-title'>"+ (d.title|| d.domain)+"</div> " +
                            "<div class='f-info'><span>"+ d.happen_time+"</span><span>持续"+ d.contineTimeDesc+"</span></div>" +
                            "</div> " +
                            "</div>";
                        warper.append(item)
                    });

                    var arr2=[];
                    $.each(jsonArr,function(k,d){
                        arr2.push(d);
                    });
                    arr2.sort(function(a,b){

                        return b.continueTime- a.continueTime;
                    });

                    var staticWraper=$("tbody",$("#errorStatic"));
                    staticWraper.html("");
                    var importantStaticWraper=$("tbody",$("#importantErrorStatic"));
                    importantStaticWraper.html("");
                    var configDomains=w.__functions__.getMapBindDomains();
                    arr2.forEach(function(item){
                        var dateStr=__functions__.convertLong2Time(item.continueTime);
                        //item.title=__functions__.cutstr(item.title,5);
                       var str=item.title||item.domain,
                           str1 = str.charAt(str.length - 1);
                        if(str1=='/'){
                            str=str.substring(0,str.length-1);
                        }

                        var tr=  $("<tr> <td style='width: 46.3%;' title="+str+">"+str+"</td> <td style='width: 33.3%;'>"+dateStr+"</td><td style='width: 20.3%; text-align: center'>"+item.count+"</td> <td/></tr>");
                        staticWraper.append(tr);

                        if($.inArray(item.domain,configDomains)!=-1){
                            var tr2=tr.clone();

                            importantStaticWraper.append(tr2);
                        }
                    });
                }
            });

        },
        nodes:function(){
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/nodeCount").success(function(json){
                if(json.code>0){
                    $("span:eq(0)","#header-node").text(json.data.total-json.data.ok);
                    $("span:eq(1)","#header-node").text(json.data.total);
                }
            });
        },
        domains:function(){
            var w=this;
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/domainCount",{ids:w.contractIds}).success(function(json){
                if(json.code>0){
                    $("span:eq(0)","#header-site").text(json.data.total-json.data.ok);
                    $("span:eq(1)","#header-site").text(json.data.total);
                }
            });
        },
        domainDetails:function(){
            var w=this;
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/domainStatus",{ids:w.contractIds}).success(function(json){
                if(json.code>0){
                    var items=json.items;
                    $.each(items,function(i,item){
                        setTimeout(function(){
                            $(".web","#header-desc").text(item.title||item.domain).removeClass('a-fadeinR').hide().show().addClass('a-fadeinR');
                            $(".web-status","#header-desc").text(item.status==0?"网站故障":"访问正常").removeClass('a-fadeinR red blue').hide().show().addClass('a-fadeinR');

                            if(item.status==0){
                                $(".web-status","#header-desc").addClass('red')
                            }
                            else{
                                $(".web-status","#header-desc").addClass('blue')
                            }if(i>=items.length-1){
                                setTimeout(function(){
                                    w.scoller.domainDetails.call(w);
                                },1500);
                            }
                        },i*1500);
                    });
                }
            });
        },
        sends:function(){
            var w=this;
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/sends",{ids:w.contractIds}).success(function(json){
                if(json.code<0){
                    return;
                }
                var wraper=$("tbody",$("#sendsTable"));
                wraper.html('');
                var data=json.data;
                var arrs=[];
                $.each(data,function(k,items){
                    items.forEach(function(item){
                        arrs.push(item);
                    });
                });
                arrs.sort(function(a,b){
                    var da = new Date(a.happen_time.replace(/-/g, "/"));
                    var db = new Date(b.happen_time.replace(/-/g, "/"));
                    return db.getTime()- da.getTime();
                });
                arrs.forEach(function(item){

                    var str=item.title||item.domain,
                        str1 = str.charAt(str.length - 1);
                    if(str1=='/'){
                        str=str.substring(0,str.length-1);
                    }
                    var item="<tr><td>"+item.happen_time.split(" ")[1]+"</td><td title="+str+">"+str+"</td><td>"+(item.name||item.to)+"</td> <td>"+w.__constants__.msg_type[item.type]+"</td><td style='display: none;' class='sendStatus'>"+item.status+"</td> </tr>";
                    wraper.append(item);

                });

                $('.sendStatus').filter(function(){
                    if($(this).text()==0){
                        $(this).siblings().addClass('red')
                    }

                });

            });
        },
        errorDomains:function(){
            var w=this;
            $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/domainStatus",{ids:w.contractIds}).success(function(json){
                if(json.code>0){
                    var items=json.items;
                    var warper=$('.fault-tracing',$(".view-errorDomains"));
                    warper.html("");
                    var arrs=[];
                    $.each(items,function(i,d){

                        if(d.status==0){
                            arrs.push(d);
                        }
                    });
                    arrs.sort(function(a,b){
                        return b.startTime- a.startTime;
                    });
                    arrs.forEach(function(d){
                        var statusCls=(d.status==0?"f-status-bad":"f-status-ok");
                        var item ="<div class='f-list'><div class='f-status "+statusCls+"'>"+ (d.status==0?"网站故障":"恢复正常")+"</div>" +
                            "<div class='f-content'><div class='f-title'>"+ (d.title|| d.domain)+"</div> " +
                            "<div class='f-info'><span>"+ d.startTime+"</span><span>至今</span></div>" +
                            "</div> " +
                            "</div>";
                        warper.append(item);
                    });


                }

            });
        },
        loadImg:function(){
            var w=this;
            var wraper=$("#site-img");
            wraper.html('');
            var domainList= w.__functions__.getMapBindDomains();
            $.each(domainList, function(point, item){
                var defaultImg=0;
                if(w.webstatus&&w.webstatus[item]){
                    var status=w.webstatus[item].value;
                    if(status==0){
                        defaultImg=1;//如果网站不可访问 ,设为默认不可访问的图片
                    }
                }
                var src=__WEBROOT__+"/ScreenCenter/QualitySurvey/getImg?domain="+item+"&small=1&defaultImg="+defaultImg;
                var img= "<div class='swiper-slide'> <img src='"+src+"' alt='' ><div class='info'><p class='title'>"+ w.domainMapper[item]+"</p> <p class='domain'></p> </div> </div>";
                $("#site-img").append(img);

            });
            //w.__functions__.swiper();
        }
    };

    var mapCharts={
        init:function(){
            var w=this;
            w.alert_modal = $("#alert_modal");
            w.alert_modal_state = false;// modal状态
            w.alert_modal.modal({backdrop:'static'});// 禁止点击空白处关闭
            w.alert_modal.on("hide.bs.modal", function(){
                w.alert_data_info = null;
                w.alert_modal_state = false;
                w.alert_data_other = null;
            });

            this.mapCharts.initView.call(this,function(){
                w.mapCharts.bindData.call(w);
            });
            setInterval(function(){
                w.mapCharts.bindData.call(w);
                w.scoller.loadImg.call(w);
            }, w.__constants__.intervals.siteAvail_refresh);

            setInterval(function(){
                if(!w.alert_modal_state){
                    var result = w.mapCharts.initAlert.call(w);
                    w.mapCharts.alertFunction.call(w, result);
                }
            }, w.__constants__.intervals.siteAlert_refresh);
        },
        initView:function(callback){
            var w=this;
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map'
                ],
                function (ec) {
                    var width = $('.map').width();
                    var height = $('.map').height();
                    $('#map1,#map2,#map3,#map4,#map5,#map6').width(width);
                    $('#map1,#map2,#map3,#map4,#map5,#map6').height(height);
                    var ecConfig = require('echarts/config');
                    var parts =['map1','map2','map3','map4','map5','map6'];
                    $.each(parts,function(i,content){
                        $("#"+content).show();
                    });
                    $.each(parts,function(i,ecPart){
                        w[ecPart]= ec.init(document.getElementById(ecPart));
                        w[ecPart].setOption(w.mapCharts.mapOption());
                    });
                    w.alert_modal.modal('show');
                    w.alertMap = ec.init(document.getElementById("alertMap"));
                    w.alertMap.setOption(w.mapCharts.mapOption());
                    w.alert_modal.modal('hide');
                    $.each(parts,function(i,map){
                        $("#"+map).hide();
                        w.__functions__.showMapByMapId.call(w,map);
                    });
                    callback&&callback.call(w);
                }
            );
        },
        //告警查询
        initAlert : function(){
            var result = "";
            var w = this;
            $.ajax({
                type: "POST",
                url: __WEBROOT__ + "/ScreenCenter/QualitySurvey/getAlertList",
                async: false,
                data: {ids: w.contractIds},
                dataType: "json",
                success:function(json){
                    result = json;
                }
            });
            return result;
        },
        alertFunction : function(json){
            var w = this;
            if(json['code']){
                w.alert_data_info = new Array();
                w.alert_data_other = json.other;
                $.each(json.items, function(point, item){
                    var tmp = [];
                    tmp.domain = point;
                    tmp.value = item;
                    w.alert_data_info.push(tmp);
                });
                w.alert_modal_state = true;
                var modal = $("#alert_modal");
                $(".alert_domain_size", modal).html(w.alert_data_info.length);
                if(w.alert_data_info.length == 1){
                    var next = $(".next_domain_btn", modal);
                    next.unbind();
                    next.bind("click",{obj:w} ,w.handler.btn_function.closeFunction);
                    next.text("关闭").show();
                }else{
                    var prev = $(".pre_domain_btn", modal);
                    var next = $(".next_domain_btn", modal);
                    prev.unbind();
                    prev.bind("click", {obj:w}, w.handler.btn_function.preFunction);
                    prev.text("上一个").show();
                    next.unbind();
                    next.bind("click", {obj:w}, w.handler.btn_function.nextFunction);
                    next.text("下一个").show();
                }
                var domain = w.alert_data_info[0];
                $(".now_domain", modal).val(domain.domain);
                w.mapCharts.bindAlertData.call(w, domain);
                w.mapCharts.bindAlertValue.call(w, domain);
                w.alert_modal.modal('show');
            }
        },
        bindAlertData : function(domain){
            var w = this;
            var nodes= w.alert_data_other.nodes;
            w.mapCharts.setMapData.call(w, w.alertMap, domain.value.nodeUnits, nodes, domain.domain);
        },
        bindAlertValue : function(domain){
            var w = this;
            var nodes = w.alert_data_other.nodes;
            var site_domain = domain.domain;
            var site_title = __functions__.cutstr(w.domainMapper[site_domain],20);
            var site_occor_time = domain.value.baseHistory.time;
            var nodes = domain.value.nodeUnits;
            var nodeList = [];

            $.each(nodes, function(point, item){
                var httpCode = item.value;
                if(httpCode<200||httpCode>400){
                    nodeList.push(w.alert_data_other.nodes[point]);
                }
            });
            $("#site_name", w.alert_modal).text(site_title);
            $("#site_domain", w.alert_modal).text(site_domain);
            $("#site_time", w.alert_modal).text(site_occor_time);
            $("#site_node", w.alert_modal).text(nodeList.join(","));

        },
        bindData:function(){
            var w=this;
            var configedDomains= w.__functions__.getMapBindDomains();
            if(configedDomains.length>0){
                $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/accessinfos",{domains:configedDomains.join(",")}).success(function(json){
                    if(json.code>0){
                        var nodes=json.other.nodes;
                        $.each(json.data,function(domain,item){

                            if(typeof  item==='object'){
                                var mapId= w.__functions__.getMapCharIdByDomain(domain);

                                w.mapCharts.setMapData.call(w,w[mapId],item,nodes,domain);

                            }
                        });
                        var base=json.other.base;
                        w.webstatus=base;
                    }
                });
            }
        },
        setMapData:function(map,data,nodes,domain){
            var w=this;
            if(!map){
                return;
            }
            var option=map.getOption();
            if(!option){
                return;
            }
            if(w.domainMapper[domain]){
                option.title.text=__functions__.cutstr(w.domainMapper[domain],20);
                option.series[0].data=[];
                $.each(data,function(node,unit){
                    var httpCode=unit.value;
                    var time=-1;
                    if(httpCode>=200&&httpCode<400){
                        time=Math.round((unit.other.nslookup_time + unit.other.connect_time) * 1000 / 1000);
                    }
                    option.series[0].data.push({name:nodes[node],value:time});
                });
            }
            map.setOption(option);
        },
        mapOption:function(){
            var option={
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
                        //hoverable:false,
                        //selectedMode : 'single',
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
            }
            return option;
        }


    };
    var handler={
        init:function(){
            var w= this;
            $('.h-add a').click(function(e){
                e.stopPropagation();
                //var el = '<div class="a-fadeinR"><input type="text" /><i class="fa fa-remove"></i></div>';
                $(this).parent().next('.h-select').toggle();
                var map=$(this).closest(".handle").next(".mapChart");
                if(map.attr("domain")){
                    $(this).closest(".handle").find('.select').val(map.attr("domain"));
                }
            });

            $('.h-select select').change(function(){
                var value=$(this).val();
                var map=$(this).closest(".handle").next(".mapChart");
                var domainList= w.__functions__.getMapBindDomains();

                if($.inArray(value,domainList)!=-1){
                    alert("该网站已在重点监测列表中");
                    return;
                }
                map.attr("domain",value);
                __functions__.showMapByMapId.call(w,map.attr("id"));
                w.mapCharts.bindData.call(w);
                domainList= w.__functions__.getMapBindDomains();
                w.scoller.warnings.call(w);
                w.scoller.loadImg.call(w);
                $.post(__WEBROOT__+"/ScreenCenter/QualitySurvey/updateConfig",{domain_list:domainList.join(",")}).success(function(json){});

                return false;
            });
            $('.mapChart').dblclick(function(e){
                e.stopPropagation();
                $(this).removeClass(w.__constants__.animation).addClass('a-flipoutY').hide();
                $(this).prev().removeClass(w.__constants__.animation).addClass('a-flipinY').show();
                $(this).prev().children('.h-select').hide();
            });
        },
        btn_function:{
            preFunction:function(event){
                var w = event.data.obj;
                var domainResult = __functions__.getShowDomain.call(w, 0);
                var domain = domainResult.domain;
                if(domain){
                    $(".now_domain", w.alert_modal).val(domain.domain);
                    w.mapCharts.bindAlertData.call(w, domain);
                    w.mapCharts.bindAlertValue.call(w, domain);
                    if(!domain.type){
                        var next_btn =$(".next_domain_btn", w.alert_modal);
                        next_btn.unbind();
                        next_btn.text("下一个");
                        next_btn.bind("click", {obj:w},w.handler.btn_function.nextFunction);
                    }
                }
            },
            nextFunction:function(event){
                var w = event.data.obj;
                var domainResult = __functions__.getShowDomain.call(w, 1);
                var domain = domainResult.domain;
                if(domain){
                    $(".now_domain", w.alert_modal).val(domain.domain);
                    w.mapCharts.bindAlertData.call(w, domain);
                    w.mapCharts.bindAlertValue.call(w, domain);
                    if(domainResult.type){
                        var next_btn =$(".next_domain_btn", w.alert_modal);
                        next_btn.unbind();
                        next_btn.text("关闭");
                        next_btn.bind("click", {obj:w},w.handler.btn_function.closeFunction);
                    }
                }

            },
            closeFunction:function(event){
                event.data.obj.alert_modal.modal('hide');
            }
        }
    };

    $(document).ready(function(){
        var qualitySurvey=new QualitySurvey();
        qualitySurvey.init.apply(qualitySurvey);
        __functions__.swiper();
        clearInterval(time1);
        var time1 = setInterval(function(){
            location.href=location.href;
        }, 1000 * 60 * 60);
    });

})();