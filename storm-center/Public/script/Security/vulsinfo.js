/**
 * Created by jianghaifeng on 2016/2/24.
 */
(function(){

    var common_function = {
        initRegion:function(aData){
            var region = "";
            if(aData['web_ip_province']){
                region += aData['web_ip_province']
            }
            if(aData['web_ip_city']){
                region += aData['web_ip_city'];
            }
            if(aData['web_ip_dist']){
                region += aData['web_ip_dist'];
            }
            return region;
        }
    }

    var VulsInfo = function(){
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.init_function = init_function;
        this.setting = setting;
        this.init = init;
    };

    var init = function(){
        var w = this;
        w.init_bind.initBindFunction.call(w);
        w.init_data.initTalbe.call(w);
    };

    var setting = {
        filterParam:[],
        imgPath: $("#img_src_path").val(),
        defaultImg:"security/2015-16-07/1437038593.png",
        domainListParam:{
            "deal_state":0,
            "audit_state":0,
            "web_domain":""
        }
    }

    var init_data = {
        initTalbe : function(){
            var w = this;
            w.vulsinfoTable = $("#vulsInfoTable").dataTable($.extend(storm.defaultGridSetting(),{
                "bInfo":false,
                "bLengthChange":false,
                "sAjaxSource": __ROOT__+'/Security/VulsInfo/queryGroup',
                "aoColumns": [
                    {"mDataProp": 'web_domain',"sWidth":"25%"},
                    {"mDataProp": 'web_title', "sWidth":"25%"},
                    {"sDefaultContent": '', "sWidth":"10%"},
                    {"mDataProp": 'count', "sWidth":"10%"},
                    {"mDataProp": 'happen_time', "sWidth":"20%"},
                    {"sDefaultContent": '', "sWidth":"10%"}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                    $('td:eq(2)',nRow).html(common_function.initRegion(aData));
                    var btn = $("<button class='btn blue-stripe mini verify_btn'>审核</button>");
                    btn.data("web_domain", aData["web_domain"]);
                    $("td:eq(5)",nRow).append(btn);
                },
                "fnServerParams":function(aoData){
                    $.merge(aoData, w.setting.filterParam);
                }
            }));
            var wrapper = $("#vuls_modal");
            w.pre_domain_btn_default = $(".pre_domain_btn_default", wrapper);
            w.pre_domain_btn_notice = $(".pre_domain_btn_notice", wrapper);
            w.next_domain_btn_default = $(".next_domain_btn_default", wrapper);
            w.next_domain_btn_notice = $(".next_domain_btn_notice", wrapper);
            w.notice_domain_btn = $(".notice_domain_btn", wrapper);
        },
        initLocation:function(province, city){
            var w = this;
            $.post(__ROOT__+"/Security/Event/queryByLocation", {province:province,city:city}).success(function(json){
                var wraper=$("#vuls_modal");
                var contactTarget = json.rows;
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
        }
    };

    // bind function
    var init_bind = {
        initBindFunction:function(){
            var w = this;
            $(".btn-search").bind("click", {context:w}, w.init_function.initQuery);
            $(".verify_btn").live("click", {context:w}, w.init_function.verifyFunc);
            var wrapper = $("#vuls_modal");
            $(".pre_domain_btn_default", wrapper).live("click", {context:w}, w.init_function.preVuls);
            $(".next_domain_btn_default", wrapper).live("click", {context:w}, w.init_function.nextVuls);
            $(".close_domain_btn").live("click", {context:w}, w.init_function.closeVuls);
            $(".next_domain_btn_notice", wrapper).live("click", {context:w}, w.init_function.noticeView);
            $(".pre_domain_btn_notice", wrapper).live("click", {context:w}, w.init_function.noticeVuls);
            $(".notice_domain_btn", wrapper).live("click", {context:w}, w.init_function.commitNotice);
            $("#a_id").live("click",function(){
                $("#file").trigger("click");
            });
            $("#file").live("change", {context:w}, w.init_function.uploadFile);

            $(".prov-location").live("change", function(){
                var wraper=$(this).closest($(".one-result-css"));
                var city = $(".city-location", wraper).val();
                var prov = $(this).val();
                w.init_data.initLocation.call(w, prov, city);
            });

            $(".city-location").live("change", function(){
                var wraper=$("#vuls_modal");
                var prov = $(".prov-location", wraper).val();
                var city = $(this).val();
                w.init_data.initLocation.call(w, prov, city);
            });
        }
    };

    var init_view = {
        init_pic : function(path, relation_path){
            var w = this;
            var wrapper = $("#vuls_modal");
            var nowPoint = parseInt($("#now_point").val()) - 1;
            w.vulsdata[nowPoint].vuls_snapshot = relation_path;
            $(".one-event-pic-show", wrapper).attr("src",path).show();
            $(".one-event-pic", wrapper).attr("href", path);
            $(".fancybox-button", wrapper).fancybox({
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
        },
        modalBtnJudge : function(){
            var w = this;
            var wrapper = $("#vuls_modal");
            var now = parseInt($("#now_point").val());
            var vulsLength = w.vulsdata.length;
            if(now == 1){
                w.pre_domain_btn_default.hide();
            }else{
                w.pre_domain_btn_default.show();
            }
            if(vulsLength == now){
                w.next_domain_btn_notice.show();
                w.next_domain_btn_default.hide();
            }
        },
        resetModel : function(){
            var w = this;
            var wrapper = $("#vuls_modal");
            $(".model_content_div", wrapper).show();
            $(".model_notice_div", wrapper).hide();
            w.pre_domain_btn_default.hide();
            w.pre_domain_btn_notice.hide();
            w.next_domain_btn_default.show();
            w.next_domain_btn_notice.hide();
            w.notice_domain_btn.hide();
        },
        setModelValue : function(point){
            point = parseInt(point);
            var w = this;
            var wrapper = $("#vuls_modal");
            w.init_view.resetModel.call(w);
            var value = w.vulsdata[point];
            $("#now_point", wrapper).val(point + 1);
            $(".web_url", wrapper).val(value['web_url']).attr("disabled", "true");
            $(".web_title", wrapper).val(value.web_title).attr("disabled", "true");
            $("input[name='deal_state'][type='radio']").parent("span").removeClass("active checked");
            $("input[name='deal_state'][type='radio'][value=" + value['audit_state'] +  "]", wrapper).attr("checked",true).parent("span").addClass("active checked");
            var path = w.setting.imgPath + "/upload/";
            if(value['vuls_snapshot']){
                path = path + value['vuls_snapshot'];
            }else{
                path = path + w.setting.defaultImg;
            }
            $(".one-event-ip", wrapper).html(value['web_ip']);
            $(".one-event-addr", wrapper).html("------");
            $(".one-event-time", wrapper).html(value['happen_time']);
            $(".one-event-type", wrapper).html(value['policy_id']);
            $(".one-event-pic-show", wrapper).attr("src",path).show();
            $(".one-event-pic", wrapper).attr("href", path);
            $(".vuls_desc", wrapper).val(value.vuls_desc);
            $(".vuls_domain_size", wrapper).text((point + 1) + ":" + w.vulsdata.length);
            $(".fancybox-button", wrapper).fancybox({
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
            w.init_view.modalBtnJudge.call(w);
        }
    };

    var init_function = {
        initQuery : function(event){
            var o = event.data.context;
            var flag = 0;
            var name = "param";
            var value = $(".query_param").val();
            $.each(o.setting.filterParam, function(point, item){
                if(item.name==name){
                    item.value = value;
                    flag = 1;
                }
            });
            if(!flag){
                o.setting.filterParam.push({name:name, value:value});
            }
            o.vulsinfoTable.fnDraw(true);
        },
        verifyFunc : function(event){
            var target = $(event.target);
            var domain = target.data("web_domain");
            var w = event.data.context;
            $.extend(w.setting.domainListParam,{
                "web_domain":domain
            });
            $.post(__WEBROOT__ + "/Security/VulsInfo/queryList", w.setting.domainListParam).success(function(json){
                if(json.code && json.total > 0){
                    w.vulsdata = json['rows'];
                    w.init_view.setModelValue.call(w, 0);
                    if(!w.modalShow){
                        w.modalShow = $("#vuls_modal");
                    }
                    w.modalShow.modal({backdrop:'static'});// 禁止点击空白处关闭
                    w.modalShow.on("hide.bs.modal", function(){
                        w.vulsdata = null;
                    });
                    w.modalShow.modal("show");
                }else{
                    Message.init({
                        type:"warning",
                        msg: "数据获取失败"
                    });
                }
            });
        },
        preVuls : function(event){
            var w = event.data.context;
            var point = $("#now_point").val();
            point = parseInt(point) - 2;
            w.init_view.setModelValue.call(w, point);
        },
        nextVuls : function(event){
            var w = event.data.context;
            var point = $("#now_point").val();
            var wrapper = $("#vuls_modal");
            var deal_state = $("input[name='deal_state'][type='radio']:checked", wrapper).val();
            w.vulsdata[point - 1]['audit_state'] = deal_state;
            w.init_view.setModelValue.call(w, point);

        },
        noticeView : function(event){
            var w = event.data.context;
            var wrapper = $("#vuls_modal");
            var point = $("#now_point").val();
            var deal_state = $("input[name='deal_state'][type='radio']:checked", wrapper).val();
            w.vulsdata[point - 1]['audit_state'] = deal_state;
            w.pre_domain_btn_default.hide();
            w.pre_domain_btn_notice.show();
            w.notice_domain_btn.show();
            w.next_domain_btn_default.hide();
            w.next_domain_btn_notice.hide();
            var noticeCount = 0;
            var errorCount = 0;
            var unNoticeCount = 0;
            $.each(w.vulsdata, function(point, item){
                var audit_state = item['audit_state'];
                if(audit_state == 0){
                    noticeCount += 1;
                }else if(audit_state == -1){
                    errorCount += 1;
                }else if(audit_state == -2){
                    unNoticeCount += 1;
                }
            });
            var value = w.vulsdata[point - 1];
            $(".one_notice_count", wrapper).html(noticeCount);
            $(".one_error_notice_count", wrapper).html(errorCount);
            $(".one-unnotice_count", wrapper).html(unNoticeCount);
            $(".one-event-ip-notice", wrapper).html(value['web_ip']);
            $(".one-event-addr-notice", wrapper).html("------");
            $(".one-event-time-notice", wrapper).val(value['happen_time']);
            $(".one-event-type-notice", wrapper).val(value['policy_id']);
            $(".one-event-url-notice", wrapper).val(value['web_domain']);
            $(".one-event-title-notice", wrapper).val(value['web_title']);
            $(".citys", wrapper).citySelect({prov:value['web_ip_province'],city:value['web_ip_city'], dist:value['web_ip_dist'], nodata:"none"});
            w.init_data.initLocation.call(w, value['web_ip_province'], value['web_ip_city']);
            $(".model_content_div", wrapper).hide();
            $(".model_notice_div", wrapper).show();

        },
        noticeVuls : function(event){
            var w = event.data.context;
            var wrapper = $("#vuls_modal");
            $(".model_content_div", wrapper).show();
            $(".model_notice_div", wrapper).hide();
            w.init_view.setModelValue.call(w, w.vulsdata.length - 1);
        },
        closeVuls : function(event){
            var w = event.data.context;
            w.init_view.resetModel.call(w);
            w.modalShow.modal("hide");
        },
        commitNotice : function(event){
            var w = event.data.context;
            var value = $("input:hidden", $(".model_notice_div")).val();
            $.post(__WEBROOT__ + "/Security/VulsInfo/noticeVuls", {vulsList: w.vulsdata, contactList:value}).success(function(json){
                if(json['code']){
                    storm.alert("报送成功");
                    w.vulsinfoTable.fnDraw(true);
                    w.modalShow.modal("hide");
                }else{
                    storm.alert("报送失败");
                }
            });
        },
        uploadFile : function(event){
            var w = event.data.context;
            var target = $(event.target);
            if(target.val()==''){
                return;
            }
            $.ajaxFileUpload({
                url: __ROOT__ + "/Home/Image/uploadImgToServer",
                type: "post",
                secureuri: false,
                fileElementId: "file",
                data:{type: 'security'},
                dataType: 'json', //返回值类型 一般设置为json
                success:function(json){
                    if(json.code){
                        w.init_view.init_pic.call(w, json.path, json.relation_path);
                    }else{
                        storm.alert('图片编辑失败');
                        $("#imgView").attr("src","").show();
                    }
                }
            });
        }
    };

    $(document).ready(function(){
        var vulsInfo = new VulsInfo();
        vulsInfo.init.call(vulsInfo);
    });
})();
