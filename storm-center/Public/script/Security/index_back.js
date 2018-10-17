$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});

// 定义时间的数组
var timeArray = new Array(12);

(function(){


    $(function(){
        _init_data.initArray();
        _init_.view();
        _init_data.mapByAjax();
        //_init_.test.showMap();
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;

        },
        draw: {
            showMap : function(op){
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
                        // 基于准备好的dom，初始化echarts图表
                        var myChart = ec.init(document.getElementById('map'));
                        // 为echarts对象加载数据
                        //myChart.setOption(_init_data.mapOption());
                        myChart.setOption(op);

                    }
                )
            }
        }
    };
    var _init_data = {
        mapByAjax : function(){
            $.post(__ROOT__+'/Security/Index/getEventOfHomeValue').success(function(json){
                var dataArr = new Array(12);
                var max_num = 0;
                for(var i =0; i < 12; i++){
                    var oneArr = [];
                    var list = json.data[i];
                    for(var x = 0; x <list.length;x++){
                        var oneObj = {};
                        oneObj.name = list[x].name;
                        var value = list[x].value;
                        if(value > 1){
                            value = Math.log(value)/Math.log(10);
                        } else if(value == 1) {
                            value = 1;
                        } else {
                            value = 0;
                        }

                        oneObj.value = value;
                        oneArr.push(oneObj);
                        //var value = list[x].value;
                        //if(value * 1 > max_num * 1){
                        //    max_num = value * 1;
                        //}
                    }
                    dataArr[i] = oneArr;
                }
                //alert(max_num);
                var option = {
                    timeline:{
                        data:[timeArray[9], timeArray[10], timeArray[11]],
                        label : {
                            formatter : function(s) {
                                return s.slice(0, 7);
                            }
                        },
                        autoPlay : true,
                        playInterval : 5000
                    },
                    options:[
                        {
                            title : {
                                'text':timeArray[9].slice(0, 7) + '事件区域分布'
                                // 'subtext':'数据来自数据中心'
                            },
                            tooltip : {
                                'trigger':'item',
                                formatter: function (a) {
                                    var value = a[2];
                                    if(value > 1){
                                        value =  Math.pow(10,value);
                                        value = Math.ceil(value);
                                    } else if(value == 1){
                                        value = 1;
                                    } else {
                                        value = 0;
                                    }

                                    return "<br/>" + a[0] + "<br/>"+ a[1] + ":" + value + "<br/>";
                                }
                            },
                            toolbox : {
                                'show':false,
                                'feature':{
                                    'mark':{'show':true},
                                    'dataView':{'show':true,'readOnly':false},
                                    'restore':{'show':true},
                                    'saveAsImage':{'show':true}
                                }
                            },
                            dataRange: {
                                min: 0,
                                max : 5,
                                //max : max_num,
                                text:['高','低'],  // 文本，默认为数值文本
                                calculable : true,
                                x: 'left',
                                color: ['orangered','yellow','lightskyblue']
                            },
                            series : [
                                {
                                    'name':'事件数',
                                    'type':'map',
                                    //'data': json.data[1]
                                    'data': dataArr[2]
                                }
                            ]
                        },
                        //{
                        //    title : {'text':timeArray[0] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[11]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[1] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[10]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[2] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[9]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[3] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[8]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[4] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[7]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[5] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[6]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[6] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[5]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[7] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[4]}
                        //    ]
                        //},
                        //{
                        //    title : {'text':timeArray[8] + '事件区域分布'},
                        //    series : [
                        //        {'data': json.data[3]}
                        //    ]
                        //},
                        {
                            title : {'text':timeArray[10].slice(0, 7) + '事件区域分布'},
                            series : [
                                {'data': dataArr[1]}
                            ]
                        },
                        {
                            title : {'text': timeArray[11].slice(0, 7) + '事件区域分布'},
                            series : [
                                {
                                    'data': dataArr[0]
                                }
                            ]
                        }
                    ]
                };
                _init_.draw.showMap(option);
            });
        },
        initArray : function(){
            //初始化时间数组
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var new_year = fullYear;
            var new_month = month;
            for(var i = 0; i < 12; i++){
                new_month = month - i;
                if(new_month <= 0){
                    new_month = 12 + new_month;
                    new_year = fullYear -1;
                }
                if(new_month < 10){
                    new_month = "0" + new_month;
                }
                timeArray[11 -i] = new_year + "-" + new_month + "-01";
            }
        },
        mapOption : function(){
            var option = {
                timeline:{
                    data: [
                       '2014-08-01','2014-09-01','2014-10-01','2014-11-01',
                       '2014-12-01','2015-01-01','2015-02-01','2015-03-01','2015-04-01','2015-05-01','2015-06-01','2015-07-01'
                    ],
                    label : {
                        formatter : function(s) {
                            return s.slice(0, 7);
                        }
                    },
                    autoPlay : true,
                    playInterval : 2000
                },
                options:[
                    {
                        title : {
                            'text': timeArray[11] + '事件区域分布'
                            // 'subtext':'数据来自数据中心'
                        },
                        tooltip : {'trigger':'item'},
                        toolbox : {
                            'show':false,
                            'feature':{
                                'mark':{'show':true},
                                'dataView':{'show':true,'readOnly':false},
                                'restore':{'show':true},
                                'saveAsImage':{'show':true}
                            }
                        },
                        dataRange: {
                            min: 0,
                            max : 53000,
                            text:['高','低'],  // 文本，默认为数值文本
                            calculable : true,
                            x: 'left',
                            color: ['orangered','yellow','lightskyblue']
                        },
                        series : [
                            {
                                'name':'事件数',
                                'type':'map',
                                'data': [
                                    {name: '北京',value: Math.round(Math.random()*50000)},
                                    {name: '天津',value: Math.round(Math.random()*50000)},
                                    {name: '上海',value: Math.round(Math.random()*50000)},
                                    {name: '重庆',value: Math.round(Math.random()*50000)},
                                    {name: '河北',value: Math.round(Math.random()*50000)},
                                    {name: '河南',value: Math.round(Math.random()*50000)},
                                    {name: '云南',value: Math.round(Math.random()*50000)},
                                    {name: '辽宁',value: Math.round(Math.random()*50000)},
                                    {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                    {name: '湖南',value: Math.round(Math.random()*50000)},
                                    {name: '安徽',value: Math.round(Math.random()*50000)},
                                    {name: '山东',value: Math.round(Math.random()*50000)},
                                    {name: '新疆',value: Math.round(Math.random()*50000)},
                                    {name: '江苏',value: Math.round(Math.random()*50000)},
                                    {name: '浙江',value: Math.round(Math.random()*50000)},
                                    {name: '江西',value: Math.round(Math.random()*50000)},
                                    {name: '湖北',value: Math.round(Math.random()*50000)},
                                    {name: '广西',value: Math.round(Math.random()*50000)},
                                    {name: '甘肃',value: Math.round(Math.random()*50000)},
                                    {name: '山西',value: Math.round(Math.random()*50000)},
                                    {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                    {name: '陕西',value: Math.round(Math.random()*50000)},
                                    {name: '吉林',value: Math.round(Math.random()*50000)},
                                    {name: '福建',value: Math.round(Math.random()*50000)},
                                    {name: '贵州',value: Math.round(Math.random()*50000)},
                                    {name: '广东',value: Math.round(Math.random()*50000)},
                                    {name: '青海',value: Math.round(Math.random()*50000)},
                                    {name: '西藏',value: Math.round(Math.random()*50000)},
                                    {name: '四川',value: Math.round(Math.random()*50000)},
                                    {name: '宁夏',value: Math.round(Math.random()*50000)},
                                    {name: '海南',value: Math.round(Math.random()*50000)},
                                    {name: '台湾',value: Math.round(Math.random()*50000)},
                                    {name: '香港',value: Math.round(Math.random()*50000)},
                                    {name: '澳门',value: Math.round(Math.random()*50000)}
                                ]
                            }
                        ]
                    },
                    {
                        title : {'text':'事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2014-09事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2014-10事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2014-11事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2014-12事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-01事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-02事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-03事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-04事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-05事件区域分布'},
                        series : [
                            {'data': [
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    },
                    {
                        title : {'text':'2015-06事件区域分布'},
                        series : [
                            //{'data': dataMap.dataGDP['2011']}
                            {'data':[
                                {name: '北京',value: Math.round(Math.random()*50000)},
                                {name: '天津',value: Math.round(Math.random()*50000)},
                                {name: '上海',value: Math.round(Math.random()*50000)},
                                {name: '重庆',value: Math.round(Math.random()*50000)},
                                {name: '河北',value: Math.round(Math.random()*50000)},
                                {name: '河南',value: Math.round(Math.random()*50000)},
                                {name: '云南',value: Math.round(Math.random()*50000)},
                                {name: '辽宁',value: Math.round(Math.random()*50000)},
                                {name: '黑龙江',value: Math.round(Math.random()*50000)},
                                {name: '湖南',value: Math.round(Math.random()*50000)},
                                {name: '安徽',value: Math.round(Math.random()*50000)},
                                {name: '山东',value: Math.round(Math.random()*50000)},
                                {name: '新疆',value: Math.round(Math.random()*50000)},
                                {name: '江苏',value: Math.round(Math.random()*50000)},
                                {name: '浙江',value: Math.round(Math.random()*50000)},
                                {name: '江西',value: Math.round(Math.random()*50000)},
                                {name: '湖北',value: Math.round(Math.random()*50000)},
                                {name: '广西',value: Math.round(Math.random()*50000)},
                                {name: '甘肃',value: Math.round(Math.random()*50000)},
                                {name: '山西',value: Math.round(Math.random()*50000)},
                                {name: '内蒙古',value: Math.round(Math.random()*50000)},
                                {name: '陕西',value: Math.round(Math.random()*50000)},
                                {name: '吉林',value: Math.round(Math.random()*50000)},
                                {name: '福建',value: Math.round(Math.random()*50000)},
                                {name: '贵州',value: Math.round(Math.random()*50000)},
                                {name: '广东',value: Math.round(Math.random()*50000)},
                                {name: '青海',value: Math.round(Math.random()*50000)},
                                {name: '西藏',value: Math.round(Math.random()*50000)},
                                {name: '四川',value: Math.round(Math.random()*50000)},
                                {name: '宁夏',value: Math.round(Math.random()*50000)},
                                {name: '海南',value: Math.round(Math.random()*50000)},
                                {name: '台湾',value: Math.round(Math.random()*50000)},
                                {name: '香港',value: Math.round(Math.random()*50000)},
                                {name: '澳门',value: Math.round(Math.random()*50000)}
                            ]}
                        ]
                    }
                ]
            };
            return option;
        }
    }

})();