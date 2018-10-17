$.ajaxSetup ({
    aysnc: false  // 默认同步加载
});
(function(){
    var eventTable;
    var eventDialog;
    var checkDialog;
    var confirmDialog;
    var filterParam=[];
    var dialogs = [];
    var curData = null;
    var curNum = 0;
    var allNum = 0;
    var deal_state_flag = 2;
    var img_path = $("#img_path_id").val();
    var event_type_config = {};

    $(function(){
        _init_.view();
        _init_.initView();
        // 获取所有事件类型与对应中文
        var obj = $("#eventType").get(0).options;
        for(var i = 0, num = obj.length; i < num; i++){
            if(obj[i].value != ''){
                event_type_config[obj[i].value] = obj[i].text;
            }
        }

        _event_.bind();

    });

    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $(".citys").citySelect({prov:"全国",city:"全省"});
            $(".city_search").provinceSelect({prov:"全国"});
        },
        initView : function(){
            // 设置参数 如果传递过来省份不为空，初始化表时，传递参数
            var province = $("#default_province_id").val();
            if(province && province != "" && province != "全国"){
                // $("#is_area_id").val(province);
                // $("#is_area_id").select2("val",province);
                filterParam=[];
                filterParam.push({name:"web_ip_province",value:province});
            }
            eventTable=$("#eventTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/Event/eventCheckList',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'event_id'},
                    {"mDataProp": 'site_domain'},
                    {"mDataProp": 'site_title'},
                    {"mDataProp": 'web_ip_addr'},
                    {"mDataProp": 'event_count'},
                    {"mDataProp": 'last_time'},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[5],"mRender":function(value,type,aData){
                        if(value){
                            return value.substr(0,19);
                        }else{
                            return "";
                        }
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['site_domain']+"'>");
                    var title=aData['site_title'];
                    var titleLabel="";
                    if(title.length>15){
                        titleLabel = $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + title + "'>" + title.substr(0,15) + "...</span>");
                    }else{
                        titleLabel = $("<span class=\"medium\" style=\"width:100px;overflow: hidden;word-break: break-all\" title='" + title + "'>" + title + "</span>");
                    }
                    $('td:eq(2)',nRow).html(titleLabel);
                    if(aData['event_id']==1){
                        $('td:eq(0)', nRow).html("");
                        $('td:eq(4)', nRow).html("root");
                    }else{
                        $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['event_id']+"'>");
                        var checkBtn=$('<a class="btn blue-stripe mini" href="#">审核</a>');
                        checkBtn.bind("click",function(){
                            curNum = 0;
                            curData = aData;
                            for(var i = 0,num = curData.event_list.length; i < num; i++){
                                curData.event_list[i].deal_state = 2;
                                // alert(curData.event_list[i].event_type);
                            }
                            __functions__.setValues();
                            __functions__.viewEdit(aData);
                            var prov = curData.event_list[0].web_ip_province;
                            var city = curData.event_list[0].web_ip_city;
                            __functions__.setSelectValue(prov,city);
                        });
                        $('td:eq(6)', nRow).append(checkBtn);
                    }
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));

            eventDialog=new BootstrapDialog({
                title: '<h3>事件审核</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                size: BootstrapDialog.SIZE_WIDE,
                closable: false,
                message: function(){
                    return $(".event-dialog-content").show();
                },
                buttons: [{
                    label: '下一个',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        curNum = curNum + 1;
                        __functions__.setValues();
                        __functions__.viewEdit(curData);
                    }
                },{
                    label: '关闭',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
            });

            checkDialog=new BootstrapDialog({
                title: '<h3>事件审核</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                size: BootstrapDialog.SIZE_WIDE,
                closable: false,
                message: function(){
                    return $(".check-dialog-content").show();
                },
                buttons: [{
                    label: '上一个',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        dialogItself.close();
                        curNum = allNum - 1;
                        __functions__.setValues();
                        eventDialog.open();
                    }
                }, {
                    label: '通报',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        var group_users = $(".select2").select2("val");
                        curData.group_users = group_users.join("@@");
                        $.post(__ROOT__+"/Security/WhiteList/hadWhiteList",{curData:curData} ).success(function(json){
                            if(json.code > 0){
                                __functions__.setContrctDialogValues(json.other);
                            } else {
                                __functions__.reportEvent();
                                checkDialog.close();
                                //$.post(__ROOT__+"/Security/Event/event_check",{curData:curData} ).success(function(json){
                                //    if(json.code > 0){
                                //        checkDialog.close();
                                //        storm.alert(json.msg);
                                //        eventTable.fnDraw(false);
                                //    }
                                //});
                            }
                        });
                    }
                },{
                    label: '关闭',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
            });

            confirmDialog=new BootstrapDialog({
                title: '<h3><font color="#dc143c" font-size="8">郑重提示——>重点监测网站</font></h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                closable: false,
                message: function(){
                    return $(".confirm-dialog-content").show();
                },
                buttons: [{
                    label: '立即通报',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        dialogItself.close();
                        __functions__.reportEvent();
                    }
                }, {
                    label: '延迟通报',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        dialogItself.close();
                        var data = curData;
                        __functions__.onTimeOutDo(data);
                    }
                },{
                    label: '不通报',
                    action: function(dialogItself){
                        dialogItself.close();
                        __functions__.setDeal_state(6);
                        __functions__.reportEvent();
                    }
                }]
            });

        }
    };

    var _event_ = {
        bind : function(){
            $("#a_id").live("click",function(){
                //火狐获取不到file的onchange事件因此添加此事件，span的click和file的onchange不会同时发生
                // $("#file").click();
                $("#file").trigger("click");
            });
            $("#file").live("change",function(){
                if($(this).val()==''){
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
                        if(json.code > 0){
                            var src = json.path;
                            $("#imgView").attr("src",src).show();
                            $(".one-event-pic").attr("href", src);
                            $(".fancybox-button").fancybox({
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
                            curData.event_list[curNum].event_snapshot = json.relation_path;
                            //storm.alert('图片编辑成功');
                        }else{
                            storm.alert('图片编辑失败');
                            $("#imgView").attr("src","").show();
                        }
                    }
                });
            });
            //处理状态变化时，赋值给当前对象
            $("[name='deal_state']").bind("click",function(){
                deal_state_flag = $(this).val();
                curData.event_list[curNum].deal_state = deal_state_flag;
            });

            $("#event_type_id").bind("change",function(){
                curData.event_list[curNum].event_type = $(this).val();
            });

            //省份变化时
            $(".prov-location").live("change", function(){
                var city = $(".city-location").val();
                var prov = $(".prov-location").val();
                __functions__.setSelectValue(prov,city);
                if($(".prov-location").val() != "" && $(".prov-location").val() != "全国"){
                    curData.event_list[0].web_ip_province = $(".prov-location").val();
                }
                if($(".city-location").val() != "" && $(".city-location").val() != "全省"){
                    curData.event_list[0].web_ip_city = $(".city-location").val();
                }
            });

            $(".city-location").live("change", function(){
                var city = $(".city-location").val();
                var prov = $(".prov-location").val();
                __functions__.setSelectValue(prov,city);
                if($(".prov-location").val() != "" && $(".prov-location").val() != "全国"){
                    curData.event_list[0].web_ip_province = $(".prov-location").val();
                }
                if($(".city-location").val() != "" && $(".city-location").val() != "全省"){
                    curData.event_list[0].web_ip_city = $(".city-location").val();
                }
            });

            $(".one-event-desc").live("change", function(){
                var event_desc = $(".one-event-desc").val();
                curData.event_list[curNum].event_desc = event_desc;
            });

            //设置IP
            $(".check-event-ip").live("change", function(){
                var web_ip = $(".check-event-ip").val();
                //设置第一个的web_ip为ip
                if(web_ip != ""){
                    curData.web_ip = web_ip;
                    curData.event_list[0].web_ip = web_ip;
                }
            });
            //设置标题
            $(".check-event-title").live("change", function(){
                var web_title = $(".check-event-title").val();
                //设置第一个的web_ip为ip
                if(web_title != ""){
                    curData.site_title = web_title;
                    curData.event_list[0].web_title = web_title;
                }
            });
            $(".btn-search").bind("click",function(){

                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                var event_type = $("#eventType").val();
                if(event_type!=''){
                    filterParam.push({name:"event_type",value:event_type});
                }
                var province = $("#is_area_id").val();
                if(province != "" && province != "全国"){
                    filterParam.push({name:"web_ip_province",value:province});
                }
                // 重新加载数据，并定位到第一页
                eventTable.fnPageChange(0);
                // eventTable._fnDraw(true);


            });

        }
    };

    var __functions__={
        viewEdit:function(aData){
            //alert(aData['list'].length);
            curData = aData;
            allNum = aData['event_list'].length;
            var title = "<h3>事件审核(" + (curNum + 1)+ "/" + allNum + ")</h3>";
            var buttons = this.getButtons(curNum,allNum);
            eventDialog.setButtons(buttons);
            eventDialog.setTitle(title);
            eventDialog.open();

        },
        reportEvent: function(){
            $.post(__ROOT__+"/Security/Event/event_check",{curData:curData} ).success(function(json){
                if(json.code > 0){
                    //checkDialog.close();
                    storm.alert(json.msg);
                    eventTable.fnDraw(false);
                }
            });
        },
        //获取Buttons
        getButtons: function(beginNum,allNum){
            var buttons = [];
            if(beginNum != 0){
                buttons.push({
                    label: '上一个',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        if(beginNum != 0){
                            curNum = curNum - 1;
                            __functions__.setValues();
                            __functions__.viewEdit(curData);
                        }
                    }
                });
            }
            if(beginNum != allNum) {
                buttons.push({
                    label: '下一个',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function (dialogItself) {
                        if(beginNum < allNum){
                            curNum = curNum + 1;
                            if(curNum != allNum){
                                __functions__.setValues();
                                __functions__.viewEdit(curData);
                                //alert(deal_state_flag);
                            } else {
                                // curNum = curNum -1;
                                //alert("goin check");
                                eventDialog.close();
                                __functions__.setValues(true);
                                checkDialog.open();
                            }
                        }
                    }
                });
            } else {
                buttons.push({
                    label: '通报',
                    hotkey: 13,
                    cssClass: 'btn-primary',
                    action: function (dialogItself) {

                    }
                });
            }
            buttons.push({
                label: '关闭',
                action: function(dialogItself){
                    //释放资源并清空
                    curNum = 0;
                    dialogItself.close();
                }
            });

            return buttons;
        },
        //设置dialog的上各个属性的值
        setValues:function(check){
            if(!check){
                var oneEvent = curData.event_list[curNum];
                $('input:radio').each(function(index,domEle){
                    if ($("input[name='deal_state']").eq(index).val() == oneEvent.deal_state){
                        $("input[name='deal_state']").eq(index).attr("checked","checked");
                        $("input[name='deal_state']").eq(index).click();
                    } else {
                        $("input[name='deal_state']").eq(index).removeAttr("checked");
                    }
                });

                var event_desc = oneEvent.event_desc;
                var event_id  = oneEvent.event_id;
                var event_source = oneEvent.event_source;
                var event_snapshot = oneEvent.event_snapshot;
                var event_type = oneEvent.event_type;
                var event_type_cn = event_type_config[event_type] || "其他";//oneEvent.event_type_cn;

                // 设置事件类型
                var ops = "";
                var oneP = "";
                for ( var p in event_type_config ){
                    if(p == event_type){
                        ops += "<option value='" + p + "' selected>" + event_type_config[p] + "</option>";
                        $("#event_type_id").val(p + "");
                    } else {
                        ops += "<option value='" + p + "'>" + event_type_config[p] + "</option>";
                    }
                }
                $("#event_type_id").select2("val",event_type);


                var last_modify_date = oneEvent.last_modify_date;
                var last_modify_user = oneEvent.last_modify_user;
                var web_domain = oneEvent.web_domain;
                var web_ip = oneEvent.web_ip;
                var web_ip_addr = oneEvent.web_ip_addr;
                var web_ip_city = oneEvent.web_ip_city;
                var web_ip_province = oneEvent.web_ip_province;
                var web_title = oneEvent.web_title;
                var web_url = oneEvent.web_url;
                var aTag = "<a href='" + web_url + "' target='_blank'>" + web_url + "</a>"
                $(".one-event-url").html(aTag);
                $(".one-event-time").text(last_modify_date);
                $(".one-event-type").text(event_type_cn);
                $(".one-event-submiter").text(last_modify_user);
                $(".one-event-desc").text(event_desc);
                if(event_snapshot != null && event_snapshot != "" && event_snapshot.length > 5){
                    event_snapshot = img_path + "/upload/" + event_snapshot;
                    $("#imgView").attr("src",event_snapshot).show();
                    $(".one-event-pic").attr("href", event_snapshot);

                } else {
                    $("#imgView").attr("src",img_path + "/upload/security/2015-16-07/1437038593.png").show();
                    $(".one-event-pic").attr("href", img_path + "/upload/security/2015-16-07/1437038593.png");
                }
                $(".fancybox-button").fancybox({
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

            } else {
                //alert('check');
                var reportNum = 0;
                var errorNum = 0;
                var noExditNum = 0;
                var noReportNum = 0;
                for(var i = 0,num = curData.event_list.length; i < num; i++){
                    if(curData.event_list[i].deal_state == 2){
                        reportNum++;
                    } else if(curData.event_list[i].deal_state == 4){
                        errorNum++;
                    } else if(curData.event_list[i].deal_state == 5){
                        noExditNum++;
                    }else {
                        noReportNum++;
                    }
                }
                // 设置各种统计数量
                $("#reportNum_ID").html("&nbsp;" + reportNum);
                $("#errorNum_ID").html("&nbsp;" + errorNum);
                $("#noExitNum_ID").html("&nbsp;" + noExditNum);
                $("#noReportNum_ID").html("&nbsp;" + noReportNum);
                // 设置div宽度
                $("#reportDiv_ID").width(reportNum * 10);
                $("#errorDiv_ID").width(errorNum * 10);
                $("#noExitDiv_ID").width(noExditNum * 10);
                $("#noReportDiv_ID").width(noReportNum * 10);

                var oneEvent = curData.event_list[0];
                var event_desc = oneEvent.event_desc;
                var event_snapshot = oneEvent.event_snapshot;
                var web_domain = oneEvent.web_domain;
                var web_ip = oneEvent.web_ip;

                var web_ip_province = oneEvent.web_ip_province;
                var web_title = oneEvent.web_title;
                var web_url = oneEvent.web_url;

                var prov = oneEvent.web_ip_province;
                var city = oneEvent.web_ip_city;

                prov = prov.indexOf("省") != -1 ? prov.substr(0,prov.length -1) : prov;
                city = city.indexOf("市") != -1 ? city.substr(0,city.length -1) : city;

                var proCity = "";
                if(prov != "" && prov != "未知" && prov != city){
                    proCity = prov + city;
                } else {
                    if(prov != "" && prov != "未知" && prov == city ){
                        proCity = prov;
                    }
                }
                $(".citys").citySelect({prov:prov,city:city});
                var aTag = "<a href='" + web_url + "' target='_blank'>" + web_domain + "</a>";
                $(".check-event-domain").html(aTag);
                $(".check-event-title").text(web_title);
                $(".check-event-ip").text(web_ip);
                // var mixin = __functions__.getMiXin();
                var email = __functions__.getEmail();
                // $(".one-event-mixin").text(mixin);
                // $(".one-event-email").text(email);

            }
        },// 初始化行政归属
        setSelectValue: function(province,city){
            $.post(__ROOT__+"/Security/Event/queryByLocation", {province:province,city:city}).success(function(json){
                var contactTarget = json.rows;

                var a = [];
                $.each(contactTarget, function(point, item){
                    var one = {};
                    one.id = item.groupId;
                    one.text = item.groupName;
                    a.push(one);
                });

                var select = $(".select2");
                select.select2({tags:a});
                select.select2("data",a);
            });

        },
        getMiXin:function(){
            var mixin = "";
            if(curData){
                var list = curData.event_list;
                for(var i = 0,num = list.length; i < num; i++){
                    mixin += list[i].event_desc;
                }
            }
            return mixin;
        },//获取密信和邮件内容
        getEmail:function(){
            var email = "";
            var mixin = "";
            if(curData){
                var event_ids ="";
                var list = curData.event_list;
                for(var i = 0,num = list.length; i < num; i++){
                    if(list[i].deal_state == 2){
                        event_ids = event_ids + "," + list[i].event_id;
                    }
                }
                //{province:event_ids}
                if(event_ids != ""){
                    $.post(__ROOT__+"/Security/Event/getEmailContent",{curData:curData} ).success(function(json){
                        if(json.other){
                            mixin = json.other.mixin_content;
                            email = json.other.email_content;
                            $(".one-event-mixin").text(mixin);
                            //$(".one-event-email").text(email);
                            $("#email").html(email);
                        } else {
                            $(".one-event-mixin").text("");
                            // $(".one-event-email").text("");
                            $("#email").html("");
                        }

                    });
                }
            }
        },
        setContrctDialogValues: function(json){
            var oneEvent = curData.event_list[0];
            var web_domain = oneEvent.web_domain;
            var web_title = oneEvent.web_title;


            var client_name = json.client_name;
            var client_phone = json.client_phone;
            var sale_responsible = json.sale_responsible;
            var area_responsible = json.area_responsible;
            $(".site_domain").text(web_domain);
            $(".site_name").text(web_title);
            $(".client_name").text(client_name);
            $(".client_phone").text(client_phone);
            $(".sale_responsible").text(sale_responsible);
            $(".area_responsible").text(area_responsible);
            checkDialog.close();
            confirmDialog.open();
        },
        setDeal_state: function(state){
            var list = curData.event_list;
            for(var i = 0,num = list.length; i < num; i++){
                list[i].deal_state == state;
            }
        },
        onTimeOutDo: function(data){
            //默认5分钟后执行
            window.setTimeout(function(){
                //alert("ok");
                $.post(__ROOT__+"/Security/Event/event_check",{curData: data} ).success(function(json){
                    if(json.code > 0){
                        storm.alert(json.msg);
                        eventTable.fnDraw(false);
                    }
                });
            },60000 * 5);
        }
    };

})();