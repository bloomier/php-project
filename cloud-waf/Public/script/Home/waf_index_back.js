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
        w.init_view.init_table.call(w);
        w.init_view.init_dialog.call(w);
        w.init_data.init_waf_site.call(w);
        w.init_data.init_user_info.call(w);
        w.init_data.init_role_info.call(w);
        w.init_btn.init_bind.call(w);

    }

    var setting = {
        sourceUser:[],
        attentionId:[]
    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    //url: __WEBROOT__ + "/Home/WafSite/listAll",
                    url: __WEBROOT__ + "/Home/WafSite/pageSite",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                columns: [
                    { data: '_id',width: '25%' },
                    { data: 'ip',width: '20%' },
                    { data: 'port',width: '10%' },
                    { data: '' ,width: '45%'}
                ],
                columnDefs:[
                    {orderable:false,targets:[1]}
                ],
                rowCallback:function( row, data, index ){
                    $("td:eq(3)",row).html("");
                    //btn-attention
                    var editBtn=$('<a class="green-label" style="margin-left:5px" href="javascript:void(0)">关注人管理</a>');
                    editBtn.bind("click",function(){
                        __functions__.attention.call(w,data['_id']);
                    });
                    var deleteBtn=$('<a class="red-label" style="margin-left:5px"  href="javascript:void(0)">删除</a>');
                    deleteBtn.bind("click",function(){
                        __functions__.deleteSite.call(w,data['_id']);
                    });
                    var location=__ROOT__+"/Home/DailyReport/index/domain/"+data['_id'];
                    var reportBtn=$('<a class="btn-report  green-label " style="margin-left:5px" target="_blank" href="'+location+'">查看报告</a>');
                    var location2=__ROOT__+"/Home/Screen/index/domain/"+data['_id'];
                    var screenBtn=$('<a class="btn-screen  yellow-label" style="margin-left:5px" target="_blank"  href="'+location2+'">实时监控</a>');
                    if(data['relation_type'] == 2){
                        deleteBtn.text("取消关注");
                        $("td:eq(3)",row).append(deleteBtn);
                    }else{
                        $("td:eq(3)",row).append(deleteBtn).append(editBtn);
                    }
                    $("td:eq(3)",row).append(reportBtn).append(screenBtn);

                },
                initComplete:function(){
                    // var addBtn=$('<a class="btn-add btn btn-sm btn-primary" href="javascript:void(0)">添加</a>');
                    if(w.currentId == 1){
                        var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-default" ><i class="fa fa-plus"></i> 添加站点</a>');
                        $(".datatable-btn-warper").html(addBtn);
                    }

                    /*var search = $('<div class="col-sm-7 col-sm-offset-3">'+
                        '<div class="col-sm-6 col-sm-offset-6">' +
                            '<div class="input-group">' +
                                '<input id="extra" type="text" placeholder="域名 | IP | 端口" name="param" class="input-md form-control" style="width: 200px;"> <span class="input-group-btn">' +
                                    '<button type="button" class="btn btn-md btn-primary btn-search"> 搜索</button> </span>' +
                                '</div>' +
                            '</div>' +
                        '</div>'
                        );
                    $(".datatable-btn-search").html(search);*/
                }
            }));

            $('#waf_site_table_filter input').attr('placeholder','请输入域名')
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
                                   console.info(json);
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
                if(item.roles){
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
        deleteSite: function(domain){
            var w = this;
            storm.confirm("您确定要删除吗？",function(){
                $.post(__ROOT__+"/Home/WafSite/delete",{domain: domain}).success(function(json){
                    if(json['code']){
                        //w.table.row.remove().draw(false);
                        w.table.ajax.reload( null, false );
                    }else{
                        Message.init({
                            text:json['msg'],
                            type:"danger"
                        });
                    }
                });
            });
        }
    }

    var init_data = {
        init_waf_site:function(){
            //var w = this;
            //$.post(__WEBROOT__ + "/Home/WafSite/listAll").success(function(json){
            //    w.table.clear();
            //    w.table.rows.add(json);
            //    w.table.draw();
            //});

        },
        init_user_info:function(){
            var w = this;
            $.ajax({
                async: false,
                type : "POST",
                dataType : 'json',
                url:__WEBROOT__ + "/Admin/User/listAll",
                success:function(json){
                    $.each(json, function(point, item){
                        if(item['_id'] != w.currentId && item['roles']){
                            w.setting.sourceUser.push(item);
                        }
                    });
                }
            });
        },
        init_role_info : function(){
            var w = this;
            $.ajax({
                async : false,
                type : "POST",
                dataType : "json",
                url : __WEBROOT__ + "/Admin/Role/listAll",
                success : function(json){
                    $.each(w.setting.sourceUser, function(point, item){
                        var roles = item['roles'];
                        if(roles){
                            var roleNames = [];
                            $.each(roles, function(p, v){
                                for(var i = 0; i < json.length; i++){
                                    var roleInfo = json[i];
                                    if(roleInfo['_id'] == v){
                                        roleNames.push(roleInfo['name']);
                                        break;
                                    }
                                }
                            });
                            item['roles'] = roleNames;
                        }
                    });
                }
            });
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
                            Message.init({
                                text:json['msg'],
                                type:"danger"
                            });
                        }
                    });
                });
            });
            $(".btn-add").live("click", function(){
                storm.form.reset($("#wafForm"));
                w.dialog.setTitle("<h3>添加云防护站点</h3>");
                w.dialog.setData("row", null);
                w.dialog.open();
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
        }
    }

    $(document).ready(function(){
        var wafSite=new WafSite();
        wafSite.init.call(wafSite);
    });

})();
