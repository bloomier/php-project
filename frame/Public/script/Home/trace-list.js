/**
 * Created by jianghaifeng on 2016/3/31.
 */
(function(){

    var TraceList = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.setting = setting;
        this.init = init;
    }

    var init_view = {
        init:function(){
            var w = this;
            var scoller = $(".scrollbar");
            $.each(w.setting.event_list, function(point, item){
                var wrapper = $("#timeline-div-template").clone().removeAttr("id");
                var type = "";
                if(item['type'] == 1){
                    type = w.setting.event_type[item['event_type']];
                }else{
                    $.each(w.setting.policy, function(p, v){
                        if(v["_id"] == item["event_type"]){
                            type=v["name"]
                        }
                    });
                }
                $(".type", wrapper).html(type);// 类型
                $(".url", wrapper).html(item["url"]);
                $(".title", wrapper).html(item["title"]);
                $(".happen_time", wrapper).html(item["happen_time"]);
                wrapper.show().appendTo(scoller);
            });
        }
    }

    var setting = {
        event_list:[],
        policy:[],
        event_type:[]
    }

    var init_data = {
        init:function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/EventTrace/listAll",
                method:"post",
                async:false,
                data:{domain:$("#domain").val()},
                success:function(json){
                    w.setting.event_list = json;
                }
            });
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
                    w.setting.event_type = json['event_type_name_mapper'];
                }
            });
        }
    }

    var init = function(){
        var w = this;
        w.init_data.init.call(w);
        w.init_view.init.call(w);
        $(".scrollbar").slimScroll({
            height: '100%'
        })
    }

    $(document).ready(function(){
        var traceList = new TraceList();
        traceList.init.call(traceList);
    });

})();