$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});

/**
 * Created with JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-4-2
 * Time: 10:07
 * To change this template use File | Settings | File Templates.
 */
(function(){
    var _jsonData;
    var mapGeo=__GEO__.china_province;

    var colors=['#fe5f5f', 'orange', '#ffe26c','#70d1fe','#90ff8b'];
    var level={
        "auth":1,"bgp":5,"bootpc":4,"bootps":4,"chargen":4,"daytime":4,"dhcpv6-client":3,"dhcpv6-server":3,"discard":3,
        "dns":3,"echo":1,"finger":3,"ftp":2,"ftps":2,"ftps-data":3,"http":5,"https":1,"imap":3,"imaps":3,"px":3,"irc":4,"ircd":4,
        "ircs":4,"isakmp":2,"idap":2,"idaps":2,"ms-sql-m":1,"ms-sql-s":1,"mysql":1,"netbios-dgm":4,"netbios-ns":4,"netbios-ssn":2,"nfs":2,"nnsp":2,
        "nntp":2,"nntps":2,"ntp":3,"oraclepop2":3,"pop3":3,"pop3s":2,"postgres":1,"printer":2,"qotdradius":5,"rcp":5,"rsync":1,"rtsp":2,"sftp":1,"smtp":2,"snmp":3,
        "snmptrap":4,"socks":1,"squid":4,"ssh":1,"submission":1,"sunrpc":2,"systat":1,"tacacs":1,"telnet":1,"telnets":1,
        "tftp":2,"timbuktu":2,"uucp":3,"whoami":1,"wins":2,"x11":4
    };



    require.config({
        paths: {
            echarts: __ECHART__
        }
    });
    $(document).ready(function(){


        __init__.view();

        __init__.drawContinentsMap();


        var continentXyJson=__init__.getContinentsGeo();

        __init__.drawChinaMap(continentXyJson);




    });
    var  __init__={
        view:function(){
            var dHeight=window.screen.height ;
            //初始化6大洲的高度
            $(".continents").css("height",(dHeight/4)+"px").css("width",(dHeight/4)+"px").css("position","absolute");
            $(".continents").each(function(i,div){
                var j=i%3;
                $(div).css("top",(dHeight/4*j)+"px").css((i>2?"right":"left"),dHeight/9+"px");
            });

            $("#map").css("height",(dHeight*0.6)+"px");
        },
        drawContinentsMap:function(){
            require(
                [
                    'echarts',
                    'echarts/chart/map'
                ],
                function (ec) {
                    var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
                    for(var i=0;i<continents.length;i++){
                        var oneMap=ec.init(document.getElementById(continents[i]+"Map"));
                        require('echarts/util/mapData/params').params[continents[i]] = {
                            getGeoJson: function (callback) {
                                $.getJSON(__PUBLIC__+'/source/geo/continents/'+continents[i]+'.geo',callback);
                            }
                        }
                        var opt={
                            backgroundColor: '#000000',
                            tooltip : {
                                trigger: 'item',
                                formatter: '{b}'//鼠标移上去的时候显示区域名称
                            },

                            series : [
                                {
                                    name: '',
                                    type: 'map',
                                    hoverable: false,
                                    roam:false,
                                    mapType: continents[i], // 自定义扩展图表类型
                                    data:[],
                                    itemStyle:{
                                        normal:{
                                            borderColor:'rgba(100,149,237,1)',
                                            borderWidth:0.5,
                                            areaStyle:{
                                                color: '#000000'
                                            }
                                        }
                                    }
                                }
                            ]
                        };
                        oneMap.setOption(opt);
                    }
                }
            );

        },
        getContinentsGeo:function(){
            var continents=['asia','africa','europe','northAmerica','southAmerica','oceania'];
            var json={};
            for(var i=0;i<continents.length;i++){
                var _map=$("#"+continents[i]+"Map");
                var x=_map.offset().left+_map.width()/2;
                if(continents[i]==='oceania'){
                    x=_map.offset().left+_map.width()-10;
                }
                var y=_map.offset().top+_map.height()/2;

                json[continents[i]]={"x":x,"y":y};
            }
            return json;
        },
        drawChinaMap:function(continentXyJson){
            require(
                [
                    'echarts',
                    'echarts/chart/map'
                ],
                function (ec) {
                    var  map = ec.init(document.getElementById('map'));



                    var option={

                        backgroundColor: '#000000',//背景色
                        tooltip:{
                            show:true,
                            trigger: 'item'
                        },
                        dataRange: {
                            min : 1,
                            max : 5,
                            show:false,
                            calculable : true,
                            color: colors,
                            textStyle:{
                                color:'#fff'
                            }
                        },
                        series : [
                            {
                                type: 'map',
                                mapType: 'china',
                                hoverable: false,

                                roam:false,
                                data : [],
                                itemStyle:{
                                    normal:{
                                        borderColor:'rgba(100,149,237,1)',
                                        borderWidth:0.5,
                                        areaStyle:{
                                            color: '#000000'
                                        }


                                    }

                                },

                                markPoint : {
                                    symbol:'circle',
                                    symbolSize: 7,
                                    effect:{
                                        show:true,
                                        scaleSize : 2,
                                        period: 10,
                                        loop:true
                                    },
                                    data : []
                                },
                                markLine : {
                                    smooth:false,
                                    symbol: ['circle', 'circle'],
                                    symbolSize : [0,0],
                                    itemStyle : {
                                        normal: {
                                            label:{show:false},
                                            lineStyle: {
                                                type: 'solid',
                                                width:0.1
                                            }
                                        },
                                        emphasis: {
                                            label:{show:false},
                                            lineStyle: {
                                                type: 'solid',
                                                width:0.1
                                            }
                                        }
                                    },
                                    effect:{
                                        show:true,

                                        shadowBlur:null,
                                        shadowColor:null,
                                        scaleSize : 40,
                                        period: 10

                                    },
                                    data : []


                                }

                                //  geoCoord:__GEO__.china_province
                            }
                        ]
                    };
                    map.setOption(option);


                    $.each(continentXyJson,function(k,v){
                        // mapGeo
                        var _geo=map.chart.map.getGeoByPos("china",[v.x, v.y]);

                        mapGeo[k]=_geo;
                    });
                    option.series[0].geoCoord=mapGeo;
                    map.setOption(option);

                    var flag=true;//flag=true的时候才会去后台加载数据，防止前台线条和点过多
                    var times=0;
                    //
                    function getAjaxData(cookie){
                        flag=false;
                        $.post(__ROOT__+'/ScreenCenter/AttackEvent/getAttackEventJson'

                        ).success(function(json){
                                if(times>=15){
                                    map.refresh();
                                    times=0;
                                }
                                times++;
                                if(json.code>0){
                                    _jsonData=json.data;
                                }
                                if(_jsonData){
                                    //开始描线

                                    $.each(_jsonData.attack,function(i,item){
                                        setTimeout(function(){
                                            if(!__functions__.checkMarkLineNumberGt(map,20)){
                                                __draw__.addLine(map,item);

                                            }
                                            //在描线同时在攻击过程的攻击过程的滚屏中加载数据
                                            __draw__.drawAttack(item);


                                        },500*i);
                                    });
                                    //if(times==1){
                                     __draw__.initWraper(_jsonData.srcCounter,$("#originWraper"),1);
                                    __draw__.initWraper(_jsonData.destCounter,$("#targetWraper"),2);
                                    __draw__.initWraper(_jsonData.typeCounter,$("#typeWraper"),3);

                                    //}
                                }
                            });
                    }
                    getAjaxData(true);

                    var inst=setInterval(function(){//时刻监测当前线条和攻击点的数目，多余10个的时候在地图上移除最先加载进来的那一条（个）

                        if(__functions__.checkMarkLineNumberGt(map,10)){
                            __draw__.delLine(map);
                        }else{
                            flag=true;
                        }
                    },200);

                    setInterval(function(){
                        if(flag){
                            getAjaxData(false);
                        }
                    },5000);



                }
            );
        }



    };
    var __functions__={
        getAjaxParam:function(wraper){
            var itemRows=$(".item",wraper);
            var data={};
            $.each(itemRows,function(i,row){
                var name=$(".name",$(row)).text();
                var number=$(".number",$(row)).text();
                data[name]=number;
            });
            return data;
        },
        checkMarkLineNumberGt:function(map,count){
            var series=map.getSeries();
            var datas=series[0].markLine.data;
            // console.info(datas.length);
            return datas.length>count;
        }
    };
    var __draw__={

        addLine:function(map,item){
            //画起点和重点的连线
            var from=countryReflects[item.srcGeoRegion]?countryReflects[item.srcGeoRegion].c:item.srcGeoRegion;
            var to=countryReflects[item.destGeoRegion]?countryReflects[item.destGeoRegion].c:item.destGeoRegion;
            map.addMarkLine(0,{data:[[{name:from,value:6-level[item.appProtocol]},{name:to}]]});
            map.addMarkPoint(0,{data:[{name:to,value:6-level[item.appProtocol]}]});


        },
        delLine:function(map){
            var series=map.getSeries();
            var points=series[0].markPoint.data;
            //删除最早加载的点
            map.delMarkPoint(0, points[0].name);
            var lines=series[0].markLine.data;
            //删除最早加载的线条
            var delStr=lines[0][0].name+' > '+lines[0][1].name;
            map.delMarkLine(0,delStr);
        },
        drawAttack:function(item){
            var wraper=$("#processWraper");
            var itemLen=$(".item",wraper).length;
            var _lev=level[(item.appProtocol || 'http')];

            var to=item.deviceName;
           // to=(to=='浙江'?(to+'数据中心'):(to+"二级节点"));
            var deviceName=item.deviceName;
            if(deviceName.length>12){
                deviceName=deviceName.substring(0,12);
            }
            if(!item.deviceName){
                to=item.destGeoRegion
                to=(to=='浙江'?(to+'数据中心'):(to+"二级节点"));
            }

            var desc=item.name||item.appProtocol;
            if(desc.length>30){
                desc=desc.substr(0,30)+"...";
            }

            var p=$("<div class='row item' style='color: "+colors[_lev-1]+"'>" +
                "<div class='col-md-1'>"+getDate()+"</div>" +
                "<div class='col-md-2'>"+item.srcGeoRegion+"</div>" +
                "<div class='col-md-2'>"+item.srcAddress+"</div>" +
                "<div class='col-md-3'>"+to+"</div>" +
                "<div class='col-md-4'>"+desc+"</div>" +
                "</div>");

            p.css("padding-left","5px").css("padding-right","5px");

            if(itemLen==0){
                p.appendTo(wraper);
            }else{
                //p.hide();
                p.insertBefore($(".item:eq(0)",wraper));

                //p.slideDown("800");
            }
            if(itemLen>=10){
                $(".item:last",wraper).remove();
            }
        },
        initWraper:function(items,wraper,type){
            wraper.html("");
            var i=0;
            $.each(items,function(k,v){
                var one;
                //  var bgWidth= k.length*12+20;

                if(type!=3){
                    var _flag='';
                    if(countryReflects[k]){
                        if(countryReflects[k]['f']){
                            _flag=countryReflects[k]['f'];
                        }else{
                            _flag=k;
                        }
                    }else{
                        _flag="中国";
                    }
                    var str="二级节点";
                    if(k=='浙江'){
                        str="数据中心";
                    }
                    var _append=(type==2?str:"");
                    if(type == 2){
                        if(k.indexOf("美国") ==-1 && k.indexOf("俄罗斯") ==-1 && k.indexOf("巴西") == -1){
                            one=$("<div class='row item item_"+k+"'>" +
                                "<div class='number text-right col-md-2'>"+v+"</div>" +
                                "<div class='col-md-2'><img src='"+__PUBLIC__+"/image/attack-src/"+_flag+".png'/></div>" +
                                "<div class='col-md-8'><span class='name'>" +k+"</span><span>"+_append+"</span></div>"+
                                "</div>");
                        }else{
                            //console.info(k + " -------------");
                        }
                    }else{
                        one=$("<div class='row item item_"+k+"'>" +
                            "<div class='number text-right col-md-2'>"+v+"</div>" +
                            "<div class='col-md-2'><img src='"+__PUBLIC__+"/image/attack-src/"+_flag+".png'/></div>" +
                            "<div class='col-md-8'><span class='name'>" +k+"</span><span>"+_append+"</span></div>"+
                            "</div>");
                    }


                    //one=$("<div class='row item item_"+k+"'>" +
                    //    "<div class='number text-right col-md-2'>"+v+"</div>" +
                    //    "<div class='col-md-2'><img src='"+__PUBLIC__+"/image/attack-src/"+_flag+".png'/></div>" +
                    //    "<div class='col-md-8'><span class='name'>" +k+"</span><span>"+_append+"</span></div>"+
                    //    "</div>");



                }else{
                    var _lev=level[k];
                    one=$("<div class='row item item_"+k+"'>" +
                        "<div class='col-md-2 number' >"+v+"</div>" +
                        "<div class='col-md-2' ><span class='fa fa-flash' style='color: "+colors[_lev-1]+"'></span></div>" +
                        "<div class='col-md-8 name ' style='padding-left: 0px;padding-right: 0px;'><div>" +k+"</div></div>"+
                        "</div>");
                    //one=$("<div class='row item item_"+k+"'>" +
                    //    "<div class='col-md-2 number' >"+v+"</div>" +
                    //    "<div class='col-md-2' ><span class='fa fa-flash' style='color: "+colors[_lev-1]+"'></span></div>" +
                    //    "<div class='col-md-8 name ' style='padding-left: 0px;padding-right: 0px;'><div>" + attackTypeReflects[k]+"</div></div>"+
                    //    "</div>");
                }
                if(one){
                    one.css("padding-left","5px").css("padding-right","5px").css("padding-top","2px").css("padding-bottom","2px");
                    if(i>=10){//只加载top10，其他的隐藏起来
                        one.hide();
                    }

                    wraper.append(one);
                    i++;
                }

            });
            //对变更了攻击次数的省份做着色处理
//            $.each(changes,function(i,p){
//
//                var row=$(".item_"+p,wraper);
//              //  console.info(row);
//                if(row){
//
//                    $("div:eq(1),div:eq(2)",row).addClass("item-change");
//                    setTimeout(function(){
//                        $("div:eq(1),div:eq(2)",row).removeClass("item-change");
//                    },1000)
//                }
//            });
        }
    }

    function getDate(){
        var d=new Date().Format("hh:mm:ss");
        return d;
    }

    var attackTypeReflects={
        'http':'文件上传',
        'https':'缓存区溢出攻击',
        'netbios-ns':'CC攻击',
        'netbios-dgm':'跨站脚本',
        'ssh':'DDOS攻击',
        'ntp':'struts2远程命令执行',
        'ms-sql-s':'webshell',
        'telnet':'sql注入',
        'mysql':'远程代码执行',
        'squid':'xss注入',
        'snmp':'url重定向',
        'tftp':'代码注入攻击'
    }

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
        '马来西亚':{c:'asia'}

    }



})();


