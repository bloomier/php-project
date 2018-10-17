/**
 *@name
 *@author Sean.xiang
 *@date 2015/9/18
 *@example
 */

(function(){
    var customerListTable;
    var filterParam=[];
    var nowData=[];
    var srcData = [];
    $(document).ready(function(){
        __init__.getData();
        __init__.showTable();
        __init__.addHandler();

    });

    var __init__={
        getData:function(){
            $.ajaxSetup({
                async:false
            });
            $.post(__ROOT__+'/API/CloudWaf/listTask').success(function(json){
                srcData = json['rows'];
                nowData=srcData;
            });
        },
        showTable:function(){
            customerListTable=$("#policy-group-table").dataTable($.extend(storm.defaultStaticGridSetting(),{
                "aaData":nowData,
                "iDisplayLength":5,
                "bDestroy":true,
                "aoColumns": [ //参数映射
                    {"mDataProp": 'ip'},
                    {"mDataProp": 'port'},
                    {"mDataProp": 'domain'},
                    {"mDataProp": 'rule'},
                    {"mDataProp": 'bypass'}
                ]
                //"fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                //    console.info("asd");
                //}
                //"fnServerParams":function(aoData){//查询条件
                //    $.merge(aoData,filterParam);
                //}
            }));
        },
        initSta: function () {
            $.post(__ROOT__+'/API/CloudWaf/listTask').success(function(json){
                srcData = json['rows'];
                nowData=srcData;
                var param = $("#searchD").val();
                if(param){
                    nowData=[];
                    $.each(srcData, function(point, item){
                        if(item['domain']==param || item['ip']==param){
                            nowData.push(item);
                        }
                    })

                }
                customerListTable=$("#policy-group-table").dataTable($.extend(storm.defaultStaticGridSetting(),{
                    //'bStateSave': true,
                    //"bServerSide" : true,
                    //"sAjaxSource":  __ROOT__+'/API/CloudWaf/listTask',//请求URL
                    "aaData":nowData,
                    "iDisplayLength":2,
                    "bRetrieve": true,
                    "bSearch": true,
                    "aoColumns": [ //参数映射
                        {"mDataProp": 'ip'},
                        {"mDataProp": 'port'},
                        {"mDataProp": 'domain'},
                        {"mDataProp": 'rule'},
                        {"mDataProp": 'bypass'}
                    ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                        console.info("asd");
                    }
                    //"fnServerParams":function(aoData){//查询条件
                    //    $.merge(aoData,filterParam);
                    //}
                }));
            });
        },
        initView:function(){
                customerListTable=$("#policy-group-table").dataTable($.extend(storm.defaultGridSetting(),{
                    //'bStateSave': true,
                    //"bServerSide" : true,
                    "sAjaxSource":  __ROOT__+'/API/CloudWaf/listTask',//请求URL
                    "aoColumns": [ //参数映射
                        {"mDataProp": 'ip'},
                        {"mDataProp": 'port'},
                        {"mDataProp": 'domain'},
                        {"mDataProp": 'rule'},
                        {"mDataProp": 'bypass'}
                    ],
                    "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                        console.info("asd")
                    }
                    //"fnServerParams":function(aoData){//查询条件
                    //    $.merge(aoData,filterParam);
                    //}
                }));
        },
        addHandler:function(){
            // 查询事件
            //$(".btn-search").bind("click",function(){
            //    var param=$(this).prev().val();
            //    param= $.trim(param);
            //    filterParam=[];
            //    if(param!=''){
            //        filterParam.push({name:"ip",value:param});
            //    }
            //    console.info("asd");
            //    customerListTable.fnPageChange(0);
            //    //customerListTable.fnDraw(false);
            //});
            // 查询事件
            $(".btn-search").bind("click",function(){
                //$("tbody",$("#policy-group-table")).find("tr").show();
                //var tds=$("tbody",$("#policy-group-table")).find("td");
                var param=$(this).prev().val();
                param= $.trim(param);
                //for(var i=0;i<tds.length;i++){
                //    if(tds[i].innerHTML==param){
                //        $("tbody",$("#policy-group-table")).find("tr").hide();
                //        $(tds[i]).parent("tr").show();
                //    }
                //}
                if(param){
                    nowData=[];
                    $.each(srcData,function(i,item){
                        if(item['ip'].indexOf(param)>=0 || item['domain'].toString().indexOf(param)>=0){
                            nowData.push(item);
                        }
                    })
                }else{
                    nowData=srcData;
                }
                $("#policy-group-table").dataTable().fnDestroy();
                //$("tbody",$("#policy-group-table")).html("");//也可
                __init__.showTable();
            });
        }
    };
})();


