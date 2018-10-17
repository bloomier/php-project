/**
 * Created by jianghaifeng on 2016/3/1.
 */
(function(){

    var commom_func = {
        init_select : function(list, obj){
            $.each(list, function(point, item){
                var option = $('<option value="' + item["_id"] + '">' + item["name"] + '</option>');
                obj.append(option);
            });
        }
    }

    var EventTrace = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.setting = setting;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.init_data.init.call(w);
        w.init_bind.bind.call(w);
        w.init_view.init_table.call(w);
    }

    var setting = {
        event_type:[],
        policy:[]
    }

    var init_view = {
        init_table:function(){
            var w = this;
            w.table = $(".event-trace-table").DataTable($.extend(_dataTable_setting._server(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/EventTrace/listPage",
                    type:"post",
                    data: function(d){
                        d["param"] = $("input[name='event_param']").val();
                        var type = $("#type").val();
                        var eventType = $("#event_type").val();
                        if(type){
                            d["type"] = type;
                        }
                        if(eventType){
                            d["event_type"] = eventType;
                        }
                    },
                    dataSrc:"items"
                },
                searching:false,
                columns: [
                    { data: 'title',width: '15%' },
                    { data: 'url',width: '15%' },
                    { data: 'type',width: '10%' },
                    { data: 'event_type' ,width: '10%'},
                    { data: 'happen_time',width: '15%' },
                    { data: 'deal_time',width: '15%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width: '10%' }
                ],
                columnDefs:[
                    {orderable:false,targets:[1]}
                ],
                rowCallback:function( row, data, index ){
                    if(data["type"] == 1){
                        $('td:eq(2)', row).html("安全事件");
                        $('td:eq(3)', row).html(w.setting.event_type[data['event_type']]);
                    }else{
                        $('td:eq(2)', row).html("漏洞");
                        $.each(w.setting.policy, function(point, item){
                            if(item["_id"] == data['event_type']){
                                $('td:eq(3)', row).html(item["name"]);
                            }
                        });
                    }
                    if(data["event_status"] == 2){
                        $('td:eq(6)', row).html("未修复");
                    }else if(data["event_status"] == 3){
                        $('td:eq(6)', row).html("已修复");
                    }
                    var editBtn = $('<a class="btn btn-warning btn-xs policyGroupEditBtn" type="button" style="margin-left:5px"><i class="fa fa-file"></i> 查看</a>');
                    editBtn.attr("href",  __WEBROOT__ + '/Home/EventTrace/tracePage?id=' + data['_id']);
                    $('td:eq(7)', row).append(editBtn);
                }
            }));
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
       }
    }

    var init_bind = {
        bind : function(){
            var w = this;
            $("#type").bind("change",function(){
                var value = $(this).val();
                $("#event_type").html("");
                if(w.select2){
                    $("#event_type").select2("destroy")
                }
                if(value == 0){
                    $("#event_type").attr("disabled", true);
                    w.select2 = null;
                }else if(value == 1){
                    $("#event_type").attr("disabled", false);
                    var wrapper = $("#event_type");
                    wrapper.html("");
                    $.each(w.setting.event_type, function(point, item){
                        wrapper.append($("<option value='" + point + "'>" + item + "</option>"))
                    });
                    w.select2 = null;
                }else if(value == 2){
                    var wrapper = $("#event_type");
                    wrapper.html("");
                    $.each(w.setting.policy, function(point, item){
                        wrapper.append($("<option value='" + item["_id"] + "'>" + item["name"] + "</option>"))
                    });
                    w.select2 = $("#event_type").select2({allowClear: true});
                }
            });
            $(".event-trace-btn").bind("click", function(){
                w.table.draw();
            });
        }
    }

    $(document).ready(function(){
        var eventTrace = new EventTrace();
        eventTrace.init.call(eventTrace);
    });

})();
