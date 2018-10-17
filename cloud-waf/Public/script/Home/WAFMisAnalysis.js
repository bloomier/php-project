var GovWeb = {
    init:function(){
        var w = this;
        w.init_table();
        w.addHandler();
    },
    init_table:function(){
        var w = this;
        w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
            ajax:{
                url: __WEBROOT__ + "/Home/WAFMisAnalysis/selPolicy",
                type:"post",
                dataSrc:"items",
                data: function () {
                    var date1 = new Date();
                    date1.setMinutes(date1.getMinutes()-10);
                    var startTime = date1.getTime();
                    var date2 = new Date();
                    var endTime = date2.getTime();
                    glovalObj.startTime=__Function__.dateFmt(date1);
                    glovalObj.endTime=__Function__.dateFmt(date2);
                    return {'start':parseInt(startTime/1000),'end':parseInt(endTime/1000)};
                }
            },
            columns: [
                { data: '', sWidth: '3%' },
                { data: 'policyId', sWidth: '10%' },
                { data: 'name', sWidth: '10%' },
                { data: 'policyDesc', sWidth: '25%' },
                { data: 'ipCounter', sWidth: '5%' },
                { data: 'siteCounter', sWidth: '5%' },
                { data: 'allCounter', sWidth: '5%' },
                { data: '', sWidth: '10%' }
            ],
            //columnDefs:[
            //    {orderable:false,targets:[0, 9]}
            //],
            //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
            "order": [[ 4, "desc" ]],
            //"createdRow": function ( row, data, index ) {
            //    //console.info(row);
            //    if($(this).hasClass('selected')){
            //       console.info("ddddd");
            //    }
            //},
            rowCallback:function( row, data, index ){
                $('td:eq(0)', row).html("<input type='checkbox' value='"+data['id']+"'>");
                if(data['policyDesc']){
                    var desc = data['policyDesc'].length<=50?data['policyDesc']:data['policyDesc'].substr(0,50)+"...";
                }
                $('td:eq(3)',row).html(desc);

                var btnDisPost = $('<a href="javascript:void(0)" title="处理"><i class="fa fa-cogs"></i>处理</a>');
                btnDisPost.bind("click",function(){
                    var param = [];
                    $.each(data,function(k,v){
                        var paramStr = k+"="+v;
                        param.push(paramStr);
                    });
                    location.href=__ROOT__+"/Home/WAFMisAnalysis/getDetail?startTime="+glovalObj.startTime+"&endTime="+glovalObj.endTime+"&"+param.join("&");
                });
                $('td:eq(7)',row).html(btnDisPost);
            },
            initComplete:function(){
                    var wdateDiv = '<div id="wdateDiv" style="display: none"> <label>时间范围:</label> ' +
                        '<input class="WdateMax" type="text" id="startTime" /> ' +
                        '<label>至</label> <input class="WdateMax" type="text" id="endTime" />' +
                        '<button id="selectTime">确定</button> <button id="goBack">返回</button></div>';
                    $(".datatable-btn-warper").append(wdateDiv);

                    $("#startTime").click(function(){
                        WdatePicker({maxDate:"#F{$dp.$D('endTime') || '%y-%M-%d %H:%m'}",dateFmt:"yyyy-MM-dd HH:mm"});
                    });
                    $("#endTime").click(function(){
                        WdatePicker({maxDate:"%y-%M-%d %H:%m",minDate:"#F{$dp.$D('startTime')}",dateFmt:"yyyy-MM-dd HH:mm"});
                    });
                    var selTime = '<div id="sel_time"><select><option value=10>最近10分钟</option>' +
                    '<option value=30>最近30分钟</option><option value=60>最近1小时</option><option value=240>最近4小时</option>' +
                    '<option value=1440>最近24小时</option><option value=4320>最近3天</option>' +
                    '<option value="user-defined">自定义</option></select></div>';

                    $(".datatable-btn-warper").append(selTime);

                $("select",$(".datatable-btn-warper")).select2();
                    $("select",$("#sel_time")).bind("change",function(){
                        var selTime =  $("select",$("#sel_time")).val();
                        var param = {};
                        if(selTime == "user-defined"){
                            $("#sel_time").hide();
                            $("#wdateDiv").show();
                        }else{
                            var date1 = new Date();
                            date1.setMinutes(date1.getMinutes()-selTime);
                            var startTime = date1.getTime();
                            var date2 = new Date();
                            var endTime = date2.getTime();
                            glovalObj.startTime=__Function__.dateFmt(date1);
                            glovalObj.endTime=__Function__.dateFmt(date2);
                            param['start'] = parseInt(startTime/1000);
                            param['end'] = parseInt(endTime/1000);
                            $.post(__WEBROOT__+ "/Home/WAFMisAnalysis/selPolicy",param).success(function(json){
                                w.table.clear();
                                $.each(json,function(point,item){
                                    w.table.rows.add(item);
                                });
                                w.table.draw();

                            });
                        }
                    });
            }
        }));

        //$('#waf_site_table_filter input').attr('placeholder','请输入域名|名称|IP');
    },
    addHandler:function(){
        var w = this;
        $("#selectTime").live("click",function(){
            var startTime = ($("#startTime").val()).replaceAll("-","/");
            var endTime = ($("#endTime").val()).replaceAll("-","/");
            glovalObj.startTime=startTime;
            glovalObj.endTime=endTime;
            var startTimeL = new Date(startTime);
            var endTimeL = new Date(endTime);
            var param = {};
            param['start'] = parseInt(startTimeL.getTime()/1000);
            param['end'] = parseInt(endTimeL.getTime()/1000);
            $.post(__WEBROOT__+ "/Home/WAFMisAnalysis/selPolicy",param).success(function(json){
                w.table.clear();
                $.each(json,function(point,item){
                    w.table.rows.add(item);
                });
                w.table.draw();

            });

        });

        $("#goBack").live("click",function(){
            $("#wdateDiv").hide();
            $("#sel_time").show();
            $("select",$("#sel_time")).select2("val",10);
        });
    }
};
var __Function__={
    dateFmt:function(date){
        var year = date.getFullYear();
        var month = (date.getMonth()+1)<10?"0"+(date.getMonth()+1):date.getMonth()+1;
        var day = date.getDate()<10?"0"+date.getDate():date.getDate();
        var hour = date.getHours()<10?"0"+date.getHours():date.getHours();
        var minute = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
        return year+"-"+month+"-"+day+" "+hour+":"+minute;

    }
}
var glovalObj={
    startTime:0,
    endTime:0
}
$(function(){
    GovWeb.init();
});