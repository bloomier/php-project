/**
 *@name
 *@author ancyshi
 *@date 2016/1/28
 *@version
 *@example
 */

//当前选中的是默认时间还是选择的自定义时间，默认时间：true，否则false
var defaultOrcustomTime = true;

function displayDiv(showId,hideId){
    if(showId == "default_time_id"){
        defaultOrcustomTime = true;
    } else {
        defaultOrcustomTime = false;
    }
    $("#" + showId).show();
    $("#" + hideId).hide();
}

(function(){

    var filterParam = [];
    var mysitesTable;

    $(document).ready(function(){
        __init__.setDefaultValue();
        __init__.initTable();
        __init__.addHandler();
    });

    var __init__={
        addHandler: function(){
            $("#low_id").live("click", function(){
                if($(this).attr("checked") == "checked"){//$(this).checked){
                    __makeData__.checkAllCheckBox("low",true);
                } else{
                    __makeData__.checkAllCheckBox("low",false);
                }
            });
            $("#mid_id").live("click", function(){
                if($(this).attr("checked") == "checked"){//$(this).checked){
                    __makeData__.checkAllCheckBox("mid",true);
                } else{
                    __makeData__.checkAllCheckBox("mid",false);
                }
            });
            $("#high_id").live("click", function(){
                if($(this).attr("checked") == "checked"){//$(this).checked){
                    __makeData__.checkAllCheckBox("high",true);
                } else{
                    __makeData__.checkAllCheckBox("high",false);
                }
            });

            //查询
            $(".save_setup").live("click", function(){
                __makeData__.setFilterParam();
                mysitesTable.fnDraw(true);
            });

            //清空查询条件
            $(".clear_up").live("click", function(){
                var form = $("#form_id");
                $("input:not(input[name='time'])",form).val("");
                $('input[type="checkbox"]').each(
                    function() {
                        $(this).attr("checked",false);
                    }
                );
                $("input:radio[name='time']").attr("checked",false);
                $("input:radio[name='time'][data-par='0']").attr("checked",true);
                $("#deviceName_id").select2("val","");
            });

        },
        setDefaultValue : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var hour = myDate.getHours();
            var minites = myDate.getMinutes();
            var second = myDate.getSeconds();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            if(hour < 10){
                hour = '0' + hour;
            }
            if(minites < 10){
                minites = '0' + minites;
            }
            if(second < 10){
                second = '0' + second;
            }
            var happen_time = '' + fullYear + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second;
            $("#start_date_id").val(happen_time);
            $("#end_date_id").val(happen_time);
        },
        initTable: function(){
            mysitesTable=$("#table_id").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__ + '/OptCenter/BigdataLog/search_result',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'severity',"sWidth": "80px"},
                    {"mDataProp": 'name',"sWidth": "240px"},
                    {"mDataProp": '',"sWidth": "80px"},
                    {"mDataProp": 'srcAddress',"sWidth": "120px"},
                    {"mDataProp": 'srcPort',"sWidth": "80px"},
                    {"mDataProp": 'destAddress',"sWidth": "120px"},
                    {"mDataProp": 'destPort',"sWidth": "80px"},
                    {"mDataProp": 'eventCount',"sWidth": "80px"},
                    {"mDataProp": 'deviceName',"sWidth": "160px"},
                    {"mDataProp": 'collectorReceiptTime',"sWidth": "120px"},
                    {"mDataProp": '',"sWidth": "60px"}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var color = "gray";
                    if(aData['severity'] > 3 && aData['severity'] < 7){
                        color = "yellow";
                    } else if(aData['severity'] > 6) {
                        color = "red";
                    }
                    var severityState = $("<button type='button' class='btn " + color + " btn-sm' disabled='disabled' style='width: 80px;height: 20px;line-height:5px;'>" + aData['severity'] + "</button>");
                    var editBtn=$('<a class="btn blue-stripe mini" href="' + __ROOT__ + '/OptCenter/BigdataLog/detail/rowkey/' + aData['rowkey'] + '" target="_blank">详情</a>');

                    $('td:eq(0)', nRow).html(severityState);
                    $('td:eq(1)', nRow).html(__makeData__.showInfo(aData['name'],12));
                    $('td:eq(8)', nRow).html(__makeData__.showInfo(aData['deviceName'],12));
                    $('td:eq(10)', nRow).html(editBtn);
                },
                "fnServerParams":function(aoData){//查询条件
                    filterParam = [];
                    __makeData__.setFilterParam();
                    $.merge(aoData,filterParam);
                }
            }));
        }
    };


    var __makeData__ = {
        getRootPath: function(){
            var curPath=window.document.location.href;
            var pathName=window.document.location.pathname;
            var pos=curPath.indexOf(pathName);
            var localhostPath=curPath.substring(0,pos);
            var projectName = pathName.substring(0,pathName.substr(1).indexOf('/')+1);
            return(localhostPath + projectName);
        },
        //选中或者取消name为name的checkbox，flag = true 选中，否则取消选中
        checkAllCheckBox: function(name,flag){
            $('input[type="checkbox"][name="' + name +'"]').each(
                function() {
                    if(flag){
                        $(this).attr("checked","checked");
                    } else {
                        $(this).attr("checked",false);
                    }
                }
            );
        },
        getAllCheckedCheckBox: function(){
            var a = [];
            $('input[type="checkbox"]:checked').each(
                function() {
                    if($(this).val() != ''){
                        a.push($(this).val());
                    }
                }
            );
            return a.join();
        },
        getAllSelectedRadio: function(){
            console.info($('input[type="radio"][name="time"]:checked').val() + "---time");
            return $('input[type="radio"][name="time"]:checked').val();
        },
        getWdateTime: function(){
            var start = $("#start_date_id").val();
            var end = $("#end_date_id").val();
        },
        getTime: function(){
            if(defaultOrcustomTime){//从radio中获取
                var time = this.getAllSelectedRadio();
                if(time > 0){
                    var end = new Date().getTime();
                    end = parseInt(end / 1000);
                    var start = end - time * 3600;
                    return start + "," + end;
                }else {
                    var myDate = new Date();
                    var end = myDate.getTime();
                    end = parseInt(end / 1000);
                    var start = 0;
                    var day = myDate.getDate();
                    var hour = myDate.getHours();
                    var minites = myDate.getMinutes();
                    var second = myDate.getSeconds();
                    if(time == -1){//当日
                        start = end * 1 - hour * 3600 - minites * 60  - second ;
                    }else {//当月
                        start = end * 1 - day * 24 * 3600 - hour * 3600 - minites * 60 - second;
                    }
                    console.info(start + "," + end);
                    return start + "," + end;
                }
            } else {//从wdate中获取

                var start = $("#start_date_id").val();
                var end = $("#end_date_id").val();
                var startDate = new Date(start);
                var endDate = new Date(end);
                start = parseInt(startDate.getTime() / 1000);
                end = parseInt(endDate.getTime() / 1000);
                return start + "," + end;
            }
        },
        showInfo: function (data, length){
            data = data ? data : "";
            if(data.length > length){
                return $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + data + "'>" + data.substr(0,length) + "...</span>");
            }else{
                return $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + data + "'>" + data + "</span>");
            }
        },
        setFilterParam: function(){
            var key = $("#key_id").val().trim();
            //威胁等级
            var severity = __makeData__.getAllCheckedCheckBox();
            //日志源
            var deviceName = $("#deviceName_id").val().trim();

            var srcAddress = $("#srcAddress_id").val();
            var srcPort = $("#srcPort_id").val();
            var destAddress = $("#destAddress_id").val();
            var destPort = $("#destPort_id").val();
            var time = __makeData__.getTime();

            filterParam.push({name:"key",value:key});
            filterParam.push({name:"severityStr",value:severity});
            filterParam.push({name:"deviceId",value:deviceName});
            filterParam.push({name:"srcAddress",value:srcAddress});
            filterParam.push({name:"srcPort",value:srcPort});
            filterParam.push({name:"destAddress",value:destAddress});
            filterParam.push({name:"destPort",value:destPort});
            filterParam.push({name:"timeStr",value:time});
        }
    }

})();







