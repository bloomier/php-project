/**
 * Created by Administrator on 2015/3/30.
 */
$(function(){

    $(document).ready(function(){

        _init_.view();

        _init_.draw();

    });

    var _init_ = {

        view : function(){
            var height = $(window).height();
            var width = window.screen.width;
            //$("#main").css("height", height * 0.8 + "px");
            $("#main").height(height * 0.8);
            $("#pie").css("height", height * 0.45 + "px");
            $("#bar").height(height* 0.35 );
            //$("#bar").css("height", height * 0.4 + "px").css("padding-top", height * 0.1 + "px");
            $('#chartBar').width(width*0.95);
            $('#chartBar').height(height* 0.4 );


            //$("#fgList").css("height", height * 0.3 + "px");
        },

        draw : function(){
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
                    var ecConfig = require('echarts/config');
                    var myChart = ec.init(document.getElementById('main'));
                    var myBar = ec.init(document.getElementById("bar"));
                    var myPie = ec.init(document.getElementById("pie"));
                    var chartBar = ec.init(document.getElementById('chartBar'));


                    var option = _init_data.mapOption();
                    myChart.setOption(option);
                    var barOptoin = _init_data.barOption();
                    myBar.setOption(barOptoin);
                    var pieOption = _init_data.pieOption();
                    myPie.setOption(pieOption);

                    var barData = [
                        {name: '香港',value: 9669},
                        {name: '北京',value: 9268},
                        {name: '广东',value: 4378},
                        {name: '浙江',value: 3124},
                        {name: '台湾',value: 1838},
                        {name: '上海',value: 1464},
                        {name: '河南',value: 1176},
                        {name: '福建',value: 1166},
                        {name: '江苏',value: 757},
                        {name: '四川',value: 615},
                        {name: '山东',value: 332},
                        {name: '安徽',value: 316},
                        {name: '辽宁',value: 251},
                        {name: '湖南',value: 232},
                        {name: '天津',value: 217},
                        {name: '河北',value: 216},
                        {name: '湖北',value: 180},
                        {name: '江西',value: 178},
                        {name: '陕西',value: 134},
                        {name: '新疆',value: 120},
                        {name: '云南',value: 119},
                        {name: '广西',value: 116},
                        {name: '黑龙江',value: 110},
                        {name: '重庆',value: 80},
                        {name: '吉林',value: 64},
                        {name: '山西',value: 57},
                        {name: '贵州',value: 52},
                        {name: '甘肃',value: 48},
                        {name: '海南',value: 36},
                        {name: '宁夏',value: 33},
                        {name: '内蒙古',value: 22},
                        {name: '青海',value: 11},
                        {name: '西藏',value: 8},
                        {name: '澳门',value: 8}
                    ];
                    var barDataX=[], barDataY=[];
                    for(var i=0; i< barData.length; i++){
                        barDataX.push(barData[i].value);
                        barDataY.push(barData[i].name);
                    }
                    var chartBarOption = {
                        grid: {
//                        borderColor: ''
                            borderWidth: 0
                        },
                        calculable : false,
                        yAxis : [
                            {
                                type : 'value',
                                axisLabel: { //坐标轴文本
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

                        xAxis  : [
                            {
                                type : 'category',
                                //data: barDataY,
                                axisLabel : {
                                    show:true,
                                    textStyle:{
                                        color: 'white',
                                        fontSize: 12

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
                                data : ['香港','北京','广东','浙江','台湾','上海','河南',
                                    '福建','江苏', '四川','山东','安徽','辽宁','湖南','天津',
                                    '河北','江西','陕西','新疆', '云南','广西', '黑龙江','重庆',
                                    '吉林','山西','贵州','甘肃','海南','宁夏','内蒙古','青海',
                                    '西藏','澳门'
                                ]
                            }
                        ],

                        series : [
                            {
                                "name":"总量",
                                "type":"bar",
                                stack: 'name',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#aa2200', '#aaaa00', '#33aa00', '#00dd00', '#00aa77', '#00c6dd',
                                                '#0044aa', '#7700aa', '#aa0033', '#ff0033', '#cc00ff', '#4c00ff',
                                                '#0016dd', '#00b2ff', '#00ffb2', '#00ff33', '#84ff77', '#e3ff77',
                                                '#eaffbb', '#bbffbb', '#bbfff1', '#77c8ff', '#007717', '#b0dd00',
                                                '#ff9900', '#dd5800', '#f8bbff', '#7792ff', '#bbdcff', '#dd0084',
                                                '#ff0033', '#cc00ff', '#4c00ff','#bbfff1'
                                            ];
                                            return colorList[params.dataIndex]
                                        },
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
                                data: [ 9669,9268,4738, 3124,1838,1464,1176,757,615,332,316,
                                    251,232, 217,216,180,178,173,134,120,119,116,110, 80,64,57,
                                    52, 48, 36,33,22,11,8,8
                                ]


                            },
                            {
                                name: '受影响',
                                type: 'bar',
                                stack: 'name',
                                itemStyle: {
                                    normal: {
                                        color: function(params) {
                                            // build a color map as your need.
                                            var colorList = [
                                                '#ff9900', '#dd5800', '#f8bbff', '#7792ff', '#bbdcff', '#dd0084',
                                                '#ff0033', '#cc00ff', '#4c00ff','#bbfff1',
                                                '#aa2200', '#aaaa00', '#33aa00', '#00dd00', '#00aa77', '#00c6dd',
                                                '#0044aa', '#7700aa', '#aa0033', '#ff0033', '#cc00ff', '#4c00ff',
                                                '#0016dd', '#00b2ff', '#00ffb2', '#00ff33', '#84ff77', '#e3ff77',
                                                '#eaffbb', '#bbffbb', '#bbfff1', '#77c8ff', '#007717', '#b0dd00'

                                            ];
                                            return colorList[params.dataIndex]
                                        },
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
                                data: [2018, 2476,3240,1052,526,292,254,70,181,150,95,52,59,29,63,
                                    93,35, 9,20,15, 8, 23,23,32,11,14,8,14,22,6,2,6,7,2
                                ]
                            }

                        ]
                    };
                    chartBar.setOption(chartBarOption);

                    myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
                        var type =option.series[0].mapType;

                        if (type == 'china') {
                            // 全国选择时指定到选中的省份
                            option.series[0].mapType = param.target;
                            option.tooltip.formatter = '点击返回全国';
                        }
                        else {
                            option.series[0].mapType= 'china';
                            option.tooltip.formatter = '点击进入{b}';
                        }

                        myChart.setOption(option, true);

                    });


                });
        }
    };

    var _init_data = {
        mapOption : function(){
            var option = {
                title: {
                    text : '',
                    subtext : ''
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '点击进入{b}'
                },
                zlevel: 2,

                dataRange: {
                    show : false,
                    min: 0,
                    max: 1000,

                    //color : ['#f90303', '#f95403', '#f97103', '#f98e03', '#f9df03'],
                    color : ['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00'],
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true
                },
                series : [
                    {
                        zlevel: 6,
                        roam: false,
                        name: '总量',
                        type: 'map',
                        mapType: 'china',
                        hoverable: false,
                        selectedMode : 'single',
                        itemStyle:{
                            normal:{
                                label:{show:true},
                                //borderColor:'rgba(100,149,237,1)',
                                borderColor:'white',
                                borderWidth:0.5
                            },
                            emphasis:{label:{show:true}}
                        },
                         data:p_data

                    }

                ]
            };
            //option.series[0].data.push(p_data);

            return option;
        },
        pieOption : function(){
            var option = {
                title : {
                    text: 'OpenSSL版本',
                    subtext: '',
                    x:'center',
                    textStyle:{
                        fontSize: 18,
                        fontWeight: 'bolder',
                        color: 'white'
                    }
                },
                tooltip : {
                    show:false,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name:'OpenSSL版本',
                        type:'pie',
                        stack:'总量',
                        radius : '50%',
                        /*itemStyle : {
                            normal: {
                                label : {show: true, position: 'top'}
                               *//* color: function(params) {
                                    // build a color map as your need.
                                    var colorList = [
                                        '#dd00c6', '#ff779f', '#ffc877','#00dd84','#00ffff','#dd2c00','#dd00c6'

                                    ];
                                    return colorList[params.dataIndex]
                                }*//*
                            }
                        },*/
                        data:[


                            {name:'1.0.2', value:144},
                            {name:'0.9.7', value:3221},
                            //{name:'0.9.5', value:6},
                            {name:'1.0.1', value:23399},
                            {name:'0.9.6', value:234},
                            {name:'0.9.8', value:43672},
                            {name:'1.0.0', value:4804}
/*

                            ,*/

                        ]
                    }
                ]
            };
            return option;
        },
        barOption : function(){
            var option = {
                color:["orange"],
                title : {
                    text: '省份排行top5',
                    subtext: '',
                    textStyle:{
                        color: 'white'
                    }
                },
                dataRange: {
                    show : false,
                    min: 0,
                    max: 100,
                    color: ['orange'],
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true
                },
                tooltip : {
                    show: true,
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    show: false,
                    data:[],
                    textStyle : {
                        color: 'white'
                    }
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
                        data : ['台湾','浙江','香港','北京','广东'],
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
                        name:'省份排行top5',
                        type:'bar',
                        stack:'总量',
                        itemStyle : { normal: {label : {show: true, position: 'right', color:"white"}}},
                        data:[ 526,1052,2018,2476, 3240]
                    }
                ]
            };
            return option;
        }
    };
    var p_data= [
        {name: '香港',value: 2018},
        {name: '北京',value: 2476},
        {name: '广东',value: 3240},
        {name: '浙江',value: 1052},
        {name: '台湾',value: 526},
        {name: '上海',value: 292},
        {name: '河南',value: 254},
        {name: '福建',value: 70},
        {name: '江苏',value: 181},
        {name: '四川',value: 150},
        {name: '山东',value: 95},
        {name: '安徽',value: 52},
        {name: '辽宁',value: 59},
        {name: '湖南',value: 29},
        {name: '天津',value: 63},
        {name: '河北',value: 93},
        {name: '湖北',value: 35},
        {name: '江西',value: 9},
        {name: '陕西',value: 15},
        {name: '新疆',value: 8},
        {name: '云南',value: 23},
        {name: '广西',value: 23},
        {name: '黑龙江',value: 32},
        {name: '重庆',value: 11},
        {name:'吉林',value: 14},
        {name: '山西',value: 9},
        {name: '贵州',value: 14},
        {name: '甘肃',value: 22},
        {name: '海南',value: 6},
        {name: '宁夏',value: 2},
        {name: '内蒙古',value: 6},
        {name: '青海',value: 7},
        {name: '西藏',value: 2},
        {name: '澳门',value: 1},
        {name: '重庆市',value: Math.round(Math.random()*1000)},
        {name: '北京市',value: Math.round(Math.random()*1000)},
        {name: '天津市',value: Math.round(Math.random()*1000)},
        {name: '上海市',value: Math.round(Math.random()*1000)},
        {name: '香港',value: Math.round(Math.random()*1000)},
        {name: '澳门',value: Math.round(Math.random()*1000)},
        {name: '巴音郭楞蒙古自治州',value: Math.round(Math.random()*1000)},
        {name: '和田地区',value: Math.round(Math.random()*1000)},
        {name: '哈密地区',value: Math.round(Math.random()*1000)},
        {name: '阿克苏地区',value: Math.round(Math.random()*1000)},
        {name: '阿勒泰地区',value: Math.round(Math.random()*1000)},
        {name: '喀什地区',value: Math.round(Math.random()*1000)},
        {name: '塔城地区',value: Math.round(Math.random()*1000)},
        {name: '昌吉回族自治州',value: Math.round(Math.random()*1000)},
        {name: '克孜勒苏柯尔克孜自治州',value: Math.round(Math.random()*1000)},
        {name: '吐鲁番地区',value: Math.round(Math.random()*1000)},
        {name: '伊犁哈萨克自治州',value: Math.round(Math.random()*1000)},
        {name: '博尔塔拉蒙古自治州',value: Math.round(Math.random()*1000)},
        {name: '乌鲁木齐市',value: Math.round(Math.random()*1000)},
        {name: '克拉玛依市',value: Math.round(Math.random()*1000)},
        {name: '阿拉尔市',value: Math.round(Math.random()*1000)},
        {name: '图木舒克市',value: Math.round(Math.random()*1000)},
        {name: '五家渠市',value: Math.round(Math.random()*1000)},
        {name: '石河子市',value: Math.round(Math.random()*1000)},
        {name: '那曲地区',value: Math.round(Math.random()*1000)},
        {name: '阿里地区',value: Math.round(Math.random()*1000)},
        {name: '日喀则地区',value: Math.round(Math.random()*1000)},
        {name: '林芝地区',value: Math.round(Math.random()*1000)},
        {name: '昌都地区',value: Math.round(Math.random()*1000)},
        {name: '山南地区',value: Math.round(Math.random()*1000)},
        {name: '拉萨市',value: Math.round(Math.random()*1000)},
        {name: '呼伦贝尔市',value: Math.round(Math.random()*1000)},
        {name: '阿拉善盟',value: Math.round(Math.random()*1000)},
        {name: '锡林郭勒盟',value: Math.round(Math.random()*1000)},
        {name: '鄂尔多斯市',value: Math.round(Math.random()*1000)},
        {name: '赤峰市',value: Math.round(Math.random()*1000)},
        {name: '巴彦淖尔市',value: Math.round(Math.random()*1000)},
        {name: '通辽市',value: Math.round(Math.random()*1000)},
        {name: '乌兰察布市',value: Math.round(Math.random()*1000)},
        {name: '兴安盟',value: Math.round(Math.random()*1000)},
        {name: '包头市',value: Math.round(Math.random()*1000)},
        {name: '呼和浩特市',value: Math.round(Math.random()*1000)},
        {name: '乌海市',value: Math.round(Math.random()*1000)},
        {name: '海西蒙古族藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '玉树藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '果洛藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '海南藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '海北藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '黄南藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '海东地区',value: Math.round(Math.random()*1000)},
        {name: '西宁市',value: Math.round(Math.random()*1000)},
        {name: '甘孜藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '阿坝藏族羌族自治州',value: Math.round(Math.random()*1000)},
        {name: '凉山彝族自治州',value: Math.round(Math.random()*1000)},
        {name: '绵阳市',value: Math.round(Math.random()*1000)},
        {name: '达州市',value: Math.round(Math.random()*1000)},
        {name: '广元市',value: Math.round(Math.random()*1000)},
        {name: '雅安市',value: Math.round(Math.random()*1000)},
        {name: '宜宾市',value: Math.round(Math.random()*1000)},
        {name: '乐山市',value: Math.round(Math.random()*1000)},
        {name: '南充市',value: Math.round(Math.random()*1000)},
        {name: '巴中市',value: Math.round(Math.random()*1000)},
        {name: '泸州市',value: Math.round(Math.random()*1000)},
        {name: '成都市',value: Math.round(Math.random()*1000)},
        {name: '资阳市',value: Math.round(Math.random()*1000)},
        {name: '攀枝花市',value: Math.round(Math.random()*1000)},
        {name: '眉山市',value: Math.round(Math.random()*1000)},
        {name: '广安市',value: Math.round(Math.random()*1000)},
        {name: '德阳市',value: Math.round(Math.random()*1000)},
        {name: '内江市',value: Math.round(Math.random()*1000)},
        {name: '遂宁市',value: Math.round(Math.random()*1000)},
        {name: '自贡市',value: Math.round(Math.random()*1000)},
        {name: '黑河市',value: Math.round(Math.random()*1000)},
        {name: '大兴安岭地区',value: Math.round(Math.random()*1000)},
        {name: '哈尔滨市',value: Math.round(Math.random()*1000)},
        {name: '齐齐哈尔市',value: Math.round(Math.random()*1000)},
        {name: '牡丹江市',value: Math.round(Math.random()*1000)},
        {name: '绥化市',value: Math.round(Math.random()*1000)},
        {name: '伊春市',value: Math.round(Math.random()*1000)},
        {name: '佳木斯市',value: Math.round(Math.random()*1000)},
        {name: '鸡西市',value: Math.round(Math.random()*1000)},
        {name: '双鸭山市',value: Math.round(Math.random()*1000)},
        {name: '大庆市',value: Math.round(Math.random()*1000)},
        {name: '鹤岗市',value: Math.round(Math.random()*1000)},
        {name: '七台河市',value: Math.round(Math.random()*1000)},
        {name: '酒泉市',value: Math.round(Math.random()*1000)},
        {name: '张掖市',value: Math.round(Math.random()*1000)},
        {name: '甘南藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '武威市',value: Math.round(Math.random()*1000)},
        {name: '陇南市',value: Math.round(Math.random()*1000)},
        {name: '庆阳市',value: Math.round(Math.random()*1000)},
        {name: '白银市',value: Math.round(Math.random()*1000)},
        {name: '定西市',value: Math.round(Math.random()*1000)},
        {name: '天水市',value: Math.round(Math.random()*1000)},
        {name: '兰州市',value: Math.round(Math.random()*1000)},
        {name: '平凉市',value: Math.round(Math.random()*1000)},
        {name: '临夏回族自治州',value: Math.round(Math.random()*1000)},
        {name: '金昌市',value: Math.round(Math.random()*1000)},
        {name: '嘉峪关市',value: Math.round(Math.random()*1000)},
        {name: '普洱市',value: Math.round(Math.random()*1000)},
        {name: '红河哈尼族彝族自治州',value: Math.round(Math.random()*1000)},
        {name: '文山壮族苗族自治州',value: Math.round(Math.random()*1000)},
        {name: '曲靖市',value: Math.round(Math.random()*1000)},
        {name: '楚雄彝族自治州',value: Math.round(Math.random()*1000)},
        {name: '大理白族自治州',value: Math.round(Math.random()*1000)},
        {name: '临沧市',value: Math.round(Math.random()*1000)},
        {name: '迪庆藏族自治州',value: Math.round(Math.random()*1000)},
        {name: '昭通市',value: Math.round(Math.random()*1000)},
        {name: '昆明市',value: Math.round(Math.random()*1000)},
        {name: '丽江市',value: Math.round(Math.random()*1000)},
        {name: '西双版纳傣族自治州',value: Math.round(Math.random()*1000)},
        {name: '保山市',value: Math.round(Math.random()*1000)},
        {name: '玉溪市',value: Math.round(Math.random()*1000)},
        {name: '怒江傈僳族自治州',value: Math.round(Math.random()*1000)},
        {name: '德宏傣族景颇族自治州',value: Math.round(Math.random()*1000)},
        {name: '百色市',value: Math.round(Math.random()*1000)},
        {name: '河池市',value: Math.round(Math.random()*1000)},
        {name: '桂林市',value: Math.round(Math.random()*1000)},
        {name: '南宁市',value: Math.round(Math.random()*1000)},
        {name: '柳州市',value: Math.round(Math.random()*1000)},
        {name: '崇左市',value: Math.round(Math.random()*1000)},
        {name: '来宾市',value: Math.round(Math.random()*1000)},
        {name: '玉林市',value: Math.round(Math.random()*1000)},
        {name: '梧州市',value: Math.round(Math.random()*1000)},
        {name: '贺州市',value: Math.round(Math.random()*1000)},
        {name: '钦州市',value: Math.round(Math.random()*1000)},
        {name: '贵港市',value: Math.round(Math.random()*1000)},
        {name: '防城港市',value: Math.round(Math.random()*1000)},
        {name: '北海市',value: Math.round(Math.random()*1000)},
        {name: '怀化市',value: Math.round(Math.random()*1000)},
        {name: '永州市',value: Math.round(Math.random()*1000)},
        {name: '邵阳市',value: Math.round(Math.random()*1000)},
        {name: '郴州市',value: Math.round(Math.random()*1000)},
        {name: '常德市',value: Math.round(Math.random()*1000)},
        {name: '湘西土家族苗族自治州',value: Math.round(Math.random()*1000)},
        {name: '衡阳市',value: Math.round(Math.random()*1000)},
        {name: '岳阳市',value: Math.round(Math.random()*1000)},
        {name: '益阳市',value: Math.round(Math.random()*1000)},
        {name: '长沙市',value: Math.round(Math.random()*1000)},
        {name: '株洲市',value: Math.round(Math.random()*1000)},
        {name: '张家界市',value: Math.round(Math.random()*1000)},
        {name: '娄底市',value: Math.round(Math.random()*1000)},
        {name: '湘潭市',value: Math.round(Math.random()*1000)},
        {name: '榆林市',value: Math.round(Math.random()*1000)},
        {name: '延安市',value: Math.round(Math.random()*1000)},
        {name: '汉中市',value: Math.round(Math.random()*1000)},
        {name: '安康市',value: Math.round(Math.random()*1000)},
        {name: '商洛市',value: Math.round(Math.random()*1000)},
        {name: '宝鸡市',value: Math.round(Math.random()*1000)},
        {name: '渭南市',value: Math.round(Math.random()*1000)},
        {name: '咸阳市',value: Math.round(Math.random()*1000)},
        {name: '西安市',value: Math.round(Math.random()*1000)},
        {name: '铜川市',value: Math.round(Math.random()*1000)},
        {name: '清远市',value: Math.round(Math.random()*1000)},
        {name: '韶关市',value: Math.round(Math.random()*1000)},
        {name: '湛江市',value: Math.round(Math.random()*1000)},
        {name: '梅州市',value: Math.round(Math.random()*1000)},
        {name: '河源市',value: Math.round(Math.random()*1000)},
        {name: '肇庆市',value: Math.round(Math.random()*1000)},
        {name: '惠州市',value: Math.round(Math.random()*1000)},
        {name: '茂名市',value: Math.round(Math.random()*1000)},
        {name: '江门市',value: Math.round(Math.random()*1000)},
        {name: '阳江市',value: Math.round(Math.random()*1000)},
        {name: '云浮市',value: Math.round(Math.random()*1000)},
        {name: '广州市',value: Math.round(Math.random()*1000)},
        {name: '汕尾市',value: Math.round(Math.random()*1000)},
        {name: '揭阳市',value: Math.round(Math.random()*1000)},
        {name: '珠海市',value: Math.round(Math.random()*1000)},
        {name: '佛山市',value: Math.round(Math.random()*1000)},
        {name: '潮州市',value: Math.round(Math.random()*1000)},
        {name: '汕头市',value: Math.round(Math.random()*1000)},
        {name: '深圳市',value: Math.round(Math.random()*1000)},
        {name: '东莞市',value: Math.round(Math.random()*1000)},
        {name: '中山市',value: Math.round(Math.random()*1000)},
        {name: '延边朝鲜族自治州',value: Math.round(Math.random()*1000)},
        {name: '吉林市',value: Math.round(Math.random()*1000)},
        {name: '白城市',value: Math.round(Math.random()*1000)},
        {name: '松原市',value: Math.round(Math.random()*1000)},
        {name: '长春市',value: Math.round(Math.random()*1000)},
        {name: '白山市',value: Math.round(Math.random()*1000)},
        {name: '通化市',value: Math.round(Math.random()*1000)},
        {name: '四平市',value: Math.round(Math.random()*1000)},
        {name: '辽源市',value: Math.round(Math.random()*1000)},
        {name: '承德市',value: Math.round(Math.random()*1000)},
        {name: '张家口市',value: Math.round(Math.random()*1000)},
        {name: '保定市',value: Math.round(Math.random()*1000)},
        {name: '唐山市',value: Math.round(Math.random()*1000)},
        {name: '沧州市',value: Math.round(Math.random()*1000)},
        {name: '石家庄市',value: Math.round(Math.random()*1000)},
        {name: '邢台市',value: Math.round(Math.random()*1000)},
        {name: '邯郸市',value: Math.round(Math.random()*1000)},
        {name: '秦皇岛市',value: Math.round(Math.random()*1000)},
        {name: '衡水市',value: Math.round(Math.random()*1000)},
        {name: '廊坊市',value: Math.round(Math.random()*1000)},
        {name: '恩施土家族苗族自治州',value: Math.round(Math.random()*1000)},
        {name: '十堰市',value: Math.round(Math.random()*1000)},
        {name: '宜昌市',value: Math.round(Math.random()*1000)},
        {name: '襄樊市',value: Math.round(Math.random()*1000)},
        {name: '黄冈市',value: Math.round(Math.random()*1000)},
        {name: '荆州市',value: Math.round(Math.random()*1000)},
        {name: '荆门市',value: Math.round(Math.random()*1000)},
        {name: '咸宁市',value: Math.round(Math.random()*1000)},
        {name: '随州市',value: Math.round(Math.random()*1000)},
        {name: '孝感市',value: Math.round(Math.random()*1000)},
        {name: '武汉市',value: Math.round(Math.random()*1000)},
        {name: '黄石市',value: Math.round(Math.random()*1000)},
        {name: '神农架林区',value: Math.round(Math.random()*1000)},
        {name: '天门市',value: Math.round(Math.random()*1000)},
        {name: '仙桃市',value: Math.round(Math.random()*1000)},
        {name: '潜江市',value: Math.round(Math.random()*1000)},
        {name: '鄂州市',value: Math.round(Math.random()*1000)},
        {name: '遵义市',value: Math.round(Math.random()*1000)},
        {name: '黔东南苗族侗族自治州',value: Math.round(Math.random()*1000)},
        {name: '毕节地区',value: Math.round(Math.random()*1000)},
        {name: '黔南布依族苗族自治州',value: Math.round(Math.random()*1000)},
        {name: '铜仁地区',value: Math.round(Math.random()*1000)},
        {name: '黔西南布依族苗族自治州',value: Math.round(Math.random()*1000)},
        {name: '六盘水市',value: Math.round(Math.random()*1000)},
        {name: '安顺市',value: Math.round(Math.random()*1000)},
        {name: '贵阳市',value: Math.round(Math.random()*1000)},
        {name: '烟台市',value: Math.round(Math.random()*1000)},
        {name: '临沂市',value: Math.round(Math.random()*1000)},
        {name: '潍坊市',value: Math.round(Math.random()*1000)},
        {name: '青岛市',value: Math.round(Math.random()*1000)},
        {name: '菏泽市',value: Math.round(Math.random()*1000)},
        {name: '济宁市',value: Math.round(Math.random()*1000)},
        {name: '德州市',value: Math.round(Math.random()*1000)},
        {name: '滨州市',value: Math.round(Math.random()*1000)},
        {name: '聊城市',value: Math.round(Math.random()*1000)},
        {name: '东营市',value: Math.round(Math.random()*1000)},
        {name: '济南市',value: Math.round(Math.random()*1000)},
        {name: '泰安市',value: Math.round(Math.random()*1000)},
        {name: '威海市',value: Math.round(Math.random()*1000)},
        {name: '日照市',value: Math.round(Math.random()*1000)},
        {name: '淄博市',value: Math.round(Math.random()*1000)},
        {name: '枣庄市',value: Math.round(Math.random()*1000)},
        {name: '莱芜市',value: Math.round(Math.random()*1000)},
        {name: '赣州市',value: Math.round(Math.random()*1000)},
        {name: '吉安市',value: Math.round(Math.random()*1000)},
        {name: '上饶市',value: Math.round(Math.random()*1000)},
        {name: '九江市',value: Math.round(Math.random()*1000)},
        {name: '抚州市',value: Math.round(Math.random()*1000)},
        {name: '宜春市',value: Math.round(Math.random()*1000)},
        {name: '南昌市',value: Math.round(Math.random()*1000)},
        {name: '景德镇市',value: Math.round(Math.random()*1000)},
        {name: '萍乡市',value: Math.round(Math.random()*1000)},
        {name: '鹰潭市',value: Math.round(Math.random()*1000)},
        {name: '新余市',value: Math.round(Math.random()*1000)},
        {name: '南阳市',value: Math.round(Math.random()*1000)},
        {name: '信阳市',value: Math.round(Math.random()*1000)},
        {name: '洛阳市',value: Math.round(Math.random()*1000)},
        {name: '驻马店市',value: Math.round(Math.random()*1000)},
        {name: '周口市',value: Math.round(Math.random()*1000)},
        {name: '商丘市',value: Math.round(Math.random()*1000)},
        {name: '三门峡市',value: Math.round(Math.random()*1000)},
        {name: '新乡市',value: Math.round(Math.random()*1000)},
        {name: '平顶山市',value: Math.round(Math.random()*1000)},
        {name: '郑州市',value: Math.round(Math.random()*1000)},
        {name: '安阳市',value: Math.round(Math.random()*1000)},
        {name: '开封市',value: Math.round(Math.random()*1000)},
        {name: '焦作市',value: Math.round(Math.random()*1000)},
        {name: '许昌市',value: Math.round(Math.random()*1000)},
        {name: '濮阳市',value: Math.round(Math.random()*1000)},
        {name: '漯河市',value: Math.round(Math.random()*1000)},
        {name: '鹤壁市',value: Math.round(Math.random()*1000)},
        {name: '大连市',value: Math.round(Math.random()*1000)},
        {name: '朝阳市',value: Math.round(Math.random()*1000)},
        {name: '丹东市',value: Math.round(Math.random()*1000)},
        {name: '铁岭市',value: Math.round(Math.random()*1000)},
        {name: '沈阳市',value: Math.round(Math.random()*1000)},
        {name: '抚顺市',value: Math.round(Math.random()*1000)},
        {name: '葫芦岛市',value: Math.round(Math.random()*1000)},
        {name: '阜新市',value: Math.round(Math.random()*1000)},
        {name: '锦州市',value: Math.round(Math.random()*1000)},
        {name: '鞍山市',value: Math.round(Math.random()*1000)},
        {name: '本溪市',value: Math.round(Math.random()*1000)},
        {name: '营口市',value: Math.round(Math.random()*1000)},
        {name: '辽阳市',value: Math.round(Math.random()*1000)},
        {name: '盘锦市',value: Math.round(Math.random()*1000)},
        {name: '忻州市',value: Math.round(Math.random()*1000)},
        {name: '吕梁市',value: Math.round(Math.random()*1000)},
        {name: '临汾市',value: Math.round(Math.random()*1000)},
        {name: '晋中市',value: Math.round(Math.random()*1000)},
        {name: '运城市',value: Math.round(Math.random()*1000)},
        {name: '大同市',value: Math.round(Math.random()*1000)},
        {name: '长治市',value: Math.round(Math.random()*1000)},
        {name: '朔州市',value: Math.round(Math.random()*1000)},
        {name: '晋城市',value: Math.round(Math.random()*1000)},
        {name: '太原市',value: Math.round(Math.random()*1000)},
        {name: '阳泉市',value: Math.round(Math.random()*1000)},
        {name: '六安市',value: Math.round(Math.random()*1000)},
        {name: '安庆市',value: Math.round(Math.random()*1000)},
        {name: '滁州市',value: Math.round(Math.random()*1000)},
        {name: '宣城市',value: Math.round(Math.random()*1000)},
        {name: '阜阳市',value: Math.round(Math.random()*1000)},
        {name: '宿州市',value: Math.round(Math.random()*1000)},
        {name: '黄山市',value: Math.round(Math.random()*1000)},
        {name: '巢湖市',value: Math.round(Math.random()*1000)},
        {name: '亳州市',value: Math.round(Math.random()*1000)},
        {name: '池州市',value: Math.round(Math.random()*1000)},
        {name: '合肥市',value: Math.round(Math.random()*1000)},
        {name: '蚌埠市',value: Math.round(Math.random()*1000)},
        {name: '芜湖市',value: Math.round(Math.random()*1000)},
        {name: '淮北市',value: Math.round(Math.random()*1000)},
        {name: '淮南市',value: Math.round(Math.random()*1000)},
        {name: '马鞍山市',value: Math.round(Math.random()*1000)},
        {name: '铜陵市',value: Math.round(Math.random()*1000)},
        {name: '南平市',value: Math.round(Math.random()*1000)},
        {name: '三明市',value: Math.round(Math.random()*1000)},
        {name: '龙岩市',value: Math.round(Math.random()*1000)},
        {name: '宁德市',value: Math.round(Math.random()*1000)},
        {name: '福州市',value: Math.round(Math.random()*1000)},
        {name: '漳州市',value: Math.round(Math.random()*1000)},
        {name: '泉州市',value: Math.round(Math.random()*1000)},
        {name: '莆田市',value: Math.round(Math.random()*1000)},
        {name: '厦门市',value: Math.round(Math.random()*1000)},
        {name: '丽水市',value: Math.round(Math.random()*1000)},
        {name: '杭州市',value: Math.round(Math.random()*1000)},
        {name: '温州市',value: Math.round(Math.random()*1000)},
        {name: '宁波市',value: Math.round(Math.random()*1000)},
        {name: '舟山市',value: Math.round(Math.random()*1000)},
        {name: '台州市',value: Math.round(Math.random()*1000)},
        {name: '金华市',value: Math.round(Math.random()*1000)},
        {name: '衢州市',value: Math.round(Math.random()*1000)},
        {name: '绍兴市',value: Math.round(Math.random()*1000)},
        {name: '嘉兴市',value: Math.round(Math.random()*1000)},
        {name: '湖州市',value: Math.round(Math.random()*1000)},
        {name: '盐城市',value: Math.round(Math.random()*1000)},
        {name: '徐州市',value: Math.round(Math.random()*1000)},
        {name: '南通市',value: Math.round(Math.random()*1000)},
        {name: '淮安市',value: Math.round(Math.random()*1000)},
        {name: '苏州市',value: Math.round(Math.random()*1000)},
        {name: '宿迁市',value: Math.round(Math.random()*1000)},
        {name: '连云港市',value: Math.round(Math.random()*1000)},
        {name: '扬州市',value: Math.round(Math.random()*1000)},
        {name: '南京市',value: Math.round(Math.random()*1000)},
        {name: '泰州市',value: Math.round(Math.random()*1000)},
        {name: '无锡市',value: Math.round(Math.random()*1000)},
        {name: '常州市',value: Math.round(Math.random()*1000)},
        {name: '镇江市',value: Math.round(Math.random()*1000)},
        {name: '吴忠市',value: Math.round(Math.random()*1000)},
        {name: '中卫市',value: Math.round(Math.random()*1000)},
        {name: '固原市',value: Math.round(Math.random()*1000)},
        {name: '银川市',value: Math.round(Math.random()*1000)},
        {name: '石嘴山市',value: Math.round(Math.random()*1000)},
        {name: '儋州市',value: Math.round(Math.random()*1000)},
        {name: '文昌市',value: Math.round(Math.random()*1000)},
        {name: '乐东黎族自治县',value: Math.round(Math.random()*1000)},
        {name: '三亚市',value: Math.round(Math.random()*1000)},
        {name: '琼中黎族苗族自治县',value: Math.round(Math.random()*1000)},
        {name: '东方市',value: Math.round(Math.random()*1000)},
        {name: '海口市',value: Math.round(Math.random()*1000)},
        {name: '万宁市',value: Math.round(Math.random()*1000)},
        {name: '澄迈县',value: Math.round(Math.random()*1000)},
        {name: '白沙黎族自治县',value: Math.round(Math.random()*1000)},
        {name: '琼海市',value: Math.round(Math.random()*1000)},
        {name: '昌江黎族自治县',value: Math.round(Math.random()*1000)},
        {name: '临高县',value: Math.round(Math.random()*1000)},
        {name: '陵水黎族自治县',value: Math.round(Math.random()*1000)},
        {name: '屯昌县',value: Math.round(Math.random()*1000)},
        {name: '定安县',value: Math.round(Math.random()*1000)},
        {name: '保亭黎族苗族自治县',value: Math.round(Math.random()*1000)},
        {name: '五指山市',value: Math.round(Math.random()*1000)}
    ];




    //var autoScroll = function(obj){
    //    var scroll = obj;
    //    var scrollIns = null;
    //    $(scroll).hover(function(){
    //        clearInterval(scrollIns);
    //    }, function(){
    //        scrollIns = setInterval(function(){
    //            scrollNews($(scroll));
    //        }, 2000);
    //    }).trigger("mouseout");
    //}
    //
    //var scrollNews = function(obj){
    //    var $self = obj.find("ul:first");
    //    var lineHeight = $self.find("li:first").height();
    //    $self.animate({
    //        "margin-top" : -lineHeight + "px"
    //    }, 600 ,function(){
    //        $self.css({"margin-top" : "0px"}).find("li:first").appendTo($self);
    //    });
    //}
    //
    //autoScroll($("#fgList"));


});

