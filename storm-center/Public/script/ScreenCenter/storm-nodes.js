/**
 * Created by songjc on 2015/3/30.
 */

    var danger = 0;
    var count = 0;
    var webscan = 0;
    //var total
    var myBar;
    $(document).ready(function(){
        //页面元素大小以及位置初始化
        _init_.view();
        // 初始化雷达图
        _init_.scan();
        // 画图
        _init_.draw.init();

        //_init_.drawPie();
        _init_scroll.updateDanger();
        _init_scroll.updateCount();
        _init_scroll.updateUrlscan();


        // 实时更新统计图(时间为30分钟一次)

    });



    var _init_ = {

        // 初始化页面div的高度样式
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $("#bar").css("height", height * 0.4 + "px");
            $("#main").css("height", height * 0.95 + "px");
            $("#pie").css("height","" + height * 0.3 + "px");//.css("width", "" + weight * 0.2 + "px");
        },

        // 初始化雷达扫描
        scan : function(){
            // 绘制图
            Raphael("holder", 320, 240, function () {
                var r = this,
                    center_x = this.width / 2,
                    center_y = this.height / 2,
                    p = r.circle(center_x, center_y, 90).attr({stroke: "none", stroke:"white",opacity: .3, "stroke-width": 4});
                over = r.path().attr({stroke: "#fff"}),
                    len = p.getTotalLength(),
                    e = r.ellipse(0, 0, 0, 0).attr({stroke: "none", fill: "#fff"}).onAnimation(function () {
                        var t = this.attr("transform");
                        over.attr({path: "M160,120L" + t[0][1] + "," + t[0][2] + "z"}).attr({stroke: "rgb(255,255,255)", opacity: .5, "stroke-width": 1});
                    });
                r.customAttributes.along = function (v) {
                    var point = p.getPointAtLength(v * len);
                    return {
                        transform: "t" + [point.x, point.y] + "r" + point.alpha
                    };
                };
                e.attr({along: 0});

                var top = "M" + center_x + "," + center_y + " L" + center_x + "," + (center_y + 90) + "z";
                var buttom = "M" + center_x + "," + center_y + " L" + center_x + "," + (center_y - 90) + "z";
                var left = "M" + center_x + "," + center_y + " L" + (center_x + 90) + "," + center_y + "z";
                var right = "M" + center_x + "," + center_y + " L" + (center_x - 90) + "," + center_y + "z"
                r.path(top).attr({stroke:"white",opacity: .3, "stroke-width": 1});
                r.path(buttom).attr({stroke:"white",opacity: .3, "stroke-width": 1});

                r.path(left).attr({stroke:"white",opacity: .3, "stroke-width": 1});
                r.path(right).attr({stroke:"white",opacity: .3, "stroke-width": 1});

                // 雷达中的2个内圆
                r.circle(center_x, center_y, 60).attr({stroke:"white",opacity: .3, "stroke-width": 1});
                r.circle(center_x, center_y, 30).attr({stroke:"white",opacity: .3, "stroke-width": 1});
                var rotateAlongThePath = true;

                function run() {
                    e.animate({along: 1}, 2e4, function () {
                        e.attr({along: 0});
                        setTimeout(run);
                    });
                }
                run();
            });
        },

        // 初始化图片
        draw : {
            init : function(){
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
                        var myChart = ec.init(document.getElementById('main'));
                        var myPie = ec.init(document.getElementById("pie"));
                        myBar = ec.init(document.getElementById("bar"));

                        myPie.showLoading();
                        myBar.showLoading();

                        myChart.setOption(_init_data.mapOption());

                        $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getProvinceWebStatusData', null).success(function(json){
                            var option = _init_data.barOption(json);
                            myBar.setOption(option);
                            myBar.hideLoading();
                        });

                        $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getWebSafeLevelData', null).success(function(json){
                            var option = _init_data.pieOption(json);
                            myPie.setOption(option);
                            myPie.hideLoading();
                        });

                    });
            }
        }
    };

    var _init_data = {
        mapOption : function(){
            var option = {
                //backgroundColor: '#000000',
                //color: ['gold','aqua','lime'],
                title: {
                    text: '',
                    subtext: '',
                    x: 'center',
                    //padding: '20px',
                    textStyle: {
                        color: '#fff'
                    }
                },

                legend: {
                    orient: 'vertical',
                    x:'left',
                    data:[''],
                    selectedMode: 'single'
                },
                toolbox: {
                    show: false
                },
                dataRange: {
                    show : false,
                    min : 0,
                    max : 100,
                    calculable : false,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    textStyle:{
                        color:'#fff'
                    }
                },
                series: [
                    {
                        name: '全国',
                        type: 'map',
                        roam: false,
                        hoverable: false,
                        mapType: 'china',
                        itemStyle: {
                            normal: {
                                borderColor: 'rgba(100,149,237,1)',
                                borderWidth: 0.5,
                                areaStyle: {
                                    color: '#000'
                                }
                            }
                        },
                        data: [],
                        geoCoord: __GEO__.provincial_capital
                    },
                    {
                        name: '全国',
                        type: 'map',
                        mapType: 'china',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: [
                                [{name: '北京'}, {name: '杭州'}],
                                [{name: '上海'}, {name: '杭州'}],
                                [{name: '天津'}, {name: '杭州'}],
                                [{name: '广州'}, {name: '杭州'}],
                                [{name: '重庆'}, {name: '杭州'}],
                                [{name: '南宁'}, {name: '杭州'}],
                                [{name: '石家庄'}, {name: '杭州'}],
                                [{name: '郑州'}, {name: '杭州'}],
                                [{name: '福州'}, {name: '杭州'}],
                                [{name: '海口'}, {name: '杭州'}],
                                [{name: '南昌'}, {name: '杭州'}],
                                [{name: '长沙'}, {name: '杭州'}],
                                [{name: '贵阳'}, {name: '杭州'}],
                                [{name: '昆明'}, {name: '杭州'}],
                                [{name: '武汉'}, {name: '杭州'}],
                                [{name: '合肥'}, {name: '杭州'}],
                                [{name: '济南'}, {name: '杭州'}],
                                [{name: '太原'}, {name: '杭州'}],
                                [{name: '呼和浩特'}, {name: '杭州'}],
                                [{name: '南京'}, {name: '杭州'}],
                                [{name: '成都'}, {name: '杭州'}],
                                [{name: '西安'}, {name: '杭州'}],
                                [{name: '沈阳'}, {name: '杭州'}],
                                [{name: '银川'}, {name: '杭州'}],
                                [{name: '兰州'}, {name: '杭州'}],
                                [{name: '西宁'}, {name: '杭州'}],
                                [{name: '拉萨'}, {name: '杭州'}],
                                [{name: '长春'}, {name: '杭州'}],
                                [{name: '乌鲁木齐'}, {name: '杭州'}],
                                [{name: '哈尔滨'}, {name: '杭州'}]
                            ]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function (v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0,
                                scaleSize: 1
                            },
                            itemStyle: {
                                normal: {
                                    label: {show: false}
                                }
                            },
                            data: [
                                {name: '北京', value: 40},
                                {name: '上海', value: 40},
                                {name: '天津', value: 40},
                                {name: '重庆', value: 40},
                                {name: '郑州', value: 40},
                                {name: '哈尔滨', value: 40},
                                {name: '长春', value: 40},
                                {name: '长沙', value: 40},
                                {name: '沈阳', value: 40},
                                {name: '合肥', value: 40},
                                {name: '呼和浩特', value: 40},
                                {name: '石家庄', value: 40},
                                {name: '福州', value: 40},
                                {name: '乌鲁木齐', value: 99},
                                {name: '兰州', value: 70},
                                {name: '西宁', value: 65},
                                {name: '西安', value: 40},
                                {name: '贵阳', value: 40},
                                {name: '银川', value: 80},
                                {name: '济南', value: 40},
                                {name: '太原', value: 40},
                                {name: '武汉', value: 40},
                                {name: '南京', value: 40},
                                {name: '南宁', value: 40},
                                {name: '南昌', value: 40},
                                {name: '成都', value: 40},
                                {name: '昆明', value: 40},
                                {name: '拉萨', value: 90},
                                {name: '杭州', value: 40},
                                {name: '广州', value: 40},
                                {name: '海口', value: 40}
                            ]
                        }
                    }
                ]
            };
            return option;
        },
        pieOption : function(jsonData){
            var option = {
                //color:["#1C86EE"],
                color:["#00f2ff"],
                title : {
                    text: '网页安全等级统计',
                    subtext: '',
                    //x:'120',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bolder',
                        color: 'white',
                        align: 'center'
                    }
                },
                dataRange: {
                    show : false,
                    min: 0,
                    max: 56,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true
                },
                tooltip : {
                    show: false
                },
                legend: {
                    data:['']
                },
                toolbox: {
                    show : false
                },
                calculable : false,
                grid:{
                    borderWidth : 0
                },
                xAxis : [
                    {
                        type : 'value',
                        axisTick : {    // 轴标记
                            show:false
                        },
                        position: 'bottom',
                        axisLine : {    // 轴线
                            show: false
                        },
                        axisLabel:{
                            show:false,
                            formatter: function (v){
                                return -v;
                            }
                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            show: false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : [],
                        position : 'right',
                        axisTick : {    // 轴标记
                            show:false
                        },
                        axisLine : {    // 轴线
                            show: false
                        },
                        axisLabel : {
                            show:true,
                            textStyle:{
                                color: 'white',
                                fontSize: 14

                            }
                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:'分析',
                        type:'bar',
                        barMaxWidth: 30,
                        data:[],
                        itemStyle: {
                            normal: {
                                color:'gray',
                                label : {
                                    show: true,
                                    position: 'left',
                                    textStyle: {
                                        color: 'tomato'
                                    },
                                    formatter: function (params) {
                                        return (-params.value);
                                    }
                                }
                            }
                        }
                    }
                ]
            };
            var yAxis = [];
            $.each(jsonData.yAxis, function(point, item){
                if(item != "安全"){
                    yAxis.push(item);
                    option.yAxis[0].data.push(item);
                }

            });

            $.each(jsonData.values, function(point, item){
                if(item < 0){
                    option.series[0].data.push(item);
                }
            });
            return option;
        },
        barOption : function(jsonData){
            var option = {
                //color:["#1C86EE"],
                color:["#00f2ff"],
                title : {
                    text: '省网站数排行',
                    subtext: '',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bolder',
                        color: 'white',
                        align: 'center'
                    }
                },
                dataRange: {
                    show : false,
                    min: 0,
                    max: 100,
                    color: ['#ff3333', 'orange', 'yellow','lime','aqua'],
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true
                },
                tooltip : {
                    show: false
                },
                legend: {
                    data:['']
                },
                toolbox: {
                    show : false
                },
                calculable : false,
                grid:{
                    borderWidth : 0
                },
                xAxis : [
                    {
                        type : 'value',
                        axisTick : {    // 轴标记
                            show:false
                        },
                        axisLine : {    // 轴线
                            show: false
                        },
                        axisLabel : {
                            show:false

                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            show: false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : [],
                        axisTick : {    // 轴标记
                            show:false
                        },
                        axisLine : {    // 轴线
                            show: false
                        },
                        axisLabel : {
                            show:true,
                            textStyle:{
                                color: 'white',
                                fontSize: 14

                            }
                        },
                        splitLine : {
                            show:false
                        },
                        splitArea : {
                            show: false
                        }
                    }
                ],
                series : [
                    {
                        name:'分析',
                        type:'bar',
                        data:[],
                        itemStyle: {
                            normal: {
                                color:'gray',
                                label : {
                                    show: true,
                                    position: 'right',
                                    textStyle: {
                                        color: 'tomato'
                                    }
                                }
                            }
                        }
                    }
                ]
            };
            var yAxis = [];
            $.each(jsonData.yAxis, function(point, item){
                yAxis.push(item);
                option.yAxis[0].data.push(item);
            });

            $.each(jsonData.values, function(point, item){
                option.series[0].data.push(item);
            });
            return option;
        }
    };

    var _init_showNum = {

        webscan_num : function(n) {
            var it = $(".t_num1 i");
            var len = String(n).length;
            for (var i = 0; i < len; i++) {
                if (it.length <= i) {
                    $(".t_num1").append("<i></i>");
                }
                var num = String(n).charAt(i);
                var y = -parseInt(num) * 30; //y轴位置
                var obj = $(".t_num1 i").eq(i);
                obj.animate({ //滚动动画
                        backgroundPosition: '(0 ' + String(y) + 'px)'
                    }, 'slow', 'swing', function () {
                    }
                );
            }
        },

        container_num : function(n){
            var it = $(".t_num2 i");
            var len = String(n).length;
            for(var i=0;i<len;i++){
                if(it.length<=i){
                    $(".t_num2").append("<i></i>");
                }
                var num=String(n).charAt(i);
                var y = -parseInt(num)*30; //y轴位置
                var obj = $(".t_num2 i").eq(i);
                obj.animate({ //滚动动画
                        backgroundPosition :'(0 '+String(y)+'px)'
                    }, 'slow','swing',function(){}
                );
            }
        },

        danger_num : function(n){
            var it = $(".t_num3 i");
            var len = String(n).length;
            for(var i=0;i<len;i++){
                if(it.length<=i){
                    $(".t_num3").append("<i></i>");
                }
                var num=String(n).charAt(i);
                var y = -parseInt(num)*30; //y轴位置
                var obj = $(".t_num3 i").eq(i);
                obj.animate({ //滚动动画
                        backgroundPosition :'(0 '+String(y)+'px)'
                    }, 'slow','swing',function(){}
                );
            }
        }
    }


    var _init_scroll = {
        updateDanger : function(){
            $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getStatusCount', null).success(function(json){
                if(danger == 0){
                    danger = json.danger - 300000;
                    _init_showNum.danger_num(json.danger - 300000);
                }

                var dangerInterval = setInterval(function(){
                    danger = danger + (parseInt(10 * Math.random()) % 6);
                    if(danger >= json.danger){
                        if(danger == json.danger){
                            _init_showNum.danger_num(danger);
                        }
                        clearInterval(dangerInterval);
                        _init_scroll.updateDanger();
                    }else{
                        _init_showNum.danger_num(danger);
                    }
                }, 4000);
            });
        },

        updateCount : function(){
            $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getStatusCount', null).success(function(json){
                if(count == 0){
                    _init_showNum.container_num(json.count);
                }else {
                    var addCount = json.count - count;
                    if (addCount > 0) {
                        var countInterval = setInterval(function () {
                            if (addCount < 60) {
                                count = count + 1;
                                if (count == json.count) {
                                    clearInterval(countInterval);
                                } else {
                                    _init_showNum.container_num(count);
                                }
                            } else {
                                count = count + (addCount / 60) + 1;
                                if (count >= json.count) {
                                    if (count == json.count) {
                                        _init_showNum.container_num(count);
                                    }
                                    clearInterval(countInterval);
                                } else {
                                    _init_showNum.container_num(count);
                                }
                            }
                        }, 20000);
                    }
                }
            });
        },
        updateUrlscan : function(){
            $.getJSON(__ROOT__+'/ScreenCenter/BrainNodes/getStatusCount', null).success(function(json){
                if(webscan == 0){
                    webscan = json.data - 360000;
                    _init_showNum.webscan_num(json.data - 360000);
                }

                var updateUrlscan = setInterval(function(){
                    webscan = webscan + (parseInt(10 * Math.random()) % 8);
                    if(webscan >= json.data){
                        if(webscan == json.data){
                            _init_showNum.webscan_num(webscan);
                        }
                        clearInterval(updateUrlscan);
                        _init_scroll.updateUrlscan();
                    }else{
                        _init_showNum.webscan_num(webscan);
                    }
                }, 2000);
            });
        }
    };

