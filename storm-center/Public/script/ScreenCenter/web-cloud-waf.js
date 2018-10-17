/**
 *@name
 *@author Sean.xiang sakoo.jiang
 *@date 2015/9/16
 *@example
 */






var mapGeo=__GEO__.china_province;

var _thresholds={
    flow_max:200,//流量带宽的值
    flow_mid:[50,80],//CC攻击的阈值 flow_mid[1]M以上告警
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
var wafLevel={
    2:{text:'高',color:'red'},
    3:{text:'中',color:'orange'},
    4:{text:'低',color:'yellow'}
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
var lineColor={
    0:'red',
    1:'orange',
    2:'yellow'
};
var WebMonitor = {
    init: function () {
        var w = this;
        w.initHtml();
        w.initEvent();


    },
    initHtml: function () {
        var w = this;

        w.domain = $('#domain').val()||'www.websaas.cn';
        if(w.domain=="www.wicwuzhen.cn"|| w.domain=='reg.wicwuzhen.cn'){
            $("h1",$(".title")).text("世界互联网大会防护监测");
        }
        $('.domain').text(w.domain);
        var width = $(window).width();
        var height = $(window).height();

        $('#mapVail').height(height * .175);
        /*  $('#areaRank').height(height * .3);
         $('#userRank').height(height * .3);*/
        $('#rank,#riskGrade, #serverGrade,#serverQuality,#threatLevel, #securityEvent').height(height * .075);


        $('#attackLine').height(height * .3125);
        $('#flowLine').height(height * .3125);
        $('#risk').height(height * .175);
        $('#attackInfo').height(height * .175);

        $('#info-grid').height(height * .22);




        $('.map').height(height * .385);
        $('#chinaMap').width(width * .5);
        $('#chinaMap').height(height * .35);
        $('#asia, #africa, #europe, #northAmerica, #southAmerica').width(width * .15);
        $('#asia, #africa, #europe, #northAmerica, #southAmerica').height(height * .15);
        $('#oceania').width(width * .2);
        $('#oceania').height(height * .2);
        $('#asiaName, #africaName, #europeName, #northAmericaName, #southAmericaName').width(width * .15);
        $('#asiaName, #africaName, #europeName, #northAmericaName, #southAmericaName').height(height * .15);


        //自适应

        $('.avail, .hole').height(height*.244);
        $('.visitArea, .attackUrl').height(height *.311);
        $('.visitIp, .analyze').height(height *.35);


        $('.map-main').height(height *.56);// 信息攻击table
        $('.attack').height(height *.35);// 网站攻击趋势


        w.gridHtml();
        /*setInterval(function(){
         w.gridHtml();
         },1000*60*2);*/
        w.changeHtml();

        w.draw();




    },
    initEvent: function () {
        var w = this;

        $("#tab li:first a").click();

        w.tabChange();
        w.scroll('info');
        //w.type(); //打字机效果

        //弹框
        w.initModal();
    },
    initModal:function(){
        var w=this;

        $('#myModal').modal('hide');
        $('#myModal').on("shown.bs.modal",function(){
            w.myModalShow=true;
            $.each(w.ccIps,function(i,item){
                if(i<9){
                    setTimeout(function(){

                        var p=$('<p><span class="sourceIp">'+item.ip+'</span><span class="sourceDest">'+item.location+'</span></p>');
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
    },
    draw: function () {
        var w = this;



        w.initOption();


        require.config({
            paths: {
                echarts: __ECHART__
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/map',
                'echarts/chart/pie',
                'echarts/chart/bar',
                'echarts/chart/gauge',
                'echarts/chart/line',
                'echarts/chart/wordCloud'
            ],
            function (ec) {
                var ecConfig = require('echarts/config');


                w.mapVail = ec.init(document.getElementById('mapVail'));
                //w.attackType = ec.init(document.getElementById('attackType'));
                w.attack = ec.init(document.getElementById('attackLine'));
                w.flow = ec.init(document.getElementById('flowLine'));

                w.chinaMap = ec.init(document.getElementById('chinaMap'));


                w.mapVail.showLoading();
                w.attack.showLoading();
                w.flow.showLoading();

                w.chinaMap.setOption(w.mapOption);

                $.each(w.getContinentsGeo(),function(k,v){
                    var _geo= w.chinaMap.chart.map.getGeoByPos("china",[v.x, v.y]);
                    mapGeo[k]=_geo;
                });
                w.mapOption.series[0].geoCoord=mapGeo;
                w.chinaMap.setOption(w.mapOption);

                //var map = w.chinaMap;

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
                    if(i==5){
                        opt.series[0].mapLocation = {x:'right',y:0}
                    }

                    oneMap.setOption(opt);
                }

                $("#tab .tab-pane:gt(0)").removeClass('active');






                function mapVail(){
                    $.getJSON(__ROOT__+'/ScreenCenter/WebCloudWaf/sitaAvail?domain='+w.domain, null).success(function(json){
                        w.mapVail.setOption(w.mapVailOption(json));
                        w.mapVail.hideLoading();


                    });
                }
                function visitCount(){
                    $.getJSON(__ROOT__ + '/ScreenCenter/WebCloudWaf/visitAndAttackCount?domain='+w.domain, null).success(function (json) {
                        var data = {
                            data1: json.visit,
                            data2:  json.attack

                        }
                        w.flow.setOption(w.visitCountOption(data));
                        w.flow.hideLoading();



                    });
                }
                function flows(){
                    $.getJSON(__ROOT__ + '/ScreenCenter/WebCloudWaf/flows?domain='+w.domain, null).success(function (json) {
                        var data = {
                            data1: json['in'],
                            data2:  json['out']
                        };


                        w.attack.setOption(w.flowsOption(data));
                        w.attack.hideLoading();

                    });
                }
                function drawWafItem(items){
                    $(".waf-items").html("");
                    var flag=false;
                    for(var i=items.length-1;i>=0;i--){
                        var item=items[i];
                        var severity=item.severity;
                        var url=item.requestUrl;
                       /* if(url.length>15){
                            url=url.substr(0,15)+"...";
                        }*/
                        var srcRegion=item.srcGeoRegion;
                        if(srcRegion.length>3){
                            srcRegion=srcRegion.substr(0,3);
                        }
                        var tr=$("<tr><td >"+__data__.formatWafTime(item.collectorReceiptTime)+"</td>"+
                        "<td >"+item.srcAddress+"</td>"+
                        "<td >"+srcRegion+"</td>"+
                        "<td >"+url+"</td>"+
                        "<td>"+item.appProtocol+"</td>"+
                        "<td>"+(wafLevel[severity]['text']||"低")+"</td></tr>");
                        $("td",tr)
                            .css("color",wafLevel[severity]['color']||"green");
                            //.css("text-align","left");
                        if(severity<4){
                            flag=true;
                        }
                        tr.appendTo($(".waf-items"));
                    }
                    if(flag){
                        w.analyzeValue($(".analyze  .app-safe"),2);

                    }
                }
                function drawAttackItem(items){
                    $(".waf-items").html("");
                    var flag=false;
                    for(var i=items.length-1;i>=0;i--){
                        var item=items[i];
                        var severity=item.severity;
                        var url=item.requestUrl;
                       /* if(url.length>15){
                            url=url.substr(0,15)+"...";
                        }*/
                        var srcRegion=item.srcGeoRegion;
                        if(srcRegion.length>3){
                            srcRegion=srcRegion.substr(0,3);
                        }
                        var tr=$("<tr><td >"+__data__.formatWafTime(item.collectorReceiptTime)+"</td>"+
                            "<td >"+item.srcAddress+"</td>"+
                            "<td >"+srcRegion+"</td>"+
                            "<td >"+url+"</td>"+
                            "<td>"+(item.appProtocol||'http')+"</td>"+
                            "<td>"+(attackLevel[severity]['text']||"低")+"</td></tr>");
                        $("td",tr)
                            .css("color",attackLevel[severity]['color']||"green");
                        //.css("text-align","left");
                        if(severity<4){
                            flag=true;
                        }
                        tr.appendTo($(".waf-items"));
                    }
                    if(flag){
                        w.analyzeValue($(".analyze  .app-safe"),2);

                    }
                }
                function remainDanger(items){
                    var flag=false;
                    for(var i=items.length-1;i>=0;i--){
                        var severity=items[i].severity;

                        if(items[i].warning==0&&severity>_thresholds.remainDangerSeverity){
                            $("#no-risk").hide();
                            $("#risk").show();
                            flag=true;
                            var item=items[i];
                            var text="  "+item.collectorReceiptTime+"监测到本站点来自"+
                                item.srcGeoRegion+"的IP为 "+item.srcAddress +"的攻击 \""+item.name+"\" "+
                                "本次风险等级为 ";
                            w.type(text,(severity>=7?"高危":"低危"),(severity>=7?"red":"yellow"));
                            w.analyzeValue($(".analyze  .app-safe"),severity>=7?3:2);
                            //w.analyzeValue($(".analyze  .remain-risk"),3);
                            return;
                        }

                    }
                    if(!flag){
                        $("#risk").hide();
                        $("#no-risk").show();
                    }


                }
                function mapCount(){

                    //访问

                    $.getJSON(__ROOT__+'/ScreenCenter/WebCloudWaf/visitAndattackReal?domain='+w.domain, null).success(function(json){

                        $.each(json.visits,function(i ,item){
                            setTimeout(function(){
                                w.addMark(w.chinaMap, item,1);
                            },i*500);

                        });
                        $.merge(json.attacks,json.wafs);
                        $.each(json.attacks,function(i ,item){
                            setTimeout(function(){
                                w.addMark(w.chinaMap, item,2);
                            },i*500);
                        });
                        w.analyzeValue($(".analyze  .app-safe"),1);
                        w.analyzeValue($(".analyze  .remain-risk"),1);
                        drawAttackItem(json.attacks);
                        remainDanger(json.attacks);
                    });


                }
                mapVail();
                mapCount();
                visitCount();
                flows();
                setInterval(mapVail,_intervals.availRefresh);
                setInterval(function(){
                    visitCount();
                    flows();
                },_intervals.lineChartRefresh);
                setInterval(mapCount,_intervals.mapRefresh);

            }
        );
    },
    initOption: function () {
        var w = this;

        w.mapVailOption = function (json) {
            var option = {
                dataRange: {
                    show: false,
                    splitNumber: 0,
                    padding: 1,
                    itemGap:0,
                    text: ['高', '低'],  // 文本，默认为数值文本
                    textStyle: {
                        color: '#eee'
                    },
                    x: 10,
                    y: 'bottom',
                    itemHeight: 10,
                    //min:0,
                    //max: 10000,
                    calculable: false,
                    splitList: [
                        {end: 0, color: 'grey'},
                        {start: 0, end: 300, color: 'green'},
                        {start: 300, end: 1000, color: 'yellow'},
                        {start: 1000, end: 10000, color: 'orange'},
                        {start: 10000, end: 100000, color: 'red'},
                        {start: 100000, color: 'grey'}
                    ]
                    //color: ['grey', 'red', 'orange', 'yellow', 'green']
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
                                    color: '#06304e'
                                }
                            }
                        },
                        data: [],
                        geoCoord: __GEO__.china_province

                    }

                ]
            };
            $.each(json, function(i,item){
                option.series[0].data.push({
                    name: i,
                    value:item
                }) ;
            });

            return option;
        };
        w.attackTypeOption = function (json) {
            function createItemStyle() {
                return {
                    normal: {
                        color: 'rgb(' + [
                            Math.round(Math.random() * 200),
                            Math.round(Math.random() * 160),
                            Math.round(Math.random() * 160)
                        ].join(',') + ')'
                    }
                };
            }

            var option = {
                series: [{
                    name: 'Google Trends',
                    type: 'wordCloud',
                    size: ['80%', '80%'],
                    textRotation: [0, 45, 90, -45],
                    textPadding: 0,
                    autoSize: {
                        enable: true,
                        minSize: 14
                    },
                    data: []
                }]
            };
            $.each(json, function(i,item){
                option.series[0].data.push({
                    name: item.vname,
                    value:item.value,
                    itemStyle: createItemStyle()
                }) ;
            });

            return option;
        };

        w.mapOption = {
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



        w.flowsOption = function (json) {

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
                ],
                series: [
                    {
                        name: '输入流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data1
                    },
                    {
                        name: '输出流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data2
                    }
                ]


            };
            //最近30分钟
            __data__.getLast30Mins();
            //for (var i = 0; i < 31; i++) {
            //
            //    time.push(i);
            //}
            option.xAxis[0].data = __data__.getLast30Mins();


            return option;
        };
        w.visitCountOption = function (json) {
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
                calculable: true,
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


                        },
                        data: json.data1
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


                        },
                        data: json.data2
                    }
                ]

            };



            option.xAxis[0].data = __data__.getLast30Mins();

            return option;
        };
        w.otherOption = function(){
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map',
                    'echarts/chart/pie',
                    'echarts/chart/bar',
                    'echarts/chart/gauge',
                    'echarts/chart/line',
                    'echarts/chart/wordCloud'
                ],
                function (ec) {
                    var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
                    for(var i=0;i<continents.length;i++){
                        var oneMap=ec.init(document.getElementById(continents[i]));
                        require('echarts/util/mapData/params').params[continents[i]] = {
                            getGeoJson: function (callback) {
                                $.getJSON(__PUBLIC__+'/source/geo/continents/'+continents[i]+'.geo',callback);
                            }
                        }
                        var opt={
                            tooltip : {
                                trigger: 'item',
                                formatter: '{b}'//鼠标移上去的时候显示区域名称
                            },

                            series : [
                                {
                                    name: '',
                                    type: 'map',
                                    hoverable: false,
                                    roam:false,
                                    mapType: continents[i], // 自定义扩展图表类型
                                    data:[],
                                    itemStyle:{
                                        normal:{
                                            borderColor:'rgba(100,149,237,1)',
                                            borderWidth:0.5,
                                            areaStyle:{
                                                color: '#000000'
                                            }
                                        }
                                    }
                                }
                            ]
                        };
                        oneMap.setOption(opt);
                    }
                }
            )
        }
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
        }, _intervals.lineTabChange);
    },
    gridHtml: function () {
        var w = this;
        //刷新频率 2分钟
        //访客区域排行
        (function(){

            $("tbody",$('#areaRank')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/WebCloudWaf/visitAreaTopN?domain='+w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval:_intervals.visitAreaRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var max=json.dataList[0]['value'];
                    var size=json.size;

                    var el = $('<tr style="display: block;">' +
                        '<td><img src="' + __PUBLIC__ + '/image/attack-src/'+ w.getFlag(item.name)+'.png" /></td>' +
                        '<td>' + item.name + '</td>' +
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
        })();
        //攻击源Ip 排行
        (function(){
            $("tbody",$('#attackIp')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/WebCloudWaf/attackIpTopN?domain='+w.domain,
                items:"dataList",
                key:"ip",
                value:"count",
                refresh_interval:_intervals.attackIpRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                //auto_refresh:false,
                draw:function(index,item,json){

                    var max=json.dataList[0]['count'];

                    var width = (item.count/max)*100;
                    var el=$('<tr style="display: block"><td><img src="' + __PUBLIC__ + '/image/attack-src/'+ w.getFlag(item.location)+'.png" /></td>'+
                    '<td>'+item.location+'</td>'+
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
        })();
        //攻击URL 排行
        (function(){
            $("tbody",$('#attackUrl')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/WebCloudWaf/attackUrlTopN?domain='+w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                refresh_interval:_intervals.attackUrlRankRefresh,//刷新间隔
                interval:_intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var el = $('<tr style="display: block;">' +
                    '<td><i class="index">' +(++index)  + '</i></td>' +
                    '<td>' + item.value + '</td>' +
                    '<td>' + item.name + '</td>' +
                        //'<td class="leak">' + (item.has_leak == 1 ? '<i class="fa fa-bell red"></i>' : ' ') + '</td>' +  //<i class="fa fa-bell"></>
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
        })();
        //CPU和内存的处理
        (function(){
            var hostHealth=function(){
                $.getJSON(__ROOT__+"/ScreenCenter/WebCloudWaf/hostHealth").success(function(json){
                    w.hostHealth=json;
                    var level=1;
                    if(json.cpu>_thresholds.cpu_danger){//告警
                        level=3;
                    }else if(json.memory>_thresholds.memory_danger){
                        level=2;
                    }
                    w.analyzeValue(".analyze .main-risk",level);

                });

            }
            hostHealth();
            setInterval(hostHealth,_intervals.hostHealthRefresh);

        })();
        //一分钟内的流量处理 一共20个点 3秒钟处理一个点
        (function(){
            var flowsInOneMin=function(){
                $.getJSON(__ROOT__+"/ScreenCenter/WebCloudWaf/flowsInOneMin").success(function(json){
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

                            w.analyzeValue(".analyze .access",level,function(){


                                if(level==3){
                                    //大流量访问  触发CC
                                    //打开模态框
                                    if(!w.myModalShow){
                                        if(w.hostHealth){
                                            var rd=Math.random()*5;
                                            $(".flow-msg-info").text(total.toFixed(0)+"M");
                                            w.circle($("#myModal .circle:eq(2)"),(total*100/_thresholds.flow_max).toFixed(2));
                                            w.circle($("#myModal .circle:eq(0)"),(w.hostHealth.cpu+rd).toFixed(2));
                                            w.circle($("#myModal .circle:eq(1)"),(w.hostHealth.memory+rd).toFixed(2));

                                        }
                                        $('#myModal').modal('show');
                                        //播放告警声音
                                        var file = [];
                                        file['mp3'] = __PUBLIC__+"/source/vedio/alarm.mp3";
                                        w.audioplayer('audioplane', file, false);
                                    }
                                }



                            });
                        },i*_intervals.flowRealTimeToggle);


                    });


                });
            }
            flowsInOneMin();
            setInterval(flowsInOneMin,_intervals.flowRealTimeRefresh);//3*5=15秒刷新一次

        })();
        //当天的访问量和供给量综合
        (function(){
            var todayVisitsAndAttacks=function(){
                $.ajax(__ROOT__+"/ScreenCenter/WebCloudWaf/todayVisitsAndAttacks?domain="+w.domain).success(function(json){
                    var visitStart=w.todayVisitPrev||0;
                    if(json.visitCount>visitStart){
                        var rate=1;
                        if(json.visitCount<100000){
                            rate=1;
                            $(".areaCount ").next("span").text("次");
                        } else if(json.visitCount>100000){
                            rate=1000;
                            $(".areaCount ").next("span").text("千次");
                        }else if(json.visitCount>100000000){
                            rate=1000000;
                            $(".areaCount ").next("span").text("兆次");
                        }
                        startCount($(".areaCount "),{
                            from:visitStart/rate,
                            to:json.visitCount/rate


                        });
                    }
                    w.todayVisitPrev=json.visitCount;



                    var attackStart= w.todayAttackPrev||0;
                    if(json.attackCount>attackStart){
                        var rate=1;
                        if(json.attackCount<100000){
                            rate=1;
                            $(".ipCount ").next("span").text("次");
                        }else if(json.attackCount>100000){
                            rate=1000;
                            $(".ipCount ").next("span").text("千次");
                        }else if(json.attackCount>100000000){
                            rate=1000000;
                            $(".ipCount ").next("span").text("兆次");
                        }
                        startCount($(".ipCount"),{

                            from:attackStart/rate,
                            to:json.attackCount/rate
                        });
                    }
                    w.todayAttackPrev=json.attackCount;


                });

            }
            todayVisitsAndAttacks();
            setInterval(todayVisitsAndAttacks,_intervals.todayVisitAndAttackCountRefresh);

        })();


        //漏洞类型
        (function(){
            $.getJSON(__ROOT__ + "/ScreenCenter/CloudMonitor/domainVulsInfo?domain=www.jxlwqg.cn").success(function (json) {
                var el;
                console.info(json)
                $.each(json.dataList, function(k,item){
                    console.info(k);
                    console.info(item);
                    var max=json.size;
                    var width = (item.count/max)*100;
                    el =  $('<tr>' +
                    '<td><span class="label label-warning">' + item.holeType + '</span></td>' +
                    '<td>' + item.vname + '</td>' +
                    '<td><div class="progress" style="margin-bottom: 0px;"><div class="progress-bar"  style="width: '+width+'%;"><span>'+item.count+'</span></div></div></td>' +
                    '</tr>');

                });
                $('#hole-type tbody').html(el)



            })
        })();

    },

    getLocalTime: function(nS){
        //return new Date(parseInt(nS) * 1000).toLocaleString().substr(0, 17);
        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    },
    changeHtml: function(){
        var w  =this;

        setTimeout(function(){
            $('.alert-info').addClass('in');
        }, 3000);

    },
    getContinentsGeo:function(){
        var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
        var json={};
        var worldMapLeft=$("#worldMap").offset().left;
        var worldMapTop=$("#worldMap").offset().top;
        var _offset={//地图位置偏移量
            asia:{x:10,y:-20},
            africa:{x:30,y:0},
            europe:{x:0,y:0},
            southAmerica:{x:20,y:0},
            northAmerica:{x:20,y:0},
            oceania:{x:120,y:0}
        };
        for(var i=0;i<continents.length;i++){
            var _map=$("#"+continents[i]);
            var x=_map.offset().left+_map.width()/2-worldMapLeft+_offset[continents[i]]['x'];
            var y=_map.offset().top+_map.height()/2-worldMapTop+_offset[continents[i]]['y'];
            json[continents[i]]={"x":x,"y":y};
        }
        return json;
    },
    addMark:function(map,item,value){
        //画起点和重点的连线
        var w=this;
        var from=spec[item.srcAddress]?spec[item.srcAddress]:item.srcGeoRegion;
        from=countryReflects[from]?countryReflects[from].c:from;
        var to=countryReflects[item.destGeoRegion]?countryReflects[item.destGeoRegion].c:item.destGeoRegion;
        to="浙江";//暂时写死
        if(from.length>15){
            from="africa";//防止解析成乱码的时候线划到外面
        }
        if(from&&to){
            map.addMarkLine(0,{data:[[{name:from,value: value},{name:to}]]});

            while(w.checkMarkLineNumberGt(map,15)){
                w.delMark(map);
            }

        }
        //map.addMarkLine(0,{data:[[{name:from,value: Math.round(Math.random() * 100000)},{name:to}]]});
        //map.addMarkPoint(0,{data:[{name:from, value:Math.round(Math.random() * 100)}]});


    },
    delMark:function(map){
        var series=map.getSeries();
        //var points=series[0].markPoint.data;

        //删除最早加载的点
        //map.delMarkPoint(0, points[0].name);
        var lines=series[0].markLine.data;
        //删除最早加载的线条
        var delStr=lines[0][0].name+' > '+lines[0][1].name;
        map.delMarkLine(0,delStr);
    },
    checkMarkLineNumberGt:function(map,count){
        var series=map.getSeries();
        var datas=series[0].markLine.data;
        return datas.length>count;
    },
    scroll: function(dom){

        var w = this;

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



    },
    scrollNum: function( dom,num){
        $(dom).data("countToOptions", {
            from: num-1234,
            to: num,
            speed: 500,
            formatter: function(b, a) {
                return b.toFixed(a.decimals).replace(/\B(?=(?:\d{3})+(?!\d))/g, ",")
            }
        });
        $(".timer").each(count);
    },
    type: function(line,levelText,levelColor){
        var w=this;
           // 打字机效果
        if(!w.typing){
            w.typing=true;
            $('.remain-danger').html("");
            $('.remain-danger-level').html("");
            $('.remain-danger-level').css("color",levelColor);
            $('.remain-danger').typetype(line,{
                callback:function(){
                    $('.remain-danger-level').typetype(levelText,{
                        callback:function(){
                            w.typing=false;
                        }

                    });
                }
            });

        }
    },

    circle: function(circle,num){

        var colorCls="green";
        var _text="正常";

        if(num>=50&num<80){
            colorCls='orange';
            _text="预警";
        }else if(num>=80){
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
    analyzeValue:function(dom,level,callback){
        var value=14;
        if(level==2){
            value=48;
        }else if(level==3){
            value=82;

        }
        $(".level-value",$(dom)).css("left",value+"%");
        callback&&callback.call(this);
    },
    getFlag:function(location){
        var flag="中国";
        if(countryReflects[location]&&countryReflects[location]['f']){
            flag= countryReflects[location]['f'];
        }else if(countryReflects[location]){
            flag=location;
        }
        return flag;

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
    }


};
var __data__ = {

    map: function(json){
        var d ={
            mapType: json
        };
        return d;

    },

    formatWafTime:function(time){
        return time.substr(11,time.length-1);
    },
    attackType: function(json){
        var data = [];
        function createItemStyle(){
            return {
                normal: {
                    color: 'rgb(' + [
                        Math.round(Math.random() * 200),
                        Math.round(Math.random() * 200),
                        Math.round(Math.random() * 200)
                    ].join(',') + ')'
                }
            };
        }
        $.each(json, function(i,item){
            data.push({
                name: i,
                value:item,
                itemStyle: createItemStyle()
            }) ;
        });

        return data;




    },
    riskGrade: function(json){
        var data ={
            title: '网站风险等级',
            data: [json]
        };
        return data;

    },
    serverGrade: function(json){
        var data ={
            title: '服务器健康度',
            data: [json]
        };
        return data;

    },
    serverQuality: function(json){
        var data ={
            title: '网站服务质量',
            data: [json]
        };
        return data;

    },
    threatLevel: function(json){
        var data ={
            title: '今日威胁等级',
            data: [json]
        };
        return data;

    },

    securityEvent: function(json){
        var data ={
            title: '网站安全事件',
            data: [json]
        }
        return data;

    },
    convertPoint2Time:function(point) {
        var hour=parseInt(point/60);
        var sec=(point%60).toFixed(0);
        hour=(hour<10?("0"+hour):(""+hour));
        sec=(sec<10?("0"+sec):(""+sec));
        var time=hour+":"+sec;

        return hour+":"+sec;

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
    }



//destGeoRegion: "辽宁",srcGeoRegion: "广东"




}



$(function(){

    WebMonitor.init();
});