/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/5
 *@example
 */

(function(){
    var Index = {
        init: function(){
            var w = this;

            w.initHtml();
            w.initEvent();

        },
        initHtml: function(){
            var w = this;
            var height= $(window).height();


            $('#map').height(height* .6);

            w.initDraw();

            $(window).resize(function(){
                //浏览器窗口变化时，图形自适应
                w.initDraw();
            });
        },
        initEvent: function(){
            var w = this;
        },
        initDraw: function(){
            var w =this;


            w.initOption();

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

                    w.map= ec.init(document.getElementById('map'));

                    w.map.setOption(w.mapOption);



                }
            );


        },
        initOption: function(){
            var w = this;

            w.mapOption={
                title: {
                    text: '全国服务节点分布图',
                    x:'center',
                    y: 40,
                    textStyle: {
                        fontSize: 18,
                        fontFamily: 'Microsoft YaHei'
                    }
                },

                color: [
                    'rgba(0, 221, 0, 0.8)'
                ],
                dataRange: {
                    show: false,
                    min: 0,
                    max: 1,
                    color: ['rgba(0, 221, 0, 0.8)','red']
                },

                series: [
                    {
                        name: '正常节点',
                        type: 'map',
                        mapType: 'china',
                        hoverable: false,
                        itemStyle:{
                            normal:{
                                borderColor:'#D6D6D6',
                                borderWidth: 1,
                                areaStyle:{
                                    color: '#ccc'
                                }

                            }
                        },
                        data: [],
                        geoCoord : _data_.map.geo,
                        markPoint : {
                            symbol: 'pin',
                            symbolSize: 6,
                            effect : {
                                show: false
                            },
                            itemStyle:{
                                normal:{
                                    label:{
                                        show:false

                                    }
                                }
                            },
                            data: _data_.map.data
                        }
                    },
                    {
                        name: '出错节点',
                        type: 'map',
                        mapType: 'china',
                        data:[],
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
                                    color: 'red',
                                    label:{show:false}
                                }
                            },
                            data : _data_.map.unData
                        }
                    }



                ]

            };
        }

    };
    var _data_= {
        map: {
            geo : {

                '杭州': [119.5313,29.8773],
                '北京': [116.4551,40.2539],
                '上海': [121.4648,31.2891],
                '新疆': [84.9023,41.748],
                '广州': [113.5107,23.2196],
                '哈尔滨': [127.9688,45.368],
                '武汉': [114.3896,30.6628],
                '重庆': [107.7539,30.1904],
                '南京': [118.8062,31.9208],
                '西安': [109.1162,34.2004]
            },
            data: [
                //0代表不可访问，1代表正常
                {name: '杭州',value: '1'},
                {name: '北京',value: '1'},
                {name: '上海',value: '1'},
                {name: '新疆',value: '1'},
                {name: '哈尔滨',value: '1'},
                {name: '武汉',value: '0'},
                {name: '重庆',value: '1'},
                {name: '南京',value: '1'},
                {name: '西安',value: '1'}
            ],
            unData: [
                {name: '武汉'}
            ]

        }
    };
    $(function(){
       Index.init();
    })
})();