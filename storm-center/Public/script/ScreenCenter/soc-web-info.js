/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/17
 *@example
 */
var mapGeo=__GEO__.china_province;
var WebMonitor = {
    init: function () {
        var w = this;



        w.initHtml();
        w.initEvent();

    },
    initHtml: function () {
        var w = this;

        w.domain = $('#domain').val()||'www.websaas.cn';

        $('.domain').text(w.domain);

        var width = $(window).width();
        var height = $(window).height();

        $('#mapVail').height(height * .175);
        $('#rank,#riskGrade, #serverGrade,#serverQuality,#threatLevel, #securityEvent').height(height * .075);


        $('#attackLine').height(height * .3125);
        $('#flowLine').height(height * .3125);
        $('#attackType').height(height * .175);


        $('.map').height(height * .385);
        $('#chinaMap').width(width * .5);
        $('#chinaMap').height(height * .35);
        $('#asia, #africa, #europe, #northAmerica, #southAmerica').width(width * .15);
        $('#asia, #africa, #europe, #northAmerica, #southAmerica').height(height * .15);
        $('#oceania').width(width * .2);
        $('#oceania').height(height * .2);

        //自适应
        $('.avail, .hole').height(height*.244);
        $('.visitArea, .attackUrl').height(height *.311);
        $('.visitIp, .attackIp').height(height *.35);


        $('.grade').height(height *.104);
        $('.map-main').height(height *.442);
        $('.attack').height(height *.358);

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
        $("#tab1 li:first a").click();

        w.tabChange();
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
                w.riskGrade = ec.init(document.getElementById('riskGrade'));
                w.serverGrade = ec.init(document.getElementById('serverGrade'));
                w.serverQuality = ec.init(document.getElementById('serverQuality'));
                w.threatLevel = ec.init(document.getElementById('threatLevel'));
                w.securityEvent = ec.init(document.getElementById('securityEvent'));
                //w.attackType = ec.init(document.getElementById('attackType'));
                w.attack = ec.init(document.getElementById('attackLine'));
                w.flow = ec.init(document.getElementById('flowLine'));

                w.chinaMap = ec.init(document.getElementById('chinaMap'));


                w.mapVail.showLoading();
                //w.attackType.showLoading();
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

                    oneMap.setOption(opt);
                }


                $("#tab .tab-pane:gt(0)").removeClass('active');
                $("#tab1 .tab-pane:gt(0)").removeClass('active');







                function dashBoard(){
                    $.getJSON(__ROOT__+'/ScreenCenter/SOCWebInfo/dashBorad?domain='+w.domain, null).success(function(json){
                        w.mapVail.setOption(w.mapVailOption(json.access));
                        w.mapVail.hideLoading();
                        w.riskGrade.setOption(w.gaugeOption(__data__.riskGrade(json.dash_board.safe_level)));
                        w.serverGrade.setOption(w.gaugeOption(__data__.serverGrade(json.dash_board.server_heath_level)));
                        w.serverQuality.setOption(w.gaugeOption(__data__.serverQuality(json.dash_board.web_quality)));
                        w.threatLevel.setOption(w.gaugeOption(__data__.threatLevel(json.dash_board.today_danger_level)));
                        w.securityEvent.setOption(w.gaugeOption(__data__.securityEvent(json.dash_board.security_event_count+1)));

                    });
                }



                //function visitCount(){
                //    $.getJSON(__ROOT__ + '/ScreenCenter/SOCWebInfo/visitCountTrend?domain='+w.domain, null).success(function (json) {
                //
                //        $.getJSON(__ROOT__ + '/ScreenCenter/SOCWebInfo/visitCountReal?domain='+w.domain, null).success(function (json1) {
                //            var data = {
                //                data1: json1,
                //                data2: json
                //            };
                //           // console.info(json1);
                //            w.flow.setOption(w.visitCountOption(data));
                //            w.flow.hideLoading();
                //        });
                //    });
                //}

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

               // function attackCount(){
               //    $.getJSON(__ROOT__ + '/ScreenCenter/SOCWebInfo/attackCount?domain='+w.domain, null).success(function (json) {
               //        var data = {
               //            data1: [],
               //            data2: []
               //        };
               //        for (var i = 0; i < json.length; i++) {
               //            data.data1.push(json[i]['in']);
               //            data.data2.push(json[i]['out']);
               //        }
               //
               //        w.attack.setOption(w.attackCountOption(data));
               //        w.attack.hideLoading();
               //
               //    });
               //}

                function attackCount(){
                    $.getJSON(__ROOT__ + '/ScreenCenter/WebCloudWaf/flows?domain='+w.domain, null).success(function (json) {
                        var data = {
                            data1: json['in'],
                            data2:  json['out']
                        };


                        w.attack.setOption(w.flowsOption(data));
                        w.attack.hideLoading();

                    });
                }

                function mapCount(){

                    //访问
                    //$.getJSON(__ROOT__+'/ScreenCenter/SOCWebInfo/visitAreaTopN?domain='+w.domain+'&num=all', null).success(function(json){
                    //
                    //    $.each(json.dataList,function(k,v){
                    //        w.mapOption.series[0].data.push({
                    //            name: countryReflects[k]?countryReflects[k].c:k,
                    //            value: v
                    //        });
                    //
                    //
                    //    });
                    //    //w.chinaMap.setOption(w.mapOption);
                    //
                    //
                    //
                    //});
                    //攻击
                    $.getJSON(__ROOT__+'/ScreenCenter/SOCWebInfo/visitAndattackReal?domain='+w.domain, null).success(function(json){
                        $.each(json.visits,function(i ,item){
                          //  console.info(item.destGeoRegion, item.srcGeoRegion)
                            setTimeout(function(){
                                w.addMark(w.chinaMap, item,1);
                            },i*500);
                           // w.addMark(w.chinaMap, item,4)
                        });
                        $.each(json.attacks,function(i ,item){
                            setTimeout(function(){
                                w.addMark(w.chinaMap, item,2);
                            },i*300);
                            // w.addMark(w.chinaMap, item,4)

                        });
                    });
                }
                dashBoard();
                mapCount();
                visitCount();
                attackCount();
                setInterval(function(){
                    visitCount();
                    attackCount();
                },1000*30);
                setInterval(function(){//100个线全部画完后重新获取新数据
                    mapCount();
                },1000*50);
                setInterval(dashBoard,30*1000);
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
        w.gaugeOption = function (json) {

            var option = {
                title: {
                    text: json.title,
                    x: 'center',
                    y: 'bottom',
                    textStyle: {
                        color: 'rgba(255,255,255,.4)',
                        fontSize: 14

                    }
                },
                series: [

                    {
                        type: 'gauge',
                        center: ['50%', '55%'],    // 默认全局居中
                        radius: '100%',
                        min: 1,
                        max: 3,
                        startAngle: 135,
                        endAngle: 45,
                        splitNumber: 2,
                        axisLine: {
                            length :15,// 坐标轴线
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: [[0.2, 'lime'],[0.8, '#1e90ff'],[1, '#ff4500']],
                                width: 5,
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisTick: {            // 坐标轴小标记
                            length :12,        // 属性length控制线长
                            lineStyle: {       // 属性lineStyle控制线条样式
                                color: 'auto',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        axisLabel: {
                            show: false
                        },
                        splitLine: {           // 分隔线
                            length :15,         // 属性length控制线长
                            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                                width: 1,
                                color: '#fff',
                                shadowColor : '#fff', //默认透明
                                shadowBlur: 10
                            }
                        },
                        pointer: {
                            width:2,
                            shadowColor : '#fff', //默认透明
                            shadowBlur: 5
                        },
                        title : {
                            show: false
                        },
                        detail : {
                            show: false
                        },
                        data: json.data
                    }
                ]
            };


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

                                borderColor: '#001320',
                                borderWidth: 0.5,
                                areaStyle: {
                                    color: '#06304e'
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



        w.attackCountOption = function (json) {

            var time = [];
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
                    data: ['境内攻击量','境外攻击量']
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
                        name: '境内攻击量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data1
                    },
                    {
                        name: '境外攻击量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data2
                    }
                ]


            };
            for (var i = 0; i < 1441; i++) {
                time.push(__data__.convertPoint2Time(i));
            }
            option.xAxis[0].data = time;


            return option;
        };
        w.visitCountOptionHis = function (json) {
            var time = [];
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
                    data: ['实时访问量','预测访问量']
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
                        name: '实时访问量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data1
                    },
                    {
                        name: '预测访问量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data: json.data2
                    }
                ]

            };

            for (var i = 0; i < 1441; i++) {
                time.push(__data__.convertPoint2Time(i));
            }

            option.xAxis[0].data = time;

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
    },
    tabChange: function () {
        var w = this;
        var i = 0,j=0;
        var len = $('#tab .nav-tabs li').length;
        var len1 = $('#tab1 .nav-tabs li').length;

        setInterval(function () {
            $('#tab .nav-tabs li:eq(' + i + ') a').click();
            i++;
            if (i >= len) {
                i = 0;
            };
            /*$('#tab1 .nav-tabs li:eq(' + j + ') a').click();
            j++;
            if (j >= len1) {
                j = 0;
            }*/
        }, 10000);
    },
    gridHtml: function () {
        var w = this;

        (function(){

            $("tbody",$('#areaRank')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/SOCWebInfo/visitAreaTopN?domain='+w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                count:10,
                refresh_interval:60000,//刷新间隔
                interval:1000,//排序间隔
                draw:function(index,item,json){
                    var max=json.dataList[0]['value'];
                    var size=json.size;
                    var flag="中国";
                    if(countryReflects[item.name]&&countryReflects[item.name]['f']){
                        flag=countryReflects[item.name]['f'];
                    }
                    var el = $('<tr style="display: block;">' +
                                    '<td><img src="' + __PUBLIC__ + '/image/attack-src/'+flag+'.png" /></td>' +
                                    '<td>' + item.name + '</td>' +
                                    '<td class="people"></td>' +
                                    '<td class="count">' + (item.value*100/size).toFixed(2) + '%</td>' +
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
                externals:[function(prev,current){
                    var start=0;
                    var end=current.size;

                    if(prev){
                        start=prev.size;
                    }else if(end-1000>0){
                        start=end-1000;
                    }
                    startCount($(".areaCount"),{
                        from:start,
                        to:end
                    });


                }]


            });

        })();
        //访客IP排行

        (function(){
            $("tbody",$('#ipRank')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/SOCWebInfo/visitIpTopN?domain='+w.domain,
                items:"dataList",
                key:"ip",
                value:"count",
                count:10,
                auto_refresh:false,
                refresh_interval:6000,//刷新间隔
                interval:2000,//排序间隔
                draw:function(index,item,json){
                    var flag="中国";
                    if(countryReflects[item.location]&&countryReflects[item.location]['f']){
                        flag=countryReflects[item.location]['f'];
                    }
                    var max=json.dataList[0].count;
                    var width = (item.count/max)*100;
                    var el = $('<tr style="height: 20px;">' +
                                '<td><img src="' + __PUBLIC__ + '/image/attack-src/'+flag+'.png"  /></td>' +
                                '<td>' + item.location + '</td>' +
                                '<td>' +item.ip + '</td>' +
                                '<td>' + item.count + '</td>' +
                                '</tr>'+
                                '<tr style="height: 20px;"><td></td><td></td>' +
                                '<td colspan="2"><div class="progress"><div class="progress-bar" role="progressbar" style="width: '+width+'%"></div></div></td>' +
                                '</tr>');
                    return el;


                },
                externals:[function(prev,current){
                    var progressW =  $('#ipRank tbody tr:eq(0)').width()-$('#ipRank tbody tr:eq(0) td:eq(0)').width()-$('#ipRank tbody tr:eq(0) td:eq(1)').width();
                    $('#ipRank tbody .progress').width(progressW) ;
                    $('.ipCount').text(w.numS(current.size, 0));
                }]


            });

        })();
        (function(){
            $("tbody",$('#attackUrl')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/SOCWebInfo/attackUrlTopN?domain='+w.domain,
                items:"dataList",
                key:"name",
                value:"value",
                count:10,
                refresh_interval:60000,//刷新间隔
                interval:2000,//排序间隔
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
                externals:[function(prev,current){
                    var start=0;
                    var end=current.size;

                    if(prev){
                        start=prev.size;
                    }else if(end-1000>0){
                        start=end-1000;
                    }
                    startCount($(".urlCount"),{
                        from:start,
                        to:end
                    });
                }]

            });


        })();
        //攻击源IP排行
        (function(){

            $("tbody",$('#attackIp')).itemScoller({
                ajaxUrl:__ROOT__+'/ScreenCenter/SOCWebInfo/attackIpTopN?domain='+w.domain,
                items:"dataList",
                key:"ip",
                value:"count",
                count:10,
                refresh_interval:60000,//刷新间隔
                interval:2000,//排序间隔
                draw:function(index,item,json){
                    var flag="中国";
                    if(countryReflects[item.location]&&countryReflects[item.location]['f']){
                        flag=countryReflects[item.location]['f'];
                    }
                    var el = $('<tr style="display: block;">' +
                        '<td><img src="' + __PUBLIC__ + '/image/attack-src/'+flag+'.png" /></td>' +
                        '<td>' + item.location + '</td>' +
                        '<td>' + item.ip + '</td>' +
                        '<td>' + item.count + '</td>' +

                        '</tr>');
                    return el;

                },
                compare:function(v1,v2){
                    return v2>v1?true:false;//降序排列
                },
                externals:[function(prev,current){
                    var start=0;
                    var end=current.size;

                    if(prev){
                        start=prev.size;
                    }else if(end-1000>0){
                        start=end-1000;
                    }
                    startCount($(".ipCount"),{
                        from:start,
                        to:end
                    });


                }]


            });

        })();



        //漏洞类型
        (function(){
             $.getJSON(__ROOT__ + "/ScreenCenter/CloudMonitor/domainVulsInfo?domain=www.hfxf.gov.cn").success(function (json) {
                 var el;
                 console.info(json);
                 console.info(json.dataList);
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
                     $('#hole-type tbody').append(el)

                 });




             })
         })();


    },

    numS: function (s, n) {
        //数字三位用逗号隔开
        n = n > 0 && n <= 20 ? n : 2;
        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
        t = "";
        for (var i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        //return t.split("").reverse().join("")+ "." + r;
        return t.split("").reverse().join("");

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
        for(var i=0;i<continents.length;i++){
            var _map=$("#"+continents[i]);
            var x=_map.offset().left+_map.width()/2;
            /*if(continents[i]==='oceania'){
                x=_map.offset().left+_map.width()-10;
            }*/
            var y=_map.offset().top+_map.height()/2;

            json[continents[i]]={"x":x,"y":y};
        }
        return json;
    },
    addMark:function(map,item,value){
        //画起点和重点的连线
        var w=this;
        //var from=countryReflects[item.srcGeoRegion]?countryReflects[item.srcGeoRegion].c:item.srcGeoRegion;
        //var to=countryReflects[item.destGeoRegion]?countryReflects[item.destGeoRegion].c:item.destGeoRegion;
        if(item.srcGeoRegion&&item.destGeoRegion&&!countryReflects[item.srcGeoRegion]&&!countryReflects[item.destGeoRegion]){
           // console.info(from+"--"+to);
            map.addMarkLine(0,{data:[[{name:item.srcGeoRegion,value: value},{name:item.destGeoRegion}]]});

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
        // console.info(datas.length);
      //  console.info(datas.length);
        return datas.length>count;
    }



};
var __data__ = {

    map: function(json){
        var d ={
            mapType: json
        }
        return d

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

var countryReflects={//一些关系映射
    '加利福尼亚':{c:'northAmerica',f:'美国'},

    '北美地区':{c:'northAmerica',f:'美国'},
    '伯利兹':{c:'northAmerica'},
    '加拿大':{c:'northAmerica'},
    '哥伦比亚':{c:'northAmerica'},
    '圣卢西亚':{c:'northAmerica'},
    '墨西哥':{c:'northAmerica'},
    '多米尼克':{c:'northAmerica'},
    '尼加拉瓜':{c:'northAmerica'},
    '智利':{c:'northAmerica'},
    '牙买加':{c:'northAmerica'},
    '美国':{c:'northAmerica'},
    '阿根廷':{c:'northAmerica'},
    '新泽西':{c:'northAmerica',f:'美国'},

    '古巴':{c:"southAmerica"},
    '巴巴多斯':{c:'southAmerica'},
    '巴哈马':{c:'southAmerica'},
    '巴拿马':{c:'southAmerica'},
    '巴西':{c:'southAmerica'},
    '海地':{c:'southAmerica'},
    '苏里南':{c:'southAmerica'},


    '丹麦':{c:'europe'},
    '乌克兰':{c:'europe'},
    '保加利亚':{c:'europe'},
    '冰岛':{c:'europe'},
    '匈牙利':{c:'europe'},
    '卢森堡':{c:'europe'},
    '奥地利':{c:'europe'},
    '希腊':{c:'europe'},
    '德国':{c:'europe'},
    '挪威':{c:'europe'},
    '捷克':{c:'europe'},
    '摩纳哥':{c:'europe'},
    '比利时':{c:'europe'},
    '法国':{c:'europe'},
    '波兰':{c:'europe'},
    '爱尔兰':{c:'europe'},
    '瑞典':{c:'europe'},
    '瑞士':{c:'europe'},
    '立陶宛':{c:'europe'},
    '罗马利亚':{c:'europe'},
    '芬兰':{c:'europe'},
    '英国':{c:'europe'},
    '荷兰':{c:'europe'},
    '马其顿':{c:'europe'},
    '西班牙':{c:'europe'},

    '不丹':{c:'asia'},
    '印度':{c:'asia'},
    '吉尔吉斯斯坦':{c:'asia'},
    '哈萨克斯坦':{c:'asia'},
    '土耳其':{c:'asia'},
    '孟加拉国':{c:'asia'},
    '尼泊尔':{c:'asia'},
    '巴基斯坦':{c:'asia'},
    '新加坡':{c:'asia'},
    '日本':{c:'asia'},
    '朝鲜':{c:'asia'},
    '柬埔寨':{c:'asia'},
    '泰国':{c:'asia'},
    '缅甸':{c:'asia'},
    '老挝':{c:'asia'},
    '菲律宾':{c:'asia'},
    '越南':{c:'asia'},
    '阿富汗':{c:'asia'},
    '韩国':{c:'asia'},
    '马尔代夫':{c:'asia'},
    '马来西亚':{c:'asia'}

};
$(function(){

    WebMonitor.init();
});