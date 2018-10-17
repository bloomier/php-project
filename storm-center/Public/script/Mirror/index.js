(function(){
   var params={
        timeType:"hour",
        timeNum:24,
        keys:"all"
   };
    var app={
        init:function(){
            view.init.call(this);
            handler.init.call(this);
        }

    };
    var __function__={
        space_format:function(num,fix){
            if(num/1024/1024/1024>0){
                return {n:(num/1024/1024/1024).toFixed(fix||0),d:"G"};
            }else if(num/1024/1024>0){
                return {n:(num/1024/1024).toFixed(fix||0),d:"M"};
            }else if(num/1024>0){
                return {n:(num/1024).toFixed(fix||0),d:"K"};
            }else{
                return {n:0,d:"K"};
            }
        },
        log_num_format:function(num){
            if(num>100000000){
                return {n:(num/100000000).toFixed(1),d:"亿"};
            }else if(num>10000){
                return {n:(num/10000).toFixed(1),d:"万"};
            }else{
                return {n:num,d:""};
            }

        },

        mapset:function(json,keySet){
            var arr=[];
            $.each(json,function(k,v){
                if(keySet){
                    arr.push(k);
                }else{
                    arr.push(v);
                }

            });
            return arr;
        },
        formatTime2Point:function(time){
            if(time.split(" ")[1]){
                time=time.split(" ")[1];
            }else{
                time=time.split("+")[1];
            }
            var tmp=time.split(":");
            var h=parseInt(tmp[0]);
            var m=parseInt(tmp[1]);
            return m+h*60;
        },
        formatPoint2Time:function(point){
            var h=parseInt(point/60);
            var m=parseInt(point%60);
            h=(h>=10)?(""+h):("0"+h);
            m=(m>=10)?(""+m):("0"+m);
            return h+":"+m;
        },
        formatDate2Point:function(day){
            var tmp=day.split("-");
            var y=parseInt(tmp[0]);
            var m=parseInt(tmp[1]);
            var d=parseInt(tmp[2]);
            var point=y*10000+m*100+d;
            return point;
        },
        formatPoint2Date:function(point){
            var y=parseInt(point/10000);
            var m=parseInt(point%10000/100);
            var d=parseInt(point%100);
            m=(m>=10)?(""+m):("0"+m);
            d=(d>=10)?(""+d):("0"+d);
            var s= y+"-"+m+"-"+d;
            return s;
        }



    };
    var special={
        dataStyle: {
            normal: {
                label: {show:false},
                labelLine:{show:false}

            }
        },
        placeHolderStyle:{
            normal : {
                color: 'rgba(0,0,0,0)',
                label: {show:false},
                labelLine: {show:false}
            },
            emphasis : {
                color: 'rgba(0,0,0,0)'
            }
        }

    };


    var options={

        seq_point_bar_line:{
            title:{
                subtext:"",
                x:'center'
            },
            tooltip : {
                trigger: 'axis'
            },
            color:['red','#0091FE','orange'],
            legend: {
                data:['告警数','正常数','存储空间']
            },
            xAxis : [
                {
                    type : 'category',
                    data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name : '数量(条)',
                    axisLabel : {
                        formatter: '{value}'
                    }
                },
                {
                    type : 'value',
                    name : '容量(bit)',
                    axisLabel : {
                        formatter: '{value}'
                    }
                }
            ],
            series : [
                {
                    name:'告警数',
                    type:'bar',
                    stack: '日志总量',
                    data:[]
                },
                {
                    name:'正常数',
                    type:'bar',
                    stack: '日志总量',
                    data:[]
                },
                {
                    name:'存储空间',
                    type:'line',
                    yAxisIndex: 1,
                    data:[]
                }
            ]
        },
        pellet_point_scatter:{
            tooltip : {
                trigger: 'item',
                formatter:function(param){
                    var data=param.data;
                    var s="";
                    if(params.timeType=='hour'){
                         s= "时间:"+__function__.formatPoint2Time(data[0])+"<br/>日志大小:"+data[1]+"<br/>日志条数:"+data[2];
                    }else{
                        s= "时间:"+__function__.formatPoint2Date(data[0])+"<br/>日志大小:"+data[1]+"<br/>日志条数:"+data[2];
                    }
                    return s;
                }
            },
            title:{
                subtext:"",
                x:'center'
            },
            dataRange: {
                min: 0,
                max: 10000000,
                y: 'center',
                text:['条数(多)','条数(少)'],           // 文本，默认为数值文本
                color:['red','orange','yellow','#5FD2D4'],
                calculable : true
            },
            xAxis : [
                {
                    type : 'value',
                    scale : true,
                    axisLabel : {
                        formatter: function(param){
                            if(params.timeType=='hour'){
                                return __function__.formatPoint2Time(param);

                            }else{
                                return __function__.formatPoint2Date(param);
                            }

                        }
                    },
                    splitNumber:2,
                    min:0,
                    max:1440
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    position:'right',
                    scale : true
                }
            ],
            animation: false,
            series : [
                {
                    name:'时间-日志大小-条数',
                    type:'scatter',
                    symbolSize:2,
                    data:[]
                }
            ]
        },
        log_category_pie:{
            tooltip : {
                show: true,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: false,
                orient : 'vertical',
                x : document.getElementById('log_category_pie').offsetWidth/2,
                //x : 300,
                y : 45,
                itemGap:12,
                data:['应用进程日志','系统事件日志','用户登录日志','权限变更日志']
            },
            //color:['#0091FE','#0091FE','#FEA500','#6A71E5','#FF5534'],
            color:['#0091FE','#0091FE','#6A71E5','#FF5534','#FEA500'],


            series : [
                {
                    name:'应用进程日志',
                    type:'pie',
                    clockWise:false,
                    radius : [80, 100],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:75,
                            name:'应用进程日志'
                        },
                        {
                            value:25,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },

                {
                    name:'系统事件日志',
                    type:'pie',
                    clockWise:false,
                    radius : [60, 80],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:68,
                            name:'系统事件日志'
                        },
                        {
                            value:32,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'用户登录日志',
                    type:'pie',
                    clockWise:false,
                    radius : [40, 60],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:29,
                            name:'用户登录日志'
                        },
                        {
                            value:71,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'权限变更日志',
                    type:'pie',
                    clockWise:false,
                    radius : [20, 40],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:3,
                            name:'权限变更日志'
                        },
                        {
                            value:97,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                }

            ]

        }


    };
    var view={
        init:function(){
            var w=this;
            view.summary.call(w);
            view.deviceList.call(w);
            view.echarts_prepare.call(w,function(){
                view.load.call(w);
            });
        },
        load:function(){
            var w=this;
            view.seq_point_bar_line.call(w);
            view.pellet_point_scatter.call(w);
            view.log_category_pie.call(w);
            view.lasest_logs.call(w);
        },
        summary:function(){
            $.post(__ROOT__+'/Mirror/Index/summary',{}).success(function(json){
                 var data={};
                data['hostNum']=json['hostNum']||'--';
                var space_used=__function__.space_format(json['space_used']||0);
                data['space_used']=space_used['n'];
                var space_total=__function__.space_format(500*1024*1024*1024||0);
                data['space_total']=space_total['n'];
                var log_total=__function__.log_num_format(json['log']['total']||0);
                data['log_total']=log_total['n']+log_total['d'];
                var alarm_total=__function__.log_num_format(json['alarm']['total']||0);
                data['alarm_total']=alarm_total['n']+alarm_total['d'];

                $.each(data,function(k,v){
                    $("."+k,$("#summary")).text(v);
                });
                $(".space_used",$("#summary")).next(".global-unit").text(space_used['d']);
                $(".space_total",$("#summary")).next(".global-unit").text(space_total['d']);

            });
        },
        deviceList:function(){
            var w=this;
            $.post(__ROOT__+'/Mirror/Index/deviceList').success(function(json){
                 var data=json||{};
                $.each(data,function(_d,v){
                    var color="#000";
                    if(v==0){
                        color="red";
                    }
                    $("#deviceChange").append("<option value='"+_d+"' style='color:"+color+"'>"+(v==0?"失联:":"")+_d+"</option>")
                });


            });

        },
        echarts_prepare:function(callback) {
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
                    'echarts/chart/scatter'
                ],
                function (ec) {
                    w.seq_point_bar_line=ec.init(document.getElementById('seq_point_bar_line'));
                    w.pellet_point_scatter=ec.init(document.getElementById('pellet_point_scatter'));
                    w.log_category_pie=ec.init(document.getElementById('log_category_pie'));

                    callback&&callback.call(w);
                });
        },
        seq_point_bar_line:function(){
            var w=this;
            $.ajax({
                url:__ROOT__+'/Mirror/Index/seq_point',
                data:params,
                type:"post",
                success:function(json){
                    var data= json.data||{};
                    var log_nomalMap=data.log_nomal||{};
                    var log_warningMap=data.log_warning||{};
                    var log_errorMap=data.log_error||{};
                    var log_spaceMap=data.log_space||{};
                    var xAxis=__function__.mapset(log_nomalMap,true);

                    var log_nomal=__function__.mapset(log_nomalMap,false);
                    var log_warning=__function__.mapset(log_warningMap,false);
                    var log_space=__function__.mapset(log_spaceMap,false);
                    var log_error=__function__.mapset(log_errorMap,false)
                    var log_normal_all=[];
                    for(var i=0;i<log_warning.length;i++){
                        log_normal_all.push(log_warning[i]+log_nomal[i]);
                    }
                    options.seq_point_bar_line.series[1].data=log_normal_all;
                    options.seq_point_bar_line.series[0].data=log_error;
                    options.seq_point_bar_line.series[2].data=log_space;
                    options.seq_point_bar_line.xAxis[0].data=xAxis;
                    if(params.timeType=='hour'){
                        options.seq_point_bar_line.title.subtext="数据间隔:"+json.other+"分钟";
                    }else{
                        options.seq_point_bar_line.title.subtext="数据间隔:1天";
                    }

                    w.seq_point_bar_line.clear();
                    w.seq_point_bar_line.hideLoading();
                    w.seq_point_bar_line.setOption(options.seq_point_bar_line);

                }

            });


        },
        pellet_point_scatter:function(){
            var w=this;
            $.post(__ROOT__+'/Mirror/Index/pellet_point',params).success(function(json){
                var data= json.data||{};
                var arr=[];
                var maxNum=0;
                var minTime=99999999;
                var maxTime=0;
                $.each(data,function(time,map){

                    $.each(map,function(bit,num){
                        maxNum=num>maxNum?num:maxNum;
                        var timePoint=0;
                        if(params.timeType=='hour'){
                            timePoint=__function__.formatTime2Point(time);

                        }else{
                            timePoint=__function__.formatDate2Point(time);
                        }
                        var _d=[timePoint,parseInt(bit),num];
                        arr.push(_d);
                        maxTime=timePoint>maxTime?timePoint:maxTime;
                        minTime=timePoint<minTime?timePoint:minTime;

                    });
                });

                options.pellet_point_scatter.dataRange.max=maxNum;
                options.pellet_point_scatter.series[0].data=arr;
                options.pellet_point_scatter.xAxis[0].min=minTime;
                options.pellet_point_scatter.xAxis[0].max=maxTime;
                if(params.timeType=='hour'){
                    options.pellet_point_scatter.xAxis[0].splitNumber=8;
                    options.pellet_point_scatter.title.subtext="取样间隔:"+json.other+"分钟";
                }else{
                    options.pellet_point_scatter.xAxis[0].splitNumber=1;
                    options.pellet_point_scatter.title.subtext="取样间隔:1天";
                }


                w.pellet_point_scatter.clear();
                w.pellet_point_scatter.setOption(options.pellet_point_scatter);

            });

        },
        log_category_pie:function(){
            var w=this;
            $.post(__ROOT__+'/Mirror/Index/log_category',params).success(function(json){
                var data=json.data||{};
                var total=json.other;
                options.log_category_pie.series[0].data[0].value=data.APPLICATION.C_ALL||0;
                options.log_category_pie.series[0].data[1].value=total-(data.APPLICATION.C_ALL||0);
                options.log_category_pie.series[1].data[0].value=data.SYSTEMEVENT.C_ALL||0;
                options.log_category_pie.series[1].data[1].value=total-(data.SYSTEMEVENT.C_ALL||0);
                options.log_category_pie.series[2].data[0].value=data.USERLOGIN.C_ALL||0;
                options.log_category_pie.series[2].data[1].value=total-(data.USERLOGIN.C_ALL||0);
                options.log_category_pie.series[3].data[0].value=data.RIGHTEXCHANGE.C_ALL||0;
                options.log_category_pie.series[3].data[1].value=total-(data.RIGHTEXCHANGE.C_ALL||0);


                w.log_category_pie.setOption(options.log_category_pie);

                var _mData={};
                _mData['APPLICATION_PECENT']=((data.APPLICATION.C_ALL||0)*100/(json.other||1)).toFixed(0)+"%";
                _mData['APPLICATION_TOTAL']=data.APPLICATION.C_ALL||0;
                _mData['APPLICATION_SPACE']=data.APPLICATION.space||0;
                _mData['APPLICATION_WARNING']=(data.APPLICATION.C_APPLICATION_error||0);
                    //+(data.APPLICATION.C_APPLICATION_fail||0);

                _mData['USERLOGIN_PECENT']=((data.USERLOGIN.C_ALL||0)*100/(json.other||1)).toFixed(0)+"%";
                _mData['USERLOGIN_TOTAL']=data.USERLOGIN.C_ALL||0;
                _mData['USERLOGIN_SPACE']=data.USERLOGIN.space||0;
                _mData['USERLOGIN_WARNING']=(data.USERLOGIN.C_USERLOGIN_error||0);
                    //+(data.USERLOGIN.C_USERLOGIN_fail||0);

                _mData['RIGHTEXCHANGE_PECENT']=((data.RIGHTEXCHANGE.C_ALL||0)*100/(json.other||1)).toFixed(0)+"%";
                _mData['RIGHTEXCHANGE_TOTAL']=data.RIGHTEXCHANGE.C_ALL||0;
                _mData['RIGHTEXCHANGE_SPACE']=data.RIGHTEXCHANGE.space||0;
                _mData['RIGHTEXCHANGE_WARNING']=(data.RIGHTEXCHANGE.C_RIGHTEXCHANGE_error||0);
                    //+(data.RIGHTEXCHANGE.C_RIGHTEXCHANGE_fail||0);

                _mData['SYSTEMEVENT_PECENT']=((data.SYSTEMEVENT.C_ALL||0)*100/(json.other||1)).toFixed(0)+"%";
                _mData['SYSTEMEVENT_TOTAL']=data.SYSTEMEVENT.C_ALL||0;
                _mData['SYSTEMEVENT_SPACE']=data.SYSTEMEVENT.space||0;
                _mData['SYSTEMEVENT_WARNING']=(data.SYSTEMEVENT.C_SYSTEMEVENT_error||0);
                    //+(data.SYSTEMEVENT.C_SYSTEMEVENT_fail||0);
                $.each(_mData,function(key,value){
                    var _wrap= $("."+key,$(".log_category-body"));
                    if(_wrap.hasClass("n_format")){
                        var _map=__function__.log_num_format(value);
                        _wrap.text(_map['n']);
                        _wrap.next(".unit").text(_map['d']);
                    }else if(_wrap.hasClass("s_format")){
                        var _map=__function__.space_format(value,1);
                        _wrap.text(_map['n']);
                        _wrap.next(".unit").text(_map['d']);
                    }else{
                        _wrap.text(value);
                    }
                });

            });
        },
        lasest_logs:function(){
            var w=this;
            $.post(__ROOT__+'/Mirror/Index/latest_logs',params).success(function(json){

                var data=json.data||{};
                var tbody=$("tbody",$("#lasestlog_table"));
                tbody.html("");
                var trs=[];
                var n =0;
                $.each(data,function(uuid,_m){
                    var ip=_m.key.split("_")[0];
                    n++;
                    //var tr=$("<tr key='"+_m.key+"'  class='one_log' uuid='"+uuid+"' ><td>"+_m.time+"</td><td>"+_m.key+"</td><td>"+ip+"</td><td class='logs' title='"+_m.log+"'><div data-toggle='modal' data-target='.myModal'>"+_m.log+"</div></td></tr>");
                    var tr=$("<tr key='"+_m.key+"'  class='one_log' uuid='"+uuid+"' ><td>"+_m.time+"</td><td>"+_m.key+"</td><td>"+ip+"</td><td class='logs' title='"+_m.log+"' >"+_m.log+"</td></tr>");
                    trs.push(tr);

                });
                for(var i=trs.length-1;i>=0;i--){
                    tbody.append(trs[i]);
                }

            });



        }
    };
    var handler={

       init:function(){
           var w=this;
            $("li",$("#timeChange")).bind("click",function(){

                params.timeType=$(this).attr("timeType");
                params.timeNum=$(this).attr("timeNum");
                view.load.call(w);
                $("li",$("#timeChange")).removeClass("active");
                $(this).addClass("active");
            });
           $("#deviceChange").bind("change",function(){
               var keys=$(this).val();
               params.keys=keys;
               view.load.call(w);
           });
           //$(".one_log",$("#lasestlog_table")).live("click",function(){
           //     var uuid=$(this).attr("uuid");
           //     var key=$(this).attr("key");
           //    $.post(__ROOT__+'/Mirror/Index/latest_logs',{keys:key}).success(function(json){
           //        var data=json.data||{};
           //        storm.alert(JSON.stringify(data));
           //    });
           //});
           $('.logs').live('click', function(){
               $('.myModal').modal();
               $('.myModal .modal-title').text($(this).parent('tr').attr('key'))
               $('.myModal .modal-body').text($(this).attr('title'))
           })

       }

    };

    $(document).ready(function(){
        app.init();

    });
})();