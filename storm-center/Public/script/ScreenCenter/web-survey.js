/**
 *@name
 *@author Sean.xiang
 *@date 2015/7/23
 *@example
 */
/**
 *
 */



    var Site = {
        init: function(){
            var w = this;
            w.initUnAccess();
            w.initHtml();
            w.initEvent();
            w.initDomainCount();// 初始化统计信息



        },
        initHtml: function(){
            var w = this;
            var height= $(window).height();

            $('#siteBar').height(height* .3);
            $('#safePie').height(height* .3);
            $('#map').height(height* .6);
            $('#tabWebPie').height(height* .25);
            $('#tabInfoPie').height(height* .25);
            $('#tabHolePie').height(height* .25);
            $('#tabWebBar').height(height* .3);
            $('#tabInfoBar').height(height* .3);
            $('#tabHoleBar').height(height* .3);

            w.initDraw();
        },
        initEvent: function(){
            var w = this;
            w.scroll();
            w.tabChange();
        },
        initDomainCount: function(){

            // 不可访问网站量
            $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getWebAvailCount', {"type":2}).success(function(json){
                $(".normalWeb").html(json['count']);
            });

            // 不可访问网站量
            $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getWebAvailCount', {"type":1}).success(function(json){
                $(".unconnectWeb").html(json['count']);
            });

            // 异常
            $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getWebAvailCount', {"http_code":-2}).success(function(json){
                $(".abnormalWeb").html(json['count']);
            });
        },

        initUnAccess : function(){

            $(".unAccessDomain").html("");

            // 异常
            $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getOfflineRecord', null).success(function(json){
                $.each(json['items'], function(point, item){
                    var tr = $("<tr></tr>");
                    tr.append($("<td>" + item.date_key + "</td>"));
                    tr.append($("<td>" + item.domain + "</td>"));
                    tr.append($("<td class='red' >" + item.type_desc + "</td>"));
                    $(".unAccessDomain").append(tr);
                });
            });


        },

        initDraw: function(){
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
                    'echarts/chart/bar'
                ],
                function (ec) {
                    w.siteBar= ec.init(document.getElementById('siteBar'));
                    w.safePie= ec.init(document.getElementById('safePie'));
                    w.map= ec.init(document.getElementById('map'));
                    w.tabWebPie= ec.init(document.getElementById('tabWebPie'));
                    w.tabInfoPie= ec.init(document.getElementById('tabInfoPie'));
                    w.tabHolePie= ec.init(document.getElementById('tabHolePie'));
                    w.tabWebBar= ec.init(document.getElementById('tabWebBar'));
                    w.tabInfoBar= ec.init(document.getElementById('tabInfoBar'));
                    w.tabHoleBar= ec.init(document.getElementById('tabHoleBar'));

                    w.siteBar.showLoading();
                    w.safePie.showLoading();
                    w.tabWebPie.showLoading();
                    w.tabInfoPie.showLoading();
                    w.tabHolePie.showLoading();
                    w.tabWebBar.showLoading();
                    w.tabInfoBar.showLoading();
                    w.tabHoleBar.showLoading();

                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getWebAccessGroup', null).success(function(json){
                        w.siteBar.setOption(w.siteBarOption(json));
                        w.siteBar.hideLoading();
                    });


                    $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getWebSafeLevelData', null).success(function(json){
                        w.safePie.setOption(w.safePieOption.getOption(json));
                        w.safePie.hideLoading();
                    });

                    w.map.setOption(w.mapOption);

                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getRegionWebCount', null).success(function(json){
                        w.tabWebPie.setOption(w.tabPieOption(__data__.tabWebPie(json)));
                        w.tabWebBar.setOption(w.tabBarOption(__data__.tabWebBar(json)));
                        w.tabWebPie.hideLoading();
                        w.tabWebBar.hideLoading();
                    });

                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getTypeGroup', null).success(function(json){
                        w.tabInfoPie.setOption(w.tabPieOption(__data__.tabInfoPie(json)));
                        w.tabInfoPie.hideLoading();
                    });


                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getBigFileLevelGroup', null).success(function(json){
                        w.tabHolePie.setOption(w.tabPieOption(__data__.tabHolePie(json)));
                        w.tabHolePie.hideLoading();
                    });



                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getRegionTypeGroup', null).success(function(json){
                        w.tabInfoBar.setOption(w.tabBarOption(__data__.tabInfoBar(json)));
                        w.tabInfoBar.hideLoading();
                    });

                    $.getJSON(__ROOT__+'/ScreenCenter/WebSurvey/getBigFileGroup', null).success(function(json){
                        w.tabHoleBar.setOption(w.tabBarOption(__data__.tabHoleBar(json)));
                        w.tabHoleBar.hideLoading();
                    });
                }
            );

        },
        // 各省网站TOP5
        initOption: function(){
            var w = this;
            w.siteBarOption= function(json){
                var option = {
                    color: ['#00dd00'], //图表的颜色
                    grid: {
                        borderWidth: 0
                    },
                    tooltip: {
                        show: true
                    },
                    yAxis  : [
                        {
                            type : 'category',
                            axisLabel: { //坐标轴文本
                                textStyle: {
                                    color: '#00dd00',
                                    fontSize: 14
                                }
                            },
                            axisLine: {// 坐标轴线
                                show: false
                            },
                            axisTick: {//坐标轴小标记
                                show: false
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            data : []
                        }
                    ],
                    xAxis : [
                        {
                            type : 'value',
                            axisLabel: {//坐标轴文本
                                show: false
                            },
                            axisLine: {// 坐标轴线
                                show: false
                            },
                            splitLine: {// 网格线
                                show: false
                            }
                        }
                    ],

                    series : [
                        {
                            "name":"可访问网站数",
                            "type":"bar",
                            "data": [],
                            itemStyle: {
                                normal:{
                                    label: {
                                        show: true,
                                        color: 'red'
                                    }
                                }

                            }

                        }
                    ]
                }
                var value = json.items;
                var i = 0;
                $.each(value, function(point, item){
                    if(i < 5){
                        option.yAxis[0].data.push(item['province']);
                        option.series[0].data.push(item['c']);
                    }
                    i++;
                });
                option.yAxis[0].data.reverse();
                option.series[0].data.reverse();
                return option;
            };
            // 网站安全等级饼图option
            w.safePieOption = {
                getOption: function(json){
                    var option = {
                        tooltip : {
                            trigger: 'item',
                            formatter: "{a} <br/>{b} : {c} ({d}%)"
                        },
                        color: [
                            //'#CC5C5C', '#FEA512', '#40DFCF', '#2591FD'
                            '#40DFCF', '#FEA512', '#2591FD', '#CC5C5C'
                        ],
                        calculable : false,
                        series : [
                            {
                                name:'访问来源',
                                type:'pie',
                                radius : '55%',
                                center: ['50%', '60%'],
                                data:[
                                ]
                            }
                        ]
                    }
                    $.each(json.src, function(point, item){
                        if(item.value > 0){
                            option.series[0].data.push({"value": (item.value), "name":item.name});
                        }
                    });
                    return option;
                }
            };
            w.mapOption={
                color: [
                    'rgba(0, 221, 0, 0.8)','rgba(221, 44, 0, 0.8)'
                ],
                legend: {
                    orient: 'vertical',
                    x: 'center',
                    y:100,
                    itemGap: 12,
                    data:['各省可访问网站','各省不可访问网站'],
                    textStyle : {
                        color: '#fff',
                        fontSize: 16
                    }
                },
                series: [
                    {
                        name: 'map',
                        type: 'map',
                        mapType: 'china',
                        hoverable: false,
                        itemStyle:{
                            normal:{
                                borderColor:'#003e71',
                                borderWidth: 1,
                                areaStyle:{
                                    color: '#000'//'#1b1b1b'
                                }

                            },
                            emphasis: {
                                label: {
                                    show: false
                                }
                            }
                        },
                        data: [],
                        geoCoord : __data__.map.geo
                    },
                    {
                        name: '各省可访问网站',
                        type: 'map',
                        mapType: 'china',
                        itemStyle:{
                            normal:{
                                areaStyle:{
                                    color: '#1b1b1b'
                                }
                            }
                        },
                        data : [],
                        markPoint : {
                            symbolSize: 2,
                            large: true,
                            effect : {
                                show: true
                            },
                            data : (function(){

                                var data = [];
                                var len = 2000;
                                var geoCoord;
                                while(len--) {
                                    geoCoord = __data__.map.placeList[len % __data__.map.placeList.length].geoCoord;
                                    data.push({
                                        name : __data__.map.placeList[len % __data__.map.placeList.length].name,
                                        value : 90,
                                        geoCoord : [
                                            geoCoord[0] + Math.random() * 5 * -1 + 1.2 ,
                                            geoCoord[1] + Math.random() * 2 * -1 + 1.2
                                        ]
                                    });
                                }
                                return data;
                            })()
                        }
                    },
                    {
                        name: '各省不可访问网站',
                        type: 'map',
                        mapType: 'china',
                        itemStyle:{
                            normal:{
                                areaStyle:{
                                    color: '#1b1b1b'
                                }
                            }
                        },
                        data : [],
                        markPoint : {
                            symbolSize: 2,
                            large: true,
                            effect : {
                                show: true
                            },
                            data : (function(){
                                var data = [];
                                var len = 1000;
                                var geoCoord;
                                while(len--) {
                                    geoCoord = __data__.map.placeList[len % __data__.map.placeList.length].geoCoord;
                                    data.push({
                                        geoCoord : [
                                            geoCoord[0] + Math.random() * 4 * -1 + 1,
                                            geoCoord[1] + Math.random() * 2 * -1 + 2
                                        ]
                                    })
                                }
                                return data;
                            })()
                        }
                    }


                ]

            };
            w.tabPieOption= function(json){
                var option  = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    color: [
                        '#2E84F8', '#32cd32', '#FFA500',
                        '#FF6347', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                        '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                        '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0'
                    ],
                    calculable : false,
                    series : [
                        {
                            name: json.name,
                            type:'pie',
                            center:['50%', '50%'],
                            radius : ['40%', '60%'],
                            data: json.data
                        }
                    ]
                };

                return option;

            };
            w.tabBarOption= function(json){
                var option = {
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    grid: {
                        borderWidth: 0
                    },
                    legend: {
                        x : 'center',
                        y : '30',
                        data: json.legend,
                        textStyle: {
                            color: "#fff"
                        }
                    },
                    calculable : false,
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel: { //坐标轴文本
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            },
                            axisLine: {// 坐标轴线
                                show: true
                            },
                            axisTick: {//坐标轴小标记
                                show: true
                            },
                            splitLine: {// 网格线
                                show: false
                            }
                        }
                    ],

                    xAxis  : [
                        {
                            type : 'category',
                            axisLabel : {
                                show:true,
                                textStyle:{
                                    color: 'white',
                                    fontSize: 12
                                }
                            },

                            axisLine: {// 坐标轴线
                                show: true
                            },
                            axisTick: {//坐标轴小标记
                                show: false
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            data :  json.dataX
                        }
                    ],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false,
                                position: 'top',
                                formatter: '{c}',
                                textStyle: { //text 样式
                                    fontSize: 14
                                }
                            }
                        }
                    },

                    series : [
                        {
                            "name": json.series0.name,
                            "type":"bar",
                            stack: 'name',
                            barMaxWidth: 50,
                            itemStyle: {
                                normal: {
                                    //color: function(params) {
                                    //    // build a color map as your need.
                                    //    var colorList = [
                                    //        '#aa2200', '#aaaa00', '#33aa00', '#00dd00', '#00aa77', '#00c6dd',
                                    //        '#0044aa', '#7700aa', '#aa0033', '#ff0033', '#cc00ff', '#4c00ff',
                                    //        '#0016dd', '#00b2ff', '#00ffb2', '#00ff33', '#84ff77', '#e3ff77',
                                    //        '#eaffbb', '#bbffbb', '#bbfff1', '#77c8ff', '#007717', '#b0dd00',
                                    //        '#ff9900', '#dd5800', '#f8bbff', '#7792ff', '#bbdcff', '#dd0084',
                                    //        '#ff0033', '#cc00ff', '#4c00ff','#bbfff1'
                                    //    ];
                                    //    return colorList[params.dataIndex]
                                    //}
                                }
                            },
                            data: json.series0.data


                        },
                        {
                            name: json.series1.name,
                            type: 'bar',
                            stack: 'name',
                            barMaxWidth: 50,
                            itemStyle: {
                                normal: {
                                    //color: function(params) {
                                    //    // build a color map as your need.
                                    //    var colorList = [
                                    //        '#ff9900', '#dd5800', '#f8bbff', '#7792ff', '#bbdcff', '#dd0084',
                                    //        '#ff0033', '#cc00ff', '#4c00ff','#bbfff1',
                                    //        '#aa2200', '#aaaa00', '#33aa00', '#00dd00', '#00aa77', '#00c6dd',
                                    //        '#0044aa', '#7700aa', '#aa0033', '#ff0033', '#cc00ff', '#4c00ff',
                                    //        '#0016dd', '#00b2ff', '#00ffb2', '#00ff33', '#84ff77', '#e3ff77',
                                    //        '#eaffbb', '#bbffbb', '#bbfff1', '#77c8ff', '#007717', '#b0dd00'
                                    //
                                    //    ];
                                    //    return colorList[params.dataIndex]
                                    //}
                                }
                            },
                            data: json.series1.data
                        },
                        {
                            name: json.series2.name,
                            type: 'bar',
                            stack: 'name',
                            barMaxWidth: 50,
                            itemStyle: {
                                normal: {
                                    //color: function(params) {
                                    //    // build a color map as your need.
                                    //    var colorList = [
                                    //        '#0044aa', '#7700aa', '#aa0033', '#ff0033', '#cc00ff', '#4c00ff',
                                    //        '#ff9900', '#dd5800', '#f8bbff', '#7792ff', '#bbdcff', '#dd0084',
                                    //        '#ff0033', '#cc00ff', '#4c00ff','#bbfff1',
                                    //        '#aa2200', '#aaaa00', '#33aa00', '#00dd00', '#00aa77', '#00c6dd',
                                    //        '#0016dd', '#00b2ff', '#00ffb2', '#00ff33', '#84ff77', '#e3ff77',
                                    //        '#eaffbb', '#bbffbb', '#bbfff1', '#77c8ff', '#007717', '#b0dd00'
                                    //
                                    //    ];
                                    //    return colorList[params.dataIndex]
                                    //}
                                }
                            },
                            data: json.series2.data
                        }

                    ]
                };

                return option;

            }

        },

        scroll: function(){
            //var w = this;

            var w = this;

            w.y = 0;

            w.el = $('#grid');

            w.rollEl = $('#gridRoll');
            w.innerEl = $('#gridList');
            w.waitEl = w.innerEl.clone(true).removeAttr('id');
            w.rollEl.append(w.waitEl);

            d3.timer(function(){
                w.y = w.y - 0.3;
                w.innerEl.css({
                    top: w.y
                });
                w.waitEl.css({
                    top: w.y + w.innerEl.height()
                });

                if(w.y * -1 > w.innerEl.height()){
                    w.y = 0;
                    var tmp = w.innerEl;

                    w.innerEl = w.waitEl;
                    w.waitEl = tmp;
                }
            });

            setInterval(function(){
                w.initUnAccess();
            }, 60*1000);

        },

        tabChange : function(){
            var w = this;
            var  i=0;
            var len = $('.nav-tabs li').length;

            setInterval(function(){
                $('.nav-tabs li:eq(' + i + ') a').click();
                i++;
                if(i>=len){
                    i=0;
                }
            }, 5000);
        }
    };
    var __data__={
        map: {
            geo : {

                '杭州': [119.5313,29.8773],
                '北京': [116.4551,40.2539],
                '上海': [121.4648,31.2891],
                '新疆': [84.9023,41.748],
                '广州': [113.5107,23.2196],
                '哈尔滨': [127.9688,45.368],
                '武汉': [114.3896,30.6628],
                '重庆': [107.7539,30.1904],
                '南京': [118.8062,31.9208],
                '西安': [109.1162,34.2004]
            },
            placeList: [
                //{name:'海门', geoCoord:[121.15, 31.89]},
                {name:'鄂尔多斯', geoCoord:[109.781327, 39.608266]},
                {name:'招远', geoCoord:[120.38, 37.35]},
                {name:'舟山', geoCoord:[122.207216, 29.985295]},
                {name:'齐齐哈尔', geoCoord:[123.97, 47.33]},
                {name:'盐城', geoCoord:[120.13, 33.38]},
                {name:'赤峰', geoCoord:[118.87, 42.28]},
                {name:'青岛', geoCoord:[120.33, 36.07]},
                {name:'乳山', geoCoord:[121.52, 36.89]},
                {name:'金昌', geoCoord:[102.188043, 38.520089]},
                {name:'泉州', geoCoord:[118.58, 24.93]},
                {name:'莱西', geoCoord:[120.53, 36.86]},
                {name:'日照', geoCoord:[119.46, 35.42]},
                {name:'南通', geoCoord:[121.05, 32.08]},
                {name:'拉萨', geoCoord:[91.11, 29.97]},
                {name:'云浮', geoCoord:[112.02, 22.93]},
                {name:'梅州', geoCoord:[116.1, 24.55]},
                {name:'文登', geoCoord:[122.05, 37.2]},
                {name:'上海', geoCoord:[121.48, 31.22]},
                {name:'攀枝花', geoCoord:[101.718637, 26.582347]},
                {name:'威海', geoCoord:[122.1, 37.5]},
                {name:'承德', geoCoord:[117.93, 40.97]},
                {name:'潮州', geoCoord:[116.63, 23.68]},
                {name:'丹东', geoCoord:[124.37, 40.13]},
                {name:'太仓', geoCoord:[121.1, 31.45]},
                {name:'曲靖', geoCoord:[103.79, 25.51]},
                {name:'烟台', geoCoord:[121.39, 37.52]},
                {name:'福州', geoCoord:[119.3, 26.08]},
                {name:'瓦房店', geoCoord:[121.979603, 39.627114]},
                {name:'即墨', geoCoord:[120.45, 36.38]},
                {name:'抚顺', geoCoord:[123.97, 41.97]},
                {name:'玉溪', geoCoord:[102.52, 24.35]},
                {name:'张家口', geoCoord:[114.87, 40.82]},
                {name:'阳泉', geoCoord:[113.57, 37.85]},
                {name:'莱州', geoCoord:[119.942327, 37.177017]},
                {name:'湖州', geoCoord:[120.1, 30.86]},
                {name:'昆山', geoCoord:[120.95, 31.39]},
                {name:'宁波', geoCoord:[121.56, 29.86]},
                {name:'揭阳', geoCoord:[116.35, 23.55]},
                {name:'荣成', geoCoord:[122.41, 37.16]},
                {name:'连云港', geoCoord:[119.16, 34.59]},
                {name:'葫芦岛', geoCoord:[120.836932, 40.711052]},
                {name:'常熟', geoCoord:[120.74, 31.64]},
                {name:'河源', geoCoord:[114.68, 23.73]},
                {name:'淮安', geoCoord:[119.15, 33.5]},
                {name:'泰州', geoCoord:[119.9, 32.49]},
                {name:'南宁', geoCoord:[108.33, 22.84]},
                {name:'营口', geoCoord:[122.18, 40.65]},
                {name:'惠州', geoCoord:[114.4, 23.09]},
                {name:'江阴', geoCoord:[120.26, 31.91]},
                {name:'蓬莱', geoCoord:[120.75, 37.8]},
                {name:'韶关', geoCoord:[113.62, 24.84]},
                {name:'嘉峪关', geoCoord:[98.289152, 39.77313]},
                {name:'延安', geoCoord:[109.47, 36.6]},
                {name:'太原', geoCoord:[112.53, 37.87]},
                {name:'清远', geoCoord:[113.01, 23.7]},
                {name:'中山', geoCoord:[113.38, 22.52]},
                {name:'昆明', geoCoord:[102.73, 25.04]},
                {name:'长治', geoCoord:[113.08, 36.18]},
                {name:'深圳', geoCoord:[114.07, 22.62]},
                {name:'宿迁', geoCoord:[118.3, 33.96]},
                {name:'咸阳', geoCoord:[108.72, 34.36]},
                {name:'铜川', geoCoord:[109.11, 35.09]},
                {name:'平度', geoCoord:[119.97, 36.77]},
                {name:'江门', geoCoord:[113.06, 22.61]},
                {name:'章丘', geoCoord:[117.53, 36.72]},
                {name:'肇庆', geoCoord:[112.44, 23.05]},
                {name:'大连', geoCoord:[121.62, 38.92]},
                {name:'临汾', geoCoord:[111.5, 36.08]},
                {name:'吴江', geoCoord:[120.63, 31.16]},
                {name:'沈阳', geoCoord:[123.38, 41.8]},
                {name:'苏州', geoCoord:[120.62, 31.32]},
                {name:'嘉兴', geoCoord:[120.76, 30.77]},
                {name:'长春', geoCoord:[125.35, 43.88]},
                {name:'胶州', geoCoord:[120.03336, 36.264622]},
                {name:'银川', geoCoord:[106.27, 38.47]},
                {name:'张家港', geoCoord:[120.555821, 31.875428]},
                {name:'三门峡', geoCoord:[111.19, 34.76]},
                {name:'锦州', geoCoord:[121.15, 41.13]},
                {name:'南昌', geoCoord:[115.89, 28.68]},
                {name:'黑龙江', geoCoord:[126.63	 ,45.75]},
                {name:'自贡', geoCoord:[104.778442, 29.33903]},
                {name:'郴县', geoCoord:[113, 25.79]},
                {name:'吉林', geoCoord:[126.57, 43.87]},
                {name:'阳江', geoCoord:[111.95, 21.85]},
                {name:'泸州', geoCoord:[105.39, 28.91]},
                {name:'西宁', geoCoord:[101.74, 36.56]},
                {name:'宜宾', geoCoord:[104.56, 29.77]},
                {name:'呼和浩特', geoCoord:[111.65, 40.82]},
                {name:'成都', geoCoord:[104.06, 30.67]},
                {name:'洪江', geoCoord:[109.96, 27.1]},
                {name:'芷江', geoCoord:[109.78,27.44]},
                {name:'大同', geoCoord:[113.3, 40.12]},
                {name:'镇江', geoCoord:[119.44, 32.2]},
                {name:'桂林', geoCoord:[110.28, 25.29]},
                {name:'张家界', geoCoord:[110.479191, 29.117096]},
                {name:'宜兴', geoCoord:[119.82, 31.36]},
                {name:'西安', geoCoord:[108.95, 34.27]},
                {name:'凤凰', geoCoord:[109.43, 27.92]},
                {name:'金坛', geoCoord:[111.87, 29.64]},
                {name:'津市', geoCoord:[119.56, 31.74]},
                {name:'东营', geoCoord:[118.49, 37.46]},
                {name:'牡丹江', geoCoord:[129.58, 44.6]},
                {name:'花垣', geoCoord:[109.46, 28.59]},
                {name:'遵义', geoCoord:[106.9, 27.7]},
                {name:'郴州', geoCoord:[113,25.79]},
                {name:'绍兴', geoCoord:[120.58, 30.01]},
                {name:'扬州', geoCoord:[119.42, 32.39]},
                {name:'常州', geoCoord:[119.95, 31.79]},
                {name:'潍坊', geoCoord:[119.1, 36.62]},
                {name:'重庆', geoCoord:[106.54, 29.59]},
                {name:'湘乡', geoCoord:[112.5, 27.75]},
                {name:'台州', geoCoord:[121.420757, 28.656386]},
                {name:'南京', geoCoord:[118.78, 32.04]},
                {name:'滨州', geoCoord:[118.03, 37.36]},
                {name:'贵阳', geoCoord:[106.71, 26.57]},
                {name:'无锡', geoCoord:[120.29, 31.59]},
                {name:'本溪', geoCoord:[123.73, 41.3]},
                {name:'渭南', geoCoord:[109.5, 34.52]},
                {name:'马鞍山', geoCoord:[118.48, 31.56]},
                {name:'宝鸡', geoCoord:[107.15, 34.38]},
                {name:'焦作', geoCoord:[113.21, 35.24]},
                {name:'句容', geoCoord:[119.16, 31.95]},
                {name:'北京', geoCoord:[116.46, 39.92]},
                {name:'徐州', geoCoord:[117.2, 34.26]},
                {name:'衡水', geoCoord:[115.72, 37.72]},
                {name:'包头', geoCoord:[110, 40.58]},
                {name:'绵阳', geoCoord:[104.73, 31.48]},
                {name:'乌鲁木齐', geoCoord:[87.68, 43.77]},
                {name:'枣庄', geoCoord:[117.57, 34.86]},
                {name:'杭州', geoCoord:[120.19, 30.26]},
                {name:'宁乡', geoCoord:[	112.55,28.27]},
                {name:'淄博', geoCoord:[118.05, 36.78]},
                {name:'鞍山', geoCoord:[122.85, 41.12]},
                {name:'溧阳', geoCoord:[119.48, 31.43]},
                //{name:'库尔勒', geoCoord:[86.06, 41.68]},
                {name:'安阳', geoCoord:[114.35, 36.1]},
                {name:'开封', geoCoord:[114.35, 34.79]},
                {name:'济南', geoCoord:[117, 36.65]},
                {name:'德阳', geoCoord:[104.37, 31.13]},
                {name:'温州', geoCoord:[120.65, 28.01]},
                {name:'九江', geoCoord:[115.97, 29.71]},
                {name:'邯郸', geoCoord:[114.47, 36.6]},
                {name:'临安', geoCoord:[119.72, 30.23]},
                {name:'兰州', geoCoord:[103.73, 36.03]},
                {name:'沧州', geoCoord:[116.83, 38.33]},
                {name:'临沂', geoCoord:[118.35, 35.05]},
                {name:'南充', geoCoord:[106.110698, 30.837793]},
                {name:'天津', geoCoord:[117.2, 39.13]},
                {name:'富阳', geoCoord:[119.95, 30.07]},
                {name:'泰安', geoCoord:[117.13, 36.18]},
                {name:'诸暨', geoCoord:[120.23, 29.71]},
                {name:'郑州', geoCoord:[113.65, 34.76]},
                {name:'哈尔滨', geoCoord:[126.63, 45.75]},
                {name:'聊城', geoCoord:[115.97, 36.45]},
                {name:'芜湖', geoCoord:[118.38, 31.33]},
                {name:'唐山', geoCoord:[118.02, 39.63]},
                {name:'平顶山', geoCoord:[113.29, 33.75]},
                {name:'邢台', geoCoord:[114.48, 37.05]},
                {name:'德州', geoCoord:[116.29, 37.45]},
                {name:'济宁', geoCoord:[116.59, 35.38]},
                {name:'桂阳', geoCoord:[112.72, 25.73]},
                {name:'荆州', geoCoord:[112.239741, 30.335165]},
                {name:'宜昌', geoCoord:[111.3, 30.7]},
                {name:'义乌', geoCoord:[120.06, 29.32]},
                {name:'丽水', geoCoord:[119.92, 28.45]},
                {name:'洛阳', geoCoord:[112.44, 34.7]},
                {name:'秦皇岛', geoCoord:[119.57, 39.95]},
                {name:'浏阳', geoCoord:[113.63,28.16]},
                {name:'株洲', geoCoord:[113.16, 27.83]},
                {name:'石家庄', geoCoord:[114.48, 38.03]},
                {name:'莱芜', geoCoord:[117.67, 36.19]},
                {name:'常德', geoCoord:[111.69, 29.05]},
                {name:'保定', geoCoord:[115.48, 38.85]},
                {name:'湘潭', geoCoord:[112.91, 27.87]},
                {name:'金华', geoCoord:[119.64, 29.12]},
                {name:'安达', geoCoord:[125.33,	46.42]},
                {name:'岳阳', geoCoord:[113.09, 29.37]},
                {name:'长沙', geoCoord:[113, 28.21]},
                {name:'衢州', geoCoord:[118.88, 28.97]},
                {name:'廊坊', geoCoord:[116.7, 39.53]},
                {name:'菏泽', geoCoord:[115.480656, 35.23375]},
                //{name:'合肥', geoCoord:[117.27, 31.86]},
                {name:'武汉', geoCoord:[114.31, 30.52]},
                {name:'大庆', geoCoord:[125.03, 46.58]}
            ]
        },
        tabWebPie: function(json){
            var option = {
                name:'网站总量',
                data:[
                ]
            }

            var total = json['items']['count'];
            var value = json['items']['value'];
            var count = 0;
            var i = 0;
            $.each(value, function(point, item){
                if(i < 5){
                    i++;
                    count += item;
                    option.data.push({value:item, name:point});
                }
            });
            option.data.push({value:total - count, name:"其他"});

            return option;

        } ,
        tabInfoPie : function(json){
            var option = {
                name:'指纹分布',
                data:[

                ]
            }
            if(json.code){
                $.each(json.items, function(point, item){
                    if(item.name == "未知"){
                        option.data.push({value:item.value, name:"其他"});
                    }else{
                        option.data.push({value:item.value, name:item.name});
                    }
                });
            }else{
                option.date.push({value:535, name:'apache'});
                option.date.push({value:310, name:'IIS'});
                option.date.push({value:410, name:'Nginx'});
                option.date.push({value:410, name:'tomcat'});
                option.date.push({value:234, name:'其他'});
            }
            return option;
        },
        tabHolePie: function(json){
            var option={
                name:'首页大文件分布',
                data:[

                ]
            }
            var value = json.items;
            $.each(value, function(point, item){
                option.data.push({"value":item['value'], "name": item['name']});
            });
            return option;

        },
        tabWebBar: function(json){

            var option = {
                legend:['网站总量'],
                //dataX: ['香港','北京','广东','浙江','台湾','上海','河南'],
                dataX:[],
                series0:{
                    name:'网站总量',
                    //data:[ 9669,9268,4738, 3124,1838,1464,1176,757]
                    data:[]
                },
                series1: {
                    name:'',
                    //data:[ 9669,9268,4738, 3124,1838,1464,1176,757]
                    data:[]
                },
                series2: {
                    name:'',
                    data:[ ]
                }
            }
            var value = json['items']['value'];
            var i = 0;
            $.each(value, function(point, item){
                if(i < 8){
                    i++;
                    option.dataX.push(point);
                    option.series0.data.push(item);
                    //option.series2.data.push(item);
                }
            });
            return option;
        },
        tabInfoBar: function(json){
            var option={
                legend:['Apache', 'IIS','Ngnix'],
                dataX: ["北京","香港","浙江","江苏","广东","上海"],
                series0:{
                    name:'Apache',
                    data:[]

                },
                series1: {
                    name:'IIS',
                    data:[ ]
                },
                series2: {
                    name:'Ngnix',
                    data:[ ]
                }
            }
            var value = json.items;
            $.each(option.dataX, function(point, item){
                option.series0.data.push(value[item]['apache']);
                option.series1.data.push(value[item]['microsoft-iis']);
                option.series2.data.push(value[item]['nginx']);
            });
            return option;
        },
        tabHoleBar: function(json){
            var option = {
                legend:['网站大文件'],
                dataX: [],
                series0:{
                    name:'网站大文件',
                    data:[]

                },
                series1: {
                    name:'网站首页',
                    data:[ ]
                    //data:[ ]
                },
                series2: {
                    name:'',
                    data:[ ]
                    //data:[ ]
                }
            }
            var value = json.items;
            var i = 0;
            $.each(value, function(point, item){
                if(i < 10){
                    option.dataX.push(item['province']);
                    option.series0.data.push(item['c']);
                }
                i++;
            });
            return option;
        }
    };

    $(function(){
        Site.init();
    });


