/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/5
 *@example
 */
(function(){
    var o = {
        init: function(){
            var w = this;

            w.initHtml();
            w.initEvent();

        },
        initHtml: function(){
            var w = this;
            var height= $(window).height();


            $('#weekChart').height(height* .35);
            $('#midMonthChart').height(height* .35);
            $('#monthChart').height(height* .35);

            //$('#weekChart').click();



            w.initDraw();

            $(window).resize(function(){
                //浏览器窗口变化时，图形自适应
                w.initDraw();
            });
        },
        initEvent: function(){
            var w = this;

        },
        initDraw: function(){
            var w =this;


            w.initOption();

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

                    w.weekChart = ec.init(document.getElementById('weekChart'));
                    w.midMonthChart= ec.init(document.getElementById('midMonthChart'));
                    w.monthChart= ec.init(document.getElementById('monthChart'));

                    w.weekChart.setOption(w.chartOption(_data_.week));
                    w.midMonthChart.setOption(w.chartOption(_data_.week));
                    w.monthChart.setOption(w.chartOption(_data_.week));
                    $("#myTab .tab-pane:gt(0)").removeClass('active');



                }
            );


        },
        initOption: function(){
            var w = this;

            w.chartOption = function(json){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['已告警','未告警']
                    },
                    calculable : true,
                    grid: {
                        borderWidth:0
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            data : json.data.xData
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
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
                            name:'已告警',
                            type:'line',
                            smooth:true,
                            symbol: 'emptyCircle',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:json.data.inData
                        },
                        {
                            name:'未告警',
                            type:'line',
                            smooth:true,
                            symbol: 'emptyCircle',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:json.data.unData
                        }

                    ]
                };

                return option;
            }


        }


    };

    var _data_= {
        week: {
            data: {
                xData:['周一','周二','周三','周四','周五','周六','周日'],
                inData: [10, 12, 21, 54, 260, 830, 710],
                unData: [30, 182, 434, 791, 390, 30, 10]
            }
        }
    };
    $(function(){
        o.init();

    })
})();