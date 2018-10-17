/**
 *@name
 *@author Sean.xiang
 *@date 2015/10/8
 *@example
 */
var __ECHART__=$("#echartPath").val();
var __ECHARTX__=$("#echartXPath").val();
var __ROOT__=$("#rootPath").val();
var __WEBROOT__=__ROOT__;
var __PUBLIC__=$("#publicPath").val();

// 定时器时间间隔
var _intervals={
    inTimeProtectRefresh:1000 * 10 * 6,//实时防御状况刷新时间
    areaRankRefresh: 1000 * 10 * 6,    //攻击源区域排行刷新时间
    typeRankRefresh: 1000 * 10 * 6, //攻击源区域排行刷新时间
    ipRankRefresh: 1000* 10 * 6, //攻击源区域排行刷新时间
    sortInterval:500//排行榜的排序间隔
};

var CloudWaf = {
    init: function(){
        var w = this;

        w.initHtml();


    },
    initHtml: function(){
        var w = this;
        var width = $(window).width();
        var height = $(window).height();

        $('#earth').width(width);
        $('#earth').height(height);

        w.draw();
        w.realTime();
        w.areaRank();
        w.ipRank();
        w.typeRank();
    },
    draw: function(){
        var w = this;
        require.config({
            paths: {
                'echarts': __ECHART__
            }
        });
        require([
            'echarts',
            'echarts/chart/map'
        ], function (ec) {

            var myChart = ec.init(document.getElementById('earth'));


            require('echarts/util/mapData/params').params.cloudwaf = {
                getGeoJson: function (callback) {
                    $.ajax({
                        url: __PUBLIC__+"/image/screen/waf.svg",
                        dataType: 'xml',
                        success: function(xml) {
                            callback(xml)
                        }
                    });
                }
            }
            var option={
                series : [
                    {
                        type: 'map',
                        mapType: 'cloudwaf',
                        hoverable: false,
                        roam:false,
                        data : [],
                        markLine : {
                            smooth:false,
                            symbol: ['none','none'],
                            effect : {
                                show: true,
                                scaleSize: 3,
                                period: 10,
                                color: 'rgba(255,0,0,.5)',
                                shadowBlur: 5
                            },
                            itemStyle : {
                                normal: {
                                    borderWidth:1,
                                    lineStyle: {
                                        type: 'dashed',
                                        shadowBlur: 10,
                                        color: 'rgba(0,0,0,0)'
                                    }
                                }
                            },
                            data : []


                        },
                        markPoint : {
                            symbol:'emptyCircle',
                            symbolSize : function (v){
                                return 10 + v/100
                            },
                            effect : {
                                show: true,
                                shadowBlur : 0
                            },
                            itemStyle:{
                                normal:{
                                    label:{show:false}
                                }
                            },
                            data : [ ]
                        }


                    }
                ]
            };
            myChart.setOption(option);
            var flag=true;
            for (var i = 0; i < 100; i++) {
                setTimeout(function(){
                    if(!__functions__.checkMarkLineNumberGt(myChart,20)){
                        __draw__.addLine(myChart);

                    }

                },500*i);

            }



            setInterval(function(){//时刻监测当前线条和攻击点的数目，多余10个的时候在地图上移除最先加载进来的那一条（个）
                if(__functions__.checkMarkLineNumberGt(myChart,10)){
                    __draw__.delLine(myChart);
                }else{
                    flag=true;
                }
            },200);


            $(window).resize(function () {
                myChart.resize();
            });
        })


    },
    gridHtml: function(){
        var w = this;

    },
    realTime: function(){
        var w = this;
        // 实时防御概况
        (function(){
            var inTimeProtect=function(){
                var path = __ROOT__+"/ScreenCenter/CloudWaf/realTimeDefense";
                $.ajax(path).success(function(json){
                    var day_attack_num =w.day_attack_num||0;
                    if(json.day_attack_num>day_attack_num){

                        startCount($(".dayAttackProtectSite "),{
                            from: day_attack_num,
                            to:json.day_attack_num
                        });
                    }
                    w.day_attack_num=json.day_attack_num;

                        $(".attackProtectSite ").html(json.domain_num);


                    var all_attack_num=w.all_attack_num||0;


                    if(json.all_attack_num>all_attack_num){

                        startCount($(".low-num"),{
                            from:all_attack_num,
                            to:json.all_attack_num
                        });
                    }
                    w.all_attack_num=json.all_attack_num;
                });
            };
            inTimeProtect();
            setInterval(inTimeProtect,_intervals.inTimeProtectRefresh);
        })();
    },
    areaRank: function(){
        var w = this;
        $("tbody",$('.area-rank')).itemScoller({
            ajaxUrl:__ROOT__+'/ScreenCenter/CloudWaf/attackSource',
            items:"dataList",
            key:"location",
            value:"count",
            refresh_interval:_intervals.areaRankRefresh,//刷新间隔
            interval:_intervals.sortInterval,//排序间隔
            //auto_refresh:false,
            draw:function(index,item,json){
                var max=json.dataList[0]['count'];
                var width = ((item.count + 1 )/max)*100;
                var size = json.size;
                var el=$('<tr><td><img src="' + __PUBLIC__ + '/image/attack-src/'+ w.getFlag(item.location)+'.png" /></td>'+
                '<td>'+item.location+'</td>'+
                '<td class="people"></td>' +
                '<td class="count"><span class="pecent">' + (item.count*100/size).toFixed(2) + '</span>%</td></tr>');
                var peopeCount = item.count*9/max.toFixed(0);
                for(var i=0;i<9;i++){
                    var color=i<peopeCount?"male-color":"";
                    $(".people",el).append('<i class="fa fa-rocket '+color+'"></i>');
                }
                return el;
            },
            compare:function(v1,v2){
                return v2-v1>0?true:false;
            }
        });
    },
    typeRank: function(){
        var w = this;
        $("tbody",$('.type-rank')).itemScoller({
            ajaxUrl:__ROOT__+'/ScreenCenter/CloudWaf/attackType',
            items:"dataList",
            key:"type",
            value:"count",
            refresh_interval: _intervals.typeRankRefresh,//刷新间隔
            interval:_intervals.sortInterval,//排序间隔
            //auto_refresh:false,
            draw:function(index,item,json){
                //console.info(item)
                var max=json.dataList[0]['count'];
                var width = (item.count/max)*100;
                //console.info(item.count)
                var el=$('<tr style="display: block"><td>'+item.type+'</td>'+
                    '<td><div class="progress" style="margin-bottom: 0px;"><div class="progress-bar"  style="width: '+width+'%;"><span>'+item.count+'</span></div></div></td>'+
                    '</tr>');
                return el;
            },
            compare:function(v1,v2){
                return v2-v1>0?true:false;
            }
        });
    },
    ipRank: function(){
        var w = this;
        $("tbody",$('.ip-rank')).itemScoller({
            ajaxUrl:__ROOT__+'/ScreenCenter/CloudWaf/attackIPBlackList',
            items:"dataList",
            key:"ip",
            value:"count",
            refresh_interval:_intervals.ipRankRefresh,//刷新间隔
            interval:_intervals.sortInterval,//排序间隔
            //auto_refresh:false,
            draw:function(index,item,json){
                var max=json.dataList[0]['count'];
                var width = (item.count/max)*100;
                var el=$('<tr style="display: block">'+
                    '<td>'+item.location+'</td>'+
                    '<td><div class="progress" style="margin-bottom: 0px;"><div class="progress-bar"  style="width: '+width+'%;"><span class="ip">'+item.ip+'</span></div>' +
                    '</div></td>' +
                '<td>'+item.count+'</td>' +

                '</tr>');
                return el;
            },
            compare:function(v1,v2){

                return v2-v1>0?true:false;
            },
            vauleScoller:function(line,start,end){
                var o=$("td:eq(2)",line);
                startCount(o,{
                    from:start,
                    to:end,
                    speed:_intervals.ipRankRefresh-5000,
                    formatter: function(b, a) {
                        return b.toFixed(0);
                    }
                });

            }
        });
    },
    getFlag:function(location){
        var flag="中国";
        if(countryReflects[location]&&countryReflects[location]['f']){
            flag= countryReflects[location]['f'];
        }else if(countryReflects[location]){
            flag=location;
        }
        return flag;

    }
};
var __functions__={

    checkMarkLineNumberGt:function(map,count){
        var series=map.getSeries();
        var datas=series[0].markLine.data;
        return datas.length>count;
    }
};
var __draw__ = {
    addLine:function(map, i){
        //画起点和终点点的连线
        var series=map.getSeries();
        var lines = series[0].markLine.data;
        var d = new Date();
        d.getDate();

        map.addMarkLine(0,{data:[[{name: d.getDate() ,geoCoord:[ Math.floor(Math.random()*1920), Math.floor(Math.random()*1080)]}, {name: d.getDate()+1, geoCoord:[960,540]}]]});

    },
    delLine:function(map){
        var series=map.getSeries();
        var lines=series[0].markLine.data;
        //删除最早加载的线条
        var delStr=lines[0][0].name+' > '+lines[0][1].name;
        map.delMarkLine(0,delStr);
    }

};

