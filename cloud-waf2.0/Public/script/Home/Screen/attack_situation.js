/**
 * Created by shijiaoyun on 2016/4/25.
 */
var attackSituation;
(function(){

    var forceDailyChart ;
    var forceHistoryChart;

    var toggle={
        flowRank:"lasest",
        visitCountRank:"lasest",
        attackCountRank:"lasest",
        visitAndAttackTopN:"attack"
    };

    var visitAndAttackData={
        visit:{},
        attack:{}
    };

    var _intervals={
        flowRankRefresh:60*1000,
        visitCountRankRefresh:60*1000,
        sortInterval:500,//排行榜的排序间隔
        lineChartRefresh:60*1000,
        ccTableRefresh:60*1000,
        defenseTableRefresh:60*1000,
        policyTableRefresh:60*1000,
        visitAndAttackRefresh:60*1000,
        attackCountRankRefresh:60*1000,
        todayAttackCountRefresh:60*1000,
        visitAndAttactkTopN: 5 * 60 * 1000,
        warnInterval:60*1000*2,
        modalDisplay:20*1000 //弹框自动消失时间

    };

    var __function__= {
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

        initTable:function(data,thead,tableClass,warningType){
            var newTable = $("#modalTable").clone().remove("id").show().addClass(tableClass);
            //$(".m-main-b",$("#myModal1")).html('');
            $(".m-main-b",$("#myModal1")).append(newTable);
            $(".headTable tr",$("."+tableClass)).html("");
            $.each(thead,function(point,item){
                var td = "<th>"+item+"</th>";
                $(".headTable tr",$("."+tableClass)).append(td);
            });
            $(".bodyTable tbody",$("."+tableClass)).html("");
            $.each(data,function(k,v){
                var tr = $("<tr class='c-yellow'><td title='双击进入添加访问控制页'>"+v['td1']+"</td><td>"+v['td2']+"</td><td>"+v['td3']+" 次</td></tr>");
                if(warningType =="SCANATTACK"){
                    tr = $("<tr class='c-yellow'><td title='双击进入添加访问控制页'>"+v['td1']+"</td><td>"+v['td2']+"</td><td>"+v['td3']+" 步</td></tr>");
                }
                if(!warningType){
                    tr = $("<tr class='c-yellow'><td title='双击进入添加访问控制页'>"+v['td1']+"</td><td>"+v['td2']+"</td><td>"+v['td3']+"</td></tr>");
                }
                //双击进入访问控制页
                tr.bind("dblclick",function(){
                    //var value = $(this).attr("ip");
                    window.open(__ROOT__ + '/Home/Access/addAccess/ip/' + v['td1']);
                });
                tr.css({"cursor":"pointer"});
                $(".bodyTable tbody",$("."+tableClass)).append(tr);

            });
            $('.bodyTable',$("."+tableClass)).parent("div").addClass("scrollbar");
            $('.scrollbar',$("."+tableClass)).mCustomScrollbar({
                autoHideScrollbar:true,
                theme:"minimal-dark"
            });
        },
        initTable1:function(data,thead){
            $("#flowNone .tableHeard thead").html("");
            var heardTr = $('<tr></tr>');
            $.each(thead,function(point,item){
                var th = '<th>'+item+'</th>';
                heardTr.append(th);
            });
            $("#flowNone .tableHeard thead").append(heardTr);
            $("#flowNone .attackURL tbody").html("");
            for(var i=0;i<10;i++){
                var tr = "<tr class='c-yellow'><td>111</td><td>111</td><td>111 次</td></tr>";
                $("#flowNone .attackURL tbody").append(tr);
            }

        }

    };
    attackSituation={
        init:function(currentDateKey,domain,callback){

            var w=this;

            //$.post(__ROOT__+"/Home/DailyReport/cloudwafData",{domain: domain,dateKey: dateKey}).success(function(json){
            //    w.cloudwafData=json.data;
            //    callback&&callback();
            //});

            $('.scrollbar-h').mCustomScrollbar({
                axis:"x",
                autoHideScrollbar:true,
                theme:"minimal-dark"
                //autoExpandScrollbar:true,
                //advanced:{autoExpandHorizontalScroll:true}

            });
            attackSituation.view.load.call(w);

        },
        hadder: function(){
            var w = this;
            $(".btn-visitCountRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.visitCountRankScoller.reloadOption({items:type});
                w.visitCountRankScoller.refresh(true);
                toggle.visitCountRank=type;
            });
            $(".btn-attackCountRank").bind("click",function(){
                var type=$(this).attr("toggle");
                w.attackCountRankScoller.reloadOption({items:type});
                w.attackCountRankScoller.refresh(true);
                toggle.attackCountRank=type;
            });

            $(".btn-visitAndAttackTopN").bind("click",function(){
                var type=$(this).attr("toggle");
                toggle.visitAndAttackTopN = type;
                w.getVisitAndAttackTopN();
            });


            //$(".clickTr").bind("click",function(){
            //    var value = $(this).attr("ip");
            //    alert(value);
            //});
        },
        options:{
            attack_visit_line:{
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
            },
            force:{
                title : {
                    x: 'left',
                    textStyle: {
                        color: '#067aeb',
                        fontSize: 16,
                        fontWeight: 'bold'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: '{a} : {b}'
                },

                series : [
                    {
                        type:'force',
                        name : "关系",
                        ribbonType: false,
                        categories : [
                            {
                                name: '人物'
                            },
                            {
                                name: '当天主要攻击目标'
                            }
                        ],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                },
                                nodeStyle : {
                                    brushType : 'both',
                                    borderColor : 'rgba(255,215,0,0.4)',
                                    borderWidth : 1
                                },
                                linkStyle: {
                                    type: 'curve'
                                }
                            },
                            emphasis: {
                                label: {
                                    show: false
                                    // textStyle: null      // 默认使用全局文本样式，详见TEXTSTYLE
                                },
                                nodeStyle : {
                                    //r: 30
                                },
                                linkStyle : {}
                            }
                        },
                        useWorker: false,
                        minRadius : 15,
                        maxRadius : 25,
                        gravity: 1.1,
                        scaling: 1.1,
                        // roam: 'move',
                        nodes:[
                        ],
                        links : [
                        ]
                    }
                ]
            }
        },
        view:{
            load:function(){
                var w=this;
                attackSituation.view.echarts_prepare.call(w,function(){
                    attackSituation.view.daily_attack_visit_flow_line.call(w);

                });



            },
            echarts_prepare:function(callback){
                var w=this;
                //w.attack_trail_sankey = echarts.init(document.getElementById('attack_trail_sankey'));
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });
                require(
                    [
                        'echarts',
                        'echarts/chart/line',
                        'echarts/chart/force'
                        //'echarts/chart/map',
                        //'echarts/chart/bar',
                        //'echarts/chart/radar'

                    ],
                    function (ec) {

                        var myChart = ec.init(document.getElementById('attack_line_id'));
                        var start=function(){
                            $.post(__ROOT__ + '/Home/AttackSituation/visitAttackCounterList').success(function (json) {
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
                                attackSituation.options.attack_visit_line.series[0].data = visit;
                                attackSituation.options.attack_visit_line.series[1].data = attack;
                                attackSituation.options.attack_visit_line.xAxis[0].data = xAxis;
                                myChart.setOption(attackSituation.options.attack_visit_line);
                            });
                        };
                        start();
                        setInterval(start,_intervals.lineChartRefresh);
                        callback&&callback.call(w);

                        forceDailyChart = ec.init(document.getElementById('daily_attack_id'));
                        forceDailyChart.setOption(attackSituation.options.force);
                        forceDailyChart.hideLoading();
                        forceHistoryChart = ec.init(document.getElementById('history_attack_id'));
                        forceHistoryChart.setOption(attackSituation.options.force);
                        forceHistoryChart.hideLoading();
                    });

            },
            summary:function(){

            },
            daily_attack_visit_flow_line:function(){
                //var w=this;

                //w.attack_visit_line.setOption(attackSituation.options.attack_visit_line);

            }

        },
        scoller:function(){
            var w=this;
            //站点访问量排行
            var siteVisit=function(){
                w.visitCountRankScoller= $("tbody",$('#real_time_visit_id')).itemScoller({
                    ajaxUrl:__ROOT__+'/Home/AttackSituation/visitCountRank',
                    items:toggle.visitCountRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.visitCountRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        //var max=json[toggle.visitCountRank][0]['value'];
                        var max= json[toggle.visitCountRank + 'Count'];
                        var pecent=(item.value*100/max).toFixed(2);
                        var domains = item.name.split("_");
                        var el = $("<tr><td style='text-align: left;' title='"+domains[1]+"'>"+item.name+"</td>" +
                        "<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+pecent+'%'+"</span></div></div></td>"+
                        "<td>" + item.value + "次</td></tr>");
                        return el;
                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    }

                });
            };
            siteVisit();
            //站点攻击量排行
            var siteAttack=function(){
                w.attackCountRankScoller= $("tbody",$('#real_time_attack_id')).itemScoller({
                    ajaxUrl:__ROOT__+'/Home/AttackSituation/attackCountRank',
                    items:toggle.attackCountRank,
                    key:"name",
                    value:"value",
                    refresh_interval:_intervals.attackCountRankRefresh,//刷新间隔
                    interval:_intervals.sortInterval,//排序间隔
                    draw:function(index,item,json){
                        //var max=json[toggle.attackCountRank][0]['value'];
                        var dailyAttackCount = json['allCount'];
                        var attackedSiteCount = json['all'].length;
                        $(".dailyAttackCount").text(dailyAttackCount);
                        $(".attackedSiteCount").text(attackedSiteCount);
                        var max= json[toggle.attackCountRank + 'Count'];
                        var pecent=(item.value*100/max).toFixed(2);
                        var domains = item.name.split("_");
                        var el = $(" <tr><td style='text-align: left;' title='"+domains[1]+"'>"+item.name+"</td>"+
                        "<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+pecent+'%'+"</span></div></div></td>"+
                        "</td><td>" + item.value+'次' + "</td></tr>");
                        return el;
                    },
                    compare:function(v1,v2){
                        return v2>v1?true:false;//降序排列
                    }


                });
            };
            siteAttack();
        },
        getList:function(){
            var ccAttack=function() {
                $.post(__ROOT__ + '/Home/AttackSituation/getCc').success(function (json) {
                    if (json && json.code == 1) {
                        var items = json.items;
                        var trClass = "c-red";
                        var warningType = "CC攻击";
                        $(".ccAtackTable tbody").html("");
                        var rate = 0;
                        var timeStr = "";
                        var date ;
                        for (var i = 0,num = items.length; i < num; i++) {
                            date = new Date(items[i]['timestamp'] * 1000);
                            timeStr = date.Format('yyyy-MM-dd hh:mm:ss');

                            warningType = items[i]['warningType'] == "CCAttack" ? "CC攻击": "异常流量";
                            trClass = items[i]['warningType'] == "CCAttack" ? "c-red": "c-yellow";
                            rate = (items[i]['visitCount'] * 100 /items[i]['predictCount']).toFixed(2);
                            var tr;
                            if(items[i]['warningType'] != "SCANATTACK"){
                                tr = $('<tr value="'+i+'"><td>'+ timeStr.substr(11,5) +'</td>'+
                                '<td>'+items[i]['destHostName']+'</td>' +
                                '<td>'+items[i]['visitCount']+' 次</td>' +
                                '<td>'+ rate +'%</td>' +
                                '<td class="' + trClass + '">'+ warningType +'</td>' +
                                '</tr>');
                            }else{
                                warningType = "扫描攻击";
                                trClass = "c-orange";
                                var ipFootLengths = 0;
                                var ip4xx = 0;
                                $.each(items[i]['ipFootLengths'],function(k,v){
                                    ipFootLengths+=v['value'];
                                });
                                $.each(items[i]['ip4xx'],function(k,v){
                                    ip4xx+=v['value'];
                                });
                                rate = (ip4xx*100/ipFootLengths).toFixed(2);
                                tr = $('<tr  value="'+i+'"><td>'+ timeStr.substr(11,5) +'</td>' +
                                '<td>'+items[i]['destHostName']+'</td>' +
                                '<td>'+ipFootLengths+' 步</td>' +
                                '<td>'+ rate +'%</td>' +
                                '<td class="' + trClass + '">'+ warningType +'</td>' +
                                '</tr>');
                            }
                            if(!items[i]['ips']&&items[i]['ips'].length<=0&&warningType=="异常流量"){

                            }else{
                                $(tr).css({"cursor":"pointer"});
                            }
                            $(".ccAtackTable tbody").append(tr);
                        }
                        //$(".ccAtackTable tbody tr").css({"cursor":"pointer"});
                        initMyModal(items);

                        var timestamp = new Date(items[0]['timestamp'] * 1000);
                        var curTime = new Date();
                        if(curTime.getTime()-timestamp<=_intervals.warnInterval){
                            $(".ccAtackTable tbody tr:eq(0)").trigger("click");
                            setTimeout(function(){
                                $("#myModal1").modal("hide");
                            },_intervals.modalDisplay);
                        }
                    }
                });
            }
            ccAttack();
            setInterval(ccAttack,_intervals.ccTableRefresh);
            var defenseAttack=function() {
                $.post(__ROOT__ + '/Home/AttackSituation/getDefense').success(function (json) {
                    if (json && json.code == 1) {
                        var items = json.items;
                        $(".defenseTable tbody").html("");
                        for (var i = 0,num = items.length; i < num; i++) {

                            var tr = '<tr >' +
                                '<td>'+ items[i]['time'] +
                                '</td><td>'+ items[i]['type'] +
                                '</td><td>'+items[i]['ip']+
                                '</td><td style="text-align: left;">'+ items[i]['url'] +
                                '</td></tr>';
                            $(".defenseTable tbody").append(tr);
                        }
                        $(".defebseNum").html(json.allCount);
                    }
                });
            }
            defenseAttack();
            setInterval(defenseAttack,_intervals.defenseTableRefresh);
            var policyAttack=function() {
                $.post(__ROOT__ + '/Home/AttackSituation/getPolicy').success(function (json) {
                    if (json && json.code == 1) {
                        var items = json.items;
                        items = items.sort(function(a,b){
                            //return a['ipCounter'] > b['ipCounter'] ? -1 : (a['siteCounter'] > b['siteCounter'] ? -1 : (a['allCounter'] > b['allCounter'] ? -1: 1));
                            if(a['ipCounter'] == b['ipCounter']){
                                if(a['siteCounter'] == b['siteCounter']){
                                    return b['allCounter'] - a['allCounter'];
                                }else{
                                    return b['siteCounter'] - a['siteCounter'];
                                }
                            }else{
                                return b['ipCounter'] - a['ipCounter'];
                            }
                        });
                        var trClass = "c-red";
                        var warningType = "CC攻击";
                        $(".wafPolicyTable tbody").html("");
                        var rate = 0;
                        var timeStr = "";
                        var date ;
                        for (var i = 0,num = items.length; i < num; i++) {
                            var tr = '<tr >' +
                                '<td style="text-align: left;">'+ items[i]['policyId'] +
                                '<td style="text-align: left;">'+ items[i]['name'] +
                                '</td><td>'+items[i]['ipCounter']+
                                '</td><td>'+items[i]['siteCounter']+
                                '</td><td>'+ items[i]['allCounter'] +
                                '</td></tr>';
                            $(".wafPolicyTable tbody").append(tr);
                        }
                        $(".policyNum").html(json.allCount);
                    }
                });
            }
            policyAttack();
            setInterval(policyAttack,_intervals.policyTableRefresh);

            var initMyModal=function(data){
                $(".ccAtackTable tbody tr").unbind('click').on('click',function(){
                    $("#myModal1").modal("hide");
                    $(".m-main-b",$("#myModal1")).html("");
                    //$("#modalTable",$("#myModal1")).siblings().remove();
                    var point = parseInt($(this).attr("value"));
                    var dataDetail = data[point];
                    //var warnType = dataDetail['warningType'] == 'CCAttack'?'CC攻击':'异常流量';
                    var warnType = {'CCAttack':'CC攻击','SCANATTACK':'扫描攻击'}[dataDetail['warningType']] || '异常流量';
                    $("#myModal1Label",$("#myModal1")).text(warnType);
                    var date = new Date(dataDetail['timestamp'] * 1000);
                    var timeStr = date.Format('yyyy-MM-dd hh:mm:ss');
                    $("#myModal1 .attackTime").text(timeStr.substr(11,5));
                    //$("#myModal1 .siteDomain").text(".."+dataDetail['destHostName'].substr(4,8)+"..").attr("title",dataDetail['destHostName']);

                    var ips = dataDetail['ips'];
                    var ipsCount = dataDetail['ipsCount'];
                    var ipsCountJ = {};
                    ipsCount&&$.each(ipsCount,function(k,v){
                        ipsCountJ[v['key']] = v['value'];
                    });
                    var ipFootLengths = dataDetail['ipFootLengths'];
                    var ipFootLengthsJ = {};
                    ipFootLengths&& $.each(ipFootLengths,function(k,v){
                        ipFootLengthsJ[v['key']] = v['value'];
                    });
                    var ipUrlsCount = dataDetail['ipUrlsCount'];
                    if(ips&&ips.length>0){
                        var ipsArr = ips.split(",");
                        var ipDetails = [];
                        ipsArr.length>0&&$.each(ipsArr,function(i,t){
                            var ipAdr = t.split("(");
                            var ipDetail = {};
                            ipDetail['td1'] = ipAdr[0];
                            ipDetail['td2'] = ipAdr[1].replace(")","");
                            if(dataDetail['warningType'] == "SCANATTACK"){
                                ipDetail['td3'] = ipFootLengthsJ[ipAdr[0]];
                            }else{
                                ipDetail['td3'] = ipsCountJ[ipAdr[0]];
                            }
                            ipDetails.push(ipDetail);
                        });
                        ipDetails.sort(function(a,b){
                            return b['td3'] - a['td3'];
                        });

                        var thead = ["攻击IP","归属地","攻击量"];
                        if(dataDetail['warningType'] == "SCANATTACK"){
                            thead = ["攻击IP","归属地","步长"];
                        }
                        __function__.initTable(ipDetails,thead,"attackIp",dataDetail['warningType']);
                    }

                    //$("#myModal1 .attackURL tbody").html("");
                    if(ipUrlsCount&&ipUrlsCount.length>0){
                        var URLDetails = [];
                        $.each(ipUrlsCount,function(i,t){
                            var URLDetail = {};
                            var ipUrl = t['key'].split("_");
                            URLDetail['td2'] = ipUrl[0];
                            URLDetail['td1'] = ipUrl[1].length>50?ipUrl[1].substr(0,50)+"...":ipUrl[1];
                            URLDetail['td3'] = t['value'];
                            URLDetails.push(URLDetail);
                        });
                        URLDetails.sort(function(a,b){
                            return b['td3'] - a['td3'];
                        });

                        thead = ["被攻击URL","攻击IP","攻击量"];
                        __function__.initTable(URLDetails,thead,"attackUrl",dataDetail['warningType']);
                    }
                    var ipUrlRspCode = dataDetail['ipUrlRspCode'];
                    var ipUrlRspCodeDetails = [];
                    if(ipUrlRspCode && ipUrlRspCode.length>0){
                        $.each(ipUrlRspCode,function(k,v){
                            $.each(v['valuse'],function(key,value){
                                var ipUrlRspCodeDetail = {};
                                ipUrlRspCodeDetail['td1'] = v['key'];
                                ipUrlRspCodeDetail['td2'] = value['key'];
                                ipUrlRspCodeDetail['td3'] = value['value'];
                                ipUrlRspCodeDetails.push(ipUrlRspCodeDetail);

                            });
                        });

                        thead = ["攻击IP","被攻击URL","状态码"];
                        __function__.initTable(ipUrlRspCodeDetails,thead,"RspCode",null);
                    }

                    if(!ips&&ips.length<=0&&warnType=="异常流量"){

                    }else{
                        $("#myModal1").modal("show");
                    }



                });
            }

        },
        getVisitAndAttackTopN: function(){
            var madeVisitAndAttackData = function() {
                $.ajax({
                    "dataType": 'json',
                    "type": 'POST',
                    "url": __ROOT__ + '/Home/AttackSituation/getVisitAndAttackTopN',
                    "timeout": 30000,
                    "success":function(json) {
                        if (json) {
                            visitAndAttackData.visit = json['visit'];
                            visitAndAttackData.attack = json['attack'];
                            //显示攻击数
                            $('.attack_ip_count').text(visitAndAttackData.attack['total'] ? visitAndAttackData.attack['total'] : 0);
                            attackSituation.showTopN();
                        }
                    }
                });
            }
            madeVisitAndAttackData();
            setInterval(madeVisitAndAttackData,_intervals.visitAndAttactkTopN);
        },
        showTopN: function(){
            var showTopInter = function(){
                var type = toggle.visitAndAttackTopN;
                var data = visitAndAttackData[type];
                var items = data['items'];

                if(items){
                    $(".visitAndAttackTable tbody").html("");
                    $.each(items, function(i, v){
                        var tr = $('<tr class="clickTr" ip="' + v.ip + '">'+
                        '<td>' + v.count +
                        '</td><td>【' + v.location +
                        '】</td><td title="双击进入添加访问控制页;\n单击显示详情">' + v.ip +
                        '</td> </tr>');
                        tr.bind("click",function(){

                            var value = $(this).attr("ip");
                            $('.arrow').css('top',i*($(this).height())+'px');
                            attackSituation.showDatailMsg(value);
                        });
                        tr.bind("dblclick",function(){
                            var value = $(this).attr("ip");
                            window.open(__ROOT__ + '/Home/Access/addAccess/ip/' + value);
                        });
                        $(".visitAndAttackTable tbody").append(tr);
                    })
                    items[0]&&attackSituation.showDatailMsg(items[0]['ip']);
                }
            }
            showTopInter();
            //setInterval(showTopInter,_intervals.visitAndAttackRefresh);
        },
        showDatailMsg: function(ip){
            var type = toggle.visitAndAttackTopN;
            var visitOrAttack = "访问";
            if(type == 'attack'){
                visitOrAttack = "攻击";
            }
            var titleDaily = "当天主要"+ visitOrAttack + "目标";
            var titleHis = "历史主要" + visitOrAttack + "目标";
            var data = visitAndAttackData[type];
            var items = data['items'];
            for(var i = 0, num = items.length; i < num; i++){
                if(ip == items[i]['ip']){
                    var item = items[i];
                    $('.allSiteCount').text(item['ipSearch']['allCount'] ? item['ipSearch']['allCount'] : 0);
                    $('.highVulsSiteCount').text(item['ipSearch']['highCount'] ? item['ipSearch']['highCount'] :0);

                    //$('.ports_text').text(item['ports'] ? item['ports'] : "");
                    $('.mCSB_container',$('.ports_text')).text(item['ports'] ? item['ports'] : "");
                    //$('.mainAttackStyle_text').text(item['mainAttackStyle'] ? item['mainAttackStyle'] : "");
                    $('.mCSB_container',$('.mainAttackStyle_text')).css('width','300px');
                    $('.mCSB_container',$('.mainAttackStyle_text')).text(item['mainAttackStyle'] ? item['mainAttackStyle'] : "");


                    var nodes = [];
                    var links = [];
                    var his_nodes = [];
                    var his_links = [];
                    var dailyAttackTrage = item['dailyAttackTrage'];
                    nodes.push({category:0, name: ip, value : 10, label: ip});
                    his_nodes.push({category:0, name: ip, value : 10, label: ip});
                    if(dailyAttackTrage){
                        $.each(dailyAttackTrage,function(k,v){
                            nodes.push({category:1, name: v,value : 2});
                            links.push({source : v, target : ip, weight : 1, name: v});
                        });
                    }

                    var historyAttackTrage = item['historyAttackTrage'];
                    if(historyAttackTrage){
                        $.each(historyAttackTrage,function(k,v){
                            his_nodes.push({category:1, name: v,value : 2});
                            his_links.push({source : v, target : ip, weight : 1, name: v});
                        });
                    }

                    attackSituation.options.force.series[0].nodes = nodes;
                    attackSituation.options.force.series[0].links = links;
                    attackSituation.options.force.title.text = [titleDaily];
                    attackSituation.options.force.series[0].categories[1].name = titleDaily;

                    forceDailyChart.setOption(attackSituation.options.force,true);
                    forceDailyChart.hideLoading();
                    //console.info(w.options.daily_attack_force.series[0].nodes);
                    attackSituation.options.force.series[0].nodes = nodes;
                    attackSituation.options.force.series[0].links = links;
                    attackSituation.options.force.title.text = [titleHis];
                    attackSituation.options.force.series[0].categories[1].name = titleHis;


                    forceHistoryChart.setOption(attackSituation.options.force,true);
                    forceHistoryChart.hideLoading();
                }
            }

        }
    };


    $(document).ready(function(){
        attackSituation.init();
        attackSituation.scoller();
        attackSituation.hadder();
        attackSituation.getList();
        attackSituation.getVisitAndAttackTopN();

    });

})();
