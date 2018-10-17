/**
 *@name
 *@author Sean.xiang
 *@date 2015/7/2
 *@example 安全事件2.0页面js
 */

    var Security = {
        init: function(){
            var w = this;

            flag = true;

            w.initHtml();
            w.initEvent();
            $(window).resize(function(){
                w.initHtml();
            });
            $('.fancybox').fancybox();
        },
        initHtml: function(){
            var w = this;
            var height= $(window).height();
            $('#map').height(height*0.6);
            $('#gauge').height(height*0.3);
            $('#bar').height(height*0.35);
            $('#pie').height(height*0.3);

            w.initDraw();
        },
        initEvent: function(){
            var w = this;
        },
        initDraw: function(){
            var w = this;

            //w.initOption();

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
                    var chartMap = ec.init(document.getElementById('map'));
                    var chartGauge = ec.init(document.getElementById('gauge'));
                    var chartBar = ec.init(document.getElementById('bar'));
                    var chartPie = ec.init(document.getElementById('pie'));
                    chartMap.showLoading();
                    chartBar.showLoading();
                    chartGauge.showLoading();
                    chartPie.showLoading();

                    //显示地图数据
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getSecurityEventMapdata', null).success(function(json) {
                        var option = _init_data.mapOption(json);
                        chartMap.setOption(option);
                        chartMap.hideLoading();
                    });

                    //初始化通报记录
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getReportList', null).success(function(json) {
                        var reportList = json.data;
                        var htmlStr = "<table class='u-gd-list j-table'><tbody>";
                        if(reportList.length > 0){
                            for(var i = 0; i < reportList.length; i++){
                                htmlStr += "<tr><td>" + reportList[i].report_domain +"</td>" +
                                "<td>" + reportList[i].report_name +"</td><td>" +
                                reportList[i].report_type +"</td><td>" + reportList[i].report_state_desc +"</td></tr>";
                            }
                        } else {
                            htmlStr += "<tr><td>...暂无记录...</td></tr>";
                        }
                        htmlStr += "</tbody></table>";
                        $("#gridList").html(htmlStr);
                        w.scroll();
                    });

                    //显示安全事件图片
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getEventPics', null).success(function(json) {
                        //显示滚动图片\
                        var photoList = json.data;
                        var htmlPhoto = "";
                        if(photoList.length > 0){
                            for(var i = 0; i < photoList.length; i++){
                                //alert(json.msg + "/" + photoList[i].photo_path);
                                if( photoList[i].event_snapshot){
                                    //alert(json.msg + "/" + photoList[i].photo_path);
                                    htmlPhoto += "<div class='swiper-slide'>" +
                                    "<a class='fancybox' href='"+ json.msg + "/upload/" + photoList[i].event_snapshot + "' data-fancybox-group='gallery' ><img src='"+ json.msg + "/upload/" + photoList[i].event_snapshot + "' ></a>"+
                                    "<div class='info'>" +
                                    "<p class='title'>" + photoList[i].web_title + "</p>" +
                                    "<p class='domain'>" + photoList[i].web_domain + "</p>" +
                                    "</div></div>";

                                }
                            }
                        }
                        $("#showphoto_id").html(htmlPhoto);
                        swiper.init();
                    });

                    //显示处理率
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getReportRate', null).success(function(json) {
                        if(json.data){
                            chartGauge.setOption(_init_data.gaugeOption(json.data * 1));
                            chartGauge.hideLoading();
                        } else {
                            chartGauge.setOption(_init_data.gaugeOption(0));
                            chartGauge.hideLoading();
                        }
                    });

                    //显示饼状图
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getSecurityEventTypes', null).success(function(json) {
                        var pieList = json.data;
                        if(pieList.length > 0){
                            chartPie.setOption(_init_data.pieOption(pieList));
                            chartPie.hideLoading();
                        }
                    });

                    //显示安全事件总数
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getAllNum', null).success(function(json) {
                        var num = w.numS(json.data,0);
                        $('#allNum_id').text(num);
                    });

                    //显示top5柱状图
                    $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getProvinceEventNumTop5', null).success(function(json) {
                        var top5List = json.data;
                        chartBar.setOption(_init_data.barOption(top5List));
                        chartBar.hideLoading();
                    });

                }
            );

        },
        scroll: function(){
            var w = this;
            w.y = 0;
            w.el = $('#grid');
            w.rollEl = $('#gridRoll');
            w.innerEl = $('#gridList');
            w.waitEl = w.innerEl.clone(true).removeAttr('id');
            w.rollEl.append(w.waitEl);

            d3.timer(function(){
                w.y = w.y - 0.3;
                w.innerEl.css({
                    top: w.y
                });
                w.waitEl.css({
                    top: w.y + w.innerEl.height()
                });

                if(w.y * -1 > w.innerEl.height()){
                    w.y = 0;
                    var tmp = w.innerEl;

                    w.innerEl = w.waitEl;
                    w.waitEl = tmp;
                }
            });
        },
        numS : function(s, n){
            //数字三位用逗号隔开
            n = n > 0 && n <= 20 ? n : 2;
            s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
            var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
            t = "";
            for (var i = 0; i < l.length; i++) {
                t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
            }
            return t.split("").reverse().join("");

        },
        initArray : function(){
            var timeArray = new Array(12);
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
                timeArray[11 -i] = new_year + "-" + new_month;
            }
            return timeArray;
        },
        resize: function(){
            var w = this;
            $(window).resize(function(){
                w.init();
            });
        }
    };


    var _init_data = {
        mapOption: function(json){
            var option = {
                title : {
                    text: '安全事件区域分布',
                    //subtext: '纯属虚构',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        color: '#fff',
                        fontSize: 20,
                        fontWeight: 'bolder',
                        fontFamily: 'Arial, Verdana, sans-serif'
                    }
                },
                tooltip : {
                    trigger: 'item'
                },
                dataRange: {
                    show: false,
                    min: 0,
                    max : 5,
                    splitNumber:0,
                    padding: 1,
                    text:['高','低'],  // 文本，默认为数值文本
                    calculable : true,
                    x: 60,
                    y: 360,
                    color: ['red','yellow'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                toolbox: {
                    show: false,
                    orient : 'vertical',
                    x: 'right',
                    y: 'center',
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                roamController: {
                    show: false,
                    x: 'right',
                    mapTypeControl: {
                        'china': true
                    }
                },
                series : [
                    {
                        name: '安全事件数',
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data: json.data[0]
                    }
                ]
            };
            return option;
        },
        gaugeOption: function(num){
            var option = {
                series : [
                    {
                        name:'业务指标',
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
                        data:[{value: num, name: '通报率'}]
                    }
                ]
            };
            return option;
        },
        barOption : function(json){
            var option = {
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
                    data:[],
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
            };
            var arrayNum = new Array();
            for ( var i = json.length - 1; i>=0; --i ){
                var province = json[i].province;
                if(province.indexOf("特别行政区") != -1){
                    province = province.substr(0,2);
                }
                if(province == ''){
                    province = "其他";
                }
                option.yAxis[0].data.push(province);
                arrayNum[4 - i] = json[i].province_num * 1;
            }

            option.legend.data.push('安全事件');
            option.series.push({
                name:'安全事件',
                type:'bar',
                stack:'总量',
                itemStyle : { normal: {label : {show: true, position: 'right', color:"white"}}},
                data:arrayNum
            });


            return option;
        },
        pieOption :function(json){
            var option ={
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient : 'vertical',
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
                        radius : '55%',
                        data:[]
                    }
                ]
            };
            for ( var i = json.length - 1; i>=0; --i ){
                option.legend.data.push(json[i].event_type_cn);
                var oneObj = {value:json[i].event_type_count, name:json[i].event_type_cn};
                option.series[0].data.push(oneObj);
            }
            return option;
        },
        lineOption : function(json){
            var timeArray = _init_.initArray();
            var dataArray = Array(12);
            dataArray = [1 * json.data.line11,1 * json.data.line10,1 * json.data.line9,
                1 * json.data.line8,1 * json.data.line7,1 * json.data.line6,
                1 * json.data.line5,1 * json.data.line4,1 * json.data.line3,
                1 * json.data.line2,1 * json.data.line1,1 * json.data.line0]
            var option = {
                color: ['#35FF33'],
                tooltip : {
                    trigger: 'axis'
                },
                grid:{
                    borderWidth : 0
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisTick : {    // 轴标记
                            show:true
                        },
                        axisLine : {    // 轴线
                            show: true
                        },
                        axisLabel : {
                            show:true,
                            textStyle: {
                                color: '#fff'
                            },
                            formatter : function(s) {
                                return s.slice(0, 7);
                            }
                        },
                        splitLine : {
                            show: false
                        },
                        splitArea : {
                            show: false
                        },
                        data : timeArray
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisTick : {    // 轴标记
                            show:false
                        },
                        axisLine : {    // 轴线
                            show: true
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
                series : [
                    {
                        name:'安全事件',
                        type:'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}',
                                    textStyle: { //text 样式
                                        fontSize: 8,
                                        color: '#35FF33'
                                    }
                                }
                            }
                        },
                        data:dataArray
                    }
                ]
            };
            return option;
        }
    };

    var swiper = {
        init: function(){
            var mySwiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 7,
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                preloadImages:false,
                updateOnImagesReady : true,
                spaceBetween: 5,
                //effect : 'fade',
                //effect : 'coverflow',
                centeredSlides: false,
                autoplay: 2500,
                autoplayDisableOnInteraction: false
            });
            $('.swiper-container').hover(function(){
                mySwiper.stopAutoplay();
            },function(){
                mySwiper.startAutoplay();
            });
        }
    };

    $(function(){
        Security.init();
    });

