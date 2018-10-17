

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


            $('#paper').height(height* .35);
            $('#monitor').height(height* .35);

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
                    'echarts/chart/pie'
                ],
                function (ec) {

                    w.paper= ec.init(document.getElementById('paper'));
                    w.monitor= ec.init(document.getElementById('monitor'));

                    w.paper.setOption(w.pieOption(_data_.paper));
                    w.monitor.setOption(w.pieOption(_data_.monitor));



                }
            );


        },
        initOption: function(){
            var w = this;

            w.pieOption = function(json){
                var option = {
                    title: {
                        text: json.text,
                        x: 'center',
                        y: 40,
                        textStyle: {
                            color: '#098BCB',
                            fontSize: 18,
                            fontFamily: 'Microsoft YaHei'
                        }

                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    color: [
                        '#CC5C5C', '#FEA512', '#40DFCF',
                        '#2591FD'
                    ],
                    calculable : false,
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data: json.data
                        }
                    ]
                };

                return option;
            }


        }

    };
    var _data_= {
        paper: {
            text: '网站合同状态统计',
            data: [
                {value:335, name:'七天内过期', selected: true},
                {value:310, name:'未过期'},
                {value:234, name:'已过期'}
            ]
        },
        monitor: {
            text: '网站监控状态统计',
            data: [
                {value:335, name:'已停止'},
                {value:310, name:'监控中'}
            ]
        }
    };
    $(function(){
        o.init();
    })
})();