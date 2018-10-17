/**
 * Created by jianghaifeng on 2016/3/22.
 */
(function(){

    var common_func = {
        init_location : function(rowData){
            var location = "";
            var province = rowData["province"];
            var city = rowData["city"];
            var district = rowData["district"];
            if(province){
                location = province[0] + " ";
            }
            if(city){
                location += city[0] + " ";
            }
            if(district){
                location += district[0];
            }
            return location;
        },
        get_event_name : function(id, list){
            var name = "";
            if(list["event_type_name_mapper"]){
                name = list["event_type_name_mapper"][id];
            }else{
                $.each(list, function(point, item){
                    if(item["_id"] == id){
                        name = item["name"];
                    }
                });
            }
            return name;
        },
        init_event_type:function(list){
            var result = {};
            var event_count = {};
            var vuls_count = {};
            var event = 0;
            var vuls = 0;
            $.each(list, function(point, item){
                var eventType = item['event_type'];
                var type = item["type"];
                if(type == 1){
                    event += 1;
                    var count = 1;
                    if(event_count[eventType]){
                        count += event_count[eventType];
                    }
                    event_count[eventType] = count;
                }else{
                    vuls += 1;
                    var count = 1;
                    if(vuls_count[eventType]){
                        count += vuls_count[eventType];
                    }
                    vuls_count[eventType] = count;
                }
            });
            if(event){
                result["event_count"] = event_count;
            }
            if(vuls){
                result["vuls_count"] = vuls_count;
            }
            return result;
        },
        init_type_wrapper : function(list, type_name, type_list, type){
            if(list.length == 0){
                return "";
            }
            var eventWrapper = $("#table-event-detail-item").clone().removeAttr("id").show();
            $(".item-title", eventWrapper).html(type_name);
            $.each(list, function(point, item){
                var name = common_func.get_event_name(point, type_list);
                var eventItem = $("#table-event-detail-item-type").clone().removeAttr("id").show();
                $(".views-number-href", eventItem).attr("etype", type).attr("event_type", point).html(item);
                $(".type-name", eventItem).html(name);
                $(".item-info", eventWrapper).append(eventItem);
            });
            return eventWrapper;
        },
        push_select2_value:function(list, obj, id, name){
            obj.html("");
            if(!list || list.length == 0){
                obj.select2({
                    tags:true,
                    allowClear: true
                });
                return;
            }
            $.each(list, function(p, v){
                var option = $("<option value='" + v[id] + "' selected='selected'>" + v[name] + "</option>");
                obj.append(option);
            });
            obj.select2({
                tags:true,
                allowClear: true
            });
        },
        get_notify_group:function(param){
            var list = [];
            $.ajax({
                url:__WEBROOT__ + "/Home/NotifyGroup/listAll",
                data:param,
                async:false,
                method:"post",
                success:function(json){
                    $.each(json, function(point, item){
                        list.push(item);
                    });
                }
            });
            return list;
        }
    }

    var EventNotify = function(){
        this.init_view = init_view;
        this.init_bind = init_bind;
        this.init_data = init_data;
        this.init_func = init_func;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        policy:[],// 漏洞数据
        event_type:[],// 事件类型
        domain_event:[],// 当前审核的事件
        notice_event:[],// 审核完成的事件
        point:0,// 当前事件审核进度
        innerRegion:[],// 主域
        default_img:"security/2015-16-07/1437038593.png",
        img_server:"",
        domain:"",
        type:0
    }

    var init = function(){
        var w = this;
        w.init_data.init.call(w);
        w.setting.img_server = $("#img_server").val() + "/upload/";
        w.eventModal = $("#event-notice-modal");
        w.init_view.init_table.call(w);
        w.init_bind.bind_btn.call(w);
    }

    var init_view = {

        init_table : function() {
            var w = this;
            w.table = $(".event-table").DataTable($.extend(_dataTable_setting._server(), {
                ajax: {
                    url: __WEBROOT__ + "/Home/EventNotify/listEventPage",
                    type: "post",
                    data: function (d) {
                        d["param"] = $("input[name='event-param']").val();
                    },
                    dataSrc: "items"
                },
                searching: false,
                columns: [
                    {data: '_id'},
                    {data: 'title'},
                    {data: 'ip'},
                    {sDefaultContent: ''},
                    {data: 'sum'},
                    {sDefaultContent: ''}
                ],
                rowCallback: function (row, data, index) {
                    $('td:eq(3)', row).html(common_func.init_location(data));
                    var infoBtn = $('<button class="btn btn-primary btn-xs event-notice-btn" style="margin-left:10px"><i class="fa fa-file-text"></i>&nbsp;通告</button>');
                    $('td:eq(5)', row).html("").append(infoBtn);
                }
            }));
        },

        init_modal_btn : function(){
            var w = this;
            var prev = $(".prev", w.eventModal);
            var next = $(".next", w.eventModal);
            prev.hide();
            next.hide();
            if(w.setting.point > 0){
                prev.show();
            }
            if((w.setting.point+1) < w.setting.domain_event.length){
                next.show();
            }
            $(".send-notice", w.eventModal).hide();
            $(".notice", w.eventModal).show();
        },

        init_modal:function(){
            var w = this;
            w.init_view.init_modal_btn.call(w);
            var wrapper = w.eventModal;
            var tmp = w.setting.domain_event[w.setting.point];
            $.each(tmp, function(point, item){
                if(point == "url"){
                    $(".event_" + point, wrapper).val("").val(item);
                    if(item.length > 30){
                        item = item.substr(0, 30) + "...";
                    }
                    $(".event_" + point, wrapper).html("").html(item);
                }else{
                    $(".event_" + point, wrapper).val("").val(item);
                    $(".event_" + point, wrapper).html("").html(item);
                }
            });

            $(".citys", wrapper).citySelect({
                url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                prov:tmp['province'],
                city:tmp['city'],
                dist:tmp['district'],
                nodata:"none"
            });

            if(tmp["snapshot"]){
                $(".event-pic").attr("src", w.setting.img_server + tmp["snapshot"]);
            }else{
                $(".event-pic").attr("src", w.setting.img_server + w.setting.default_img);
            }

            var typeSelect = $("#model_event_type");
            typeSelect.html("").attr("disabled", true);
            if(tmp["type"] == 1){
                $(".event_tpye", wrapper).html("安全事件");
                $.each(w.setting.event_type["event_type_name_mapper"], function(point, item){
                    var option = $('<option value="' + point + '">' + item + '</option>');
                    typeSelect.append(option);
                });
                typeSelect.val(tmp["event_type"]);
                typeSelect.attr("disabled", false);
            }else{
                $(".event_tpye", wrapper).html("网站漏洞");
                $.each(w.setting.policy, function(point, item){
                    var option = $('<option value="' + item["_id"] + '">' + item["name"] + '</option>');
                    typeSelect.append(option);
                });
                typeSelect.val(tmp["event_type"]);
            }
            $(".event_num", wrapper).html((w.setting.point + 1) + " : " + w.setting.domain_event.length);
        },

        init_event_content : function(target){
            var w = this;
            $(".event-detail-content", $(".event-table")).closest("tr").remove();
            var tr = $("<tr></tr>");
            var td = $("<td colspan='6'></td>");
            td.appendTo(tr);
            var wrapper = $("#table-event-detail").clone().removeAttr("id").show();
            var row= w.table.row(target);
            var list = common_func.init_event_type(row.data()["type"]);
            if(list["event_count"]){
                wrapper.append(common_func.init_type_wrapper(list["event_count"], "事件", w.setting.event_type, 1));
            }
            if(list["vuls_count"]){
                wrapper.append(common_func.init_type_wrapper(list["vuls_count"], "漏洞", w.setting.policy, 2));
            }
            td.append(wrapper);
            target.after(tr);
        }
    }

    var init_bind = {
        bind_btn : function(){
            var w = this;
            // 修改图片事件按钮
            $(w.eventModal).on("click","#a_id",function(){
                $("#file").trigger("click");
            });
            // 图片上传
            $("#event-notice-modal").on("change", "#file", function(){
                var value = $("#file").val();
                if(value){
                    $.ajaxFileUpload({
                        url: __WEBROOT__ + "/Home/EventNotify/uploadImg",
                        type: "post",
                        secureuri: false,
                        fileElementId: "file",
                        data:{type: 'security'},
                        dataType: 'json', //返回值类型 一般设置为json
                        success:function(json){
                            $(".event_snapshot", w.eventModal).val(json["result"]);
                            $(".event-pic", w.eventModal).attr("src", json["path"]);
                        }
                    });
                }
            });

            // 关闭事件
            w.eventModal.on("hidden.bs.modal", function(){
                w.setting.point = 0;
                w.setting.notice_event = [];
                w.setting.type = 0;
                $(".model_content_div", w.eventModal).show();
                $(".model_notice_div", w.eventModal).hide();
                $(".send-notice", w.eventModal).attr("disabled", false);
                $("#notify-group").html("");
            });

            // 事件查询
            $(".event-param-search-btn").bind("click", function(){
                w.table.draw();
            });

            // 省市县变化
            $(".model_notice_div").on("change", ".notice-location", function(){
                if(w.setting.type){
                    var param = [];
                    var province = $(".notice-province").val();
                    var city = $(".notice-city").val();
                    var district = $(".notice-target").val();
                    if(province){
                        param["province"] = province;
                    }
                    if(province){
                        param["city"] = city;
                    }
                    if(district){
                        param["district"] = district;
                    }
                    var location = common_func.get_notify_group(param);
                    common_func.push_select2_value(location, $("#notify-group") , "_id", "name");
                }
            });

            // 事件添加
            $(".add-event-btn").attr("href", __WEBROOT__ + "/Home/EventNotify/addPage");

            // 事件推送
            $(".event-table").on("click", ".event-notice-btn", function(){
                var target = $(this).closest("tr");
                var nextContent = $(".event-detail-content", target.next("tr"));
                if(nextContent.html()){
                    $(".event-detail-content", $(".event-table")).closest("tr").remove();
                    w.setting.domain = "";
                    return;
                }
                var row= w.table.row(target);
                w.setting.domain = row.data()["_id"];
                w.init_view.init_event_content.call(w, target);
            });

            $(".event-table").on("click", ".views-number-href", function(){
                var target = $(this);
                var type = target.attr("etype");
                var event_type = target.attr("event_type");
                $.post(__WEBROOT__ + "/Home/EventNotify/queryDomain", {domain: w.setting.domain, type:type, event_type:event_type}).success(function(json){
                    w.setting.domain_event = json;
                    if(w.setting.domain_event.length == 0){
                        swal({   title: "无待审核事件。",  type: "error",   confirmButtonText: "确定" });
                    }else{
                        w.setting.point == 0;
                        w.init_view.init_modal.call(w);
                        w.eventModal.modal("show");
                    }
                });
            });


            $(".modal-footer").on("click", ".prev", function(){
                $(".model_content_div", w.eventModal).show();
                $(".model_notice_div", w.eventModal).hide();
                w.setting.point--;
                w.init_func.pop_notice.call(w);
                w.init_view.init_modal.call(w);
            });

            $(".modal-footer").on("click", ".next", function(){
                $(".model_content_div", w.eventModal).show();
                $(".model_notice_div", w.eventModal).hide();
                w.setting.point++;
                w.init_func.push_notice.call(w);
                w.init_view.init_modal.call(w);
            });

            $(".modal-footer").on("click", ".notice", function(){
                w.init_func.push_notice.call(w);
                var flag = false;
                $(".notice-citys").citySelect({
                    url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                    prov: w.setting.domain_event[0]['province'],
                    city:w.setting.domain_event[0]['city'],
                    dist:w.setting.domain_event[0]['district'],
                    nodata:"none"
                });

                var tmpEvent = w.setting.domain_event[0];
                w.setting.type = 1;
                var param = [];
                if(tmpEvent["province"]){
                    param["province"] = tmpEvent["province"];
                }
                if(tmpEvent["city"]){
                    param["city"] = tmpEvent["city"];
                }
                if(tmpEvent["district"]){
                    param["district"] = tmpEvent["district"];
                }
                var location = common_func.get_notify_group(param);
                common_func.push_select2_value(location, $("#notify-group") , "_id", "name");
                $(".model_content_div", w.eventModal).hide();
                $(".model_notice_div", w.eventModal).show();
                var notice = 0;
                var unNotice = 0;
                var errorNotice = 0;
                $.each(w.setting.notice_event, function(point, item){
                    if(item["status"] == 1){
                        notice += 1;
                    }else if(item["status"] == 0){
                        unNotice += 1;
                    }else if(item["status"] == 0){
                        errorNotice += 0;
                    }
                });
                unNotice = unNotice + (w.setting.domain_event.length - w.setting.notice_event.length);
                $(".notice_count", w.eventModal).html(notice);
                $(".error_notice_count", w.eventModal).html(errorNotice);
                $(".unnotice_count", w.eventModal).html(unNotice);
                $(".event_url").html("");
                $(".event_num").html("");
                $(this).hide();
                $(".send-notice", w.eventModal).show();
            });

            $(".modal-footer").on("click", ".send-notice", function(){
                var target = $(this);
                target.attr("disabled", true);
                var param = {};
                if(w.setting.notice_event.length > 0){
                    param["eventList"] = w.setting.notice_event;
                    var noticyList = $("#notify-group").val();
                    var regionList = $("#notify-region").val();
                    if(!regionList){
                        regionList = [];
                    }
                    $.each(w.setting.innerRegion, function(point, item){
                        regionList.push(item["_id"]);
                    });
                    if(noticyList && noticyList.length > 0){
                        param["notify_list"] = noticyList;
                    }
                    if(regionList && regionList.length > 0){
                        param["region_list"] = regionList;
                    }
                    $.post(__WEBROOT__ + "/Home/EventNotify/notifyDomain", param).success(function(json){
                        if(json["code"]){
                            swal({   title: json.msg, type: "success",   confirmButtonText: "确定" });
                            w.eventModal.modal("hide");
                            w.table.draw();
                        }else{
                            swal({   title: "操作失败！",  type: "error",   confirmButtonText: "确定" });
                        }
                        target.attr("disabled", false);
                    });
                }else{
                    swal({   title: "无通报事件！",  type: "error",   confirmButtonText: "确定" });
                }
            });
        }
    }

    var init_func = {
        // 将一个事件push到notice_list中
        push_notice : function(){
            var w = this;
            var wrapper = $(".model_content_div");
            var param = {
                _id:$(".event__id", wrapper).val(),
                url:$(".event_url", wrapper).val(),
                title:$(".event_title", wrapper).val(),
                event_type:$("#model_event_type").val(),
                desc:$(".event_desc", wrapper).val(),
                remark:$(".event_remark", wrapper).val(),
                province:$(".prov", wrapper).val(),
                city:$(".city", wrapper).val(),
                district:$(".dist", wrapper).val(),
                status:$("input[name='deal_state']:checked ", wrapper).val()
            };
            var snapshot = $(".event_snapshot", wrapper).val();
            if(snapshot){
                $.extend(param, {snapshot:snapshot});
            }
            for(var i = 0; i < w.setting.notice_event.length; i++){
                var tmp = w.setting.notice_event[i];
                if(tmp["_id"] == param["_id"]){
                    w.setting.notice_event.splice(i, 1);
                }
            }
            w.setting.notice_event.push(param);
        },

        // 将一个事件从notice中pop出来
        pop_notice : function(){
            var w = this;
            var wrapper = $(".model_content_div");
            var _id = $(".event__id", wrapper).val();
            for(var i = 0; i < w.setting.notice_event.length; i++){
                var tmp = w.setting.notice_event[i];
                if(_id == tmp["_id"]){
                    w.setting.notice_event.splice(i, 1);
                    break;
                }
            }
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
                    w.setting.policy = json["items"];
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

    $(document).ready(function(){
        var eventNotify = new EventNotify();
        eventNotify.init.call(eventNotify);
    });

})();
