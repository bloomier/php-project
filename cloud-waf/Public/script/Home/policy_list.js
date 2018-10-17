/**
 * Created by jianghaifeng on 2016/3/1.
 */

(function(){

    var WafSite = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_btn = init_btn;
        this.setting = setting;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.parsley = $("#wafForm").parsley();
        w.currentId = $("#currentUserId").val();// 当前用户id,关注人选择时去掉本身
        w.addAction = $("#addActionId").val();  // 添加站点权限
        w.isSystemRole = $("#isSystemRoleId").val();//是否是系统管理员角色
        w.init_view.init_table.call(w);
        w.init_view.init_dialog.call(w);
        w.init_data.init_user_info.call(w);
        w.init_data.init_role_info.call(w);
        w.init_btn.init_bind.call(w);

    }

    var setting = {
        sourceUser:[],
        attentionId:[],
        policyRelation:[]
    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/PolicyList/getPolicyList",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                columns: [
                    { data: '', sWidth: '3%' },
                    { data: '_id', sWidth: '15%' },
                    { data: 'type', sWidth: '10%' },
                    { data: 'desc', sWidth: '10%' },
                    { data: 'site', sWidth: '10%' },
                    { data: 'domains', sWidth: '10%' },
                    { data: 'urls', sWidth: '10%' },
                    { data: 'level', sWidth: '10%' },
                    { data: '' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0,5, 6]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                "order": [[ 1, "asc" ]],
                //"createdRow": function ( row, data, index ) {
                //    //console.info(row);
                //    if($(this).hasClass('selected')){
                //       console.info("ddddd");
                //    }
                //},
                rowCallback:function( row, data, index ){
                    w.currentData = data;
                    var checkBox = $("<input type='checkbox' value="+data['_id']+" name='one'/>");
                    checkBox.bind("click",function(){
                        if ( !$(this).attr("checked")) {
                            // && $(this).closest("tr").hasClass('selected')
                            $(this).closest("tr").removeClass('selected');
                        } else {
                            $(this).closest("tr").addClass('selected');
                        }
                    });
                    $("td:eq(0)",row).html(checkBox);
                    var policyDesc = data['desc'].length<=20?data['desc']:data['desc'].substr(0,20)+"...";
                    $("td:eq(3)",row).html("<p title='"+data['desc']+"'>"+policyDesc+"</p>");
                    var policyMsg = w.setting.policyRelation[data['_id']];

                    var allSite = data['site'];
                    var policyDomain = data['domains']?data['domains'].split(","):[];
                    var showDomain = policyDomain.length>0?"<p title='"+policyDomain.join("\n")+"'>"+policyDomain[0]+"</p>":"";
                    var allUrlstr = [];
                    if(data['urls']){
                        allUrlstr =  data['urls'].split(",");
                    }
                    var url = allUrlstr.length>0&&allUrlstr[0].length>=30?allUrlstr[0].substr(0,30)+"...":allUrlstr[0];
                    var allUrls = allUrlstr.length>0?"<p title='"+allUrlstr.join("\n")+"'>"+url+"</p>":'';
                    $("td:eq(4)",row).html(allSite);
                    if(allSite == '禁用'){
                        $("td:eq(5)",row).html("");
                        $("td:eq(6)",row).html("");
                    }else{
                        $("td:eq(5)",row).html(showDomain);
                        $("td:eq(6)",row).html(allUrls);
                    }
                    $("td:eq(8)",row).html("");
                    //btn-attention
                    var editBtn=$('<a href="javascript:void(0)" title="配置"><i class="fa fa-cogs">&nbsp;配置</i></a>');
                    editBtn.bind("click",function(){
                        location.href = __ROOT__ + "/Home/PolicyList/getPolicyMsg?policyId="+data['_id'];
                        //__functions__.attention.call(w,data['_id']);
                    });

                    $("td:eq(8)",row).append(editBtn);

                },
                initComplete:function(){
                    var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-success" ><i class="fa fa-plus"></i> 取消全网禁用</a>');
                    var deleteBtn=$('<a  href="#" class="btn-delete-all u-btn u-btn-danger" ><i class="fa fa-minus"></i> 全网禁用</a>');
                    var addAllBtn=$('<a  href="#" class="btn-addAll u-btn u-btn-success" ><i class="fa fa-plus"></i> 全网启用</a>');
                    //$(".datatable-btn-warper").html(addBtn);
                    $(".datatable-btn-warper").append(addAllBtn).append("&nbsp;").append(addBtn).append("&nbsp;").append(deleteBtn);

                }
            }));

            //$('#waf_site_table tbody').on( 'click',  'tr', function () {
                //if ( $(this).hasClass('selected') ) {
                //    $(this).removeClass('selected');
                //} else {
                //    $(this).addClass('selected');
                //}
            //} );

            $('#waf_site_table_filter input').attr('placeholder','请输入ID | 名称 | 域名 | url').css('width','220px');
        },
        init_dialog:function(){
            var w = this;
            w.dialog=new BootstrapDialog({
                title: '<h3>添加云防护站点</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                message: function () {
                    return $(".waf-dialog-content").show();
                },
                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){
                            w.parsley.validate();
                            if(w.parsley.isValid()){
                                var param=storm.form.serialize($("#wafForm"));
                                storm.before_dialog_submit(dialogItself);
                                if(param['waf_id']){
                                    //console.info("修改");
                                }else{
                                    $.post(__WEBROOT__ + "/Home/WafSite/add", param).success(function(json){
                                        storm.dialog_submit(dialogItself, w.table,json);
                                        w.__functions__.getAllKindsOfCount.call(w);
                                    });
                                }
                            }
                        }
                    },
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
            });

            w.attention=new BootstrapDialog({
                title: '<h3>添加关注人</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                message: function () {
                    return $(".waf-attention-dialog-content").show();
                },
                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){
                            var form = $("#attentionForm");
                            var resultDiv = $(".result-user", form);
                            var domain = $("input[name='domain']", form).val();
                            var userId = [];
                            $.each(resultDiv.children(), function(point, item){
                                userId.push($(item).attr("userid"));
                            });
                            $.post(__WEBROOT__ + "/Home/WafSite/updateAttentions", {domain:domain,attentions:userId.join(",")}).success(function(json){
                                if(json['code']){
                                    dialogItself.close();
                                }else{
                                   //console.info(json);
                                }
                            });

                        }
                    },
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
            });
        },
        // 初始化关注人
        init_attention:function(){
            var w = this;
            var form = $("#attentionForm");
            var resultDiv = $(".result-user", form);
            resultDiv.html("");
            var domain = $("input[name='domain']", form).val();
            w.setting.attentionId = [];
            $.ajax({
                url:__WEBROOT__ + "/Home/WafSite/listAttentions",
                async : false,
                type : "POST",
                dataType : "json",
                data:{domain:domain},
                success:function(json){
                    $.each(json, function(point, item){
                        for(var i = 0; i < w.setting.sourceUser.length; i++){
                            var value = w.setting.sourceUser[i];
                            if(value["_id"] == item['uid']){
                                var tmpInfo = value['name'] + "[" + value['roles'] + "]";
                                var label = $("<label class='resultUserItem'></label>");
                                label.attr("userId", item['uid']);
                                label.text(tmpInfo);
                                resultDiv.append(label);
                                w.setting.attentionId.push(item['uid']);
                            }
                        }
                    });
                }
            });
        },
        // 初始化联系人
        init_source:function(){
            var w = this;
            var form = $("#attentionForm");
            var sourceDiv = $(".source-user", form);
            sourceDiv.html("");
            var param = $("input[name='queryParam']", form).val();
            $.each(w.setting.sourceUser, function(point, item){
                if(item.roles && item.roles != '系统管理员'){
                //if(item.roles){
                    var tmpInfo = item['name'] + "[" + item.roles.join(",") + "]";
                    var label = $("<label class='sourceUserItem'></label>");
                    label.attr("userId", item['_id']);
                    label.text(tmpInfo);
                    var i = 0;
                    for(; i < w.setting.attentionId.length; i++){
                        var tmp = w.setting.attentionId[i];
                        if(tmp == item["_id"]){
                            break;
                        }
                    }
                    if(i == w.setting.attentionId.length){
                        if(param){
                            if(tmpInfo.indexOf(param) >= 0){
                                sourceDiv.append(label);
                            }
                        }else{
                            sourceDiv.append(label);
                        }
                    }
                }
            });
        }
    }

    var __functions__ = {
        attention: function(domain){
            var w = this;
            $("input[name='domain']", $("#attentionForm")).val(domain);
            w.init_view.init_attention.call(w);
            w.init_view.init_source.call(w);
            w.attention.setTitle("<h3>关注人管理</h3>");
            w.attention.open();
        },
        deleteSite: function(domain,title){
            var w = this;
            var delObjMsg = "<p>您确定要删除<span style='color:red'>"+title+"</span>吗?</p>";
            storm.confirm(delObjMsg,function(){
                $.post(__ROOT__+"/Home/WafSite/delete",{domain: domain}).success(function(json){
                    if(json['code']){
                        //w.table.row.remove().draw(false);
                        w.table.ajax.reload( null, false );
                        storm.alertMsg(json['msg'],"success");
                    }else{
                        storm.alertMsg(json['msg'],"danger");
                    }
                    w.__functions__.getAllKindsOfCount.call(w);
                });
            });
        },
        setTitleColumn: function(row,data){
            var w = this;
            var data = w.currentData;
            $("td:eq(1)",row).html("");
            var title = "";
            if(data && data['title']){
                title = data['title'];
                if(title.length > 10){
                    title = title.substr(0,10) + "...";
                }
            } else {
                title = data['_id'];
            }
            var herfUrl = data['_id'];
            if(herfUrl.substring(0,4) !="http"){
                herfUrl = "http://" + herfUrl;
            }
            var a = "<a target='_blank' href='" + herfUrl + "'>" + title + "</a>"
            $("td:eq(1)",row).html(a);
        },
        setIpPortColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(2)",row).html("");
            if(data && data['ip'] && data['port']){
                $("td:eq(2)",row).html(data['ip'] + ":" + data['port']);
            }
        },
        setVailColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(3)",row).html("");
            if(data && data['siteVail'] && data['siteVail'] == "无法访问"){
                $("td:eq(3)",row).html("<span class='u-label red-label'>无法访问</span>");
            } else {
                $("td:eq(3)",row).html("<span class='u-label green-label'>访问正常</span>");
            }
        },
        setVulsColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(7)",row).html("");
            if(data && data['vulsLevel'] && data['vulsLevel'] == "高危"){
                $("td:eq(7)",row).html("<span class='u-label red-label'>高危</span>");
                //$("td:eq(3)",row).html("<span class='u-label green-label'>安全</span>");
            } else if(data && data['vulsLevel'] && data['vulsLevel'] == "中危") {
                $("td:eq(7)",row).html("<span class='u-label orange-label'>中危</span>");
            } else if (data && data['vulsLevel'] && data['vulsLevel'] == "低危") {
                $("td:eq(7)",row).html("<span class='u-label yellow-label'>低危</span>");
            } else {
                $("td:eq(7)",row).html("<span class='u-label green-label'>安全</span>");
            }
        },
        setSaveStateColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(10)",row).html("");
            if(data && data['bypass'] && data['bypass'] == 1){
                var parent = $('<div class="switch"></div>');
                var button = $('<div class="switch-default ">' +
                '<span class="text">关闭</span><span class="label"></span>' +
                '<input type="checkbox" /></div>');

                button.bind("click",function(){
                    var self = this;
                    var infoMsg = "您是否确认开启云防护";
                    if($(self).hasClass('on')){
                        infoMsg = "您是否确认关闭云防护";
                    }
                    storm.confirm(infoMsg,function(){
                        $(self).toggleClass('on');
                        $(self).hasClass('on') ? $(self).children('span.text').text('开启'):$(self).children('span.text').text('关闭');
                        var bypass = 1;
                        //if($(self).children('span.text').text() == '开启'){
                        if($(self).hasClass('on')){
                            bypass = 0;
                        }
                        w.__functions__.byPassSite.call(w, data["_id"], bypass);
                    });
                });
                parent.append(button);
                $("td:eq(10)",row).html(parent);
            }  else {
                var parent = $('<div class="switch"></div>');
                var button = $('<div class="switch-default on">' +
                '<span class="text">开启</span><span class="label"></span>' +
                '<input type="checkbox" /></div>');

                button.bind("click",function(){
                    var self = this;
                    var infoMsg = "您是否确认开启云防护";
                    if($(self).hasClass('on')){
                        infoMsg = "您是否确认关闭云防护";
                    }
                    storm.confirm(infoMsg,function(){
                        $(self).toggleClass('on');
                        $(self).hasClass('on') ? $(self).children('span.text').text('开启'):$(self).children('span.text').text('关闭');
                        var bypass = 1;
                        if($(self).hasClass('on')){
                            bypass = 0;
                        }
                        w.__functions__.byPassSite.call(w, data["_id"], bypass);
                        // w.__functions__.getAllKindsOfCount.call(w);
                    });

                });
                parent.append(button);
                $("td:eq(10)",row).html(parent);
            }
        },
        setVisitCountColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(8)",row).html("");
            if(data && data['visitCount']){

                $("td:eq(8)",row).html(data['visitCount']);
            }  else {
                $("td:eq(8)",row).html(0);
            }
        },
        setAttackCountColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(8)",row).html("");
            if(data && data['attackCount']){
                $("td:eq(8)",row).html(data['attackCount']);
            }  else {
                $("td:eq(8)",row).html(0);
            }
        },
        setFlowColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(9)",row).html("");
            if(data && data['flow']){
                var unitTemp = "M";
                var flow = data['flow'] / 1024 / 1024 ;
                flow = flow.toFixed(2);
                if(flow == '0.00'){
                    flow = 0.01;
                }
                if(flow > 1024){
                    flow = (flow / 1024).toFixed(2);
                    unitTemp = "G";
                }
                $("td:eq(9)",row).html(flow + unitTemp);
            }  else {
                $("td:eq(9)",row).html(0);
            }
        },
        byPassSite: function(domain,bypass){
            var w = this;
            $.post(__ROOT__+"/Home/WafSite/byPassSite",{"domain":domain, "bypass":bypass}).success(function(json){
                w.__functions__.getAllKindsOfCount.call(w);
            });
        },
        getAllKindsOfCount: function(){
            //$.post(__ROOT__+"/Home/WafSite/getAllKindsOfCount",null).success(function(json){
            //    if(json){
            //        $.each(json, function(point, item){
            //            $("." + point).text(item);
            //        });
            //    }
            //});
        },
        getCheckedBox:function(table){
            var tbody=$("tbody",table);
            var ids=[];
            var checks=$(":checked",tbody);
            $.each(checks,function(i,o){
                ids.push($(o).val());
            });
            return ids;
        }

    }

    var init_data = {
        init_waf_site:function(tag){
            var w = this;
            $.post(__WEBROOT__ + "/Home/WafSite/listAll",{tag:tag}).success(function(json){
                w.table.clear();
                w.table.rows.add(json);
                w.table.draw();
            });

        },
        init_user_info:function(){
            //var w = this;
            //$.ajax({
            //    async: false,
            //    type : "POST",
            //    dataType : 'json',
            //    url:__WEBROOT__ + "/Admin/User/listAll",
            //    success:function(json){
            //        $.each(json, function(point, item){
            //            if(item['_id'] != w.currentId && item['roles']){
            //                w.setting.sourceUser.push(item);
            //            }
            //        });
            //    }
            //});
        },
        init_role_info : function(){
            //var w = this;
            //$.ajax({
            //    async : false,
            //    type : "POST",
            //    dataType : "json",
            //    url : __WEBROOT__ + "/Admin/Role/listAll",
            //    success : function(json){
            //        $.each(w.setting.sourceUser, function(point, item){
            //            var roles = item['roles'];
            //            if(roles){
            //                var roleNames = [];
            //                $.each(roles, function(p, v){
            //                    for(var i = 0; i < json.length; i++){
            //                        var roleInfo = json[i];
            //                        if(roleInfo['_id'] == v){
            //                            roleNames.push(roleInfo['name']);
            //                            break;
            //                        }
            //                    }
            //                });
            //                item['roles'] = roleNames;
            //            }
            //        });
            //    }
            //});
        }
    }

    var init_btn = {
        init_bind : function(){
            var w = this;
            $(".btn-edit").live("click", function(){
                var row= w.table.row($(this).closest("tr"));
                storm.form.init($("#wafForm"),row.data());
                w.dialog.setTitle("<h3>修改云防护站点</h3>");
                w.dialog.setData("row", row);
                w.dialog.open();
            });
            $(".btn-delete").live("click", function(){
                var row= w.table.row($(this).closest("tr"));
                storm.confirm("警告！确定要删除吗？",function(){
                    var _id=row.data()['_id'];
                    $.post(__ROOT__+"/Home/WafSite/delete",{domain:_id}).success(function(json){
                        if(json['code']){
                            row.remove().draw(false);
                        }else{
                            storm.alertMsg(json['msg'],"danger");
                        }
                    });
                });
            });
            $(".btn-add").live("click", function(){
                var rows = w.table.rows('.selected').data();
                var config = true;
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待取消禁用策略!");
                    return ;
                }
                $.each(rows,function(point,row){
                    if(row['site'] == '启用' || row['site'] == '局部禁用'){
                        storm.alertMsg("勾选策略包含已启用或局部禁用策略");
                        config = false;
                        //each中的return true表示continue false表示break;
                        return ;
                    }
                });

                if(config){
                    var policys = __functions__.getCheckedBox($("#waf_site_table"));
                    var param = {};
                    param['config'] = false;
                    param['policyId'] = policys;
                    $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                        if(json['code']){
                            var allSite = {};
                            allSite['policyId'] = policys;
                            allSite['allSite'] = '0';
                            $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(){
                                if(json['code']){
                                    //$.post(__WEBROOT__ + "/Home/PolicyList/getPolicyRelation").success(function(json){
                                    //    w.setting.policyRelation=json;
                                    w.table.ajax.reload(null,false);
                                    //});
                                }else{
                                    storm.alert(json['msg']);
                                }

                            });
                        }
                    });
                }

            });
            $(".btn-delete-all").live("click", function(){
                //console.info(w.table.rows('.selected').data());
                var config = true;
                var rows = w.table.rows('.selected').data();
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待禁用策略!");
                    return ;
                }
                storm.confirm("您确定要禁用这些策略吗？",function(){
                    $.each(rows,function(point,row){
                        if(row['site'] == '禁用'){
                            storm.alertMsg("勾选策略包含已禁用策略");
                            config = false;
                            return ;
                        }
                    });
                    if(config){
                        var policys = __functions__.getCheckedBox($("#waf_site_table"));
                        var param = {};
                        param['config'] = true;
                        param['policyId'] = policys;
                        $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                            if(json['code']){
                                var allSite = {};
                                allSite['policyId'] = policys;
                                allSite['allSite'] = '1';
                                $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(){
                                    if(json['code']){
                                        //$.post(__WEBROOT__ + "/Home/PolicyList/getPolicyRelation").success(function(json){
                                        //    w.setting.policyRelation=json;
                                        w.table.ajax.reload(null,false);
                                        //});
                                    }else{
                                        storm.alert(json['msg']);
                                    }
                                });
                            }
                        });
                    }
                });
            });

            $(".btn-addAll").live('click',function(){
                var rows = w.table.rows('.selected').data();
                var config = true;
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待启用策略!");
                    return ;
                }
                $.each(rows,function(point,row){
                    if(row['site'] == '启用'){
                        storm.alertMsg("勾选策略包含已启用策略");
                        config = false;
                        return ;
                    }
                });
                if(config){
                    var policys = __functions__.getCheckedBox($("#waf_site_table"));
                    var param = {};
                    param['config'] = false;
                    param['policyId'] = policys;
                    $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                        if(json['code']){
                            $.post(__WEBROOT__+ "/Home/PolicyList/startAll",{'policyId':policys}).success(function(date){
                                if(date['code']){
                                    //$.post(__WEBROOT__ + "/Home/PolicyList/getPolicyRelation").success(function(json1){
                                    //    w.setting.policyRelation=json1;
                                    w.table.ajax.reload(null,false);
                                    //});
                                }else{
                                    storm.alert(date['msg']);
                                }
                            })
                        }
                    });
                }
            });

            $("#checkAll_id").live("click", function(){
                if($(this).attr("checked") == "checked"){
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            //console.info(w.table);
                            //console.info(w.table.rows().data());
                            //$(this).click();
                            if ( !$(this).closest("tr").hasClass('selected') ) {
                                $(this).closest("tr").addClass('selected');
                                //$(this).closest("tr").removeClass('selected');
                            }
                            $(this).attr("checked","checked");
                        }
                    );
                }else{
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            if ( $(this).closest("tr").hasClass('selected') ) {
                                // $(this).closest("tr").addClass('selected');
                                $(this).closest("tr").removeClass('selected');
                            }
                            $(this).attr("checked",false);
                        }
                    );
                }
                // alert(w.table.rows('.selected').data().length +' row(s) selected');
            });
            $(".btn-search").bind("click",function(){
                w.init_view.table.draw(true);
            });
            $(".btn-attention").live("click", function(){
                var row = w.table.row($(this).closest("tr"));
                var wafsiteInfo = row.data();
                $("input[name='domain']", $("#attentionForm")).val(wafsiteInfo['_id']);
                w.init_view.init_attention.call(w);
                w.init_view.init_source.call(w);
                w.attention.setTitle("<h3>关注人管理</h3>");
                w.attention.open();
            });
            $(".sourceUserItem").live("dblclick", function(){
                var obj = $(this);
                obj.remove();
                obj.removeClass("sourceUserItem").addClass("resultUserItem");
                var id = obj.attr("userid");
                w.setting.attentionId.push(id);
                $(".result-user", $("#attentionForm")).append($(obj));
            });
            $(".resultUserItem").live("dblclick", function(){
                var obj = $(this);
                obj.remove();
                obj.removeClass("resultUserItem").addClass("sourceUserItem");
                var id = obj.attr("userid");
                var tmpAry = [];
                $.each(w.setting.attentionId, function(point, item){
                    if(item != id){
                        tmpAry.push(item);
                    }
                });
                w.setting.attentionId = tmpAry;
                $(".source-user", $("#attentionForm")).append($(obj));
            });
            $(".attention-search").live("click", function(){
                w.init_view.init_source.call(w);
            });

            $(".font-num").live("click", function(){
                var val = $(this).attr("class")
                var array = val.split(" ");
                if($(this).html() != "0"){
                    $("#clickWhichCountId").val(array[0]);
                    w.table.draw();
                }
            });


            /*开关按钮*/
            //$('.switch div').filter(function(){
            //    $(this).hasClass('on')?
            //        ($(this).children('span.text').text('开启'))
            //        :($(this).children('span.text').text('关闭'));
            //});
            //$('.switch div').click(function(){
            //    $(this).toggleClass('on');
            //    $(this).hasClass('on') ? $(this).children('span.text').text('开启'):$(this).children('span.text').text('关闭');
            //});
        }
    }

    $(document).ready(function(){
        var wafSite=new WafSite();
        wafSite.init.call(wafSite);
    });

})();
