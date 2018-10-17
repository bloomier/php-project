/**
 *@name
 *@author ancyshi
 *@date 2016/1/29
 *@version
 *@example
 */



(function(){

    $(document).ready(function(){
        var rowkey = $("#rowkey_id").val();
        console.info()
        __init__.getDataByRowkey(rowkey);
    });

    var __init__ = {
        getDataByRowkey: function(rowkey){
            var arr = [
                "startTime","endTime","collectorReceiptTime","deviceReceiptTime","rawEvent",
                "eventType","name","eventCount","severity","message",
                "srcGeoAddress","srcGeoCity","srcPort","srcAddress","destGeoAddress",
                "destPort","destAddress","deviceCat","catSignificance","catBehavior",
                "catTechnique","catObject","catOutcome","deviceName","deviceVersion",
                "deviceVendor","deviceAddress","deviceModel","deviceHostname"
            ];
            var param = {"rowkey":rowkey};
            $.post(__ROOT__ + "/Home/LogSearch/search_one", param).success(function(json){
                json = $.parseJSON(json);
                // console.info(json.other.name);
                var otherHtml = "";
                for(var key in json.other) {
                    //console.info("Key是:" + key);
                    //console.info("对应的值是:" + json.other[key]);
                    if(json.other[key] != ''){
                        if(arr.indexOf(key) == -1){//数组中不存在
                            otherHtml += "<div class='row'>" +
                            "<div class='col-md-offset-1 col-md-2'>" + key + "</div>" +
                            "<div class='col-md-8'>" + json.other[key] + "</div>" +
                            "</div>";

                        } else {
                            if(key != 'severity'){
                                var temp = json.other[key].replaceAll("<","&lt;").replaceAll(">","&gt;");
                                $("#"+ key + "_id").html(temp);
                            } else {
                                // 事件级别需要转换显示
                                var severity = json.other[key] ? json.other[key] : 1;
                                var color = "gray";
                                if(severity > 3 && severity < 7){
                                    color = "yellow";
                                } else if(severity > 6) {
                                    color = "red";
                                }

                                var severityState = $("<button type='button' class='btn " + color + " btn-sm' disabled='disabled' style='width: 80px;height: 20px;line-height:5px;background-color:" + color + "'>" + severity + "</button>");

                                $("#"+ key + "_id").html(severityState);
                            }

                        }
                    }

                }
                if(otherHtml == ""){
                    otherHtml = "其他字段均为空";
                }
                $("#append_id").html(otherHtml);
            });
        }
    };


})();

