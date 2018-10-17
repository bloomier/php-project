$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});


// VIP区域有： 海南 云南 浙江 湖北 辽宁 山西 天津 黑龙江 广西 贵州 上海

// 当前是案件年月字符串
var currentTimeStr = "";

var vipBar = null;
var noVipBar = null;
// 每月最少通报数
var minNum = 5;

(function(){


    $(function(){
        currentTimeStr = _init_data.getCurrentYearMonthStr();
        _init_.view();
        _init_.addHandler();
        _init_.draw.showMap();
        // $(".citys").citySelect({prov:"请选择"});
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $('#vip_id').height(height * 0.3);
            $('#no_vip_id').height(height * 0.3);

        },
        draw: {
            showMap : function(op){
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });
                require(
                    [
                        'echarts',
                        'echarts/chart/bar'

                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        vipBar = ec.init(document.getElementById('vip_id'));
                        noVipBar = ec.init(document.getElementById('no_vip_id'));
                        // 显示柱状图
                        showData.show(currentTimeStr);

                    }
                )
            }
        },
        addHandler: function(){

            //绑定查询按钮事件
            $(".search_button").bind("click",function(){
                var year = $("#year_id").val();
                if(year == ''){
                    year = currentTimeStr.substring(0,4);
                }
                var month = $("#month_id").val();
                if(month == ''){
                    month = currentTimeStr.substring(4,6);
                }
                showData.show(year + '' + month);
            });
        }
    };
    var _init_data = {
        getCurrentYearMonthStr : function(){
            //初始化时间数组
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            if(month < 10){
                month = "0" + month;
            }
            return fullYear + "" + month;
        },
        initBar: function(json,titleName){
            var option = {
                title : {
                    text: titleName,
                    subtext: '',
                    x: 'center',
                    y: 'top',
                    textStyle:{
                        //fontSize: 18,
                        //fontWeight: 'bolder',
                        color: '#46A3FF'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                backgroundColor:'#ffffff',
                legend: {
                    data:['月通报量'],// ,'待通报量'
                    y: 'bottom'
                },
                color: [ "#66B3FF", "#FF8000"],
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'category',
                        //data : ['浙江','江西','上海','山东','四川','北京','江苏','天津','重庆','云南','广西','广东']
                        data : json['province']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'月通报量',
                        type:'bar',
                        //data:[2, 4, 7, 23, 25, 7, 13, 16, 32, 20, 6, 3],
                        data: json['report'],
                        itemStyle: {normal: {
                            label : {show:true,position:'top',formatter:'{c} '}
                        }},
                        stack: '统计'

                    }
                    //,
                    //{
                    //    name:'待通报量',
                    //    type:'bar',
                    //    //data:[2, 5, 9, 26, 28, 70, 17, 18, 48, 18, 6, 23]
                    //    data: json['notreport'],
                    //    itemStyle: {normal: {
                    //        label : {show:true,position:'inside',formatter:'{c} '}
                    //    }},
                    //    stack: '统计'
                    //}
                ]
            };
            if(titleName == 'VIP区域安全事件通报量'){
                option.series[0].markLine = {
                    data : [
                        [
                            {name: '标线1起点', value: minNum, xAxis: -1, yAxis: minNum, itemStyle:{normal:{color:'red',label:{position:'right'}}}},
                            {name: '标线1终点', xAxis: 12, yAxis: minNum}
                        ]
                    ]
                }
            }
            // option.legend.selected = {'待通报量' : false};
            return option;
        },
        initTable: function(json){
            var xuhao = 1;
            var table = "<table class='table table-bordered margin-top-20' >" +
                "<thead class='bg-lightgrey'><tr><th>序号</th><th>区域</th>" +
                "<th>已通报数</th></tr></thead><tbody>";// <th>待通报数</th>

            var vipreportList = json.vip.report;
            var vipnotreportList = json.vip.notreport;
            var vipList = json.vip.province;
            var reportNum = 0;
            var notReportNum = 0;
            if(vipreportList != null && vipreportList != 'null'){
                for(var i = 0; i < vipreportList.length; i++){
                    if(vipreportList[i] && vipreportList[i] < minNum){
                        table += "<tr style='background-color: khaki;'><td>" + (xuhao++) + "</td>";
                    } else {
                        table += "<tr><td>" + (xuhao++) + "</td>";
                    }
                    table += "<td><span style='color: #0060ff;'>" + vipList[i] + "</span></td>" +
                    "<td>" + vipreportList[i] + "</td>" +
                    // "<td>" + vipnotreportList[i] + "</td>" +
                    "</tr>";
                    if(vipreportList[i] != undefined && vipreportList[i] != 0){
                        reportNum += parseInt(vipreportList[i]);
                    }
                    //if(vipnotreportList[i] != undefined){
                    //    notReportNum += parseInt(vipnotreportList[i]);
                    //}
                }
            }

            var novipreportList = json.novip.report;
            var novipnotreportList = json.novip.notreport;
            var novipList = json.novip.province;
            if(novipreportList != null && novipreportList != 'null'){
                for(var i = 0; i < novipreportList.length; i++){
                    table += "<tr><td>" + (xuhao++) + "</td>" +
                    "<td>" + novipList[i] + "</td>" +
                    "<td>" + novipreportList[i] + "</td>" +
                    // "<td>" + novipnotreportList[i] + "</td>" +
                    "</tr>";

                    if(novipreportList[i] != undefined && novipreportList[i] != 0){
                        reportNum += parseInt(novipreportList[i]);
                    }
                    //if(novipnotreportList[i] != undefined){
                    //    notReportNum += parseInt(novipnotreportList[i]);
                    //}
                }
            }

            table += "<tr><td>" + (xuhao++) + "</td>" +
            "<td>总计</td>" +
            "<td>" + reportNum + "</td>" +
            // "<td>" + notReportNum + "</td>" +
            "</tr>";

            table += "</tbody></table>";
            $("#div_table_id").html(table);
        }
    }

    var showData = {
        show: function(year_month_key){
            var params = {
                'year_month_key': year_month_key
            };
            vipBar.showLoading();
            noVipBar.showLoading();
            $.getJSON(__ROOT__+'/security/Event/queryEventStatistics', params).success(function(json) {
                var option = _init_data.initBar(json.data.vip,'VIP区域安全事件通报量');
                vipBar.setOption(option);
                vipBar.hideLoading();

                var option1 = _init_data.initBar(json.data.novip,'其他区域安全事件通报量');
                noVipBar.setOption(option1);
                noVipBar.hideLoading();

                _init_data.initTable(json.data)
            });
        }
    }

})();