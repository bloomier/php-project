/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var RecordIndex = function(){
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.setting = setting;
        this.init_chart = init_chart;
        this.init_setting = init_setting;
        this.init = init;
    };

    var init = function(){
        var w = this;
        w.init_chart.init_height.call(w);
        w.init_chart.init_echart.call(w, function(){
            w.init_data.initAlertSitePie.call(w, null);
            w.init_data.initAlertTypePie.call(w, null);
        });
    };

    var init_chart = {
        init_height:function(){
            var w = this;
            var height= $(window).height();
            $('#alter-web-pie').height(height* .3);
            $('#alter-type-pie').height(height* .3);
        },

        init_echart : function(callback){
            var w=this;
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
                    w.alertSitePie = ec.init(document.getElementById('alter-web-pie'));
                    w.alertTypePie = ec.init(document.getElementById('alter-type-pie'));
                    w.alertSitePie.showLoading();
                    w.alertTypePie.showLoading();
                    callback&&callback.call(w);
                }
            );
        }
    }

    var setting = {
        pieOption: function(){
            var option = {
                title : {
                    show:false
                },
                tooltip : {
                    show:true,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show:false,
                    data:[]
                },
                toolbox: {
                    show : false
                },
                series : [
                    {
                        name:'',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                        ]
                    }
                ]
            };
            return option;
        },
        innerPie : function(){
            var option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show:false
                },
                toolbox: {
                    show : false
                },
                series : [
                    {
                        name:'',
                        type:'pie',
                        selectedMode: 'single',
                        radius : [0, 60],
                        x: '20%',
                        width: '40%',
                        funnelAlign: 'right',
                        max: 0,
                        itemStyle : {
                            normal : {
                                label : {
                                    position : 'inner'
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data:[
                        ]
                    },
                    {
                        name:'',
                        type:'pie',
                        radius : [80, 120],
                        x: '60%',
                        width: '35%',
                        funnelAlign: 'left',
                        max: 0,
                        data:[
                        ]
                    }
                ]
            };
            return option;
        },
        pieSitePath : __ROOT__,
        pieTypePath : __ROOT__,
        alertQueryPath : __ROOT__
    }

    var init_setting = {
        pieSite : function(json){
            var w = this;
            var option = w.setting.pieOption();
            return option;
        },
        pieType : function(json){
            var w = this;
            var option = w.setting.innerPie();
            return option;
        }
    }

    // ajax request
    var init_data = {
        // 告警站点饼图
        initAlertSitePie : function(param){
            var w = this;
            $.post(w.setting.pieSitePath, param).success(function(json){
                var option = w.init_setting.pieSite.call(w, json);
                w.alertSitePie.hideLoading();
                w.alertSitePie.setOption(option);
                w.alertSitePie.restore();
            });
        },
        // 告警类型饼图
        initAlertTypePie : function(param){
            var w = this;
            $.post(w.setting.pieTypePath, param).success(function(json){
                var option = w.init_setting.pieType.call(w, json);
                w.alertTypePie.hideLoading();
                w.alertTypePie.setOption(option);
                w.alertTypePie.restore();
            });
        },

        initAlertQuery : function(){
            var w = this;
            var param = w.init_view.initQueryParam();
            $.post(w.setting.alertQueryPath, param).success(function(json){
                w.init_view.valueToPage.call(w, json);
            });
        }
    };

    // bind function
    var init_bind = {
        init_function : function(){
            var w = this;
            $(".form-submit .query").bind("click", function(){
                if(w.init_view.checkParam()){
                    w.init_data.initAlertQuery.call(w);
                }
            });

            $(".form-submit .reset").bind("click", function(){
                w.init_view.clearParam();
            });
        }
    };

    // append value to page
    var init_view = {
        // 清空条件参数
        clearParam : function(){

        },
        // 组装查询条件
        initQueryParam : function(){

        },

        // 将查询结果append到页面中
        valueToPage : function(json){
            var w = this;

        },

        // 监测参数条件是否合规
        checkParam : function(){
            return 1;
        }

    };

    $(document).ready(function(){
        var recordIndex=new RecordIndex();
        recordIndex.init.call(recordIndex);
    });
})();