/**
 * Created by jianghaifeng on 2016/4/2.
 */
(function(){

    var common = {
        sort:function(json){
            var arr=[];
            $.each(json,function(k,v){
                arr.push({name:k,value:v});
            });
            arr.sort(function(a,b){
                return b.value- a.value;
            });
            return arr;
        }
    }

    var SecurityInfo = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_func = init_func;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        chartMap:{
            timeline:{
                data:[],
                autoPlay : true,
                playInterval : 4000
            },
            options:[
            ]
        },
        chartGauge:{
            series : [
                {
                    name:'通报率',
                    type:'gauge',
                    radius : ['40%', '65%'],
                    splitNumber: 10,       // 分割段数，默认为5
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']],
                            width: 8
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        splitNumber: 10,   // 每份split细分多少段
                        length :12,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        show: true,        // 默认显示，属性show控制显示与否
                        length :15,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    pointer : {
                        length: '90%',
                        width : 5
                    },
                    title : {
                        show : true,
                        offsetCenter: [0, '24%'],       // x, y，单位px
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            color: '#fff'
                        }
                    },
                    detail : {
                        formatter:'{value}%',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: 'auto',
                            fontWeight: 'bolder'
                        }
                    },
                    data:[]
                }
            ]
        },
        chartBar:{
            color:["orange"],
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
                data:["安全事件"],
                textStyle : {
                    color: 'white'
                }
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
            ]
        },
        chartPie:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                show:true,
                x : 20,
                y: 20,
                textStyle: {
                    color: '#6596ED',  //数据对应的事件名称颜色
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                padding: [0, 0, 0,0],
                data:[]
            },
            series : [
                {
                    name:'攻击类型',
                    type:'pie',
                    radius : '60%',
                    data:[]
                }
            ]
        },
        chartLine : {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                show:false,
                data:['邮件营销']
            },
            toolbox: {
                show : false

            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    axisLine : {    // 轴线
                        show: false
                    },
                    splitLine : {
                        show:false
                    },
                    splitArea : {
                        show: false
                    },
                    data : ['周一','周二','周三','周四','周五','周六','周日']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    axisLine : {    // 轴线
                        show: false
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
                    name:'事件个数',
                    type:'line',
                    stack: '总量',
                    data:[120, 132, 101, 134, 90, 230, 210]
                }
            ]
        }
    }

    var init_data = {
        init_map:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/SecurityInfo/mapData",
                async:false,
                method:"post",
                success:function(json){
                    w.init_func.init_map_option.call(w, json);
                }
            });
        },
        init_gauge:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/SecurityInfo/summary",
                async:false,
                method:"post",
                success:function(json){
                    w.init_func.init_gauge_option.call(w, json);
                }
            });
        },
        init_type:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/SecurityInfo/type_category",
                async:false,
                method:"post",
                success:function(json){
                    w.init_func.init_pie_option.call(w, json);
                }
            });
        }
    }

    var init_func = {
        init_map_option : function(json){
            var w = this;
            var timeAry = {};
            var provinceCount = {};
            $.each(json['data'], function(point, item){
                var month = item['_id']['time'];
                var region = item['_id']['name'];
                var total = item['total'];
                if(!provinceCount[region]){
                    provinceCount[region] = 0;
                }
                provinceCount[region] = provinceCount[region] + total;
                if(!timeAry[month]){
                    timeAry[month] = [];
                }
                timeAry[month].push({
                    name:region,
                    value:total
                });
            });
            provinceCount = common.sort(provinceCount);
            $.each(timeAry, function(point, item){
                w.setting.chartMap.timeline.data.push(point);
                w.setting.chartMap.options.push({
                    title:{show:false},
                    series : [
                        {
                            'name':"事件个数",
                            'data':item,
                            'type':'map'
                        }
                    ]
                });
            });
            $.extend(w.setting.chartMap.options[0], {
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
                    show:false,
                    min: 0,
                    max : 20,
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true,
                    color: ['orangered','yellow','lightskyblue']
                }
            });
            var legend = [];
            var data = [];
            var size = 5;
            var tmpCountAry = [];
            if(provinceCount.length < size){
                tmpCountAry = provinceCount;
                size = provinceCount.length;
            }else{
                for(var i = 0; i < size; i++){
                    tmpCountAry.push(provinceCount[i]);
                }
            }
            tmpCountAry = tmpCountAry.sort(function(a, b){
                return a.value - b.value;
            });
            for(var i = 0; i < tmpCountAry.length; i++){
                data.push(tmpCountAry[i]['value']);
                legend.push(tmpCountAry[i]['name']);
            }
            w.setting.chartBar.yAxis[0].data = legend;
            w.setting.chartBar.series.push({
                name:'安全事件',
                type:'bar',
                stack:'总量',
                itemStyle : { normal: {label : {show: true, position: 'right', color:"white"}}},
                data:data
            });
        },
        init_gauge_option : function(json){
            var w = this;
            var value = parseInt(json['dealed'] / json['total'] * 100);
            w.setting.chartGauge.series[0]['data'].push({
                value: value, name: '通报率'
            });
        },
        init_pie_option : function(json){
            var w = this;
            var nameList = [];
            var valueList = [];
            console.info(json);
            $.each(json['data'], function(point, item){
                nameList.push(json['event_name_mapper'][point]);
                valueList.push({
                    value:item,
                    name:json['event_name_mapper'][point]
                });
            });
            console.info(nameList);
            console.info(valueList);
            w.setting.chartPie.legend.data = nameList;
            w.setting.chartPie.series[0].data = valueList;
        }
    }

    var init_view = {
        init_component : function(){
            var w = this;
            var height= $(window).height();
            $('#map').height(height*0.5);
            $("#line").height(height*0.2);
            $('#gauge').height(height*0.3);
            $('#bar').height(height*0.35);
            $('#pie').height(height*0.3);
        },
        init_echart : function(callback){
            var w = this;
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/pie',
                    'echarts/chart/gauge'
                ],
                function (ec) {
                    w.chartMap = ec.init(document.getElementById('map'));
                    w.chartGauge = ec.init(document.getElementById('gauge'));
                    w.chartBar = ec.init(document.getElementById('bar'));
                    w.chartPie = ec.init(document.getElementById('pie'));
                    w.chartLine = ec.init(document.getElementById("line"));
                    w.chartMap.showLoading();
                    w.chartGauge.showLoading();
                    w.chartGauge.showLoading();
                    w.chartPie.showLoading();
                    w.chartLine.showLoading();
                    callback && callback.call(w);
                }
            );
        }

    }


    var init = function(){
        var w = this;
        w.init_view.init_component.call(w);
        w.init_view.init_echart.call(w, function(){
            w.init_data.init_map.call(w);
            w.chartMap.setOption(w.setting.chartMap);
            w.chartMap.hideLoading();
            w.chartBar.setOption(w.setting.chartBar);
            w.chartBar.hideLoading();
            w.init_data.init_gauge.call(w);
            w.chartGauge.setOption(w.setting.chartGauge);
            w.chartGauge.hideLoading();
            w.init_data.init_type.call(w);
            w.chartPie.setOption(w.setting.chartPie);
            w.chartPie.hideLoading();
            w.chartLine.setOption(w.setting.chartLine);
            w.chartLine.hideLoading();
        });
    }

    $(document).ready(function(){
        var securityInfo=new SecurityInfo();
        securityInfo.init.call(securityInfo);
    });


})();
