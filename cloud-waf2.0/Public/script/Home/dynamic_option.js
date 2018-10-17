var __GEO__={
    china_province:{
        '上海': [121.4648,31.2891],
        '广东': [113.8953,22.901],
        '山东': [118.7073,37.5513],
        '山西': [111.4783,36.1615],
        '辽宁': [124.541,40.4242],
        '新疆': [87.9236,43.5883],
        '河北': [115.0488,39.0948],
        '甘肃': [103.5901,36.3043],
        '内蒙': [110.3467,41.4899],
        '内蒙古': [110.3467,41.4899],
        '北京': [116.4551,40.2539],
        '广西': [109.314,21.6211],
        '江苏': [118.8062,31.9208],
        '江西': [116.0046,28.6633],
        '福建': [118.1689,24.6478],
        '安徽': [117.29,32.0581],
        '陕西': [108.4131,34.8706],
        '黑龙江': [127.9688,45.368],
        '天津': [117.4219,39.4189],
        '西藏': [91.1865,30.1465],
        '云南': [102.9199,25.4663],
        '浙江': [119.5313,29.8773],
        '湖南': [113.5327,27.0319],
        '湖北': [114.3896,30.6628],
        '海南': [110.3893,19.8516],
        '青海': [101.4038,36.8207],
        '贵州': [106.6992,26.7682],
        '河南': [113.4668,34.6234],
        '重庆': [107.7539,30.1904],
        '宁夏': [106.3586,38.1775],
        '吉林': [125.8154,44.2584],
        '中国':[116.4551,40.2539],
        '局域网':[116.4551,40.2539],
        '未知':[116.4551,40.2539],
        '四川':[103.9526,30.7617],
        '台湾':[121.31,25.03]
    },
    provincial_capital : {
        '北京': [116.4551,40.2539],
        '上海': [121.4648,31.2891],
        '天津': [117.4219,39.4189],
        '重庆': [107.7539,30.1904],
        '郑州': [113.4668,34.6234],
        '哈尔滨': [127.9688,45.368],
        '长春': [125.8154,44.2584],
        '长沙': [113.0823,28.2568],
        '沈阳': [123.1238,42.1216],
        '合肥': [117.29,32.0581],
        '呼和浩特': [111.4124,40.4901],
        '石家庄': [114.4995,38.1006],
        '福州': [119.4543,25.9222],
        '乌鲁木齐': [87.9236,43.5883],
        '兰州': [103.5901,36.3043],
        '西宁': [101.4038,36.8207],
        '西安': [109.1162,34.2004],
        '贵阳': [106.6992,26.7682],
        '银川': [106.3586,38.1775],
        '济南': [117.1582,36.8701],
        '太原': [112.3352,37.9413],
        '武汉': [114.3896,30.6628],
        '南京': [118.8062,31.9208],
        '南宁': [108.479,23.1152],
        '南昌': [116.0046,28.6633],
        '成都': [103.9526,30.7617],
        '昆明': [102.9199,25.4663],
        '拉萨': [91.1865,30.1465],
        '杭州': [119.5313,29.8773],
        '广州': [113.5107,23.2196],
        '海口': [110.3893,19.8516]
    }
}

var  __default_colors__=["#c60000","#f0412f","#f5942c","#fae266","#6dbdff"];
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
    securityAreaRankHeatData:function(data,mapType){
        var w=this;
        var heatData = [];
        $.each(data,function(location,count){

            if(mapType=='china'){
                if(__GEO__.china_province[location]){
                    var geo=__GEO__.china_province[location];
                    geo.push(1);
                    var times=Math.ceil(Math.log(count));
                    for(var i=0;i<times;i++){
                        heatData.push(geo);
                    }
                }
            }else{
                var thegeo=CHINA_CITY_GEO[mapType];
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
        option.series[0].data[0].itemStyle.normal.label.formatter=(value*100/total).toFixed(1)+"%";
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
                    name:"name",
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
                        {value:value,selected:true},
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
        //console.info(seriesName)
        option.series[0].data[0].name=seriesName;
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
        //console.info("max:"+max);
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

var prophet_options={
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
    fingerBar:{
        title : {
            text: '',
            x:"center",
            y: 0,
            textStyle:{
                fontSize: 14,
                fontWeight: 'bolder',
                color: '#00adf9'
            }
        },
        tooltip: {
            trigger: 'item'
        },
        color:['#00adf9'],
        grid:{
            x:60,
            y:20,
            x2:30,
            y2:20,
            borderWidth:0
        },

        xAxis : [
            {
                type : 'value',
                boundaryGap: [0, 0.01],
                axisLine : {    // 轴线
                    show: true,
                    lineStyle: {
                        color: '#00dcff',
                        width: 1
                    }
                },
                axisLabel:{
                    show:true,
                    textStyle:{
                        color:'#00dcff'
                    }
                },
                splitLine:{
                    show:false
                },
                axisTick: {
                    show: false
                }
            }
        ],
        yAxis : [
            {
                type : 'category',
                splitLine:{
                  show:false
                },
                axisLine : {    // 轴线
                    show: true,
                    lineStyle: {
                        color: '#00dcff',
                        width: 1
                    }
                },
                axisLabel:{
                    rotate: 45,
                    textStyle: {
                        color: '#00dcff'
                    }
                },
                data : []
            }
        ],
        series : [
            {
                name:'',
                type:'bar',
                data:[],
                barMaxWidth: 20
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
    finger_areaRank:options_functions.commonMapOption(25000),
    finger_Cycle1:options_functions.cycleRankTopNOption("北京",30,300),
    finger_Cycle2:options_functions.cycleRankTopNOption("北京",30,300),
    finger_Cycle3:options_functions.cycleRankTopNOption("北京",30,300),
    /**serverexption**/
    serverexption_areaRank:options_functions.commonLegendMapOption(['请求无响应','找不到资源','服务异常','僵尸网站'],500),
    serverexption_Cycle1:options_functions.cycleOption(['#F0412E',"#ccc"],'请求无响应',96,200),
    serverexption_Cycle2:options_functions.cycleOption(['#F1922C',"#ccc"],'找不到资源',96,200),
    serverexption_Cycle3:options_functions.cycleOption(['#FDE866',"#ccc"],'服务异常',96,200),
    serverexption_Cycle4:options_functions.cycleOption(['#2CCB71',"#ccc"],'僵尸网站',96,200),

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
