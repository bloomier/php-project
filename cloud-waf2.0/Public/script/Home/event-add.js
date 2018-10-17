/**
 * Created by jianghaifeng on 2016/3/22.
 */
(function(){

    var common_func = {
        init_select : function(list, obj){
            obj.html("");
            $.each(list, function(point, item){
                var option = $('<option value="' + item["_id"] + '">' + item["name"] + '</option>');
                obj.append(option);
            });
        },
        validata : function(){
            if(!$("#url").val()){
                swal({   title: "Error!",   text: "请填写域名！",   type: "error",   confirmButtonText: "确定" });
                return false;
            }else{
                var urlRegex = /^http[s]?:\/\/(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*\'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/\?)|(\/[0-9a-zA-Z_!~\'\.;\?:@&=\+\$,%#-\/^\*\|]*)?)$/
                var urlResult = $("#url").val().match(urlRegex);
                if(!urlResult){
                    swal({   title: "Error!",   text: "域名格式不对，请重新输入！",   type: "error",   confirmButtonText: "确定" });
                    return false;
                }
            }
            if(!$("#title").val()){
                swal({   title: "Error!",   text: "请输入标题！",   type: "error",   confirmButtonText: "确定" });
                return false;
            }
            if(!$("#happen_time").val()){
                swal({   title: "Error!",   text: "请输入时间！",   type: "error",   confirmButtonText: "确定" });
                return false;
            }
            if($("#ip").val()){
                var ipRegex = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                var ipResult = $("#ip").val().match(ipRegex);
                if(!ipResult){
                    swal({   title: "Error!",   text: "ip地址格式不对，请重新输入！",   type: "error",   confirmButtonText: "确定" });
                    return false;
                }
            }
            if(!$("#city").val()){
                swal({   title: "Error!",   text: "请输入行政归属！",   type: "error",   confirmButtonText: "确定" });
                return false;
            }
            if(!$("#desc").val()){
                swal({   title: "Error!",   text: "请输入事件描述信息！",   type: "error",   confirmButtonText: "确定" });
                return false;
            }
            return true;
        },
        initParam : function(){
            var param = {
                url:$("#url").val(),
                title:$("#title").val(),
                type:$("#type").val(),
                event_type:$("#event_type").val(),
                happen_time:$("#happen_time").val(),
                ip:$("#ip").val(),
                province:$("#province").val(),
                city:$("#city").val(),
                district:$("#district").val(),
                snapshot:$("#snapshot").val(),
                desc:$("#desc").val(),
                remark:$("#remark").val()
            };
            return param;
        }
    }

    var EventAdd = function(){
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        event_type:[],
        policy:[]
    }

    var init_view = {
        init:function(){
            var w = this;
            common_func.init_select(w.setting.event_type, $("#event_type"));
            var eventType = $("#event_type");
            eventType.html("");
            $.each(w.setting.event_type["event_type_name_mapper"], function(point, item){
                eventType.append($("<option value='" + point + "'>" + item + "</option>"));
            });
            $(".citys").citySelect({
                url:__WEBROOT__+"/Admin/Location/getLocationSelectorData",
                prov:"北京",
                city:"",
                dist:"",
                nodata:"none"
            });
        }
    }

    var init_bind = {
        bind:function(){
            var w = this;
            $(".return_btn").attr("href", __WEBROOT__ + "/Home/EventNotify/index");
            $(".save_event").attr("href", __WEBROOT__ + "/Home/EventNotify/index");
            $("#type").bind("change", function(){
                var value = $(this).val();
                var eventType = $("#event_type");
                eventType.html("");
                if(value == 1){
                    $.each(w.setting.event_type["event_type_name_mapper"], function(point, item){
                        eventType.append($("<option value='" + point + "'>" + item + "</option>"));
                    });
                }else{
                    $.each(w.setting.policy["items"], function(point, item){
                        eventType.append($("<option value='" + item["_id"] + "'>" + item["name"] + "</option>"));
                    });
                }
            });
            $("#file").fileinput({
                //'allowedFileExtensions' : ['txt'],// 过滤文件类型(只接受txt文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : true,// 是否显示文件预览内容
                'uploadUrl': __WEBROOT__ + "/Home/EventNotify/uploadImg",// 文件上传url
                'ajaxSettings':{
                    success:function(json){
                        if(json['code']){
                            $("#snapshot").val(json["relation_path"]);
                        }else{
                            swal({   title: "Error!",   text: json.msg,   type: "error",   confirmButtonText: "确定" });
                        }
                    }
                }
            });

            $(".save_event").bind("click", function(){
                if(common_func.validata()){
                    $.post(__WEBROOT__ + "/Home/EventNotify/addEvent", common_func.initParam()).success(function(json){
                        if(json["code"]){
                            return true;
                        }else{
                            return false;
                        }
                    });
                }else{
                    return false;
                }
            });
        }
    }

    var init_data = {
        init:function(){
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

    var init = function(){
        var w = this;
        w.init_data.init.call(w);
        w.init_view.init.call(w);
        w.init_bind.bind.call(w);
    }

    $(document).ready(function(){
        var eventAdd = new EventAdd();
        eventAdd.init.call(eventAdd);
    });

})();
