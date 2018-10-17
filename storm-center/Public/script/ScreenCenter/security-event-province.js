/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/25
 *@example
 */


var GovWeb = {


   init: function () {
        var w = this;

        $("#title-wraper1").append("<h1>"+$("#select-province").val()+"省政务网站安全概况</h1>");

        w.initHtml();
        w.initEvent();
        $(window).resize(function(){
            w.initHtml();
        });
       $('.fancybox').fancybox();

    },
    initHtml: function () {

        var w = this;


        var height = $(window).height();

        $('#map').height(height * .35);
        $('#govWeb').height(height * .15);
        $('#subDomain').height(height * .15);
        $('#voidDomain').height(height * .15);
        $('#highRisk').height(height * .15);
        $('#inAccess').height(height * .15);
        $('#securityEvent').height(height * .15);
        $('#domain').height(height * .35);
        $('#event').height(height * .3);


        w.draw();
        w.scrollHtml();
        w.initBigDomainTbody();
        w.highRiskWebDetail();
        w.actualTimeSafeEvent();
    },

    initEvent: function () {
        var w = this;

        w.scroll("highRisk-list");
        w.scroll("eventTime-list");

    },
    // 省份网站大文件
    initBigDomainTbody : function(){
        $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceBigFile', {'province':$("#select-province").val(), 'limit':10}).success(function(json){
            var imgPath = json['imgPath'];
            if(json['code']){
                $(".big-domain-tbody").html('');
                $.each(json['value'], function(point, item){
                    var name = item['web_name'] ? item['web_name'] : item['domain'];
                    if(name.length>=12){
                        name=name.substring(0,12)+"...";
                    }
                    var size = (item['page_len'] / 1024 / 1024).toFixed(2);
                    var size0 = (json['value'][0]['page_len']/ 1024 / 1024).toFixed(2);
                    var width = (size/size0)*120;
                    var tr = $("<tr></tr>");
                    tr.append("<td style='width: 60%'>" + name + "</td>").append("<td style='width: 40%'><span class='bg-orange hot' style='width: "+ width +"px;color:red;background-color:#EDB24C !important;text-align:left;'>" + size + "M</span></td>");
                    $(".big-domain-tbody").append(tr);
                });
            }
        });
    },

    // 省份高危险网站明细
    highRiskWebDetail:function(){
        $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceHighVulsInfo',{'province':$("#select-province").val(),'limit':18}).success(function(json){
            if(json['code']){
                $(".province-high-rick-tbody").html('');
                $.each(json['value'],function(point,item){
                    var title=item['title']?item['title']:item['domain'];
                    title = title.length <= 20 ? title : title.substring(0, 20) + "...";
                    var tr=$("<tr></tr>");
                    tr.append("<td><div style='width:50px;'><span class='red'>高危</span></div></td>").append("<td>"+title+"</td>");
                    $(".province-high-rick-tbody").append(tr);
                });
            }
        });
    },
    // 省份最新安全事件列表
    actualTimeSafeEvent:function(){
        $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceSecurityList',{'province':$("#select-province").val(),'limit':15}).success(function(json){
            if(json['code']){
                $(".actualTime-SafeEvent-table").html('');
                $.each(json['value'],function(point,item){
                    var happen_timefull=item['happen_time'];
                    var happen_time=happen_timefull.substring(happen_timefull.indexOf("-")+1,happen_timefull.lastIndexOf(":"));
                    var event_type_cn=item['event_type_cn'];
                    var web_title=item['web_title'].length<=11?item['web_title']:item['web_title'].substring(0,11)+"...";
                    if(!web_title){
                        web_title=item['web_url'];
                    }

                    var tr=$("<tr></tr>");
                    tr.append("<td>"+happen_time+"</td>").append("<td class='webtitle' width='190px'>"+web_title+"</td>").append("<td><scan class='red'>"+event_type_cn+"</scan></td>");
                    $(".actualTime-SafeEvent-table").append(tr);
                });
            }

        });

    },

    draw: function () {


        var w = this;

        //w.data = o;

        w.initOption();

        require.config({
            paths: {
                echarts: __ECHART__
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/map',
                'echarts/chart/pie',
                'echarts/chart/bar',
                'echarts/chart/gauge',
                'echarts/chart/line',
                'echarts/chart/wordCloud'
            ],
            function (ec) {
                w.map = ec.init(document.getElementById('map'));
                w.govWeb = ec.init(document.getElementById('govWeb'));
                w.subDomain = ec.init(document.getElementById('subDomain'));
                w.voidDomain = ec.init(document.getElementById('voidDomain'));
                w.highRisk = ec.init(document.getElementById('highRisk'));
                w.inAccess = ec.init(document.getElementById('inAccess'));
                w.securityEvent = ec.init(document.getElementById('securityEvent'));
                w.domain = ec.init(document.getElementById('domain'));
                w.event = ec.init(document.getElementById('event'));
                //环状图1  全国政务网站+全省政务网站
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceDomainTwoCount',{'domain0':'gov.cn'}).success(function(json1){
                    $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceDomainTwoCount',{'province':$("#select-province").val(),'domain0':'gov.cn'}).success(function(json2){
                        __data__.pie[0].value[0]=json1.value;
                        __data__.pie[0].value[1]=json2.value;
                        w.govWeb.setOption(w.pieOption(__data__.pie[0]));
                    });
                });
                //环状图2  全省二级域名+全省政务网站
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceDomainCount',{'province':$("#select-province").val(),'domain0':'gov.cn'}).success(function(json2){
                    var setInt2=setInterval(function(){
                        if (__data__.pie[0].value[1]) {
                            clearInterval(setInt2);
                            __data__.pie[1].value[0] = __data__.pie[0].value[1];
                            __data__.pie[1].value[1]=__data__.pie[0].value[1]-json2.value;
                            w.subDomain.setOption(w.pieOption(__data__.pie[1]));
                        }
                    },100);
                });

                //环状图3
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceMonitorCount',{'province':$("#select-province").val()}).success(function(json2){
                    var setInt3=setInterval(function(){
                        if(__data__.pie[0].value[1]){
                            clearInterval(setInt3);
                            __data__.pie[2].value[0]=__data__.pie[0].value[1];
                            __data__.pie[2].value[1]=json2.value;
                            w.voidDomain.setOption(w.pieOption(__data__.pie[2]));
                        }
                    },100);
                });

                //环状图4
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceHighVulsInfo',{'province':$("#select-province").val(),'limit':10}).success(function(json){
                    var setInt4=setInterval(function(){
                        if(__data__.pie[0].value[1]){
                            clearInterval(setInt4);
                            __data__.pie[3].value[0]=__data__.pie[0].value[1];
                            __data__.pie[3].value[1]=json.count;
                            w.highRisk.setOption(w.pieOption(__data__.pie[3]));
                        }
                    },100);

                });

                //环状图5
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceMonitorCount',{'province':$("#select-province").val(),'http_code':-2}).success(function(json2){
                    var setInt5=setInterval(function(){
                        if(__data__.pie[0].value[1]){
                            clearInterval(setInt5);
                            __data__.pie[4].value[0]=__data__.pie[0].value[1];
                            __data__.pie[4].value[1]=json2.value;
                            w.inAccess.setOption(w.pieOption(__data__.pie[4]));
                        }
                    },100);
                });
                //环状图6
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceSecurityGroup',{'province':$("#select-province").val()}).success(function(json){
                    var setInt6=setInterval(function(){
                        if(__data__.pie[0].value[1]){
                            clearInterval(setInt6);
                            __data__.pie[5].value[0]=__data__.pie[0].value[1];
                            var count=0;
                            $.each(json['value'],function(point,item){
                                count+=item['count'];
                            });
                            __data__.pie[5].value[1]=count;
                            w.securityEvent.setOption(w.pieOption(__data__.pie[5]));
                        }
                    },100);
                });


                //浙江地图（政务网站分布）、柱状图
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceDomainOneGroup',{'province':$("#select-province").val(),'domain0':'gov.cn'}).success(function(jsonOne){
                    $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceDomainTwoGroup',{'province':$("#select-province").val(),'domain0':'gov.cn'}).success(function(jsonTwo) {
                        w.domain.setOption(w.domainOption(jsonOne,jsonTwo));
                        var d=__data__.map();
                        d.data=jsonOne.value.sort(function(a,b){return a.count- b.count});
                        w.map.setOption(w.mapOption(d));
                    });
                });
                //w.domain.setOption(w.domainOption());
                //安全事件排行
                $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceSecurityGroup',{'province':$("#select-province").val()}).success(function(json){
                    w.event.setOption(w.eventOption(json));

                });


                //w.riskGrade.setOption(w.gaugeOption(__data__.riskGrade));


                //w.attack.setOption(w.lineOption(__data__.attack));
                //w.flow.setOption(w.lineOption(__data__.flow()));

                $("#tab .tab-pane:gt(0)").removeClass('active');




            }
        );
    },
    initOption: function () {
        var w = this;

        w.mapOption = function (json) {
            var option = {
                dataRange: {
                    show: false,
                    splitNumber: 0,
                    padding: 1,
                    text: ['高', '低'],  // 文本，默认为数值文本
                    min: 0,
                    max:json.data[json.data.length-1].count,
                    color:['orange','yellow'],
                    calculable: false
                },
                series: [
                    {
                        type: 'map',
                        mapType: json.mapType,
                        //roam: 'scale',
                        itemStyle: {
                            normal: {
                                label: {show: true},
                                borderColor: '#001320',
                                borderWidth: 0.5,
                                areaStyle: {
                                    color: '#06304e'
                                }
                            }
                        },

                        data:[]

                        //geoCoord: __GEO__.china_province

                    }

                ]
            };
            //json
            $.each(json['data'],function(point,item){
                option.series[0].data.push({
                    name:item['city']+"市",
                    value:item['count']
                });
            });

            return option;
        };
        w.pieOption = function(json){
            var option = {
                color : json.color,
                calculable : false,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        center: ['50%','50%'],
                        radius : ['70%', '90%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {
                                value: json.value[1],
                                name:'pie',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : json.name+'\n'+json.value[1],
                                            textStyle: {
                                                fontSize: 14,
                                                color: '#ddd'

                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }

                                }
                            },
                            {
                                value:json.value[0],
                                name:'pie2'
                            }
                        ]
                    }
                ]
            };
            //option.series[0].data[0].value = 0;
            //option.series[0].data[1].value = 1;
            return option;
        };

        w.domainOption =function (jsonOne,jsonTwo) {

            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['主域名','子域名'],
                    textStyle: {
                        color: '#ddd',
                        fontSize: 12
                    }
                },
                grid: {
                    y2:25,
                    borderWidth: 0
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        axisLabel: { //坐标轴文本
                            textStyle: {
                                color: '#ddd',
                                fontSize: 12
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: false
                        },
                        splitLine: { // 网格线
                            show: false
                        },
                        //数据修改1
                        data:[]

                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        name:'个',
                        axisLabel: { //坐标轴文本
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: false
                        },
                        splitLine: { // 网格线
                            show: false
                        }
                    }
                ],
                //数据修改2
                series : [

                    {
                        name: '主域名',
                        type: 'bar',
                        stack: 'name',
                        barMaxWidth: 40,
                        data: []
                    },

                    {
                        name:'子域名',
                        type:'bar',
                        stack: 'name',
                        barMaxWidth: 40,
                        data:[]
                    }
                ]
            };

            var valueOne = jsonOne['value'];
            var valueTwo = jsonTwo['value'];

            $.each(valueOne, function(point1, item1){
                var city = item1['city'];
                var count = item1['count'];
                if(city){
                    option.xAxis[0].data.push(city);
                    option.series[0].data.push(count);
                }

                $.each(valueTwo,function(point2,item2){
                    if(item2['city']==city){
                        option.series[1].data.push(item2['count']-count);
                    }
                });



            });



            return option;
        };
        //安全事件量排行（柱状图）
        w.eventOption = function (json) {
            var option = {
                tooltip : {
                    trigger: 'axis'
                },
                grid: {
                    x2:50,
                    y2:35,
                    borderWidth: 0
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        name: '件',
                        axisLabel: { //坐标轴文本
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: false
                        },
                        splitLine: { // 网格线
                            show: false
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        axisLabel: { //坐标轴文本
                            interval:0,
                            textStyle: {
                                color: '#fff',
                                fontSize: 12
                            }
                        },
                        axisLine: {// 坐标轴线
                            show: true
                        },
                        axisTick: {//坐标轴小标记
                            show: false
                        },
                        splitLine: { // 网格线
                            show: false
                        },
                        //数据修改3
                        data : []
                    }
                ],
                series : [
                    {
                        name:'2011年',
                        type:'bar',
                        barGap:'100%',
                        barMinHeight: 40,
                            data:[]
                    }
                ]
            };

            var value=json['value'];
            if(value.length>5){
                for(var i=5;i>=0;i--){
                    if(value[i].web_ip_city){
                        option.yAxis[0].data.push(value[i].web_ip_city);
                        option.series[0].data.push(value[i].count);
                    }
                }
            }else{
                for(var i=value.length-1;i>=0;i--){
                    option.yAxis[0].data.push(value[i].web_ip_city);
                    option.series[0].data.push(value[i].count);
                }
            }
            return option;
        };
    },
    //安全事件图片列表
    scrollHtml: function(){
        var w = this;
        //$.getJSON(__ROOT__+'/Home/InfoCenter/getSecurityEventValue', null)

        $.post(__ROOT__+'/ScreenCenter/ProvinceSecurityEvent/provinceSecurityPic',{'province':$("#select-province").val()}).success(function(json){
            //显示滚动图片\
            var photoList = json['value'];
            var htmlPhoto = "";
            var eventType="";
            var eventTypes = $("#eventType").val();
            eventTypes = decodeURIComponent(eventTypes);
            eventTypes = $.parseJSON(eventTypes);
            if(photoList.length > 0){
                for(var i = 0; i < photoList.length; i++){
                    for(var j=0;j< eventTypes.length;j++){
                        if(photoList[i].eventType==eventTypes[j].id){
                            eventType=eventTypes[j].event_type;
                            break;
                        }
                    }
                        var happen_time=photoList[i].happen_time;
                            //happen_time=happen_time.substring(0,10);
                        var photo_title = photoList[i].photo_title.length <= 10 ? photoList[i].photo_title : photoList[i].photo_title.substring(0, 10) + "...";
                        //alert(json.msg + "/" + photoList[i].photo_path);
                        htmlPhoto += "<div class='swiper-slide'>" +
                            "<div class='event-type'><span class='type' style='color:#F6ED2E;'>"+eventType+"</span></div>"+
                        "<a class='fancybox' href='" + json.imagePath + "/upload/" + photoList[i].photo_path + "' data-fancybox-group='gallery' ><img src='" + json.imagePath + "/upload/" + photoList[i].photo_path + "' ></a>"+
                        "<div class='info'>" +
                        "<p class='title'>" + photo_title + "</p>" +
                        "</div></div>";
                }
            }

            $("#showphoto_id").html(htmlPhoto);
            swiper.init();
        });
    },

    scroll: function(dom){

        var w = this;

        var y = 0;
        var innerEl = $('#'+dom);
        var rollEl = innerEl.parent();
        var waitEl = innerEl.clone(true).removeAttr('id');
        rollEl.append(waitEl);

        d3.timer(function(){
            y = y - 0.2;
            innerEl.css({
                top: y
            });
            waitEl.css({
                top: y + innerEl.height()
            });

            if(y * -1 > innerEl.height()){
                y = 0;
                var tmp = innerEl;

                innerEl = waitEl;
                waitEl = tmp;
            }
        });



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
var __data__ = {
    map: function(){
        var d = {
            mapType:$("#select-province").val(),
            data: [
                {name: '丽水市',value: 400},
                {name: '杭州市',value: 200}
            ]
        };

        return d;

    },
    pie:[
        {
            color: ['#d32a03','#ccc'],
            name: '政务网站',
            value:[]
        },
        {
            color: ['#5BB1EF','#ccc'],
            name: '二级域名',
            value:[]
        },
        {
            color: ['#E5CF0F','#ccc'],
            name: '无效域名',
            value: []
        },
        {
            color: ['#E5CF0F','#ccc'],
            name: '高危风险',
            value: []
        },
        {
            color: ['#D87B81','#ccc'],
            name: '异常访问',
            value: []
        },
        {
            color: ['#96716E','#ccc'],
            name: '安全事件',
            value: []
        }

    ]

};
$(function(){
    GovWeb.init();
});

