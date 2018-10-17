/**
 *@name
 *@author Sean.xiang
 *@date 2016/4/5
 *@version
 *@example
 */

var markers =[];
var place= null,text =null;
    var NanShan = {
        init: function(){
            var w = this;
            //w.draw();
            //w.getBoundary();

            w.drawEchart();
            //w.initData(Data);

        },
        draw: function(){
            var w = this;

            w.renderMarker();

        },
        getBoundary: function(){
            var w = this;
            var bdary = new BMap.Boundary();
            bdary.get("深圳市南山区", function(rs){       //获取行政区域
    //            bmap.clearOverlays();        //清除地图覆盖物
                var count = rs.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return ;
                }
                var pointArray = [];
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000", fillColor: "transparent"}); //建立多边形覆盖物
                    bmap.addOverlay(ply);  //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
                bmap.setViewport(pointArray);    //调整视野
            });
        },
        drawMarker: function( point ,text){
            var w = this;
            var marker = new BMap.Marker(point);
            var opt ={
                position: point,
                offset: new BMap.Size(20,0)
            };
            var label = new BMap.Label(text,opt);
            label.setStyle({
                color: '#fff',
                fontSize : "12px",
                height : "20px",
                lineHeight : "20px",
                fontFamily:"微软雅黑",
                border: '0',
                background: 'none'
            });
            marker.setLabel(label);

            bmap.addOverlay(marker);
        },
        renderMarker: function(){
            var w =this;

            for (var i = 0; i < data.length; i++) {
                place = new BMap.Point( data[i].geo[0], data[i].geo[1]);
                text =data[i].name;

                w.drawMarker(place, text);

            }
        },
        drawEchart: function(){
            var w = this;

            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map'

                ],
                function (ec) {
                    // 自定义扩展图表类型：mapType = HK

                    w.myChart = ec.init(document.getElementById('echartMap'));

                    require('echarts/util/mapData/params').params.nanshan = {
                        getGeoJson: function (callback) {
                            $.getJSON(__PUBLIC__+'/source/geo/nanshan/nanshan.json', callback);
                        }
                    };


                    w.myChart.setOption(w.echartOption());
                    //w.initData(Data);
                    //w.myChart.setOption(w.echartOption());


                })

        },
        echartOption : function(){
            var w =this;

            var option = {
                tooltip : {
                    trigger: 'item'
                },
                series : [

                    {
                        name: '南山区',
                        type: 'map',
                        hoverable: false,
                        mapType: 'nanshan',
                        data: [],
                        itemStyle: {
                            normal: {
                                label: {show: false},
                                borderColor: 'rgba(19, 105,167, 1)',
                                borderWidth: .5,
                                areaStyle: {
                                    color: 'rgba(2, 89,255, .2)'
                                }
                            }
                        },
                        markPoint: {
                            symbolSize: 5,
                            itemStyle: {
                                normal: {
                                    borderWidth: 0,
                                    label: {
                                        show: true
                                    }
                                },
                                emphasis: {
                                    symbolSize: 10,
                                    borderWidth: 5,
                                    label: {
                                        show: true
                                    }
                                }
                            },
                            data: (function(){
                                var point =[];
                                for (var i = 0; i < Data.length; i++) {
                                    point.push({
                                        name: Data[i].name,
                                        geoCoord: Data[i].geo
                                    })

                                }

                                return point;
                            })()

                        }
                    },
                    {
                        name:'status',
                        type:'map',
                        hoverable: false,
                        mapType: 'nanshan',
                        data: [],
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
                            data : (function(){
                                var point =[];
                                for (var i = 0; i < 10; i++) {
                                    point.push({
                                        name: Data[i].name,
                                        geoCoord: Data[i].geo
                                    })

                                }

                                return point;
                            })()
                        }
                    }
                ]
            };
            return option;
        },
        initData: function( data){
            var w = this;
            var point = [] ;

            for (var i = 0; i < data.length; i++) {
                point.push({
                    name: data[i].name,
                    geoCoord: data[i].geo

                });
                //console.info(point);
                //w.echartOption().series[0].markPoint.data = $.parseJSON(point);

            }

            console.info(point,2);
           /* console.info(point)
            console.info( w.echartOption().series[0].markPoint.data)

            w.echartOption().series[0].markPoint.data =point;
            console.info(w.echartOption().series[0].markPoint.data)
            console.info( typeof w.echartOption().series[0].markPoint.data)*/







        }



//{name: "博伦职校", geoCoord: [113.927090,22.519350]},



    };
var data =[
    {
        name: '博伦职校',
        url : 'www.szblzx.com',
        ip : '183.62.160.14',
        serverIp : '10.202.251.40',
        mapIp : '10.202.251.40',
        place : '区教育局机房',
        serverType: 'DELL2950/win2003',
        geo: [113.927090,22.519350]
    },
    {
        name: '白芒小学',
        url : ['www.nsbmxx.com', 'www.nsbmxx11.com'],
        ip : '183.62.160.46',
        serverIp : '10.202.251.82',
        mapIp : '10.202.251.82',
        place : '区教育局机房',
        serverType: 'DELL2950/win2003',
        geo: [113.994970,22.591480]

    }
];

    NanShan.init();
