/**
 * Created by jianghaifeng on 2016/2/18.
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
    var o={
        init:function(){
            o.setDefaultValue();
            o.initTable();
            o.handler();
        },
        view:function(){


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
            /**
             * $(document).ready(function() {
                    $('#example').dataTable( {
                        "processing": true,
                        "serverSide": true,
                        "ajax": "../resources/server_processing_custom.php"
                    } );
                } );
             * @type {*|jQuery}
             */
            mysitesTable=$("#table_id").DataTable($.extend(_dataTable_setting._server(),{
                "processing": true,
                "serverSide": true,
                //"ajax": __ROOT__+'/Home/LogSearch/search_result',
                "ajax":{
                    url: __ROOT__+'/Home/LogSearch/search_result'
                    //type: "post",
                    //dataSrc: "items",
                    //data: function ( d ) {
                    //    var wraper=$(".location-wraper");
                    //    d.param = $.trim($('#extra').val());
                    //    d.contract_id = w.contract_id;
                    //}
                },
                columns: [
                    //{data: 'username',width:"15%" },
                    {data: 'severity',width: "80px"},
                    {data: 'name',width: "240px"},
                    {data: 'destHostName',width: "120px"},
                    {data: 'srcAddress',width: "120px"},
                    {data: 'srcPort',width: "80px"},
                    {data: 'destAddress',width: "120px"},
                    {data: 'destPort',width: "80px"},
                    {data: 'eventCount',width: "80px"},
                    {data: 'deviceName',width: "160px"},
                    {data: 'collectorReceiptTime',width: "120px"},
                    {data: '',width: "60px"}
                ],
                columnDefs:[
                    // {orderable:false,targets:[3,4,5]}
                ],
                //"fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                rowCallback:function( nRow, aData, index ){
                    var color = "gray";
                    var security = aData['severity'] ? aData['severity'] : 1;
                    if(security > 3 && security < 7){
                        color = "yellow";
                    } else if(security > 6) {
                        color = "red";
                    }
                    var severityState = $("<button type='button' class='btn " + color + " btn-sm' disabled='disabled' style='width: 80px;height: 20px;line-height:5px;background-color:" + color + "'>" + security + "</button>");
                    var editBtn=$('<a class="btn blue-stripe mini" href="' + __ROOT__ + '/Home/LogSearch/detail/rowkey/' + aData['rowkey'] + '" target="_blank">详情</a>');

                    $('td:eq(0)', nRow).html(severityState);
                    $('td:eq(1)', nRow).html(__makeData__.showInfo(aData['name'],18));
                    $('td:eq(8)', nRow).html(__makeData__.showInfo(aData['deviceName'],16));
                    $('td:eq(10)', nRow).html(editBtn);
                }
                //,
                //search:{value:1111,regex: filterParam}
                ,
                serverParams:function(aoData){//查询条件
                    filterParam = [];
                    __makeData__.setFilterParam();
                    $.merge(aoData,filterParam);
                }
            }));
        },
        handler:function(){
            var w=this;
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
            $(".search_list").live("click", function(){
                //__makeData__.setFilterParam();
                //mysitesTable.fnDraw(true);
                //"ajax": __ROOT__+'/Home/LogSearch/search_result',

                mysitesTable.draw();
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

        }
    };

    var __makeData__ = {
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
                    if(time == 0.1){ //最近十分钟
                        start = end - 600;
                    }
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
                        var date  = new Date(myDate.getFullYear(),myDate.getMonth(),1,0,0,0);
                        start = parseInt(date.getTime()/1000);
                    }
                    //console.info(start + "," + end);
                    return start + "," + end;
                }
            } else {//从wdate中获取
                var start = $("#start_date_id").val();
                var end = $("#end_date_id").val();
                var startDate = new Date(start.replaceAll('-','/'));
                var endDate = new Date(end.replaceAll('-','/'));
                start = parseInt(startDate.getTime() / 1000);
                end = parseInt(endDate.getTime() / 1000);
                //console.info(start + "," + end);
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
            var param = {};
            var key = $("#key_id").val().trim();
            //威胁等级
            var severity = __makeData__.getAllCheckedCheckBox();
            //日志源
            var isWaf = $('input[type="radio"][name="isWaf"]:checked').val();
            var ruelId = $("#ruelId_id").val();
            var srcAddress = $("#srcAddress_id").val();
            var srcPort = $("#srcPort_id").val();
            var destAddress = $("#destAddress_id").val();
            var destPort = $("#destPort_id").val();
            var time = __makeData__.getTime();
            var destHostName = $("#desthostName_id").val();


            param = {
                key:key,severityStr:severity,
                isWaf:isWaf,ruelId:ruelId,
                srcAddress:srcAddress,srcPort:srcPort,
                destAddress:destAddress,destPort:destPort,
                timeStr:time,destHostName:destHostName}
            filterParam.push(param);
        }
    }

    $(document).ready(function(){
        o.init();
    });

})();
