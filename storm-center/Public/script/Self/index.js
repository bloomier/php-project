$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});

// 定义最近七天的时间数组
var timeArray = new Array(7);

(function(){

    $(function(){
        _init_data.initArray();
        _init_.view();
        _init_data.lineOption()
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;

        },
        draw: {
            showLine : function(op){
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });

                require(
                    [
                        'echarts',
                        'echarts/chart/line'
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        var myChart = ec.init(document.getElementById('line_id'));
                        myChart.setOption(op);
                    }
                )
            }
        }
    };
    var _init_data = {
        initArray : function(){
            //初始化时间数组 设置日期，当前日期的前七天
            var myDate = new Date(); //获取今天日期
            myDate.setDate(myDate.getDate() - 7);
            var flag = 1;
            var monthStr = "";
            var dayStr = "";
            for (var i = 0; i < 7; i++) {
                myDate.setDate(myDate.getDate() + flag);
                if(myDate.getMonth() + 1 < 10){
                    monthStr = "0" + (myDate.getMonth() + 1);
                } else {
                    monthStr = myDate.getMonth() + 1;
                }
                if(myDate.getDate() < 10){
                    dayStr = "0" + myDate.getDate();
                } else {
                    dayStr = myDate.getDate();
                }
                timeArray[i] = myDate.getFullYear() + "-" + monthStr + "-" + dayStr;
            }
        },
        lineOption : function(){
            $.post(__ROOT__+'/Self/SelfHome/showLineData').success(function(json){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['未审核','已撤销','审核失败','审核通过']
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            dataView : {show: true, readOnly: false},
                            magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    calculable : true,
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            //data : ['周一','周二','周三','周四','周五','周六','周日']
                            data: timeArray
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'未审核',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: json.data.not_check_num
                        },
                        {
                            name:'已撤销',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: json.data.undo_num
                        },
                        {
                            name:'审核失败',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: json.data.check_fail_num
                        },
                        {
                            name:'审核通过',
                            type:'line',
                            stack: '总量',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: json.data.check_pass_num
                        }
                    ]
                };
                _init_.draw.showLine(option);
            });
        }
    }

})();