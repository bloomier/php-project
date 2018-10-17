/**
 * Created by jianghaifeng on 2016/3/31.
 */
(function(){

    var common = {
        sort:function(json){
            var arr=[];
            $.each(json,function(k,v){
                arr.push({name:k,value:v});
            });
            arr.sort(function(a,b){
                return b.value.total- a.value.total;
            });
            return arr;
        },
        getDateList : function(){
            var ary = [];
            var myDate = new Date();
            var time = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            if(month < 10){
                month = "0" + month;
            }
            time = time + month;
            time = parseInt(time);
            for(var i = 0; i < 12; i++){
                if(time % 100 == 0){
                    time = myDate.getFullYear() - 1;
                    time = parseInt(time + "12");
                }
                ary.push(time--);
            }
            ary.sort(function(a,b){
                return a - b;
            });
            return ary;
        }
    }

    var HomePage = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_func = init_func;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        barOption:{
            color:['#2EC7C9','#B7A3DF'],
            tooltip : {
                show:false
            },
            legend: {
                show:true,
                data:['高危风险','中危风险']
            },
            calculable : false,
            xAxis : [
                {
                    type : 'value',
                    splitLine:{
                        show:true,
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'category',
                    data : [],
                    splitLine:{
                        show:false
                    },
                    axisLabel:{
                        rotate: 45

                    }
                }
            ],
            grid:{

                borderWidth:0
            },
            series : [
                {
                    name:'高危风险',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[]
                },
                {
                    name:'中危风险',
                    type:'bar',
                    stack: '总量',
                    itemStyle : { normal: {label : {show: true, position: 'insideRight'}}},
                    data:[]
                }
            ]
        },
        pieOption:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            //color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
            color:['#2EC7C9','#95706B','#9B7CCF','#0AA4A6','#B7A3DF','#DD6AAB'],
            series : [
                {
                    name:'可用不可用',
                    type:'pie',
                    selectedMode: 'single',
                    radius : [0, '40%'],
                    // for funnel
                    x: '20%',
                    width: '40%',
                    funnelAlign: 'left',
                    itemStyle : {
                        normal : {
                            label : {
                                position : 'inner'
                            },
                            labelLine : {
                                show : false
                            },
                            color:function (e){
                                if(e.dataIndex==0){
                                    return "#F0412F"
                                }else{
                                    return "#2ECD73"
                                }
                            }
                        }
                    },
                    data:[
                    ]
                },
                {
                    name:'可用性详情',
                    type:'pie',
                    radius : ['50%', '75%'],
                    x: '40%',
                    y: '40%',
                    width: '45%',
                    funnelAlign: 'right',
                    data:[
                    ]
                }
            ]
        },
        gaugeOption:{
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
                            color: '#000000'
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
        lineOption:{
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:[]
            },
            toolbox: {
                show : false
            },
            calculable : false,
            grid:{
                borderWidth:0
            },
            xAxis : [
                {
                    type : 'category',
                    splitLine:{
                        show:true,
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    },
                    boundaryGap : false,
                    data : []
                }
            ],
            yAxis : [
                {
                    splitLine:{
                        show:true,
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        }
                    },
                    type : 'value'
                }
            ],
            series : [
            ]
        },
        level:{
            'err':"不可用",
            'ok':"可用"
        }
    }

    var init_view = {
        init_component : function(){
            var height= $(window).height();
            $("#bar").height(height*0.73);
            $("#pie").height(height*0.3);
            $("#gauge").height(height*0.3);
            $("#line").height(height*0.4);
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
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/pie',
                    'echarts/chart/gauge'
                ],
                function (ec) {
                    if($("#bar").height() >0 && $("#bar").width() > 0){
                        w.bar = ec.init(document.getElementById('bar'));
                        w.gauge = ec.init(document.getElementById('gauge'));
                        w.pie = ec.init(document.getElementById('pie'));
                        w.line = ec.init(document.getElementById("line"));
                        w.bar.showLoading();
                        w.gauge.showLoading();
                        w.pie.showLoading();
                        w.line.showLoading();
                        callback && callback.call(w);
                    }
                }
            );
        }
    }

    var init_data = {
        init : function(){
            var w = this;
            $.post(__ROOT__+"/Home/HomePage/summary").success(function(json){
                if(json.code>0){
                    var infos=$(".info",$(".summary"));
                    $.each(infos,function(i,info){
                        var key=$(info).attr("key");
                        $(info).text(json.data[key]||"");
                    });
                }
            });
        },
        init_bar : function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/HomePage/vuls_summary",
                method:"post",
                success:function(json){
                    var list = common.sort(json['data']);
                    var length = 10;
                    if(list.length < 10){
                        length = list.length;
                    }
                    var tmpList = [];
                    for(var i = 0; i < length; i++){
                        tmpList.push(list[i]);
                    }
                    tmpList.sort(function(a,b){
                        return a.value.total- b.value.total;
                    });
                    $.each(tmpList, function(point, item){
                        w.setting.barOption.yAxis[0].data.push(item['name']||"未知");
                        w.setting.barOption.series[0].data.push(item['value']['high']);
                        w.setting.barOption.series[1].data.push(item['value']['mid']);
                    });
                    w.bar.setOption(w.setting.barOption);
                    w.bar.hideLoading();
                }
            });
        },
        init_pie : function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/HomePage/survey_summary",
                method:"post",
                success:function(json){
                    $.each(json['category'], function(point, item){
                        w.setting.pieOption.series[1].data.push({
                            name:point,
                            value:item
                        });
                    });
                    w.setting.pieOption.series[0].data.push({
                        name: w.setting.level['err'],
                        value:json["summary"]['err']
                    });
                    w.setting.pieOption.series[0].data.push({
                        name: w.setting.level['ok'],
                        value:json["summary"]['ok']
                    });
                    w.pie.setOption(w.setting.pieOption);
                    w.pie.hideLoading();
                }
            });
        },
        init_gauge:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/HomePage/event_summary",
                method:"post",
                success:function(json){
                    var value = parseInt(json['pass'] / json['all'] * 100);
                    w.setting.gaugeOption.series[0]['data'].push({
                        value: value, name: '通报率'
                    });
                    $(".all-sec").html(json['all']);
                    $(".un-deal-sec").html(json['all'] - json['pass']);
                    w.gauge.setOption(w.setting.gaugeOption);
                    w.gauge.hideLoading();
                }
            });
        },
        init_line:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/HomePage/event_monthline",
                method:"get",
                success:function(json){
                    var tmpAry = {};
                    $.each(json['data'], function(point, item){
                        if(!tmpAry[item['event_type']]){
                            tmpAry[item['event_type']] = [];
                        }
                        tmpAry[item['event_type']].push(item);
                    });
                    var monthList = common.getDateList();
                    w.setting.lineOption.xAxis[0].data=monthList;
                    $.each(tmpAry, function(point, item){
                        if(point && point != "null"){
                            var tmpList = [];
                            for(var i = 0; i < monthList.length; i++){
                                var month = monthList[i];
                                var total = 0;
                                $.each(item, function(p, v){
                                    if(v["time"] == month){
                                        total = v["count"];
                                    }
                                });
                                tmpList.push(total);
                            }
                            w.setting.lineOption.legend.data.push(point);
                            w.setting.lineOption.series.push({
                                name:point,
                                type:'line',
                                stack: '总量',
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data:tmpList
                            });
                        }
                    });
                    w.line.setOption(w.setting.lineOption);
                    w.line.hideLoading();
                }
            });
        },
        init_event:function(){
            var w = this;
            $.post(__WEBROOT__ + "/Home/HomePage/event_list").success(function(json){
                var secWrapper = $(".sec-latest-wrapper");
                $.each(json["data"], function(point, item){
                    var value = "";
                    if(item["happen_time"]){
                        value = "[" + $.trim(item["happen_time"].substr(0, 10)) + "]";
                    }
                    if(item["title"]){
                        if(item["title"].length > 15){
                            item["title"] = item["title"].substr(0,15) + "...";
                        }
                        value = value + " " + item["title"];
                    }
                    value = value + " 【" + json["mapper"][item["event_type"]] + "】";
                    var content = $("#sec-type-div-wrapper").clone().removeAttr("id");
                    $(".safety-type-href", content).css("cursor", "default");
                    $(".sec-info-name", content).html(value);
                    content.show().appendTo(secWrapper);
                });
            });
        },
        init_safety:function(){
            var w = this;
            $.post(__WEBROOT__ + "/Home/HomePage/safeinfo_list").success(function(json){
                var safetyWrapper = $(".safety-latest-wrapper");
                $.each(json["data"], function(point, item){
                    var value = "";
                    if(item["create_time"]){
                        value = "[" + $.trim(item["create_time"].substr(0, 10)) + "]";
                    }
                    if(item["title"]){
                        if(item["title"].length > 20){
                            item["title"] = item["title"].substr(0, 20) + "...";
                        }
                        value = value + " " + item["title"];
                    }
                    var type = "";
                    $.each(json["mapper"], function(p, v){
                        if(v["_id"] == item["safety_type_id"]){
                            type = v["name"];
                        }
                    });
                    value = value + " 【" + type + "】";
                    var content = $("#sec-type-div-wrapper").clone().removeAttr("id");
                    $(".safety-type-href", content).attr("href", __WEBROOT__ + "/Home/SafetyInfo/show?_id=" + item["_id"]);
                    $(".sec-info-name", content).html(value);
                    content.show().appendTo(safetyWrapper);
                });
            });
        }
    }

    var init_func = {

    }

    var init = function(){
        var w = this;
        w.init_view.init_component.call(w);
        w.init_view.init_echart.call(w, function(){
            w.init_data.init_bar.call(w);
            w.init_data.init_pie.call(w);
            w.init_data.init_gauge.call(w);
            w.init_data.init_line.call(w);
        });
        w.init_data.init_event.call(w);
        w.init_data.init_safety.call(w);
        w.init_data.init.call(w);
        $(".safety-list-tag").attr("href", __WEBROOT__ + "/Home/SafetyInfo/index");
    }

    $(document).ready(function(){
        var homePage = new HomePage();
        homePage.init.call(homePage);
    });

})();