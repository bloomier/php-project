
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


            $('#status').height(height* .35);
            $('#task').height(height* .35);

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

                    w.status= ec.init(document.getElementById('status'));
                    w.task= ec.init(document.getElementById('task'));

                    w.status.setOption(w.pieOption(_data_.status));
                    w.task.setOption(w.pieOption(_data_.task));



                }
            );


        },
        initOption: function(){
            var w = this;

            w.pieOption = function(json){
                var option = {
                    title: {
                        text: json.text,
                        subtext: json.subtext,
                        x: 'center',
                        y: 20,
                        textStyle: {
                            color: '#098BCB',
                            fontSize: 18,
                            fontFamily: 'Microsoft YaHei'
                        },
                        itemGap: 15


                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },

                    color: [
                        '#CC5C5C', '#FEA512', '#40DFCF',
                        '#2591FD', '#FE8463','#9BCA63',
                        '#FAD860','#F3A43B','#60C0DD',
                        '#D7504B','#C6E579','#F4E001',
                        '#F0805A','#26C0C0'
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
        status: {
            text: '服务节点状态统计',
            subtext: '全国监控节点统计',
            data: [
                {value:335, name:'暂停', selected: true},
                {value:310, name:'正常'},
                {value:234, name:'终止'}
            ]
        },
        task: {
            text: '服务节点任务统计',
            subtext: '监控节点分配任务统计',
            data: [
                {value:335, name:'北京节点'},
                {value:310, name:'南京节点'},
                {value:310, name:'武汉节点'},
                {value:310, name:'贵阳节点'},
                {value:310, name:'杭州节点', selected: true},
                {value:310, name:'西安节点'}
            ]
        }
    };
    $(function(){
        o.init();
    })
})();