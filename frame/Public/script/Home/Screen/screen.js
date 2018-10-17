/**
 * Created by jianghaifeng on 2016/3/2.
 */
(function(){
    var __GEO__={
        china_province:{
            '上海': [121.4648,31.2891],
            '广东': [113.8953,22.901],
            '山东': [118.7073,37.5513],
            '山西': [111.4783,36.1615],
            '辽宁': [124.541,40.4242],
            '新疆': [87.9236,43.5883],
            '河北': [115.0488,39.0948],
            '甘肃': [103.5901,36.3043],
            '内蒙': [110.3467,41.4899],
            '内蒙古': [110.3467,41.4899],
            '北京': [116.4551,40.2539],
            '广西': [109.314,21.6211],
            '江苏': [118.8062,31.9208],
            '江西': [116.0046,28.6633],
            '福建': [118.1689,24.6478],
            '安徽': [117.29,32.0581],
            '陕西': [108.4131,34.8706],
            '黑龙江': [127.9688,45.368],
            '天津': [117.4219,39.4189],
            '西藏': [91.1865,30.1465],
            '云南': [102.9199,25.4663],
            '浙江': [119.5313,29.8773],
            '湖南': [113.5327,27.0319],
            '湖北': [114.3896,30.6628],
            '海南': [110.3893,19.8516],
            '青海': [101.4038,36.8207],
            '贵州': [106.6992,26.7682],
            '河南': [113.4668,34.6234],
            '重庆': [107.7539,30.1904],
            '宁夏': [106.3586,38.1775],
            '吉林': [125.8154,44.2584],
            '中国':[116.4551,40.2539],
            '局域网':[116.4551,40.2539],
            '未知':[116.4551,40.2539],
            '四川':[103.9526,30.7617],
            '台湾':[121.31,25.03]
        },
        provincial_capital : {
            '北京': [116.4551,40.2539],
            '上海': [121.4648,31.2891],
            '天津': [117.4219,39.4189],
            '重庆': [107.7539,30.1904],
            '郑州': [113.4668,34.6234],
            '哈尔滨': [127.9688,45.368],
            '长春': [125.8154,44.2584],
            '长沙': [113.0823,28.2568],
            '沈阳': [123.1238,42.1216],
            '合肥': [117.29,32.0581],
            '呼和浩特': [111.4124,40.4901],
            '石家庄': [114.4995,38.1006],
            '福州': [119.4543,25.9222],
            '乌鲁木齐': [87.9236,43.5883],
            '兰州': [103.5901,36.3043],
            '西宁': [101.4038,36.8207],
            '西安': [109.1162,34.2004],
            '贵阳': [106.6992,26.7682],
            '银川': [106.3586,38.1775],
            '济南': [117.1582,36.8701],
            '太原': [112.3352,37.9413],
            '武汉': [114.3896,30.6628],
            '南京': [118.8062,31.9208],
            '南宁': [108.479,23.1152],
            '南昌': [116.0046,28.6633],
            '成都': [103.9526,30.7617],
            '昆明': [102.9199,25.4663],
            '拉萨': [91.1865,30.1465],
            '杭州': [119.5313,29.8773],
            '广州': [113.5107,23.2196],
            '海口': [110.3893,19.8516]
        }
    }
    var __PROVINCES__=[
        '浙江','广东','山东','山西','辽宁','新疆','河北','甘肃','内蒙古','北京','广西','江苏','四川',
        '江西','福建','安徽','陕西','黑龙江','天津','西藏','云南','湖南','湖北','海南','青海','贵州','河南','重庆','宁夏','吉林','上海'
    ];
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
        lineChartRefresh:60*1000,//折线图刷新时间
        lineTabChange:60*1000,//这线图中的流量视角和访问攻击量视角切换时间
        visitAreaRankRefresh:60*1000,//访问排行的刷新时间
        attackIpRankRefresh:60*1000,//攻击IP排行的刷新时间
        attackUrlRankRefresh:60*1000,//受攻击URL排行的刷新时间
        vulsRankRefresh:60*1000,//漏洞类型排行的刷新时间
        sortInterval:500,//排行榜的排序间隔
        flowRealTimeRefresh:60*1000,//顶部流量的刷新时间
        flowRealTimeToggle:3000,//顶部流量的切换时间
        hostHealthRefresh:10*1000,//cpu和memory的刷新时间
        todayVisitAndAttackCountRefresh:60*1000//当天整体的访问量和攻击量的刷新事件
    };
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
            this.domain=$("#currentDomain").val();
            view.init.call(this);
            scoller.init.call(this);
            echartsDraw.init.call(this);
        }

    }
    var view={
        init:function(){
            var w=this;
            var width = $(window).width();
            var height = $(window).height();
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

            $('.avail, .hole').height(height*.244);// 服务质量 安全告警
            $('.visitArea, .attackUrl').height(height *.311);// 区域访问排行 攻击url排行
            $('.visitIp, .analyze').height(height *.35);// 访问ip排行 分析

            $('.map-main').height(height *.56);// 信息攻击table
            $('.attack').height(height *.35);// 网站攻击趋势
        }

    }
    var scoller={
        init:function(){
            var w=this;
            scoller.visitareaTopN.call(w);
            scoller.visitIpTonN.call(w);
            scoller.attackIpTopN.call(w);
            scoller.attackUrlTopN.call(w);
            scoller.vuls.call(w);
            scoller.header_visit_count.call(w);
        },
        visitareaTopN:function(){
            var w=this;
            $("tbody",$('#areaRank')).itemScoller({
                ajaxUrl:__ROOT__+'/Home/Screen/visitAreaTopN?domain=destHostName_'+ w.domain  ,
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
                        '<td><img src="' + __PUBLIC__ + '/asset_os/image/flag/'+ __function__.getFlag(name)+'.png" /></td>' +
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
                ajaxUrl:__ROOT__+'/Home/Screen/visitIpTopN?domain=destHostName_'+ w.domain,
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
                    var el=$('<tr style="display: block"><td><img src="' + __PUBLIC__ + '/asset_os/image/flag/'+ __function__.getFlag(location)+'.png" /></td>'+
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
                ajaxUrl:__ROOT__+'/Home/Screen/attackIpTopN?domain=destHostName_'+ w.domain,
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
                    var el=$('<tr style="display: block"><td><img src="' + __PUBLIC__ + '/asset_os/image/flag/'+ __function__.getFlag(location)+'.png" /></td>'+
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
                ajaxUrl:__ROOT__+'/Home/Screen/attackUrlTopN?domain=destHostName_'+ w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval:_intervals.attackUrlRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var domain = item.name.length>=30?item.name.substr(0,30)+"...":item.name;
                    var el = $('<tr style="display: block;">' +
                        '<td><i class="index">' +(++index)  + '</i></td>' +
                        '<td>' + $('<div/>').text(item.value).html() + '</td>' +
                        '<td title="'+item.name+'">' + $('<div/>').text(domain).html() + '</td>' +
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
            $("tbody",$('#hole-type')).itemScoller({
                ajaxUrl:__ROOT__+'/Home/Screen/getVulsMsg?domain='+ w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval: _intervals.vulsRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var domain = item.name.length>=30?item.name.substr(0,30)+"...":item.name;
                    var el = $('<tr style="display: block;">' +
                    '<td><i class="index">' +(++index)  + '</i></td>' +
                    '<td>' + $('<div/>').text(item.value).html() + '</td>' +
                    '<td title="'+item.name+'">' + $('<div/>').text(domain).html() + '</td>' +
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
                        speed:_intervals.vulsRankRefresh - 5000,
                        formatter: function(b, a) {
                            return b.toFixed(0);
                        }
                    });

                },
                externals:[function(prev,current){
                    //如果没有漏洞信息展示图片
                    if(current.dataList && current.dataList.length > 0){
                        $("#no-risk").hide();
                    } else {
                        $("#no-risk").show();
                    }
                }]

            });
            //$("#no-risk").show();
        },
        header_visit_count:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/Home/Screen/todayVisitsAndAttacks",{"domain":"destHostName_"+ w.domain}).success(function(json){
                    var visitStart=w.todayVisitPrev||0;
                    if(json.data.visit>visitStart){
                        __function__.numScoller.call(w,$(".areaCount"),visitStart,json.data.visit);
                    }else{
                        var rate = 1;
                        var numend = json.data.visit;
                        if(numend<100000){
                            rate=1;
                            $(".areaCount").next("span").text("次");
                        }else if(numend>=100000&&numend<100000000){
                            rate=1000;
                            $(".areaCount").next("span").text("千次");
                        }else if(numend>100000000){
                            rate=1000000;
                            $(".areaCount").next("span").text("兆次");
                        }
                        $(".areaCount").text((numend/rate).toFixed());
                    }
                    w.todayVisitPrev=json.data.visit;
                    //------
                    var attackStart= w.todayAttackPrev||0;
                    if(json.data.attack>attackStart){
                        __function__.numScoller.call(w,$(".ipCount"),attackStart,json.data.attack);
                    }else{
                        var rate = 1;
                        var numend = json.data.attack;
                        if(numend<100000){
                            rate=1;
                            $(".ipCount").next("span").text("次");
                        }else if(numend>=100000&&numend<100000000){
                            rate=1000;
                            $(".ipCount").next("span").text("千次");
                        }else if(numend>100000000){
                            rate=1000000;
                            $(".ipCount").next("span").text("兆次");
                        }
                        $(".ipCount").text((numend/rate).toFixed());
                    }
                    w.todayAttackPrev=json.data.attack;
                    //---
                    //var flowOutStart=w.todayFlowOut||0;
                    //if(json.data.flowOut>flowOutStart){
                    //    __function__.flowScoller.call(w,$(".flow_out_count"),flowOutStart,json.data.flowOut);
                    //}else{
                    //    $(".flow_out_count").text((json.data.flowOut/1024/1024).toFixed());
                    //}
                    //w.todayFlowOut=json.data.flowOut;
                    ////--
                    //var flowInStart=w.todayFlowIn||0;
                    //if(json.data.flowIn>flowInStart){
                    //    __function__.flowScoller.call(w,$(".flow_in_count"),flowInStart,json.data.flowIn);
                    //}else{
                    //    $(".flow_in_count").text((json.data.flowIn/1024/1024).toFixed());
                    //}
                    //w.todayFlowIn=json.data.flowIn;
                });

            }
            start();
            setInterval(start,_intervals.todayVisitAndAttackCountRefresh);
        }

    }
    var echartsDraw={
        init:function(){
            var w=this;
            echartsDraw.initView.call(w,function(ec){
                echartsDraw.availMap.call(w);
                echartsDraw.chart_line.call(w);
                echartsDraw.continents.call(w,ec);
                echartsDraw.chinaMap.call(w);
                echartsDraw.chinaMapLines.call(w);
            });
            echartsDraw.attackScoller.call(w,'info');
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

                    w.attack = ec.init(document.getElementById('attackLine'));
                    w.flow = ec.init(document.getElementById('flowLine'));
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
                $.post(__ROOT__+'/Home/Screen/sitaAvail', {domain: w.domain}).success(function(json){
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
                calculable: false,
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
                        name: 'KB',//M
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
            var start=function(){
                $.post(__ROOT__ + '/Home/Screen/visitAndAttackCount', {domain:"destHostName_"+ w.domain,'point':1440}).success(function (json) {
                    var visitMap=json.visit||{};
                    var attackMap=json.attack||{};
                    var xAxis=[];
                    $.each(visitMap,function(k,v){
                        xAxis.push(k.split(" ")[1]);
                    });
                    var visit=__function__.mapset(visitMap,false,false);
                    var attack=__function__.mapset(attackMap,false,false);

                    option.series[0].data= __function__.xData.call(w,visit);
                    //    //__function__.xData.call(w,json.visit);
                    option.series[1].data=__function__.xData.call(w,attack);
                    option.xAxis[0].data = xAxis;
                    w.attack.setOption(option);
                });

                $.post(__ROOT__ + '/Home/Screen/flowInAndOutCount', {domain:"destHostName_"+ w.domain,'point':1440}).success(function (json) {
                    var flowOutMap=json.flowOut||{};
                    var flowInMap=json.flowIn||{};
                    var xAxis=[];
                    var flowinArr = [];
                    var flowoutarr = [];
                    $.each(flowOutMap,function(k,v){
                        xAxis.push(k.split(" ")[1]);
                        flowinArr.push(flowInMap[k]);
                        flowoutarr.push(flowOutMap[k]);
                    });
                    var flowOut=__function__.mapset(flowOutMap,false,true);
                    var flowIn=__function__.mapset(flowInMap,false,true);

                    option2.series[0].data= __function__.xData.call(w,flowIn);
                    //    //__function__.xData.call(w,json.visit);
                    option2.series[1].data=__function__.xData.call(w,flowOut);
                    option2.xAxis[0].data = xAxis;
                    w.flow.setOption(option2);

                    var flowinMin = flowinArr[flowinArr.length-1]/1024/1024/60;
                    var flowoutMin = flowoutarr[flowoutarr.length-1]/1024/1024/60;
                    if(flowinMin<0.1){
                        flowinMin = flowinMin*1024;
                        $(".flow_in_count").next("span").text("KB/秒");
                    }
                    if(flowoutMin<0.1){
                        flowoutMin = flowoutMin*1024;
                        $(".flow_out_count").next("span").text("KB/秒");
                    }
                    $(".flow_in_count").text(flowinMin.toFixed(2));
                    $(".flow_out_count").text(flowoutMin.toFixed(2));

                });
            };
            start();
            setInterval(start,_intervals.flowRealTimeRefresh);
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
                        data: [],  //json.data,
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
            var itemScoller=function(items){
                $(".waf-items").html("");
                for(var i=items.length-1;i>=0;i--){
                    var item=items[i];
                    var severity=item.severity;
                    var url=item.requestUrl;
                    var srcRegion=item.srcGeoRegion;
                    if(srcRegion.length>3){
                        srcRegion=srcRegion.substr(0,3);
                    }
                    var protocal=item.name||item.appProtocol;
                    if(protocal.indexOf('扫描目录') ==0){
                        protocal='扫描目录';
                    }
                    if("服务器遇到错误，无法完成请求" == protocal || "客户端遇到错误，客户端有问题" == protocal){
                        continue ;
                    }
                    var tr=$("<tr><td >"+__function__.formatTime(item.collectorReceiptTime)+"</td>"+
                        "<td >"+item.srcAddress+"</td>"+
                        "<td >"+(spec[item.srcAddress]?spec[item.srcAddress]:srcRegion)+"</td>"+
                        "<td title='" + url + "'>"+$('<div/>').text(url).html()+"</td>"+
                        "<td>"+protocal+"</td>"+
                        "<td>"+(attackLevel[severity]['text']||"低")+"</td></tr>");
                    $("td",tr).css("color",attackLevel[severity]['color']||"green");
                    tr.appendTo($(".waf-items"));
                }
            }
            var start=function(){
                $.post(__ROOT__+'/Home/Screen/visitAndattackReal', {domain:"destHostName_"+ w.domain}).success(function(json){

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
                                    //console.info(item);
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

        },
        attackScoller:function(dom){
            var w = this;

            var y = 0;
            var innerEl = $('#'+dom);
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);

            setInterval(function(){
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
            },200)
        }

    }

    var __function__={
        getFlag:function(location){
            var flag="default";
            if($.inArray(location,__PROVINCES__)!=-1 || "中国" == location){
                flag="中国";
            }
            if(countryReflects[location]&&countryReflects[location]['f']){
                flag= countryReflects[location]['f'];
            }else if(countryReflects[location]){
                flag=location;
            }
            return flag;

        },
        mapset:function(json,keySet,flag){
            var arr=[];
            $.each(json,function(k,v){
                if(keySet){
                    if(flag){
                        arr.push((k /1024 / 60).toFixed(2));///1024/1024
                    }else{
                        arr.push(k);
                    }
                }else{
                    if(flag){
                        arr.push((v / 1024 / 60).toFixed(2));///1024/1024
                    }else{
                        arr.push(v);
                    }
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

            if(numend<100000){
                rate=1;
                dom.next("span").text("次");
            }else if(numend>=100000&&numend<100000000){
                rate=1000;
                dom.next("span").text("千次");
            }else if(numend>100000000){
                rate=1000000;
                dom.next("span").text("兆次");
            }

            startCount(dom,{
                from:numstart/rate,
                to:numend/rate
            });
        },
        flowScoller:function(dom,numstart,numend){
            startCount(dom,{
                from:(numstart/1024/1024),
                to:(numend/1024/1024)
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
        xData:function(arr){
            var w=this;
            var res=[];
            for(var i=0;i<arr.length;i++){
                res.push(arr[i]* 1);
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
                    arr.push({"from":k,to: "浙江"});
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
        }

    }


    $(document).ready(function(){
        WebMonitor.init();
    }) ;
})();
