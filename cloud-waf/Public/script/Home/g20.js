var _intervals={
    change: 2* 60 *1000, //攻击和访问切换
    num: 2*60*1000,  //数字滚动时长
    data: 3*60*1000,
    count: 60*1000, //统计数字刷新频率
    map: 3*60*1000 ,//地图刷新频率
    other: 5*60*1000 //其他刷新频率

};

var G20 = {
    init: function(){
        var w = this;

        w.initHtml();
        w.initEvent();
        w.navTimeInfo();
        w.infoCount();


    },
    initHtml: function(){
        var w = this;

        w.initChart();


    },
    initEvent: function(){
        var w = this;

        var attack_visit = function(){
            $('.attack').toggle();
            $('.visit').toggle();
        };

        clearInterval(timer);
        var timer = setInterval(attack_visit,_intervals.change);
    },
    initChart: function(callback){
        var w = this;

        require.config({
            paths: {
                echarts: __ECHART__
            }
        });
        require(
            [
                'echarts',
                'echarts/chart/map',
                'echarts/chart/line',
                'echarts/chart/bar',
                'echarts/chart/pie',
                'echarts/chart/radar'

            ],
            function (ec) {
                var ecConfig = require('echarts/config');
                var map =['attackWorldMap','attackChinaMap','visitWorldMap','visitChinaMap','barWay','pieIp','lineFlow'];

                $.each(map, function(i,ecPart){
                    w[ecPart] = ec.init(document.getElementById(ecPart));
                    w[ecPart].showLoading();
                });


                $('.swiper-wrapper').html('');

                for (var i = 0; i < 7; i++) {
                    $('.swiper-wrapper').append('<div class="swiper-slide"><div class="radar"></div></div>')
                }


                $('.swiper-wrapper').find('.radar').each(function(j){
                    $(this).attr('id', 'radar'+j);
                    w['radar'+j] = ec.init(document.getElementById('radar'+j));
                    w['radar'+j].showLoading();
                });

               /* w.attackWorldMap = ec.init(document.getElementById('attackWorldMap'));
                w.attackChinaMap = ec.init(document.getElementById('attackChinaMap'));
                w.visitWorldMap = ec.init(document.getElementById('visitWorldMap'));
                w.visitChinaMap = ec.init(document.getElementById('visitChinaMap'));

                w.barWay = ec.init(document.getElementById('barWay'));
                w.pieIp = ec.init(document.getElementById('pieIp'));

                w.lineFlow = ec.init(document.getElementById('lineFlow'));*/

                //w.deviceChart = ec.init(document.getElementById('deviceChart'));

                w.getData();
                w.drawChart();

                callback&&callback.call(w);

            });
    },
    drawChart: function(){
        var w =  this;

        $('.visit').hide();
        //$('.attack').hide();


    },


    visitDevice: function(json){
        var w = this ;
        var data = json.data.visit.clientSystemMap;
        var dataPC =[],dataMobile =[];
        var pc ={}, mobile ={};
        var device =[], deviceData = [];
        var totalPc = null, totalMobile =null;

        var pcCount =null, mobileCount=null;

        $.each(data.pc, function(k,v){
            deviceData.push({
                'name': k,
                'value': v
            });
            pcCount += v;
        });

        $.each(data.mobile, function(k,v){

            if(k=='android'){
                $.each(data.mobile.android, function(kk,vv){

                        deviceData.push({
                            'name': kk,
                            'value': vv
                        });
                    mobileCount+=vv;
                })
            }else{
                deviceData.push({
                    'name': k,
                    'value': v
                });
                mobileCount+=v;
            }



        });
        device=[
            {
                'name': 'PC端',
                'value': pcCount
            },
            {
                'name': '手机端',
                'value': mobileCount
            }
        ];




        //w.deviceChart.setOption(Option.PieOption(device,deviceData));


    },
    eventGrid: function(json){
        var w = this;

        $('.security-event tbody').html('');
        $('.big-event').html('');
        for (var i = 0; i < json.data.length; i++) {
            $('.security-event tbody').append('<tr><td>'+json.data[i].date+'</td><td>'+json.data[i].event+'</td></tr>')
        }
        for (var j = 0; j< json.Data.length; j++) {
            $('.big-event').append(' <div class="time-event">' +
            '<div class="event-date">'+json.Data[j].date+'</div>' +
            '<div class="event-timing"></div>' +
            '<div class="event-detail">'+json.Data[j].event+'</div>' +
            '<div class="event-arrow"></div>' +
            '</div>')
        }
    },

    navTimeInfo: function(){
        var w = this;

        $.post(__ROOT__+"/Home/G20/getRunningTime").success(function(json){
            var second=json.data||0;
            w.clock=$(".time").clock();
            w.clock.load.call(w.clock,second);

        });

    },
    infoCount: function(json){
        var w =this;

        var start = function(){
            $.post(__ROOT__ +'/Home/G20/getTotalCount').success(function(json){
                if(json&&json.code==0){
                    var attack= json.data.attack;
                    var visit= json.data.visit;


                    var attackCount= attack.attackCount -1000;
                    var attackChinaCount= attack.attackChinaCount -1000;
                    var visitCount= visit.visitCount -1000;
                    var visitChinaCount= visit.visitChinaCount -1000;

                    if(attack.attackCount> attackCount){
                        Tool.numScroll('attackCount', attackCount ,attack.attackCount,3000);
                    }else{
                        $('#attackCount').text(attack.attackCount)
                    }
                    if(attack.attackChinaCount> attackChinaCount){
                        Tool.numScroll('attackChinaCount', attackChinaCount ,attack.attackChinaCount,3000);
                    }else{
                        $('#attackChinaCount').text(attack.attackChinaCount)
                    }
                    if(visit.visitCount> visitCount){
                        Tool.numScroll('visitCount', visitCount ,visit.visitCount,1500);
                    }else{
                        $('#visitCount').text(visit.visitCount)
                    }

                    if(visit.visitChinaCount> visitChinaCount){
                        Tool.numScroll('visitChinaCount', visitChinaCount ,visit.visitChinaCount,3000);
                    }else{
                        $('#visitChinaCount').text(visit.visitChinaCount)
                    }


                    Tool.numScroll('attackCountryCount', attack.countryCount,attack.countryCount);
                    Tool.numScroll('attackProvinceCount', attack.provinceCount,attack.provinceCount);

                    Tool.numScroll( 'visitCountryCount', visit.countryCount,visit.countryCount,30);
                    Tool.numScroll( 'visitProvinceCount',visit.provinceCount,visit.provinceCount,30);

                }
            })
        };
        start();

        setInterval(function(){
            start();
        },_intervals.num);


    },
    areaAttackWorld:function(json){
        var w= this;

        var world =[];

        $.each(json, function(k,v){
            world.push({
                name: k,
                value: v
            })
        });
        w.attackWorldMap.setOption(Option.MapOption('world',world,[
            {start: 10, end: 1000, color: '#0084dd'},
            {start: 1000, end: 5000, color: '#0092F4'},
            {start: 5000, end: 10000, color: '#6dbdff'},
            {start: 10000, end: 40000, color: '#f9e400'},
            {start: 40000, end:100000,color: '#ff8400'},
            {start: 100000, color: '#ff0000'}
        ]));
        w.attackWorldMap.hideLoading();


    },
    areaAttackChina:function(json){
        var w= this;

        var china =[];

        $.each(json, function(k,v){
            china.push({
                name: k,
                value: v
            })
        });
        w.attackChinaMap.setOption(Option.MapOption('china',china,[
            {start: 0, end: 1000, color: '#0084dd'},
            {start: 1000, end: 5000, color: '#6dbdff'},
            {start: 5000, end: 10000, color: '#f9e400'},
            {start: 100000, end:180000,color: '#ff8400'},
            {start: 180000, color: '#ff0000'}
        ]));

        w.attackChinaMap.hideLoading();


    },
    areaVisitWorld:function(json){
        var w= this;

        var world =[];

        $.each(json, function(k,v){
            world.push({
                name: k,
                value: v
            })
        });
        w.visitWorldMap.setOption(Option.MapOption('world',world,[
            {start: 0, end: 1000, color: '#6dbdff'},
            {start: 1000, end: 5000, color: '#009add'},
            {start: 5000, end: 10000, color: '#00b2b2'},
            {start: 10000, end: 40000, color: '#00dddd'},
            {start: 40000, end:100000,color: '#00dd84'},
            {start: 100000, color: '#2cdd00'}
        ]));
        w.visitWorldMap.hideLoading();


    },
    areaVisitChina:function(json){
        var w= this;

        var china =[];

        $.each(json, function(k,v){
            china.push({
                name: k,
                value: v
            })
        });
        w.visitChinaMap.setOption(Option.MapOption('china',china,[
            {start: 0, end: 10000, color: '#6dbdff'},
            {start: 10000, end: 200000, color: '#009add'},
            {start: 200000, end: 500000, color: '#00dddd'},
            {start: 500000, end:1000000,color: '#00dd84'},
            {start: 1000000, color: '#2cdd00'}
        ]));

        w.visitChinaMap.hideLoading();


    },
    areaGrid: function(el,json,count){
        var w = this;

        var i= 1;
        $('.grid tbody' ,el).html('');

        $.each(json, function(name,v){
            $('.grid tbody' ,el).append('<tr><td><span class="n-label">NO.'+i+'</span></td><td>'+name+'</td><td>'+(v*100/count).toFixed(2)+'%</td></tr>')
            i++;
            if(i>5){
                return false;
            }
        });

    },
    attackWay: function(json){
        var  w= this;
        var dataX=[], dataY=[];
        var i=0;
        $.each(json, function(k,v){
            k=k=="客户端遇到错误，客户端有问题" ? "客户端出错":k;
            k=k=="重定向，被访问客户端浏览器必须采取更多操作来实现请求"? "重定向": k;
            k=k=="服务器遇到错误，无法完成请求"? "服务器出错": k;
            dataY.push(k);
            dataX.push(v);
            i++;
            if(i>=10){
                return false;
            }

        });

        w.barWay.setOption(Option.BarOption(dataX.reverse(),dataY.reverse()));
        w.barWay.hideLoading();

    },
    attackIp: function(json){
        var  w= this;

        var total = null;
        var i= 0;
        var d =[];
        var arry =[];
        var legend =[];
        var color = ['#ff0000', '#dd8400', '#ddc600', '#00b0dd', '#006edd'];
        $('.attackIp .chart-info').html('');

        $.each(json, function(k,v){
            legend.push(k);
            total += v;
        });
        $.each(json, function(k,v){
            d.push({
                name: k,
                value: v,
                other: total -v
            });
            $('.attackIp .chart-info').append('<p style="color:'+color[i]+' "><span>'+v+'</span>个IP</p>')
            i++;

        });

        Option.PieCircleOption.legend.data = legend;
        for (var j = 0; j < d.length; j++) {
            Option.PieCircleOption.series[j].name = d[j].name;
            Option.PieCircleOption.series[j].data[0].name = d[j].name;
            Option.PieCircleOption.series[j].data[0].value = d[j].value;
            Option.PieCircleOption.series[j].data[1].value = d[j].other;
        }

        w.pieIp.setOption(Option.PieCircleOption);
        w.pieIp.hideLoading();



    },
    infoContinent: function(json, callback){
        var w = this;

        var attackData = json.data.attack.attackByHourCountMap;
        var visitData = json.data.visit.visitByHourCountMap;
        var dataTime =[];

        $.each(attackData, function(k,v){
            $.each(visitData, function(m,n){
                if(k==m){
                    dataTime.push({
                        title: k,
                        attack: (function(){
                            var d =[];
                            $.each(v, function(kk,vv){
                                d.push(vv);
                            });
                            return d;
                        })(),
                        visit: (function(){
                            var d =[];
                            $.each(n, function(kk,vv){
                                d.push( vv);
                            });
                            return d;
                        })()

                    });
                }
            });

        });




        for (var i = 0; i < dataTime.length; i++) {

            w['radar'+i].setOption(Option.RadarOption(dataTime[i].title,dataTime[i].attack,dataTime[i].visit));
            w['radar'+i].hideLoading();
        }



        Tool.swiper();

        callback&&callback.call(w);
    },
    visitContent : function(json){
        var w = this;

        var i= 1;
        $('.visit-content .grid tbody').html('');
        $.each(json, function(name,v){
            $('.visit-content .grid tbody').append('<tr><td><span class="rank-label"> '+i+'</span></td><td>'+name+'</td><td>'+v+'</td></tr>');
            i++;

        });

    },
    flowStudy: function(json){
        var w = this;
        var data1 = json.data.visit.visitByDayCountMap;
        var data2 = json.data.attack.attackByDayCountMap;
        var date= [], attack =[], visit =[];

        $.each(data1, function(k,v){

            var  /*value= k.substr(0,4)+'-';*/
                value= k.substr(4,2)+'-';
            value+= k.substr(6,2);

            date.push(value);
            visit.push(v);


        });

        $.each(data2, function(k,v){
            attack.push(v);
        });
        w.lineFlow.setOption(Option.LineOption(date,attack, visit));
        w.lineFlow.hideLoading();

    },
    getData: function(){
        var w =this;

        var  visitWorld = function(){
            $.post(__ROOT__ +'/Home/G20/visitByCountry').success(function(json) {
                if (json && json.code == 0) {

                    w.areaVisitWorld(json.data.countryMap);
                    w.areaGrid('.visit-world', json.data.countryMap, json.data.count)
                }
            })
        };
        var  visitChina = function(){
            $.post(__ROOT__ +'/Home/G20/visitByProvince').success(function(json) {
                if (json && json.code == 0) {

                    w.areaVisitChina(json.data.provinceMap);
                    w.areaGrid('.visit-china', json.data.provinceMap, json.data.count)
                }
            })
        };
        var  attackWorld = function(){
            $.post(__ROOT__ +'/Home/G20/attackByCountry').success(function(json) {
                if (json && json.code == 0) {

                    w.areaAttackWorld(json.data.countryMap);
                    w.areaGrid('.attack-world', json.data.countryMap, json.data.count)
                }
            })
        };
        var  attackChina = function(){
            $.post(__ROOT__ +'/Home/G20/attackByProvince').success(function(json) {
                if (json && json.code == 0) {

                    w.areaAttackChina(json.data.provinceMap);
                    w.areaGrid('.attack-china', json.data.provinceMap, json.data.count)
                }
            })
        };

        var  attackType = function(){
            $.post(__ROOT__ +'/Home/G20/attackType').success(function(json) {
                if (json && json.code == 0) {

                    w.attackWay(json.attackTypeMap);

                }
            })
        };

        var  ipCount = function(){
            $.post(__ROOT__ +'/Home/G20/ipCount').success(function(json) {
                if (json && json.code == 0) {

                    w.attackIp(json.attackIPCountRank);

                }
            })
        };

        var  continentInfo = function(){
            $.post(__ROOT__ +'/Home/G20/statByHour').success(function(json) {
                if (json && json.code == 0) {

                    w.infoContinent(json);


                }
            })
        };
        var  content = function(){
            $.post(__ROOT__ +'/Home/G20/title').success(function(json) {
                if (json && json.code == 0) {
                    w.visitContent(json.requestUrlMap);
                }
            })
        };
        var  trend = function(){
            $.post(__ROOT__ +'/Home/G20/statByDay').success(function(json) {
                if (json && json.code == 0) {
                    w.flowStudy(json);
                }
            })
        };

        var totalCount = function(){
            $.post(__ROOT__ +'/Home/G20/getTotalCount').success(function(json){
                if(json&&json.code==0){

                    w.infoCount(json);
                }
            })
        };
        visitWorld();
        visitChina();

        attackWorld();
        attackChina();
        attackType();
        ipCount();
        continentInfo();
        content();
        trend();


        setInterval(function(){
            visitWorld();
            visitChina();

            attackWorld();
            attackChina();
        }, _intervals.map);
        setInterval(function(){
            attackType();
            ipCount();
            continentInfo();
            content();
            trend();
        }, _intervals.other);


        var eventData = function(){
            var data =[
                {
                    'date': '2015-11-12',
                    'event': '深度安全评估'
                },
                {
                    'date': '2015-11-26',
                    'event': '官网系统初验'
                },
                {
                    'date': '2015-12-15',
                    'event': '第二届世界互联网大会期间重点安全保障'
                },
                {
                    'date': '2016-02-04',
                    'event': '春节期间重点安全保障'
                },
                {
                    'date': '2016-02-19',
                    'event': '全面安全评估'
                }
            ];

            var Data =[
                {
                    'date': '2015-12-01',
                    'event': '官网上线'
                },
                {
                    'date': '2016-02-04',
                    'event': '春节期间重点安全保障'
                },
                {
                    'date': '2016-02-29',
                    'event': '全面安全评估'
                },
                {
                    'date': '2016-04-28',
                    'event': '应急演练'
                }
            ];
            var json ={
                "data" :data,
                "Data": Data
            };

            w.eventGrid(json);
        };
        eventData();
        /*clearInterval(eventDataTimer);
        var eventDataTimer=setInterval(eventData(), _intervals.data);*/

    }

};
var special={
    dataStyle: {
        normal: {
            label: {
                show: false
            },
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
var Tool ={
    num: function(num){
        return num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
    },
    numScroll: function(dom,start, end, time){

        var options = {
            'useEasing' : false,
            'useGrouping' : true,
            'separator' : ',',
            'decimal' : '.',
            'prefix' : '',
            'suffix' : ''
        };
         dom = new CountUp(dom, start, end, 0, time, options);
        dom.start();

    },
    swiper: function(){
        var mySwiper = new Swiper('.swiper-container', {
            //loop: true,
            slidesPerView: 3,
            autoplay: 2500,
            onlyExternal : true,
            observer:true,
            observeParents:true

        });
        $('.swiper-container').hover(function(){
            mySwiper.stopAutoplay();
        },function(){
            mySwiper.startAutoplay();
        });

    }
};

var Option ={
    MapOption: function(mapType,data ,splitList){
        var option = {
            tooltip : {
                trigger: 'item',
                formatter : function (params) {
                    return  params.name + ' : ' + params.value.toString().replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') ;
                }
            },
            backgroundColor: 'transparent',
            dataRange: {
                show: true,
                x: 'right',
                realtime: false,
                calculable: false,
                textStyle: {
                    color: '#fff'
                },
                splitList: splitList
            },
            series : [
                {
                    name: 'map',
                    type: 'map',
                    mapType: mapType,
                    hoverable: false,
                    roam: false,
                    itemStyle: {
                        normal: {
                            label: {show: false},
                            borderColor: '#001320',
                            borderWidth: 1,
                            areaStyle: {
                                color:  '#06304e'
                            }
                        }
                    },
                    nameMap : {
                        'Afghanistan':'阿富汗',
                        'Angola':'安哥拉',
                        'Albania':'阿尔巴尼亚',
                        'United Arab Emirates':'阿联酋',
                        'Argentina':'阿根廷',
                        'Armenia':'亚美尼亚',
                        'French Southern and Antarctic Lands':'法属南半球和南极领地',
                        'Australia':'澳大利亚',
                        'Austria':'奥地利',
                        'Azerbaijan':'阿塞拜疆',
                        'Burundi':'布隆迪',
                        'Belgium':'比利时',
                        'Benin':'贝宁',
                        'Burkina Faso':'布基纳法索',
                        'Bangladesh':'孟加拉国',
                        'Bulgaria':'保加利亚',
                        'The Bahamas':'巴哈马',
                        'Bosnia and Herzegovina':'波斯尼亚和黑塞哥维那',
                        'Belarus':'白俄罗斯',
                        'Belize':'伯利兹',
                        'Bermuda':'百慕大',
                        'Bolivia':'玻利维亚',
                        'Brazil':'巴西',
                        'Brunei':'文莱',
                        'Bhutan':'不丹',
                        'Botswana':'博茨瓦纳',
                        'Central African Republic':'中非共和国',
                        'Canada':'加拿大',
                        'Switzerland':'瑞士',
                        'Chile':'智利',
                        'China':'中国',
                        'Ivory Coast':'象牙海岸',
                        'Cameroon':'喀麦隆',
                        'Democratic Republic of the Congo':'刚果民主共和国',
                        'Republic of the Congo':'刚果共和国',
                        'Colombia':'哥伦比亚',
                        'Costa Rica':'哥斯达黎加',
                        'Cuba':'古巴',
                        'Northern Cyprus':'北塞浦路斯',
                        'Cyprus':'塞浦路斯',
                        'Czech Republic':'捷克共和国',
                        'Germany':'德国',
                        'Djibouti':'吉布提',
                        'Denmark':'丹麦',
                        'Dominican Republic':'多明尼加共和国',
                        'Algeria':'阿尔及利亚',
                        'Ecuador':'厄瓜多尔',
                        'Egypt':'埃及',
                        'Eritrea':'厄立特里亚',
                        'Spain':'西班牙',
                        'Estonia':'爱沙尼亚',
                        'Ethiopia':'埃塞俄比亚',
                        'Finland':'芬兰',
                        'Fiji':'斐',
                        'Falkland Islands':'福克兰群岛',
                        'France':'法国',
                        'Gabon':'加蓬',
                        'United Kingdom':'英国',
                        'Georgia':'格鲁吉亚',
                        'Ghana':'加纳',
                        'Guinea':'几内亚',
                        'Gambia':'冈比亚',
                        'Guinea Bissau':'几内亚比绍',
                        'Equatorial Guinea':'赤道几内亚',
                        'Greece':'希腊',
                        'Greenland':'格陵兰',
                        'Guatemala':'危地马拉',
                        'French Guiana':'法属圭亚那',
                        'Guyana':'圭亚那',
                        'Honduras':'洪都拉斯',
                        'Croatia':'克罗地亚',
                        'Haiti':'海地',
                        'Hungary':'匈牙利',
                        'Indonesia':'印尼',
                        'India':'印度',
                        'Ireland':'爱尔兰',
                        'Iran':'伊朗',
                        'Iraq':'伊拉克',
                        'Iceland':'冰岛',
                        'Israel':'以色列',
                        'Italy':'意大利',
                        'Jamaica':'牙买加',
                        'Jordan':'约旦',
                        'Japan':'日本',
                        'Kazakhstan':'哈萨克斯坦',
                        'Kenya':'肯尼亚',
                        'Kyrgyzstan':'吉尔吉斯斯坦',
                        'Cambodia':'柬埔寨',
                        'South Korea':'韩国',
                        'Kosovo':'科索沃',
                        'Kuwait':'科威特',
                        'Laos':'老挝',
                        'Lebanon':'黎巴嫩',
                        'Liberia':'利比里亚',
                        'Libya':'利比亚',
                        'Sri Lanka':'斯里兰卡',
                        'Lesotho':'莱索托',
                        'Lithuania':'立陶宛',
                        'Luxembourg':'卢森堡',
                        'Latvia':'拉脱维亚',
                        'Morocco':'摩洛哥',
                        'Moldova':'摩尔多瓦',
                        'Madagascar':'马达加斯加',
                        'Mexico':'墨西哥',
                        'Macedonia':'马其顿',
                        'Mali':'马里',
                        'Myanmar':'缅甸',
                        'Montenegro':'黑山',
                        'Mongolia':'蒙古',
                        'Mozambique':'莫桑比克',
                        'Mauritania':'毛里塔尼亚',
                        'Malawi':'马拉维',
                        'Malaysia':'马来西亚',
                        'Namibia':'纳米比亚',
                        'New Caledonia':'新喀里多尼亚',
                        'Niger':'尼日尔',
                        'Nigeria':'尼日利亚',
                        'Nicaragua':'尼加拉瓜',
                        'Netherlands':'荷兰',
                        'Norway':'挪威',
                        'Nepal':'尼泊尔',
                        'New Zealand':'新西兰',
                        'Oman':'阿曼',
                        'Pakistan':'巴基斯坦',
                        'Panama':'巴拿马',
                        'Peru':'秘鲁',
                        'Philippines':'菲律宾',
                        'Papua New Guinea':'巴布亚新几内亚',
                        'Poland':'波兰',
                        'Puerto Rico':'波多黎各',
                        'North Korea':'北朝鲜',
                        'Portugal':'葡萄牙',
                        'Paraguay':'巴拉圭',
                        'Qatar':'卡塔尔',
                        'Romania':'罗马尼亚',
                        'Russia':'俄罗斯',
                        'Rwanda':'卢旺达',
                        'Western Sahara':'西撒哈拉',
                        'Saudi Arabia':'沙特阿拉伯',
                        'Sudan':'苏丹',
                        'South Sudan':'南苏丹',
                        'Senegal':'塞内加尔',
                        'Solomon Islands':'所罗门群岛',
                        'Sierra Leone':'塞拉利昂',
                        'El Salvador':'萨尔瓦多',
                        'Somaliland':'索马里兰',
                        'Somalia':'索马里',
                        'Republic of Serbia':'塞尔维亚共和国',
                        'Suriname':'苏里南',
                        'Slovakia':'斯洛伐克',
                        'Slovenia':'斯洛文尼亚',
                        'Sweden':'瑞典',
                        'Swaziland':'斯威士兰',
                        'Syria':'叙利亚',
                        'Chad':'乍得',
                        'Togo':'多哥',
                        'Thailand':'泰国',
                        'Tajikistan':'塔吉克斯坦',
                        'Turkmenistan':'土库曼斯坦',
                        'East Timor':'东帝汶',
                        'Trinidad and Tobago':'特里尼达和多巴哥',
                        'Tunisia':'突尼斯',
                        'Turkey':'土耳其',
                        'United Republic of Tanzania':'坦桑尼亚联合共和国',
                        'Uganda':'乌干达',
                        'Ukraine':'乌克兰',
                        'Uruguay':'乌拉圭',
                        'United States of America':'美国',
                        'Uzbekistan':'乌兹别克斯坦',
                        'Venezuela':'委内瑞拉',
                        'Vietnam':'越南',
                        'Vanuatu':'瓦努阿图',
                        'West Bank':'西岸',
                        'Yemen':'也门',
                        'South Africa':'南非',
                        'Zambia':'赞比亚',
                        'Zimbabwe':'津巴布韦'
                    },
                    data:data
                }
            ]
        };
        return option;
    },
    BarOption: function(dataX,dataY){
        var option={
            tooltip: {
                trigger: 'item'
            },
            color:['#005bff'],
            grid:{
                x:120,
                y:0,
                x2:40,
                y2:0,
                borderWidth:0
            },

            xAxis : [
                {
                    type : 'value',
                    boundaryGap: [0, 0.01],
                    axisLine : {    // 轴线
                        show: false
                    },
                    axisLabel:{
                        show:false
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
                            color: '#9eabb6',
                            width: 1
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel:{
                        //rotate: 45,
                        textStyle: {
                            color: '#9eabb6'
                        }
                    },
                    //barMinHeight: '80%',
                    data : dataY
                }
            ],
            series : [
                {
                    name:'攻击方式',
                    type:'bar',
                    itemStyle: {
                      normal: {
                          label: {
                              show: true,
                              position: 'right',
                              formatter: '{c}',
                              textStyle: {
                                  color: '#fff'
                              }

                          }
                      }
                    },
                    data : dataX
                }
            ]
        };
        return option;
    },
    PieCircleOption: {
            tooltip : {
                show: false,
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: true,
                orient : 'vertical',
                x : document.getElementById('pieIp').offsetWidth/2+20,
                y : 6,
                data: ['1','2','3','4', '5'],
                itemGap: 2,
                textStyle: {
                    color: 'auto',
                    fontSize: 10

                }

            },
            color:['#ff0000', '#dd8400', '#ddc600', '#00b0dd', '#006edd'],
            series : [
                {
                    name: '1',
                    type:'pie',
                    clockWise:false,
                    radius : [75, 90],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:75,
                            name:'1'
                        },
                        {
                            value:25,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'2',
                    type:'pie',
                    clockWise:false,
                    radius : [60, 75],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:68,
                            name:'2'
                        },
                        {
                            value:32,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'3',
                    type:'pie',
                    clockWise:false,
                    radius : [45, 60],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:29,
                            name:'3'
                        },
                        {
                            value:71,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'4',
                    type:'pie',
                    clockWise:false,
                    radius : [30, 45],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:3,
                            name:'4'
                        },
                        {
                            value:97,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                },
                {
                    name:'5',
                    type:'pie',
                    clockWise:false,
                    radius : [15, 30],
                    itemStyle : special.dataStyle,
                    data:[
                        {
                            value:3,
                            name:'5'
                        },
                        {
                            value:97,
                            name:'invisible',
                            itemStyle : special.placeHolderStyle
                        }
                    ]
                }

            ]

        },
    PieOption: function(device, deviceData){
       var  option = {
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                show: false,
                orient : 'vertical',
                x : 'left',
                data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
            },
            calculable : false,
            series : [
                {
                    name:'设备',
                    type:'pie',
                    radius : [0, '30%'],
                    center:['50%','60%'],
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
                    data: device
                },
                {
                    name:'访问来源',
                    type:'pie',
                    radius : ['40%', '60%'],
                    center:['50%','60%'],
                    data: deviceData
                }
            ]
        };
        return option;

    },
    RadarOption: function(title,attack,visit){
        var option ={
                title : {
                    text: title,
                    x: 'center',
                    y:'bottom',
                    textStyle: {
                        color: '#fff'
                    }

                },
                tooltip : {
                    show: false,
                    trigger: 'axis'
                },
                legend: {
                    data: ['访问量', '攻击量' ],
                    textStyle: {
                        color: 'auto'
                    }

                },
                 color: ['#2ecd73' ,'#ff0000'],
                polar : [
                    {
                        indicator : [
                            { text : '0' },
                            { text : '' },
                            { text : '' },
                            { text : '21' },
                            { text : '' },
                            { text : '' },
                            { text : '18' },
                            { text : '' },
                            { text : '' },
                            { text : '15' },
                            { text : '' },
                            { text : '' },
                            { text : '12' },
                            { text : '' },
                            { text : '' },
                            { text : '9' },
                            { text : '' },
                            { text : '' },
                            { text : '6' },
                            { text : '' },
                            { text : '' },
                            { text : '3' },
                            { text : '' },
                            { text : '' }

                        ],
                        radius : 60,
                        name: {
                            textStyle: {
                                color: '#fff'
                            }

                        }

                    }
                ],
                calculable : false,
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width:  1
                        }
                    }

                },
                series : [
                    {
                        name: 'name',
                        type: 'radar',
                        data : [
                            {
                                name : '攻击量',
                                symbol: 'none',

                                value : attack
                            },
                            {
                                name:'访问量',
                                symbol: 'none',
                                value: visit
                            }
                        ]
                    }
                ]
            };

        return option;
    },
    LineOption: function(date,attack,visit){
        var option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                textStyle: {
                    color: '#fff',
                    fontSize: 14
                },
                y: 20,
                data: ['攻击量','访问量']
            },
            grid: {
                borderWidth: 0
            },
            dataZoom : {
                show : true,
                realtime : true,
                start :0,
                end : 100,
                height: 20,
                fillerColor:'rgba(255, 255, 255, .1)',
                handleColor:'rgba(6,122,235,.6)',
                backgroundColor:'rgba(255, 255, 255, .1)',
                zoomLock: true
            },
            calculable: false,
            xAxis: [
                {
                    type: 'category',
                    name: '/日期',
                    boundaryGap: false,
                    axisLabel: { //坐标轴文本
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize: 14

                        }


                    },
                    axisLine: {// 坐标轴线
                        show: true
                    },
                    axisTick: {//坐标轴小标记
                        show: true,
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    splitLine: { // 网格线
                        show: false
                    },
                    data : date

                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '/次',
                    axisLabel: { //坐标轴文本
                        textStyle: {
                            color: '#fff',
                            fontSize: 14
                        }
                    },
                    axisLine: {// 坐标轴线
                        show: true
                    },
                    axisTick: {//坐标轴小标记
                        show: true
                    },
                    splitLine: { // 网格线
                        show: false,
                        lineStyle: {
                            type: 'dashed'
                        }
                    }


                }
            ],
            series: [
                {
                    name: '攻击量',
                    type:'line',
                    dataFilter: 'nearst',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color:'#ff0000',
                            lineStyle: {
                                width:  1
                            }
                        }

                    },
                    data:attack

                },
                {
                    name: '访问量',
                    type:'line',
                    dataFilter: 'nearst',
                    symbol: 'none',
                    smooth: true,
                    itemStyle: {
                        normal: {
                            color:'#2ecd73',
                            lineStyle: {
                                width:  1
                            }/*,
                            areaStyle: {
                                type: 'default',
                                color: 'rgba(46,205,115,.8)'
                            }*/
                        }

                    },
                    data: visit


                }
            ]

        };

        return option;
    }
};

$(function(){
    G20.init();


});