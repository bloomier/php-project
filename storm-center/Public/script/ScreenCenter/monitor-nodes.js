/**
 *@author Sean.xiang
 *@date 2015/12/28
 */
    // 设置ajax同步，即设置async（异步）为false
    $.ajaxSetup({async : false});

    var mySwiper;
    var mapChart = {};

    var datas = {
        totalNodeNum: 0,
        errorNodeNum: 0,
        nodeGlobal:[],
        singleTask:[],
        cycTask:[]

    };

    var physicalStates = {};
    var timeFlag;

    var provinces = {
        "陕西": "西安",
        "安徽": "合肥",
        "天津": "天津",
        "四川": "成都",
        "黑龙江": "哈尔滨",
        "湖北": "武汉",
        "海南": "海口",
        "西藏": "拉萨",
        "江苏": "南京",
        "浙江": "杭州",
        "广西": "南宁",
        "江西": "南昌",
        "青海": "西宁",
        "北京": "北京",
        "湖南": "长沙",
        "广东": "广州",
        "宁夏": "银川",
        "云南": "昆明",
        "上海": "上海",
        "贵州": "贵阳",
        "河南": "郑州",
        "辽宁": "沈阳",
        "内蒙古": "呼和浩特",
        "甘肃": "兰州",
        "福建": "福州",
        "新疆": "乌鲁木齐",
        "吉林": "长春",
        "山西": "太原",
        "山东": "济南"
    }

    var detailDialog ;

    // 显示节点详情对话框
    function showDialog(title){
        var globalData = MonitorNode.getOneDateByNodeName(datas.nodeGlobal, title);
        if(globalData && globalData.length > 0){
            $('.current-node-status').html(globalData[0].statusDesc);
            $("#work_status_id").removeClass().addClass('chart-gauge-pointer');
            var status = globalData[0].status;
            if(status == 1){
                $("#work_status_id").addClass('green-pointer');
            } else if(status == -1){
                $("#work_status_id").addClass('red-pointer');
            }
        }

        MonitorNode.setSingeleHtml(title);
        MonitorNode.setCycHtml(title);

        MonitorNode.setOnePhysicalHtml(title);

        var title = "<h4>" + title + "节点</h4>";
        detailDialog.setTitle(title);
        detailDialog.open();
    }

    var MonitorNode =  {
        init: function(){
            var w  =this;

            var width = $(window).width();
            var height = $(window).height();
            $('#map').height(height *.5);
            $('.week-height').height(height *.512);
            $('.j-node-monitor').height(height *.5);
            $('.node-monitor-height').height(height *.5);
            $('.j-week-task').height(height *.5);
            $('.j-one-task').height(height *.3);

            detailDialog = new BootstrapDialog({
                title: '<h3>XX节点</h3>',
                //type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                // size: BootstrapDialog.SIZE_WIDE,
                closable: true,
                message: function(){
                    return $(".detail-dialog-content").show();
                },
                buttons: [{
                    label: '关闭',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
            });

            // 获取数据
            w.getData();

            w.map();

            w.nodeMonitor();
            w.weekTask();
            w.oneTask();
            w.nodeStatus();

            // 显示当前监测节点
            w.current_check_node();

        },
        map: function(){
            var w  =this;

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
                    mapChart = ec.init(document.getElementById('map'));
                    //mapChart.showLoading();

                    var items = datas.nodeGlobal;
                    var lines = [];
                    var points = [];
                    $.each(items,function(i,item){
                        lines.push([{name: provinces[item.nodeName], value:item.status}, {name: '杭州'}]);
                        points.push({name: provinces[item.nodeName], value:item.status})
                    });

                    mapChart.setOption(_init_data.mapOption(lines,points));

                });

        },
        nodeMonitor: function(){
            var w  =this;
            var list = datas.nodeGlobal;
            var class_color = 'bg-green';
            $('.j-node-monitor').html("");
            for(var i = 0,num = list.length; i < num; i++){
                class_color = list[i]['status'] == -1 ? 'bg-red' : list[i]['status'] == 0 ? 'bg-yellow' : 'bg-green';
                var el =" <div class='f-list' onclick='showDialog(\"" + list[i]['nodeName'] +
                    "\")' >" + "<div class='f-status " + class_color + "'>" +
                    list[i]['statusDesc'] + "</div>" + "<div class='f-content'>" +
                    "<div class='f-title' >" + list[i]['nodeName'] + "</div> " +
                    "<div class='f-info'><span>" + list[i]['lastActive'] +
                    "</span></div></div></div>";
                $('.j-node-monitor').append(el);
            }
            $(".error_num").text(datas.errorNodeNum);
            $(".all_num").text(datas.totalNodeNum);
            // $(".error_all_num").text(datas.errorNodeNum + '/' + datas.totalNodeNum);

        },
        nodeStatus: function(){
            var w = this;

            var data = physicalStates;
            //$('.j-node-status').html("");
            for(var x in data){
                var el =" <div class='swiper-slide'>" +
                    "<div class='node-info'>" +
                    " <div class='chart'><div class='chart-gauge'></div><div class='chart-gauge-pointer green-pointer'></div></div>" +
                    "<div class='node-info-name' onclick='showDialog(\"" + x + "\")'>" + x + "节点</div>" +
                    "</div><div class='node-detail'> " +
                    "<div>cpu:<span>" + data[x]['CPU'] + "</span></div> " +
                    "<div>内存:<span>" + data[x]['RAM'] + "</span></div>" +
                    "<div>硬盘:<span>" + data[x]['DISK'] + "</span></div> " +
                    "<div>温度:<span>" + data[x]['TEMP'] + "℃</span></div> " +
                    "<div>流量:<span>" + data[x]['IN'] + "Mb</span></div> " +
                    //"<div>出流量:<span>" + data[x]['OUT'] + "Mb</span></div> " +
                    "</div> " +
                    "</div>";
                $('.j-node-status').append(el);
            }

        },
        weekTask: function(){

            var w  =this;

            var list = datas.cycTask;
            var errorNum = 0;
            var allNum = 0;
            var spanRed = "<span style='color: #FF0000;'>";
            var spanOrange = "<span style='color: #FF8000;'>";
            var spanEnd = "</span>";
            $('.j-week-task tbody').html("");
            for(var i = 0,num = list.length; i < num; i++){
                var el = "";
                allNum = allNum + 1;
                if(list[i]['status'] == -1){
                    errorNum = errorNum + 1;
                    el = "<tr class='red'><td>" + spanRed + list[i]['heartTimeDesc'] + spanEnd +
                    "</td><td onclick='showDialog(\""  + list[i]['nodeName'] + "\")'>" + spanRed +
                    list[i]['nodeName'] + "节点</span></td><td>" + spanRed + list[i]['taskName'] + spanEnd +
                    "</td><td>" + spanRed + list[i]['statusDesc'] + spanEnd + "</td></tr>";
                } else if(list[i]['status'] == 0){
                    errorNum = errorNum + 1;
                    el = "<tr ><td>" + spanOrange + list[i]['heartTimeDesc'] + spanEnd +
                    "</td><td onclick='showDialog(\""  + list[i]['nodeName'] + "\")'>" + spanOrange +
                    list[i]['nodeName'] + "节点</span></td><td>" + spanOrange + list[i]['taskName'] + spanEnd +
                    "</td><td>" + spanOrange + list[i]['statusDesc'] + spanEnd + "</td></tr>";
                } else {
                    el = "<tr ><td>" + list[i]['heartTimeDesc'] +
                    "</td><td onclick='showDialog(\""  + list[i]['nodeName'] + "\")'>" +
                    list[i]['nodeName'] + "节点</td><td>" + list[i]['taskName'] +
                    "</td><td>" + list[i]['statusDesc'] + "</td></tr>";
                }


                $('.j-week-task tbody').append(el);
            }

            $('.cyc_Num').text(errorNum + '/' + allNum);

        },
        oneTask: function(){
            var w  =this;

            var list = datas.singleTask;
            var errorNum = 0;
            var allNum = 0;
            var spanRed = "<span style='color: #FF0000;'>";
            var spanOrange = "<span style='color: #FF8000;'>";
            var spanEnd = "</span>";
            $('.j-one-task tbody').html("");
            for(var i = 0,num = list.length; i < num; i++){
                var el = "";
                allNum = allNum + 1;
                var heartTimeDesc = list[i]['heartTimeDesc'].length > 10 ? list[i]['heartTimeDesc'].substr(11,8) : list[i]['heartTimeDesc'];
                if(list[i]['status'] == -1 || list[i]['status'] == 0){
                    errorNum = errorNum + 1;
                    el = "<tr><td>" + spanRed + heartTimeDesc + spanEnd + "</td><td onclick='showDialog(\""  +
                    list[i]['nodeName'] + "\")'>" + spanRed + list[i]['nodeName'] +
                    "节点</span></td><td>" + spanRed + list[i]['taskName'] + spanEnd +
                    "</td><td>" + spanRed + list[i]['statusDesc'] + spanEnd + "</td></tr>";
                } else {
                    el = "<tr><td>" + heartTimeDesc + "</td><td onclick='showDialog(\""  +
                    list[i]['nodeName'] + "\")'>" + list[i]['nodeName'] +
                    "节点</td><td>" + list[i]['taskName'] +
                    "</td><td>" + list[i]['statusDesc'] + "</td></tr>";
                }

                $('.j-one-task tbody').append(el);
            }
            $('.single_Num').text(errorNum + '/' + allNum);

        },
        getData: function(){
            var w = this;
            // 获取物理数据
            $.post(__ROOT__ + "/ScreenCenter/MonitorNodes/getPhysicalHostState").success(function(json){
                if(json['code'] == 1){
                    var data = json['items'];
                    for(var item in data){
                        var one = data[item];
                        physicalStates[item] = {
                            "CPU": one['cpu'],
                            "TEMP": w.getRandom(40),
                            "RAM": one['memery'],
                            "DISK": one['disk'],
                            "IN": w.kbToMb(one['io']),
                            "OUT": w.kbToMb(one['io'])
                        }
                    }
                }
            });
            //
            $.post(__ROOT__ + "/ScreenCenter/MonitorNodes/getData").success(function(json){
                var tmpNodeGlobal = [];
                var tmpSingleTask = [];
                var tmpCycTask = [];
                var data ;
                if(json.code == 1){
                    data = json.data;
                }
                var totalNodeNum = 0;
                var errorNodeNum = 0;

                for(var x in data){
                    totalNodeNum = totalNodeNum + 1;
                    var tmpData = data[x];
                    // 填充物理数据
                    // w.setOnePhysicalData(x);
                    if(tmpData.nodeGlobal){
                        tmpData.nodeGlobal['nodeName'] = x;
                        tmpNodeGlobal.push(tmpData.nodeGlobal);
                        if(tmpData.nodeGlobal['status'] == -1 || tmpData.nodeGlobal['status'] == 0){
                            errorNodeNum = errorNodeNum + 1;
                        }
                    }

                    if(tmpData.singleTask){
                        var singleTaskData = tmpData.singleTask;
                        for(var i = 0,num = singleTaskData.length; i < num; i++){
                            singleTaskData[i]['nodeName'] = x;
                            tmpSingleTask.push(singleTaskData[i]);
                        }
                    }

                    if(tmpData.cycTask){
                        var cycTaskData = tmpData.cycTask;
                        for(var i = 0,num = cycTaskData.length; i < num; i++){
                            cycTaskData[i]['nodeName'] = x;
                            tmpCycTask.push(cycTaskData[i]);
                        }
                    }

                }

                datas.totalNodeNum = totalNodeNum;
                datas.errorNodeNum = errorNodeNum;
                datas.nodeGlobal = tmpNodeGlobal.sort(w.sort_list);
                datas.singleTask = tmpSingleTask.sort(w.sort_list);
                datas.cycTask = tmpCycTask.sort(w.sort_list);
            });
        },
        showMap: function(){
            var w = this;
            var items = datas.nodeGlobal;
            var lines = [];
            var points = [];
            $.each(items,function(i,item){
                lines.push([{name: provinces[item.nodeName], value:item.status}, {name: '杭州'}]);
                points.push({name: provinces[item.nodeName], value:item.status})
            });

            mapChart.setOption(_init_data.mapOption(lines,points));
        },
        current_check_node: function(){
            var w = this;
            var items = datas.nodeGlobal;
            $.each(items,function(i,item){
                timeFlag = setTimeout(function(){
                    $(".web","#header-desc").text(item.nodeName + "节点").removeClass('a-bouncein').hide().show().addClass('a-bouncein');
                    //$(".web","#header-desc").text(item.nodeName + "节点").addClass('a-bouncein');
                    $(".web-status","#header-desc").text(item.statusDesc).removeClass('a-bouncein red blue').hide().show().addClass('a-bouncein');

                    if(item.status == -1){
                        $(".web-status","#header-desc").addClass('red')
                    } else if (item.status == 0){
                        $(".web-status","#header-desc").addClass('yellow')
                    }else {
                        $(".web-status","#header-desc").addClass('blue')
                    }
                    if(i >= items.length-1){
                        //setTimeout(function(){
                            w.current_check_node.call(w);
                        //},1500);
                    }
                },i*2500);
            });
        },
        sort_list: function(a,b){
            if(a.status<b.status){
                return -1;
            }else if(a.status == b.status){
                if(a.heartTime){
                    if(a.heartTime && b.heartTime){
                        if(a.heartTime < b.heartTime){
                            return -1;
                        } else{
                            return 1
                        }
                    } else {
                        return -1;
                    }

                } else if(a.lastActive) {
                    if(a.lastActive && b.lastActive){
                        if(a.lastActive < b.lastActive){
                            return -1;
                        } else{
                            return 1
                        }
                    } else {
                        return -1;
                    }

                } else {
                    return -1;
                }

            }else{
                return 1;
            }
        },
        reflushPage: function(){
            var w = this;

            // 加载数据
            w.getData();
            // 数据加载为空的时候  不刷新
            if(datas.totalNodeNum > 0){
                clearTimeout(timeFlag);
                w.nodeMonitor();
                w.weekTask();
                w.oneTask();

                w.nodeStatus();
                // 显示当前监测节点
                w.current_check_node();

                // 显示地图数据
                w.showMap();
            }
        },
        getOneDateByNodeName: function(list,nodeName){
            var nodes = []
            $.each(list,function(i,item){
                if(item.nodeName == nodeName){
                    nodes.push(item);
                }
            });
            return nodes;
        },
        setSingeleHtml: function(title){
            var singleData = MonitorNode.getOneDateByNodeName(datas.singleTask, title);
            if(singleData && singleData.length > 0){
                var siglehtml = "<h5>一次性任务</h5>";
                $.each(singleData,function(i,item){
                    siglehtml += "<div>" + item.taskName + "<span>" + item.statusDesc + "</span><span>" + item.heartTimeDesc + "</span></div>"
                });
                $(".singleItem-content").html(siglehtml);
            } else {
                $(".singleItem-content").html("<h5>暂无一次性任务</h5>");
            }
        },
        setCycHtml: function(title){
            var cycData = MonitorNode.getOneDateByNodeName(datas.cycTask, title);
            if(cycData && cycData.length > 0){
                var cychtml = "<h5>周期性任务</h5>";
                $.each(cycData,function(i,item){
                    cychtml += "<div>" + item.taskName + "<span>" + item.statusDesc + "</span><span>" + item.heartTime + "</span><span>" + item.heartTimeDesc + "</span></div>"
                });
                $(".cycItem-content").html(cychtml);
            } else {
                $(".cycItem-content").html("<h5>暂无周期性任务</h5>");
            }
        },
        getRandom:function(num){
            return Math.round(num + Math.random()*10);
        },
        setOnePhysicalHtml: function(title){
            var data = physicalStates[title];
            $('.cpu_class').text(data['CPU']);
            $('.temp_class').text(data['TEMP']);
            $('.ram_class').text(data['RAM']);
            $('.disk_class').text(data['DISK']);
            $('.in_class').text(data['IN']);
            // $('.out_class').text(data['OUT']);
        },
        kbToMb: function(kb){
            var num = parseInt(kb); //
            num = num /1024;
            num = num.toFixed(2);
            return num;
        }

    };
    var  __functions__ ={
        swiper : function () {
            var w  =this;
            mySwiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 3,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                preloadImages: true,
                updateOnImagesReady : true,
                spaceBetween: 5,
                autoplay: 4000,
                observer:true,
                autoplayDisableOnInteraction: false
            });
            //$('.swiper-container').hover(function () {
            //    mySwiper.stopAutoplay();
            //}, function () {
            //    mySwiper.startAutoplay();
            //});

        }
    }
    var _init_data={
        mapOption : function(lines, points){
            console.info(points)
            var option = {
                dataRange: {
                    show: true,
                    textStyle: {
                        color: '#eee',
                        fontSize: 14

                    },
                    //x: -10,
                    y: 'bottom',
                    itemHeight: 20,
                    //calculable: false,
                    splitList: [
                        {start: -1, end: -1, color: 'red',label: '故障节点'},
                        {start: 0, end: 0, color: '#b36715',label: '告警节点'},
                        {start: 1, end: 1, color: 'green',label: '正常节点'}
                    ]
                },
                series: [
                    {
                        name: '全国',
                        type: 'map',
                        roam: false,
                        hoverable: false,
                        mapType: 'china',
                        itemStyle: {
                            normal: {
                                label: {show: false},
                                borderColor: 'rgba(19, 105,167, 1)',
                                borderWidth:.5,
                                areaStyle: {
                                    color: 'rgba(2, 89,255, .2)'
                                }
                            }
                        },
                        data: [],
                        geoCoord: __GEO__.provincial_capital
                    },
                    {
                        name: '全国',
                        type: 'map',
                        mapType: 'china',
                        data: [],
                        markLine: {
                            smooth: true,
                            effect: {
                                show: true,
                                scaleSize: 1,
                                period: 30,
                                color: '#fff',
                                shadowBlur: 10
                            },
                            itemStyle: {
                                normal: {
                                    borderWidth: 1,
                                    lineStyle: {
                                        type: 'solid',
                                        shadowBlur: 10
                                    }
                                }
                            },
                            data: [
                                [{name: '北京',value:1}, {name: '杭州'}],
                                [{name: '上海',value:1}, {name: '杭州'}],
                                [{name: '天津',value:1}, {name: '杭州'}],
                                [{name: '广州',value:1}, {name: '杭州'}],
                                [{name: '重庆',value:1}, {name: '杭州'}],
                                [{name: '南宁',value:1}, {name: '杭州'}],
                                [{name: '石家庄',value:1}, {name: '杭州'}],
                                [{name: '郑州',value:1}, {name: '杭州'}],
                                [{name: '福州',value:1}, {name: '杭州'}],
                                [{name: '海口',value:1}, {name: '杭州'}],
                                [{name: '南昌',value:1}, {name: '杭州'}],
                                [{name: '长沙',value:1}, {name: '杭州'}],
                                [{name: '贵阳',value:1}, {name: '杭州'}],
                                [{name: '昆明',value:1}, {name: '杭州'}],
                                [{name: '武汉',value:1}, {name: '杭州'}],
                                [{name: '合肥',value:1}, {name: '杭州'}],
                                [{name: '济南',value:1}, {name: '杭州'}],
                                [{name: '太原',value:1}, {name: '杭州'}],
                                [{name: '呼和浩特',value:0}, {name: '杭州'}],
                                [{name: '南京',value:1}, {name: '杭州'}],
                                [{name: '成都',value:1}, {name: '杭州'}],
                                [{name: '西安',value:1}, {name: '杭州'}],
                                [{name: '沈阳',value:1}, {name: '杭州'}],
                                [{name: '银川',value:1}, {name: '杭州'}],
                                [{name: '兰州',value:1}, {name: '杭州'}],
                                [{name: '西宁',value:1}, {name: '杭州'}],
                                [{name: '拉萨',value:1}, {name: '杭州'}],
                                [{name: '长春',value:1}, {name: '杭州'}],
                                [{name: '乌鲁木齐',value:1}, {name: '杭州'}],
                                [{name: '哈尔滨',value:1}, {name: '杭州'}]
                            ]
                        },
                        markPoint: {
                            symbol: 'emptyCircle',
                            symbolSize: function (v) {
                                return 10 + v / 10
                            },
                            effect: {
                                show: true,
                                shadowBlur: 0,
                                scaleSize: 1
                            },
                            itemStyle: {
                                normal: {
                                    label: {show: false}
                                }
                            },
                            data: [
                                {name: '北京', value: 1},
                                {name: '上海', value: 1},
                                {name: '天津', value: 1},
                                {name: '重庆', value: 1},
                                {name: '郑州', value: 1},
                                {name: '哈尔滨', value: 1},
                                {name: '长春', value: 1},
                                {name: '长沙', value: 1},
                                {name: '沈阳', value: 1},
                                {name: '合肥', value: 1},
                                {name: '呼和浩特', value: 0},
                                {name: '石家庄', value: 1},
                                {name: '福州', value: 1},
                                {name: '乌鲁木齐', value: 1},
                                {name: '兰州', value: 1},
                                {name: '西宁', value: 1},
                                {name: '西安', value: 1},
                                {name: '贵阳', value: 1},
                                {name: '银川', value: 1},
                                {name: '济南', value: 1},
                                {name: '太原', value: 1},
                                {name: '武汉', value: 1},
                                {name: '南京', value: 1},
                                {name: '南宁', value: 1},
                                {name: '南昌', value: 1},
                                {name: '成都', value: 1},
                                {name: '昆明', value: 1},
                                {name: '拉萨', value: 1},
                                {name: '杭州', value: 1},
                                {name: '广州', value: 1},
                                {name: '海口', value: 1}
                            ]
                        }
                    }
                ]
            };
            if(lines){
                option.series[1].markLine.data = lines;
            }
            if(points){
                option.series[1].markPoint.data = points;
            }
            return option;
        }
    };
    $(function(){
        MonitorNode.init();
        __functions__.swiper();

        // 每两分钟刷新一次数据
        setInterval(function(){
            MonitorNode.reflushPage();
        }, 2*60*1000);
    });

