/**
 * Created by jianghaifeng on 2016/3/1.
 */
(function(){

    var common_func = {
        init_status : function(status){
            if(status == -2){
                return "误报";
            }
            if(status == -1){
                return "不通报";
            }
            if(status == 1){
                return "事件录入";
            }
            if(status == 2){
                return "推送";
            }
            if(status == 3){
                return "报送";
            }
        }
    }

    var TraceDetail = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.setting = setting;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.setting.event_id = $("#src_domain_id").val();
        w.init_view.init_table.call(w);
        w.init_data.init.call(w);
        w.init_view.init_value.call(w);
        $(".event_history").attr("href", __WEBROOT__ + "/Home/EventTrace/traceListPage?domain=" + w.setting.event_info["domain"]);
    }

    var setting = {
        event_id:"",
        event_type:[],
        event_info:[],
        event_log:[],
        policy:[]
    }

    var init_view = {
        init_table:function(){
            var w = this;
            w.table = $(".trace-detail-table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'status',width: '15%' },
                    { data: 'time',width: '15%' },
                    { data: 'creater',width: '10%' },
                    { sDefaultContent: '',width: '10%' }
                ],
                columnDefs:[
                    {orderable:false,targets:[1]}
                ],
                rowCallback:function( row, data, index ){
                    $('td:eq(0)', row).html(common_func.init_status(data['status']));
                }
            }));
        },
        init_value:function(){
            var w = this;
            if(w.setting.event_info.length > 0){
                w.setting.event_info = w.setting.event_info[0];
            }
            $.each(w.setting.event_info, function(point, item){
                $(".event_" + point).html(item);
            });
            var type = "";
            var eventType = "";
            if(w.setting.event_info["type"] == 1){
                type = "安全事件";
                eventType = w.setting.event_type[w.setting.event_info["event_type"]];
            }else{
                type = "网站漏洞";
                $.each( w.setting.policy, function(point, item){
                    if(item["_id"] == w.setting.event_info["event_type"]){
                        eventType = item["name"];
                    }
                });
            }
            $(".event_type").html(type);
            $(".event_event_type").html(eventType);
        }
    }

    var init_data = {
        init :function(){
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
                    w.setting.event_type = json['event_type_name_mapper'];
                }
            });
            // 获取事件详情
            $.ajax({
                url:__WEBROOT__ + "/Home/EventTrace/listAll",
                async:false,
                data:{id: w.setting.event_id},
                type:"post",
                success:function(json){
                    w.setting.event_info = json;
                }
            });
            // 获取事件记录
            $.ajax({
                url:__WEBROOT__ + "/Home/EventTrace/eventLog",
                data:{event_id: w.setting.event_info[0]["_id"]},
                async:false,
                type:"post",
                success:function(json){
                    if(json["code"]){
                        w.table.rows.add(json["items"]).draw();
                    }else{
                        swal({   title: "获取失败！",  type: "error",   confirmButtonText: "确定" });
                    }
                }
            });
            // 获取该域名事件事件总数
            $.ajax({
                url:__WEBROOT__ + "/Home/EventTrace/listAll",
                data:{domain: w.setting.event_info[0]["domain"]},
                async:false,
                type:"post",
                success:function(json){
                    $(".event_history").html(json.length + "件");
                }
            });
        }
    }

    $(document).ready(function(){
        var traceDetail = new TraceDetail();
        traceDetail.init.call(traceDetail);
    });
})();
