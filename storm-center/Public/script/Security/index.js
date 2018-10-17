$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});

// echarts组件
var noVipBar;
var vipBar;
var trendLine;
var minNum = 5;

(function(){


    $(function(){
        _init_.view();
        _init_.draw.showMap();
        $(".citys").provinceSelect({prov:"全国"});
        //_init_data.mapByAjax();
        _init_.addHandler();
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $('#vip_id').height(height * 0.3);
            $('#no_vip_id').height(height * 0.3);
            $('#week_trend_id').height(height * 0.3);
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
                        'echarts/chart/bar',
                        'echarts/chart/line'

                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        vipBar = ec.init(document.getElementById('vip_id'));
                        noVipBar = ec.init(document.getElementById('no_vip_id'));
                        trendLine = ec.init(document.getElementById('week_trend_id'));
                        // 显示柱状图
                        __makeData__.showBar(__makeData__.getCurrentYearMonthStr());
                        // 显示折线图
                        __makeData__.getLineData("");


                        vipBar.on(require('echarts/config').EVENT.CLICK, function (param){
                            var area = param.name;
                            if(area.indexOf(">")  > -1){// 点击到标线上
                                return ;
                            }
                            //window.location.href= __ROOT__ + "/Security/Event/eventCheck?province=" + area;
                            window.open(__ROOT__ + "/Security/Event/eventCheck?province=" + area);
                        });

                        noVipBar.on(require('echarts/config').EVENT.CLICK, function (param){
                            var area = param.name;
                            window.open(__ROOT__ + "/Security/Event/eventCheck?province=" + area);
                        });

                    }
                )
            }
        },
        addHandler: function(){
            //绑定省份变化查询事件
            $(".prov-location").live("change", function() {
                var prov = $(this).val();
                if(prov == '全国'){
                    prov = '';
                }
                // 显示折线图
                __makeData__.getLineData(prov);
            });

        }
    };

    var __makeData__ = {
        getCurrentYearMonthStr : function(){
            //初始化时间数组
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            if(month < 10){
                month = "0" + month;
            }
            return fullYear + "" + month;
        },
        initBar: function(json,titleName){
            var option = {
                title : {
                    text: titleName,
                    subtext: '',
                    x: 'center',
                    y: 'top',
                    textStyle:{
                        color: '#46A3FF'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                backgroundColor:'#ffffff',
                legend: {
                    data:['本月通报量','待通报量'],
                    y: 'bottom'
                },
                color: [ "#66B3FF", "#FF8000"],
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                         data : json['province']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'本月通报量',
                        type:'bar',
                        data: json['report'],
                        itemStyle: {normal: {
                            label : {show:true,position:'inside',formatter:'{c} '}
                        }},
                        stack: '统计'

                    },
                    {
                        name:'待通报量',
                        type:'bar',
                        data: json['notreport'],
                        itemStyle: {normal: {
                            label : {show:true,position:'inside',formatter:'{c} '}
                        }},
                        stack: '统计'
                    }
                ]
            };
            if(titleName == 'VIP区域安全事件通报量'){
                option.series[0].markLine = {
                    data : [
                        [
                            {name: '标线1起点', value: minNum, xAxis: -1, yAxis: minNum, itemStyle:{normal:{color:'red',label:{position:'right'}}}},
                            {name: '标线1终点', xAxis: 12, yAxis: minNum}
                        ]
                    ]
                }
            }
            option.legend.selected = {'待通报量' : false};
            return option;
        },
        showBar: function(year_month_key){
            var params = {
                'year_month_key': year_month_key
            };
            vipBar.showLoading();
            noVipBar.showLoading();
            $.getJSON(__ROOT__+'/security/Event/queryEventStatistics', params).success(function(json) {
                var option = __makeData__.initBar(json.data.vip,'VIP区域安全事件通报量');
                vipBar.setOption(option);
                vipBar.hideLoading();

                var option1 = __makeData__.initBar(json.data.novip,'其他区域安全事件通报量');
                noVipBar.setOption(option1);
                noVipBar.hideLoading();

                // _init_data.initTable(json.data)
            });
        },
        getLineData: function(area){
            var params = {
                'province': area
            };
            trendLine.showLoading();
            $.getJSON(__ROOT__+'/security/Index/getOneWeekTrend', params).success(function(json) {
                __makeData__.showLine(json.data);
                // _init_data.initTable(json.data)
            });
        },
        showLine: function(json){
            var option = {
                title : {
                    // text: '事件通报趋势'
                    //subtext: '纯属虚构'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['通报事件数']
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : json.name
                        //data : ['周一','周二','周三','周四','周五','周六','周日']
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel : {
                            formatter: '{value} 次'
                        }
                    }
                ],
                series : [
                    {
                        name:'通报事件数',
                        type:'line',
                        //data:[11, 11, 15, 13, 12, 13, 10],
                        data: json.value,
                        markPoint : {
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        }
                    }
                ]
            };

            trendLine.setOption(option);
            trendLine.hideLoading();
        }
    }


})();