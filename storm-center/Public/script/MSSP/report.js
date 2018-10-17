/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/7
 *@example
 */
(function(){

    var value = $("#monitorValue").val();
    var o = {
        init: function(){
            var w = this;
            value = decodeURIComponent(value);
            value = $.parseJSON(value);
            w.prepare();
            w.initCommon();
            w.initSummary();
            w.initHtml();
            w.initEvent();
        },
        prepare:function(){
            var nodeValue = value['node'];
            $.each(nodeValue, function(point, item){
                $(".avail-nav-site-select").append("<option value='" + item['_id'] +"'>" + item['cn_name'] + "</option>");
                $(".fault-nav-node-select").append("<option value='" + item['_id'] +"'>" + item['cn_name'] + "</option>");
            });

            /**
             * 初始化页面顶部的时间select
             * @type {number}
             */
            var tmpId = -1;
            var date = new Date();
            for(var i = -1; tmpId > -8; tmpId--){
                $(".avail-date-select").append($('<option value="' + date.getLastDate(tmpId) + '">' + date.getLastDate(tmpId) + '</option>'));
            }
            $(".avail-date-select").val($('#current_time_id').val());
        },
        initCommon:function(){

            var siteDoc=value.siteDoc;
            var start= siteDoc['Registration+Time']||'';
            var end=siteDoc['Expiration+Time'];
            end&&(start=start+" 到 "+end);
            siteDoc['vailTime']=start;
            var infos=$(".infoValue",$(".common-info"));
            $.each(infos,function(i,info){
                $(info).text(siteDoc[$(info).attr("param-key")]);
            });
        },
        initSummary:function(){
            var dateDoc=value.dateDoc;
            var currentDateDoc=dateDoc[dateDoc.length-1];

            var monthDoc=value.monthDoc;
            var home_load_time = '--';
            value['resourceDoc']&&(home_load_time=Math.round(value.resourceDoc.max_load_time));


            var infos={
                day_error_time: currentDateDoc.offline.all ? Math.round(currentDateDoc.offline.all.disconnect_time/1000/60) : 0,
                month_error_time: Math.round(monthDoc.offline.all.disconnect_time / 1000 / 60),
                home_load_time: home_load_time,
                access_num:currentDateDoc.statistics.okNodeNum + "/" + currentDateDoc.statistics.nodeNum,
                max_connect_time:Math.round(currentDateDoc.statistics.maxConectTime),
                month_update_times:monthDoc.update_rate.update_count,
                last_update_time:monthDoc.update_rate.last_update_time||"未更新"
            }
            if(infos.home_load_time == '--'){
                infos['home_load_desc']="--";
            }else if(infos.home_load_time>5000){
                infos['home_load_desc']="低";
            }else if(infos.home_load_time>3000){
                infos['home_load_desc']="中";
            }else{
                infos['home_load_desc']="高";
            }
            var infoObjs=$(".infoValue",$(".summary"));
            $.each(infoObjs,function(i,obj){
                var key=$(obj).attr("param-key");
                $(obj).text(infos[key]);

            });

        },
        initEvent:function(){
            var w = this;
            $('.avail-nav-site-select').bind("change", function(){
                w.chartLine.setOption(w.chartLineOption(value));
            });

            $('.fault-nav-node-select').bind("change", function(){
                w.faultLine.setOption(w.faultLineOption(value));
            });

            $('.avail-date-select').bind("change", function(){
                var value = $(this).val();
                window.location.href = __ROOT__ + "/Service/Report/index?domain=" + $('#current_domain').val() + "&time=" + value;
            });

            /*页面滚动*/
            $(window).scroll( function() {
                var scrollValue=$(window).scrollTop();
                scrollValue > 100 ? $('.scroll').slideDown():$('.scroll').slideUp();
            });

            $('.scroll').click(function(){
                $("html,body").animate({scrollTop:0},200);
            });

            $(".domina-report-export").bind("click", function(){
                var href ="exportReport?domain=" + $("#current_domain").val() + "&time=" + $("#current_time_id").val();
                window.open(href);
            });
        },
        initHtml: function(){
            var w = this;
            var height= $(window).height();
            $('#mapChart').height(height*.7);
            $('#node').height(height* .35);
            $('#faultPie').height(height* .35);
            $('#faultBar').height(height* .35);
            $('#faultLine').height(height* .35);
            $('#chartLine').height(height* .35);
            $('#loadTime').height(height* .35);
            $('#loadFile').height(height* .35);
            $('#weekChart').height(height* .35);
            $('#dnsMap').height(height*.6);
            w.initDraw();


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
                    'echarts/chart/map',
                    'echarts/chart/bar',
                    'echarts/chart/line',
                    'echarts/chart/pie',
                    'echarts/chart/radar'
                ],
                function (ec) {
                    //w.weekChart = ec.init(document.getElementById('weekChart'));
                    w.mapChart= ec.init(document.getElementById('mapChart'));
                    w.node= ec.init(document.getElementById('node'));
                    w.faultPie= ec.init(document.getElementById('faultPie'));
                    w.faultBar= ec.init(document.getElementById('faultBar'));
                    w.faultLine= ec.init(document.getElementById('faultLine'));
                    w.chartLine= ec.init(document.getElementById('chartLine'));
                    w.loadTime= ec.init(document.getElementById('loadTime'));
                    w.loadFile= ec.init(document.getElementById('loadFile'));
                    w.weekChart = ec.init(document.getElementById('weekChart'));
                    w.dnsMap= ec.init(document.getElementById('dnsMap'));
                    //set options



                    w.mapChart.setOption(w.mapChartOption(value));
                    w.initMapChartTimeChanged(value);
                    w.node.setOption(w.chartOption(value));//可用性趋势分析
                    w.faultPie.setOption(w.faultPieOption(value));//访问故障延时分析 饼状图
                    w.faultBar.setOption(w.faultBarOption(value));//访问故障延时分析 柱状图
                    w.faultLine.setOption(w.faultLineOption(value));//访问故障延时分析 折线图
                    w.chartLine.setOption(w.chartLineOption(value));// 周期性访问延时面积图
                    w.dnsMap.setOption(w.dnsMapOption(value));// dns命中率map
                    w.initDnsTable();//dbs命中率的table
                    w.loadTime.setOption(w.loadTimeOption(value));// 加载时间饼图
                    w.loadFile.setOption(w.loadFileOption(value));// 加载资源文件雷达图
                    w.initIndexResource();//资源加载table
                    w.weekChart.setOption(w.chartUpdateOption(value));// 月度更新统计



                    $("#myTab1 .tab-pane:gt(0),#myTab2 .tab-pane:gt(0),#myTab3 .tab-pane:gt(0),#myTab4 .tab-pane:gt(0)").removeClass('active');
                }
            );
        },
        initMapChartTimeChanged:function(json){
            var w=this;
            var nodes=json.node;
            var tbody=$('.nodeStatus-nav-datatablebody');
            var k=0;
            $.each(nodes,function(i,node){

                tbody.append("<tr class='tr_"+k+"'><td class='node_name'></td><td class='status_desc'></td><td class='value'></td></tr>");
                k++;
            });
            $(".nodeStatus-nav-datatable").dataTable($.extend(w.defaultGridSetting(), {
                'iDisplayLength':13
            })).fnDraw();

            w.mapChart.on('timelineChanged', function(a,b){

                //先全部行初始化


                var datas = b.component.timeline.options[a.currentIndex].series[0].data;
                //排序
                var   sortMap=JsonSort(datas,"src_value");

                var j=0;
                for(var i=sortMap.length-1;i>=0;i--){
                    var tr=$(".tr_"+j,tbody);
                   // console.info(tr);

                    $(".node_name",tr).text(sortMap[i]['name']);
                    var value=sortMap[i]['src_value'];
                    if(value<=0){
                        value='--'
                    }
                    $(".value",tr).text(value);
                    $(".status_desc",tr).text(value=='--'?'--':sortMap[i]['status_desc']);

                    j++;

                }





            });
        },
        initOption: function(){
            var w = this;
            w.mapChartOption=function(json){


                var times=[];
                var timeArray=[];
                var curDateKey=$("#current_time_id").val();

                for(var i=0;i<24;i++){
                    times.push(i<10?("0"+i):""+i);
                    timeArray.push(curDateKey+" "+times[i]+":00:00");
                }

                var option = {
                    timeline:{
                        data:timeArray,
                        symbol: 'emptyCircle',
                        symbolSize: 4,
                        padding:[0,0,10,0],
                        x:0,
                        x2: 0,
                        y2: -10,
                        label : {
                            formatter : function(s) {
                                return s.slice(11, 13);
                            },
                            textStyle: {
                                color: '#000',
                                fontSize: 12
                            }
                        },
                        lineStyle: {
                            width: 1
                        },
                        checkpointStyle: {
                            symbol : 'circle',
                            symbolSize : '4',
                            color : 'auto',
                            borderColor : 'auto',
                            borderWidth : 'auto',
                            label: {
                                show: false,
                                textStyle: {
                                    color: 'auto'
                                }
                            }
                        },
                        controlStyle: {
                            itemSize: 15,
                            itemGap: 2,
                            normal : {
                                color : '#000'
                                //color : '#fff'
                            },
                            emphasis : {
                                color : '#000'
                            }
                        }      ,
                        //currentIndex : 10,
                        autoPlay : true,
                        playInterval : 5000
                    },
                    options:[]
                };
                var data= w.getMapCharData(json);
                for (var i = 0; i < times.length; i++) {
                   // console.info(data[i]);
                    var j = (i==0?23:i-1);
                    option.options.push( {
                        title : {
                            text: curDateKey +'  '+ times[j] +'时 可用性分析',
                            x: 'left',
                            textStyle: {
                                fontSize: 20,
                                fontWeight: 'bolder',
                                fontFamily: 'Arial, Verdana, sans-serif'
                            }
                        },
                        tooltip : {'trigger':'item'},

                        dataRange: {
                            show: false,
                            splitNumber:0,
                            padding: 1,
                            text:['高','低'],  // 文本，默认为数值文本
                            splitList:[
                                {end: 0,color:'grey'},
                                {start:0,end:300,color:'green'},
                                {start:300,end:1000,color:'yellow'},
                                {start:1000,end:10000,color:'orange'},
                                {start:10000,end:100000,color:'red'},
                                {start:100000,color:'grey'}
                            ],
                            calculable : false,
                            x: 60,
                            y: 360,
                            color: ['grey','red','orange','yellow','green']
                        },
                        series : [
                            {
                                itemStyle:{
                                    normal:{
                                        label:{

                                            show:false
                                        }

                                    },
                                    emphasis:{label:{show:true}}
                                },
                                'name':'响应延时',
                                'type':'map',
                                mapType: 'china',
                                'data': data[i]
                                //'data': json.data[json.timeArray.length-i-1]
                                //'data': [{}]
                            }
                        ]
                    });


                }
                return option;


            };
            w.chartOption = function(json){
                var monthDoc=json.monthDoc;
                var nodeDoc=json.node;
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    dataZoom : {
                        show : true,
                        realtime : true,
                        start : 0,
                        end : 100
                    },
                    legend: {
                        data:[]
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
                            data :[]
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '连接时长（ms）',
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
                var nodeNames=[],nodeIds=[];
                $.each(nodeDoc,function(i,v){
                    nodeIds.push(v['_id']);
                    nodeNames.push(v['cn_name']);
                });

                var dataArr = []
                $.each(nodeIds,function(i,node){
                    var oneData = [];

                    $.each(monthDoc.dateKeys,function(j,dateKey){
                        if(monthDoc.data[node]){

                            if(monthDoc.data[node][dateKey]){
                                var avg_connect_time = monthDoc.data[node][dateKey].avg_connect_time
                                    +monthDoc.data[node][dateKey].avg_nslookup_time;
                                avg_connect_time=Math.round(avg_connect_time);
                                oneData.push(avg_connect_time)
                            }else{
                                oneData.push(0);


                            }
                        }


                    });
                    dataArr.push(oneData);
                });
                var selected = {};
                for(var num = 0; num < nodeNames.length; num++){
                    if(num >= 3){
                        eval("selected." + nodeNames[num] + "=false");
                    }
                }
                option.legend.selected = selected;

                option.xAxis[0].data=monthDoc.dateKeys;
                option.legend.data=nodeNames;
                for(var i = 0; i < dataArr.length; i++){
                    var one = {};
                    one.name = nodeNames[i];
                    one.type = 'line';
                    one.smooth = true;
                    one.symbol = 'emptyCircle';
                    one.itemStyle = {normal: {areaStyle: {type: 'default'}}};
                    one.data = dataArr[i];
                    option.series.push(one);
                }

                return option;
            }
            w.faultPieOption = function(json){
                var option = {
                    color: ['#d32a03', '#ddd'],
                    calculable : false,
                    series : [
                        {
                            name:'访问来源',
                            type:'pie',
                            center: ['50%','50%'],
                            radius : ['60%', '70%'],
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
                                    value: 0,
                                    name:'直接访问',
                                    itemStyle : {
                                        normal : {
                                            label : {
                                                show : true,
                                                position: 'center',
                                                formatter : '当日故障时长\n'+'{c}'+'分钟',
                                                textStyle: {
                                                    fontSize: 20
                                                }
                                            },
                                            labelLine : {
                                                show : false
                                            }
                                        }

                                    }
                                },
                                {
                                    value:0,
                                    name:'邮件营销'
                                }
                            ]
                        }
                    ]
                };
                var data = json['dateDoc'];
                var lastDate = data[data.length - 1];
                if(!lastDate){
                    return option;
                }
                if(!lastDate['offline']){
                    return option;
                }
                var offline = lastDate['offline'];
                var length = offline['all']['disconnect_time'];
                if(length){
                    option.series[0].data[0].value = (length / 60000).toFixed(2);
                    option.series[0].data[1].value = 0;
                }else{
                    option.series[0].data[0].value = 0;
                    option.series[0].data[1].value = 1;
                }
                return option;
            };
            // 故障时长
            w.faultBarOption = function(json){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    grid: {
                        borderWidth:0
                    },
                    legend: {
                        data:['故障时长','故障次数']
                    },
                    xAxis : [
                        {
                            type : 'category',
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '故障时长（分钟）',
                            axisTick:{
                                show:true
                            },
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            axisLabel : {
                                formatter: '{value}'
                            }
                        },
                        {
                            type : 'value',
                            name : '故障次数（次）',
                            axisTick:{
                                show:true
                            },
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [

                        {
                            name:'故障时长',
                            type:'bar',
                            data:[]
                        },
                        {
                            name:'故障次数',
                            type:'line',
                            yAxisIndex: 1,
                            smooth:true,
                            symbol: 'emptyCircle',
                            data:[]
                        }
                    ]
                };

                var data = json['dateDoc'];
                var lastDate = data[data.length - 1];
                if(!lastDate){
                    return option;
                }
                var offline = lastDate['offline'];
                if(!lastDate['offline']){
                    return option;
                }
                var nodes = json['node'];
                var nodeValue = offline['nodes'];
                $.each(nodeValue, function(point, item){
                    var nodeName = "";
                    $.each(nodes, function(p, v){
                        if(point == v['_id']){
                            nodeName = v['cn_name'];
                        }
                    });
                    if(nodeName != ""){
                        option.xAxis[0].data.push(nodeName);
                        var connect_time = (item['disconnect_time'] / 60000).toFixed(2);
                        var connect_count = item['disconnect_count'];
                        option.series[0].data.push(connect_time);
                        option.series[1].data.push(connect_count);
                    }
                });

                return option;
            };
            w.faultLineOption = function(json){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    calculable : true,
                    legend: {
                        data:['故障时长','故障次数']
                    },
                    dataZoom : {
                        show : true,
                        realtime : true,
                        start : 0,
                        end : 100
                    },
                    xAxis : [
                        {
                            type : 'category',
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            name : '故障时长（分钟）',
                            axisTick:{
                                show:true
                            },
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            axisLabel : {
                                formatter: '{value} '
                            }
                        },
                        {
                            type : 'value',
                            name : '故障次数（次）',
                            axisTick:{
                                show:true
                            },
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            axisLabel : {
                                formatter: '{value}'
                            }
                        }
                    ],
                    series : [

                        {
                            name:'故障时长',
                            type:'bar',
                            barMaxWidth: 30,
                            data: []
                        },
                        {
                            name:'故障次数',
                            type:'line',
                            yAxisIndex: 1,
                            smooth:true,
                            symbol: 'emptyCircle',
                            data: []
                        }
                    ]
                };

                var date = json['monthDoc'];
                if(!date){
                    return option;
                }
                var offlineData = date['offline']['nodes'];
                var selectNode = $('.fault-nav-node-select').val();
                var tmpValues = offlineData[selectNode];
                var dateNodesKey = date['offline']['nodesDateKeys'];
                $.each(dateNodesKey, function(point, item){
                    option.xAxis[0].data.push(item);
                    var tmpVData = tmpValues[item];
                    var count = 0;
                    var time = 0;
                    if(tmpVData){
                        count = tmpVData['disconnect_count'];
                        time = (tmpVData['disconnect_time']/60000).toFixed(2);
                    }
                    option.series[0].data.push(time);
                    option.series[1].data.push(count);
                });

                return option;
            };
            // 周期性访问延时折线图
            w.chartLineOption = function(json){
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[]
                    },
                    calculable : true,
                    grid: {
                        borderWidth:0
                    },
                    xAxis : [
                        {
                            name : '时间(时)',
                            type : 'category',
                            boundaryGap : false,
                            splitLine : {
                                show:false
                            },
                            splitArea : {
                                show: false
                            },
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            name:'访问延时(秒)',
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
                    ]
                };

                var dateValue = value['dateDoc'];
                var options = $('.avail-nav-site-select').val();
                var series = [];
                var i = 0;
                $('.avail-nav-datatable').html("");
                if(dateValue){
                    $.each(dateValue, function(point, item){
                        var tr=$("<tr></tr>");
                        var id = item['_id'];
                        var data = item['data'][options];
                        var idDay = id.split('__')[1];
                        option['legend']['data'].push(idDay);
                        tr.append("<td>" + idDay + "</td>");
                        var valueData = [];
                        option['xAxis'][0]['data'] = [];
                        if(data){
                            for(var i = 0; i < 24; i++){
                                var item;
                                if(i < 10){
                                    var tmp = '0' + i;
                                    item = data[tmp];
                                    option['xAxis'][0]['data'].push(tmp);
                                }else{
                                    item = data[i];
                                    option['xAxis'][0]['data'].push(i);
                                }
                                var v = 0;
                                if(item){
                                    v = item['avg_connect_time'] + item['avg_nslookup_time']
                                    if(v < 0){
                                        v = 0
                                    }else{
                                        v = (v / 1000).toFixed(2);
                                    }
                                }
                                valueData.push(v);
                                tr.append("<td>" + v + "</td>");
                            }
                        }else{
                            for(var i = 0; i < 24; i++){
                                var item;
                                if(i < 10){
                                    var tmp = '0' + i;
                                    option['xAxis'][0]['data'].push(tmp);
                                }else{
                                    option['xAxis'][0]['data'].push(i);
                                }
                                valueData.push(0);
                                tr.append("<td>0</td>");
                            }
                        }
                        tr.appendTo($('.avail-nav-datatable'));
                        series.push({
                            name:idDay,
                            type:"line",
                            smooth:true,
                            symbol: 'emptyCircle',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:valueData
                        })
                    });

                }
                option['series']=series;
                return option;
            };
            // DNS解析命中率Option
            w.dnsMapOption = function(json){
                var  option = {

                    title : {
                        text: 'DNS命中率分析',
                        x:'center'

                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: '{b}'
                    },
                    series : [
                    ]
                };
                var data = value['siteDoc'];

                if(!data){
                    return option;
                }
                var ips = data['ips'];
                if(!ips){
                    return option;
                }

                var mapSeriesData = [];

                var nodes = value['node'];
                $.each(ips, function(key, item){
                    var source = "";
                    $.each(nodes, function(point, item){
                        if(item['_id'] == key){
                            source = item['cn_name'];

                        }
                    });
                    var dest = item['area'];
                    var ip = item['ip'];
                    var one = [];
                    one.push({
                        "name":source
                    });
                    one.push({
                        "name":dest
                    });
                    if(source != '未知' && dest != '未知'){
                        if(!mapSeriesData[dest]){
                            mapSeriesData[dest] = [];
                        }
                        mapSeriesData[dest].push(source);
                    }
                });
                $.each(__PROVINCES__, function(point, item){
                    if(mapSeriesData[item]){
                        var data = [];

                        $.each(mapSeriesData[item], function(p, v){
                            var one = [];
                            one.push({"name":v});
                            one.push({"name":item});
                            data.push(one);
                            console.info(v + " : " + item);
                        });
                        option.series.push({
                            name: point,
                            type: 'map',
                            hoverable: false,
                            mapType: 'china',
                            itemStyle:{
                                normal:{
                                    borderColor:'rgba(100,149,237,1)',
                                    borderWidth:0.5

                                }
                            },
                            data:[],
                            markLine : {
                                smooth:true,
                                effect : {
                                    show: true,
                                    scaleSize: 1,
                                    period: 30,
                                    color: '#fff',
                                    shadowBlur: 2
                                },
                                itemStyle : {
                                    normal: {
                                        borderWidth:1,
                                        lineStyle: {
                                            type: 'solid',
                                            shadowBlur: 10
                                        }
                                    }
                                },
                                data : data
                            },
                            geoCoord: __GEO__.china_province
                        });
                    }
                });
                return option;
            };
            // 文件加载时间Option
            w.loadTimeOption = function(json){
                var option = {
                    title: {
                        text: '加载时长分布',
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
                            data: []
                        }
                    ]
                };
                var resourceDoc = json['resourceDoc'];
                if(!resourceDoc){
                    return option;s
                }
                var loadTime = resourceDoc['homepage_data'];
                $.each(loadTime, function(point, item){
                    var name = ''
                    var time = (item / 1000).toFixed(2);
                    if(point=='avg_nslookup_time'){
                        name = '解析时间';
                    }else if(point == 'avg_download_time'){
                        name = '下载时间';
                    }else if(point == 'avg_connect_time'){
                        name = '连接时间';
                    }
                    option.series[0].data.push({
                        "name":name,
                        "value":time
                    });
                });
                return option;
            };

            // 文件加载雷达图Option
            w.loadFileOption = function(json){
                var getValue = function(item, tmp){
                    var js = 0;
                    var css = 0;
                    var img = 0;
                    var ary = [];
                    var max = 0;
                    var count = 0;
                    $.each(item, function(point, item){
                        if(max < item){
                            max = item;
                        }
                        if(point == 'js'){
                            js = item;
                        }else if(point == 'css'){
                            css = item;
                        }else if(point == 'img'){
                            img = item;
                        }
                        count += item;
                    });
                    ary.push({
                        'js':js,
                        'css':css,
                        'img':img,
                        'max':max,
                        'count':count
                    });

                    return ary;
                }
                var  option = {
                    title : {
                        text: '加载文件分析',
                        //y: 40,
                        textStyle: {
                            color: '#098BCB',
                            fontSize: 18,
                            fontFamily: 'Microsoft YaHei'
                        }
                    },
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        orient : 'vertical',
                        x : 'right',
                        y : 'top',

                        data:['JS','CSS','IMG']
                    },
                    polar : [
                        {
                            indicator : [
                            ]
                        }
                    ],
                    calculable : true,
                    series : [
                        {
                            name: '加载文件分析',
                            type: 'radar',
                            data : [
                                {
                                    value : [],
                                    name : 'JS'
                                },
                                {
                                    value : [],
                                    name : 'CSS'
                                },
                                {
                                    value : [],
                                    name : 'IMG'
                                }
                            ]
                        }
                    ]
                };
                var resourceDoc = value['resourceDoc'];
                if(!resourceDoc){
                    return option;s
                }
                var count = resourceDoc['count'];
                var loadErrorCount = resourceDoc['load_error_count'];
                var loadTime = resourceDoc['load_time'];
                var totalLength = resourceDoc['total_length'];
                var jsData = [];
                var cssData = [];
                var imgData = [];

                // 获取文件数量
                var ary = getValue(count, false)[0];
                jsData.push(ary['js']);
                cssData.push(ary['css']);
                imgData.push(ary['img']);
                var max = (ary['max'] == 0 ? 1 : ary['max']);
                $('.index-nav-request-count').html(ary['count']);
                option.polar[0].indicator.push({
                    text:'文件数量',
                    max:max
                });
                // 获取文件大小
                var ary = getValue(totalLength, false)[0];
                jsData.push(ary['js']);
                cssData.push(ary['css']);
                imgData.push(ary['img']);
                var max = (ary['max'] == 0 ? 1 : ary['max']);
                $('.index-nav-request-length').html((ary['count'] / 1024).toFixed(2));
                option.polar[0].indicator.push({
                    text:'文件大小',
                    max:max
                });
                // 获取加载时长
                var ary = getValue(loadTime, true)[0];
                jsData.push(ary['js']);
                cssData.push(ary['css']);
                imgData.push(ary['img']);
                var max = (ary['max'] == 0 ? 1 : ary['max']);
                $('.index-nav-request-count-time').html(resourceDoc['max_load_time'].toFixed(2));
                option.polar[0].indicator.push({
                    text:'加载时长',
                    max:max
                });
                // 获取加载失败个数
                var ary = getValue(loadErrorCount, false)[0];
                jsData.push(ary['js']);
                cssData.push(ary['css']);
                imgData.push(ary['img']);
                var max = (ary['max'] == 0 ? 1 : ary['max']);
                option.polar[0].indicator.push({
                    text:'失败个数',
                    max:max
                });
                option.series[0].data[0].value = jsData;
                option.series[0].data[1].value = cssData;
                option.series[0].data[2].value = imgData;
                return option;
            };
            // 更新率Option
            w.chartUpdateOption = function(json){
                var time = json['monthDoc']['update_rate']['last_update_time'];
                $('.update-nav-lastmodify-data').html(time||"未更新");
                var option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['更新次数']
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
                            data : []
                        }
                    ],
                    yAxis : [
                        {
                            max : 1,
                            min:0,
                            name : '次数',
                            splitNumber:1,
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

                            name:'更新次数',
                            type:'line',
                            smooth:true,
                            symbol: 'emptyCircle',
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data:[]
                        }
                    ]
                };
                if(!json['monthDoc']){
                    return option;
                }
                var monthDoc = json['monthDoc']['update_rate'];
                var detail = monthDoc['detail'];
                var rateDateKeys = monthDoc['rateDateKeys'];
                for(var i = 0; i < rateDateKeys.length; i++){
                    var key = rateDateKeys[i];
                    var value = detail[key];
                    option.xAxis[0].data.push(key);
                    option.series[0].data.push(value);
                }
                return option;
            };
        },
        initDnsTable : function(){
            var w = this;
            var data = value['siteDoc'];
            if(!data){
                return;
            }
            var ips = data['ips'];
            if(!ips){
                return;
            }

            var nodes = value['node'];
            $('.domain-nav-datatable').html("");
            $.each(ips, function(key, item){
                var tr = $("<tr></tr>");
                var source = "";
                $.each(nodes, function(point, item){
                    if(item['_id'] == key){
                        source = item['cn_name'];
                    }
                });
                var dest = item['area'];
                var ip = item['ip'];
                tr.append('<td>' + source + '</td>');
                tr.append('<td>' + ip + '</td>');
                tr.append('<td>' + dest + '</td>');
                tr.appendTo($('.domain-nav-datatable'));
            });
            $('.domain-nav-datatable-all').dataTable($.extend(w.defaultGridSetting(), {
                'iDisplayLength':13
            }));
        },
        initIndexResource : function(){
            var w = this;
            if(!value['resourceDoc']){
                return;
            }
            var resource = value['resourceDoc']['resource'];
            $.each(resource, function(point, item){
                $.each(item, function(k, v){
                    var tr = $('<tr></tr>');
                    tr.append("<td>" + point + "</td>");
                    tr.append("<td>" + v['link'] + "</td>");
                    tr.append("<td>" + (v['page_len'] < 0 ? '未知': v['page_len']) + "</td>");
                    tr.append("<td>" + (v['http_code'] < 0 ? '未知': v['http_code']) + "</td>");
                    tr.append("<td>" + (v['total_time'] < 0 ? '未知':v['total_time'].toFixed(2)) + "</td>");
                    tr.appendTo($('.index-nav-datatable'));
                });
            });
            $('.index-nav-datatable-all').dataTable(w.defaultGridSetting());
        },
        defaultGridSetting:function(){
            var zh_CN={
                "sProcessing":   "处理中...",
                "sLengthMenu":   "_MENU_ 记录/页",
                "sZeroRecords":  "没有匹配的记录",
                "sInfo":         "显示第 _START_ 至 _END_ 项记录，共  _TOTAL_项，共_PAGE_页 ",
                "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                "sInfoPostFix":  "",
                "sSearch":       "过滤:",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    "首页",
                    "sPrevious": "上页",
                    "sNext":     "下页",
                    "sLast":     "末页"
                }
            };
            var gridSetting={
                "iDisplayLength": 8,//每页显示10条数据
                "oLanguage": zh_CN,
                "bProcessing": false,//开启读取服务器数据时显示正在加载中……
                "bServerSide": false,//服务器模式
                "sServerMethod": "POST",
                "bSort":false,//不支持排序
                "bSortClasses":false,
                "sPaginationType":"bs_full",
                "bLengthChange": false,
                "bInfo":false
            };
            return gridSetting;

        },
        getMapCharData:function(json){
            var map = [];
            var provinces=[];
            var nodeIds=[];
            $.each(json.node,function(i,node){
                provinces.push(node['cn_name']);
                nodeIds.push(node['_id']);
            });
            var currentDateDoc=json.dateDoc[json.dateDoc.length-1];
            for(var i = 0; i < 24; i++){
                var hourValue = [];
                for(var j = 0; j < nodeIds.length; j++){
                    var hourKey=(i<10?("0"+i):(""+i));
                    hourValue[j] = this.getOneValue(nodeIds[j],hourKey,currentDateDoc,provinces[j]);

                }

                map[i] = hourValue;

            }

            return map;


        },
        getOneValue: function(node,hour,dateDoc,provinceName){
            var datas = dateDoc.data;
            var oneVale = {};
            if(datas[node]&&datas[node][hour]){
                var data=datas[node][hour];
                oneVale.name = provinceName;
                var num = Math.round(data.avg_connect_time+data.avg_nslookup_time);
                var status_desc =data.status_desc;

                oneVale.value=num;

                oneVale.status_desc = status_desc;
                oneVale.src_value=num;
            }else{
                oneVale.name = provinceName;
                oneVale.value = 0;
                oneVale.status_desc = '';
                oneVale.src_value=0;
            }
           // console.info(oneVale)
            return oneVale;
        }



    }


    $(function(){
        o.init();


    })


})();