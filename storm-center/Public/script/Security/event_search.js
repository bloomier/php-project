/**
 *@name
 *@author ancyshi
 *@date 2015/11/19
 *@example
 */
// $.ajaxSettings.async = false;  //同步才能获取数据
var area_str = "";
// 定义事件类型数组
var event_type_config = [];
var event_type_map = {};
var chartBar ;
var detailDialog;
var initFlag = true;
var detailTable ;
var filterParam = [];
function showDetailList(area){
    // detailDialog.open();
    initDialog(area);
    //detailDialog.open();
}


function initDialog(area){
    var title = '<h3>安全事件明细-' + area + '</h3>';
    if(initFlag) {
        detailDialog = new BootstrapDialog({
            title: title,
            // type: BootstrapDialog.TYPE_DEFAULT,
            autodestroy: false,
            size: BootstrapDialog.SIZE_WIDE,
            closable: false,
            message: function () {
                return $(".detail-dialog-content").show();
            },
            buttons: [{
                label: '关闭',
                action: function (dialogItself) {
                    dialogItself.close();
                }
            }]
        });
    } else {
        detailDialog.setTitle(title);
    }

    initDetailTable(area);
}


function initDetailTable(area){
    if(area == '合计'){
        area = $(".prov-location").val();
        if(area == "全国"){
            area = "";
        }
    }
    filterParam = [];
    filterParam.push({name:"area",value: area});
    filterParam.push({name:"site_domain",value: $("#site_domain_id").val()});
    filterParam.push({name:"site_name",value: $("#site_name_id").val()});
    filterParam.push({name:"event_source",value: $("#event_source_id").val()});
    filterParam.push({name:"end_time",value: $("#end_time_id").val()});
    filterParam.push({name:"begin_time",value:$("#begin_time_id").val()});
    filterParam.push({name:"deal_state",value:$("#deal_state_id").val()});
    filterParam.push({name:"report_email",value:$("#event_email_id").val()});
    filterParam.push({name:"event_type",value:$("#event_type_id").val()});
    if(initFlag){
        detailTable = $("#detail_table_id").dataTable($.extend(storm.defaultGridSetting(),{
            "sAjaxSource": __ROOT__+'/Security/EventSearch/queryDetailList',//请求URL
            "aoColumns": [ //参数映射
                {"mDataProp": 'site_name'},
                {"mDataProp": 'site_domain'},
                {"mDataProp": 'area'},
                {"mDataProp": 'event_type'},
                {"mDataProp": 'begin_time'},
                {"mDataProp": 'end_time'}
            ],
            "aoColumnDefs": [//指定列属性
                //{"aTargets":[0],"mRender":function(value,type,aData){
                //    if(value && value.length > 12){
                //        return value.substr(0,12);
                //    }else{
                //        return value;
                //    }
                //}
                //}
            ],
            "fnServerParams":function(aoData){//查询条件
                $.merge(aoData, filterParam);
            },
            "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                var site_name = aData['site_name'];
                if(aData && site_name){
                    var showName = site_name;
                    if(showName && showName.length > 10){
                        showName = showName.substr(0,10) + "...";
                    }
                    site_name = "<a target='_blank' href='" + __ROOT__ + "/Security/Event/traceView?eventId=" + aData['event_id'] + "'>" + showName + "</a>";
                }
                $('td:eq(0)', nRow).html(site_name);

                var site_domain = aData['site_domain'];
                if(aData && site_domain){
                    site_domain = "<a target='_blank' href='" + aData['event_source']  + "'>" + site_domain + "</a>";
                }
                $('td:eq(1)', nRow).html(site_domain);

                var event_type = aData['event_type'];
                if(event_type){
                    event_type = event_type_map[event_type];
                }
                $('td:eq(3)', nRow).html(event_type);
                // showInfo();
            }
        }));
        initFlag = false;

    } else {
        detailTable.fnDraw();
    }

    detailDialog.open();

}


