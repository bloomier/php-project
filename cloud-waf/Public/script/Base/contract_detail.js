/**
 *@name
 *@author ancyshi
 *@date 2016/6/13
 *@version
 *@example
 */

(function(){

    var Detail = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.contract_id = $('#current_contract_id').val();
        w.addAction = $("#addActionId").val();  // 添加站点权限
        w.isSystemRole = $("#isSystemRoleId").val();//是否是系统管理员角色
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);
        w.__functions__.getContract.call(w);
    }



    var init_view = {
        init_table:function(){
            var w = this;
            w.table=$("#contract_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/Sites/pageSite/contract_id/" + w.contract_id,
                    type: "post",
                    dataSrc: "items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());
                        d.contract_id = w.contract_id;
                    }
                },
                columns: [
                    { data: '', sWidth: '3%' },
                    { data: 'title', sWidth: '15%' },
                    { data: 'ip', sWidth: '10%' },
                    { data: 'siteVail', sWidth: '10%' },
                    { data: 'vulsLevel', sWidth: '10%' },
                    { data: 'visitCount', sWidth: '10%' },
                    { data: 'attackCount', sWidth: '10%' },
                    { data: 'flow', sWidth: '10%' },
                    { data: 'bypass', sWidth: '10%' },
                    { data: 'domain', sWidth: '12%'  } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0, 9]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                "order": [[ 5, "desc" ]],
                rowCallback:function( row, data, index ){
                    w.currentData = data;
                    __functions__.setTitleColumn.call(w, row);
                    __functions__.setIpPortColumn.call(w, row);
                    __functions__.setVailColumn.call(w, row);
                    __functions__.setVulsColumn.call(w, row);
                    __functions__.setSaveStateColumn.call(w, row);
                    __functions__.setVisitCountColumn.call(w, row);
                    __functions__.setAttackCountColumn.call(w, row);
                    __functions__.setFlowColumn.call(w, row);
                    var checkBox = $("<input type='checkbox' name='one'/>");
                    checkBox.bind("click",function(){
                        if ( !$(this).attr("checked")) {
                            // && $(this).closest("tr").hasClass('selected')
                            $(this).closest("tr").removeClass('selected');
                        } else {
                            $(this).closest("tr").addClass('selected');
                        }
                    });
                    // var row= w.table.row($(this).closest("tr"));

                    //$("td:eq(9)",row).addClass('text-center').html("");
                    $("td:eq(9)",row).html("");
                    //btn-attention
                    var attentionBtn=$('<a href="javascript:void(0)" title="关注人管理"><i class="fa fa-cogs"></i></a>');
                    attentionBtn.bind("click",function(){
                        __functions__.attention.call(w,data['domain']);
                    });
                    var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                    deleteBtn.bind("click",function(){
                        var title = data['title']?data['title']:data['domain'];
                        __functions__.deleteSite.call(w,data['domain'],title);
                    });
                    var location=__ROOT__+"/Home/DailyReport/index/domain/"+data['domain'];
                    var reportBtn=$('<a class="btn-report " target="_blank" href="'+location+'" title="查看报告"><i class="fa fa-file-text"></i></a>');
                    var location2=__ROOT__+"/Home/Screen/index/domain/"+data['domain'];
                    var screenBtn=$('<a class="btn-screen" target="_blank"  href="'+location2+'" title="实时监控"><i class="fa fa-desktop"></i></a>');

                    $("td:eq(9)",row).append(reportBtn).append(screenBtn);
                    if(data['relation_type'] == 1){
                        $("td:eq(9)",row).append(deleteBtn);
                        $("td:eq(0)",row).html(checkBox);
                    } else {
                        //当不是系统管理员角色时，删除站点按钮才有必要显示，如果是系统管理员角色删除后，还是会显示所有站点
                        if(!w.isSystemRole){
                            $("td:eq(9)",row).append(deleteBtn);
                        } else {
                            //$("td:eq(9)",row).append(attentionBtn);
                        }
                        $("td:eq(0)",row).html('');
                    }

                    var editBtn=$('<a href="javascript:void(0)" title="编辑"><i class="fa fa-edit"></i></a>');
                    ///contract_id/" + w.current_contract['_id'] + "/client_id/" + w.current_contract['client']
                    editBtn.bind("click",function(){
                        var href = __ROOT__ + "/Home/Sites/updateSitePage/_id/" + data['_id'] + "/contract_id/" + w.current_contract['_id'] + "/client_id/" + w.current_contract['client'];
                        window.location.href = href;
                    });

                    $("td:eq(9)",row).append(editBtn);
                },
                initComplete:function(){
                    if(w.addAction){
                        var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-success" ><i class="fa fa-plus"></i> 添加站点</a>');
                        var deleteBtn=$('<a  href="#" class="btn-delete-all u-btn u-btn-danger" ><i class="fa fa-minus"></i> 删除站点</a>');
                        $(".datatable-btn-warper").append(addBtn).append("&nbsp;").append(deleteBtn);
                    }
                }
            }));


            $('#waf_site_table_filter input').attr('placeholder','客户名称|客户电话  ');
        }
    }


    var __functions__ = {
        getContract: function(){
            var w = this;
            var param = {
                contract_id: w.contract_id
            }
            var texts = ['no','name','begin_date','end_date',
                        'seller_name','create_time','client_name',
                        'project_manager_name','create_user_name',
                        'client_phone_num','client_email']
            $.post(__WEBROOT__ + "/Base/Contract/showDetail", param).success(function(json){
                if(json.code){
                    var data = json.data;
                    w.current_contract = data;
                    $.each(texts,function(i,item){
                        $('.' + item).text(data[item] || '');
                        //console.info(json.data[item]);
                    });
                    console.info(json);
                } else {

                }
                //storm.dialog_submit(w.dialog, w.table, json);
            });
        },
        deleteSite: function(domain,title){
            var w = this;
            var delObjMsg = "<p>您确定要删除<span style='color:red'>"+title+"</span>吗?</p>";
            storm.confirm(delObjMsg,function(){
                $.post(__ROOT__+"/Home/Sites/delete",{domain: domain}).success(function(json){
                    if(json['code']){
                        //w.table.row.remove().draw(false);
                        w.table.ajax.reload( null, false );
                        storm.alertMsg(json['msg'],"success");
                    }else{
                        storm.alertMsg(json['msg'],"danger");
                    }
                });
            });
        },
        setTitleColumn: function(row,data){
            var w = this;
            var data = w.currentData;
            $("td:eq(1)",row).html("");
            var title = "";
            if(data && data['name']){
                title = data['name'];
                if(title.length > 10){
                    title = title.substr(0,10) + "...";
                }
            } else {
                title = data['domain'];
            }
            var tempDomain = data['domain'];
            if(tempDomain.length > 25){
                tempDomain = tempDomain.substr(0,25) + "...";
            }
            var herfUrl = data['domain'];
            if(herfUrl.substring(0,4) !="http"){
                herfUrl = "http://" + herfUrl;
            }
            var protect_mode = data.zone_rule['rule_engine'];
            if(protect_mode == 'detect'){
                protect_mode = '<span class="circle-label">检</span>';
            } else if(protect_mode == 'on'){
                protect_mode = '<span class="circle-label">防</span>';
            } else {//'off'
                protect_mode = '<span class="circle-label">转</span>';
            }
            var a = "<div class='inline'><a target='_blank' href='" + herfUrl + "'>" + title + "</a><span>" + tempDomain + "</span></div>";
            $("td:eq(1)",row).html(protect_mode + a );
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
            $("td:eq(4)",row).html("");
            if(data && data['vulsLevel'] && data['vulsLevel'] == "高危"){
                $("td:eq(4)",row).html("<span class='u-label red-label'>高危</span>");
                //$("td:eq(3)",row).html("<span class='u-label green-label'>安全</span>");
            } else if(data && data['vulsLevel'] && data['vulsLevel'] == "中危") {
                $("td:eq(4)",row).html("<span class='u-label orange-label'>中危</span>");
            } else if (data && data['vulsLevel'] && data['vulsLevel'] == "低危") {
                $("td:eq(4)",row).html("<span class='u-label yellow-label'>低危</span>");
            } else {
                $("td:eq(4)",row).html("<span class='u-label green-label'>安全</span>");
            }
        },
        setSaveStateColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(8)",row).html("");
            if(data && data['dos'] && data['dos'] == 1){
                var parent = $('<div class="switch"></div>');
                var button = $('<div class="switch-default ">' +
                '<span class="text">关闭</span><span class="label"></span>' +
                '<input type="checkbox" /></div>');

                button.bind("click",function(){
                    var self = this;
                    var infoMsg = "您是否确认开启站点";
                    if($(self).hasClass('on')){
                        infoMsg = "您是否确认关闭站点";
                    }
                    storm.confirm(infoMsg,function(){
                        $(self).toggleClass('on');
                        $(self).hasClass('on') ? $(self).children('span.text').text('开启'):$(self).children('span.text').text('关闭');
                        var dos = 1;
                        //if($(self).children('span.text').text() == '开启'){
                        if($(self).hasClass('on')){
                            dos = 0;
                        }
                        w.__functions__.switchSite.call(w, data["domain"], dos);
                    });
                });
                parent.append(button);
                $("td:eq(8)",row).html(parent);
            }  else {

                var parent = $('<div class="switch"></div>');
                var button = $('<div class="switch-default on">' +
                '<span class="text">开启</span><span class="label"></span>' +
                '<input type="checkbox" /></div>');

                button.bind("click",function(){
                    var self = this;
                    var infoMsg = "您是否确认开启站点";
                    if($(self).hasClass('on')){
                        infoMsg = "您是否确认关闭站点";
                    }
                    storm.confirm(infoMsg,function(){
                        $(self).toggleClass('on');
                        $(self).hasClass('on') ? $(self).children('span.text').text('开启'):$(self).children('span.text').text('关闭');
                        var dos = 1;
                        if($(self).hasClass('on')){
                            dos = 0;
                        }
                        w.__functions__.switchSite.call(w, data["domain"], dos);
                        // w.__functions__.getAllKindsOfCount.call(w);
                    });

                });
                parent.append(button);
                $("td:eq(8)",row).html(parent);
            }
        },
        setVisitCountColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(5)",row).html("");
            if(data && data['visitCount']){

                $("td:eq(5)",row).html(data['visitCount']);
            }  else {
                $("td:eq(5)",row).html(0);
            }
        },
        setAttackCountColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(6)",row).html("");
            if(data && data['attackCount']){
                $("td:eq(6)",row).html(data['attackCount']);
            }  else {
                $("td:eq(6)",row).html(0);
            }
        },
        setFlowColumn: function(row){
            var w = this;
            var data = w.currentData;
            $("td:eq(7)",row).html("");
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
                $("td:eq(7)",row).html(flow + unitTemp);
            }  else {
                $("td:eq(7)",row).html(0);
            }
        },
        switchSite: function(domain,dos){
            var w = this;
            $.post(__ROOT__+"/Home/Sites/switchSite",{"domain":domain, "dos": dos}).success(function(json){
                w.__functions__.getAllKindsOfCount.call(w);
            });
        }

    }


    var init_btn = {
        init_bind : function(){
            var w = this;


            $(".btn-add").live("click", function(){
                var href = __ROOT__ + "/Home/Sites/addSite/contract_id/" + w.current_contract['_id'] + "/client_id/" + w.current_contract['client'];
                window.location.href = href;
            });
            $(".btn-delete-all").live("click", function(){
                //console.info(w.table.rows('.selected').data());
                var rows = w.table.rows('.selected').data();
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待删除项!");
                    return ;
                }
                storm.confirm("您确定要删除勾选项目吗？",function(){
                    var domains = "";
                    $.each(rows, function(i,item){
                        domains += item.domain + ",";
                    });
                    domains = domains.substr(0,domains.length - 1);
                    $.post(__ROOT__+"/Home/Sites/batchDelete",{domains: domains}).success(function(json){
                        if(json['code']){
                            w.table.ajax.reload( null, false );
                            storm.alertMsg(json['msg'],"success");
                        } else {
                            storm.alertMsg(json['msg'],"danger");
                        }

                        $("#checkAll_id").attr("checked",false);
                    });
                });
            });

            $("#checkAll_id").live("click", function(){
                if($(this).attr("checked") == "checked"){
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            if ( !$(this).closest("tr").hasClass('selected') ) {
                                $(this).closest("tr").addClass('selected');
                            }
                            $(this).attr("checked","checked");
                        }
                    );
                }else{
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            if ( $(this).closest("tr").hasClass('selected') ) {
                                $(this).closest("tr").removeClass('selected');
                            }
                            $(this).attr("checked",false);
                        }
                    );
                }
            });


        }
    }

    $(document).ready(function(){
        var detail = new Detail();
        detail.init.call(detail);
    });

})();