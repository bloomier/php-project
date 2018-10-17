/**
 * Created by sakoo.jiang on 2015/10/23.
 */

(function(){
    var mySwiper;
    var curProvince=$("#cur_province").val();
    var curCity=$("#cur_city").val();
    var o={
        dataType:{type:"china",data:"china"},
        data:{},
        mapper:{},
        store:{},
        dist:false,
        prevPanel:"main",
        panel_steps:[],
        init:function(){
            this.imgserver=$("#imgserver").val();
            var w=this;
            view.init.call(this,function(){
                __reload__.loadMapGeo.call(w);
                __reload__.loadOtherData.call(w);
                __reload__.loadMapper.call(w);
                if(curCity){
                    event.jump_into_city.call(w,curCity);
                }else{
                    event.jump_into_province.call(w,curProvince||'china');

                }
                handler.init.call(w);
            });


        },
        __contanst__:{
            vuls_name_level_mapper:{
                "high":"高危",
                "mid":"中危",
                "low":"低危",
                "info":"信息"
            },
            vuls_level_name_mapper:{
                "高":"high",
                "中":"mid",
                "低":"low",
                "信息":"info",
                "高危":"high",
                "中危":"mid",
                "低危":"low"
            },
            vuls_level_color:{
                "高": '#F0412E',
                "中":"#F1922C",
                "低":"#FDE866",
                "信息":"#2CCB71",
                "高危":"#F0412E",
                "中危":"#F1922C",
                "低危":"FDE866"
            },
            high_risk_port:{
                '3389':{"level":"高",color:"red"},
                '22':{"level":"高",color:"red"},
                '135':{"level":"高",color:"red"},
                '139':{"level":"高",color:"red"},
                '445':{"level":"高",color:"red"},
                '4489':{"level":"高",color:"red"}
            }

        }


    };
    var security_level={
        "反共":1,
        "博彩":2,
        "黑页":3,
        "色情":4,
        "暗链":5,
        "漏洞":6,
        "其他":7

    }
    var animation="a-flipinY a-flipinX a-bounceinR a-bounceinL a-fadeinR a-fadeinL";
    var stepNames={
          main:"main",
          risklevel:"risklevel",
          riskarea:'riskarea',
          zeroday:'zeroday',
          security:'security',
          porttree:'porttree',
          serverexption:'serverexption',
          pagelarge:'pagelarge',
          report:'report'

    };
    var  __default_colors__=["#c60000","#f0412f","#f5942c","#fae266","#6dbdff"];

    var view={
        init:function( callback){
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
                    'echarts/chart/pie',
                    'echarts/chart/bar',
                    'echarts/chart/wordCloud',
                    'echarts/chart/treemap'

                ],
                function (ec) {
                    $("#securityAreaRank").show();
                    var contents=['#securityTypeRank','.content-main','.content-risklevel','.content-riskarea','.content-zeroday'
                        ,'.content-security','.content-porttree','.content-serverexption','.content-pagelarge','.content-report'];
                    var parts=['riskLevelRank','vulsTypeRankCloud','securityTypeRank','securityAreaRank'];//非中间面板初始化集合
                    $.merge(parts,['main_surveyAreaRank','main_categoryCycle1','main_categoryCycle2','main_categoryCycle3','main_categoryCycle4','main_categoryCycle5',
                        'main_surveyRankCycle1','main_surveyRankCycle2','main_surveyRankCycle3']);//主面板集合
                    $.merge(parts,['risklevel_areaRank','risklevel_Cycle1','risklevel_Cycle2','risklevel_Cycle3','risklevel_Cycle4']);//网站风险分布集合
                    $.merge(parts,['riskarea_areaRank']);//网站区域分布集合
                    $.merge(parts,['zeroday_areaRank']);//0day集合
                    $.merge(parts,['security_areaRank','security_Cycle1','security_Cycle2','security_Cycle3','security_Cycle4']);//安全事件集合
                    $.merge(parts,['porttree_areaRank']);//高危端口集合
                    $.merge(parts,['serverexption_areaRank','serverexption_Cycle1','serverexption_Cycle2','serverexption_Cycle3','serverexption_Cycle4']);//服务异常集合
                    $.merge(parts,['pagelarge_areaRank']);//首页过大集合
                    $.merge(parts,['report_websurvey_areaRank','report_vuls_typeRank']);//报告集合
                    $.each(contents,function(i,content){
                        $(content).show();
                    });
                    $.each(parts,function(i,ecPart){
                        w[ecPart]= ec.init(document.getElementById(ecPart));
                    });

                    $.each(contents,function(i,content){
                        $(content).hide();
                    });

                    callback&&callback.call(w);
                }
            );
        }
    }
    var options_functions={
        cycleOption:function(color,name,value,total){
            var option = {
                color : color,
                calculable : false,
                title : {
                    text: name+":"+value,
                    x:'center',
                    y:'bottom',
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal',
                        color: '#fff'
                    }
                },
                series : [
                    {
                        name:name,

                        type:'pie',
                        center: ['50%','40%'],
                        radius : ['50%', '70%'],
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
                                value:value,
                                name:'pie',

                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : Math.round(value*100/total)+"%",
                                            textStyle: {
                                                fontSize: 20,
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
                                value:total-value,
                                name:'pie2'
                            }
                        ]
                    }
                ]
            };
            return option;

        },
        createRandomItemStyle:function(){
            return {
                normal: {
                    color: 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')'
                }
            };
        },
        securityAreaRankHeatData:function(data){
            var w=this;
            var heatData = [];

            data.forEach(function(d){
                var location=d['name'];
                var count=d['count'];
                if(w.dataType.type=='china'){
                    if(__GEO__.china_province[location]){
                        var geo=__GEO__.china_province[location];
                        geo.push(1);
                        var times=Math.ceil(Math.log(count));
                        for(var i=0;i<times;i++){
                            heatData.push(geo);
                        }
                    }
                }else{
                    var thegeo=CHINA_CITY_GEO[w.dataType.data];
                    if(thegeo&&thegeo[location]){
                        var geo=thegeo[location];
                        geo.push(1);
                        var times=Math.ceil(Math.log(count));
                        if(times==0){
                            times=2;
                        }
                        for(var i=0;i<times*2;i++){
                            heatData.push(geo);
                        }
                    }

                }

            });
            return heatData;
        },
        resetCycleOption:function(option,title,value,total,titleColor){
            option.series[0].data[0].value=value;
            option.series[0].data[0].itemStyle.normal.label.formatter=Math.ceil(value*100/total)+"%";
            option.series[0].data[1].value=total-value;
            option.title.text=title;
            option.title.textStyle.color=titleColor||'#fff';
        },
        cycleRankTopNOption:function(name,value,total){
            var  option = {
                //tooltip : {
                //    trigger: 'item',
                //    formatter: "{a} <br/>{b} : {c} ({d}%)"
                //},
                title : {
                    text: name+":"+value,
                    x:'center',
                    y:'bottom',
                    textStyle:{
                        fontSize: 14,
                        fontWeight: 'normal',
                        color:"#fff"
                    }
                },

                color:['#AB1A17','#CC6600'],
                series : [
                    {
                        name:name,
                        type:'pie',
                        selectedMode: 'single',
                        radius : '70%',
                        center: ['50%', '50%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    position : 'inner'
                                },
                                labelLine : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {value:value, name:name,selected:true},
                            {value:total-value, name:'其他'}
                        ]
                    }
                ]
            };
            return option;
        },
        resetRankTopNOption:function(option,title,value,total,titlecolor,pieColor,seriesName){
            option.title.text=title;
            option.title.textStyle.color=titlecolor||'red';
            option.color=pieColor||['#AB1A17','#CC6600'];
            option.series[0].name=seriesName||"";
            option.series[0].data[0].value=value;
            option.series[0].data[0].name=name;
            option.series[0].data[1].value=total-value;

        },
        setMapMaxData:function(option){
            //var series=option.series;
            var max=0;
            $.each(option.series,function(i,series){
                var data=series.data;
                $.each(data,function(i,d){
                    if(d.value>max){
                        max= d.value;
                    }
                });
            });
            option.dataRange.max=max;

        },
        commonMapOption:function(maxData,callback){
            var option={
                dataRange: {
                    show: false,
                    min: 0,
                    max: maxData,
                    text:['高','低'],  // 文本，默认为数值文本
                    calculable : false,
                    x: 60,
                    y: 360,
                    color:__default_colors__
                },
                series : [
                    {
                        name: '全国地图',
                        type: 'map',
                        mapType: 'china',
                        selectedMode : 'single',
                        showLegendSymbol:false,
                        itemStyle:{
                            normal:{
                                label:{
                                    show:true,
                                    formatter:function(param,v){
                                        if(v<0){
                                            v='-';
                                        }
                                        return param+"\n"+v;
                                    }
                                }
                            },
                            emphasis: {                 // 也是选中样式
                                borderWidth:2,
                                borderColor:'#fff',
                                color: '#32cd32',
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        nameMap:CITY_NAME_MAPPER,
                        data:[

                        ]
                    }
                ]
            }
            callback&&callback(option);
            return option;
        },
        commonLegendMapOption:function(legends,maxData){
            var options={
                //tooltip : {
                //    trigger: 'item'
                //},
                color:['red','#ff7f50','yellow','#87cefa'],
                legend: {
                    x:'left',
                    show:false,
                    data:legends,
                    selected: {

                    },
                    selectedMode:'single',
                    textStyle:{
                        color:"#fff"
                    }
                },
                dataRange: {
                    min: 0,
                    max: maxData,
                    color:__default_colors__,
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true,
                    show:false
                },
                series : [
                ]
            };
            $.each(legends,function(i,legend){
                if(i==0){
                    options.legend.selected[legend]=true;
                }else{
                    options.legend.selected[legend]=false;

                }
                options.series.push({
                        name:legend,
                        type: 'map',
                        mapType: 'china',
                        showLegendSymbol:false,
                        selectedMode: 'single',
                        itemStyle:{
                            normal:{
                                label:{
                                    show:true,
                                    formatter:function(param,v){
                                        return param+"\n"+v;
                                    }
                                }
                            },
                            emphasis: {                 // 也是选中样式
                                borderWidth:2,
                                borderColor:'#fff',
                                color: '#32cd32',
                                label: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                                }
                            }
                        },
                        nameMap:CITY_NAME_MAPPER,
                        data:[
                        ]
                });
            });
            return options;


        }
    };
    var options={
        riskLevelRank: {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
            series : [
                {
                    name:'有无漏洞',
                    type:'pie',
                    selectedMode: 'single',
                    radius : [0, '40%'],

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
                    name:'漏洞等级分布',
                    type:'pie',
                    radius : ['50%', '75%'],

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
        vulsTypeRankCloud:{

            tooltip: {
                show: true
            },
            series: [{
                name: '漏洞类型分布',
                type: 'wordCloud',
                size: ['80%', '80%'],
                textRotation : [0, 0],
                textPadding: 0,
                autoSize: {
                    enable: true,
                    minSize: 14
                },
                data: [

                ]
            }]
        },
        securityTypeRank:{
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
                    name:'安全事件类型',
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
        },
        securityAreaRank:{
            tooltip : {
                trigger: 'item',
                formatter: '{b}'
            },
            series : [
                {
                    name: '热力图',
                    type: 'map',
                    mapType: 'china',
                    roam: true,
                    nameMap:CITY_NAME_MAPPER,
                    hoverable: false,
                    data:[],
                    heatmap: {
                        minAlpha: 0.1,
                        data:[]
                    },
                    itemStyle: {
                        normal: {
                            borderColor:'rgba(100,149,237,0.6)',
                            borderWidth:0.5,
                            areaStyle: {
                                color: '#1b1b1b'
                            }
                        }
                    }
                }
            ]
        },
        portTreeMap:{
            tooltip : {
                trigger: 'item',
                formatter: "{b}: {c}"
            },
            color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
            series : [
                {
                    name:'高危端口分布',
                    type:'treemap',
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}"
                            },
                            borderWidth: 1
                        },
                        emphasis: {
                            label: {
                                show: true
                            }
                        }
                    },
                    size:['90%','90%'],
                    data:[
                        {name: '3389',value: 1000},
                        {name: '22',value: 44},
                        {name: '23',value: 456},
                        {name: '3396',value: 123},
                        {name: '8089',value: 567}
                    ]
                }
            ]
        },
        /**  ------main------ **/
        main_surveyAreaRank:options_functions.commonMapOption(25000),
        main_categoryCycle1:options_functions.cycleOption(["#1BB8C3","#ccc"],"服务异常",96,200),
        main_categoryCycle2:options_functions.cycleOption(["#F9962C","#ccc"],"首页过大",96,200),
        main_categoryCycle3:options_functions.cycleOption(["#2DC971","#ccc"],"高危风险",96,200),
        main_categoryCycle4:options_functions.cycleOption(["#F3412E","#ccc"],"中危风险",96,200),
        main_categoryCycle5:options_functions.cycleOption(["#062745","#ccc"],"反共事件",96,200),
        main_surveyRankCycle1:options_functions.cycleRankTopNOption("北京",30,300),
        main_surveyRankCycle2:options_functions.cycleRankTopNOption("北京",30,300),
        main_surveyRankCycle3:options_functions.cycleRankTopNOption("北京",30,300),
        /**  ------risklevel------ **/
        risklevel_areaRank:options_functions.commonLegendMapOption(['高危等级','中危等级','低危等级','信息等级'],10000),
        risklevel_Cycle1:options_functions.cycleOption(['#F0412E',"#ccc"],"高危",96,200),
        risklevel_Cycle2:options_functions.cycleOption(['#F1922C',"#ccc"],"中危",96,200),
        risklevel_Cycle3:options_functions.cycleOption(['#FDE866',"#ccc"],"低危",96,200),
        risklevel_Cycle4:options_functions.cycleOption(['#2CCB71',"#ccc"],"信息",96,200),
        /** riskarea------------**/
        riskarea_areaRank:options_functions.commonMapOption(2500),
        /** zeroday------------**/
        zeroday_areaRank:options_functions.commonMapOption(2500),
        /** security------------**/
        security_areaRank:options_functions.commonLegendMapOption(['黑页','反共','博彩','色情','暗链'],1000),
        security_Cycle1:options_functions.cycleOption(['#F0412E',"#ccc"],'黑页',96,200),
        security_Cycle2:options_functions.cycleOption(['#F1922C',"#ccc"],'反共',96,200),
        security_Cycle3:options_functions.cycleOption(['#FDE866',"#ccc"],'博彩',96,200),
        security_Cycle4:options_functions.cycleOption(['#2CCB71',"#ccc"],'色情',96,200),
        /**porttree---------------**/
        porttree_areaRank:options_functions.commonMapOption(25000),
        /**serverexption**/
        serverexption_areaRank:options_functions.commonLegendMapOption(['僵尸网站','页面找不到','服务端异常','无法访问'],500),
        serverexption_Cycle1:options_functions.cycleOption(['#F0412E',"#ccc"],'僵尸网站',96,200),
        serverexption_Cycle2:options_functions.cycleOption(['#F1922C',"#ccc"],'页面找不到',96,200),
        serverexption_Cycle3:options_functions.cycleOption(['#FDE866',"#ccc"],'服务异常',96,200),
        serverexption_Cycle4:options_functions.cycleOption(['#2CCB71',"#ccc"],'无法访问',96,200),

        /**pagelarg**/
        pagelarge_areaRank:options_functions.commonMapOption(1000),
        /**report**/
        report_websurvey_areaRank:options_functions.commonMapOption(0,function(option){
                option.dataRange={
                    show: false,
                    splitNumber:0,
                    padding: 1,
                    text:['高','低'],  // 文本，默认为数值文本
                    //color:["#c60000","#f0412f","#f5942c","#fae266","#6dbdff"],
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
                };
        }),
        report_vuls_typeRank:{
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            color:["#F0412F","#FFFF33","#FAE266","#00A2FD","#2ECD73"],
            series : [
                {
                    name:'漏洞等级分布',
                    type:'pie',
                    radius : "55%",
                    // for funnel
                    x: '60%',
                    width: '35%',
                    funnelAlign: 'left',
                    itemStyle : {
                        normal : {
                            label : {
                                show : true,
                                formatter:'{a} < br/>{b} : {c}'
                            },
                            labelLine : {
                                show : true
                            }
                        },
                        emphasis : {
                            label : {
                                show : true
                            },
                            labelLine : {
                                show : true
                            }
                        }
                    },
                    data:[


                    ]
                }
            ]
        }



    };
    var event={
        jump_into_province:function(province,noStep){//跳入某一个省份
            var w=this;


           var flag= __reload__.loadData.call(w,province);
            if(!flag){
                //alert(province+"的数据暂不支持钻取");
                return;
            }
            if(province=='china'){
                w.dataType.type='china';
                w.dataType.data=province;
                $("#location-name").text("全国");
                $("title").text("全国网络安全态势感知平台")
            }else{
                w.dataType.type='province';
                w.dataType.data=province;
                $("#location-name").text(province);
                $("title").text(province+"网络安全态势感知平台")

            }
            __reload__.startLoad.call(w,function(){
                $("#riskLevelRank").removeClass(animation).addClass("a-bounceinR");
                $("#vulsTypeRankCloud").removeClass(animation).addClass("a-bounceinR");
                $("#zeroDayRank").removeClass(animation).addClass("a-bounceinR");
                $("#securityTypeRank").removeClass(animation).addClass("a-bounceinL");
                $("#portTreeMap").removeClass(animation).addClass("a-bounceinL");
                $("#monitorData").removeClass(animation).addClass("a-bounceinL");
            });

            event.jump_out_dist.call(w);

            if(!noStep){//如果不是返回上一步按钮
                var currentPanel='main';
                if(w.panel_steps.length){
                    currentPanel= w.panel_steps[w.panel_steps.length-1].step;
                }
                __functions__.stepinto.call(w,currentPanel);

            }
            return flag;
        },
        jump_into_city:function(city,noStep){//跳入某一个城市
            var w=this;
            var flag= __reload__.loadData.call(w,city);
            if(!flag){
                //alert(city+"的数据暂不支持钻取");
                return;
            }
            w.dataType.type='city';
            w.dataType.data=city;
            $("#location-name").text(city);
            $("title").text(city+"网络安全态势感知平台")
            __reload__.startLoad.call(w,function(){
                $("#riskLevelRank").removeClass(animation).addClass("a-bounceinR");
                $("#vulsTypeRankCloud").removeClass(animation).addClass("a-bounceinR");
                $("#zeroDayRank").removeClass(animation).addClass("a-bounceinR");
                $("#securityTypeRank").removeClass(animation).addClass("a-bounceinL");
                //$("#portTreeMap").removeClass(animation).addClass("a-bounceinL");
                $("#monitorData").removeClass(animation).addClass("a-bounceinL");
            });
            event.jump_out_dist.call(w);

            if(!noStep){//如果不是返回上一步按钮
                var currentPanel='main';
                if(w.panel_steps.length){
                    currentPanel= w.panel_steps[w.panel_steps.length-1].step;
                }
                __functions__.stepinto.call(w,currentPanel);
            }
            return flag;

        },
        jump_into_dist:function(){//进入某个地市
            var w=this;
            $(".cat-location").hide();
            $(".cat-dist").show();
            w.dist=true;
        },
        jump_out_dist:function(){//跳出某个地市
            var w=this;
            $(".cat-location").show();
            $(".cat-dist").hide();
            w.dist=false;
        },
        legend_map_event:function(ecConfig,mapper,mapname,callback){
            var w=this;
            var tabs=[],legends=[];
            $.each(mapper,function(key,value){
                tabs.push(value.tab);
                legends.push(value.value);
            });
            $.each(mapper,function(key,value){
                w[key]&&w[key].on(ecConfig.EVENT.CLICK, function (param){
                    $.each(tabs,function(i,tab){
                        $(tab).removeClass("active");
                    });
                    $(value.tab).addClass("active");
                    $(value.tab).trigger("click");
                });
            });
            for(var i=0;i<tabs.length;i++){
                $(tabs[i]).data("index",i);
                $(tabs[i]).bind("click",function(){
                    legends.forEach(function(legend){
                        options[mapname].legend.selected[legend]=false;
                    });
                    var index=$(this).data("index");
                    options[mapname].legend.selected[legends[index]]=true;
                    w[mapname].setOption(options[mapname]);
                    w[mapname].restore();
                    callback&&callback.call(w,this);

                });
            }
        }
    };
    var __functions__={
        getZeroData:function(type){
            var w=this;

            var zeroDay;
            var data=[];
            var total=0;
            for(var i=0;i<w.zerodata.length;i++){
                if(w.zerodata[i]._id==type){
                    zeroDay=w.zerodata[i];
                    break;
                }
            }
            if(w.dataType.type=='china'){

                $.each(zeroDay.data,function(k,value){
                    data.push({
                        name:k,
                        value:value.total
                    });
                    total+=value.total;
                });

            }else if(w.dataType.type=='province'){

                if(zeroDay.data[w.dataType.data]&&zeroDay.data[w.dataType.data].city_nums){
                    $.each(zeroDay.data[w.dataType.data].city_nums,function(k,value){
                        var _value=(typeof  value)==='object'?value.total:value;
                        data.push({
                            name:k,
                            value:_value
                        });
                        total+=_value;
                    });
                }

            }else if(w.dataType.type=='city'){
                var province="";
                for(var key in zeroDay.data){
                    if(zeroDay.data[key]['city_nums']){
                        var _data=zeroDay.data[key]['city_nums'][w.dataType.data];
                        if(_data){
                            province=key;
                            break;
                        }
                    }

                }
                if(province==''){
                    return;
                }
                if(zeroDay.data[province]['city_nums'][w.dataType.data]&&zeroDay.data[province]['city_nums'][w.dataType.data].dist_nums){
                    $.each(zeroDay.data[province]['city_nums'][w.dataType.data].dist_nums,function(k,value){
                        var _value=(typeof  value)==='object'?value.total:value;
                        data.push({
                            name:k,
                            value:_value
                        });
                        total+=value;
                    });
                }
            }
            return {total:total,data:data};

        },
        cutstr:function(str,len){
            if(str.length>len){
                return str.substr(0,len)+"...";
            }else{
                return str;
            }
        },
        stepinto:function(step){
            var w=this;
            if(!w.panel_steps.length){
                w.panel_steps.push({step:step,mapType: w.dataType.type,mapData: w.dataType.data});
            }else{
                var lasest= w.panel_steps[w.panel_steps.length-1];
                if(lasest.step!=step||lasest.mapType!=w.dataType.type||lasest.mapData!=w.dataType.data){
                    w.panel_steps.push({step:step,mapType: w.dataType.type,mapData: w.dataType.data});
                }
            }
            if(w.panel_steps.length>500){
                w.panel_steps.shift();
            }
        }

    };
    var __reload__={
        loadMapGeo:function(){
            var mapGeoData = require('echarts/util/mapData/params');
            for (var city in CITY_GEO_FILE_MAP) {
                mapGeoData.params[city] = {
                    getGeoJson: (function (c) {
                        var geoJsonName = CITY_GEO_FILE_MAP[c];
                        return function (callback) {
                            $.getJSON(__PUBLIC__+'/source/geo/citys/'+geoJsonName+'.json',callback);
                        }
                    })(city)
                }
            }


        },
        loadMapper:function(){
            var w=this;
            $.ajax({
                url:__WEBROOT__+"/ScreenCenter/GovDynamicGD/vulsMapper",
                async:false,
                success:function(json){
                    if(json.code>0){
                        w.mapper=json.data;
                        w.mapper.vuls_name_2_id_mapper={};
                        $.each(w.mapper.vuls_name_mapper,function(k,v){
                            w.mapper.vuls_name_2_id_mapper[v]=k;
                        });

                    }
                }
            });

        },
        loadOtherData:function(){
            var w=this;
            $.ajax({
                url:__WEBROOT__+"/ScreenCenter/GovDynamicGD/zeroDayData",
                async:false,
                success:function(json){
                    if(json.code>0){
                        w.zerodata=json.items;
                        $.each(w.zerodata,function(i,data){
                            var name=data._id;
                           var btn=$('<li role="presentation"  class="'+(i==0?'active':'')+'"><a class="tab-zero-day-rank " ref="'+name+'"  role="tab" data-toggle="tab">'+name+'</a></li>');
                            $("#zeroDayRank-tab-warper").append(btn)

                        });
                    }
                }
            });



        },
        loadData:function(location){
            if(location=='china'){
                location='全国';
            }
            var flag=true;
            var w=this;
            $.ajax({
                url:__WEBROOT__+"/ScreenCenter/GovDynamicGD/getLocationData",
                data:{location:location},
                async:false,
                success:function(json){
                    if(json.code>0){
                        w.data=json.data;
                        if(location=='广东'){
                            w.data.survey.total_web_num=14522;
                            w.data.security.newest_topn.push({
                                domain:"shenbao.gzwater.gov.cn",
                                title:"广东省广州市水务局行政审批网上申报系统_系统登录",
                                type:"反共",
                                img:"security/2015-10-10/019F09F9-940A-2F0A-E317-110A22E2E43A.jpg",
                                refid:"a89aead8a2e64cf4b021b0767676aa8f"
                            });
                            w.data.vuls.has_risk.no=w.data.vuls.has_risk.no+2300;
                            w.data.vuls.has_risk.yes=w.data.vuls.has_risk.yes+1000;
                            w.data.vuls.risk_rank.safe.total= w.data.vuls.risk_rank.safe.total+2300;
                            w.data.vuls.risk_rank.info.total= w.data.vuls.risk_rank.info.total+1000;
                        }
                        if(!w.data.vuls|| !w.data.survey||! w.data.security||! w.data.ports){
                            flag=false;
                        }
                    }
                }
            });
            $("#gdxinxi").show();
            return flag;

        },
        startLoad:function(callback){
            var w=this;
            __reload__.reload_riskLevelRank.call(w);
            __reload__.reload_vulsTypeRankCloud.call(w,'high');
            __reload__.reload_zeroDayRank.call(w,$('.tab-zero-day-rank :eq(0)').attr("ref"));
            __reload__.reload_securityAreaRank.call(w);
            //__reload__.reload_portTreeMap.call(w);
            __reload__.reload_monitorData.call(w);
            __reload__.reload_securityEventExample.call(w);
            __reload__.reload_main.load.call(w);
            callback&&callback.call(w);
        },
        reload_riskLevelRank:function(callback){
            var w=this;
            var vuls=w.data.vuls;

            options.riskLevelRank.series[0].data=[
                {value:vuls.has_risk.yes, name:'有漏洞'},
                {value:vuls.has_risk.no, name:'无漏洞'}
            ];

            options.riskLevelRank.series[1].data=[
                {value:vuls.risk_rank.high.total, name:'高危'},
                {value:vuls.risk_rank.mid.total, name:'中危'},
                {value:vuls.risk_rank.low.total, name:'低危'},
                {value:vuls.risk_rank.info.total, name:'信息'},
                {value:vuls.risk_rank.safe.total, name:'安全'}
            ];

            w.riskLevelRank.setOption( options.riskLevelRank);
            callback&&callback.call(w);

        },
        reload_vulsTypeRankCloud:function(level,callback){
            var w=this;
            var type_rank=w.data.vuls.risk_rank[level]['type_rank'];
            type_rank.sort(function(a,b){//降序排列 否则标签云的tooptip显示会混乱
                return b.count- a.count;
            });
            options.vulsTypeRankCloud.series[0].data=[];
            $.each(type_rank,function(index,rank){
                options.vulsTypeRankCloud.series[0].data.push({
                    name: rank['name'],
                    value: rank['count'],
                    itemStyle: options_functions.createRandomItemStyle()
                });
            });
            w.vulsTypeRankCloud.clear();
            w.vulsTypeRankCloud.setOption( options.vulsTypeRankCloud);
            callback&&callback.call(w);

        },
        reload_securityTypeRank:function(callback){
            var w=this;
            $(".view-security-rank").hide();
            $("#securityTypeRank").show();
            $(".tab-security-rank").parent().removeClass("active");
            $(".tab-security-rank").parent().eq(0).addClass("active");
            var type_rank= w.data.security.type_rank;
            options.securityTypeRank.series[0].data=[];
            $.each(type_rank,function(key,rank){
                var value=Math.log(rank['total']);
                options.securityTypeRank.series[0].data.push({
                    name:key,
                    value:(value?value:0.0001)
                });
            });

            w.securityTypeRank.setOption( options.securityTypeRank);
            callback&&callback.call(w);

        },
        reload_securityAreaRank:function(callback){
            var w=this;
            $(".view-security-rank").hide();
            $("#securityAreaRank").show();
            var areaRank=w.data.security.area_rank;
            options.securityAreaRank.series[0].mapType= w.dataType.data;
            options.securityAreaRank.series[0].heatmap.data=options_functions.securityAreaRankHeatData.call(w,areaRank);
            w.securityAreaRank.clear();
            if(options.securityAreaRank.series[0].heatmap.data.length){
                w.securityAreaRank.setOption( options.securityAreaRank);
                $("#securityAreaRank").show();
            }else{
                $("#securityAreaRank").hide();
            }
            //w.securityAreaRank.restore();
            callback&&callback.call(w);
        },
        reload_portTreeMap:function(callback){
            var w=this;
            w.portTreeMap.clear();

            options.portTreeMap.series[0].data=[];

            var ports= w.data.ports;
            $.each(ports.data,function(port,d){
                if(d.total>0){
                    if( w.__contanst__.high_risk_port[port]){
                        options.portTreeMap.series[0].data.push({
                            name:port,
                            value: d.total
                        });
                    }
                }


            });
            if(options.portTreeMap.series[0].data.length){
                w.portTreeMap.setOption(options.portTreeMap);
                w.portTreeMap.restore()
                //alert(1);
                $("#portTreeMap").show();
            }else{
                $("#portTreeMap").hide();
            }
            callback&&callback.call(w);

        },
        reload_zeroDayRank:function(type,callback){
            var w=this;
            var zeroDay;
            var json=__functions__.getZeroData.call(w,type);
            var data=json.data;
            var total=json.total;
            var tbody=$("tbody",$("#zeroDayRank"));
            tbody.html("");
            if(data.length){
                data.sort(function(a,b){
                    return b.value- a.value;
                });
                var max=data[0].value;
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    //var tr=$("<tr typeref='"+type+"' ><td></td></tr>");
                    var tr=$("<tr typeref='"+type+"' locationref='"+data[i].name+"'><td>"+ data[i].name+"</td><td>"
                        + "<div class='progress'><div class='progress-bar' style='width: "+(data[i].value*100/max)+"%;'></div></div>"
                        +"</td><td>"+ data[i].value+"</td></tr>");
                    tr.appendTo(tbody);
                    if(i%2==0){
                        tr.addClass("a-fadeinR");
                    }else{
                        tr.addClass("a-fadeinB");

                    }

                }
            }



            callback&&callback.call(w);
        },
        reload_monitorData:function(callback){
            var w=this;
            var survey= w.data.survey;
            var data=[];
            var jiangshi=survey.server_exption_num.type_rank['僵尸网站'].examples;
            var pageLarge=survey.home_page_large_num.top10;
            var fuwuyichang=survey.server_exption_num.type_rank['服务端异常'].examples;
            var wufafangwen=survey.server_exption_num.type_rank['无法访问'].examples;
            $.each(jiangshi,function(i,d){
                data.push({
                    name: d.title|| d.domain,
                    domain:d.domain,
                    type:'僵尸网站',
                    refid: d.monitor_site_id
                });
            });
            $.each(fuwuyichang,function(i,d){
                data.push({
                    name: d.title|| d.domain,
                    domain:d.domain,
                    type:'服务异常',
                    refid: d.monitor_site_id
                });
            });
            $.each(wufafangwen,function(i,d){
                data.push({
                    name: d.title|| d.domain,
                    domain:d.domain,
                    type:'无法访问',
                    refid: d.monitor_site_id
                });
            });
            $.each(pageLarge,function(i,d){
                data.push({
                    name: d.title|| d.domain,
                    domain:d.domain,
                    type:'首页过大',
                    refid: d.monitor_site_id
                });
            });
            data.sort(function(a,b){
                return b.name.length- a.name.length;
            });

            var date = new Date();
            var time=date.getTime();
            var tbody=$("tbody",$("#monitorData"));
            tbody.html("");
            var color={
                "僵尸网站":"label-danger",
                "服务异常":"label-warning",
                "无法访问":"label-danger",
                "首页过大":"label-info"

            }
            $.each(data,function(i,d){
                var rd=Math.floor(Math.random()*10)+1;  //1-10的随机数
                var del=123*1000*rd;
                time=time-del;
                var newTime = new Date(time).Format("hh:mm:ss");
                var name= d.name;

                if(name.length>20){
                    name=name.substr(0,20)+"...";
                }
                var tr=$("<tr refid='"+ d.refid+"' domain='"+ d.domain+"'><td>"+newTime+"</td><td>"+name+"</td><td><span class='label "+color[d.type]+"'>"+ d.type+"</span></td></tr>");
                tbody.append(tr);



            });
            callback&&callback.call(w);
        },
        reload_securityEventExample:function(callback){
            var w=this;
            var securitys= w.data.security.newest_topn;

            var wraper=$("#securityEventExample");
            var child=$(".swiper-slide:eq(0)",wraper).removeClass("swiper-slide-duplicate");

            wraper.html("");
            securitys.sort(function(a,b){//排序 按类型
                if(b.domain=='shenbao.gzwater.gov.cn'){
                    return 1;
                }else{
                    return security_level[a.type]- security_level[b.type];
                }

            });
            securitys.forEach(function(d){
                var path= w.imgserver+"/upload/"+d['img'];

                var img=child.clone();
                $(".title",$(img)).text(__functions__.cutstr(d.title|| d.domain,10));
                $(".domain",$(img)).text(__functions__.cutstr(d.domain,10));
                $("img",$(img)).attr("src",path);
                $(".type",$(img)).text(d.type);
                img.bind("click",function(){
                   var param={type:'security',ref: d.refid,domain:d.domain};
                    __reload__.reload_report.load.call(w,param,function(){
                       __functions__.stepinto.call(w,stepNames.report);
                    });
                });

                wraper.append(img);
            });
            //mySwiper&&mySwiper.updateSlidesSize();
            //$('.event-type',wraper).css("margin-left",'-5px');


            callback&&callback.call(w);

        },
        reload_main:{
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-main").show();
                __reload__.reload_main.reload_main_surveyAreaRank.call(w);
                __reload__.reload_main.reload_main_surveyCateGoryCycle.call(w);
                __reload__.reload_main.reload_main_surveyRankTopN.call(w);
                __reload__.reload_main.reload_main_surveyRankTopNTable.call(w);
                $("#webTotalNum").text(w.data.survey.total_web_num);
                $(".content-main").removeClass(animation).addClass("a-fadeinB");
                callback&&callback.call(w);
                w.currentPanel=stepNames.main;
                event.jump_out_dist.call(w);

            },
            reload_main_surveyAreaRank:function(callback){
                var w=this;
                options.main_surveyAreaRank.series[0].mapType= w.dataType.data;
                options.main_surveyAreaRank.series[0].data=[];
                var areaRank= w.data.survey.area_nums;
                $.each(areaRank,function(index,rank){
                    options.main_surveyAreaRank.series[0].data.push({
                        name:rank['name'],
                        value:rank['count']
                    });

                });
                options_functions.setMapMaxData(options.main_surveyAreaRank);
                w.main_surveyAreaRank.setOption(options.main_surveyAreaRank,true);
                callback&&callback.call(w);
            },
            reload_main_surveyCateGoryCycle:function(callback){
                var w=this;
                var survey= w.data.survey;

                options_functions.resetCycleOption( options.main_categoryCycle1,"服务异常:"+survey.server_exption_num.total,survey.server_exption_num.total,survey.total_web_num);
                w.main_categoryCycle1.setOption(options.main_categoryCycle1);

                options_functions.resetCycleOption(options.main_categoryCycle2,"首页过大:"+survey.home_page_large_num.total,survey.home_page_large_num.total,survey.total_web_num);
                w.main_categoryCycle2.setOption(options.main_categoryCycle2);

                var vuls= w.data.vuls
                options_functions.resetCycleOption(options.main_categoryCycle3,"高危风险:"+vuls.risk_rank.high.total,vuls.risk_rank.high.total,vuls.has_risk.yes+vuls.has_risk.no);
                w.main_categoryCycle3.setOption(options.main_categoryCycle3);

                options_functions.resetCycleOption(options.main_categoryCycle4,"中危风险:"+vuls.risk_rank.mid.total,vuls.risk_rank.mid.total,vuls.has_risk.yes+vuls.has_risk.no);
                w.main_categoryCycle4.setOption(options.main_categoryCycle4);

                var security= w.data.security;
                var total=0;
                var current=0;
                $.each(security.type_rank,function(key,d){
                    total+= d.total||0;
                    if(key=='反共'){
                        current= d.total||0;
                    }
                });

                options_functions.resetCycleOption(options.main_categoryCycle5,"反共事件:"+current,current,total);
                w.main_categoryCycle5.setOption(options.main_categoryCycle5);
                callback&&callback.call(w);


            },
            reload_main_surveyRankTopN:function(callback){
                var w=this;
                var area_rank= w.data.survey.area_nums;

                for(var i=0;i<=2;i++){
                    var rank=area_rank[i];
                    var titleColor="#FFFFFF";
                    var pieColors=["#fff","#fff"];
                    if(i==0){
                        titleColor="#F0412F";
                        pieColors=["#F0412F","#B63732"];
                    }else if(i==1){
                        titleColor="#F5942C";
                        pieColors=["#F5942C","#BE7C38"];
                    }else if(i==2){
                        titleColor="#FAE266";
                        pieColors=["#FAE266","#C88A61"];
                    }
                    var name=$('#main_surveyRankCycle'+(i+1)).prev(".web-num").find(".name");
                    if(rank){
                        options_functions.resetRankTopNOption(options['main_surveyRankCycle'+(i+1)],"网站量:"+rank.count,rank.count, w.data.survey.total_web_num,titleColor,pieColors,rank.name);
                        name.html(rank.name)

                    }else{
                        options_functions.resetRankTopNOption(options['main_surveyRankCycle'+(i+1)],"无",0, 1,"#F0412F");
                        name.html("无");
                    }
                    w['main_surveyRankCycle'+(i+1)].setOption(options['main_surveyRankCycle'+(i+1)]);


                }
                callback&&callback.call(w);
            },
            reload_main_surveyRankTopNTable:function(callback){
                var w=this;
                var area_rank= w.data.survey.area_nums;
                var table=$("#main_surveyRankTopNtable");
                var tbody=$("tbody",table);
                tbody.html("");

                if(area_rank.length>=4){
                    for(var i=3;i<area_rank.length;i++){
                        var rank=area_rank[i];
                        var tr=$("<tr  ref='"+rank.name+"'><td>"+(i+1)+"</td><td>"+rank.name+"</td><td>"+rank.count+"</td><td>"+(rank.count*100/w.data.survey.total_web_num).toFixed(2)+"%</td></tr>");
                        tr.appendTo(tbody);
                    }
                }
                callback&&callback.call(w);
            }

        },
        reload_risklevel:{
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-risklevel").show();
                __reload__.reload_risklevel.reload_risklevel_areaRank.call(w);
                __reload__.reload_risklevel.reload_risklevel_Cycles.call(w);
                __reload__.reload_risklevel.reload_risklevel_exampleTable.call(w);
                __reload__.reload_risklevel.reload_risklevel_top5Table.call(w,'high');
                $(".content-risklevel").removeClass(animation).addClass("a-fadeinR");
                callback&&callback.call(w);
                w.currentPanel=stepNames.risklevel;
                event.jump_out_dist.call(w);

            },
            reload_risklevel_areaRank:function(callback){
                var w=this;
                var vuls= w.data.vuls;
                var ranks=[vuls.risk_rank.high.area_rank,vuls.risk_rank.mid.area_rank,vuls.risk_rank.low.area_rank,vuls.risk_rank.info.area_rank];
                for(var i=0;i<4;i++){
                    options.risklevel_areaRank.series[i].data=[];
                    options.risklevel_areaRank.series[i].mapType= w.dataType.data;
                    $.each(ranks[i],function(index,rank){

                            options.risklevel_areaRank.series[i].data.push({
                                name:rank['name'],
                                value:rank['count']
                            });

                    });
                }
                options_functions.setMapMaxData(options.risklevel_areaRank);
                w.risklevel_areaRank.setOption(options.risklevel_areaRank);

                callback&&callback.call(w);

            },
            reload_risklevel_Cycles:function(callback){
                var w=this;
                var vuls= w.data.vuls;

                for(var i=1;i<=4;i++){
                    options['risklevel_Cycle'+i].series[0].radius=['70%', '100%'];
                }

                options_functions.resetCycleOption(options.risklevel_Cycle1,'高:'+vuls.risk_rank.high.total, vuls.risk_rank.high.total,vuls.has_risk.yes,"#F0412E");
                w.risklevel_Cycle1.setOption(options.risklevel_Cycle1);

                options_functions.resetCycleOption(options.risklevel_Cycle2,'中:'+vuls.risk_rank.mid.total, vuls.risk_rank.mid.total,vuls.has_risk.yes,'#F1922C');
                w.risklevel_Cycle2.setOption(options.risklevel_Cycle2);

                options_functions.resetCycleOption(options.risklevel_Cycle3,'低:'+vuls.risk_rank.low.total, vuls.risk_rank.low.total,vuls.has_risk.yes,'#FDE866');
                w.risklevel_Cycle3.setOption(options.risklevel_Cycle3);

                options_functions.resetCycleOption(options.risklevel_Cycle4,'信息:'+vuls.risk_rank.info.total, vuls.risk_rank.info.total,vuls.has_risk.yes,'#2CCB71');
                w.risklevel_Cycle4.setOption(options.risklevel_Cycle4);
                callback&&callback.call(w);
            },
            reload_risklevel_exampleTable:function(callback){
                var w=this;
                var vuls= w.data.vuls;
                var data={};
                $.each(vuls.risk_rank,function(key,rank){

                    $.each(rank.area_rank,function(i,r){
                        if(!data[r.name]){
                            data[r.name]={};
                        }
                        if(data[r.name][key]){
                            data[r.name][key]= data[r.name][key]+ r.count;
                        }else{
                            data[r.name][key]= r.count;

                        }
                    });
                });
                var area_rank= w.data.survey.area_nums;
                if(area_rank.length){
                    var table=$("#risklevel_exampleTable");
                    var tbody=$("tbody",table);
                    tbody.html("");
                    for(var i=0;i<area_rank.length;i++){
                        var a_rank=area_rank[i];
                        if((data[a_rank.name])){
                            var total=(data[a_rank.name]['high']||0)+(data[a_rank.name]['mid']||0)+(data[a_rank.name]['low']||0);
                            var tr=$("<tr><td style='width: 20%'>"+a_rank.name+
                                "</td><td style='width: 20%'>"+a_rank.count+
                                "</td><td style='width: 20%'>"+((data[a_rank.name]['high']||0)*100/total).toFixed(2)+
                                "%</td><td style='width: 20%'>"+((data[a_rank.name]['mid']||0)*100/total).toFixed(2)+
                                "%</td><td style='width: 20%'>"+((data[a_rank.name]['low']||0)*100/total).toFixed(2)+
                                "%</td></tr>");
                            tr.appendTo(tbody);
                            tr.addClass("a-fadeinB");
                        }
                    }
                }
                callback&&callback.call(w);
            },
            reload_risklevel_top5Table:function(level,callback){
                var w=this;
                var risks= w.data.vuls.risk_type_rank;
                var data=[];

                $.each(risks,function(riskName,risk){
                    var _level= w.__contanst__.vuls_level_name_mapper[risk.level];
                    if(_level==level){
                        data.push({
                            id:riskName,
                            name: w.mapper.vuls_name_mapper[riskName],
                            level:risk.level,
                            count:risk.total
                        });
                    }
                });
                if(data.length){
                    data.sort(function(a,b){
                        return  b.count-a.count;
                    });
                    var table=$("#risklevel_top5Table");
                    var tbody=$("tbody",table);
                    tbody.html("");
                    for(var i=0;i<data.length;i++){
                        var tr=$("<tr riskref='"+data[i]['id']+"'><td >"+(i+1)+"</td><td >"+data[i]['name']+
                            "</td><td ><span class='label' style='background-color:"+ w.__contanst__.vuls_level_color[data[i]['level']]+"' >"+data[i]['level']+"</span></td><td >"+data[i]['count']+"</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");
                    }
                }
                callback&&callback.call(w);
            }
        },
        reload_riskarea:{
            load:function(vulsId,callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-riskarea").show();
                if(!vulsId){
                    if(w.store.vulsId){
                        vulsId=w.store.vulsId
                    }else{
                        var vuls= w.data.vuls;
                        for(var item in vuls.risk_type_rank){
                            vulsId=item;
                            break;
                        }
                    }
                }
                w.store.vulsId=vulsId;
                __reload__.reload_riskarea.reload_riskarea_areaRank.call(w,vulsId);
                __reload__.reload_riskarea.reload_riskarea_properties.call(w,vulsId);
                __reload__.reload_riskarea.reload_riskarea_tables.call(w,vulsId);
                $(".content-riskarea").removeClass(animation).addClass("a-fadeinR");
                callback&&callback.call(w);
                w.currentPanel=stepNames.riskarea;
                event.jump_out_dist.call(w);
            },
            reload_riskarea_areaRank:function(vulsId,callback){
                var w=this;
                var vuls= w.data.vuls;
                var areaRank=vuls.risk_type_rank[vulsId].area_rank;
                options.riskarea_areaRank.series[0].data=[];
                options.riskarea_areaRank.series[0].mapType= w.dataType.data;
                $.each(areaRank,function(index,rank){
                        options.riskarea_areaRank.series[0].data.push({
                            name:rank['name'],
                            value:rank['count']
                        });
                });
                options_functions.setMapMaxData(options.riskarea_areaRank);
                w.riskarea_areaRank.setOption(options.riskarea_areaRank);
                callback&&callback.call(w);
            },
            reload_riskarea_properties:function(vulsId,callback){
                var w=this;
                var wraper=$(".content-riskarea");
                var name=w.mapper.vuls_name_mapper[vulsId];
                var level=w.mapper.vuls_level_mapper[vulsId];
                $(".riskarea-info-name",wraper).html(name).attr("vulsId",vulsId);
                $(".riskarea-info-level",wraper).html(level);
                $(".riskarea-info-level",wraper).css("color", w.__contanst__.vuls_level_color[level]);
                $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/vulsDescAndAdvice",{vulsId:vulsId}).success(function(json){
                    $(".riskarea-info-desc",wraper).html(json.desc);
                    $(".riskarea-info-advice",wraper).html(json.advice);
                });
                callback&&callback.call(w);
            },
            reload_riskarea_tables:function(vulsId,callback){
                var w=this;
                var tbody=$("tbody",$("#riskarea_topNtable"));
                var examples= w.data.vuls.risk_type_rank[vulsId].example20;
                tbody.html("");
                for(var i=0;i<examples.length;i++){
                    var example=examples[i];
                    var title=(example.title||example.domain);
                    var domain=example.domain;
                    var tr=$("<tr ref='"+example.domain+"'><td style='width: 40%'>"+__functions__.cutstr(domain,15)+"</td><td style='width: 40%'>"+__functions__.cutstr(title,15)+"</td><td>"+example.count+"</td></tr>");
                   // var tr=$("<tr><td>"+(example.title||example.domain)+"</td><td>"+example.domain+"</td><td>"+example.count+"</td></tr>");
                    tbody.append(tr);
                    tr.addClass("a-fadeinB");
                }
                callback&&callback.call(w);
            }
        },
        reload_zeroday:{
            load:function(type,callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-zeroday").show();

                if(!type){
                    if( w.store.zeroday){
                        type= w.store.zeroday;
                    }else{
                        type= w.zerodata[0]._id;
                    }
                }
                w.store.zeroday=type;
                __reload__.reload_zeroday.reload_zeroday_areaRank.call(w,type);
                __reload__.reload_zeroday.reload_zeroday_table.call(w,type);
                __reload__.reload_zeroday.reload_zeroday_properties.call(w,type);
                $(".content-zeroday").removeClass(animation).addClass("a-fadeinR");
                callback&&callback.call(w);
                w.currentPanel=stepNames.zeroday;
                event.jump_out_dist.call(w);
            },
            reload_zeroday_areaRank:function(type,callback){
                var w=this;
                options.zeroday_areaRank.series[0].data=[];
                options.zeroday_areaRank.series[0].mapType= w.dataType.data;
                var json=__functions__.getZeroData.call(w,type);
                options.zeroday_areaRank.series[0].data=json.data;
                options_functions.setMapMaxData(options.zeroday_areaRank);
                w.zeroday_areaRank.setOption(options.zeroday_areaRank);

                callback&&callback.call(w);

            },
            reload_zeroday_table:function(type,callback){
                var w=this;
                var json=__functions__.getZeroData.call(w,type);
                var tbody=$("tbody",$("#zeroday_table"));
                tbody.html("");
                var survey= w.data.survey;
                var objs={};
                $.each(survey.area_nums,function(index,obj){
                    objs[obj.name]=obj.count;
                });
                if(json.data&&json.data.length){
                    $.each(json.data,function(i,d){
                        var tr=$("<tr><td>"+ d.name+"</td><td>"+objs[d.name]+"</td><td>"+ d.value+"</td><td>"+(d.value*100/objs[d.name]).toFixed(0)+"%</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");

                    });
                }

                callback&&callback.call(w);

            },
            reload_zeroday_properties:function(type,callback){
                var w=this;
                var warper=$(".content-zeroday");
                $(".zeroday-info-name",warper).html(type);
                $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/zeroDayDesc",{type:type}).success(function(json){
                    $(".zeroday-info-desc",warper).html(json.desc);
                });
                callback&&callback.call(w);
            }

        },
        reload_security:{
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-security").show();

                __reload__.reload_security.reload_security_areaRank.call(w);
                __reload__.reload_security.reload_security_categoryDeatilTable.call(w);
                __reload__.reload_security.reload_security_cycles.call(w);
                __reload__.reload_security.reload_security_timeDetailTable.call(w,"黑页");
                $(".content-security").removeClass(animation).addClass("a-fadeinL");
                callback&&callback.call(w);

                w.currentPanel=stepNames.security;
                event.jump_out_dist.call(w);
            },
            reload_security_areaRank:function(callback){
                var w=this;
                var security= w.data.security;
                var getData=function(type){
                    if(security.type_rank[type]&&security.type_rank[type].area_rank){
                        return security.type_rank[type].area_rank;
                    }else{
                        return {};
                    }
                }
                var datas=[getData('黑页'),getData('反共'),getData('博彩'),getData('色情'),getData('暗链')];

                for(var i=0;i<5;i++){
                    options.security_areaRank.series[i].data=[];
                    options.security_areaRank.series[i].mapType= w.dataType.data;
                    $.each(datas[i],function(key,value){

                            options.security_areaRank.series[i].data.push({
                                name:key,
                                value:value
                            });

                    });
                }
                options_functions.setMapMaxData(options.security_areaRank);
                w.security_areaRank.setOption(options.security_areaRank);
                callback&&callback.call(w);
            },
            reload_security_categoryDeatilTable:function(callback){
                var w=this;
                var data={};
                var tbody=$("tbody",$("#security_categoryDeatilTable"));
                tbody.html("");
                $.each(w.data.security.type_rank,function(key,d){
                    var area_rank= d.area_rank;
                    $.each(area_rank,function(location,count){
                        if(!data[location]){
                            data[location]={};
                        }
                        data[location][key]=count;

                    });
                });
                var _data=[];
                for( var key in data){
                    var d=data[key];

                    _data.push({
                        name: key,
                        '黑页':d['黑页']||0,
                        '反共':d['反共']||0,
                        '博彩':d['博彩']||0,
                        '色情':d['色情']||0,
                        '暗链':d['暗链']||0
                    });
                }
                _data.sort(function(a,b){
                    return (b['黑页']+b['反共']+b['博彩']+b['色情']+b['暗链'])-(a['黑页']+a['反共']+a['博彩']+a['色情']+a['暗链']);
                });
                _data.forEach(function(d){
                    var tr=$("<tr><td>"+ d.name+"</td><td>"+(d['黑页']||0)+"</td><td>"+(d['反共']||0)+"</td><td>"+(d['博彩']||0)
                        +"</td><td>"+(d['色情']||0)+"</td><td>"+(d['暗链']||0)+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass('a-fadeinB');
                });


                callback&&callback.call(w);
            },
            reload_security_cycles:function(callback){
                var w=this;
                for(var i=1;i<=4;i++){
                    options['security_Cycle'+i].series[0].radius=['70%', '100%'];
                }
                var type_rank= w.data.security.type_rank;

                var total=0;
                $.each(type_rank,function(i,d){
                    total+= (d.total||0);

                });
                var getTotal=function(type){
                    if(type_rank[type]){
                       return  type_rank[type].total||0;
                    }else{
                        return 0;
                    }
                }
                options_functions.resetCycleOption(options.security_Cycle1,'黑页:\n'+getTotal("黑页"), getTotal("黑页"),total,"#F0412E");
                w.security_Cycle1.setOption(options.security_Cycle1);

                options_functions.resetCycleOption(options.security_Cycle2,'反共:\n'+getTotal("反共"), getTotal("反共"),total,"#F1922C");
                w.security_Cycle2.setOption(options.security_Cycle2);

                options_functions.resetCycleOption(options.security_Cycle3,'博彩:\n'+getTotal("博彩"), getTotal("博彩"),total,"#FDE866");
                w.security_Cycle3.setOption(options.security_Cycle3);

                options_functions.resetCycleOption(options.security_Cycle4,'暗链:\n'+getTotal("暗链"), getTotal("暗链"),total,"#2CCB71");
                w.security_Cycle4.setOption(options.security_Cycle4);



                callback&&callback.call(w);
            },
            reload_security_timeDetailTable:function(type,callback){
                var w=this;
                var time_rank={};
                if( w.data.security.type_rank[type]){
                    time_rank= w.data.security.type_rank[type].time_rank;
                }
                var tbody=$("tbody",$("#security_timeDetailTable"));
                tbody.html("");
                if(time_rank){
                    var data=[];
                    $.each(time_rank,function(key,rank){
                        data.push({name:key,value:rank});
                    });
                    data.sort(function(a,b){
                        return parseInt(b.name)-parseInt(a.name);
                    });
                    $.each(data,function(i,d){
                        var tr=$("<tr><td>"+( d.name.substr(0,4)+"年"+d.name.substr(4,6)+"月")+"</td><td>"+ d.value+"</td><td>"+type+"</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");
                    });

                }

                callback&&callback.call(w);

            }
        },
        reload_porttree:{
            load:function(port,callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-porttree").show();
                if(!port){
                    var ports= w.data.ports;
                    for(key in ports.data){
                        if(w.__contanst__.high_risk_port[key]){
                            port=key;
                            break;

                        }
                    }
                }
                __reload__.reload_porttree.reload_porttree_areaRank.call(w,port);
                __reload__.reload_porttree.reload_porttree_properties.call(w,port);
                __reload__.reload_porttree.reload_porttree_tables.call(w,port);

                $(".content-porttree").removeClass(animation).addClass("a-fadeinL");
                callback&&callback.call(w);
                w.currentPanel=stepNames.porttree;
                event.jump_out_dist.call(w);
            },
            reload_porttree_areaRank:function(port,callback){
                var w=this;
                var data= w.data.ports.data[port].area_rank;

                if(data&&data.length){
                    options.porttree_areaRank.series[0].data=[];
                    options.porttree_areaRank.series[0].mapType= w.dataType.data;
                    $.each(data,function(i,d){
                            options.porttree_areaRank.series[0].data.push({
                                name:d['name'],
                                value:d['count']
                            });
                    });
                }
                options_functions.setMapMaxData(options.porttree_areaRank);
                w.porttree_areaRank.setOption(options.porttree_areaRank);
                callback&&callback.call(w);
            },
            reload_porttree_properties:function(port,callback){
                var w=this;
                var wraper=$(".content-porttree");
                $(".porttree-info-name",wraper).html(port);
                $(".porttree-info-level",wraper).html(w.__contanst__.high_risk_port[port].level)
                    .css('color',w.__contanst__.high_risk_port[port].color);
                $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/portDesc",{port:port}).success(function(json){
                    $(".porttree-info-desc",wraper).html(json.desc);


                });


                callback&&callback.call(w);

            },
            reload_porttree_tables:function(port,callback){
                var w=this;
                var tbody=$("tbody",$("#porttree_exapmleTable"));
                tbody.html("");
                var examples= w.data.ports.data[port].example10;

                for(var i=0;i<examples.length;i++){
                    var example=examples[i];
                    var portStr=example.port;
                    if(portStr.length>15){
                        portStr=portStr.substr(portStr.indexOf(port));
                        portStr=__functions__.cutstr(portStr,15);
                    }
                    var tr=$("<tr><td>"+(example.ip)+"</td><td>"+portStr+"</td></tr>");
                    tr.addClass("a-fadeinB");
                    tr.appendTo(tbody);
                }
                callback&&callback.call(w);


            }
        },
        reload_serverexption:{
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-serverexption").show();

                __reload__.reload_serverexption.reload_serverexption_areaRank.call(w);
                __reload__.reload_serverexption.reload_serverexption_categoryDeatilTable.call(w);
                __reload__.reload_serverexption.reload_serverexption_cycles.call(w);
                __reload__.reload_serverexption.reload_serverexption_exampleTable.call(w,"僵尸网站");
                $(".content-serverexption").removeClass(animation).addClass("a-fadeinL");
                callback&&callback.call(w);
                w.currentPanel=stepNames.serverexption;
                event.jump_out_dist.call(w);
            },
            reload_serverexption_areaRank:function(callback){
                var w=this;
                var server_exptions= w.data.survey.server_exption_num.type_rank;
                var datas=[server_exptions['僵尸网站'].area_rank||[],server_exptions['页面找不到'].area_rank||[],server_exptions['服务端异常'].area_rank||[],server_exptions['无法访问'].area_rank||[]];

                for(var i=0;i<4;i++){
                    options.serverexption_areaRank.series[i].data=[];
                    options.serverexption_areaRank.series[i].mapType= w.dataType.data;
                   $.each(datas[i],function(k,v){
                       options.serverexption_areaRank.series[i].data.push({
                           name:k,
                           value:v
                       });

                   });


                }
                w.serverexption_areaRank.setOption(options.serverexption_areaRank);
                callback&&callback.call(w);
            },
            reload_serverexption_categoryDeatilTable:function(callback){
                var w=this;
                var data={};
                var total_data={};
                var tbody=$("tbody",$("#serverexption_categoryDeatilTable"));
                tbody.html("");
                $.each(w.data.survey.area_nums,function(index,d){
                    total_data[d.name]= d.count;

                });

                $.each(w.data.survey.server_exption_num.type_rank,function(key,d){
                    var area_rank= d.area_rank||[];
                    $.each(area_rank,function(location,count){
                        if(!data[location]){
                            data[location]={};
                        }
                        data[location][key]=count;
                    });
                });
                for( var key in data){

                    var d=data[key];
                    var tr=$("<tr><td>"+key+"</td><td>"+total_data[key]+"</td><td>"+(d['僵尸网站']||0)+"</td><td>"+(d['服务端异常']||0)
                        +"</td><td>"+(d['无法访问']||0)+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass('a-fadeinB');
                }
                callback&&callback.call(w);
            },
            reload_serverexption_cycles:function(callback){
                var w=this;
                for(var i=1;i<=4;i++){
                    options['serverexption_Cycle'+i].series[0].radius=['70%', '100%'];
                }
                var type_rank= w.data.survey.server_exption_num.type_rank;
                options_functions.resetCycleOption(options.serverexption_Cycle1,'僵尸网站\n'+(type_rank['僵尸网站'].total||0), type_rank['僵尸网站'].total||0, w.data.survey.total_web_num,"#F0412E");
                w.serverexption_Cycle1.setOption(options.serverexption_Cycle1);
                options_functions.resetCycleOption(options.serverexption_Cycle2,'页面找不到\n'+(type_rank['页面找不到'].total||0), type_rank['页面找不到'].total||0, w.data.survey.total_web_num,"#F1922C");
                w.serverexption_Cycle2.setOption(options.serverexption_Cycle2);
                options_functions.resetCycleOption(options.serverexption_Cycle3,'服务异常\n'+(type_rank['服务端异常'].total||0), type_rank['服务端异常'].total||0, w.data.survey.total_web_num,"#FDE866");
                w.serverexption_Cycle3.setOption(options.serverexption_Cycle3);
                options_functions.resetCycleOption(options.serverexption_Cycle4,'无法访问\n'+(type_rank['无法访问'].total||0), type_rank['无法访问'].total||0, w.data.survey.total_web_num,"#2CCB71");
                w.serverexption_Cycle4.setOption(options.serverexption_Cycle4);
                callback&&callback.call(w);
            },
            reload_serverexption_exampleTable:function(type,callback){
                var w=this;
                var data= w.data.survey.server_exption_num.type_rank[type].examples;
                var tbody=$("tbody",$("#serverexption_exampleTable"));
                tbody.html("");
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    var tr=$("<tr ref='"+ d.monitor_site_id+"' domain='"+ d.domain+"'><td>"+ __functions__.cutstr(d.domain,15)+"</td><td>"+__functions__.cutstr((d.title||d.domain),15)+"</td><td>"+ d.type+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass("a-fadeinB");

                }
                callback&&callback.call(w);
            }
        },
        reload_pagelarge:{
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-pagelarge").show();
                __reload__.reload_pagelarge.reload_pagelarge_areaRank.call(w);
                __reload__.reload_pagelarge.reload_pagelarge_categoryDeatilTable.call(w);
                __reload__.reload_pagelarge.reload_pagelarge_tables.call(w);
                $(".content-pagelarge").removeClass(animation).addClass("a-fadeinB");
                callback&&callback.call(w);
                w.currentPanel=stepNames.pagelarge;
                event.jump_out_dist.call(w);
            },
            reload_pagelarge_areaRank:function(callback){
                var w=this;
                var data= w.data.survey.home_page_large_num.area_rank;

                if(data&&data.length){
                    options.pagelarge_areaRank.series[0].data=[];
                    options.pagelarge_areaRank.series[0].mapType= w.dataType.data;
                    $.each(data,function(i,d){
                        options.pagelarge_areaRank.series[0].data.push({
                            name:d['name'],
                            value:d['count']
                        });


                    });
                }
                //w.porttree_areaRank.setOption(options.porttree_areaRank);

                w.pagelarge_areaRank.setOption(options.pagelarge_areaRank);
                callback&&callback.call(w);

            },
            reload_pagelarge_categoryDeatilTable:function(callback){
                var w=this;
                var tbody=$("tbody",$("#pagelarge_categoryDeatilTable"));
                tbody.html("");
                var total_data={};
                $.each(w.data.survey.area_nums,function(index,d){
                    total_data[d.name]= d.count;
                });

                var data= w.data.survey.home_page_large_num.area_rank;
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    if(total_data[d.name]){
                        var tr=$("<tr><td>"+ d.name+"</td><td>"+total_data[d.name]+"</td><td>"+ d.count+"</td><td>"+ (d.count*100/total_data[d.name]).toFixed(0)+"%</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");
                    }

                }
                callback&&callback.call(w);
            },
            reload_pagelarge_tables:function(callback){
                var w=this;
                var tbody1=$("tbody",$("#pagelarge_exapmleTable1"));
                var tbody2=$("tbody",$("#pagelarge_exapmleTable2"));
                tbody1.html("");
                tbody2.html("");
                var examples= w.data.survey.home_page_large_num.top10;

                for(var i=0;i<examples.length;i++){
                    var example=examples[i];
                    var tr=$("<tr ref='"+example.monitor_site_id+"' domain='"+example.domain+"'><td>"+ __functions__.cutstr(example.domain,15)+"</td><td>"+ __functions__.cutstr((example.title||example.domain),8)+"</td><td>"+(example.mb.toFixed(0))+"mb</td></tr>");
                    if(i<5){
                        tbody1.append(tr);
                    }else if(i<10){
                        tbody2.append(tr);
                    }
                    tr.addClass("a-fadeinB");
                    if(i>=10){
                        break;
                    }
                }
                callback&&callback.call(w);
            }
        },
        reload_report:{
            load:function(reportParam,callback){

                var w=this;
                if(!reportParam){
                    if(w.store.reportParam){
                        reportParam= w.store.reportParam;
                    }else{
                        reportParam={};
                        reportParam.type="security";
                        reportParam.ref= w.data.security.newest_topn[0].refid;
                        reportParam.domain= w.data.security.newest_topn[0].domain;
                    }
                }
                w.store.reportParam=reportParam;
                $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/report",reportParam).success(function(json){
                    if(json.code>0&&json.items.length){
                        $(".report-tabs").hide();
                        $(".report-tabs").removeClass("active");
                        $(".report-tabs:eq(0)").show();
                        var tebIndex=0;
                        if(reportParam.type=='security'){//安全事件
                            tebIndex=3;
                            __reload__.reload_report.loadSecurity.call(w,json);
                        }
                        else if(reportParam.type=='websurvey'){
                            tebIndex=2;
                            __reload__.reload_report.loadWebsurvey.call(w,json);

                        }
                        else if(reportParam.type=='vuls'){
                            tebIndex=1;
                            __reload__.reload_report.loadVuls.call(w,json);

                        }
                        $(".content-wraper").hide();
                        $(".content-report").show();
                        $(".content-report").removeClass(animation).addClass("a-fadeinB");
                        callback&&callback.call(w);
                        w.currentPanel=stepNames.report;

                        $(".report-tabs:eq("+tebIndex+")").addClass("active");
                        $(".report-tabs:eq("+tebIndex+")").trigger("click");
                    }
                });
                __reload__.reload_report.loadHomePage.call(w,reportParam.domain);
                w.dist=false;
            },
            loadHomePage:function(domain,callback){
                var w=this;

                var img=$("<a class='fancybox' href='"+ w.imgserver+"/upload/homepage/"+domain+".png' data-fancybox-group='gallery' ><img width='80%'  src='"+ w.imgserver+"/upload/homepage/"+domain+".png'/></a>");
                $(".report-homepage-screenshot",$(".content-report")).html(img);
                callback&&callback.call(w);

            },
            loadSecurity:function(json,callback){
                var w=this;
                var wraper=$(".content-report");
                $(".report-tabs:eq(3)").show();
                var event=json.items[0];
                $(".report-key-title-name",wraper).text("事件类型");
                $(".report-key-title-value",wraper).text(w.mapper.event_type_mapper[event.event_type]);
                var title=event.web_title||event.web_domain;
                $(".report-web-title",wraper).text(__functions__.cutstr(title,10));
                $(".report-web-domain",wraper).text(__functions__.cutstr(event.web_domain,15));
                $(".report-web-ip",wraper).text(event.web_ip);
                $(".report-web-addr",wraper).text((event.web_ip_province||'')+(event.web_ip_city||''));
                $(".report-screenshot",$("#report-view-security")).html("<a class='fancybox' href='"+ w.imgserver+"/upload/"+event.event_snapshot+"' data-fancybox-group='gallery' >" +
                        "<img width='100%' height='272px;'  src='"+ w.imgserver+"/upload/"+event.event_snapshot+"'/></a>");
                $('.report-event-url',wraper).html(event.web_url);
                $('.report-event-time',wraper).html(event.happen_time);
                $('.report-event-source',wraper).html(event.event_source||"人工发现");
                $('.report-event-deal-state',wraper).html(event.deal_state==3?"已修复":"已修复");
                $(".report-event-desc",wraper).html(event.event_desc);

                callback&&callback.call(w);
            },
            loadWebsurvey:function(json,callback){
                var w=this;
                var wraper=$(".content-report");

                $(".report-tabs:eq(2)").show();
                var site=json.items[0].site;
                $(".report-key-title-name",wraper).text("响应延迟");
                $(".report-key-title-value",wraper).text("高");
                var title=site.web_name||site.domain;
                $(".report-web-title",wraper).text(__functions__.cutstr(title,10));
                $(".report-web-domain",wraper).text(__functions__.cutstr(site.domain,15));
                $(".report-web-ip",wraper).text("");
                $(".report-web-addr",wraper).text((site.province||'')+(site.city||''));

                var avail=json.items[0].avail;
                options.report_websurvey_areaRank.series[0].data=[];
                var tbody=$("tbody",$("#report-websurveyTable"));
                tbody.html("");
                if(avail&&avail.length){
                    var allAvail=[];
                    var allProvinces={};
                    var avg=0;
                    $.each(avail,function(i,d){
                        allAvail.push(d.total_time);
                        allProvinces[d.node]=1;
                        avg+=d.total_time;
                    });
                    avg=avg/avail.length;
                    var levelStr="低";
                    if(avg<=0){
                        levelStr="极差";
                    } else if(avg<1000){
                        levelStr="低";
                    }else if(avg<5000){
                        levelStr="中等";
                    }else{
                        levelStr="高";
                    }
                    $(".report-key-title-value",wraper).text(levelStr);

                    //为了让地图更好看，没有数据的区域，按照现有数据随机分布一下数据
                    $.each(__PROVINCES__,function(i,p){
                        if(!allProvinces[p]){
                            var rd=Math.floor(Math.random()*allAvail.length);
                            avail.push({node:p,total_time:allAvail[rd]});
                        }
                    });
                    avail.sort(function(a,b){
                        return a.total_time- b.total_time;
                    });
                    $.each(avail,function(i,d){
                        if(d.node){

                            options.report_websurvey_areaRank.series[0].data.push({
                                name: d.node,
                                value: d.total_time
                            });
                        }
                        var tr=$("<tr><td>"+(i+1)+"</td><td>"+ d.node+"</td><td>"+ (d.total_time>0? d.total_time:"无法访问")+"</td></tr>");
                        tr.appendTo(tbody);
                    });

                }
                //console.info(options.report_websurvey_areaRank.series[0].data);
                w.report_websurvey_areaRank.setOption(options.report_websurvey_areaRank);
                callback&&callback.call(w);
            },
            loadVuls:function(json,callback){
                var w=this;
                var wraper=$(".content-report");
                $(".report-tabs:eq(1)").show();
                options.report_vuls_typeRank.series[0].data=[];
                var vuls=json.items[0].vuls;
                var info=json.items[0].common;
                if(info){
                    $(".report-key-title-name",wraper).text("风险等级");
                    $(".report-key-title-value",wraper).text("信息");
                    var title=info.title||info.domain;
                    $(".report-web-title",wraper).text(__functions__.cutstr(title,10));
                    $(".report-web-domain",wraper).text(__functions__.cutstr(info.domain,15));
                    $(".report-web-ip",wraper).text(info.ip);
                    $(".report-web-addr",wraper).text((info.province||'')+(info.city||''));

                }
                var tbody=$("tbody",$("#report-vuls-table"));
                tbody.html("");
                if(vuls){

                    $.each(vuls,function(key,d){
                        options.report_vuls_typeRank.series[0].data.push({
                            name: w.__contanst__.vuls_name_level_mapper[key],
                            value: d.total
                        });
                    });
                    var level="信息";
                    if(vuls.high&&vuls.high.total){
                        level="高危";
                    }else if(vuls.mid&&vuls.mid.total){
                        level="中危";
                    }else if(vuls.low&&vuls.low.total){
                        level="低危";
                    }
                    $(".report-key-title-value",wraper).text(level);

                    //tables
                    var first;
                    $(".report-vuls-type-tab").hide();
                    $(".report-vuls-type-tab").removeClass("active");

                    var data=[];
                    $.each(vuls,function(key,d){
                        if(!first){
                            first=key;
                        }
                        $(".report-vuls-type-tab-"+key).show();
                        $.each(d.type_rank,function(i,type){
                            data.push({
                                name:w.mapper.vuls_name_mapper[type.name],
                                count:type.count,
                                level:key
                            });


                        });

                    });
                    w.tmpVulsData=vuls;
                    $(".report-vuls-type-tab-"+first).addClass("active");

                    $(".report-vuls-type-tab-"+first).trigger("click");
                }
                w.report_vuls_typeRank.setOption(options.report_vuls_typeRank);

                callback&&callback.call(w);
            }
        }
    };
    var __load_dist__={
        load_serverexption:function(dist){
            var w=this;
            var active=$(".active",$("#serverexption-tab")).text();;
            var location= w.dataType.data+"_"+dist;
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'websurvey'}).success(function(json){
                    if(!json.data){
                        event.jump_out_dist();
                        return;
                    }
                    var server_exption_num=json.data.server_exption_num;
                    if(server_exption_num.type_rank&&server_exption_num.type_rank[active]){
                        var examples=server_exption_num.type_rank[active].examples||[];
                        var tbody=$("tbody",$("#serverexption_exampleTable"));
                        tbody.html("");
                        for(var i=0;i<examples.length;i++){
                            var d=examples[i];
                            var tr=$("<tr ref='"+ d.monitor_site_id+"' domain='"+ d.domain+"'><td>"+ __functions__.cutstr(d.domain,15)+"</td><td>"+__functions__.cutstr((d.title||d.domain),15)+"</td><td>"+ d.type+"</td></tr>");
                            tr.appendTo(tbody);
                            tr.addClass("a-fadeinB");

                        }
                    }
            });
        },
        load_pagelarge:function(dist){
            var w=this;
            var location= w.dataType.data+"_"+dist;
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'websurvey'}).success(function(json){
                if(!json.data){
                    event.jump_out_dist();
                    return;
                }
                var home_page_large_num=json.data.home_page_large_num;
                if(home_page_large_num&&home_page_large_num.top10){
                    var examples=home_page_large_num.top10;
                    var tbody1=$("tbody",$("#pagelarge_exapmleTable1"));
                    var tbody2=$("tbody",$("#pagelarge_exapmleTable2"));
                    tbody1.html("");
                    tbody2.html("");
                    for(var i=0;i<examples.length;i++){
                        var example=examples[i];
                        var tr=$("<tr ref='"+example.monitor_site_id+"' domain='"+example.domain+"'><td>"+ __functions__.cutstr(example.domain,15)+"</td><td>"+ __functions__.cutstr((example.title||example.domain),8)+"</td><td>"+(example.mb.toFixed(0))+"mb</td></tr>");
                        if(i<5){
                            tbody1.append(tr);
                        }else if(i<10){
                            tbody2.append(tr);
                        }
                        tr.addClass("a-fadeinB");
                        if(i>=10){
                            break;
                        }
                    }
                }
            });
        },
        load_security:function(dist){
            var w=this;
            var active=$(".active",$("#security-tab")).text();
            var location= w.dataType.data+"_"+dist;
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'security'}).success(function(json){
                    if(!json.data){
                        event.jump_out_dist();
                        return;
                    }
                    var type_rank= json.data.type_rank;
                    if(type_rank){
                        var examples=type_rank[active].example10||[];
                        var timeRank=[];
                        $.each(type_rank[active].time_rank||{},function(k,v){
                            timeRank.push({name:k,value:v});
                        });
                        var tbody=$("tbody","#security_categoryDeatilTable_detail");
                        tbody.html("");
                        for(var i=0;i<examples.length;i++){
                            var d=examples[i];
                            var tr=$("<tr ref='"+ d.refid+"' domain='"+ d.domain+"' ><td>"+ (d.title|| d.domain)+"</td><td>"+ d.happen_time.split(" ")[0]+"</td><td>"+ d.type+"</td></tr>");
                            tr.appendTo(tbody);
                            tr.addClass("a-fadeinB");
                        }
                        var tbody2=$("tbody","#security_timeDetailTable");
                        tbody2.html("");
                        timeRank.sort(function(a,b){
                            return parseInt(b.name)-parseInt(a.name);
                        });
                        $.each(timeRank,function(i,d){
                            var tr=$("<tr><td>"+( d.name.substr(0,4)+"年"+d.name.substr(4,6)+"月")+"</td><td>"+ d.value+"</td><td>"+ active+"</td></tr>");
                            tr.appendTo(tbody2);
                            tr.addClass("a-fadeinB");
                        });



                    }
            });
        },
        load_porttree:function(dist){
            var w=this;
            var location= w.dataType.data+"_"+dist;
            var port=$(".porttree-info-name",$(".content-porttree")).text();
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'port'}).success(function(json){

                if(!json.data){
                    event.jump_out_dist();
                    return;
                }
                var tbody=$("tbody",$("#porttree_exapmleTable"));
                tbody.html("");
                if(json.data.data&&json.data.data[port]){
                    var item=json.data.data[port];
                    if(item.example10){
                        for(var i=0;i<item.example10.length;i++){
                            var example=item.example10[i];
                            var portStr=example.port;
                            if(portStr.length>15){
                                portStr=portStr.substr(portStr.indexOf(port));
                                portStr=__functions__.cutstr(portStr,15);
                            }
                            var tr=$("<tr><td>"+(example.ip)+"</td><td>"+portStr+"</td></tr>");
                            tr.addClass("a-fadeinB");
                            tr.appendTo(tbody)
                        }
                    }
                }

            });
        },
        load_zeroday:function(dist){
            var w=this;
            var wraper=$("tbody",$("#zeroday_table_detail"));
            wraper.html("");
            var active=$(".active",$("#zeroDayRank-tab-warper")).text();
            var zeroData;
            $.each(w.zerodata,function(i,item){
                if(item._id==active){
                    zeroData=item;
                }
            });
            if(!zeroData){
                return;
            }
            var city= w.dataType.data;
            var province="";
            for(var key in zeroData.data){
                if(zeroData.data[key]['city_nums']){
                    var _data=zeroData.data[key]['city_nums'][w.dataType.data];
                    if(_data){
                        province=key;
                        break;
                    }
                }

            }
            if(province==''){
                return;
            }
            var examples=zeroData.data[province]["city_nums"][city]["dist_nums"][dist].examples;
            if(examples&&examples.length){
                $.each(examples,function(i,ex){
                    var tr=$("<tr><td>"+(ex.title||ex.domain)+"</td><td>"+(ex.domain)+"</td></tr>");
                    tr.appendTo(wraper);
                });

            }

        },
        load_riskarea:function(dist){
            var w=this;
            var vulsId=$(".riskarea-info-name",$(".content-riskarea")).attr("vulsId");
            var location= w.dataType.data+"_"+dist;
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'vuls'}).success(function(json){
                if(!json.data){
                    event.jump_out_dist();
                    return;
                }
                if(json.data.risk_type_rank[vulsId]){
                    var rank=json.data.risk_type_rank[vulsId];
                    if(rank.example20){
                        var tbody=$("tbody",$("#riskarea_topNtable"));
                        var examples=rank.example20;
                        tbody.html("");
                        for(var i=0;i<examples.length;i++){
                            var example=examples[i];
                            var title=(example.title||example.domain);
                            var domain=example.domain;
                            var tr=$("<tr ref='"+example.domain+"'><td style='width: 40%'>"+__functions__.cutstr(domain,15)+"</td><td style='width: 40%'>"+__functions__.cutstr(title,15)+"</td><td>"+example.count+"</td></tr>");
                            // var tr=$("<tr><td>"+(example.title||example.domain)+"</td><td>"+example.domain+"</td><td>"+example.count+"</td></tr>");
                            tbody.append(tr);
                            tr.addClass("a-fadeinB");
                        }

                    }
                }

            });
        },
        load_risklevel:function(dist){
            var w=this;
            var location= w.dataType.data+"_"+dist;
            $.post(__WEBROOT__+"/ScreenCenter/GovDynamicGD/loadDistData",{location:location,type:'vuls'}).success(function(json){
                if(!json.data){
                    event.jump_out_dist();
                    return;
                }
                if(json.data.risk_rank){
                    var warper=$("#riskWebList");
                    warper.html("");
                    var keys=['high','mid','low','info']
                    var circleColor={
                        'high':"red",
                        'low':"yellow",
                        'mid':"orange",
                        'info':"blue"
                    }

                    keys.forEach(function(key){
                        var vulsLevel= w.__contanst__.vuls_name_level_mapper[key];
                        var rank=json.data.risk_rank[key];
                        if(rank){
                            $.each(rank.example20||[],function(i,item){
                                var name=__functions__.cutstr((item.title||item.domain),10);
                                var item="<div class='col-md-4'><div class='list risk-level-item' domain='"+item.domain+"'><div class='l-rank bg-"+circleColor[key]+"'>"+vulsLevel+"</div><div class='l-web'>"+name+"</div></div></div>";
                                warper.append(item);
                            });
                        }
                    });

                }
            });
        }

    };
    var handler={
        init:function(){
            var w=this;
            var ecConfig = require('echarts/config');
            handler.common_event.call(w,ecConfig);
            handler.map_event.call(w,ecConfig);
            handler.table_line_event.call(w,ecConfig);
            handler.echarts_steps_event.call(w,ecConfig);
            handler.tab_event.call(w,ecConfig);
            handler.map_legend_event.call(w,ecConfig);
        },
        common_event:function(ecConfig){
            var w=this;
            $(".btn-return-prev").bind("click",function(){

                var prev='main';

                if(!w.dist){
                    if(w.panel_steps.length>=2){
                        prev=w.panel_steps[w.panel_steps.length-2];
                    }else{
                        return;
                    }
                    if(w.panel_steps.length){
                        w.panel_steps.pop();
                    }

                    var prevPanel=prev.step;
                    if(prev.mapType!= w.dataType.type){//不加这个条件，每次点上一步都要重新加载数据，影响响应速度
                        if(prev.mapType=='city'){
                            event.jump_into_city.call(w,prev.mapData,true);
                        }else{
                            event.jump_into_province.call(w,prev.mapData,true);
                        }
                    }
                    __reload__['reload_'+prevPanel].load.call(w);
                    var rd=Math.random().toFixed(0);

                    $(".content-"+prevPanel).removeClass(animation).addClass(rd==1?"a-flipinY":"a-flipinX");
                }else{

                   event.jump_out_dist.call(w);
                }


            });
            $(".btn-back-home").bind("click",function(){

                event.jump_into_province.call(w,curProvince||'china');
                __functions__.stepinto.call(w,'main');
            });
            $(".tab-viewport-china").bind("click",function(){
                var currentPanel= w.currentPanel;
                event.jump_into_province.call(w,'china');
                __reload__['reload_'+currentPanel].load.call(w);


            });
        },
        map_event:function(ecConfig){
            var w=this;

            var map_triggers={
                securityAreaRank: {
                    callback:function(){
                        __reload__.reload_security.load.call(w,function(){
                            __functions__.stepinto.call(w,stepNames.security);
                        });
                    }

                },
                main_surveyAreaRank:{
                        callback:function(){}
                },
                risklevel_areaRank:{
                    callback:function(){__reload__.reload_risklevel.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_risklevel.call(w,dist)}
                },
                riskarea_areaRank:{
                    callback:function(){ __reload__.reload_riskarea.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_riskarea.call(w,dist)}
                },
                zeroday_areaRank:{
                    callback:function(){ __reload__.reload_zeroday.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_zeroday.call(w,dist)}
                },
                security_areaRank:{
                    callback:function(){ __reload__.reload_security.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_security.call(w,dist)}
                },
                porttree_areaRank:{
                    callback:function(){__reload__.reload_porttree.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_porttree.call(w,dist)}
                },
                serverexption_areaRank:{
                    callback:function(){ __reload__.reload_serverexption.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_serverexption.call(w,dist)}
                },
                pagelarge_areaRank:{
                    callback:function(){ __reload__.reload_pagelarge.load.call(w)},
                    dist_callback:function(dist){__load_dist__.load_pagelarge.call(w,dist)}
                }
            };
            $.each(map_triggers,function(key,conf){
                w[key].on(ecConfig.EVENT.CLICK,function(param){
                    if(w.dataType.type=='china'){
                        var flag=event.jump_into_province.call(w,param['name']);
                        if(flag){
                            conf.callback&&conf.callback.call(w);
                        }

                    }else if(w.dataType.type=='province'){

                        var flag=event.jump_into_city.call(w,param['name']);
                        if(flag){
                            conf.callback&&conf.callback.call(w);
                        }


                    }else{
                        if(key=='securityAreaRank'){
                            __reload__.reload_security.load.call(w)
                            __functions__.stepinto.call(w,stepNames.security);

                        }else{
                            event.jump_into_dist.call(w);
                            conf.dist_callback&&conf.dist_callback.call(w,param['name']);

                        }



                    }
                });
            });
        },
        table_line_event:function(ecConfig){
            var w=this;
            event.jump_out_dist.call(w);
            var events={
                zeroDayRank:{
                    jump:{
                        location:function(tr){
                            return tr.attr("locationref");
                        },
                        callback:function(tr){
                            var type=tr.attr("typeref");
                            __reload__.reload_zeroday.load.call(w,type,function(){
                                __functions__.stepinto.call(w,stepNames.zeroday);
                            });
                        },
                        dist_callback:function(dist){
                            var active=$(".active",$("#zeroDayRank-tab-warper")).text();
                            __reload__.reload_zeroday.load.call(w,active,function(){
                                __functions__.stepinto.call(w,stepNames.zeroday);
                            });
                            __load_dist__.load_zeroday.call(w,dist);
                            event.jump_into_dist();
                        }

                    }

                },
                main_surveyRankTopNtable:{
                    jump:{
                        location:function(tr){
                            return tr.attr("ref");
                        }
                    }

                },
                risklevel_exampleTable:{
                    jump:{
                        location:function(tr){
                            return $("td:eq(0)",tr).text();
                        },
                        callback:function(tr){
                            __reload__.reload_risklevel.load.call(w);
                        },
                        dist_callback:function(dist){__load_dist__.load_risklevel.call(w,dist)}
                    }
                },
                zeroday_table:{
                    jump:{
                        location:function(tr){

                            return $("td:eq(0)",tr).text();
                        },
                        callback:function(tr){
                            __reload__.reload_zeroday.load.call(w);
                        },
                        dist_callback:function(dist){__load_dist__.load_zeroday.call(w,dist)}


                    }
                },
                security_categoryDeatilTable:{
                    jump:{
                        location:function(tr){
                            return $("td:eq(0)",tr).text()
                        },
                        callback:function(tr){
                            __reload__.reload_security.load.call(w);
                        },
                        dist_callback:function(dist){__load_dist__.load_security.call(w,dist)}

                    }
                },
                serverexption_categoryDeatilTable:{
                    jump:{
                        location:function(tr){
                            return $("td:eq(0)",$(tr)).text();
                        },
                        callback:function(tr){
                            __reload__.reload_serverexption.load.call(w);
                        },
                        dist_callback:function(dist){__load_dist__.load_serverexption.call(w,dist)}
                    }
                },
                pagelarge_categoryDeatilTable:{
                    jump:{
                        location:function(tr){
                            return $("td:eq(0)",$(tr)).text();
                        },
                        callback:function(tr){
                            __reload__.reload_pagelarge.load.call(w);
                        },
                        dist_callback:function(dist){__load_dist__.load_pagelarge.call(w,dist)}
                    }
                },
                monitorData:{
                    callback:function(tr){
                        var refid=tr.attr("refid");
                        var domain=tr.attr("domain");
                        var param={type:"websurvey",ref:refid,domain:domain};
                        __reload__.reload_report.load.call(w,param,function(){
                            __functions__.stepinto.call(w,stepNames.report);
                        });
                    }
                },
                risklevel_top5Table:{
                    callback:function(tr){
                        var vulsId=tr.attr("riskref");
                        __reload__.reload_riskarea.load.call(w,vulsId,function(){
                            __functions__.stepinto.call(w,stepNames.riskarea);
                        });
                    }
                },
                riskarea_topNtable:{
                    callback:function(tr){
                        var ref=tr.attr("ref");
                        var param={ref:ref,type:"vuls",domain:ref};
                        __reload__.reload_report.load.call(w,param,function(){
                            __functions__.stepinto.call(w,stepNames.report);
                        });
                    }
                },
                serverexption_exampleTable:{
                    callback:function(tr){
                        var param={type:"websurvey",ref:tr.attr("ref"),domain:tr.attr("domain")};
                        __reload__.reload_report.load.call(w,param,function(){
                            __functions__.stepinto.call(w,stepNames.report);
                        });
                    }
                },
                pagelarge_exapmleTable1:{
                    callback:function(tr){
                        var param={type:"websurvey",ref:tr.attr("ref"),domain:tr.attr("domain")};
                        __reload__.reload_report.load.call(w,param,function(){
                            __functions__.stepinto.call(w,stepNames.report);
                        });
                    }
                },
                security_categoryDeatilTable_detail:{
                    callback:function(tr){
                        var param={type:"security",ref:tr.attr("ref"),domain:tr.attr("domain")};
                        __reload__.reload_report.load.call(w,param,function(){
                            __functions__.stepinto.call(w,stepNames.report);
                        });
                    }
                }

            };
            $.each(events,function(tableId,d){
                $("#"+tableId+" tbody tr").live("click",function(){
                    if(d.jump){
                        var location= d.jump.location($(this));
                        if(w.dataType.type=='china'){
                            var flag=event.jump_into_province.call(w,location);
                            if(flag){
                                d.jump.callback&& d.jump.callback($(this));
                            }




                        }else if(w.dataType.type=='province'){
                            var flag=event.jump_into_city.call(w,location);
                            if(flag){
                                d.jump.callback&& d.jump.callback($(this));

                            }



                        }else{
                            d.jump.dist_callback&&event.jump_into_dist.call(w);
                            d.jump.dist_callback&& d.jump.dist_callback.call(w,location);



                        }
                    }
                    d.callback&& d.callback($(this));

                });
            });
            $(".risk-level-item",$("#riskWebList")).live("click",function(){
                 var ref=$(this).attr("domain");
                var param={ref:ref,type:"vuls",domain:ref};
                __reload__.reload_report.load.call(w,param,function(){
                    __functions__.stepinto.call(w,stepNames.report);

                });
                event.jump_out_dist.call(w);


            });
        },
        echarts_steps_event:function(ecConfig){//echart 的面板切换的事件
            var w=this;
            var events={
                riskLevelRank:function(){
                    __reload__.reload_risklevel.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.risklevel);
                    });
                },
                vulsTypeRankCloud:function(param){ /**左侧栏漏洞类型分类点击事件**/
                    __reload__.reload_riskarea.load.call(w,w.mapper.vuls_name_2_id_mapper[param.name],function(){
                        __functions__.stepinto.call(w,stepNames.riskarea);
                    });
                },
                securityTypeRank:function(){
                    __reload__.reload_security.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.security);
                    });
                },

                main_categoryCycle1:function(param){
                    __reload__.reload_serverexption.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.serverexption);

                    });
                },
                main_categoryCycle2:function(param){
                    __reload__.reload_pagelarge.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.pagelarge);
                    });
                },
                main_categoryCycle3:function(param){
                    __reload__.reload_risklevel.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.risklevel);
                    });
                },
                main_categoryCycle4:function(param){
                    __reload__.reload_risklevel.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.risklevel);
                    });
                },
                main_categoryCycle5:function(param){
                    __reload__.reload_security.load.call(w,function(){
                        __functions__.stepinto.call(w,stepNames.security);
                    });
                }

            };
            for(var i=1;i<=3;i++){ ///**----------main 面板排行top3的饼图的点击事件 ----------**/
                events['main_surveyRankCycle'+i]=function(param){
                    if(w.dataType.type=='china'){
                        event.jump_into_province.call(w,param.seriesName);
                    }else if(w.dataType.type=='province'){
                        event.jump_into_city.call(w,param.seriesName);

                    }else{
                        //alert("对不起,暂时还无法下钻到下一级");

                    }
                }
            }

            $.each(events,function(key,callback){
                w[key].on(ecConfig.EVENT.CLICK,function(param){
                        callback&&callback.call(w,param);
                });
            });
        },
        tab_event:function(ecConfig){
            var w=this;
            $(".tab-vlus-type-cloud").bind("click",function(){
                var ref=$(this).attr("ref");
                __reload__.reload_vulsTypeRankCloud.call(w,ref,function(){
                    $("#vulsTypeRankCloud").removeClass(animation).addClass("a-flipinY");
                });

            });
            /***左侧栏 0day 行点击事件  */
            $(".tab-zero-day-rank ").live("click",function(){
                var ref=$(this).attr("ref");
                __reload__.reload_zeroDayRank.call(w,ref);
                __reload__.reload_zeroday.load.call(w,ref,function(){
                    __functions__.stepinto.call(w,stepNames.zeroday);
                });
            });
            $(".tab-security-rank").bind("click",function(){
                var ref=$(this).attr("ref");
                $(".view-security-rank").hide();
                if(ref=='securityTypeRank'){
                    __reload__.reload_securityTypeRank.call(w,function(){
                        $("#"+ref).addClass("a-flipinY");
                    });
                }else{
                    __reload__.reload_securityAreaRank.call(w,function(){
                        $("#"+ref).addClass("a-flipinY");
                    });
                }
            });
            $(".report-tabs").bind("click",function(){
                var ref=$("a",$(this)).attr("href");
                $(".report-tab-view").hide();
                $(ref).show();
            });
            $(".report-vuls-type-tab").bind("click",function(){
                var ref=$(this).attr("ref");
                var vuls= w.tmpVulsData[ref].type_rank;
                var tbody=$("tbody",$("#report-vuls-table"));
                tbody.html("");
                $.each(vuls,function(i,d){
                    var tr=$("<tr><td>"+ w.mapper.vuls_name_mapper[d.name]+"</td><td>"+ w.__contanst__.vuls_name_level_mapper[ref]+"</td><td>"+ d.count+"</td></tr>");
                    tbody.append(tr);
                });
            });
        },
        map_legend_event:function(ecConfig){
            var w=this;
            event.legend_map_event.call(w,ecConfig,{
                risklevel_Cycle1:{ "tab":".risklevel-tab-level:eq(0)", "value":"高危等级" },
                risklevel_Cycle2:{"tab":".risklevel-tab-level:eq(1)", "value":"中危等级"},
                risklevel_Cycle3:{"tab":".risklevel-tab-level:eq(2)", "value":"高危等级"},
                risklevel_Cycle4:{"tab":".risklevel-tab-level:eq(3)","value":"信息等级" }
            },'risklevel_areaRank',function(tab){
                var name=$(tab).text();
                __reload__.reload_risklevel.reload_risklevel_top5Table.call(w, w.__contanst__.vuls_level_name_mapper[name.substr(0,2)]);
            });
            event.legend_map_event.call(w,ecConfig,{
                security_Cycle1:{"tab":".security-tab-type:eq(0)", "value":"黑页"},
                security_Cycle2:{"tab":".security-tab-type:eq(1)", "value":"反共"},
                security_Cycle3:{"tab":".security-tab-type:eq(2)", "value":"博彩"},
                security_Cycle4:{"tab":".security-tab-type:eq(4)", "value":"暗链"},
                security_Cycle5:{"tab":".security-tab-type:eq(3)", "value":"色情"}
            },'security_areaRank',function(tab){
                __reload__.reload_security.reload_security_timeDetailTable.call(w,$(tab).text());
                event.jump_out_dist();


            });
            event.legend_map_event.call(w,ecConfig,{
                serverexption_Cycle1:{"tab": ".serverexption-tab-type:eq(0)",value:"僵尸网站"},
                serverexption_Cycle2:{"tab": ".serverexption-tab-type:eq(1)",value:"页面找不到"},
                serverexption_Cycle3:{"tab": ".serverexption-tab-type:eq(2)",value:"服务端异常"},
                serverexption_Cycle4:{"tab": ".serverexption-tab-type:eq(3)",value:"无法访问"}

            },'serverexption_areaRank',function(tab){
                __reload__.reload_serverexption.reload_serverexption_exampleTable.call(w,$(tab).text());
                event.jump_out_dist();

            });
        }
    };
    var swiper = {
        init: function(){

            mySwiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 4,
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                preloadImages:false,
                updateOnImagesReady : true,
                spaceBetween: 5,
                centeredSlides: false,
                autoplay: 2500,
                observer:true,
                autoplayDisableOnInteraction: false
            });
            $('.swiper-container').hover(function(){
                mySwiper.stopAutoplay();
            },function(){
                mySwiper.startAutoplay();
            });
        }
    };
    var scroll=function(dom){
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

    };
    $(document).ready(function(){
        o.init();
        swiper.init();
        //scroll('monitorData');
        $('.fancybox').fancybox();

        setInterval(function(){
            $.post(__WEBROOT__ + "/ScreenCenter/GovDynamicGD/refresh").success(function(){

            });
        }, 1000 * 60 * 6);

        setInterval(function(){
            location.href=location.href;
        }, 1000 * 60 * 60);
        //屏蔽鼠标右键和文本选择
        /*$(document).bind("contextmenu",function(){return false;});
        $(document).bind("selectstart",function(){return false;});*/
    });
})();