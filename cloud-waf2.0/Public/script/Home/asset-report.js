/**
 * Created by jianghaifeng on 2016/3/18.
 */
(function(){
    var extraParams={};
   var nameMapper={
        os:"操作系统",
        thirdparty:"第三方组件",
        waf:"waf",
        framework:"框架",
        webapp:"cms",
        frontend:"前端框架",
        server:"web容器",
        component:"其他组件"

    }
    var visit_state_mapper={
        "1":"服务正常",
        "-1":"请求无响应",
        "-2":"资源找不到",
        "-3":"服务异常",
        "-4":"僵尸站点"
    }
    var app={
        init:function(){
            var event_mapper= $.parseJSON($("#event_type_name_mapper").text());
            app.event_name_mapper=event_mapper['event_type_name_mapper'];
            app.initView();
            app.initCensus();
            app.initHandler();
        },

        initView:function(){
            var w=this;
            w.searchLabels=$("#searchLabels").searchLabels({
                nameMapper:{
                    _id:"域名",
                    title:"标题",
                    ip:"ip",
                    "location[province]":"IP省份",
                    "location[city]":"IP城市",
                    "location[district]":"IP地县",
                    "admin_location[province]":"行政省份",
                    "admin_location[city]":"行政城市",
                    "admin_location[district]":"行政地县",
                    finger:"指纹",
                    "whois[registrant_name]":"注册人",
                    "whois[registrant_email]":"注册人邮箱",
                    "vuls[level]":"风险等级",
                    "param":"其他",
                    "security":"安全事件",
                    "survey[visit_state]":"服务质量"
                },
                deleteLabel:function(){
                    extraParams=this.getData();
                    app.initCensus();
                    w.table.draw(true);
                }
            });
            var initParam=$("#extParam").val();
            if(initParam!=''){
                extraParams= $.parseJSON(initParam.replaceAll("'",'"'));
                w.searchLabels.load(extraParams);
            }



            $("#location").citySelect({
                required:false,
                //nodata:"hidden",
                url:__ROOT__+"/Admin/Location/getLocationSelectorData"
            });

            $("#admin_location").citySelect({
                required:false,
                nodata:"hidden",
                url:__ROOT__+"/Admin/Location/getLocationSelectorData"
            });


            w.table=$("#report_table").DataTable($.extend(_dataTable_setting._server(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/AssetReport/listPage",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                         $.extend(d,extraParams);
                    }
                },
                searching:false,
                columns: [
                    { sDefaultContent: ''},
                    //{ data:'ip'},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''},
                    { sDefaultContent:''}
                    //{ data: ''}
                ],
                columnDefs:[

                ],
                rowCallback: function (row, data, index) {
                    // 标题
                    var title = data["_id"];
                    if(data["title"]){
                        title = data["title"];
                    }
                    if(title.length > 20){
                        title = title.substr(0, 20) + "...";
                    }
                    $('td:eq(0)', row).html('<a href="http://' + data["_id"] + '" target="_blank" title="' + data['_id'] + '">' + title + '</a>');
                    // ip归属&行政归属
                    var _location=data.location||{};
                    var _admin_location=data.admin_location||{};
                    $('td:eq(1)', row).html((_admin_location['province']||'')+(_admin_location['city']||'')+(_admin_location['district']||''));
                    // 服务质量
                    $('td:eq(2)', row).html(__function__.createVsistStateLabel(data));
                    // 漏洞
                    $('td:eq(3)', row).html(__function__.createVulsLevelLabel(data));
                    $('td:eq(4)', row).html(__function__.createVulsDetail(data));
                    // 指纹
                    if(data['finger']){
                        var finger = data['finger'];
                        if(finger['os']){
                            $('td:eq(5)', row).html(finger['os']);
                        }
                        if(finger['server']){
                            $('td:eq(6)', row).html(finger['server']);
                        }
                        if(finger['waf']){
                            $('td:eq(7)', row).html(finger['waf']);
                        }
                    }
                    // 安全事件
                    $('td:eq(8)', row).html(__function__.createSecurityInfo(data));
                    // 操作
                    var reportBtn = $('<a class="btn btn-primary btn-xs task-detail-btn" target="_blank" style="margin-left:10px"><i class="fa fa-file-text"></i>&nbsp;查看</a>');
                    reportBtn.attr("href", __WEBROOT__ + "/Home/AssetReport/report?id=" + BASE64.encoder(data["_id"]));
                    var exportBtn = $('<a class="btn btn-info btn-xs adjust-task-btn" target="_blank" style="margin-left:10px"><i class="fa fa-adjust"></i>&nbsp;导出</a>');
                    exportBtn.attr("href", __WEBROOT__ + "/Home/AssetReport/reportExport?id=" + BASE64.encoder(data["_id"]));
                    $('td:eq(9)', row).html("");
                    $('td:eq(9)', row).append(reportBtn).append(exportBtn);
                },
                drawCallback:function(json) {
                    w.lastJson=json.json;
                },
                initComplete:function(){

                }
                //,
                //dom:"<'row'<'col-sm-6 datatable-btn-warper'><'col-sm-6'>>" +
                //"<'row'<'col-sm-12'tr>>" +
                //
                //"<'dataTables-bottom'<'page'<'page-length'><'page-info'><'page-num'p>>>"
            }));

            var treeItems=function(ary,children,pid,location_type){
                $.each(children||{},function(point,data){
                    //var sKey="admin_location["+data.deep+"]";
                    var d=({
                        _id:pid+"_"+data.deep+":"+point,
                        title:point + '【' + data.count + '】',
                        pid:pid||0,
                        value:{

                        }
                    });

                    ary.push(d);
                    var tmp=d['_id'].substr(1).split("_");
                    $.each(tmp,function(i,t){
                        var tmp2= t.split(":");
                        if(tmp2.length==2){
                            d.value[location_type+'['+tmp2[0]+']']=tmp2[1];
                        }
                    });

                    treeItems(ary,data.children,d['_id'],location_type);
                    //}
                });
            }

            $.post(__WEBROOT__ + "/Home/AssetReport/assetGroup").success(function(json){
                var ary = [];
                if(json["children"]){
                    treeItems(ary,json["children"],"",json.location_type);

                }
                w.zTree= $.fn.zTree.init($("#ztree"), {
                    data:{
                        key:{
                            name:"title"
                        },
                        simpleData:{
                            enable:true,
                            idKey:"_id",
                            pIdKey:"pid"
                        }
                    },
                    callback:{
                        onClick: function(event, treeId, treeNode){
                            extraParams = treeNode.value;
                            w.searchLabels.load(extraParams);
                            w.initCensus();
                            w.table.draw(true);
                        }
                    }
                },ary);
            });
        },

        initHandler:function(){
            var w=this;
            var dialog=$("#dialog-export");

            $(".btn-search").bind("click",function(){
                extraParams={};
                if($.trim($("#extra").val())!=''){
                    extraParams['param']= $.trim($("#extra").val());
                }
                if($("#vulsLevelSelector").val()!=''){
                    extraParams['vuls[level]']=$("#vulsLevelSelector").val();
                }
                if($("#surveySelector").val()!=''){
                    extraParams['survey[visit_state]']=$("#surveySelector").val();
                }
                w.searchLabels.load(extraParams);
                w.initCensus();
                w.table.draw(true);
            });
            //$("#dialog-search-detail").modal("show");
            $(".btn-detail-search").bind("click",function(){
                storm.form.reset($("#detail_search_form"));
                $("#dialog-search-detail").modal("show");
            });

            $(".btn-detail-search-submit").bind("click",function(){

                extraParams=storm.form.simpleSerialize($("#detail_search_form"));
                if(extraParams['finger']){
                    extraParams['finger']= extraParams['finger'].toLowerCase();
                }
                w.searchLabels.load(extraParams);
                w.initCensus();
                w.table.draw(true);
                $("#dialog-search-detail").modal("hide");
            });
            $(".btn-export-excel").bind("click",function(){
                $(".opt-count",$("#dialog-export")).text(w.lastJson.recordsTotal);
                $(".step-select",dialog).show();
                $(".step-progress",dialog).hide();
                $(".btn-download",dialog).hide();
                if(w.downloadIns){
                    clearInterval(w.downloadIns);
                }
                $(".btn-export-submit").show();

                dialog.modal("show");
            });

            $(".btn-export-submit").bind("click",function(){
                var fileName= $.trim($("#fileName").val());
                var field=$("#select_fields").val();
                if(!fileName){
                    swal({   title: "请输入导出文件名称", type: "error",   confirmButtonText: "确定" });
                    return;

                }
                if(!field||field.length==0){
                    swal({   title: "请选择要导出的字段", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var _field={};
                $.each(field,function(i,f){
                    _field[f]=1;
                });
                var params= $.extend({field:_field,fileName:fileName},extraParams);
                //console.info(params);
                $.post(__ROOT__+"/Home/ExportTask/exportAssetReportBackGround",params).success(function(json){
                    $(".step-select",dialog).hide();
                    $(".step-progress",dialog).show();
                    var task_id=json.task_id;
                    if(json.code>0){
                        $(".btn-download",dialog).attr("href",__ROOT__+"/Home/ExportTask/download/_id/"+task_id);
                        $(".btn-export-submit").hide();
                        __function__.loadProgress(100,1);
                        w.downloadIns=setInterval(function(){
                            $.post(__ROOT__+"/Home/ExportTask/queryExportProgress",{_id:task_id}).success(function(json){
                                if(json.code>0){
                                    var data=json.data;
                                    var progress=json.data.progress;
                                    if(data.status==1){
                                        __function__.loadProgress(100,1);
                                    }else if(data.status==2){
                                        if(progress){
                                            __function__.loadProgress(progress.total,progress.current);
                                        }
                                    }else if(data.status==3){
                                        __function__.loadProgress(progress.total,progress.total);
                                        $(".btn-download",dialog).show();
                                        clearInterval(w.downloadIns);
                                    }
                                }else{
                                    clearInterval(w.downloadIns);
                                }
                            });

                        },2000);
                    }else{
                        swal({   title:json.msg, type: "error",   confirmButtonText: "确定" });
                    }

                });
            });
        },

        initCensus : function(){
            var w = this;
            $.post(__WEBROOT__ + "/Home/AssetReport/assetCensus", extraParams).success(function(json){
                if(json["count"]){
                    $(".website_count").html(json["count"] + "个");
                }else{
                    $(".website_count").html("-");
                }
                if(json["survey"]){
                    var survey = "";
                    survey ="<span style='color:#1ab394;'>"+ json["survey"]["yes"] + "</span> /<span class='text-danger'> " + json["survey"]["no"]+"</span>";
                    $(".website_survey").html(survey);
                }else{
                    $(".website_survey").html("-");
                }
                if(json["vuls"]){
                    var vuls = "";
                    vuls ="<span class='text-danger'>"+ json["vuls"]["high"] + "</span> /<span class='text-warning'> " + json["vuls"]["mid"]+"</span>";
                    $(".website_vuls").html(vuls);
                }else{
                    $(".website_vuls").html("-");
                }
                if(json["event"]){
                    $(".website_event").html(json["event"] + "件");
                }else{
                    $(".website_event").html("-");
                }
            });

        }
    }

    var __function__={
        createInfo:function(rowData){
            var info= {};
            info['title']=rowData['title']||rowData['_id'];
            info['_id']=rowData['_id'];
            info['ip']=rowData['ip'];
            var _admin_location=rowData.admin_location||{};
            var _location=rowData.location||{};

            info['admin_location']=(_admin_location['province']||'')+(_admin_location['city']||'')+(_admin_location['district']||'');
            info['location']=(_location['province']||'')+(_location['city']||'')+(_location['district']||'');
            if($.trim(info['admin_location'])){
                info['admin_location']+="  (行政归属)";
            }
            if($.trim(info['location'])){
                info['location']+="  (IP归属)";
            }
            if(rowData.vuls&&rowData.vuls.level_detail){
                var detail=rowData.vuls.level_detail;
                info['vuls_high']=detail.high||0;
            }
            if(rowData.security){
                var total=0;
                var types={};
                $.each(rowData.security,function(eventType,event){
                    var eventNum=storm.common.jsonSize(event);
                    total+=eventNum;
                    var eventName=app.event_name_mapper[eventType]||"未知";
                    types[eventName]=eventNum;

                });
                info['security_total']=total;
                if(total>0){
                    info['security_info']=",其中"
                    $.each(types,function(type,num){
                        info['security_info']+=type+num+"个,"
                    });
                    info['security_info']= info['security_info'].substr(0, info['security_info'].length-1);

                }

            }
            return info;

        },

        createFingers:function(rowData){
            var finger=rowData['finger'];
            var lables=[];
            $.each(finger,function(type,value){
                var name=nameMapper[type]||type;
                var _value=__function__.simpleValues(value," ");
                var lable=$('<label class="label label-default m-r-xs"><i class="fa fa-tag"></i> '+(name+':'+_value)+'</label>');
                lables.push(lable);
            });
            return lables;

        },

        simpleValues:function(json,split){
            if(!json){
                return '';
            }
            if(typeof json==='object'){
                var s="";
                $.each(json,function(k,v){
                    s+=(v+(split||" "));
                });
                return s;
            }else{
                return json;
            }

        },

        createVulsLevelLabel:function(rowData){
            var level='safe';
            if(rowData&&rowData.vuls&&rowData.vuls.level){
                level=rowData.vuls.level;
            }
            if(level=='high'){
                return $('<span class="label label-danger">高危风险</span>');
            }else if(level=='mid'){
                return $('<span class="label label-warning">中危风险</span>');
            }else if(level=='low'){
                return $('<span class="label label-success">低危风险</span>');
            }else if(level=='info'){
                return $('<span class="label label-default">信息</span>');
            }else{
                return $('<span class="label label-primary">安全</span>');
            }
        },

        createVsistStateLabel:function(rowData){
            var survey=rowData.survey;

            if(survey){
                if(survey.visit_state!=1){
                    var name=visit_state_mapper[survey.visit_state+""];
                    if(name){
                        return $('<span class="label label-danger">'+name+'</span>');
                    }
                }else{
                    return $('<span class="label label-primary">服务正常</span>');
                }

            }
            return "";
        },

        loadProgress:function(total,current,tip){
            var bar=$("#progress_bar");
            bar.css("width",current*100/total+"%");
            $(".num",bar).text((current*100/total).toFixed(0)+"%");
        },

        createVulsDetail: function(data){
            var vulsInfo = "";
            if(data["vuls"] && data.vuls["level_detail"]){
                var detail = data.vuls["level_detail"];
                var count = 0;
                if(detail["high"]){
                    count = count + detail["high"];
                }
                if(detail["mid"]){
                    count = count + detail["mid"];
                }
                if(detail["low"]){
                    count = count + detail["low"];
                }

                var vulsInfo = '<span>漏洞<b class="text-success info">' + count + '</b>个:';
                vulsInfo = vulsInfo + '高危<b class="text-danger info" name="vuls_high">' + (detail["high"] || 0) + '</b>个，';
                vulsInfo = vulsInfo + '中危<b class="text-warning info" name="vuls_mid">' + (detail["mid"] || 0) + '</b>个，';
                vulsInfo = vulsInfo + '低危<b class="text-success info" name="vuls_low">' + (detail["low"] || 0) + '</b>个</span>';
            }
            return vulsInfo;
        },

        createSecurityInfo : function(data){
            var total=0;
            if(data.security){
                var types={};
                $.each(data.security,function(eventType,event){
                    var eventNum=storm.common.jsonSize(event);
                    total+=eventNum;
                    var eventName=app.event_name_mapper[eventType]||"未知";
                    types[eventName]=eventNum;

                });
            }
            return total;
        }

    }
    $(document).ready(function(){
        app.init();
    });
})();
