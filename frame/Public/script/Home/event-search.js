/**
 * Created by jianghaifeng on 2016/4/15.
 */
(function(){

    var common_func = {
        date_timestamp : function(param){
            var date = new Date(param.replace(/-/g, "/"));
            return date.getTime();
        },
        init_param : function(){
            var param = {};
            if($("#param").val()){
                $.extend(param, {param:$("#param").val()});
            }
            if($("#start_time").val()){
                $.extend(param, {start_time:$("#start_time").val()})
            }
            if($("#end_time").val()){
                $.extend(param, {end_time:$("#end_time").val()})
            }
            if($("#province").val()){
                $.extend(param, {province:$("#province").val()})
            }
            if($("#city").val()){
                $.extend(param, {city:$("#city").val()})
            }
            if($("#district").val()){
                $.extend(param, {district:$("#district").val()})
            }
            if($("#event_status").val() && $("#event_status").val() != 0){
                $.extend(param, {event_status:$("#event_status").val()});
            }
            if($("#type").val() && $("#type").val() != '0'){
                $.extend(param, {type:$("#type").val()});
            }
            if($("#event_type").val() && $("#event_type").val() != '0'){
                $.extend(param, {event_type:$("#event_type").val()});
            }
            return param;
        },
        loadProgress:function(total,current,tip){
            var bar=$("#progress_bar");
            bar.css("width",current*100/total+"%");
            $(".num",bar).text((current*100/total).toFixed(0)+"%");
        },
        init_region:function(value, region_type){
            var param = common_func.init_param();
            if(region_type == "province"){
                $(".citys").citySelect({
                    url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                    prov:value,
                    city:null,
                    dist:null,
                    required:false,
                    nodata:"none"
                });
                $("#province").val(value);
            }
            if(region_type == "city"){
                $(".citys").citySelect({
                    url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                    prov:param["province"],
                    city:value,
                    dist:null,
                    required:false,
                    nodata:"none"
                });
                $("#city").val(value);
            }
            if(region_type == "district"){
                $(".citys").citySelect({
                    url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                    prov:param["province"],
                    city:param["city"],
                    dist:value,
                    required:false,
                    nodata:"none"
                });
                $("#city").val(value);
            }
        }
    }

    var EventSearch = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_func = init_func;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        policy : [],
        event_type: [],
        tmp_result:[],// 保存查询结果，导出excel时使用
        query_param:{},
        region_type:""
    }

    var init_view = {
        init : function(){
            $(".citys").citySelect({
                url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                required:false,
                nodata:"none"
            });
        },
        put_table_value : function(json){
            var w = this;
            var tbody = $(".result-event-tbody");
            tbody.html("");
            w.setting.tmp_result = [];
            var allCount = 0;

            console.info(json)
            if(json.length==0){
                tbody.html(" <td colspan='10' align='center'>暂无数据</td>");
            }else{
                $.each(json, function(point, item){
                    var tmpResult = {};
                    var vulsCount = 0;
                    var count = 0;
                    var tr = $("<tr></tr>");
                    var regionTd = $("<td>" + point + "</td>");
                    if(point != "" && point != "中国" && point != "null" && point != "未知" && point != "全国" && w.setting.region_type != "district"){
                        regionTd.html($("<a class='query_region'>" + point + "</a>"));
                    }
                    tr.append(regionTd);
                    tmpResult["区域"] = point;
                    var summery = {};
                    for(var i = 0; i < item.length; i++){
                        var tmp = item[i];
                        count += tmp["sum"];
                        if(tmp["type"] == 2){
                            vulsCount += tmp["sum"];
                        }else{
                            summery[tmp["event_type"]] = tmp["sum"];
                        }
                    }
                    $.each(w.setting.event_type['event_type_name_mapper'], function(point, item){
                        var td = $("<td>0</td>");
                        tmpResult[item] = 0;
                        if(summery[point]){
                            td.html(summery[point]);
                            tmpResult[item] = summery[point];
                        }
                        tr.append(td);
                    });
                    if(summery["7"]){
                        vulsCount += parseInt(summery["7"]);
                    }
                    tmpResult["漏洞"] = vulsCount;
                    tmpResult["总数"] = count;
                    w.setting.tmp_result.push(tmpResult);
                    tr.append($("<td>" + vulsCount + "</td>"));
                    tr.append($("<td>" + count + "</td>"));
                    var exportTd = $("<td></td>");
                    var exportBtn = $("<button class='btn btn-xs btn-primary mg-l-5'>导出</button>")
                    if(count == 0){
                        exportBtn.attr("disabled", true);
                    }else{
                        exportBtn.addClass("region_event_export_btn");
                    }
                    allCount += count;
                    exportBtn.attr("region", point).attr("count", count);
                    exportTd.append(exportBtn);
                    tr.append(exportTd);
                    tbody.append(tr);
                });
            }


            $(".export-info-btn").attr("query_count", allCount);
        }
    }

    var init_data = {
        init : function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/EventNotify/queryVidList",
                async: false,
                type: "get",
                success:function(json){
                    w.setting.policy = json;
                }
            });
            $.ajax({
                url:__WEBROOT__ + "/Home/EventNotify/queryEventType",
                async: false,
                type: "get",
                success:function(json){
                    w.setting.event_type = json;
                }
            });
        }
    }

    var init_bind = {
        btn_bind : function(){
            var w = this;
            w.dialog=$("#dialog-export");
            w.dialog.on('hidden.bs.modal', function(){
                $("#fileName").val("");
                $("#select_fields").val("");
                $(".btn-export-submit").show();
            });
            $("#type").bind("change", function(){
                var value = $(this).val();
                var wrapper = $("#event_type");
                wrapper.html("");
                if(value == 1 && w.setting.event_type['event_type_name_mapper']){
                    wrapper.append($('<option value="0">所有</option>'));
                    $.each(w.setting.event_type['event_type_name_mapper'], function(point, item){
                        wrapper.append($('<option value="' + point + '">' + item + '</option>'));
                    });
                }else if(value == 2 && w.setting.policy['items']){
                    wrapper.append($('<option value="0">所有</option>'));
                    $.each(w.setting.policy['items'], function(point, item){
                        wrapper.append($('<option value="' + item["_id"] + '">' + item["name"] + '</option>'));
                    });
                }
            });

            $(".search-btn").bind("click", function(){
                if($("#start_time").val() && $("#end_time").val()){
                    var start = common_func.date_timestamp($("#start_time").val());
                    var end = common_func.date_timestamp($("#end_time").val());
                    if((end - start) < 0){
                        swal({   title: "开始时间不能大于结束时间！", type: "error",   confirmButtonText: "确定" });
                        return false;
                    }
                }
                var param = common_func.init_param();
                w.init_func.init_region.call(w, param);
                $.ajax({
                    url:__WEBROOT__ + "/Home/EventSearch/query",
                    data:param,
                    async:false,
                    method:"post",
                    success:function(json){
                        if(json["items"]){
                            w.init_view.put_table_value.call(w, json['items']);
                        }
                    }
                });
            });

            /**
             * 数据下钻
             */
            $(".result-event-table").on("click", ".query_region", function(){
                var value = $(this).html();
                common_func.init_region(value, w.setting.region_type);
                $(".search-btn").trigger("click");
                return false;
            });

            /**
             * 导出统计数据
             */
            $(".export-btn").bind("click", function(){
                var title = ["区域", "黑页", "暗链", "反共", "其他", "博彩", "色情", "漏洞", "总数"];
                if(w.setting.tmp_result.length>0){
                    $.ajax({
                        url:__WEBROOT__  + "/Home/EventSearch/exportExcel",
                        method:"post",
                        data:{items: w.setting.tmp_result, title:title},
                        aysnc:false,
                        success:function(json){
                            if(json['code']){
                                var url = __WEBROOT__ + "/Home/ExportTask/download/_id/" + json['task_id'];
                                window.location = url;
                            }else{
                                swal({   title: "文件生成失败！", type: "error",   confirmButtonText: "确定" });
                            }
                        }
                    });
                }else{
                    swal({   title: "数据为空，无法导出！", type: "error",   confirmButtonText: "确定" });
                }
            });

            /**
             * 导出详细
              */
            $(".export-info-btn").bind("click", function(){
                var count = parseInt($(this).attr("query_count"));
                if(count > 0){
                    w.setting.query_param = {};
                    w.setting.query_param = common_func.init_param();
                    w.init_func.init_modal.call(w,count);
                }else{
                    swal({   title: "数据为空，无法导出！", type: "error",   confirmButtonText: "确定" });
                }
            });

            /**
             * 导出区域详细信息
             */
            $(".result-event-table").on("click", ".region_event_export_btn", function(){
                var region = $(this).attr("region");
                var count = $(this).attr("count");
                if(count > 0){
                    w.setting.query_param = {};
                    w.setting.query_param = common_func.init_param();
                    if(w.setting.region_type == "province"){
                        w.setting.query_param["province"] = region;
                    }
                    if(w.setting.region_type == "city"){
                        w.setting.query_param["city"] = region;
                    }
                    if(w.setting.region_type == "district"){
                        w.setting.query_param["district"] = region;
                    }
                    w.init_func.init_modal.call(w,count);
                }else{
                    swal({   title: "数据为空，无法导出！", type: "error",   confirmButtonText: "确定" });
                }
            });

            $("#dialog-export").on("click", ".btn-export-submit",function(){
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
                var params= $.extend({field:_field,fileName:fileName}, w.setting.query_param);
                $.post(__ROOT__+"/Home/ExportTask/exportEventBackGroud",params).success(function(json){
                    $(".step-select", w.dialog).hide();
                    $(".step-progress",w.dialog).show();
                    var task_id=json["task_id"];
                    if(json.code>0){
                        $(".btn-download",w.dialog).attr("href",__ROOT__+"/Home/ExportTask/download/_id/"+task_id);
                        $(".btn-export-submit").hide();
                        common_func.loadProgress(100,1);
                        w.downloadIns=setInterval(function(){
                            $.post(__ROOT__+"/Home/ExportTask/queryExportProgress",{_id:task_id}).success(function(json){
                                if(json.code>0){
                                    var data=json.data;
                                    var progress=json.data.progress;
                                    if(data.status==1){
                                        common_func.loadProgress(100,1);
                                    }else if(data.status==2){
                                        if(progress){
                                            common_func.loadProgress(progress.total,progress.current);
                                        }
                                    }else if(data.status==3){
                                        common_func.loadProgress(progress.total,progress.total);
                                        $(".btn-download",w.dialog).show();
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

        }
    }

    var init_func = {
        init_region : function(param){
            var w = this;
            if(!param["district"]){
                w.setting.region_type = "district";
            }
            if(!param["city"]){
                w.setting.region_type = "city";
            }
            if(!param["province"]){
                w.setting.region_type = "province";
            }
        },
        init_modal:function(count){
            var w = this;
            var wrapper = $("#dialog-export");
            $(".opt-count",wrapper).text(count);
            $(".step-select",wrapper).show();
            $(".step-progress",wrapper).hide();
            $(".btn-download",wrapper).hide();
            if(w.downloadIns){
                clearInterval(w.downloadIns);
            }
            w.dialog.modal("show");
        }
    }

    var init = function(){
        var w = this;
        w.init_data.init.call(w);
        w.init_bind.btn_bind.call(w);
        w.init_view.init.call(w);
        $(".search-btn").trigger("click");
    }

    $(document).ready(function(){
        var eventSearch = new EventSearch();
        eventSearch.init.call(eventSearch);
    });
})();