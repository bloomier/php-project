(function(){

    var timer ;
    var innerEl ;
    var rollEl ;
    var waitEl ;

    var _thresholds={
        flow_max:200,//流量带宽的值
        flow_mid:[60,80],//CC攻击的阈值 flow_mid[1]M以上告警
        remainDangerSeverity:4,//残余风险的定义级别(多少级以上定义为残余风险)
        cpu_danger:80,//主机健康cpu阈值
        memory_danger:80//主机健康内存阈值
    };
    var _intervals={
        modalDisplay:5*1000,//弹出层的消失时间
        availRefresh:30*1000,//可用性刷新时间
        mapRefresh:15*1000,//地图刷新时间
        lineChartRefresh:50*1000,//折线图刷新时间
        lineTabChange:60*1000,//这线图中的流量视角和访问攻击量视角切换时间
        visitAreaRankRefresh:45*1000,//访问排行的刷新时间
        attackIpRankRefresh:45*1000,//攻击IP排行的刷新时间
        attackUrlRankRefresh:45*1000,//受攻击URL排行的刷新时间
        sortInterval:500,//排行榜的排序间隔
        flowRealTimeRefresh:60*1000,//顶部流量的刷新时间
        flowRealTimeToggle:3000,//顶部流量的切换时间
        hostHealthRefresh:10*1000,//cpu和memory的刷新时间
        todayVisitAndAttackCountRefresh:45*1000//当天整体的访问量和攻击量的刷新事件
    };
    var attackTypeDesc = {
        "客户端遇到错误，客户端有问题":"访问不存在的资源"
    }
    var lineColor={
        0:'red',
        1:'orange',
        2:'yellow'
    };
    var attackLevel = {
        0:{text:'低',color:'yellow'},
        1:{text:'低',color:'yellow'},
        2:{text:'低',color:'yellow'},
        3:{text:'低',color:'yellow'},
        4:{text:'中',color:'orange'},
        5:{text:'中',color:'orange'},
        6:{text:'中',color:'orange'},
        7:{text:'中',color:'orange'},
        8:{text:'高',color:'red'},
        9:{text:'高',color:'red'},
        10:{text:'高',color:'red'},
        11:{text:'高',color:'red'},
        12:{text:'高',color:'red'}

    }

    var WebMonitor = {
        init:function(){
            this.config.call(this);
            view.init.call(this);
            scoller.init.call(this);
            echartsDraw.init.call(this);
            handler.init.call(this);
        },
        config:function(){
            var w = this;
            var cloudKey = $("#cloudKey").val();
            w.setUpValue = cloudKey;
            if(!cloudKey){
                var title = $("#site_title").val();
                $("title").html(title);
                $("h1",$(".header")).html(title);
                w.domain = $("#site_domain").val();
                w.flowHide = true;
                w.deviceConf={"keys":"destHostName_" + w.domain};
                w.xData=1;
                $('.domain').text(w.domain);
            }else{
                if(!socConf[cloudKey]){
                    cloudKey=socSimpleKey[cloudKey];
                }
                $("title").html(cloudKey);
                var logo=socConf[cloudKey]['logo'];
                if(logo){
                    var img=__PUBLIC__+ '/image/screen/gongan.png';
                    $("h1",$(".header")).html("<img src="+img+" style='max-width: 100%; height: 40px; vertical-align: top; margin-right: 5px;'/><span >"+cloudKey+"</span>");
                }else{
                    $("h1",$(".header")).html(cloudKey);
                }
                w.domain = socConf[cloudKey]['domain'];
                w.deviceConf=socConf[cloudKey]['deviceConf'];
                w.flowHide=socConf[cloudKey]['flowHide'];
                w.vulsInfo=socConf[cloudKey]['vuls'];
                w.simple=($("#simple").val()=='1');
                w.xData=socConf[cloudKey]['xData']||1;
                $('.domain').text(w.domain);
            }
        }



    }
    var view={
        init:function(){
            var w=this;
            view.initHtml.call(w);
        },
        initHtml:function(){
            var w=this;
            var width = $(window).width();
            var height = $(window).height();
            if(w.simple){
                $('#mapVail').height(height * .3);// 网站可用性
                $('#risk').height(height * .175);// 安全告警信息
                $('#info-grid').height(height * .22);// 攻击信息滚动table

                $('.map').height(height * .6);
                $('#chinaMap').width(width);
                $('#chinaMap').height(height * .5);
                $('#asia, #africa, #europe, #northAmerica, #southAmerica').width(width * .2);
                $('#asia, #africa, #europe, #northAmerica, #southAmerica').height(height * .2);
                $('#oceania').width(width * .2);
                $('#oceania').height(height * .2);
                $('.avail,.visitArea,.analyze').height(height *.35);

                $('.map-main').height(height *.56);// 信息攻击table
                $('.attack').height(height *.35);// 网站攻击趋势
            }else{
                $('#mapVail').height(height * .175);// 网站可用性

                $('#attackLine').height(height * .3125); // 网站攻击趋势
                $('#flowLine').height(height * .3125);// 网站流量趋势
                $('#risk').height(height * .175);// 安全告警信息
                //$('#attackInfo').height(height * .175);//

                $('#info-grid').height(height * .22);// 攻击信息滚动table

                // 组成世界地图
                $('.map').height(height * .385);
                $('#chinaMap').width(width * .5);
                $('#chinaMap').height(height * .35);
                $('#asia, #africa, #europe, #northAmerica, #southAmerica').width(width * .15);
                $('#asia, #africa, #europe, #northAmerica, #southAmerica').height(height * .15);
                $('#oceania').width(width * .2);
                $('#oceania').height(height * .2);

                //自适应

                $('.avail, .hole').height(height*.274);// 服务质量 安全告警
                $('.visitArea, .attackUrl').height(height *.281);// 区域访问排行 攻击url排行
                $('.visitIp, .analyze').height(height *.35);// 访问ip排行 分析

                $('.map-main').height(height *.56);// 信息攻击table
                $('.attack').height(height *.35);// 网站攻击趋势
            }
        }
    }
    var handler={
        init:function(){
            var w=this;
            handler.click.call(w);
            if(!w.simple&& !w.flowHide){
                handler.tabChange.call(w);
            }
            handler.initModal.call(w);
        },
        click:function(){
            var w=this;
            $(".btn-page-toggle").bind("click",function(){
                if(location.href.indexOf("simple")==-1){
                    var href=location.href.split("?");
                    var loc=href[0]+"/simple/1/";
                    if(href.length>1){
                        loc+=  href[1];
                    }
                    location.href=loc;
                }else{
                    var href=location.href.substr(location.href.indexOf("simple"));
                    var tmp=href.split("/");
                    var type=tmp[1]||'';
                    if(w.simple){
                        href=location.href.replace('simple/'+type,'simple/0');
                    }else{
                        href=location.href.replace('simple/'+type,'simple/1');
                    }
                    location.href=href;
                }
            });
        },
        tabChange: function () {
            var w = this;
            var i = 0,j=0;
            var len = $('#tab .nav-tabs li').length;

            setInterval(function () {
                $('#tab .nav-tabs li:eq(' + i + ') a').click();
                i++;
                if (i >= len) {
                    i = 0;
                }
            },_intervals.lineTabChange);

        },
        initModal:function(){
            var w=this;
            $('#myModal').modal('hide');
            $('#myModal').on("shown.bs.modal",function(){
                w.myModalShow=true;
                $.each(w.ccIps,function(i,item){
                    if(i<9){
                        setTimeout(function(){
                            var location=spec[item.ip]?spec[item.ip]:item.location;
                            var p=$('<p><span class="sourceIp">'+item.ip+'</span><span class="sourceDest">'+location+'</span></p>');
                            p.css("color",lineColor[i]||'#56b6ff');
                            p.appendTo($(".source",$("#myModal")));
                            p.addClass("a-fadeinR");
                        },i*200);
                    }

                });
                $.each(w.ccUrls,function(i,item){
                    if(i<9){
                        var url=item.name;
                        if(url.length>20){
                            url=url.substr(0,20)+"...";
                        }
                        var p=$('<p>'+url+'</p>');
                        p.css("color",lineColor[i]||'#56b6ff');
                        p.appendTo($(".target",$("#myModal")));
                        p.addClass("a-fadeinB");
                    }

                });
                setTimeout(function(){
                    $('#myModal').modal('hide');


                },_intervals.modalDisplay);
            });
            $('#myModal').on("hidden.bs.modal",function(){
                w.myModalShow=false;
                $(".source",$("#myModal")).html("");
                $(".target",$("#myModal")).html("");
            });
        }
    }
    var scoller={
        init:function(){
            var w=this;
            scoller.visitareaTopN.call(w);
            if(!w.simple){
                scoller.visitIpTonN.call(w);
                scoller.attackIpTopN.call(w);
                scoller.attackUrlTopN.call(w);
                //scoller.vuls.call(w);
                scoller.attackType.call(w);
            }
            scoller.header_visit_count.call(w);
            if(!w.simple&& !w.flowHide){
                scoller.header_flow.call(w);
            }else{
                $("#inOutMinTag").hide();
                $("#inOutMinTab").hide();
            }

        },
        visitareaTopN:function(){
            var w=this;
            $("tbody",$('#areaRank')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/CloudMonitor/visitAreaTopN?keys='+ w.deviceConf['keys'],
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval:_intervals.visitAreaRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var max=json.dataList[0]['value'];
                    var size=json.size;
                    var name= item.name;

                    if(item.name=='国外'){
                        name='国内';
                    }
                    var el = $('<tr style="display: block;">' +
                        '<td><img src="' + __PUBLIC__ + '/image/attack-src/'+ __function__.getFlag(name)+'.png" /></td>' +
                        '<td>' +name + '</td>' +
                        '<td class="people"></td>' +
                        '<td class="count"><span class="pecent">' + (item.value*100/size).toFixed(2) + '</span>%</td>' +
                        '</tr>');
                    var peopeCount=item.value*10/max.toFixed(0);
                    for(var i=0;i<10;i++){
                        var color=i<peopeCount?"male-color":"";
                        $(".people",el).append('<i class="fa fa-male '+color+'"></i>');
                    }

                    return el;
                },
                compare:function(v1,v2){
                    return v2>v1?true:false;//降序排列
                },
                vauleScoller:function(line,start,end,prev,current){
                    var o=$(".pecent",line);
                    var _start=0;
                    if(prev){
                        _start=start*100/(prev.size);
                    }
                    startCount(o,{
                        from:_start,
                        to:end*100/(current.size),
                        speed:_intervals.visitAreaRankRefresh-5000,
                        formatter: function(b, a) {
                            return b.toFixed(2);
                        }
                    });
                }

            });
        },
        visitIpTonN:function(){
            var w=this;
            $("tbody",$('#visitIp')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/CloudMonitor/visitIpTopN?keys='+ w.deviceConf['keys'],
                items:"dataList",
                key:"ip",
                value:"count",
                refresh_interval:_intervals.attackIpRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                //auto_refresh:false,
                draw:function(index,item,json){
                    var max=json.dataList[0]['count'];
                    var location= (spec[item.ip]?spec[item.ip]:item.location);
                    if(location=='国外'){
                        location='国内';
                    }
                    var width = (item.count/max)*100;
                    var el=$('<tr style="display: block"><td><img src="' + __PUBLIC__ + '/image/attack-src/'+ __function__.getFlag(location)+'.png" /></td>'+
                        '<td>'+location+'</td>'+
                        '<td><div class="progress" style="margin-bottom: 0px;"><div class="progress-bar"  style="width: '+width+'%;"><span>'+item.ip+'</span></div></div></td>'+
                        '<td>'+item.count+'</td></tr>');
                    return el;
                },
                compare:function(v1,v2){
                    return v2-v1>0?true:false;
                },
                vauleScoller:function(line,start,end){
                    var o=$("td:eq(3)",line);
                    startCount(o,{
                        from:start,
                        to:end,
                        speed:_intervals.attackIpRankRefresh-5000,
                        formatter: function(b, a) {
                            return b.toFixed(0);
                        }
                    });

                }
            });
        },
        attackIpTopN:function(){
            var w=this;
            $("tbody",$('#attackIp')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/CloudMonitor/attackIpTopN?keys='+ w.deviceConf['keys'],
                items:"dataList",
                key:"ip",
                value:"count",
                refresh_interval:_intervals.attackIpRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                //auto_refresh:false,
                draw:function(index,item,json){

                    var max=json.dataList[0]['count'];
                    var location= (spec[item.ip]?spec[item.ip]:item.location);
                    if(location=='国外'){
                        location='国内';
                    }
                    var width = (item.count/max)*100;
                    var el=$('<tr style="display: block"><td><img src="' + __PUBLIC__ + '/image/attack-src/'+ __function__.getFlag(location)+'.png" /></td>'+
                        '<td>'+location+'</td>'+
                        '<td><div class="progress" style="margin-bottom: 0px;"><div class="progress-bar"  style="width: '+width+'%;"><span>'+item.ip+'</span></div></div></td>'+
                        '<td>'+item.count+'</td></tr>');
                    return el;
                },
                compare:function(v1,v2){
                    return v2-v1>0?true:false;
                },
                vauleScoller:function(line,start,end){
                    var o=$("td:eq(3)",line);
                    startCount(o,{
                        from:start,
                        to:end,
                        speed:_intervals.attackIpRankRefresh-5000,
                        formatter: function(b, a) {
                            return b.toFixed(0);
                        }
                    });

                },
                externals:[function(prev,current){
                    w.ccIps=current.dataList;
                }]
            });
        },
        attackUrlTopN:function(){
            var w=this;
            $("tbody",$('#attackUrl')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/CloudMonitor/attackUrlTopN?keys='+ w.deviceConf['keys'],
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval:_intervals.attackUrlRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var el = $('<tr style="display: block;">' +
                        '<td><i class="index">' +(++index)  + '</i></td>' +
                        '<td>' + $('<div/>').text(item.value).html() + '</td>' +
                        '<td>' + $('<div/>').text(item.name).html() + '</td>' +
                        '</tr>');
                    return el;
                },
                compare:function(v1,v2){
                    return v2>v1?true:false;//降序排列
                },
                afterSort:function(lines){
                    var i=0;
                    $.each(lines,function(i,line){
                        $(".index",$(line)).text(++i);
                    });


                },
                vauleScoller:function(line,start,end){
                    var o=$("td:eq(1)",line);
                    startCount(o,{
                        from:start,
                        to:end,
                        speed:_intervals.attackUrlRankRefresh-5000,
                        formatter: function(b, a) {
                            return b.toFixed(0);
                        }
                    });

                },
                externals:[function(prev,current){
                    w.ccUrls=current.dataList;
                }]

            });
        },
        vuls:function(){
            var w=this;
            var el;
            var colorList = {"高":"FF4040", "中":"FF7256", "低":"FFB90F", "信息":"00a2fd"}
            if(w.vulsInfo){
                var max=w.vulsInfo.size;

                $.each(w.vulsInfo.dataList, function(k,item){
                   // console.info(item);
                    var width = (item.count/max)*100;
                    el =  $('<tr>' +
                        '<td><span class="label label-warning" style="background-color: #' + colorList[item.holeType] + '">' + item.holeType + '</span></td>' +
                        '<td>' + item.vname + '</td>' +
                        '<td><div class="progress" style="margin-bottom: 5px;"><div class="progress-bar"  style="width: '+width+'%;background-color:#' + colorList[item.holeType] + '"><span>'+item.count+'</span></div></div></td>' +
                        '</tr>');
                    $("#hole-type tbody").append(el);
                });
            }else{
                $("#no-risk").show();
            }
        },
        attackType:function(){
            var w=this;
            $("tbody",$('#hole-type')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/CloudMonitor/getAttackTypeTopN?keys='+ w.deviceConf['keys'],
                items:"dataList",
                key:"name",
                value:"count",
                refresh_interval:_intervals.attackIpRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                //auto_refresh:false,
                draw:function(index,item,json){

                    var max=json.dataList[0]['count'];

                    var width = (item.count/max)*100;
                    var el=$('<tr style="display: block">'+
                    '<td><i class="index">' + ( ++index )  + '</i></td>' +
                    '<td>'+$('<div/>').text(item.count).html() +'</td>'+
                    '<td>'+$('<div/>').text(item.name).html() +'</td>'+
                    '</tr>');
                    return el;
                },
                compare:function(v1,v2){
                    return v2-v1>0?true:false;
                },
                afterSort:function(lines){
                    var i=0;
                    $.each(lines,function(i,line){
                        $(".index",$(line)).text(++i);
                    });
                },
                vauleScoller:function(line,start,end){
                    var o=$("td:eq(3)",line);
                    startCount(o,{
                        from:start,
                        to:end,
                        speed:_intervals.attackIpRankRefresh-5000,
                        formatter: function(b, a) {
                            return b.toFixed(0);
                        }
                    });

                },
                externals:[function(prev,current){
                    w.ccIps=current.dataList;
                }]
            });
        },
        header_visit_count:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/ScreenCenter/CloudMonitor/todayVisitsAndAttacks",{"keys":w.deviceConf['keys']}).success(function(json){
                    var visitStart=w.todayVisitPrev||0;
                    if(json.data.visit* w.xData>visitStart){
                        __function__.numScoller.call(w,$(".areaCount"),visitStart,json.data.visit*w.xData);
                    }
                    w.todayVisitPrev=json.data.visit* w.xData;
                    //---
                    var attackStart= w.todayAttackPrev||0;
                    if(json.data.attack*w.xData>attackStart){
                        __function__.numScoller.call(w,$(".ipCount"),attackStart,json.data.attack*w.xData);
                    }
                    w.todayAttackPrev=json.data.attack*w.xData;

                });

            }
            start();
            setInterval(start,_intervals.todayVisitAndAttackCountRefresh);


        },
        header_flow:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/ScreenCenter/CloudMonitor/flowsInOneMin",{deviceId: w.deviceConf['old_key']}).success(function(json){
                    var ins=json['in'];
                    var outs=json['out'];
                    $.each(ins,function(i,_in){
                        setTimeout(function(){
                            $(".flow_in_count").text(ins[i]);
                            $(".flow_out_count").text(outs[i]);
                            var total=ins[i]+outs[i];
                            var level=1;
                            if(total>=_thresholds.flow_mid[0]&&total<_thresholds.flow_mid[1]){
                                level=2;
                            }else if(total>=_thresholds.flow_mid[1]){
                                level=3;
                            }
                            if(level==3){
                                if(!w.myModalShow){

                                    $(".flow-msg-info").text(total.toFixed(2)+"M");
                                    __function__.circle.call(w,$("#myModal .circle:eq(2)"),(total*100/_thresholds.flow_max).toFixed(2),true);
                                    var rd1=(Math.random()*20+10).toFixed(2);
                                    __function__.circle.call(w,$("#myModal .circle:eq(0)"),rd1,rd1>_thresholds.cpu_danger);
                                    var rd2=(Math.random()*60+30).toFixed(2);
                                    __function__.circle.call(w,$("#myModal .circle:eq(1)"),rd2,rd2>_thresholds.memory_danger);

                                    $('#myModal').modal('show');
                                    var file = [];
                                    file['mp3'] = __PUBLIC__+"/source/vedio/alarm.mp3";
                                    __function__.audioplayer('audioplane', file, false);
                                }

                            }
                        },i*_intervals.flowRealTimeToggle);
                    });
                });

            }
            start();
            setInterval(start,_intervals.flowRealTimeRefresh);
        }



    };
    var echartsDraw={
        init:function(){
            var w=this;
            echartsDraw.initView.call(w,function(ec){
                echartsDraw.availMap.call(w);
                if(!w.simple){
                    echartsDraw.chart_line.call(w);
                }
                echartsDraw.continents.call(w,ec);
                echartsDraw.chinaMap.call(w);
                echartsDraw.chinaMapLines.call(w);
            });
            echartsDraw.attackScoller.call(w,'info');

        },

        attackScoller:function(dom){
            var w = this;


           /* d3.timer(function(){
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
            });*/
            //设置是否滚动
            //__function__.intervalTime(dom);
            innerEl = $('#'+dom);
            rollEl = innerEl.parent();
            waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);


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
                    'echarts/chart/map',
                    'echarts/chart/line'
                ],
                function (ec) {
                    var ecConfig = require('echarts/config');
                    w.mapVail = ec.init(document.getElementById('mapVail'));
                    if(!w.simple){
                        w.attack = ec.init(document.getElementById('attackLine'));
                        w.flow = ec.init(document.getElementById('flowLine'));
                    }
                    //中间的世界地图
                    w.chinaMap = ec.init(document.getElementById('chinaMap'));
                    callback&&callback.call(w,ec);
                });


        },
        availMap:function(){
            var w=this;
            var option = {
                dataRange: {
                    show: true,
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
                series: [
                    {
                        type: 'map',
                        mapType: 'china',
                        hoverable: false,
                        itemStyle: {
                            normal: {
                                label: {show: false},
                                borderColor: '#001320',
                                borderWidth: 0.5,
                                areaStyle: {
                                    color:  (w.simple?'green':'#06304e')
                                }
                            }
                        },
                        data: [],
                        geoCoord: __GEO__.china_province

                    }

                ]
            };
            var start=function(){
                $.post(__ROOT__+'/ScreenCenter/CloudMonitor/sitaAvail', {domain: w.domain}).success(function(json){
                    option.series[0].data=[];
                    $.each(json, function(i,item){
                        option.series[0].data.push({
                            name: i,
                            value:item
                        }) ;
                        //option.series[0].data.push({name:"宁夏",value:200})
                    });
                    w.mapVail.setOption(option);
                });
                //$.getJSON(__ROOT__+'/ScreenCenter/CloudMonitor/sitaAvail?domain='+w.domain, null).success(function(json){
                //    option.series[0].data=[];
                //    $.each(json, function(i,item){
                //        option.series[0].data.push({
                //            name: i,
                //            value:item
                //        }) ;
                //        //option.series[0].data.push({name:"宁夏",value:200})
                //    });
                //    w.mapVail.setOption(option);
                //
                //});
            }
            start();
            setInterval(start,_intervals.availRefresh);
        },
        chart_line:function(){
                var w=this;
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        },
                        y: 20,
                        data: ['访问次数','攻击次数']
                    },
                    grid: {
                        borderWidth: 0
                    },
                    calculable: false,
                    xAxis: [
                        {
                            type: 'category',
                            name: '/分钟',
                            boundaryGap: true,
                            axisLabel: { //坐标轴文本
                                show: true,

                                /*formatter : function(s) {
                                 return s.slice(13, 21);
                                 },*/
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 14
                                }
                            },
                            axisLine: {// 坐标轴线
                                show: true
                            },
                            axisTick: {//坐标轴小标记
                                show: true
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            data: []

                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '/次',
                            axisLabel: { //坐标轴文本
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 14
                                }
                            },
                            axisLine: {// 坐标轴线
                                show: true
                            },
                            axisTick: {//坐标轴小标记
                                show: true
                            },
                            splitLine: { // 网格线
                                show: false,
                                lineStyle: {
                                    type: 'dashed'
                                }
                            }


                        }
                    ],
                    series: [
                        {
                            name: '访问次数',
                            type:'line',
                            dataFilter: 'nearst',
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: 'green'
                                }


                            }

                        },
                        {
                            name: '攻击次数',
                            type:'line',
                            dataFilter: 'nearst',
                            symbol: 'none',
                            itemStyle: {
                                normal: {
                                    color: 'red'
                                }

                            }

                        }
                    ]

                };


                var option2 = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    textStyle: {
                        color: '#fff',
                        fontSize: 14
                    },
                    y: 20,
                    data: ['输入流量','输出流量']
                },
                grid: {
                    borderWidth: 0
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        axisLabel: { //坐标轴文本

                            /* formatter : function(s) {
                             return s.slice(13, 21);
                             },*/
                            show: true,
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: true
                        },
                        splitLine: { // 网格线
                            show: false
                        },
                        data: []

                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '/M',
                        axisLabel: { //坐标轴文本
                            textStyle: {
                                color: '#fff',
                                fontSize: 14
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: true
                        },
                        splitLine: { // 网格线
                            show: false,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }


                    }
                    //双y轴时候使用
                    //,
                    //{
                    //    type: 'value',
                    //    name: '/M',
                    //    axisLabel: { //坐标轴文本
                    //        textStyle: {
                    //            color: '#fff',
                    //            fontSize: 14
                    //        }
                    //    },
                    //    axisLine: {// 坐标轴线
                    //        show: true
                    //    },
                    //    axisTick: {//坐标轴小标记
                    //        show: true
                    //    },
                    //    splitLine: { // 网格线
                    //        show: false,
                    //        lineStyle: {
                    //            type: 'dashed'
                    //        }
                    //    }
                    //
                    //
                    //}
                ],
                series: [
                    {
                        name: '输入流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none'
                    },
                    {
                        name: '输出流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none'
                    }
                ]


            };
            option2.xAxis[0].data = __function__.getLast30Mins();
            var start=function(){
                $.post(__ROOT__ + '/ScreenCenter/CloudMonitor/visitAndAttackCount', {keys:w.deviceConf['keys'],'point':1440}).success(function (json) {
                    var visitMap=json.visit||{};
                    var attackMap=json.attack||{};
                    var xAxis=[];
                    var keySets = [];
                    $.each(visitMap,function(k,v){
                        //xAxis.push(k.split(" ")[1]);
                        keySets.push(k);
                    });
                    keySets = keySets.sort();
                    var visit=[];
                    var attack=[];
                    $.each(keySets,function(k,v){
                        //console.info(visitMap[v]);
                        xAxis.push(v.split(" ")[1]);
                        visit.push(visitMap[v]);
                        attack.push(attackMap[v]);
                    });
                    //var visit=__function__.mapset(visitMap,false);
                    //var attack=__function__.mapset(attackMap,false);
                    visit = __function__.xData.call(w,visit);
                    //G20特殊处理
                    if(w.setUpValue && w.setUpValue == 'g20'){
                        $.post(__ROOT__ + '/ScreenCenter/CloudMonitor/getVisitCount').success(function (json) {
                            if(json.code){
                                var predictData = json.rows;
                                visit = __function__.replaceData(visit,predictData);
                            }
                            option.series[0].data= visit;
                            option.series[1].data=__function__.xData.call(w,attack);
                            option.xAxis[0].data = xAxis;
                            w.flow.setOption(option);
                        });
                    } else {
                        option.series[0].data= visit;
                        // console.info(option.series[0].data);
                        //    //__function__.xData.call(w,json.visit);
                        option.series[1].data=__function__.xData.call(w,attack);
                        option.xAxis[0].data = xAxis;
                        w.flow.setOption(option);
                    }
                });
                if(!w.flowHide){
                    $.getJSON(__ROOT__ + '/ScreenCenter/CloudMonitor/flows?deviceId='+w.deviceConf['old_key'], null).success(function (json) {
                        option2.series[0].data=json['in'];
                        //设置双y轴
                        //option2.series[1].yAxisIndex = 1;
                        option2.series[1].data=json['out'];
                        option2.xAxis[0].data = __function__.getLast30Mins();
                        w.attack.setOption(option2);
                    });
                }
            }
            start();
            setInterval(start,_intervals.lineChartRefresh);
        },
        continents:function(ec){
            var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
            for(var i=0;i<continents.length;i++){
                var oneMap=ec.init(document.getElementById(continents[i]));
                require('echarts/util/mapData/params').params[continents[i]] = {
                    getGeoJson: function (callback) {
                        $.getJSON(__PUBLIC__+'/source/geo/continents/'+continents[i]+'.geo',callback);
                    }
                };
                var opt={
                    series : [
                        {
                            name: '',
                            type: 'map',
                            hoverable: false,
                            roam:false,
                            mapType: continents[i], // 自定义扩展图表类型
                            data:[],
                            textFixed: {
                                '亚洲':[0,-10],
                                '北美洲':[10,0],
                                '非洲':[10,0],
                                '大洋洲':[100,0],
                                '欧洲':[100,0]
                            },
                            itemStyle: {
                                normal: {
                                    label: {
                                        show: true
                                    },
                                    borderColor: 'rgba(19, 105,167, 1)',
                                    borderWidth:.5,
                                    areaStyle: {
                                        color: 'rgba(2, 89,255, .2)'
                                    }
                                }
                            }
                        }
                    ]
                };

                oneMap.setOption(opt);
            }
        },
        chinaMap:function(){
            var w=this;
            var chinaMapOption = {
                tooltip:{
                    show:true,
                    trigger: 'item'
                },
                dataRange: {
                    min : 1,
                    max : 2,
                    show:false,
                    calculable : true,
                    color:["red","green"] ,
                    //['#fe5f5f', 'orange', '#ffe26c','#70d1fe','#90ff8b'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                series : [
                    {
                        type: 'map',
                        mapType: 'china',
                        hoverable: false,
                        itemStyle: {
                            normal: {
                                borderColor: 'rgba(19, 105,167, 1)',
                                borderWidth:.5,
                                areaStyle: {
                                    color: 'rgba(2, 89,255, .2)'
                                }
                            }

                        },
                        data: [],//json.data,
                        geoCoord: __GEO__.china_province,
                        markLine : {
                            smooth:true,

                            effect : {
                                show: false,
                                scaleSize: 1,
                                period: 10,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle : {
                                normal: {
                                    //color: 'green',
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    },
                                    label: {
                                        show:false
                                    }
                                }
                            },
                            data: []//json.markLineData
                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 10 + v/100
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    color: 'red',
                                    label:{show:false}
                                }
                            },
                            data: []//json.markPointData
                        }
                    }
                ]
            };
            w.chinaMap.setOption(chinaMapOption);
            var mapGeo=__GEO__.china_province;
            $.each(echartsDraw.getContinentsGeo.call(w),function(k,v){
                var _geo= w.chinaMap.chart.map.getGeoByPos("china",[v.x, v.y]);
                mapGeo[k]=_geo;
            });
            chinaMapOption.series[0].geoCoord=mapGeo;
            w.chinaMap.setOption(chinaMapOption);




        },
        getContinentsGeo:function(){
            var w=this;

            var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
            var json={};
            var worldMapLeft=$("#worldMap").offset().left;

            var worldMapTop=$("#worldMap").offset().top;
            var _offset={};
            if(!w.simple){
                _offset={//地图位置偏移量
                    asia:{x:10,y:-20},
                    africa:{x:30,y:0},
                    europe:{x:0,y:0},
                    southAmerica:{x:20,y:0},
                    northAmerica:{x:20,y:0},
                    oceania:{x:120,y:0}
                };

            }else{
                _offset={//地图位置偏移量
                    asia:{x:10,y:0},
                    africa:{x:0,y:0},
                    europe:{x:0,y:0},
                    southAmerica:{x:0,y:0},
                    northAmerica:{x:0,y:0},
                    oceania:{x:120,y:0}
                };
            }
            for(var i=0;i<continents.length;i++){
                var _map=$("#"+continents[i]);

                var x=_map.offset().left+_map.width()/2-worldMapLeft+_offset[continents[i]]['x'];

                var y=_map.offset().top+_map.height()/2-worldMapTop+_offset[continents[i]]['y'];

                json[continents[i]]={"x":x,"y":y};
            }
            return json;
        },
        chinaMapLines:function(){
            var w=this;
            var  checkMarkLineNumberGt=function(count){
                var series=w.chinaMap.getSeries();
                var datas=series[0].markLine.data;
                return datas.length>count;
            };
            var delLine=function(){
                var series=w.chinaMap.getSeries();
                //删除最早加载的点
                var lines=series[0].markLine.data;
                //删除最早加载的线条
                var delStr=lines[0][0].name+' > '+lines[0][1].name;
                w.chinaMap.delMarkLine(0,delStr);
            };
            var  drawLine=function(item,value){

                var from=countryReflects[item.from]?countryReflects[item.from].c:item.from;

                if(from.length>20){
                    from="africa";//防止解析成乱码的时候线划到外面
                }
                var to=item.to;

                if(from&&to){

                    w.chinaMap.addMarkLine(0,{data:[[{name:from,value: value},{name:to}]]});
                    while(checkMarkLineNumberGt(50)){
                        delLine();
                    }
                }

            }
            var itemScoller = function(items){
                if(__function__.isNow(items)){//滚动
                    __function__.moveOrNotAttack(items, true);
                } else {//不滚动，且颜色为灰色
                    __function__.moveOrNotAttack(items, false);
                }

            }
            var start=function(){
                $.post(__ROOT__+'/ScreenCenter/CloudMonitor/visitAndattackReal', {keys:w.deviceConf['keys'],deviceId:w.deviceConf['old_key']}).success(function(json){
                    var visits=__function__.powerData.call(w,json.visit);
                    var attacks=__function__.powerData.call(w,json.attack);


                    if(visits.length==0&&attacks.length==0){
                        setTimeout(start,5000);
                    }else{
                        var attRate=(100*visits.length/attacks.length).toFixed(0);
                        var flag1=false;
                        var flag2=false;
                        if(attacks.length==0){
                            flag2=true;
                        }
                        if(visits.length==0){
                            flag1=true;
                        }
                        $.each(visits,function(i,item){
                            setTimeout(function(){
                                if(i>=visits.length-1){
                                    flag1=true;
                                }else{

                                    drawLine(item,1);
                                }
                            },i*100);

                        });
                        $.each(attacks,function(i,item){
                            setTimeout(function(){
                                if(i>=attacks.length-1){
                                    flag2=true;
                                }else{
                                    drawLine(item,2);
                                }

                            },i*attRate);
                        });
                        var ins=setInterval(function(){
                            if(flag1&&flag2){
                                clearInterval(ins);
                                setTimeout(start,200);
                                //start();
                            }
                        },1000);
                        itemScoller( json.items);

                    }
                });
            }
            start();


        }


    }
    var __function__={
        getFlag:function(location){
            var flag="default";
            if($.inArray(location,__PROVINCES__)!=-1 || "中国" == location || "台湾" == location){
                flag="中国";
            }
            if(countryReflects[location]&&countryReflects[location]['f']){
                flag= countryReflects[location]['f'];
            }else if(countryReflects[location]){
                flag=location;
            }
            return flag;

        },
        mapset:function(json,keySet){
            var arr=[];
            $.each(json,function(k,v){
                if(keySet){
                    arr.push(k);
                }else{
                    arr.push(v);
                }

            });
            return arr;
        },
        getLast30Mins:function(){
            var times=[];
            var date=new Date();
            var hour=date.getHours();
            var min=date.getMinutes();
            for(var i=min-29;i<=min;i++){
                var _h=hour;
                var _m=i;
                if(i<0){
                    _h=hour-1;
                    if(_h<0){
                        _h=23;
                    }
                    _m=60+i;
                }
                _h=_h<10?("0"+_h):_h;
                _m=_m<10?("0"+_m):_m;
                times.push(_h+":"+_m);

            }
            return times;
        },
        numScoller:function(dom,numstart,numend){
            var w=this;
            var rate=1;
            if(!w.simple&& !w.flowHide){
                if(numend<100000){
                    rate=1;
                    dom.next("span").text("次");
                }else if(numend>=100000&&numend<100000000){
                    rate=1000;
                    dom.next("span").text("千次");
                }else if(json.total>100000000){
                    rate=1000000;
                    dom.next("span").text("兆次");
                }
            }
            startCount(dom,{
                from:numstart/rate,
                to:numend/rate
            });
        },
        audioplayer:function(id, file, loop){
            var audioplayer = document.getElementById(id);
            if(audioplayer!=null){
                document.body.removeChild(audioplayer);
            }

            if(typeof(file)!='undefined'){
                if(navigator.userAgent.indexOf("MSIE")>0){// IE

                    var player = document.createElement('bgsound');
                    player.id = id;
                    player.src = file['mp3'];
                    player.setAttribute('autostart', 'true');
                    if(loop){
                        player.setAttribute('loop', 'infinite');
                    }
                    document.body.appendChild(player);

                }else{ // Other FF Chome Safari Opera

                    var player = document.createElement('audio');
                    player.id = id;
                    player.setAttribute('autoplay','autoplay');
                    if(loop){
                        player.setAttribute('loop','loop');
                    }
                    document.body.appendChild(player);

                    var mp3 = document.createElement('source');
                    mp3.src = file['mp3'];
                    mp3.type= 'audio/mpeg';
                    player.appendChild(mp3);

                    var ogg = document.createElement('source');
                    ogg.src = file['ogg'];
                    ogg.type= 'audio/ogg';
                    player.appendChild(ogg);

                }
            }
        },
        circle: function(circle,num,alarm){

            var colorCls="green";
            var _text="正常";
            if(alarm){
                colorCls='red';
                _text="告警";
            }
            $(".value",circle).text(num);
            circle.removeClass("bg-orange").removeClass("bg-green").removeClass("bg-red").addClass("bg-"+colorCls);
            $(".mask",circle).removeClass("orange").removeClass("green").removeClass("red").addClass(colorCls);
            $(".msg-info",circle.next(".alarm-info")).removeClass("orange").removeClass("green").removeClass("red").addClass(colorCls);
            $(".a-num",circle.next(".alarm-info")).removeClass("orange").removeClass("green").removeClass("red").addClass(colorCls);

            $(".msg-info",circle.next(".alarm-info")).text(_text);
            var ang=num*3.6;
            ang=(ang>360?360:ang);
            if (ang<=180) {
                $('.right',circle).css({
                    '-moz-transform': 'rotate(' + ang + 'deg)',
                    '-webkit-transform': 'rotate(' + ang + 'deg)',
                    '-o-transform': 'rotate(' + ang + 'deg)',
                    'transform': 'rotate(' + ang + 'deg)'
                });
                $('.left',circle).css({
                    '-moz-transform': 'rotate(' + (0) + 'deg)',
                    '-webkit-transform': 'rotate(' + (0) + 'deg)',
                    '-o-transform': 'rotate(' + (0) + 'deg)',
                    'transform': 'rotate(' + (0) + 'deg)'
                });
            } else {
                $('.right',circle).css({
                    '-moz-transform': 'rotate(180deg)',
                    '-webkit-transform': 'rotate(180deg)',
                    '-o-transform': 'rotate(180deg)',
                    'transform': 'rotate(180deg)'
                });
                $('.left',circle).css({
                    '-moz-transform': 'rotate(' + (ang - 180) + 'deg)',
                    '-webkit-transform': 'rotate(' + (ang - 180) + 'deg)',
                    '-o-transform': 'rotate(' + (ang - 180) + 'deg)',
                    'transform': 'rotate(' + (ang - 180) + 'deg)'
                });
            };
        },
        replaceData: function(currentData, predictData){
            var w=this;
            var res=[];
            var predictLength = predictData.length;
            for(var i=0;i<currentData.length;i++){
                if(currentData[i] > 0 ){
                    res.push(currentData[i]);
                } else {
                    if(i < predictLength){
                        res.push(predictData[i]);
                    } else {
                        res.push(currentData[i]);
                    }
                }
            }
            return res;
        },
        xData:function(arr){
            var w=this;
            var res=[];
            for(var i=0;i<arr.length;i++){
                res.push(arr[i]* w.xData);
            }

            return res;
        },
        powerData:function(json){
            var w=this;
            var res=[];
            var arr=[];
            $.each(json||{},function(k,v){
                if(v>1000){
                    v=1000;
                }
                for(var i=0;i<v;i++){
                    arr.push({"from":k,to: (w.deviceConf['location']||'浙江')});
                }
            });
            for(var i=0;i<3;i++){
                res= $.merge(res,arr);
            }
            //随机打乱
            res.sort(function(a,b){
                return 0.5 - Math.random();
            });
            return res;

        },
        powerArray:function(arr,n){
            if(n==0){
                return arr;
            }
            var res=[];
            for(var i=0;i<n;i++){
                res= $.merge(res,arr);
            }
            return res;
        },
        formatTime:function(time){
            return time.substr(11,time.length-1);
        },
        madeTenMinutesStr: function(){

            var currentTenMinutesStr = [];
            var myDate = new Date();//当前时间
            var oneDay = 1000 * 60 * 60 * 24;
            var oneMinutes = 1000 * 60;
            var lastDate = null;
            var timeStr = "";
            for(var i = 0; i < 10; i++){
                lastDate = new Date(myDate - oneMinutes * i);
                timeStr = lastDate.Format('yyyy-MM-dd hh:mm');
                currentTenMinutesStr.push(timeStr);
            }
            return currentTenMinutesStr;
        },
        isNow: function(items){
            var tenMinutesArr = __function__.madeTenMinutesStr();

            var one = null;
            for(var i=items.length-1;i>=0;i--){
                one = items[i];
                var timeStr = one.collectorReceiptTime;
                var url = one.requestUrl;
                timeStr = timeStr.substr(0,16);
                for(var num = 0; num < 10; num++){
                    if(timeStr == tenMinutesArr[num] && url != "/favicon.ico"){
                        return true;
                    }
                }
            }
            return false;
        },
        moveOrNotAttack: function(items, isMove){
            $(".waf-items").html("");
            if(isMove){
                __function__.intervalTime("info");
            } else {
                clearInterval(timer);
                innerEl.css({
                    top: 0
                });
                waitEl.css({
                    top: innerEl.height()
                });
            }
            __function__.addAttackRow(items, isMove);
        },
        addAttackRow: function(items,isMove){

            if(isMove){
                var arrs = __function__.madeTenMinutesStr();
                for(var i=items.length-1;i>=0;i--){
                    var item=items[i];
                    var severity=item.severity;
                    var url=item.requestUrl;
                    var srcRegion=item.srcGeoRegion;
                    if(srcRegion.length>3){
                        srcRegion=srcRegion.substr(0,3);
                    }

                    if(url == "/favicon.ico" || !__function__.isExistElement(item.collectorReceiptTime,arrs)){
                        continue ;
                    }
                    var protocal=item.name||item.appProtocol;
                    if(protocal.indexOf('扫描目录') ==0){
                        protocal='扫描目录';
                    }
                    protocal = attackTypeDesc[protocal] ? attackTypeDesc[protocal] : protocal;

                    var tr=$("<tr><td >"+__function__.formatTime(item.collectorReceiptTime)+"</td>"+
                    "<td >"+item.srcAddress+"</td>" +
                    "<td >"+(spec[item.srcAddress]?spec[item.srcAddress]:srcRegion)+"</td>"+
                    "<td style='text-align: left;'>"+$('<div/>').text(url).html()+"</td>"+
                    "<td>"+protocal+"</td>"+
                    "<td>"+(attackLevel[severity]['text']||"低")+"</td></tr>");

                    $("td",tr).css("color",attackLevel[severity]['color']||"green");
                    tr.appendTo($(".waf-items"));
                }
            } else {
                for(var i = 0;i < items.length; i++){
                    var item=items[i];
                    var severity=item.severity;
                    var url=item.requestUrl;
                    var srcRegion=item.srcGeoRegion;
                    if(srcRegion.length>3){
                        srcRegion=srcRegion.substr(0,3);
                    }
                    if(url == "/favicon.ico"){
                        continue ;
                    }
                    var protocal=item.name||item.appProtocol;
                    if(protocal.indexOf('扫描目录') ==0){
                        protocal='扫描目录';
                    }
                    protocal = attackTypeDesc[protocal] ? attackTypeDesc[protocal] : protocal;

                    var tr=$("<tr><td >"+__function__.formatTime(item.collectorReceiptTime)+"</td>"+
                    "<td >"+item.srcAddress+"</td>" +
                    "<td >"+(spec[item.srcAddress]?spec[item.srcAddress]:srcRegion)+"</td>"+
                    "<td style='text-align: left;'>"+$('<div/>').text(url).html()+"</td>"+
                    "<td>"+protocal+"</td>"+
                    "<td>"+(attackLevel[severity]['text']||"低")+"</td></tr>");
                    $("td",tr).css("color","gray");
                    tr.appendTo($(".waf-items",$("#info")));
                }
            }
        },
        intervalTime: function(dom){
            if(timer){
                clearInterval(timer);
            }
            var y = 0;

            timer = setInterval(function(){
                y = y - 0.8;
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
            },200);
        },
        isExistElement: function(element,Arrs){
            element = element.substr(0,16);
            if(Arrs.indexOf(element) == -1){
                return false;
            } else {
                return true;
            }
        }

    }



    $(document).ready(function(){
        __function__.madeTenMinutesStr();
        WebMonitor.init();


    });
})();