/**
 * Created by jianghaifeng on 2015/12/28.
 */
var monitor;
(function(){
    var __functions__={
        getHourKeys:function(){
            var w=this;
            var arr=[];
            for(var i=0;i<24;i++){
                var t= w.currentDateKey+" "+(i>=10?(""+i):("0"+i))+":00:00"
                arr.push(t);
            }
            //console.info(arr);
            return arr;
        },
        getHourData:function(hourKey){
            var w=this;
            var arr=[];
            var data= w.monitorData.daily.data;
            var nodeMapper= w.monitorData.node_mapper;
            $.each(nodeMapper,function(node,nodeName){
                if(data[node]&&data[node][hourKey]){
                    var obj={};
                    obj['name']=nodeName;
                    var _d=data[node][hourKey];
                    obj['value'] = ((__functions__.getAvgData(_d,'connect_time')+__functions__.getAvgData(_d,'nslookup_time'))).toFixed(2);
                    //obj['data']=data[node][hourKey];
                    arr.push(obj);
                }else{
                    var obj={};
                    obj['name']=nodeName;
                    obj['value'] = 100;
                    arr.push(obj);
                }
            });
            return arr;
        },
        getAvgData:function(data,key){
            var avg=-1;
            var c=0;
            for(var i=0;i<data.length;i++){
                var d=data[i];
                if(d[key]>0){
                    avg=avg+ d[key];
                    c++;
                }
            }
            if(c>0){
                return (avg+1)/c;
            }else{
                return -1;
            }

        },
        getHourBarData:function(hourKey){
            var w=this;
            var data= w.monitorData.daily.data;
            var nodeMapper= w.monitorData.node_mapper;
            var obj={};
            $.each(nodeMapper,function(node,nodeName){
                if(data[node]&&data[node][hourKey]){
                    var  _d=data[node][hourKey];
                    var one={};
                    one.avg_nslookup_time=__functions__.getAvgData(_d,"nslookup_time");
                    one.avg_download_time=__functions__.getAvgData(_d,"download_time");
                    one.avg_connect_time=__functions__.getAvgData(_d,"connect_time");
                    obj[nodeName]=one;
                }else{
                    obj[nodeName]={};
                }
            });
            return obj;
        },
        getNodeNames:function(){
            var w=this;
            var arr=[];
            $.each( w.monitorData.node_mapper,function(node,nodeName){
                arr.push(nodeName);
            });
            return arr;
        },
        formatMonitorTime:function(time){
            if(!time||time<0){
                return 0;
            }else{
                return (time).toFixed(0);
            }

        },
        formatSeconds2SimpleTime:function(seconds){

            var hour=Math.floor(seconds%86400/3600);
            var min=Math.floor(seconds%3600/60);
            var sec=Math.floor(seconds%60);
            return ((hour>=10?"":"0")+hour)+":"+((min>=10?"":"0")+min)+":"+((sec>=10?"":"0")+sec);

        },
        formatSimpleTime2Seconds:function(time){
             if(time.split(" ")[1]){
                 time=time.split(" ")[1];
             }else{
                 time=time.split("+")[1];
             }
             var tmp=time.split(":");
             var h=parseInt(tmp[0]);
             var m=parseInt(tmp[1]);
             var s=parseInt(tmp[2]);
             return s+m*60+h*3600;
        },
        fnDrawDataTable:function(name,dom,lineNum){
            var w=this;
            if(!w[name]){
                w[name]= dom.dataTable($.extend(storm.defaultStaticGridSetting(), {
                    'iDisplayLength':lineNum
                }));
            }else{
                w[name].fnDestroy();
                w[name]=dom.dataTable($.extend(storm.defaultStaticGridSetting(), {
                    'iDisplayLength':lineNum
                }));
            }
            w[name].fnDraw();
        },
        fnClearDataTable:function(name){
            var w=this;
            if(w[name]){
                w[name].fnClearTable();
            }
        },
        numFormat: function(num){
            return num.toString().replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');
        }
    };

    monitor={

         init:function(currentDateKey,domain,callback){
             var w=this;
             w.currentDateKey=currentDateKey;
             w.domain=domain;
             monitor.loadData.call(w,w.domain, w.currentDateKey,function(){
                 monitor.view.load.call(w);
                 callback&&callback();
             });
             if(!w.handleInit){
                 monitor.handler.call(w);
                 w.handleInit=true;
             }
         },
         loadData:function(domain,dateKey,callback){
             var w=this;
             var monitorDataValue = $("#monitorDataSrc").val();
             if(monitorDataValue){
                 w.monitorData = $.parseJSON(decodeURIComponent(monitorDataValue));
                 callback&&callback();
             }else{
                 $.ajax({
                     url:__WEBROOT__+"/MSSP/Report/monitorData",
                     data:{domain:domain,dateKey:dateKey},
                     type:"post",
                     //async:false,
                     success:function(json){
                         if(json.code>0){
                             w.monitorData=json.data;
                             callback&&callback();
                         }else{
                             $("body").hideLoading();
                             storm.alert("无法生成报告，可能合同已过期")
                         }
                     }
                 });
             }
         },
         options:{
             date_deal_map:{
                     timeline:{
                         data:[

                         ],
                         label : {
                             formatter : function(s) {
                                 //return s;
                                 return s.slice(11, 13);
                             }
                         },
                         autoPlay : true,
                         playInterval : 3000
                     },
                     options:[
                     ]

             },
             date_deal_bar:{
                 tooltip : {
                     trigger: 'axis',
                     axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                         type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                     }
                 },
                 color:['#3AC2C3','#AC9AD7','#55ABEA',"#FDB07A"],
                 legend: {
                     data:['DNS解析时长','建立连接时长','下载数据时长']
                 },
                 xAxis : [
                     {
                         type : 'category',
                         axisLabel:{'interval':0},
                         data : []
                     }
                 ],
                 yAxis : [
                     {
                         type : 'value'
                     }
                 ],
                 series : [


                 ]
             },
             gantt:{
                 chart: {
                     type: 'columnrange',
                     inverted: true
                 },
                 title: {
                     text: ''
                 },
                 xAxis: {    /** 节点数据  */
                    categories: []
                 },
                 yAxis: {
                     max: 86400,        // 定义Y轴 最大值
                     min: 0,           // 定义最小值
                     minPadding: 60,
                     maxPadding: 60,
                     tickInterval: 60*60, // 刻度值
                     labels:{
                         formatter:function() {
                             return this.value/3600+":00";
                         }
                     },
                     title: {
                         text: '时间'
                     }
                 },
                 tooltip: {
                     valueSuffix: 'tt',
                     formatter: function(){
                         var low = this.point.low;
                         var high = this.point.high;
                         var result = "<b>" + this.point.category + "(" +  this.series.name + ")</b><br/>" +
                             "<span>时间：" + __functions__.formatSeconds2SimpleTime(low) +
                             "-" +  __functions__.formatSeconds2SimpleTime(high) + "</span><br/>" +
                             "<span>共计：" + ((high - low)/60).toFixed(0) + "分钟";
                         return result;
                         //if(high - low > 0){
                         //    return result;
                         //}

                     }
                 },
                 colors: [
                     '#c42525', '#f28f43'
                 ],
                 plotOptions: {
                     columnrange: {
                         dataLabels: {
                             enabled: true,
                             inside: true,
                             align: 'left',
                             formatter: function () {
                                 var point = this.point;
                                 var low = point.low;
                                 var high = point.high;
                                 return "";

                             }
                         }
                     }
                 },
                 legend: {
                     enabled: true
                 },
                 series: [
                     {
                         name: '全局服务质量下降',
                         data: [

                         ]
                     },
                     {
                         name: '节点断网',
                         data: [


                         ]
                     }]

             },
             cdn_map:{
                 tooltip:{
                     show:false,
                     trigger: 'item'
                 },
                 dataRange: {
                     min : 1,
                     max : 100,
                     show:false,
                     calculable : true,
                     //color:["red","green"] ,
                     color:[
                         '#87cefa', '#da70d6', '#32cd32', '#6495ed',
                         '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                         '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                         '#6b8e23', '#ff00ff', '#3cb371', '#b8860b'
                     ],
                     textStyle:{
                         color:'#fff'
                     }
                 },
                 series : [
                     {
                         type: 'map',
                         mapType: 'china',
                         hoverable: false,
                         itemStyle: {
                             normal:{
                                 label:{
                                     show:false
                                 }
                             }

                         },
                         data: [],//json.data,
                         geoCoord: __GEO__.china_province,
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
                                     },
                                     label: {
                                         show:false
                                     }
                                 }

                             },
                             data: [
                                 //[{name:'北京'},{name:'浙江',value:1}],
                                 //[{name:'四川'},{name:'上海',value:2}]
                             ]//json.markLineData
                         }
                     }
                 ]
             },
             resource_pie:{

                 tooltip : {
                     trigger: 'item',
                     formatter: "{a} <br/>{b} : {c} ({d}%)"
                 },
                 calculable : false,
                 series : [
                     {
                         name:'加载时长分布',
                         type:'pie',
                         radius : '60%',
                         center: ['50%', '50%'],
                         data:[

                         ]
                     }
                 ]

             },
             resource_leida:{

                 tooltip : {
                     trigger: 'axis'
                 },
                 legend: {
                     orient : 'vertical',
                     x : 'right',
                     y : 'bottom',
                     data:['js','css','img']
                 },
                 polar : [
                     {
                         indicator : [
                             { text: '文件数量'},
                             { text: '文件大小'},
                             { text: '加载失败'},
                             { text: '加载时长'}

                         ]
                     }
                 ],
                 calculable : false,
                 series : [
                     {
                         name: '文件类型',
                         type: 'radar',
                         data : [

                         ]
                     }
                 ]
             },
             update_line:{

                 tooltip : {
                     trigger: 'axis'
                 },
                 legend: {
                     data:['更新次数']
                 },
                 xAxis : [
                     {
                         type : 'category',
                         boundaryGap : false,
                         data : []
                     }
                 ],
                 showAllSymbol:true,
                 color:["#87cefa"],
                 yAxis : [
                     {
                         type : 'value'

                     }
                 ],
                 series : [
                     {
                         name:'更新次数',
                         type:'line',
                         data:[],
                         symbol:"heart"


                     }
                 ]

             }
         },
         view:{
             load:function(){
                 var w=this;
                 monitor.view.summary.call(w);
                 monitor.view.echarts_prepare.call(w,function(){
                     if(w.monitorData.daily){
                         monitor.view.date_deal_map.call(w);
                         monitor.view.date_deal_bar.call(w,"00");
                     }
                     monitor.view.cdn_map.call(w);
                     monitor.view.resource_pie.call(w);
                     monitor.view.resource_leida.call(w);
                     monitor.view.update_line.call(w);
                     monitor.view.gantt.call(w);


                 });
                 monitor.view.offline_line_record.call(w);

                 monitor.view.cdn_table.call(w);
                 monitor.view.resource_table.call(w);
                 monitor.view.warning_table.call(w);




             },
             echarts_prepare:function(callback){
                 var w=this;
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
                         'echarts/chart/pie',
                         'echarts/chart/radar',
                         'echarts/chart/line'


                     ],
                     function (ec) {
                         var init=function(){
                             w.date_deal_map= ec.init(document.getElementById('date_deal_map'));
                             w.date_deal_bar=ec.init(document.getElementById('date_deal_bar'));
                             w.cdn_map=ec.init(document.getElementById('cdn_map'));
                             w.resource_pie=ec.init(document.getElementById('resource_pie'));
                             w.resource_leida=ec.init(document.getElementById('resource_leida'));
                             w.update_line=ec.init(document.getElementById('update_line'));
                         }
                         if(!w.echartsInit){
                             init();
                             w.echartsInit=true;
                         }




                         callback&&callback.call(w);
                     });
             },
             summary:function(){
                 var w=this;
                 var _data={};

                 _data['offline_time']=( w.monitorData.offline_statistics? w.monitorData.offline_statistics.disconnect_time/1000/60:0).toFixed(0);
                 _data['offline_count']=w.monitorData.offline_statistics?w.monitorData.offline_statistics.disconnect_count:0;
                 _data['access_rate']=((86400000- (w.monitorData.offline_statistics?w.monitorData.offline_statistics.disconnect_time:0))*100/86400000).toFixed(0);
                 var loadTime=w.monitorData.resource?w.monitorData.resource.max_load_time.toFixed(2):"--";
                 _data['homepage_load_time']= loadTime;
                 if(loadTime == '--'){
                     _data['home_load_desc']="--";
                 }else if(loadTime>5000){
                     _data['home_load_desc']="低";
                 }else if(loadTime>3000){
                     _data['home_load_desc']="中";
                 }else{
                     _data['home_load_desc']="高";
                 }

                 _data['update_count']=0;
                 _data['last_update_time']='--';
                 var updateRateData= w.monitorData.updateRate;
                 //updateRateData.data['2016-01-04']=1;
                 $.each(updateRateData.dateKeys,function(i,dateKey){
                       if(updateRateData.data&&updateRateData.data[dateKey]){
                           _data['update_count']=_data['update_count']+1;
                           _data['last_update_time']=dateKey;
                       }
                 });
                 $.each(_data,function(key,v){
                    $("."+key,$(".summary")).text(v);
                 });
             },
             date_deal_map:function(){
                 var w=this;
                 var hourKeys=__functions__.getHourKeys.call(w);
                 monitor.options.date_deal_map.timeline.data=hourKeys;
                 monitor.options.date_deal_map.options=[];
                 $.each(hourKeys,function(i,hourKey){
                      var data=__functions__.getHourData.call(w,hourKey.slice(11, 13));
                      monitor.options.date_deal_map.options.push({
                         title : {'text':hourKey+'服务质量概况(单位:毫秒)'},
                         series : [
                             {
                                 'data':data
                             }
                         ]
                      });
                 });
                 var opt0= monitor.options.date_deal_map.options[0];
                 opt0.dataRange= {
                     show: true,
                         textStyle: {
                         color: '#000'
                     },
                     x: -10,
                     y: 'bottom',
                     calculable: false,
                     splitList: [

                     {start: 0, end: 300, color: 'green',label: '0~0.3秒'},
                     {start: 300, end: 1000, color: '#b36715',label: '0.3~1秒'},
                     {start: 1000, end: 10000, color: '#f9e400',label: '1~10秒'},
                     {start: 10000, color: 'grey',label: '>10秒'},
                     {end: 0, color: 'red',label: '无法访问'}
                     ]
                 };
                 opt0.tooltip={'trigger':'item'};
                 opt0.series[0].type='map';
                 opt0.series[0].name='响应延时';
                 w.date_deal_map.setOption(monitor.options.date_deal_map);
                 w.date_deal_map.on('timelineChanged', function(a,b){
                     var hourKey= a.data.slice(11, 13);
                     monitor.view.date_deal_bar.call(w,hourKey);
                 });
             },
             date_deal_bar:function(hourKey){
                 var w=this;

                 var data=__functions__.getHourBarData.call(w,hourKey);
                 var nodes=__functions__.getNodeNames.call(w);
                 var nodes_tmp=[];
                 $.each(nodes,function(i,n){
                     if(i%2==1){
                         nodes_tmp.push("\n"+n);
                     }else{
                         nodes_tmp.push(n);
                     }
                 });
                 monitor.options.date_deal_bar.xAxis[0].data=nodes_tmp;
                 var avg_nslookup_times=[];
                 var avg_download_times=[];
                 var avg_connect_times=[];
                 $.each(nodes,function(i,node){
                     var _d=data[node];
                     avg_nslookup_times.push(__functions__.formatMonitorTime(_d['avg_nslookup_time']));
                     avg_download_times.push(__functions__.formatMonitorTime(_d['avg_download_time']));
                     avg_connect_times.push(__functions__.formatMonitorTime(_d['avg_connect_time']));
                 });

                 monitor.options.date_deal_bar.series=[];
                 monitor.options.date_deal_bar.series.push({
                     name:'DNS解析时长',
                     type:'bar',
                     stack: '总时长',
                     data:avg_nslookup_times

                 });
                 monitor.options.date_deal_bar.series.push({
                     name:'建立连接时长',
                     type:'bar',
                     stack: '总时长',
                     data:avg_connect_times

                 });
                 monitor.options.date_deal_bar.series.push({
                     name:'下载数据时长',
                     type:'bar',
                     stack: '总时长',
                     data:avg_download_times

                 });
                 w.date_deal_bar.clear()
                 w.date_deal_bar.setOption(monitor.options.date_deal_bar);

             },
             gantt:function(count){

                 var w=this;
                 var nodeData= w.monitorData.node_offline_record;
                 var allData= w.monitorData.offline_record;
                 var nodeNames=[];
                 nodeNames.push("总体");
                 monitor.options.gantt.series[0].data=[];
                 monitor.options.gantt.series[1].data=[];
                 var i=0;
                 $.each( w.monitorData.node_mapper,function(node,nodeName){
                     nodeNames.push(nodeName);
                     i++;
                     if(i<=(count||10)){
                         if(nodeData&&nodeData[node]){

                             var _ds=nodeData[node];
                             var flag=false;
                             $.each(_ds,function(k,_d){
                                 if(_d.status==0){
                                     flag=true;
                                     var low=__functions__.formatSimpleTime2Seconds(_d.happen_time);
                                     var high= __functions__.formatSimpleTime2Seconds(_d.create_time);
                                     if(low>high){
                                         low=0;
                                     }
                                     monitor.options.gantt.series[1].data.push([i,low,high]);
                                 }
                             });
                             if(!flag){
                                 monitor.options.gantt.series[1].data.push([i,0,0]);
                             }
                         }else{
                             monitor.options.gantt.series[1].data.push([i,0,0]);
                         }
                     }



                 });
                 if(allData){
                     var flag=false;
                     $.each(allData,function(i,_d){
                        if(_d.status==0){
                            flag=true;
                            var low=__functions__.formatSimpleTime2Seconds(_d.happen_time);
                            var high= __functions__.formatSimpleTime2Seconds(_d.create_time);
                            if(low>high){
                                low=0;
                            }
                            monitor.options.gantt.series[0].data.push([0,low,high]);
                        }
                     });
                     if(!flag){
                         monitor.options.gantt.series[0].data.push([0,0,1]);
                     }
                 }else{
                     monitor.options.gantt.series[0].data.push([0,0,1]);
                 }


                 monitor.options.gantt.xAxis.categories=nodeNames;
                 //var start=new Date().getTime();
                 $('#gantt').html("");
                 $('#gantt').highcharts(monitor.options.gantt);
                 //var end=new Date().getTime();
                 //console.info(end-start+"ms");




             },
             offline_line_record:function(){
                 var w=this;
                 var table=$(".offline-record-table");
                 $("tbody",table).html("");
                 var data= w.monitorData.offline_record||[];
                 __functions__.fnClearDataTable.call(w,"offline_record_table");

                 for(var i=0;i<data.length;i++){
                     var _d=data[i];
                     var _prev;
                     if(i>0){
                         _prev=data[i-1];
                     }
                     if(_d.status==0){//断网
                         var tr=$(" <tr> <td>服务质量下降</td><td>"+_d.happen_time.split(" ")[1]+"</td><td>"+_d.create_time.split(" ")[1]+"</td><td>"+(_d.continue_time/1000/60).toFixed(0)+"分钟</td> <td class='okrate'>--</td>" +
                             "<td class='offline_detail'><div>--</div></td>"+
                             "  </tr>");
                         tr.appendTo($("tbody",table));

                         if(_prev&&_prev.units){
                             $(".offline_detail div",tr).html("");
                             var units=_prev.units;
                             var error=0;
                             var total=0;

                             $.each(units,function(node,unit){
                                 if(unit.value<200||unit.value>=400){
                                     error++;
                                     $(".offline_detail div",tr).append("<span>【"+w.monitorData.node_mapper[node]+"节点】状态码："+(unit.value==-1?"响应超时":unit.value)+"，响应时长："+(unit.value==-1?"--":(unit.other/1000).toFixed(2)+"秒")+"</span><br/>");
                                 }
                                 total++;
                             });
                             $(".okrate",tr).text("异常响应节点:"+error+"/"+total);
                             $(".offline_detail div",tr).css({
                                 'height': '66px',
                                 'overflow-y': 'hidden'
                             });



                             $(".offline_detail",tr).append("<i class='arrow fa fa-arrow-down'>展开</i>");

                             $(".offline_detail i.arrow",tr).click(function(){
                                 var h =$(this).parent('.offline_detail').children('div').height();
                                 if(h==66){
                                     $(this).parent('.offline_detail').children('div').css({
                                         'height': 'auto',
                                         'overflow-y': 'inherit'
                                     });
                                     $(this).removeClass('fa-arrow-down').addClass('fa-arrow-up').text('收起')
                                 }
                                 else{
                                     $(this).parent('.offline_detail').children('div').css({
                                         'height': '66px',
                                         'overflow-y': 'hidden'
                                     });
                                     $(this).removeClass('fa-arrow-up').addClass('fa-arrow-down').text('展开')


                                 }

                             });

                         }
                     }
                 }

                 __functions__.fnDrawDataTable.call(w,"offline_record_table", $(".offline-record-table"),8);

                 var dis_time=( w.monitorData.offline_statistics? w.monitorData.offline_statistics.disconnect_time/1000/60:0).toFixed(0);
                 var dis_count=w.monitorData.offline_statistics?w.monitorData.offline_statistics.disconnect_count:0;
                 $(".summary-desc",table).text("【服务质量下降】"+dis_count+"次，共计"+dis_time+"分钟");
             },
             cdn_map:function(){
                 var w=this;
                 var cdn= w.monitorData.cdn;
                 monitor.options.cdn_map.series[0].markLine.data=[];
                 var nodeMapper=w.monitorData.node_mapper;
                 var colorValue={};
                var j=0;
                 $.each(cdn,function(i,_d){
                     if(!colorValue[_d.location]){
                         colorValue[_d.location]=j+1;
                         j++;
                     }
                 });
                 $.each(cdn,function(i,_d){
                     //console.info(colorValue[_d.location]);
                     monitor.options.cdn_map.series[0].markLine.data.push([{name:nodeMapper[_d.node]},{name:_d.location,value:colorValue[_d.location]}]);
                 });
                 w.cdn_map.setOption(monitor.options.cdn_map);
             },
             cdn_table:function(){
                 var w=this;
                 var cdn= w.monitorData.cdn;
                 var nodeMapper=w.monitorData.node_mapper;
                 var merge={};

                 $.each(cdn,function(i,_d){
                    var location=_d.location;
                     if(!merge[location]){
                         merge[location]=[];
                     }
                     var locs=merge[location];
                     locs.push({ip:_d.ip,node:_d.node,nodeName:nodeMapper[_d.node],location:location});
                 });
                 var tbody=$("tbody",$(".cnd-table"));
                 tbody.html("");
                 __functions__.fnClearDataTable.call(w,"cdn_table");
                 $.each(merge,function(k,arr){
                     var tr=$(" <tr><td>"+k+"</td><td>"+arr[0].ip+"</td><td class='cdn-detail'></td></tr>");
                     var sb="";
                     for(var i=0;i<arr.length;i++){
                         sb+=arr[i].nodeName+" ";
                         if((i+1)%3==0&&i!=0){
                             sb+="<br>";
                         }
                     }
                     $(".cdn-detail",tr).html(sb);
                     tr.appendTo(tbody);
                 });
                 __functions__.fnDrawDataTable.call(w,"cdn_table",$(".cnd-table"),12);


                 var cdncount=0;
                 var cdnmax=0;
                 var cdnmaxPoint="";
                 $.each(merge,function(k,arr){
                     cdncount+=1;
                     if(arr.length>cdnmax){
                         cdnmax=arr.length;
                         cdnmaxPoint=k;
                     }

                 });
                 $("#cdn-count").text(cdncount);
                 $("#cdn-max").text(cdnmaxPoint);


             },
             resource_pie:function(){
                 var w=this;
                 var data= {};
                 if(w.monitorData.resource&&w.monitorData.resource.homepage_data){
                    data=w.monitorData.resource.homepage_data;
                 }
                 monitor.options.resource_pie.series[0].data=[];
                 //var avg_nslookup=
                 monitor.options.resource_pie.series[0].data.push({name:"DNS解析时长",value:data['avg_nslookup_time']||1 });
                 monitor.options.resource_pie.series[0].data.push({name:"建立链接时长",value:data['avg_connect_time']||1 });
                 monitor.options.resource_pie.series[0].data.push({name:"首页下载时长",value:data['avg_download_time']||1 });

                 w.resource_pie.setOption(monitor.options.resource_pie);
             },
             resource_leida:function(){
                var w=this;
                 var data= {js:[0,0,0,0],css:[0,0,0,0],img:[0,0,0,0]};

                 if(w.monitorData.resource){
                     var total_length=w.monitorData.resource.total_length;
                     var load_time=w.monitorData.resource.load_time;
                     var load_error_count= w.monitorData.resource.load_error_count;
                     var count= w.monitorData.resource.count;
                     var count_max=0;
                     var load_time_max=0;
                     var load_error_max=0;
                     var total_len_max=0;
                     $.each(count,function(type,c){
                         data[type][0]=c;
                         count_max=c>count_max?c:count_max;

                     });
                     $.each(total_length,function(type,len){
                         data[type][1]=len;
                         total_len_max=len>total_len_max?len:total_len_max;
                     });
                     $.each(load_error_count,function(type,c){
                         data[type][2]=c;
                         load_error_max=c>load_error_max?c:load_error_max;
                     });
                     $.each(load_time,function(type,t){
                         data[type][3]=t;
                         load_time_max=t>load_time_max?t:load_time_max;
                     });
                 }
                 monitor.options.resource_leida.series[0].data=[];
                 $.each(data,function(key,d){
                     monitor.options.resource_leida.series[0].data.push({
                             value : d,
                             name : key

                     });
                 });

                 monitor.options.resource_leida.polar[0].indicator[0].max=count_max;
                 monitor.options.resource_leida.polar[0].indicator[1].max=total_len_max;
                 monitor.options.resource_leida.polar[0].indicator[2].max=load_error_max;
                 monitor.options.resource_leida.polar[0].indicator[3].max=load_time_max;

                 w.resource_leida.setOption(monitor.options.resource_leida);

                 //summary

             },
             resource_table:function(){
                 var w=this;
                 var tbody=$("tbody",$(".resource-table"));
                 tbody.html("");
                 __functions__.fnClearDataTable.call(w,"resource_table")
                 if(w.monitorData.resource&&w.monitorData.resource.resource){
                     var data=w.monitorData.resource.resource;
                     $.each(data,function(type,arr){
                         $.each(arr,function(i,obj){
                             var tr=$("<tr><td>"+type+"</td> <td>"+obj.link+"</td> <td>"+obj.page_len+"</td> <td>"+(obj.http_code<0?"响应超时":obj.http_code)+"</td> <td>"+(obj.http_code<0?"--":obj.total_time.toFixed(2))+"</td> </tr>");
                             tr.appendTo(tbody);
                         });
                     });
                     __functions__.fnDrawDataTable.call(w,"resource_table",$(".resource-table"),10);
                 }
             },
             update_line:function(){
                var w=this;
                 var data= w.monitorData.updateRate;

                 var point=[];
                 $.each(data.dateKeys,function(i,dateKey){
                    if(data.data&&data.data[dateKey]!=undefined){
                        point.push(data.data[dateKey]);
                    }else{
                        point.push(0);
                    }
                 });
                 //console.info(days);
                 monitor.options.update_line.xAxis[0].data=data.dateKeys;
                 monitor.options.update_line.series[0].data=point;
                 w.update_line.setOption(monitor.options.update_line);
             },
             warning_table:function(){
                 var w=this;
                 var tbody=$("tbody",$(".warning_table"));

                 tbody.html("");
                 __functions__.fnClearDataTable.call(w,"warning_table");
                 if(w.monitorData.warning){
                     var data=w.monitorData.warning;
                     for(var i=data.length-1;i>=0;i--){
                         var d=data[i];
                         prev={};
                         if(i<data.length-1){
                             var prev=data[i+1];
                         }
                         var contontine="--";
                         if(prev.happen_time){
                             var sec1=__functions__.formatSimpleTime2Seconds(d.happen_time);
                             var sec2=__functions__.formatSimpleTime2Seconds(prev.happen_time);
                             var between=sec2-sec1;
                             contontine=(between/60).toFixed(0)+"分钟";
                         }
                         var color= (d.status==0?'red':'green');
                         var tr=$("<tr><td>"+ d.record_time+"</td> <td style='color:"+color+"'>服务质量"+ (d.status==0?"下降":"提升")+"</td><td>"+ d.happen_time+"</td><td>"+ (prev.happen_time||'--')+"</td> <td>"+contontine+"</td> </tr>");
                         tr.appendTo(tbody);
                     }

                     __functions__.fnDrawDataTable.call(w,"warning_table",$(".warning_table"),10);

                 }
             }


         },
         handler:function(){
             var w=this;
             $(".view-gantt-all").bind("click",function(){
                 $("body").showLoading({
                     overlayStyle:"background-color:grey;opacity:0.5;"
                 });
                 var type=$(this).attr("_type");
                 if(type=='0'){
                     $(this).attr("_type","1");
                     $(this).text("收起");
                    monitor.view.gantt.call(w,100);
                 }else{
                     $(this).attr("_type","0");
                     $(this).text("显示全部");
                     monitor.view.gantt.call(w,10);
                 }
                 $("body").hideLoading();
             });
         }
     }


})();
