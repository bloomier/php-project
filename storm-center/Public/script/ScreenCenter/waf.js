(function(){
    var toggle={
        flowRank:"lasest",
        visitCountRank:"lasest",
        attackCountRank:"lasest",
        ipCountRank:"visitIP"
    };
    var modelInit={
        thresholdValue:100,  //告警阀值
        modalTitle:"提示信息",
        currentValue:"",
        currentTime:"",
        modalState:false,
        province:"浙江"
    }
    var _intervals={
        flowRankRefresh:60*1000,
        visitCountRankRefresh:60*1000,
        sortInterval:500,//排行榜的排序间隔
        lineChartRefresh:60*1000,
        attackCountRankRefresh:60*1000,
        todayAttackCountRefresh:60*1000,
        modalDisplay:5*1000
    };
    var ipList =['172.16.7.104','172.16.7.105','172.16.7.106','172.16.7.107','172.16.7.108','172.16.7.112','172.16.7.113','172.16.7.114'];

    var __function__={
        getLast30Mins:function(){
            var times=[];
            var date=new Date();
            var hour=date.getHours();
            var min=date.getMinutes();
            for(var i=min-29;i<=min;i++){
                var _h=hour;
                var _m=i;
                if(i<0){
                    _h=hour-1;
                    if(_h<0){
                        _h=23;
                    }
                    _m=60+i;
                }
                _h=_h<10?("0"+_h):_h;
                _m=_m<10?("0"+_m):_m;
                times.push(_h+":"+_m);
            }
            return times;
        },
        //遍历json数据 keySet = false
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
        }

  }
    var app={
        init:function(){
            var w=this;
            app.scoller();
            app.handler();
            app.normalVisit();//正常访问流量和非正常访问流量
            app.attactTimes();//攻击次数和访问次数
            app.engineIPScoller();//引擎IP回滚

            app.initWarnModel();
           // app.header_flow();
        },
        //头部的数据显示
        header_flow:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/ScreenCenter/CloudMonitor/flowsInOneMin",{deviceId: w.deviceConf['old_key']}).success(function(json){
                    var ins=json['in'];
                    var outs=json['out'];
                    $.each(ins,function(i,_in){
                        setTimeout(function(){
                            $(".flow_in_count").text(ins[i]);
                            $(".flow_out_count").text(outs[i]);
                            var total=ins[i]+outs[i];
                            var level=1;
                            if(total>=_thresholds.flow_mid[0]&&total<_thresholds.flow_mid[1]){
                                level=2;
                            }else if(total>=_thresholds.flow_mid[1]){
                                level=3;
                            }
                            if(level==3){
                                if(!w.myModalShow){

                                    $(".flow-msg-info").text(total.toFixed(2)+"M");
                                    __function__.circle.call(w,$("#myModal .circle:eq(2)"),(total*100/_thresholds.flow_max).toFixed(2),true);
                                    var rd1=(Math.random()*20+10).toFixed(2);
                                    __function__.circle.call(w,$("#myModal .circle:eq(0)"),rd1,rd1>_thresholds.cpu_danger);
                                    var rd2=(Math.random()*60+30).toFixed(2);
                                    __function__.circle.call(w,$("#myModal .circle:eq(1)"),rd2,rd2>_thresholds.memory_danger);

                                    $('#myModal').modal('show');
                                    var file = [];
                                    file['mp3'] = __PUBLIC__+"/source/vedio/alarm.mp3";
                                    __function__.audioplayer('audioplane', file, false);
                                }

                            }
                        },i*_intervals.flowRealTimeToggle);
                    });
                });

            }
            start();
            setInterval(start,_intervals.flowRealTimeRefresh);
        },


        scoller:function(){
            //站点流量排行
            var w=this;
            var flowRank=function(){
                w.flowRankScoller= $("tbody",$('#flowRank')).itemScoller({
                    ajaxUrl:__ROOT__+'/ScreenCenter/Waf/flowRank',
                    items:toggle.flowRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.flowRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        var max=json[toggle.flowRank][0]['value'];
                        var pecent=(item.value*100/max).toFixed(2);
                        var mb=(item.value * 8 /1024/1024).toFixed(2)+"M";

                        var el = $(" <tr><td>"+item.name+"</td>"+
                            "<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+mb+"</span></div></div></td>"+
                            +"</tr>");
                        return el;
                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    }
                });
            };
            flowRank();

            // 站点访问和攻击IP排行
            var ipRank=function(){
                w.ipRankScoller= $("tbody",$('#ipRank')).itemScoller({
                    ajaxUrl:__ROOT__+'/ScreenCenter/Waf/ipCountRank',
                    items:toggle.ipCountRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.attackCountRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        var max=json[toggle.ipCountRank][0]['value'];
                        var location= item.location;
                        if(location=='国外'){
                            location='国内';
                        }

                        var width = (item.value/max) * 100;
                        var el=$('<tr><td style="width: 20%">'+location+'</td>'+
                        '<td style="width: 60%"><div class="progress"><div class="progress-bar"  style="width: '+width+'%;"><span>'+item.name+'</span></div></div></td>'+
                        '<td >&nbsp'+item.value+'</td></tr>');
                        return el;

                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    }

                });
            };
            ipRank();


            //站点访问量排行
            var flowVisit=function(){
                w.visitCountRankScoller= $("tbody",$('#visitCountRank')).itemScoller({
                    ajaxUrl:__ROOT__+'/ScreenCenter/Waf/visitCountRank',
                    items:toggle.visitCountRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.visitCountRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        var max=json[toggle.visitCountRank][0]['value'];
                        var pecent=(item.value*100/max).toFixed(2);
                        var el = $(" <tr><td>"+item.name+"</td>"+
                            "<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+item.value+'次'+"</span></div></div></td>"+
                            +"</tr>");
                        return el;
                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    }

                });
            };
            flowVisit();
            //站点攻击量排行
            var flowAttack=function(){
                w.attackCountRankScoller= $("tbody",$('#attackCountRank')).itemScoller({
                    ajaxUrl:__ROOT__+'/ScreenCenter/Waf/attackCountRank',
                    items:toggle.attackCountRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.attackCountRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        var max=json[toggle.attackCountRank][0]['value'];
                        var pecent=(item.value*100/max).toFixed(2);
                        var el = $(" <tr><td>"+item.name+"</td>"+
                            "<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+item.value+'次'+"</span></div></div></td>"+
                            +"</tr>");
                        return el;
                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    },
                    externals:[function(prev,current){
                        var lasestCount=current.lasest?current.lasest.length:0;
                        var todayCount=current.all?current.all.length:0;
                        $(".attackWebSiteCount").text(todayCount);
                    }]


                });
            };
            flowAttack();
            //引擎IP自动生成栏
            var mainState=function(){
                var iplist =ipList.join(",");
                $.post(__ROOT__ + '/ScreenCenter/Waf/mainState',{"ipList":iplist}).success(function (json) {
                    $(".waf-items").html("");
                    var IpDataList = [];
                    $.each(json['hostinfo'],function(point,item){
                        item['ip'] = point;
                        IpDataList.push(item);

                      //  var el = '<tr>' +
                      //      '<td>'+ point+'</td>' +
                      //      '<td>浙江</td>' +
                      //      '<td>正常</td>' +
                      //      '<td>'+((item["io"].split('KB'))[0]/1024).toFixed(2)+'M'+'</td>' +
                      //      '<td>'+item['memery']+'</td>' +
                      //      '<td>'+item['cpu']+'</td>' +
                      //      '</tr>';
                      ///*  $("td",tr).css("color","#99FF66");
                      //  $("td",tr).css("font-size",'15px');
                      //  $("td",tr).css("font",'bold');*/
                      //  //item.status=="正常"'':''
                      //  $(".enginIp tbody").append(el);
                    });
                    IpDataList=IpDataList.sort(function(a,b){

                        return parseInt(b['io'].substring(0,b['io'].length-2))-parseInt(a['io'].substring(0,a['io'].length-2));
                    });

                    $.each(IpDataList,function(point,item){
                        var el = '<tr>' +
                            '<td>'+ item["ip"]+'</td>' +
                            '<td>浙江</td>' +
                            '<td>正常</td>' +
                            '<td>'+((item["io"].split('KB'))[0]/1024).toFixed(2)+'M'+'</td>' +
                            '<td>'+item['memery']+'</td>' +
                            '<td>'+item['cpu']+'</td>' +
                            '</tr>';
                        $(".enginIp tbody").append(el);
                    });
                });
            };
            mainState();
            setInterval(function(){
                mainState();
            },3*60*1000);

           //当天受攻击次数
            var attackTimes=function(){
                 $.post(__ROOT__ + '/ScreenCenter/Waf/attackTimes').success(function (json) {
                     var prev=w.todayAttackPrevCount||0; //定义
                      var current=json.today;
                      startCount($(".attackCount"),{
                         from:prev,
                         to:current,
                         speed:_intervals.todayAttackCountRefresh-10000
                     });
                     w.todayAttackPrevCount=current;
                 });
            };
            attackTimes();
            setInterval(function(){
                attackTimes();
            },_intervals.todayAttackCountRefresh);

            //防护中、总站点数
            var domainCount=function(){
                $.post(__ROOT__ + '/ScreenCenter/Waf/domainCount').success(function (json) {
                  $(".monitorWebSiteCount").text(json.defenseTotal+"/"+json.total);
                });
            };
            domainCount();
            setInterval(function(){
                domainCount();
            },10*60*1000);

        },
        handler:function(){
            var w=this;
            $(".btn-flowRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.flowRankScoller.reloadOption({items:type});//json.all 和 json.lasest 之间切换 插件中修改其option
                w.flowRankScoller.refresh(true);//true代表马上刷新
                toggle.flowRank=type;
            });
            $(".btn-visitCountRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.visitCountRankScoller.reloadOption({items:type});
                w.visitCountRankScoller.refresh(true);
                toggle.visitCountRank=type;
            });
            $(".btn-attactCountRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.attackCountRankScoller.reloadOption({items:type});
                w.attackCountRankScoller.refresh(true);
                toggle.attackCountRank=type;
            });

            $(".btn-IPRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.ipRankScoller.reloadOption({items:type});
                w.ipRankScoller.refresh(true);
                toggle.ipCountRank=type;
            });

        },
        //引擎IP滚动栏
        engineIPScoller:function(){

            var w = this;
            var y = 0;
            var innerEl = $('#info');
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);
            setInterval(function(){
                y = y - 0.8;
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
            },200)
        },
        //正常访问流量和非正常访问流量
        normalVisit:function(){
                var w = this;
                require.config({
                    paths: {
                        'echarts': __ECHART__
                    }
                });
                require([
                    'echarts',
                    'echarts/chart/line'
            ],function(ec,theme){
                var myChart =ec.init(document.getElementById('visit-realtime-chart'),'macarons');
                var  option = {
                     tooltip : {
                          trigger: 'axis'
                     },
                     legend: {
                        y: 50,
                         textStyle: {
                             color: '#fff',
                             fontSize: 16,
                             fontWeight:14
                         },
                         data:[
                             '正常访问流量',
                             '非正常访问流量'
                         ]
                     },
                     grid:{
                       borderWidth:0
                     },
                     calculable : false,
                     dataZoom : {
                         show : true,
                         realtime : true,
                         start :0,
                         end : 100,
                         height: 20,
                         fillerColor:'rgba(255, 255, 255, .1)',
                         handleColor:'rgba(6,122,235,.6)',
                         backgroundColor:'rgba(255, 255, 255, .1)'
                    },
                    xAxis : [
                        { name:'/分钟',
                            type: 'category',
                            boundaryGap: true,
                            axisLabel: { //坐标轴文本
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 13
                                }
                            },
                           axisLine: {// 坐标轴线
                                show: true
                            },
                           axisTick: {//坐标轴小标记
                                show: true
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            splitArea: {
                                show: false
                            },

                            data: []
                           }
                    ],
                    yAxis : [
                        {
                            type: 'value',
                            name: 'M',
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
                                show: true
                            },
                            splitLine: { // 网格线
                             show: false
                            },
                            splitArea: {
                                show: false
                            }
                         }
                    ],
                    series : [
                        {
                            symbol:'none',
                            name:'正常访问流量',
                            type:'line',
                            itemStyle: {
                                normal: {
                                    color:'#02FF02',
                                    lineStyle: {
                                        width:  1
                                    }
                                }
                            },
                            data:[]
                        },
                        {
                            symbol:'none',
                            itemStyle: {
                                normal: {
                                    color: '#FF0000',
                                    lineStyle: {
                                        width:  1
                                    }
                                }
                            },
                            name:'非正常访问流量',
                            type:'line',
                            data:[]
                        }
                    ]
                };
                var start=function(){
                    var mySort = function(a,b){

                    }
                    $.post(__ROOT__ + '/ScreenCenter/Waf/flowNormalCounterList').success(function (json) {
                        var visitOutMap=json['flowVisitOut']||{}; //总站点数
                        var spiderVisitMap=json['spiderOutCounter']||{};//非正常访问
                        var xAxis=[];
                        var spiderVisit=[];
                        var normalVisit=[];


                        var keysets = [];
                        $.each(visitOutMap,function(k,v){
                            keysets.push(k);
                        });
                        keysets.sort();
                        $.each(keysets,function(k,v){
                            xAxis.push(v.split(" ")[1]);
                            spiderVisitMap[v] ? spiderVisit.push(spiderVisitMap[v]) : spiderVisit.push(0);
                            spiderVisitMap[v] ? normalVisit.push(visitOutMap[v] - spiderVisitMap[v]) : normalVisit.push(visitOutMap[v]);
                        });




                        var normalVisitOut=[];
                        var spiderVisiteOut=[];
                        for(var i= 0,j=0;i<normalVisit.length,j<spiderVisit.length;i++,j++){
                            var normal = (8 * normalVisit[i]/1024/1024/60).toFixed(2);
                            var spider = (8 * spiderVisit[j]/1024/1024/60).toFixed(2);
                             normalVisitOut.push(normal);
                             spiderVisiteOut.push(spider);
                        }
                        option.series[0].data = normalVisitOut;
                        option.series[1].data = spiderVisiteOut;
                        option.xAxis[0].data = xAxis;
                        var currentDate = new Date();
                        var currentYear = currentDate.getFullYear();
                        var currentMonth = currentDate.getMonth()+1<10?"0"+(currentDate.getMonth()+1):currentDate.getMonth()+1;
                        var currentDate = currentDate.getDate()<10?"0"+currentDate.getDate():currentDate.getDate();
                        modelInit.currentTime = currentYear+"-"+currentMonth+"-"+currentDate+" "+xAxis[xAxis.length-1];
                        myChart.setOption(option);
                        if(normalVisitOut[normalVisitOut.length-1]>=modelInit.thresholdValue){
                            modelInit.currentValue = normalVisitOut[normalVisitOut.length-1];
                            if(!modelInit.modalState){
                                $('#myModal').modal('show');
                                $('#chatAudio')[0].play();
                                //$(".close",$("#myModal")).on("click",function(){
                                //    $('#myModal').modal('hide');
                                //
                                //});
                            }
                        }
                    });
                 };
                start();
                setInterval(start,_intervals.lineChartRefresh);
            });

        },

        //攻击次数和访问次数
        attactTimes:function(){
            var w = this;
            require.config({
                paths: {
                    'echarts': __ECHART__
                }
            });
            require([
                'echarts',
                'echarts/chart/line'
            ],function(ec,theme){
                var myChart =ec.init(document.getElementById('flow-realtime-chart'),'macarons');
                var  option = {
                    tooltip : {
                        trigger: 'axis'
                    },
                    legend: {
                        y: 50,
                        textStyle: {
                            color: '#fff',
                            fontSize: 16,
                            fontWeight:14
                        },
                        data:[ '访问次数','攻击次数' ]
                    },
                    grid:{
                        borderWidth:0
                    },
                    calculable : false,
                    dataZoom : {
                        show : true,
                        realtime : true,
                        start :0,
                        end : 100,
                        height: 20,
                        fillerColor:'rgba(255, 255, 255, .1)',
                        handleColor:'rgba(6,122,235,.6)',
                        backgroundColor:'rgba(255, 255, 255, .1)'
                    },
                    xAxis : [
                        {
                            name: '/分钟',
                            type: 'category',
                            boundaryGap: true,
                            axisLabel: { //坐标轴文本
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 13
                                }
                            },
                            axisLine: {// 坐标轴线
                                show: true
                            },
                            axisTick: {//坐标轴小标记
                                show: true
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            data: []
                        }
                    ],
                    yAxis : [
                        {
                            type: 'value',
                            name: '次',
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
                                show: true
                            },
                            splitLine: { // 网格线
                                show: false
                            },
                            splitArea: {
                                show: false
                            }
                        }
                    ],
                    series : [
                        {
                            symbol:'none',
                            name:'访问次数',
                            type:'line',
                            dataFilter: 'nearst',
                            itemStyle: {
                                normal: {
                                    color:'#02FF02',
                                   //rgba(0,255,0,1)
                                    lineStyle: {
                                        width:  1
                                    }
                                }

                            },
                            data:[]
                        },
                        {
                            symbol:'none',
                            itemStyle: {
                                normal: {
                                    color: 'red',
                                  //  fontWeight:'blod'//rgba(255,0,0,1)
                                    lineStyle: {
                                        width:  1
                                    }
                                }

                            },
                            dataFilter: 'nearst',
                            name:'攻击次数',
                            type:'line',
                            data:[]
                        }
                    ]
                };
                var start=function(){
                    $.post(__ROOT__ + '/ScreenCenter/Waf/visitAttackCounterList').success(function (json) {
                        var visitMap=json.visit||{};
                        var attackMap=json.attack||{};
                        var xAxis=[];
                        var keySets = [];
                        $.each(visitMap,function(k,v){
                            keySets.push(k);
                        });
                        keySets = keySets.sort();
                        var visit=[];
                        var attack=[];
                        $.each(keySets,function(k,v){
                            xAxis.push(v.split(" ")[1]);
                            visit.push(visitMap[v]);
                            attack.push(attackMap[v]);
                        });
                        //var visit=__function__.mapset(visitMap,false);
                        //var attack=__function__.mapset(attackMap,false);
                        option.series[0].data = visit;
                        option.series[1].data = attack;
                        option.xAxis[0].data = xAxis;
                        myChart.setOption(option);
                    });
                };
                start();
                setInterval(start,_intervals.lineChartRefresh);
            });
         },
        //告警框
        initWarnModel:function(){
            $('#myModal').modal('hide');
            $('#myModal').on("shown.bs.modal",function(){
                modelInit.modalState = true;

                $.post(__ROOT__+'/ScreenCenter/Waf/flowRank',{"point":2}).success(function(json){
                    //console.info(json);
                    $.each(json['lasest'],function(point,item){
                        if(point<=4){
                            var tr = '<tr><td>'+item['name']+'</td><td>'+item['value']+'</td></tr>';
                            $(".jm_flowRank tbody").append(tr);
                        }
                    });
                });

                var iplist =ipList.join(",");
                $.post(__ROOT__ + '/ScreenCenter/Waf/mainState',{"ipList":iplist}).success(function(json){
                    //console.info(json);
                    var IpDataList = [];
                    $.each(json['hostinfo'],function(point,item){
                        item['ip'] = point;
                        IpDataList.push(item);
                    });
                    IpDataList=IpDataList.sort(function(a,b){

                        return parseInt(b['io'].substring(0,b['io'].length-2))-parseInt(a['io'].substring(0,a['io'].length-2));
                    });

                    $.each(IpDataList,function(point,item){
                        if(point<=4){
                            var io = ((item["io"].split('KB'))[0]/1024).toFixed(2);
                            var tr = '<tr><td>'+modelInit.province+'</td><td>'+item['ip']+'</td><td>'+io+'M</td></tr>';
                            $(".jm_mainState tbody").append(tr);
                        }
                    });
                });

                $.post(__ROOT__+'/ScreenCenter/Waf/ipCountRank',{"point":2}).success(function(json){
                    //console.info(json);
                    var visitIP = {};
                    var attackIP = {};
                    var ipCount = [];
                    $.each(json['visitIP'],function(point,item){
                        visitIP[item['name']] = item;
                    });

                    $.each(json['attackIP'],function(point,item){
                        attackIP[item['name']] = item;
                        //if(point<=4){
                        //    var tr = '<tr><td>'+item['location']+'</td><td>'+item['name']+'</td><td>'+item['value']+'</td></tr>';
                        //    $(".jm_ipCountRank tbody").append(tr);
                        //}
                    });

                    $.each(visitIP,function(point,item){
                        if(attackIP[point]){
                            item['value'] = item['value']+attackIP[point]['value'];
                        }
                        ipCount.push(item);
                    });
                    ipCount = ipCount.sort(function(a,b){
                        return b['value']-a['value'];
                    });
                    $.each(ipCount,function(point,item){
                        if(point<=4){
                            var tr = '<tr><td>'+item['location']+'</td><td>'+item['name']+'</td><td>'+item['value']+'</td></tr>';
                            $(".jm_ipCountRank tbody").append(tr);
                        }
                    });
                });

                var p = $('<p><span>当前流量阀值：'+modelInit.thresholdValue+'M</span>&nbsp&nbsp<span>当前流量：'+modelInit.currentValue+'M</span>&nbsp&nbsp<span>告警时间：'+modelInit.currentTime+'</span></p>');
                p.css("color","red"||'#56b6ff');
                p.appendTo($(".jm_reportMsg",$("#myModal")));
                p.addClass("a-fadeinR");
                //setTimeout(function(){
                //    $('#myModal').modal('hide');
                //},_intervals.modalDisplay);

            });
            $('#myModal').on("hidden.bs.modal",function(){
                modelInit.modalState = false;
                $(".jm_tbody",$("#myModal")).html("");
                $(".jm_reportMsg",$("#myModal")).html("");
                $('#chatAudio')[0].pause();
                $('#chatAudio')[0].currentTime = 0.0;
            });

        }


    };


    $(document).ready(function(){
        var  __ECHART__ = $("#echartPath").val();
        var width = $(window).width();
        var height = $(window).height();
        $('.j-scroll-height').height(height *.225); /*四个框的高度*/
        $('.flow-scroll-height').height((height *.45)+50);
        $('.j-gridScroll').height(height *.2);
        //$('.main').height(height *.45);
        /*趋势图的高度*/
        $('#flow-realtime-chart,#flow-day-chart,#visit-realtime-chart,#visit-day-chart').height(height *.3);
        $('#flow-realtime-chart,#flow-day-chart,#visit-realtime-chart,#visit-day-chart').css({
            "margin-top": '-50px'
        })
        app.init();
     /*   $('.attack-modal .attack-ip').typetype('172.16.36.98')
        $('.attack-modal .attack-place').typetype('浙江杭州')
        $('.attack-modal .attack-type').typetype('CC')
        $('.attack-modal .attack-io').typetype('156M')
        $('.attack-modal .attack-time').typetype('09：30：25')
        $('.attack-modal .attack-target').typetype('www.baidu.com')*/
        $('.attack-ip').typewriting("172.16.36.98", {
            "typing_interval": 300,
            "blink_interval": "1s",
            "cursor_color": "#00fd55"
        });

    });
})();