(function(){


    $(function(){
        _init_.view();
        _init_.addhander();
        _init_.setDefaultDate();
        _init_.draw.init();
        // 获取所有事件类型与对应中文
        var obj = $("#event_type_id").get(0).options;
        for(var i = 0, num = obj.length; i < num; i++){
            if(obj[i].value != ''){
                event_type_config.push(obj[i].text);
                event_type_map[obj[i].value] = obj[i].text;
            }
        }
        _get_Data_.getList();
        // _init_data.initDialog('');
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $('#div_view_id').height(height * 0.2);
            $('#bar_id').height(weight * 0.35);

        },
        draw: {
            init : function(){
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });
                require(
                    [
                        'echarts',
                        'echarts/chart/bar',
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        chartBar = ec.init(document.getElementById('bar_id'));
                        // chartBar.setOption(_init_data.initBar());
                        chartBar.on(require('echarts/config').EVENT.CLICK, function (param){
                            var area = param.name;
                            //var eventType = param.seriesName;
                            //alert(area + " : " + eventType);
                            var obj = $(".prov-location").get(0).options;
                            var flag = true;
                            for(var i = 0, num = obj.length; i < num; i++){
                                if(obj[i].value == area || area.indexOf(obj[i].value) >= 0 ){
                                    $(".prov-location").val(obj[i].value);
                                    flag = false;
                                    break;
                                }
                            }
                            if(flag){// 省级点击才会加载数据,否则查询全国
                                $(".prov-location").val("全国");
                            }
                            _get_Data_.getList();

                        });
                    }
                )
            }
        },
        addhander: function(){
            $("#button_search_id").bind("click",function(){
                _get_Data_.getList();
            });
            $("#button_export_id").bind("click",function(){
                _export_data_.exportExcel();
            });

            $("#button_export_detail_id").bind("click",function(){
                _export_data_.exportExcelDetail();
            });
            //
            $(".citys").provinceSelect({prov:"请选择"});
        },
        // 设置日期默认值
        setDefaultDate : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            var begin_time = '' + fullYear + '-' + month + '-01';
            var end_time = '' + fullYear + '-' + month + '-' + day;
            $("#begin_time_id").val(begin_time);
            $("#end_time_id").val(end_time);
        }

    };



    var _export_data_ = {
        exportExcel : function(){
            var params = _init_data.getParamStr();
            window.open(__ROOT__+'/Security/EventSearch/export?' + params);
        },
        exportExcelDetail : function(){
            var params = _init_data.getParamStr();
            window.open(__ROOT__+'/Security/EventSearch/exportDetail?' + params);
        }
    };

    var _get_Data_ = {
        getList: function(){
            var params = _init_data.getParam();
            $.getJSON(__ROOT__ + '/Security/EventSearch/queryReportRecordList',params ).success(function(json){
                _init_data.showTableData(json.data);
                _init_data.initBar(json.data)
            });
        }

    }


    var _init_data = {
        getParamStr: function(){
            var area = $(".prov-location").val();
            if(area == "全国"){
                area = "";
            }
            var params = "site_domain=" + $("#site_domain_id").val() +
                "&site_name=" + $("#site_name_id").val() +
                "&event_source=" + $("#event_source_id").val() +
                "&end_time=" + $("#end_time_id").val() +
                "&begin_time=" + $("#begin_time_id").val() +
                "&area=" + area +
                "&deal_state=" + $("#deal_state_id").val() +
                "&report_email=" + $("#event_email_id").val() +
                "&event_type=" + $("#event_type_id").val();
            return params;
        },
        getParam: function(){
            var area = $(".prov-location").val();
            if(area == "全国"){
                area = "";
            }
            var params = {
                'area': area,
                'site_domain': $("#site_domain_id").val(),
                'site_name': $("#site_name_id").val(),
                'event_source': $("#event_source_id").val(),
                'end_time': $("#end_time_id").val(),
                'begin_time': $("#begin_time_id").val(),
                'deal_state': $("#deal_state_id").val(),
                'report_email': $("#event_email_id").val(),
                'event_type': $("#event_type_id").val()
            };
            return params;
        },
        initBar: function(json){
            var option = {
                title : {
                    //text: '安全事件分布',
                    //subtext: '',
                    x: 'center',
                    y: 'top',
                    textStyle:{
                        color: '#46A3FF'
                    }
                },
                tooltip : {
                    trigger: 'axis'
                },
                backgroundColor:'#ffffff',
                legend: {
                    //data:['黑页','暗链'],
                    data:[],
                    y: 'bottom'
                },
                color: [ "#000000", "#66B3FF", "#FF8000","#467500","#FFFF37","#5151A2","#AE57A4"],
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
                        data : []
                        //data : ['浙江','湖北','湖南','北京','天津']
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [ //{  name:'黑页',  type:'bar', data: [20,40,50,40,30],stack: '统计' }
                 ]
            };

            var arrSeries = new Array(event_type_config.length);
            for(var i = 0, num = event_type_config.length;i < num; i++) {
                var event_type = event_type_config[i];
                option.legend.data.push(event_type);
                var serie = {};
                serie.name = event_type;
                serie.type = "bar";
                serie.data = new Array();
                serie.stack = "统计";
                //serie.itemStyle = {normal: {
                //    label : {show:true,position:'inside',formatter:'{c}'}
                //}};
                arrSeries[i] = serie;
            }

            for(var item in json){
                option.xAxis[0].data.push(item);
                for(var i = 0, num = event_type_config.length;i < num; i++){
                    arrSeries[i].data.push(json[item][event_type_config[i]]);
                }
            }
            for(var i = 0, num = event_type_config.length;i < num; i++) {
                option.series.push(arrSeries[i]);
            }
            if(json == null){
                chartBar.showLoading();
            }
            chartBar.setOption(option,true);
            if(json != null && json != ''){ // 让没有数据时显示默认动画效果，有数据则hide掉
                chartBar.hideLoading();
            }

        },
        showTableData: function(json){
            var tbody = $("tbody", $("#showlist_id"));
            tbody.html("");
            var indexNum = 1;
            // 定义统计合计用的数组  new Array(12);
            var arr = new Array(event_type_config.length);
            for(var i = 0, num = event_type_config.length;i < num; i++){//初始化
                arr[i] = 0;
            }
            var allNum = 0;
            var rapairNum = 0;
            //遍历属性
            for(var item in json){
                //console.info("json" + item + "的值=" + json[item]["黑页"]);
                var td = "";
                var trAll = 0;
                var repair = json[item]['修复'];
                for(var i = 0, num = event_type_config.length;i < num; i++){
                    arr[i] += parseInt(json[item][event_type_config[i]]);
                    trAll += parseInt(json[item][event_type_config[i]]);
                    td += "<td>"+ json[item][event_type_config[i]] +"</td>";
                }
                var tr=$("<tr><td>"+ indexNum +"</td>" +
                "<td><a class='hand' onclick=showDetailList('" + item +"');>"+ item +"</a></td>" +
                td +
                "<td>"+ trAll +"</td>" +
                "<td>"+ repair +"</td>" +
                "</td><td>" + (repair / trAll).toFixed(2) + "%</td></tr>");
                allNum += parseInt(trAll);
                rapairNum += parseInt(repair);
                tr.appendTo(tbody);
                indexNum++;
            }

            // 添加最后一行
            if(indexNum > 2){
                var td = "";
                for(var i = 0, num = arr.length;i < num; i++){
                    td += "<td>"+ arr[i] +"</td>";
                }
                var tr=$("<tr><td>"+ indexNum +"</td>" +
                "<td><a class='hand' onclick=showDetailList('合计');>合计</a></td>" +
                td +
                "<td>"+ allNum +"</td>" +
                "<td>"+ rapairNum +"</td>" +
                "</td><td>" + (rapairNum / allNum).toFixed(2) + "%</td></tr>");
                tr.appendTo(tbody);
            }


        }
    }

})();