var countryReflects={//一些关系映射
    '加利福尼亚':{c:'northAmerica',f:'美国'},

    '北美地区':{c:'northAmerica',f:'美国'},
    '伯利兹':{c:'northAmerica'},
    '加拿大':{c:'northAmerica'},
    '哥伦比亚':{c:'northAmerica'},
    '圣卢西亚':{c:'northAmerica'},
    '墨西哥':{c:'northAmerica'},
    '多米尼克':{c:'northAmerica'},
    '尼加拉瓜':{c:'northAmerica'},
    '智利':{c:'northAmerica'},
    '牙买加':{c:'northAmerica'},
    '美国':{c:'northAmerica'},
    '阿根廷':{c:'northAmerica'},
    '新泽西':{c:'northAmerica',f:'美国'},

    '古巴':{c:"southAmerica"},
    '巴巴多斯':{c:'southAmerica'},
    '巴哈马':{c:'southAmerica'},
    '巴拿马':{c:'southAmerica'},
    '巴西':{c:'southAmerica'},
    '海地':{c:'southAmerica'},
    '苏里南':{c:'southAmerica'},


    '丹麦':{c:'europe'},
    '乌克兰':{c:'europe'},
    '保加利亚':{c:'europe'},
    '冰岛':{c:'europe'},
    '匈牙利':{c:'europe'},
    '卢森堡':{c:'europe'},
    '奥地利':{c:'europe'},
    '希腊':{c:'europe'},
    '德国':{c:'europe'},
    '挪威':{c:'europe'},
    '捷克':{c:'europe'},
    '摩纳哥':{c:'europe'},
    '比利时':{c:'europe'},
    '法国':{c:'europe'},
    '波兰':{c:'europe'},
    '爱尔兰':{c:'europe'},
    '瑞典':{c:'europe'},
    '瑞士':{c:'europe'},
    '立陶宛':{c:'europe'},
    '罗马利亚':{c:'europe'},
    '芬兰':{c:'europe'},
    '英国':{c:'europe'},
    '荷兰':{c:'europe'},
    '马其顿':{c:'europe'},
    '西班牙':{c:'europe'},

    '不丹':{c:'asia'},
    '印度':{c:'asia'},
    '吉尔吉斯斯坦':{c:'asia'},
    '哈萨克斯坦':{c:'asia'},
    '土耳其':{c:'asia'},
    '孟加拉国':{c:'asia'},
    '尼泊尔':{c:'asia'},
    '巴基斯坦':{c:'asia'},
    '新加坡':{c:'asia'},
    '日本':{c:'asia'},
    '朝鲜':{c:'asia'},
    '柬埔寨':{c:'asia'},
    '泰国':{c:'asia'},
    '缅甸':{c:'asia'},
    '老挝':{c:'asia'},
    '菲律宾':{c:'asia'},
    '越南':{c:'asia'},
    '阿富汗':{c:'asia'},
    '韩国':{c:'asia'},
    '马尔代夫':{c:'asia'},
    '马来西亚':{c:'asia'},
    '澳大利亚':{c:'oceania'},
    '尼日利亚':{c:'africa'}
};


$(function(){

    CloudWaf.init();
});