///**
// *@name
// *@author Sean.xiang
// *@date 2015/7/2
// *@version
// *@example 安全事件2.0页面js
// */
//
//var Security = {
//    init: function(){
//        var w = this;
//
//        flag = true;
//
//        w.initHtml();
//        w.initEvent();
//        $(window).resize(function(){
//            w.initHtml();
//        });
//
//
//
//    },
//    initHtml: function(){
//        var w = this;
//        var height= $(window).height();
//
//        $('#map').height(height*0.6);
//        $('#gauge').height(height*0.3);
//        $('#bar').height(height*0.35);
//        $('#pie').height(height*0.3);
//
//        w.initDraw();
//    },
//    initEvent: function(){
//        var w = this;
//    },
//
//
//    initDraw: function(){
//        var w = this;
//
//        //w.initOption();
//
//        require.config({
//            paths: {
//                echarts: __ECHART__
//            }
//        });
//        require(
//            [
//                'echarts',
//                'echarts/chart/map',
//                'echarts/chart/bar',
//                'echarts/chart/line',
//                'echarts/chart/pie',
//                'echarts/chart/gauge'
//            ],
//            function (ec) {
//                var chartMap = ec.init(document.getElementById('map'));
//                var chartGauge = ec.init(document.getElementById('gauge'));
//                var chartBar = ec.init(document.getElementById('bar'));
//                var chartPie = ec.init(document.getElementById('pie'));
//                chartMap.showLoading();
//                chartBar.showLoading();
//                chartGauge.showLoading();
//                chartPie.showLoading();
//                //获取数据
//                $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getSecurityEventValue', null).success(function(json){
//
//
//                    //初始化通报记录
//                    var reportList = json.data.report;
//                    var htmlStr = "<table class='u-gd-list j-table'><tbody>";
//                    if(reportList.length > 0){
//                        for(var i = 0; i < reportList.length; i++){
//
//                            htmlStr += "<tr><td>" + json.data.report[i].report_domain +"</td>" +
//                            "<td>" + json.data.report[i].report_name +"</td><td>" +
//                            json.data.report[i].report_type +"</td><td>" + json.data.report[i].report_state_desc +"</td></tr>";
//
//                        }
//                    } else {
//                        htmlStr += "<tr><td>...暂无记录...</td></tr>";
//                    }
//                    htmlStr += "</tbody></table>";
//                    // 显示通报记录信息
//                    $("#gridList").html(htmlStr);
//
//                    w.scroll();
//                    //显示安全事件总数
//                    var num = w.numS(json.data.allNum,0);
//                    $('#allNum_id').text(num);
//
//
//                    //显示处理率
//                    if(json.data.dealRate){
//                        chartGauge.setOption(_init_data.gaugeOption(json.data.dealRate * 1));
//                        chartGauge.hideLoading();
//                    } else {
//                        chartGauge.setOption(_init_data.gaugeOption(0));
//                        chartGauge.hideLoading();
//                    }
//
//                    //显示饼状图
//                    var pieList = json.data.pie;
//                    if(pieList.length > 0){
//                        chartPie.setOption(_init_data.pieOption(json.data.pie));
//                        chartPie.hideLoading();
//                    }
//
//                    //显示top5柱状图
//                    var top5List = json.data.top5;
//                    chartBar.setOption(_init_data.barOption(top5List));
//                    chartBar.hideLoading();
//
//                    //显示滚动图片\
//                    var photoList = json.data.photo;
//                    var htmlPhoto = "";
//                    if(photoList.length > 0){
//                        for(var i = 0; i < photoList.length; i++){
//                            //alert(json.msg + "/" + photoList[i].photo_path);
//                            htmlPhoto += "<div class='swiper-slide'>" +
//                            "<img src='"+ json.msg + "/upload/" + photoList[i].photo_path + "' alt='...'>" +
//                                //"<img src='https://www.baidu.com/img/bd_logo1.png' alt='...'>" +
//                            "<div class='info'>" +
//                            "<p class='title'>" + photoList[i].photo_title + "</p>" +
//                            "<p class='domain'>" + photoList[i].photo_domain + "</p>" +
//                            "</div></div>";
//                        }
//                    }
//
//                    $("#showphoto_id").html(htmlPhoto);
//                    swiper.init();
//                    flag = false;
//                });
//
//                //显示地图数据
//                $.getJSON(__ROOT__+'/ScreenCenter/SecurityEvent/getSecurityEventMapdata', null).success(function(json) {
//                    var option = _init_data.mapOption(json.data);
//                    chartMap.setOption(option);
//                    chartMap.hideLoading();
//
//                });
//            }
//        );
//
//    },
//
//    scroll: function(){
//
//        var w = this;
//
//        w.y = 0;
//
//        w.el = $('#grid');
//
//        w.rollEl = $('#gridRoll');
//        w.innerEl = $('#gridList');
//        w.waitEl = w.innerEl.clone(true).removeAttr('id');
//        w.rollEl.append(w.waitEl);
//
//        d3.timer(function(){
//            w.y = w.y - 0.3;
//            w.innerEl.css({
//                top: w.y
//            });
//            w.waitEl.css({
//                top: w.y + w.innerEl.height()
//            });
//
//            if(w.y * -1 > w.innerEl.height()){
//                w.y = 0;
//                var tmp = w.innerEl;
//
//                w.innerEl = w.waitEl;
//                w.waitEl = tmp;
//            }
//        });
//
//
//
//    },
//    numS : function(s, n){
//        //数字三位用逗号隔开
//        n = n > 0 && n <= 20 ? n : 2;
//        s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
//        var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1];
//        t = "";
//        for (var i = 0; i < l.length; i++) {
//            t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
//        }
//        //return t.split("").reverse().join("")+ "." + r;
//        return t.split("").reverse().join("");
//
//    },
//    initArray : function(){
//        var timeArray = new Array(12);
//        //初始化时间数组
//        var myDate = new Date();
//        var fullYear = myDate.getFullYear();
//        var month = myDate.getMonth() + 1;
//        var new_year = fullYear;
//        var new_month = month;
//        for(var i = 0; i < 12; i++){
//            new_month = month - i;
//            if(new_month <= 0){
//                new_month = 12 + new_month;
//                new_year = fullYear -1;
//            }
//            if(new_month < 10){
//                new_month = "0" + new_month;
//            }
//            timeArray[11 -i] = new_year + "-" + new_month;
//        }
//        return timeArray;
//    },
//    resize: function(){
//        var w = this;
//
//        $(window).resize(function(){
//            w.init();
//        });
//
//    }
//
//
//};
//
//
//var _init_data = {
//    // 这里添加map数据
//    //mapOption : function(json){
//    //    var timeArray = Security.initArray();
//    //    var option = {
//    //        timeline:{
//    //            data:timeArray,
//    //            symbol: 'emptyCircle',
//    //            symbolSize: 4,
//    //            padding:[0,0,10,0],
//    //            x:0,
//    //            x2: 0,
//    //            y2: -10,
//    //            label : {
//    //                formatter : function(s) {
//    //                    return s.slice(2, 7);
//    //                },
//    //                textStyle: {
//    //                    color: '#fff',
//    //                    fontSize: 12
//    //                }
//    //            },
//    //            lineStyle: {
//    //                width: 1
//    //            },
//    //            checkpointStyle: {
//    //                symbol : 'circle',
//    //                symbolSize : '4',
//    //                color : 'auto',
//    //                borderColor : 'auto',
//    //                borderWidth : 'auto',
//    //                label: {
//    //                    show: false,
//    //                    textStyle: {
//    //                        color: 'auto'
//    //                    }
//    //                }
//    //            },
//    //            controlStyle: {
//    //                itemSize: 15,
//    //                itemGap: 2,
//    //                normal : {
//    //                    color : '#fff'
//    //                },
//    //                emphasis : {
//    //                    color : '#1e90ff'
//    //                }
//    //            }      ,
//    //            currentIndex : 9,
//    //            autoPlay : false,
//    //            playInterval : 2000
//    //        },
//    //        options:[]
//    //    };
//    //    for (var i = 0; i < timeArray.length; i++) {
//    //        option.options.push( {
//    //            title : {
//    //                text:timeArray[i] + '事件区域分布',
//    //                x: 'center',
//    //                y: 'top',
//    //                textStyle: {
//    //                    color: '#fff',
//    //                    fontSize: 20,
//    //                    fontWeight: 'bolder',
//    //                    fontFamily: 'Arial, Verdana, sans-serif'
//    //                }
//    //                // 'subtext':'数据来自数据中心'
//    //            },
//    //            tooltip : {'trigger':'item'},
//    //            dataRange: {
//    //                show: false,
//    //                min: 0,
//    //                max : 5,
//    //                splitNumber:0,
//    //                padding: 1,
//    //                text:['高','低'],  // 文本，默认为数值文本
//    //                calculable : true,
//    //                x: 60,
//    //                y: 360,
//    //                color: ['red','yellow'],
//    //                textStyle: {
//    //                    color: '#fff'
//    //                }
//    //            },
//    //            series : [
//    //                {
//    //                    itemStyle:{
//    //                        normal:{
//    //                            label:{
//    //                               /* formatter: function(a,b){
//    //
//    //                                },*/
//    //                                show:true
//    //                            },
//    //                            areaStyle:{color:'white'}   //设置地图背景色的颜色设置
//    //                            //color:'rgba(255,0,255,0.8)' //刚才说的图例颜色设置
//    //                        },
//    //                        emphasis:{label:{show:true}}
//    //                    },
//    //                    'name':'事件数',
//    //                    'type':'map',
//    //                    mapType: 'china',
//    //                    'data': json.data[timeArray.length-i-1]
//    //                }
//    //            ]
//    //        })
//    //
//    //
//    //
//    //    }
//    //
//    //    return option;
//    //},
//    mapOption : function(json){
//        var timeArray = Security.initArray();
//        var option = {
//            title: {
//                text : '',
//                subtext : ''
//            },
//            tooltip : {
//                trigger: 'item',
//                formatter: '点击进入{b}'
//            },
//            zlevel: 2,
//
//            dataRange: {
//                show : false,
//                min: 0,
//                max: 20000,
//
//                //color : ['#f90303', '#f95403', '#f97103', '#f98e03', '#f9df03'],
//                color : ['#ff0000', '#ff3300', '#ff6600', '#ff9900', '#ffcc00'],
//                text:['高','低'],           // 文本，默认为数值文本
//                calculable : true
//            },
//            series : [
//                {
//                    zlevel: 6,
//                    roam: false,
//                    name: '总量',
//                    type: 'map',
//                    mapType: 'china',
//                    hoverable: false,
//                    selectedMode : 'single',
//                    itemStyle:{
//                        normal:{
//                            label:{show:true},
//                            //borderColor:'rgba(100,149,237,1)',
//                            borderColor:'white',
//                            borderWidth:0.5
//                        },
//                        emphasis:{label:{show:true}}
//                    },
//                    data:[]
//
//                }
//
//            ]
//        };
//        $.each(json, function(point, item){
//            option.series[0].data.push({
//                name:item['province'],
//                value:item['count']
//            });
//        });
//        return option;
//    },
//    gaugeOption: function(num){
//        var option = {
//            series : [
//                {
//                    name:'业务指标',
//                    type:'gauge',
//                    radius : ['40%', '65%'],
//                    splitNumber: 10,       // 分割段数，默认为5
//                    axisLine: {            // 坐标轴线
//                        lineStyle: {       // 属性lineStyle控制线条样式
//                            color: [[0.2, '#ff4500'],[0.8, '#48b'],[1, '#228b22']],
//                            width: 8
//                        }
//                    },
//                    axisTick: {            // 坐标轴小标记
//                        splitNumber: 10,   // 每份split细分多少段
//                        length :12,        // 属性length控制线长
//                        lineStyle: {       // 属性lineStyle控制线条样式
//                            color: 'auto'
//                        }
//                    },
//                    axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
//                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//                            color: 'auto'
//                        }
//                    },
//                    splitLine: {           // 分隔线
//                        show: true,        // 默认显示，属性show控制显示与否
//                        length :15,         // 属性length控制线长
//                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
//                            color: 'auto'
//                        }
//                    },
//                    pointer : {
//                        length: '90%',
//                        width : 5
//                    },
//                    title : {
//                        show : true,
//                        offsetCenter: [0, '24%'],       // x, y，单位px
//                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//                            fontWeight: 'bolder',
//                            color: '#fff'
//                        }
//                    },
//                    detail : {
//                        formatter:'{value}%',
//                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
//                            color: 'auto',
//                            fontWeight: 'bolder'
//                        }
//                    },
//                    data:[{value: num, name: '通报率'}]
//                }
//            ]
//        };
//        return option;
//    },
//    barOption : function(json){
//        var option = {
//            color:["orange"],
//            dataRange: {
//                show : false,
//                min: 0,
//                max: 100,
//                color: ['orange'],
//                text:['高','低'],           // 文本，默认为数值文本
//                calculable : true
//            },
//            tooltip : {
//                show: true,
//                trigger: 'axis',
//                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
//                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
//                }
//            },
//            legend: {
//                show: false,
//                data:[],
//                textStyle : {
//                    color: 'white'
//                }
//            },
//            calculable : false,
//            grid:{
//                borderWidth : 0
//            },
//            xAxis : [
//                {
//                    type : 'value',
//                    axisTick : {    // 轴标记
//                        show:false
//                    },
//                    axisLine : {    // 轴线
//                        show: false
//                    },
//                    axisLabel : {
//                        show:false
//
//                    },
//                    splitLine : {
//                        show:false
//                    },
//                    splitArea : {
//                        show: false
//                    }
//                }
//            ],
//            yAxis : [
//                {
//                    type : 'category',
//                    data : [],
//                    axisTick : {    // 轴标记
//                        show:false
//                    },
//                    axisLine : {    // 轴线
//                        show: false
//                    },
//                    axisLabel : {
//                        show:true,
//                        textStyle:{
//                            color: 'white',
//                            fontSize: 14
//
//                        }
//                    },
//                    splitLine : {
//                        show:false
//                    },
//                    splitArea : {
//                        show: false
//                    }
//                }
//            ],
//            series : [
//
//            ]
//        };
//        var arrayNum = new Array();
//        //$.each(json, function(point, item){
//        //option.yAxis[0].data.push(item.province);
//        //arrayNum[point] = item.province_num * 1;
//        //});
//        for ( var i = json.length - 1; i>=0; --i ){
//            var province = json[i].province;
//            if(province.indexOf("特别行政区") != -1){
//                province = province.substr(0,2);
//            }
//            if(province == ''){
//                province = "其他";
//            }
//            option.yAxis[0].data.push(province);
//            arrayNum[4 - i] = json[i].province_num * 1;
//        }
//
//        option.legend.data.push('安全事件');
//        option.series.push({
//            name:'安全事件',
//            type:'bar',
//            stack:'总量',
//            itemStyle : { normal: {label : {show: true, position: 'right', color:"white"}}},
//            data:arrayNum
//        });
//
//
//        return option;
//    },
//    pieOption :function(json){
//        var option ={
//            //color: [ '#9900aa', '#77d6ff', '#ffd677', '#dd2c00', '#ff00cc'],
//
//            tooltip : {
//                trigger: 'item',
//                formatter: "{a} <br/>{b} : {c} ({d}%)"
//            },
//            legend: {
//                orient : 'vertical',
//                x : 20,
//                y: 20,
//                textStyle: {
//                    color: '#6596ED',  //数据对应的事件名称颜色
//                    fontSize: 14,
//                    fontWeight: 'bold'
//                },
//                padding: [0, 0, 0,0],
//                data:[json[0].event_type_desc,json[1].event_type_desc,json[2].event_type_desc,json[3].event_type_desc]
//
//            },
//            series : [
//                {
//                    name:'攻击类型',
//                    type:'pie',
//                    radius : '55%',
//                    /* itemStyle : {
//                     normal : {
//                     color: function(params) {
//                     var colorList = [
//                     '#d56385', '#ed7600', '#2f84f9','#32cd33'
//                     ];
//                     return colorList[params.dataIndex]
//                     },
//                     label : {
//                     show : false
//                     },
//                     labelLine : {
//                     show : false
//                     }
//                     },
//                     emphasis : {
//                     label : {
//                     show : true,
//                     position : 'center',
//                     textStyle : {
//                     fontSize : '30',
//                     fontWeight : 'bold'
//                     }
//                     }
//                     }
//                     },*/
//                    data:[
//                        {value:json[0].event_type_num, name:json[0].event_type_desc},
//                        {value:json[1].event_type_num, name:json[1].event_type_desc},
//                        {value:json[2].event_type_num, name:json[2].event_type_desc},
//                        {value:json[3].event_type_num, name:json[3].event_type_desc}
//                    ]
//                }
//            ]
//        };
//        return option;
//    },
//    lineOption : function(json){
//        var timeArray = _init_.initArray();
//        var dataArray = Array(12);
//        dataArray = [1 * json.data.line11,1 * json.data.line10,1 * json.data.line9,
//            1 * json.data.line8,1 * json.data.line7,1 * json.data.line6,
//            1 * json.data.line5,1 * json.data.line4,1 * json.data.line3,
//            1 * json.data.line2,1 * json.data.line1,1 * json.data.line0]
//        var option = {
//            color: ['#35FF33'],
//            tooltip : {
//                trigger: 'axis'
//            },
//            grid:{
//                borderWidth : 0
//            },
//            calculable : true,
//            xAxis : [
//                {
//                    type : 'category',
//                    boundaryGap : false,
//                    axisTick : {    // 轴标记
//                        show:true
//                    },
//                    axisLine : {    // 轴线
//                        show: true
//
//                    },
//                    axisLabel : {
//                        show:true,
//                        textStyle: {
//                            color: '#fff'
//                        },
//                        formatter : function(s) {
//                            return s.slice(0, 7);
//                        }
//
//                    },
//                    splitLine : {
//                        show: false
//                    },
//                    splitArea : {
//                        show: false
//                    },
//                    data : timeArray
//                }
//            ],
//            yAxis : [
//                {
//                    type : 'value',
//                    axisTick : {    // 轴标记
//                        show:false
//                    },
//                    axisLine : {    // 轴线
//                        show: true
//                    },
//                    axisLabel : {
//                        show:false
//                    },
//                    splitLine : {
//                        show:false
//                    },
//                    splitArea : {
//                        show: false
//                    }
//                }
//            ],
//            series : [
//
//                {
//                    name:'安全事件',
//                    type:'line',
//                    itemStyle: {
//                        normal: {
//
//                            label: {
//                                show: true,
//                                position: 'top',
//                                formatter: '{c}',
//                                textStyle: { //text 样式
//                                    fontSize: 8,
//                                    color: '#35FF33'
//                                }
//                            }
//                        }
//                    },
//                    data:dataArray
//                }
//            ]
//        };
//        return option;
//
//    }
//};
//
//
//var swiper = {
//    init: function(){
//        var mySwiper = new Swiper('.swiper-container', {
//            loop: true,
//            slidesPerView: 7,
//            pagination: '.swiper-pagination',
//            nextButton: '.swiper-button-next',
//            prevButton: '.swiper-button-prev',
//            paginationClickable: true,
//            preloadImages:false,
//            updateOnImagesReady : true,
//            spaceBetween: 5,
//            //effect : 'fade',
//            //effect : 'coverflow',
//            centeredSlides: false,
//            autoplay: 2500,
//            autoplayDisableOnInteraction: false
//        });
//        $('.swiper-container').hover(function(){
//            mySwiper.stopAutoplay();
//        },function(){
//            mySwiper.startAutoplay();
//        });
//    }
//};
//
//$(function(){
//    Security.init();
//});





