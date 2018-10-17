/**
 *@name
 *@author Sean.xiang
 *@date 2015/4/13
 *@example
 */
(function(){
    var param = $("#safe-domain").val();
    var safe_ip = $("#safe-ip").val();
    $(function(){
        __init__.view();
        __init__.draw();
        _init_function.closeTag();

    });

    var __init__={
        view: function(){
            var width = $(window).width();
            var height = $(window).height();
            $('#tree').width(width);
            $('#tree').height(height);

        },
        draw: function(){
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/force'
                ],
                function (ec) {
                    var tree= ec.init(document.getElementById('tree'));
                    __init__.drawChart(tree);
                });
        },
        drawChart: function(chart){

            var option = {
                title : {
                    text: '感知网站安全',
                    padding: 40,
                    x:'left',
                    y:'top',
                    textStyle: {
                        color: "#fff",
                        fontSize: 40
                    }
                },

                series : [
                    {
                        type:'force',
                        name : "name",
                        categories : [
                        {
                            name: '0',
                            symbol: 'diamond',
                            color: 'blue'

                        },
                        {
                            name: '1'
                            //symbol: 'circle'
                        },
                        {
                            name: '2'
                            //symbol: 'rectangle'
                        },
                        {
                            name: '3'
                            //symbol: 'circle'
                        },
                        {
                            name: '4'
                            //symbol: 'circle'
                        }
                        ],


                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 14
                                    }
                                },
                                nodeStyle : {
                                    brushType : 'both',
                                    borderColor : 'rgba(255,215,0,0.6)',
                                    borderWidth : 1
                                }
                            }
                        },
                        minRadius : 8,
                        maxRadius : 20,
                        coolDown: 0.995,
                        nodes :  __data__.nodes,
                        links : __data__.links,
                        steps: 35
                    }
                ]
            };
            chart.setOption(option);
            __init__.event(chart, option)

        },
        html: {
            //页面提示框内容显示
            //网站信息
            webInfo : function(data){
                $('.net-link').fadeOut("slow");
                $('.net-base').fadeIn("slow");
                $('.webName').text(data.domain);
                $('.ip').text(data.ip);
                $('.port').text(data.isp);
                $('.dns').text(data.area);
            },
            //所有人信息
            userInfo: function(data){
                //$('.net-base').hide();
                $('.net-base').fadeOut("slow");
                $('.net-link').fadeIn("slow");
                $('.userName').text(data.userName);
                $('.qq').text(data.qq);
                $('.email').text(data.email);
                $('.phone').text(data.phone);
            }
        },
        event: function(chart, option){
            var ecConfig = require('echarts/config');
            function focus(param) {
                var data = param.data; //节点名

                for (var i = 0; i < postData.web.length; i++) {
                    if(data.name == postData.web[i].name){
                        __init__.html.webInfo(postData.web[i]);
                    }
                }
            }
            //点击事件
            chart.on(ecConfig.EVENT.CLICK, focus);
            //导向图完成后再加载数据
            chart.on(ecConfig.EVENT.FORCE_LAYOUT_END, function () {

                // 查询子域名信息
                $.getJSON(__ROOT__+'/SceneOne/querySceneInfo', {"domain":param,"queryType":1, "ip":safe_ip}).success(function(json){
                    $.each(json.items, function(point, item){
                        var domainNodeData = {"category": 1,"name": item.sid+"(子域名)","value": 17 };
                        var domainLinkData = {"source": '子域（域名库）', "target": item.sid + "(子域名)"};
                        __data__.nodes.push(domainNodeData);
                        __data__.links.push(domainLinkData);
                        postData.web.push({
                            type:"www",
                            name:item.sid+"(子域名)",
                            domain:item.sid,
                            ip:item.ip,
                            isp:item.isp,
                            area:item.area
                        });
                        console.info("子域名添加完成");
                        $(".sub-info-stats").css("display", "none");
                    });
                    option.series[0].steps=1;
                    chart.setOption(option);
                    chart.un(ecConfig.EVENT.FORCE_LAYOUT_END);
                });

                // 查询IP旁站信息
                $.getJSON(__ROOT__+'/SceneOne/querySceneInfo', {"domain":param,"queryType":2, "ip":safe_ip}).success(function(json){
                    $.each(json.items, function(point, item){
                        var ipNodeData = {"category": 2,"name": item.sid + "(IP旁站)","value": 17 };
                        var ipLinkData = {"source": "IP旁站", "target": item.sid + "(IP旁站)"};
                        __data__.nodes.push(ipNodeData);
                        __data__.links.push(ipLinkData);
                        postData.web.push({
                            type:"www",
                            name:item.sid + "(IP旁站)",
                            domain:item.sid,
                            ip:item.ip,
                            isp:item.isp,
                            area:item.area
                        });
                        console.info("IP旁站添加完成");
                        $(".ip-info-stats").css("display", "none");
                    });
                    option.series[0].steps=1;
                    chart.setOption(option);
                    chart.un(ecConfig.EVENT.FORCE_LAYOUT_END);
                });


                $.getJSON(__ROOT__+'/SceneOne/querySceneInfo', {"domain":param,"queryType":3,"ip":safe_ip}).success(function(json){
                    // 查询IP旁站信息
                    $.each(json.items, function(point, item){
                        var roomNodeData = {"category": 3,"name": item.sid + "(机房旁站)","value": 17 };
                        var roomLinkData = {"source": "机房旁站", "target": item.sid + "(机房旁站)"};
                        __data__.nodes.push(roomNodeData);
                        __data__.links.push(roomLinkData);
                        postData.web.push({
                            type:"www",
                            name:item.sid + "(机房旁站)",
                            domain:item.sid,
                            ip:item.ip,
                            isp:item.isp,
                            area:item.area
                        });
                        console.info("机房旁站添加完成");
                        $(".room-info-stats").css("display", "none");
                    });
                    option.series[0].steps=1;
                    chart.setOption(option);
                    chart.un(ecConfig.EVENT.FORCE_LAYOUT_END);

                });
            });

        }


    };



    // 数据初始化
    var __data__={
        "nodes": [
            {"category": 0,"name": "网站(" + param + ")","value": 20 },
            {"category": 1,"name": "子域（域名库）","value": 19 },
            {"category": 2,"name": "IP旁站","value": 19 },
            {"category": 3,"name": "机房旁站","value": 19 }
            //{"category": 4,"name": "所有人","value": 19 }
        ],
        "links": [
            {"source": "网站(" + param + ")", "target": "子域（域名库）"},
            //{"source": "网站(" + param + ")", "target": "所有人"},
            {"source": "网站(" + param + ")", "target": "IP旁站"},
            {"source": "网站(" + param + ")", "target": "机房旁站"}
        ]
    };
    // 数据请求
    var postData = {

        web: [
        ]
    };

    var _init_function = {
        closeTag : function(){
            $(".close-tag").live("click", function(){
                console.info("关闭");
                $(".net-base").css("display", "none");
            });
        }
    };

})();