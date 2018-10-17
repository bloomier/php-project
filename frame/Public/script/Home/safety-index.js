/**
 * Created by jianghaifeng on 2016/3/1.
 */
(function(){

    var SafetyIndex = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_func = init_func;
        this.setting = setting;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.init_data.init_data.call(w);
        w.init_view.init_type.call(w);
        w.init_view.init_table.call(w);
        w.init_func.init_query.call(w);
        w.init_bind.bind.call(w);
        w.init_view.init_src.call(w);
    }

    var setting = {
        safety_type :[],
        safety_type_icon : {
            1:"fa fa-book",
            2:"fa fa-briefcase",
            3:"fa fa-bell"
        }
    }

    var init_view = {
        init_type : function(){
            var w = this;
            var folder = $(".folder-list");
            $.each(w.setting.safety_type, function(point, item){
                var wrapper = $("#safety-type-div-wrapper").clone().removeAttr("id");
                $(".type-font", wrapper).addClass(w.setting.safety_type_icon[item["_id"]]);
                $(".safety-type-name", wrapper).html(item['name']);
                $(".safety-type-href", wrapper).attr("safety-type",item["_id"]);
                wrapper.show().appendTo(folder);
            });
        },
        init_table : function(){
            var w = this;
            w.table=$(".safety-info-table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'title'},
                    { sDefaultContent: ''},
                    { data: 'safety_source'},
                    { data: 'safety_type_id'},
                    { data: 'create_time'},
                    { sDefaultContent: ''}

                ],
                columnDefs:[
                    {
                        targets: 3,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $.each(w.setting.safety_type,function(point, item){
                                if(item["_id"] == cellData){
                                    $(td).html(item["name"]);
                                }
                            });
                        }
                    }
                ],
                rowCallback:function( row, data, index ){
                    if(data['title'] && data['title'].length > 15){
                        $('td:eq(0)', row).html('<abbr title="' + data['title'] + '">' + data['title'].substr(0,15) + '...</abbr>');
                    }
                    var location = "";
                    if(data["effect"]){
                        if(data["effect"]["province"]){
                            location += data["effect"]["province"];
                        }
                        if(data["effect"]["city"]){
                            location += data["effect"]["city"];
                        }
                    }
                    $('td:eq(1)', row).html(location);
                    var editBtn = $('<button class="btn btn-primary btn-xs safety-detail-btn" style="margin-left:10px"><i class="fa fa-file-text"></i>&nbsp;查看</button>');
                    $('td:eq(5)', row).html("").append(editBtn);
                }
            }));
        },
        init_detail : function(detail){
            var w = this;
            var wrapper = $("#safety-detail-wrapper");
            $(".safety-title", wrapper).html(detail['title']);
            for(var i = 0; i < w.setting.safety_type.length; i++){
                if(w.setting.safety_type[i]["_id"] == detail["safety_type_id"]){
                    $(".safety-type", wrapper).html(w.setting.safety_type[i]["name"]);
                    break;
                }
            }
            $(".safety-time", wrapper).html(detail['create_time']);
            var divContent = $("<div></div>");
            divContent.html(detail['content']);
            $(".safety-content", wrapper).html(divContent.text());
            if(detail['safety_source']){
                $(".safety-source", wrapper).html("资讯来源:" + detail['safety_source']);
            }
            if(detail['safety_source_url']){
                $(".safety-source-url", wrapper).attr("href", detail['safety_source_url']).html("原文链接:" + detail['safety_source_url']);
            }
            if(detail['safety_doc']){
                var attachmentCount = detail['safety_doc'].length;
                $(".safety-attachement-count", wrapper).html(attachmentCount + "个附件 - ");
                var attachmentWrapper = $(".safety-attachement", wrapper);
                attachmentWrapper.html("");
                $.each(detail['safety_doc'], function(point, item){
                    var oneAttachment = $("#safety-attach-wrapper").clone().removeAttr("id");
                    $(".file-name", oneAttachment).html(item['name']);
                    $(".attachment-path", oneAttachment).attr("path", item['path']).attr("href", __WEBROOT__ + "/Home/SafetyInfo/download?name=" + item['name'] + "&path=" + encodeURIComponent(item['path']));
                    oneAttachment.show().appendTo(attachmentWrapper);
                });
            }
        },
        clear_detail : function(){
            var wrapper = $("#safety-detail-wrapper");
            $(".safety-title", wrapper).html("");
            $(".safety-type", wrapper).html("");
            $(".safety-time", wrapper).html("");
            $(".safety-content", wrapper).html("");
            $(".safety-source", wrapper).html("");
            $(".safety-source-url", wrapper).html("").removeAttr("href");
            $(".safety-attachement-count", wrapper).html("");
            $(".safety-attachement", wrapper).html("");
        },
        init_src : function(){
            var w = this;
            var src = $("#safety-info").val();
            if(!src){
                return;
            }
            src = decodeURIComponent(src);
            src = $.parseJSON(src);
            w.init_view.init_detail.call(w, src);
            $("#safety-list-wrapper").hide();
            $("#safety-detail-wrapper").show();
        }
    }

    var init_data = {
        init_data :function(){
            var w = this;
            $.ajax({
                url:__WEBROOT__ + "/Home/SafetyInfo/listType",
                async: false,
                type: "get",
                success:function(json){
                    w.setting.safety_type = json['type'];
                }
            });
        }
    }

    var init_func = {
        init_query : function(type){
            var w = this;
            var param = {};
            if(type){
                param["safety_type_id"] = type;
            }
            $.ajax({
                url:__WEBROOT__ + "/Home/SafetyInfo/listAll",
                data:param,
                type:"post",
                success:function(json){
                    w.table.clear();
                    w.table.rows.add(json['info']);
                    w.table.draw();
                }
            });
        }
    }

    var init_bind = {
        bind:function(){
            var w = this;
            $("#safety-list-wrapper").on("click", ".safety-detail-btn", function(){
                var row= w.table.row($(this).closest("tr"));
                w.init_view.init_detail.call(w, row.data());
                $("#safety-list-wrapper").hide();
                $("#safety-detail-wrapper").show();
            });
            $(".return-safety-list-btn").bind("click", function(){
                w.init_view.clear_detail.call(w);
                $("#safety-list-wrapper").show();
                $("#safety-detail-wrapper").hide();
            });
            $(".folder-list").on("click", ".safety-type-href", function(){
                var type = $(this).attr("safety-type");
                var tagName = $(".safety-type-name", $(this)).html();
                $("#tag_name").html(tagName);
                if(type){
                    w.init_func.init_query.call(w, type);
                }else{
                    w.init_func.init_query.call(w);
                }
            });
        }
    }

    $(document).ready(function(){
        var safetyIndex=new SafetyIndex();
        safetyIndex.init.call(safetyIndex);
    });

})();
