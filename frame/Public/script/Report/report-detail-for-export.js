
(function(){

    var cloudFlag = true;
    var vulsFlag = true;
    var  __default_colors__=["#c60000","#f0412f","#f5942c","#fae266","#6dbdff"];
    var tableBgColor={
        "0":"bg-red",
        "1":"bg-orange",
        "2":"bg-yellow"
    }
    var __function__= {
        numFormat: function(num){
            if(!num){
                return '--'
            }else{
                return num.toString().replace(/(\d+?)(?=(?:\d{3})+$)/g, '$1,');

            }

        },
        pecentItem:function(pecent,color){
            return "<div class='progress' style='margin-bottom: 0;'>"+
                "<div class='progress-bar "+color+"' style='width: "+pecent+"%;'><span style='color:"+(pecent>=10?"#fff":"#000")+";'>"+pecent+"%</span></div></div>";
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
        setMapMaxData: function (option) {
            //var series=option.series;
            var max = 0;
            $.each(option.series, function (i, series) {
                var data = series.data;
                $.each(data, function (i, d) {
                    if (d.value > max) {
                        max = d.value;
                    }
                });
            });
            option.dataRange.max = max;

        },
        commonPie: function (title) {
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series: [
                    {
                        name: title,
                        type: 'pie',
                        radius: '50%',
                        center: ['50%', '50%'],
                        data: []
                    }
                ]
            };
            return option;

        },
        commonVBar: function (title) {
            var option = {

                tooltip: {
                    trigger: 'axis'
                },
                color: ["#3AC2C3"],
                xAxis: [
                    {
                        type: 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: []
                    }
                ],
                series: [
                    {
                        name: title,
                        type: 'bar',
                        data: []
                    }
                ]
            };
            return option;


        },
        commonMapOption: function () {
            var option = {
                dataRange: {
                    show: false,
                    min: 0,
                    max: 100,
                    text: ['高', '低'],  // 文本，默认为数值文本
                    calculable: false,
                    x: 60,
                    y: 360,
                    color: __default_colors__
                },
                series: [
                    {
                        name: '全国地图',
                        type: 'map',
                        mapType: 'china',
                        selectedMode: 'single',
                        showLegendSymbol: false,
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    formatter: function (param, v) {
                                        if (v < 0) {
                                            v = '-';
                                        }
                                        return param + "\n" + v;
                                    }
                                }
                            },
                            emphasis: {                 // 也是选中样式
                                borderWidth: 2,
                                borderColor: '#fff',
                                color: '#32cd32',
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        },

                        data: []
                    }
                ]
            }
            return option;
        },

        worldAreaRank:function(data,opt,pie,tableName){
            var w=this;
            var arr=[];
            var total=0;
            $.each(data||{},function(c,v){
                arr.push({name:c,count:v});
                total+=v;
            });
            arr.sort(function(a,b){//倒叙排列
                return b.count-a.count;
            });
            var pieMap={};
            $.each(arr,function(i,obj){//top5
                if(i<5){
                    pieMap[obj.name]=obj.count;
                }else{
                    var tmp=pieMap['其他']||0;
                    pieMap['其他']=tmp+obj.count;
                }
            });
            opt.series[0].data=[];
            $.each(pieMap,function(c,v){
                opt.series[0].data.push({name:c,value:v});
            });
            //pie.setOption(opt);

            //表单数据
            var tbody=$("tbody",$("#"+tableName));
            tbody.html("");
            $.each(arr,function(i,obj){
                var color=tableBgColor[i+""]||"bg-blue";
                var pecent=(obj.count*100/total).toFixed(0);
                var tr=$("<tr><td>"+obj.name+"</td><td>"+obj.count+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");

                tr.appendTo(tbody);
            });
            $("#"+tableName).DataTable(_dataTable_setting._report());

        },
        chinaAreaRank:function(data,opt,map,tableName){
            var w=this;


            var arr=[];
            var total=0;
            $.each(data,function(c,v){
                arr.push({name:c,value:v});
                total+=v;
            });
            arr.sort(function(a,b){//倒叙排列
                return b.value-a.value;
            });

            opt.series[0].data=arr;
            __function__.setMapMaxData(opt);
            map.setOption(opt);

            //表单数据
            var tbody=$("tbody",$("#"+tableName));
            tbody.html("");
            $.each(arr,function(i,obj){
                var color=tableBgColor[i+""]||"bg-blue";
                var pecent=(obj.value*100/total).toFixed(0);
                var tr=$("<tr><td>"+obj.name+"</td><td>"+obj.value+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");

                tr.appendTo(tbody);
            });
            $("#"+tableName).DataTable(_dataTable_setting._report());


        },
        visitSrcDetail:function(detail, total){
            var trWrapper = $("<tr class='details'></tr>");
            var tdWrapper = $("<td colspan='4'></td>");
            var tableWrapper = $("<table class='u-grid'></table>");
            var theadWrapper = $("<thead></thead>");
            theadWrapper.html("<tr><th>URL</th><th>访问次数</th><th>访问占比</th></tr>");
            tableWrapper.append(theadWrapper);
            var tbodyWrapper = $("<tbody></tbody>");
            detail.sort(function(a,b){
                return b.count- a.count;
            });
            var i = 0;
            $.each(detail, function(point, item){
                i++;
                if(i < 11){
                    var pecent= (item.count*100/total).toFixed(0);;
                    var color=tableBgColor[point+""]||"bg-blue";
                    var tmpName = item.name;
                    if(tmpName.length > 30){
                        tmpName = "<abbr title='" + tmpName + "'>" + tmpName.substr(0,30) + "...</abbr>";
                    }
                    var tr=$("<tr><td>"+tmpName+"</td><td>"+ item.count+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tbodyWrapper.append(tr);
                }

            });
            tableWrapper.append(tbodyWrapper);
            tdWrapper.append(tableWrapper);
            trWrapper.append(tdWrapper);
            return trWrapper;
        }
    }
    var  app={
        prepare:function(){

            $.post(__ROOT__+"/Home/WafSite/listAll").success(function(json){
                $.each(json,function(i,d){
                    var domain = d['_id'];
                    $("#domainSelector").append("<option value='"+domain+"'>"+domain+"</option>");
                });
                currentDomain=$("#currentDomain").val();
                $("#domainSelector").val(currentDomain);
            });
        },
        init:function(){
            var w=this;
            var json= $.parseJSON($("#cloudwaf_data").text());
            //console.info(json);
            w.cloudwafData=json.data;
            w.currentDateKey=$("#currentDateKey").val();
            w.domain=$("#currentDomain").val();
            app.view.load.call(w);
            //cloudwaf.view.load.call(w);

        },
        initTab: function(){
            var w = this;
            $("li",$("#reportTab")).bind("click",function(){
                var type=$(this).attr("_type");
                $("li",$("#reportTab")).removeClass("active");
                $(this).addClass("active");
                $(".product").hide();
                $("#"+type).show();
                if(type == "vuls_id" && vulsFlag){
                    vuls.init(w.domain, w.currentDateKey);
                    vulsFlag = false;
                }
                if(type == "cloudwaf_id" && cloudFlag){
                    cloudwaf.init(w.domain, w.currentDateKey);
                    cloudFlag = false;
                }
            });
        },
        showDatas: function(){
            var w = this;
            monitor.init(w.domain, w.currentDateKey);
            //vuls.init("","");
        },
        handler:function(){
            $("#btn-search").bind("click",function(){
                var domain=$("#domainSelector").val();
                var dateKey=$("#currentDateKey").val();
                if(domain==''||dateKey==''){
                    storm.alert("网站和日期不能为空!")
                    return;
                }
                var href=__ROOT__+"/Home/DailyReport/index/domain/"+domain+"/dateKey/"+dateKey;
                location.href=href;
            });
        },
        options:{
            attack_visit_line:{
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    show:true,
                    data:['攻击次数','访问次数','出流量',"进流量"]
                },
                dataZoom : {
                    show : false,
                    realtime : true,
                    start : 0,
                    end : 100
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :[]
                    }
                ],
                yAxis : [
                    {
                        name: '次',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'攻击次数',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data:function (){
                            var list = [];
                            for (var i = 0; i < 1440; i++) {
                                list.push(Math.round(Math.random()* 30));
                            }
                            return list;
                        }()
                    },
                    {
                        name:'访问次数',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data:[]
                    },
                    {
                        name:'出流量',
                        type:'line',
                        data:[]
                    },
                    {
                        name:'进流量',
                        type:'line',
                        data:[]
                    }
                ]
            },
            flow_line:{
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    show:false,
                    data:['攻击次数','访问次数','出流量',"进流量"]
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
                        boundaryGap : false,
                        data : function (){
                            var list = [];
                            var n = 0;
                            while (n++ < 1440) {
                                list.push(n);
                            }
                            return list;
                        }()
                    }
                ],
                yAxis : [
                    {
                        name: 'M',
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'攻击次数',
                        type:'line',
                        data:[]
                    },
                    {
                        name:'访问次数',
                        type:'line',
                        data:[]
                    },
                    {
                        name:'出流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data:[]
                    },
                    {
                        name:'进流量',
                        type:'line',
                        dataFilter: 'nearst',
                        symbol: 'none',
                        data:[]
                    }
                ]
            },
            world_visit_pie:__function__.commonPie("访问源区域"),
            china_visit_map:__function__.commonMapOption(),
            visitip_topn_bar:__function__.commonVBar("访问源IP"),
            visit_src_pie:__function__.commonPie("访问来源"),
            device_spread_pie:{
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
                series : [
                    {
                        name:'设备形式',
                        type:'pie',
                        selectedMode: 'single',
                        radius : [0, '30%'],

                        // for funnel
                        x: '20%',
                        width: '40%',
                        funnelAlign: 'left',
                        //max: 1548,

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
                        name:'操作系统',
                        type:'pie',
                        radius : ['40%', '55%'],

                        // for funnel
                        x: '40%',
                        y: '40%',
                        width: '45%',
                        funnelAlign: 'right',
                        data:[

                        ]
                    }
                ]

            },
            browser_spread_pie:__function__.commonPie("设备浏览器"),
            mobile_spread_pie:__function__.commonPie("移动终端"),
            static_src_bar:__function__.commonVBar("静态资源"),
            http_code_pie:__function__.commonPie("状态码"),
            attack_dest_leida:{
                tooltip : {
                    trigger: 'axis'
                },

                polar : [
                    {
                        indicator : [


                        ]
                    }
                ],
                calculable : false,
                series : [
                    {
                        name: '攻击目标',
                        type: 'radar',
                        data : [

                        ]
                    }
                ]
            },
            world_attack_pie:__function__.commonPie("攻击源区域"),
            china_attack_map:__function__.commonMapOption(),
            attack_type_pie:{
                tooltip : {
                    trigger: 'item',
                    formatter: function(params){
                        var value=params[2];
                        value =Math.exp( value);
                        return params[1]+":"+Math.round(value);
                    }
                },
                color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
                series : [
                    {
                        name:'攻击类型',
                        type:'pie',
                        radius : [30, 90],
                        center : ['50%', '50%'],
                        roseType : 'area',
                        x: '50%',               // for funnel
                        max: 40,                // for funnel
                        sort : 'ascending',     // for funnel
                        data:[

                        ]
                    }
                ]
            }
        },
        view:{
            load:function(){
                var w=this;
                app.view.echarts_prepare.call(w,function(){
                    app.view.daily_attack_visit_flow_line.call(w);
                    app.view.world_visit.call(w);
                    app.view.china_visit.call(w);
                    app.view.visitip_topn.call(w);
                    app.view.visit_src.call(w);
                    app.view.spread_pie.call(w);
                    app.view.static_src.call(w);
                    app.view.http_code.call(w);
                    app.view.attack_dest.call(w);
                    app.view.china_attack.call(w);
                    app.view.attack_type.call(w);
                    app.view.world_attack.call(w);


                });
                app.view.summary.call(w);
                app.view.visitPageRank.call(w);
                app.view.brokenLink.call(w);
                app.view.webshell.call(w);


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
                        'echarts/chart/pie',
                        'echarts/chart/map',
                        'echarts/chart/bar',
                        'echarts/chart/radar'

                    ],
                    function (ec) {

                        $(".echarts",$("#cloudwaf_id")).each(function(i,obj){
                            var _id=$(obj).attr("id");
                            w[_id]=ec.init(document.getElementById(_id));
                        });

                        callback&&callback.call(w);

                    });

            },
            summary:function(){
                var w=this;
                var summary= w.cloudwafData.summary;
                if(!summary){
                    return;
                }
                var data={};
                data['visit_count']= __function__.numFormat(summary.visit.count);
                data['visit_ip_count']= __function__.numFormat(summary.visit.ipCount);
                data['attack_count']=  __function__.numFormat(summary.attack.count);
                data['attack_area_count']=__function__.numFormat(summary.attack.areaCount);
                data['flow_all']=__function__.numFormat((summary.flow.all/1024/1024).toFixed(2));
                data['flow_attack']=__function__.numFormat( ((summary.flow.attack_flow||0)/1024/1024).toFixed(0) );
                data['attck_src_count']=__function__.numFormat(summary.attack.attackSrcCount);
                data['black_ip_count']=__function__.numFormat(summary.attack.blacklist);
                $.each(data,function(k,v){
                    $("."+k,$(".cloudwaf-summary")).text(v);
                });
            },
            daily_attack_visit_flow_line:function(){
                var w=this;
                var data= w.cloudwafData.dailyPoint||{};
                var visitMap=data.visit||{};
                var attackMap=data.attack||{};
                var flowOutMap=data.flowOut||{};
                var flowInMap=data.flowIn||{};
                var xAxis=[];
                $.each(visitMap,function(k,v){
                    xAxis.push(k.split(" ")[1]);
                });
                var visit=__function__.mapset(visitMap,false);
                var attack=__function__.mapset(attackMap,false);
                var flowOut=__function__.mapset(flowOutMap,false);
                var flowIn=__function__.mapset(flowInMap,false);

                var _flowOut=[];
                $.each(flowOut,function(i,v){
                    _flowOut.push(v/1024/1024);
                });
                var _flowIn=[];
                $.each(flowIn,function(i,v){
                    _flowIn.push(v/1024/1024);
                });

                app.options.attack_visit_line.series[1].data=visit;
                app.options.attack_visit_line.series[0].data=attack;
                app.options.attack_visit_line.xAxis[0].data=xAxis;
                w.attack_visit_line.setOption(app.options.attack_visit_line);

                app.options.flow_line.series[2].data=_flowOut;
                app.options.flow_line.series[3].data=_flowIn;
                app.options.flow_line.xAxis[0].data=xAxis;
                w.flow_line.setOption(app.options.flow_line);
                if(!w.daily_attack_visit_flow_line_connected){
                    w.attack_visit_line.connect([ w.flow_line]);
                    w.flow_line.connect([ w.attack_visit_line]);
                    w.daily_attack_visit_flow_line_connected=true;
                }

            },
            world_visit:function(){
                var w=this;
                var data= w.cloudwafData.worldAreaRank||{};
                var visit=data.visit||{};
                __function__.worldAreaRank.call(w,visit,app.options.world_visit_pie, w.world_visit_pie,"world_visit_table");
            },
            china_visit:function(){
                var w=this;
                var data= w.cloudwafData.chinaAreaRank||{};
                var visit=data.visit||{};
                __function__.chinaAreaRank.call(w,visit,app.options.china_visit_map,w.china_visit_map,"china_visit_table");
            },
            visitip_topn:function(){
                var w=this;
                var data= w.cloudwafData.ipTopN||{};
                var arr=data.visit||[];
                if(arr.length > 10){
                    var tmp = [];
                    for(var i = 0; i < 10; i++){
                        tmp[i] = arr[i];
                    }
                    arr = tmp;
                }

                arr.sort(function(a,b){
                    return a.count- b.count;

                });
                app.options.visitip_topn_bar.yAxis[0].data=[];
                app.options.visitip_topn_bar.series[0].data=[];
                $.extend(app.options.visitip_topn_bar,{
                    grid: { // 控制图的大小，调整下面这些值就可以，
                        x: 100,
                        x2:20
                    }
                });
                $.each(arr,function(i,obj){
                    if(i<10){
                        app.options.visitip_topn_bar.yAxis[0].data.push(obj.ip);
                        app.options.visitip_topn_bar.series[0].data.push(obj.count);
                    }
                });


                w.visitip_topn_bar.setOption(app.options.visitip_topn_bar);
                var revert=[];
                var total=0;
                for(var i=arr.length-1;i>=0;i--){
                    revert.push(arr[i]);
                    total+=arr[i].count;
                }

                //下面写表单数据
                var tbody=$("tbody",$("#visitip_topn_table"));
                tbody.html("");
                $.each(revert,function(i,obj){
                    var color=tableBgColor[i+""]||"bg-blue";
                    var pecent=(obj.count*100/total).toFixed(0);
                    var tr=$("<tr><td>"+obj.ip+"</td><td>"+obj.location+"</td><td>"+obj.count+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");

                    tr.appendTo(tbody);
                });
            },
            visitPageRank:function(){
                var w=this;
                var data= w.cloudwafData.visitPageRank||[];
                var tbody=$("tbody",$("#visitPageRank_table"));
                tbody.html("");
                $.each(data,function(i,d){
                    var tr=$("<tr><td>"+ d.url+"</td><td>"+ d.pv+"</td><td>"+ d.uv+"</td><td>"+ d.ip+"</td></tr>");
                    tbody.append(tr);
                });
                $("#visitPageRank_table").DataTable(_dataTable_setting._report());
            },
            visit_src:function(){
                var w=this;
                var data= w.cloudwafData.visitSrcRank||{};
                app.options.visit_src_pie.series[0].data=[];
                var total=0;
                $.each(data,function(t,o){
                    app.options.visit_src_pie.series[0].data.push({name:t,value: o.count});
                    total+= o.count;
                });
                w.visit_src_pie.setOption(app.options.visit_src_pie);
                //表单数据
                var tbody=$("tbody",$("#visit_src_table"));
                tbody.html("");
                var i=0;
                var arr=[];
                $.each(data,function(t,o){
                    arr.push({name:t,count: o.count, detail: o.detail});
                });
                arr.sort(function(a,b){
                    return b.count- a.count;
                });

                $.each(arr,function(i,o){
                    var detail = o.detail;
                    var pecent= (o.count*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";
                    var tr=$("<tr><td><span class='row-details row-details-close'></span></td><td>"+ o.name+"</td><td>"+ o.count+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    var detailTable = __function__.visitSrcDetail(detail||[], o.count);
                    tr.appendTo(tbody);
                    detailTable.hide().appendTo(tbody);
                });

                $(".row-details", tbody).bind("click", function(){
                    if($(this).hasClass('row-details-close')){
                        $('.collapse-grid tbody td .row-details').addClass("row-details-close").removeClass("row-details-open");
                        $('.collapse-grid tbody td .row-details').parents('tr').next('tr.details').hide();
                        $(this).addClass("row-details-open").removeClass("row-details-close");
                        $(this).parents('tr').next('tr').css("display", "table-row");
                    }
                    else{
                        $('.collapse-grid tbody td .row-details').addClass("row-details-close").removeClass("row-details-open");
                        $('.collapse-grid tbody td .row-details').parents('tr').next('tr.details').hide();
                        $(this).addClass("row-details-close").removeClass("row-details-open");
                        $(this).parents('tr').next('tr.details').hide();
                    }
                })
            },
            spread_pie:function(){
                var w=this;
                var data= w.cloudwafData.visitMethod||{};

                var _map={};
                $.each(data,function(key,map){
                    $.each(map,function(k,v){
                        if(!_map[key]){
                            _map[key]=[];
                        }
                        _map[key].push({name:k,value:v});
                    });
                });



                app.options.device_spread_pie.series[0].data=_map['deviceGroup']||[];
                app.options.device_spread_pie.series[1].data=_map['device']||[];
                w.device_spread_pie.setOption(app.options.device_spread_pie);

                app.options.browser_spread_pie.series[0].data=_map['browser']||[]
                w.browser_spread_pie.setOption(app.options.browser_spread_pie);

                app.options.mobile_spread_pie.series[0].data=_map['mobile']||[];
                //w.mobile_spread_pie.setOption(cloudwaf.options.mobile_spread_pie);
            },
            static_src:function(){
                var w=this;
                var data= w.cloudwafData.staticSrc||[];
                var map={};
                var total=0;
                $.each(data,function(i,obj){
                    var type=obj.type;
                    if(!map[type]){
                        map[type]=1;
                    }else{
                        map[type]= map[type]+1;
                    }
                    total+=obj.pv;

                });
                var arr=[];
                $.each(map,function(k,v){
                    arr.push({name:k,value:v});
                });
                arr.sort(function(a,b){
                    return a.value- b.value;
                });
                app.options.static_src_bar.yAxis[0].data=[];
                app.options.static_src_bar.series[0].data=[];
                $.each(arr,function(i,obj){
                    app.options.static_src_bar.yAxis[0].data.push(obj.name);
                    app.options.static_src_bar.series[0].data.push(obj.value);
                });
                w.static_src_bar.setOption(app.options.static_src_bar);

                //表单数据
                data.sort(function(a,b){
                    return b.pv- a.pv;
                });
                var tbody=$("tbody",$("#static_src_table"));
                tbody.html("");
                $.each(data,function(i,o){
                    var pecent= (o.pv*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";

                    var tr=$("<tr><td>"+ o.type+"</td><td>"+ o.url+"</td><td>"+ o.pv+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#static_src_table").DataTable(_dataTable_setting._report());
                //__function__.fnDrawDataTable.call(w,"static_src_table",$("#static_src_table"),8);
            },
            brokenLink:function(){
                var w=this;
                var data= w.cloudwafData.brokenLinkRank||[];

                var total=0;
                $.each(data,function(i,obj){
                    total+=obj.pv;
                });
                data.sort(function(a,b){
                    return b.pv- a.pv;
                });
                var tbody=$("tbody",$("#brokenlink_table"));
                tbody.html("");

                $.each(data,function(i,o){
                    var pecent= (o.pv*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";

                    var tr=$("<tr><td>"+ o.url+"</td><td>"+ o.refer+"</td><td>"+ o.pv+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#brokenlink_table").DataTable(_dataTable_setting._report());
            },
            http_code:function(){
                var w=this;
                var data= w.cloudwafData.httpCode||{};
                var _map={};
                var total=0;
                $.each(data.group||{},function(k,v){
                    var type= k.substr(0,1)+"xx";
                    if(!_map[type]){
                        _map[type]=v;
                    }else{
                        _map[type]= _map[type]+v;
                    }
                    total+=v;
                });

                app.options.http_code_pie.series[0].data=[];
                $.each(_map,function(k,v){
                    app.options.http_code_pie.series[0].data.push({name:k,value:v});
                });

                w.http_code_pie.setOption(app.options.http_code_pie);
                //表单数据
                var _5xxData=data['_5xx_TopN']||[];
                _5xxData.sort(function(a,b){
                    return b.pv- a.pv;
                });
                var tbody=$("tbody",$("#http_code_table"));
                tbody.html("");
                $.each(_5xxData,function(i,o){
                    var pecent= (o.pv*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";
                    var tr=$("<tr><td>"+ o.url+"</td><td>"+ o.pv+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#http_code_table").DataTable(_dataTable_setting._report());
            },
            webshell:function(){
                var w=this;
                var data=w.cloudwafData.webshell||[];

                var map={};
                $.each(data,function(i,d){
                    if(!map[d.url]){
                        map[d.url]={};
                        map[d.url]['visits']=[];
                    }
                    map[d.url]['visits'].push(d.visitIp+"("+d.location+")");
                    map[d.url]['lastvisitTime']= d.visitTime;
                });
                var tbody=$("tbody",$("#webshell_table"))
                tbody.html("");
                $.each(map,function(url,obj){
                    var tr=$("<tr><td>"+url+"</td><td>"+obj.visits.join("<br>")+"</td><td>"+obj.lastvisitTime+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#webshell_table").DataTable(_dataTable_setting._report());

            },
            attack_dest:function(){
                var w=this;
                var data= w.cloudwafData.attackDest||{};
                var name_arr=[];
                var count_arr=[];
                var arr=[];
                var total=0;
                $.each(data,function(k,v){
                    name_arr.push({text:k});
                    count_arr.push(v);
                    arr.push({name:k,value:v});
                    total+=v;
                });
                app.options.attack_dest_leida.series[0].data=[];
                app.options.attack_dest_leida.series[0].data.push({name:"攻击目标",value:count_arr});
                app.options.attack_dest_leida.polar[0].indicator=name_arr;
                w.attack_dest_leida.setOption(app.options.attack_dest_leida);
                //表单
                arr.sort(function(a,b){
                    return b.value- a.value;
                });
                var tbody= $("tbody",$("#attack_dest_table"));
                tbody.html("");
                $.each(arr,function(i,obj){
                    var pecent= (obj.value*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";
                    var tr=$("<tr><td>"+obj.name+"</td><td>"+obj.value+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#attack_dest_table").DataTable(_dataTable_setting._report());


            },
            world_attack:function(){
                var w=this;
                var data= w.cloudwafData.worldAreaRank||{};
                var visit=data.attack||{};
                __function__.worldAreaRank.call(w,visit,app.options.world_attack_pie, w.world_attack_pie,"world_attack_table");

            },
            china_attack:function(){
                var w=this;
                var w=this;
                var data= w.cloudwafData.chinaAreaRank||{};
                var visit=data.attack||{};
                __function__.chinaAreaRank.call(w,visit,app.options.china_attack_map,w.china_attack_map,"china_attack_table");
            },
            attack_type:function(){
                var w=this;
                var data= w.cloudwafData.attackType||{};
                var arr=[];
                var arr2=[];
                var total=0;
                $.each(data,function(k,v){
                    var value=Math.log(v);
                    arr.push({name:k,value:(value?value:0.0001)});
                    arr2.push({name:k,value:v});
                    total+=v;
                });
                app.options.attack_type_pie.series[0].data=arr;
                w.attack_type_pie.setOption(app.options.attack_type_pie);
                //表单数据
                arr2.sort(function(a,b){
                    return b.value- a.value;
                });


                var tbody=$("tbody",$("#attack_type_table"));
                tbody.html("");

                $.each(arr2,function(i,obj){
                    var pecent= (obj.value*100/total).toFixed(0);;
                    var color=tableBgColor[i+""]||"bg-blue";
                    var tr=$("<tr><td>"+obj.name+"</td><td>"+obj.value+"</td><td>"+__function__.pecentItem(pecent,color)+"</td></tr>");
                    tr.appendTo(tbody);
                });
                $("#attack_type_table").DataTable(_dataTable_setting._report());

            }

        }
    }
    $(document).ready(function(){
        app.prepare();
        //app.init();
        app.initTab();
        app.handler();
        app.showDatas();

        $('.header').hide();
        $('.export_report').hide();
        $('.send_report').hide();
        $('.search_report').hide();
    });
})();
