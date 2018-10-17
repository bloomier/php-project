/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){
    var current_url = "";
    var current_title = "";
    var current_desc = "";
    var image_path = $("#image_path").val();
    var filterParam=[];
    var eventInfoTable;
    $(document).ready(function(){

        __init__.initView();
        __bind__.bindFunction();

        $("#eventInfoTable_wrapper").removeClass("form-inline");

    });

    var __init__={

        initView : function(){
            eventInfoTable=$("#eventInfoTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/Event/query',//请求URL
                "aoColumns": [ //参数映射
                    {"sDefaultContent": ''}
                ],

                "oLanguage": {
                    "sProcessing":   "处理中...",
                    "sLengthMenu":   "_MENU_ 记录/页",
                    "sZeroRecords":  "没有匹配的记录",
                    "sInfo":         "显示第 _START_ 至 _END_ 项记录，共  _TOTAL_项",
                    "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
                    "sInfoPostFix":  "",
                    "sSearch":       "过滤:",
                    "sUrl":          "",
                    "oPaginate": {
                        "sFirst":    "首页",
                        "sPrevious": "上页",
                        "sNext":     "下页",
                        "sLast":     "末页"
                    }
                },
                "iDisplayLength": 5,//每页显示10条数据
                //"lengthChange": false,
                "aLengthMenu":[5,10],


                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var ip = aData['web_ip'];
                    var region = aData['web_ip_addr'];
                    var time = aData['happen_time'];
                    var typeCh = aData['event_type_cn'];
                    var user = aData['create_user'];
                    var url = aData['web_url'];
                    var title = aData['web_title'];

                    var source = aData['event_source'];
                    var desc = aData['event_desc'];

                    var id = aData['event_id'];
                    var pic = aData['event_snapshot'];
                    if(pic == null || pic == '' || pic.length < 5){
                        pic = "security/2015-16-07/1437038593.png";
                    }
                    var contactTarget = aData['list'];
                    var province = aData['web_ip_province'];
                    var city = aData['web_ip_city'];
                    if(desc){
                        if(desc.indexOf("[") == 0 && (desc.lastIndexOf("]") + 1) == desc.length){
                            desc = desc.substr(1, desc.length -1);
                            var value = "";
                            $.each(desc.split("}, {"), function(point, item){
                                if(item.indexOf("{") == 0){
                                    item = item.substr(1);
                                }
                                if(item.lastIndexOf("}]") != -1){
                                    item = item.split("}]")[0];
                                }
                                value = value + item + "\n";
                            })
                            desc = value;
                        }
                    }

                    var wraper = $("#one-result").clone().removeAttr("id");
                    $(".citys",wraper).citySelect({prov:province,city:city});
                    $(".one-event-ip",wraper).html(ip);
                    $(".one-event-addr",wraper).html(region);
                    $(".one-event-time",wraper).html(time);
                    $(".one-event-type",wraper).html(typeCh);
                    $(".one-event-submiter",wraper).html(user);
                    $(".one-event-url",wraper).val(url);
                    $(".one-event-title",wraper).val(title);
                    $(".one-event-source",wraper).html(source);
                    $(".one-event-desc",wraper).val(desc);
                    //$(".one-event-addr",wraper).html(region);
                    $(".one-event-ip",wraper).html(ip);
                    $(".one-event-pass-btn", wraper).attr("event_id", id);
                    $(".one-event-update-btn", wraper).attr("event_id", id);
                    $(".one-event-default", wraper).attr("event_id", id);
                    $(".upload_photo_input", wraper).attr("id", id);
                    $(".one-event-pic-show",wraper).attr("id", "img_" + id);
                    var a = [];
                    //$.each(contactTarget, function(point, item){
                    //    a.push(item.groupName);
                    //});
                    //
                    //$(".select2", wraper).val(a.join(","));
                    //var select = $(".select2", wraper);
                    //select.select2({tags:a});

                    $.each(contactTarget, function(point, item){
                        var one = {};
                        one.id = item.groupId;
                        one.text = item.groupName;
                        a.push(one);
                    });
                    var select = $(".select2", wraper);
                    select.select2({tags:a});
                    select.select2("data",a);


                    $(".one-event-pic",wraper).attr("href", image_path + "/upload/" + pic);
                    $(".one-event-pic-show",wraper).attr("src", image_path + "/upload/" + pic);
                    $(".fancybox-button", wraper).fancybox({
                        groupAttr: 'data-rel',
                        prevEffect: 'none',
                        nextEffect: 'none',
                        closeBtn: true,
                        helpers: {
                            title: {
                                type: 'inside'
                            }
                        }
                    });

                    $(".one-event-default", wraper).bind("click", function(){
                        $(this).attr("disabled", "true");
                        $(this).text("正在执行");
                        var param = {};
                        var audit = -1;
                        var id = $(this).attr("event_id");
                        $.extend(param, {"id" : id, "audit" : audit, "deal_state":1});
                        $.post(__ROOT__+"/Security/Event/update", param).success(function(json){
                            if(!json['code']) {
                                Message.init({
                                    text: '事件通知失败，请查看事件跟踪！',
                                    type: 'success' //info success warning danger
                                });
                            }
                            eventInfoTable.fnDraw(false);
                        });
                    });

                    $(".one-event-pass-btn", wraper).bind("click", function(){
                        storm.confirm("确定通报吗？",function(){

                            $(".one-event-pass-btn", wraper).attr("disabled", "true");
                            $(".one-event-pass-btn", wraper).text("正在通报");
                            var param = {};
                            var thisInfo = $(".one-event-pass-btn", wraper).parent().parent();
                            var url = $(".one-event-url", thisInfo).val();
                            if(url.indexOf("http") != 0){
                                storm.alert("请将黑页地址填写正确");
                                return ;
                            }
                            var title = $(".one-event-title", thisInfo).val();
                            var source = $(".one-event-source", thisInfo).html();
                            var desc = $(".one-event-desc", thisInfo).val();
                            var province = $(".prov-location", thisInfo).val();// 省
                            var city = $(".city-location", thisInfo).val();// 市区
                            var id = $(".one-event-pass-btn", wraper).attr("event_id");
                            var contact = $("input:hidden", thisInfo).val();
                            var deal_state = 2;
                            var audit = 1;
                            image_path ;
                            var event_snapshot = $("#img_"+ id).attr('src');
                            event_snapshot = event_snapshot.replace(image_path + "/upload/","");
                            if(event_snapshot == "security/2015-16-07/1437038593.png"){
                                event_snapshot = "";
                            }
                            //alert(event_snapshot);
                            //return ;

                            $.extend(param, {"url" : url, "title" : title, "source" : source, "desc" : desc, "id" : id, "audit" : audit, "contact":contact, "deal_state":deal_state, "province":province, "city":city,"event_snapshot":event_snapshot});
                            $.post(__ROOT__+"/Security/Event/update", param).success(function(json){
                                if(!json['code']){
                                    Message.init({
                                        text: '事件通知失败，请查看事件跟踪！',
                                        type: 'success' //info success warning danger
                                    });
                                }
                                eventInfoTable.fnDraw(false);
                            });
                        });

                    });

                    $('td:eq(0)', nRow).html(wraper.show());

                },

                "fnServerParams":function(aoData){//查询条件
                    var value = $("#eventType").val();
                    filterParam.push({name:"audit_state", value:0});
                    var type = $("#eventType").val();
                    var eventParam = $("#eventParam").val();

                    //if(eventParam != ""){
                        filterParam.push({name:"param",value:eventParam});
                    //}
                    //if(value > 0){
                        filterParam.push({name:"event_type",value:value});
                    //}
                    $.merge(aoData,filterParam);
                }
            }));
        }
    };




    var __bind__ = {
        bindFunction : function(){

            $(".query-by-param").bind("click", function(){
                eventInfoTable.fnPageChange(0);
                //eventInfoTable.fnDraw(false);
            });

            $(".prov-location").live("change", function(){
                var wraper=$(this).closest($(".one-result-css"));
                var eventBtn = $(".one-event-pass-btn", wraper);
                var city = $(".city-location", wraper).val();
                var prov = $(this).val();
                $.post(__ROOT__+"/Security/Event/queryByLocation", {province:prov,city:city}).success(function(json){
                    var contactTarget = json.rows;
                    //var a = [];
                    //$.each(contactTarget, function(point, item){
                    //    a.push(item.groupName);
                    //});
                    //$(".select2", wraper).val(a.join(","));
                    //
                    //var select = $(".select2", wraper);
                    //select.select2({tags:a});



                    var a = [];
                    $.each(contactTarget, function(point, item){
                        var one = {};
                        one.id = item.groupId;
                        one.text = item.groupName;
                        a.push(one);
                    });


                    var select = $(".select2", wraper);
                    select.select2({tags:a});
                    select.select2("data",a);

                });
            });

            $(".city-location").live("change", function(){
                var wraper=$(this).closest($(".one-result-css"));
                var eventBtn = $(".one-event-pass-btn", wraper);
                var prov = $(".prov-location", wraper).val();
                var city = $(this).val();

                $.post(__ROOT__+"/Security/Event/queryByLocation", {province:prov,city:city}).success(function(json){
                    var contactTarget = json.rows;
                    //var a = [];
                    //$.each(contactTarget, function(point, item){
                    //    a.push(item.groupName);
                    //});
                    //
                    //$(".select2", wraper).val(a.join(","));
                    //var select = $(".select2", wraper);
                    //select.select2({tags:a});

                    var a = [];
                    $.each(contactTarget, function(point, item){
                        var one = {};
                        one.id = item.groupId;
                        one.text = item.groupName;
                        a.push(one);
                    });

                    var select = $(".select2", wraper);
                    select.select2({tags:a});
                    select.select2("data",a);
                });
            });

            // 上传图片，上传成功后，修改相应信息
            $(".upload_photo_input").live("change",function(){
                if($(this).val()==''){
                    return;
                }
                var id_flag  = $(this).attr("id");
                $.ajaxFileUpload({
                    url: __ROOT__ + "/Home/Image/uploadImgToServer",
                    type: "post",
                    secureuri: false,
                    fileElementId: id_flag,
                    data:{type: 'security'},
                    dataType: 'json', //返回值类型 一般设置为json
                    success:function(json){
                        if(json.code > 0){
                            var src = json.path;
                            var event_snapshot = json.relation_path;
                            var img_id = "#img_" + id_flag;
                            $(img_id).attr("src",src);
                            var param = {};
                            $.extend(param, {"url" : current_url, "title" : current_title, "event_snapshot" : event_snapshot, "desc" : current_desc, "id" : id_flag});
                            $.post(__ROOT__+"/Security/Event/update", param).success(function(json){
                                if(json.code > 0) {
                                    current_url = "";
                                    current_title = "";
                                    current_desc = "";
                                    storm.alert("修改成功");
                                    //__function__.search(1);
                                }
                            });

                        }else{
                            storm.alert('上传失败');
                        }
                    }
                });
            });


            // 修改信息
            $(".one-event-update-btn").live("click", function(){
                // $(this).attr("disabled", "true");
                // $(this).text("正在修改");
                var param = {};
                var thisInfo = $(this).parent().parent();
                var url = $(".one-event-url", thisInfo).val();
                if(url.indexOf('http') != 0){
                    storm.alert('请将黑页地址填写正确');
                    return ;
                }
                var title = $(".one-event-title", thisInfo).val();
                //var source = $(".one-event-source", thisInfo).html();
                var desc = $(".one-event-desc", thisInfo).val();
                current_url = url;
                current_title = title;
                current_desc = desc;
                var id = $(this).attr("event_id");
                var flie_id = "#"+id;
                //执行上传文件时间
                $(flie_id).click();
                // $(this).text("修改信息");
                // $(this).attr("enabled", "true");
            });
        }
    }
})();