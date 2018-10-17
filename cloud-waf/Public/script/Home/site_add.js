/**
 * Created by ancyshi on 2016/5/18.
 */



(function(){
    var addSitesTable; //添加站点的列表
    var addUserTable; //添加告警联系人列表
    var currentEditRow ;     //当前编辑行
    var allowMaxCount = 50;  //允许一次添加的最大站点数
    var o={
        init:function(){
            //o.setDefaultValue();
            o.initTable();
            o.initData();
            o.handler();
            //o.getContractList();
            //o.getClientList();
            o.initSelects();
        },
        view:function(){


        },
        initData: function(){
            //
            setting.userList = $.parseJSON(decodeURIComponent($("#listUserId").val()));
            o.getContractList();
            o.getClientList();
        },
        setDefaultValue : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var hour = myDate.getHours();
            var minites = myDate.getMinutes();
            var second = myDate.getSeconds();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            if(hour < 10){
                hour = '0' + hour;
            }
            if(minites < 10){
                minites = '0' + minites;
            }
            if(second < 10){
                second = '0' + second;
            }
            var happen_time = '' + fullYear + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second;
            $("#start_date_id").val(happen_time);
            $("#end_date_id").val(happen_time);
        },
        initTable: function(){
            var w = this;

            addSitesTable = $("#sites_table").DataTable({
                language:{
                    paginate:{
                        first:"",
                        previous:"",
                        next:"",
                        last:""
                    },
                    processing:"正在加载数据",
                    info:"第_PAGE_/_PAGES_页 共_TOTAL_条 ",
                    emptyTable:"暂无数据",
                    infoEmpty:"暂无数据",
                    infoFiltered: "(由 _MAX_ 项记录过滤)",
                    lengthMenu:"每页_MENU_条",
                    search:"查询",
                    zeroRecords:"无匹配的记录"
                },
                stateSave:false,
                order: [],
                pagingType:"full",
                dom:
                "<'row'<'col-sm-12'tr>>" +
                "<'dataTables-bottom'<'page'<'page-length'l><'page-info'i><'page-num'p>>>",
                columns: [
                    //{data: 'username',width:"15%" },
                    {data: 'name', sWidth: '25%'},
                    {data: 'domain',sWidth: '20%'},
                    {data: 'ip',sWidth: '20%'},
                    {data: 'port',sWidth: '20%'},
                    {data: '', sWidth: '15%'}
                ],
                columnDefs:[
                    // {orderable:false,targets:[3,4,5]}
                ],
                rowCallback:function( nRow, aData, index ){
                    var editBtn=$('<a href="javascript:void(0)" title="修改"><i class="fa fa-edit"></i></a>');
                    editBtn.bind("click",function(){
                        currentEditRow = addSitesTable.row($(this).closest("tr"));
                        //add_site_name_hidden
                        $("#add_site_form input[name='add_site_domain_hidden']").val(aData['domain']);
                        $("input[name='add_site_domain']", $("#add_site_form")).attr("disabled", true);
                        $("#add_site_form input[name='add_site_name']").val(aData['name']);
                        $("#add_site_form input[name='add_site_domain']").val(aData['domain']);
                        $("#add_site_form input[name='add_site_ip']").val(aData['ip']);
                        $("#add_site_form input[name='add_site_port']").val(aData['port']);
                        //w.addSiteModel.setTitle("<h3>修改用户</h3>");
                        w.addSiteModel.modal('show');

                    });

                    var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                    deleteBtn.bind("click",function(){
                        var row= addSitesTable.row($(this).closest("tr"));
                        storm.confirm("您确定要删除吗？",function(){
                            for(var i = 0, num = setting.newSiteList.length; i < num; i++){
                                if(setting.newSiteList[i].domain = aData['domain']){
                                    setting.newSiteList.splice(i,1);
                                    break;
                                }
                            }
                            row.remove().draw(false);
                        });
                    });
                    $('td:eq(4)', nRow).html('').addClass('text-center');
                    $('td:eq(4)', nRow).append(editBtn).append(deleteBtn);
                }

            });


            addUserTable = $("#add_users_table").DataTable($.extend(_dataTable_setting._report(),{
                columns: [
                    //telephone: "17722518262", username: "郑绍雄", email: undefined, warnType: 7
                    {data: 'username', sWidth: '10%'},
                    {data: 'telephone',sWidth: '10%'},
                    {data: 'email',sWidth: '20%'},
                    {data: 'warnType',sWidth: '25%'},
                    {data: 'time',sWidth: '25%'},
                    {data: '', sWidth: '10%'}
                ],
                columnDefs:[
                    // {orderable:false,targets:[3,4,5]}
                ],
                rowCallback:function( nRow, aData, index ){

                    var warnType = functions.madeWarnType(aData);
                    $('td:eq(3)', nRow).html('').addClass('text-center').append(warnType);

                    var div = $('<div></div>');
                    var beginTime = functions.madeBeginSelect.call(w,aData);
                    var endTime = functions.madeEndSelect.call(w,aData);
                    var mid = $('<label style="text-align: center;width: 40px;">至</label>');
                    div.append(beginTime).append(mid).append(endTime);
                    $('td:eq(4)', nRow).html('').addClass("text-center").append(div);

                    var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                    deleteBtn.bind("click",function(){
                        var row= addUserTable.row($(this).closest("tr"));
                        storm.confirm("您确定要删除吗？",function(){
                            functions.deleteOneContact.call(w,aData['telephone']);
                            row.remove().draw(false);
                        });
                    });
                    $('td:eq(5)', nRow).html('').addClass('text-center');
                    $('td:eq(5)', nRow).append(deleteBtn);
                }

            }));

        },
        handler:function(){
            var w=this;

            // 绑定上传证书公钥
            $("#cert_public_key").fileinput({
                'allowedFileExtensions' : ['txt'],// 过滤文件类型(只接受txt文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : false,// 是否显示文件预览内容
                'uploadUrl': __ROOT__ + "/Home/Sites/upload",// 文件上传url
                'ajaxSettings':{
                    success:__file__.success1 // 操作成功内容
                }
            });

            // 绑定上传证书私钥
            $("#cert_private_key").fileinput({
                'allowedFileExtensions' : ['txt'],// 过滤文件类型(只接受txt文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : false,// 是否显示文件预览内容
                'uploadUrl': __ROOT__ + "/Home/Sites/upload",// 文件上传url
                'ajaxSettings':{
                    success:__file__.success2 // 操作成功内容
                }
            });

            // 绑定上传证书链（CA）
            $("#cert_ca_link").fileinput({
                'allowedFileExtensions' : ['txt'],// 过滤文件类型(只接受txt文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : false,// 是否显示文件预览内容
                'uploadUrl': __ROOT__ + "/Home/Sites/upload",// 文件上传url
                'ajaxSettings':{
                    success:__file__.success3 // 操作成功内容
                }
            });

            //导入文件
            $("#import_site_import").fileinput({
                'allowedFileExtensions' : ['xls','xlsx'],// 过滤文件类型(只接受xls、xlsx文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : false,// 是否显示文件预览内容
                'uploadUrl': __ROOT__ + "/Home/Sites/importExcel",// 文件上传url
                'ajaxSettings':{
                    success:__file__.importExcelSuccess // 操作成功内容
                }
            });

            $(".is_http").bind("click",function(){
                var is_http = $(this).children('span.text').text();
                if(is_http == '启用'){
                    $(".is_show_http_div").show();
                } else {
                    $(".is_show_http_div").hide();
                }
            });

            //
            $(".is_ddos").bind("click",function(){
                var is_ddos = $(this).children('span.text').text();
                if(is_ddos == '启用'){
                    $(".is_show_ddos_div").show();
                } else {
                    $(".is_show_ddos_div").hide();
                }
            });

            $(".is_loophole_scan").bind("click",function(){
                var is_ddos = $(this).children('span.text').text();
                if(is_ddos == '禁用'){
                    if($(".loophole_warning").children('span.text').text() == '启用'){
                        $(".loophole_warning").toggleClass('on');
                        $(".loophole_warning").hasClass('on') ? $(".loophole_warning").children('span.text').text('启用'):$(".loophole_warning").children('span.text').text('禁用');
                    }
                }
            });

            $(".loophole_warning").bind("click",function(){
                var loophole_warning = $(this).children('span.text').text();
                if(loophole_warning == '启用'){
                    if($(".is_loophole_scan").children('span.text').text() == '禁用'){
                        $(".is_loophole_scan").toggleClass('on');
                        $(".is_loophole_scan").hasClass('on') ? $(".is_loophole_scan").children('span.text').text('启用'):$(".is_loophole_scan").children('span.text').text('禁用');
                    }
                }
            });

            $(".is_available").bind("click",function(){
                if($(this).children('span.text').text() == '禁用'){
                    if($(".available_warning").children('span.text').text() == '启用'){
                        $(".available_warning").toggleClass('on');
                        $(".available_warning").hasClass('on') ? $(".available_warning").children('span.text').text('启用'):$(".available_warning").children('span.text').text('禁用');
                    }
                }
            });

            $(".available_warning").bind("click",function(){
                var loophole_warning = $(this).children('span.text').text();
                if(loophole_warning == '启用'){
                    if($(".is_available").children('span.text').text() == '禁用'){
                        $(".is_available").toggleClass('on');
                        $(".is_available").hasClass('on') ? $(".is_available").children('span.text').text('启用'):$(".is_available").children('span.text').text('禁用');
                    }
                }
            });

            $(".btn-save").bind("click", function(){
                functions.addSite();
            });

            $('.btn-reback').bind("click", function(){
                var href = __ROOT__ + "/Home/Sites/index";
                window.location.href = href;
            });

            //添加联系人和选择联系人按钮事件
            __bind__.contactsBind.call(w);
            __bind__.modalBind.call(w);
        },
        getContractList: function(){
            var w = this;
            $.ajax({
                async : false,
                type : "POST",
                dataType : "json",
                url : __WEBROOT__ + "/Home/Sites/getContractList",
                success:function(json){
                    $("#contract_id").append($("<option value=''>--请选择--</option>"));
                    //console.info(json.items);
                    $.each(json.items, function(point, item){
                        setting.contractIdToCilentId[item['_id']] = item['client'];
                        setting.cilentIdToContractId[item['client']] = item['_id'];
                        $("#contract_id").append($("<option value='"+ item['_id']+ "'>" + item['no'] + "(" + item['name'] + ")</option>"));
                    });
                }
            });
        },
        getClientList: function(){
            var w = this;
            $.ajax({
                async : false,
                type : "POST",
                dataType : "json",
                url : __WEBROOT__ + "/Base/Contract/listClient",
                success:function(json){
                    $("#client_id").append($("<option value=''>--请选择--</option>"));
                    $.each(json.items, function(point, item){
                        //setting.clientIdToClientName[item['_id']] = item['name'];
                        $("#client_id").append($("<option value='"+ item['_id']+ "'>" + item['name'] + "(" + item['phone_num'] + ")</option>"));
                    });
                }
            });
        },
        initSelects: function() {
            $('#contract_id').select2();
            $("#contract_id").on("change", function (e) {
                var client_id = setting.contractIdToCilentId[$(this).val()] || '';
                if(client_id != $('#client_id').val()){
                    $('#client_id').select().val(client_id).trigger('change');
                }
                //console.info(client_id);
            });
            $('#client_id').select2();
            var contract_id = $("#current_contract_id").val();
            //console.info(contract_id);
            //$('#areaSelect').attr("disabled",false);

            if(contract_id){
                $('#contract_id').select().val(contract_id).trigger('change');

            }
            var client_id = $("#current_client_id").val();
            if(client_id){
                $('#client_id').select().val(client_id).trigger('change');

            }
            //$("#client_id").prop("disabled",false);
            $("#client_id").prop("disabled", true);
        }
    };

    var __file__ = {
        success1: function(json){
            if(json['code']){
                var content = "";
                $.each(json['rows'], function(point, item){
                    if(item && item.trim() != ''){
                        content += item;
                    }
                });
                //console.info(content);
                $("#file1").val(content);
            }
        },
        success2: function(json){
            if(json['code']){
                var content = "";
                $.each(json['rows'], function(point, item){
                    if(item && item.trim() != ''){
                        content += item;
                    }
                });
               // console.info(content);
                $("#file2").val(content);
            }
        },
        success3: function(json){
            if(json['code']){
                var content = "";
                $.each(json['rows'], function(point, item){
                    if(item && item.trim() != ''){
                        content += item;
                    }
                });
                $("#file3").val(content);
            }
        },
        //导入站点文件上传成功后
        importExcelSuccess: function(json){
            if(json && json.code == 1){
                var hadCount = setting.newSiteList.length;
                if(hadCount + json.count  > allowMaxCount){
                    storm.alertMsg('当前导入数量超过了设定值（' + allowMaxCount + '）',"warning");
                    return ;
                }
                var items = json.items;
                var item = {}
                for ( var p in items ){ // 方法
                    item = {
                        name: items[p]['A'],
                        domain: items[p]['B'],
                        ip: items[p]['C'],
                        port: items[p]['D'],
                        '': ''
                    }
                    var flag = true;
                    for(var i = 0,num = setting.newSiteList.length; i < num; i++){
                        if(setting.newSiteList[i].domain == items[p]['B']){
                            flag = false;
                            break;
                        }
                    }
                    if(flag){
                        setting.newSiteList.push(item);
                        addSitesTable.row.add( item).draw( true );
                    }
                }
                o.importSiteModel.modal("hide");
            } else {
                storm.alertMsg(json.msg,"warning");
                return ;
            }

            /**
             *
             w.table.clear();
             w.table.rows.add(json);
             w.table.draw();
             */
        }
    };

    var setting = {
        emailRegex : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,// email 正则
        telephoneRegex : /^1\d{10}$/,// 手机号正则
        userList : [],       // 可添加联系人列表
        userAddList : [],    // 已添加联系人列表
        newSiteList : [],    // 新增加的站点列表
        contractIdToCilentId: {},
        cilentIdToContractId: {},
        ztreeSetting : {
            check:{
                enable:true
            },
            data:{
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId",
                    rootPId: 0
                }
            },
            view:{
                showIcon: false
            }
        }
    }

    var functions = {
        //添加站点
        addSite: function(){

            var contract_id = $('#contract_id').val();
            if(contract_id == ''){
                storm.alertMsg('请选择合同','warning');
                return ;
            }
            var client_id = $('#client_id').val();
            if(client_id == ''){
                storm.alertMsg('请选择客户','warning');
                return ;
            }

            if(setting.newSiteList.length == 0){
                storm.alertMsg('请先添加或导入站点','warning');
                return ;
            }

            var siteName = $("#siteName_id").val();
            var ip = $("#ip_id").val();
            var port = $("#port_id").val();
            var domains = $("#domains_id").val();
            var domainTmp = domains.split("\n");
            var domainList = []
            $.each(domainTmp, function(point, item){
                var tmp = $.trim(item);
                if(tmp != '' ){
                    domainList.push(tmp);
                }
            });

            var domains = domainList.join(",");
            var is_http = $(".is_http").children('span.text').text();
            if(is_http == '启用'){
                is_http = 1;
            } else {
                is_http = 2;
            }
            var cert_public = $("#file1").val();
            var cert_private = $("file2").val();
            var cert_ca_link = $("#file3").val();

            var node = $("#node_id").val();

            var protect_mode = $(".active").children().attr("data");

            var is_ddos = $(".is_ddos").children('span.text').text();
            if(is_ddos == '启用'){
                is_ddos = 1;
            } else {
                is_ddos = 0;
            }

            var is_waf_warning = $(".is_waf_warning").children('span.text').text();
            if(is_waf_warning == '启用'){
                is_waf_warning = 1;
            } else {
                is_waf_warning = 0;
            }

            //var is_cc = $(".is_cc").children('span.text').text();
            //if(is_cc == '启用'){
            //    is_cc = 1;
            //} else {
            //    is_cc = 0;
            //}

            var highInstance = $("#highInstance_id").val();

            var is_loophole_scan = $(".is_loophole_scan").children('span.text').text();
            if(is_loophole_scan == '启用'){
                is_loophole_scan = 1;
            } else {
                is_loophole_scan = 0;
            }

            var loophole_warning = $(".loophole_warning").children('span.text').text();
            if(loophole_warning == '启用'){
                loophole_warning = 1;
            } else {
                loophole_warning = 0;
            }

            var is_available = $(".is_available").children('span.text').text();
            if(is_available == '启用'){
                is_available = 1;
            } else {
                is_available = 0;
            }

            var available_warning = $(".available_warning").children('span.text').text();
            if(available_warning == '启用'){
                available_warning = 1;
            } else {
                available_warning = 0;
            }



            var param = {
                siteName: siteName,
                ip: ip,
                port: port,
                siteList: setting.newSiteList,
                is_waf_warning: is_waf_warning,
                loophole_warning: loophole_warning,
                domains: domains,
                is_http: is_http,
                cert_public: cert_public,
                cert_private: cert_private,
                cert_ca_link: cert_ca_link,
                protect_mode: protect_mode,
                is_ddos: is_ddos,
                InstanceId: highInstance,
                is_loophole_scan: is_loophole_scan,
                is_available: is_available,
                available_warning: available_warning,
                contract_id: contract_id,
                client_id: client_id
            };
            $.extend(param, {userAddList: setting.userAddList});

            $('.btn-save').prop('disabled', true);

            $.post(__ROOT__ + "/Home/Sites/batchAddSite",param).success(function(json){
                //console.info(json);
                if(json.code && json.code == 1){
                    var href = __ROOT__ + "/Home/Sites/index";
                    window.location.href = href;
                } else {
                    Message.init({
                        text: json.msg,
                        type: 'success'
                    });
                }
                $('.btn-save').prop('disabled', false);
            });
        },

        // 编辑联系人事件
        editContact : function(event){
            var w = event.data.contextindex;
            w.addUserModal.modal("show");
        },

        // 选择联系人事件
        chooseContact : function(event){
            var w = event.data.contextindex;
            functions.initContactZtree.call(w);// 初始化ztree
            w.chooseUserModal.modal("show");
        },

        // 创建告警类型
        madeWarnType: function(item){
            var div = $('<div></div>')
            if(item['warnType'] & 1){
                warnType = $('<input type="checkbox" class="msgInfo" name="msgInfo" data-value="1" phone="' + item['telephone'] + '" checked/>短信通知</input>');
            } else {
                warnType = $('<input type="checkbox" class="msgInfo" name="msgInfo" data-value="1" phone="' + item['telephone'] + '"/>短信通知</input>');
            }
            warnType.bind("click",function(){
                functions.changeWarnType(this, 1, item['telephone']);
            });
            div.append(warnType);

            if(item['warnType'] & 2){
                warnType = $('<input type="checkbox" class="mixinInfo" name="mixinInfo" data-value="2" phone="' + item['telephone'] + '" checked/>APP通知</input>');
            } else {
                warnType = $('<input type="checkbox" class="mixinInfo" name="mixinInfo" data-value="2" phone="' + item['telephone'] + '">APP通知</input>');
            }
            warnType.bind("click",function(){
                functions.changeWarnType(this, 2, item['telephone']);
            });
            div.append(warnType);

            if(item['warnType'] & 4){
                warnType = $('<input type="checkbox" class="emailInfo" name="emailInfo" data-value="4" phone="' + item['telephone'] + '" checked>邮件通知</input>');
            } else {
                warnType = $('<input type="checkbox" class="emailInfo" name="emailInfo" data-value="4" phone="' + item['telephone'] + '" >邮件通知</input>');
            }
            warnType.bind("click",function(){
                functions.changeWarnType(this, 4, item['telephone']);
            });
            div.append(warnType);

            return div;
        },

        // 创建告警开始时间的select
        madeBeginSelect: function(data){
            var hourStr = "06"
            if(data && data['beginTime']){
                hourStr = data['beginTime']
            }
            var w = this;
            var timeStr = '<select style="width: 60px;" >';
            var tempHourStr = ''
            for(var i = 0; i < 25; i++){
                if(i < 10){
                    tempHourStr = "0" + i;
                } else {
                    tempHourStr = "" + i;
                }
                if(tempHourStr == hourStr){
                    timeStr += '<option value="' + tempHourStr + '" selected>'+ tempHourStr + '</option>';
                } else {
                    timeStr += '<option value="' + tempHourStr + '">'+ tempHourStr + '</option>';
                }

            }
            var result = $(timeStr);
            result.bind("click",function(){
                functions.changeBeginTime(this, data['telephone']);
            });
            return result;
        },

        // 创建告警开始时间的select
        madeEndSelect: function(data){
            var hourStr = "22"
            if(data && data['endTime']){
                hourStr = data['endTime']
            }
            var w = this;
            var timeStr = '<select style="width: 60px;" >';
            var tempHourStr = ''
            for(var i = 0; i < 25; i++){
                if(i < 10){
                    tempHourStr = "0" + i;
                } else {
                    tempHourStr = "" + i;
                }
                if(tempHourStr == hourStr){
                    timeStr += '<option value="' + tempHourStr + '" selected>'+ tempHourStr + '</option>';
                } else {
                    timeStr += '<option value="' + tempHourStr + '">'+ tempHourStr + '</option>';
                }

            }
            var result = $(timeStr);
            result.bind("click",function(){
                functions.changeEndTime(this, data['telephone']);
            });
            return result;
        },

        // 新增站点
        editSiteModelShow: function(event){
            var w = event.data.contextindex;
            $("input[name='add_site_domain']", $("#add_site_form")).attr("disabled", false);
            w.addSiteModel.modal("show");
            //$(".edit_site_div").show();
            //$(".new_site_div").hide();
        },

        // 导入站点
        importSiteModelShow : function(event){
            var w = event.data.contextindex;
            //functions.initContactZtree.call(w);// 初始化ztree
            w.importSiteModel.modal("show");
        },
        addSiteList: function(event){
            var w = event.data.contextindex;
            var hiddenDomain = $("#add_site_form input[name='add_site_domain_hidden']").val();
            var siteName = $("#add_site_form input[name='add_site_name']").val();
            if(siteName == ''){
                storm.alertMsg('请填写站点名称',"danger");
                return ;
            }
            var domainName = $("#add_site_form input[name='add_site_domain']").val();
            if(domainName == ''){
                storm.alertMsg('请填写站点域名',"danger");
                return ;
            }
            if(domainName.indexOf('*') != -1){
                storm.alertMsg('域名中不能包含*号',"danger");
                return ;
            }
            if(domainName.length > 64){
                storm.alertMsg('域名长度过长',"danger");
                return ;
            }
            var ip = $("#add_site_form input[name='add_site_ip']").val();
            if(ip == ''){
                storm.alertMsg('请填写IP地址',"danger");
                return ;
            }
            var port = $("#add_site_form input[name='add_site_port']").val();
            if(port == ''){
                storm.alertMsg('请填写端口',"danger");
                return ;
            }

            item = {
                name: siteName,
                domain: domainName,
                ip: ip,
                port: port,
                '': ''
            }
            var flag = true;
            if(hiddenDomain == ''){
                for(var i = 0,num = setting.newSiteList.length; i < num; i++){
                    if(setting.newSiteList[i].domain == domainName){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    var param={};
                    param['domain'] = domainName;
                    //判断数据库中是否存在该站点
                    $.post(__ROOT__ + "/Home/Sites/hadExist",param).success(function(json){
                        if(json.code == 1){
                            storm.alertMsg('该站点已存在，请不要重复添加',"warning");
                        } else {
                            setting.newSiteList.push(item);
                            addSitesTable.row.add( item ).draw( true );
                            w.addSiteModel.modal("hide");
                        }
                    });

                } else {
                    storm.alertMsg('本次添加列表中已存在该站点，请不要重复添加',"danger");
                }
            } else {
                for(var i = 0,num = setting.newSiteList.length; i < num; i++){
                    if(setting.newSiteList[i].domain == domainName){
                        setting.newSiteList[i] = item;
                        break;
                    }
                }
                //addSitesTable.row.add( item).draw( true );
                currentEditRow.data( item ).draw(false );
                w.addSiteModel.modal("hide");
                $("#add_site_form input[name='add_site_domain_hidden']").val('');
            }



        },
        // 初始化联系人ztree 【ztree中只展示未选择的联系人】
        initContactZtree : function(){
            var w = this;
            var nodeList = [];
            var param = $("#choose_user_modal input[name='ztree_param']").val();
            $.each(setting.userList, function(point, item){
                var flag = true;
                var telephone = item['username'];
                //过滤掉已添加联系人
                for(var i = 0; i < setting.userAddList.length; i++){
                    var tmpAddContact = setting.userAddList[i];
                    if(tmpAddContact['telephone'] == telephone){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    var name = item['name'] + "(" + item['username'] + ")";
                    if(item['is_follow'] == 1){
                        name += " 关注人";
                    }
                    if(param == null || param == ''){
                        nodeList.push({
                            id:telephone,
                            pId:0,
                            name:name,
                            value:telephone
                        });
                    }else{
                        if(name.indexOf(param) >= 0){
                            nodeList.push({
                                id:telephone,
                                pId:0,
                                name:name,
                                value:telephone
                            });
                        }
                    }
                }
            });
            $.fn.zTree.init($("#choose_contact_ztree"), setting.ztreeSetting, nodeList);
        },
        // 查询联系人【选择联系人】
        queryContact : function(event){
            var w = event.data.contextindex;
            functions.initContactZtree.call(w);
            return false;
        },

        // 将联系人添加到联系人列表
        putToUserList : function(event){
            var w = event.data.contextindex;
            var srcTelephone = $("#add_user_form input[name='srcTelephone']").val();
            var telephone = $("#add_user_form input[name='telephone']").val();
            if(!setting.telephoneRegex.test(telephone)){
                storm.alertMsg('请填写合法手机号码',"danger");
                return ;
            }
            var username = $("#add_user_form input[name='username']").val();
            if(username == ''){
                storm.alertMsg('请填写用户姓名',"danger");
                return ;
            }
            var email = $("#add_user_form input[name='email']").val();
            if(!setting.emailRegex.test(email)){
                storm.alertMsg('请填写合法邮箱地址',"danger");
                return ;
            }

            var remark = $("#add_user_form input[name='contact_remark']").val();
            var warnType = 0;
            if($("#add_user_form input[name='msgInfo']").attr("checked")){
                warnType += 1;
            }
            if($("#add_user_form input[name='mixinInfo']").attr("checked")){
                warnType += 2;
            }
            if($("#add_user_form input[name='emailInfo']").attr("checked")){
                warnType += 4;
            }

            var beginTime = $("#begin_time_id").val();
            var endTime = $("#end_time_id").val();
            //删除掉相同号码的所有联系人
            for(var i = 0; i < setting.userAddList.length; i++){
                var tmp = setting.userAddList[i];
                if(tmp['telephone'] == telephone || tmp['telephone'] == srcTelephone){
                    setting.userAddList.splice(i, 1);
                    i--;
                }
            }
            var item = {
                "telephone":telephone,
                "username":username,
                "email":email,
                "warnType": warnType,
                "beginTime": beginTime,
                "endTime": endTime,
                "remark":remark
            }
            //添加验证该用户是否已存在
            $.post(__ROOT__ + "/Home/Sites/addUser",item).success(function(json){
                //新增成功
                if(json.code == 1){
                    setting.userAddList.push(item);
                    w.addUserModal.modal("hide");
                    initview.initUserTable.call(w);
                } else {
                    storm.alertMsg(json.msg, "warning");
                }
            });

        },

        // 编辑一个联系人
        editOneContact : function(telephone){
            var w = this;
            var contact = "";
            for(var i = 0; i < setting.userAddList.length; i++){
                var tmp = setting.userAddList[i];
                if(tmp['telephone'] == telephone){
                    contact = tmp;
                    break;
                }
            }
            if(contact != ""){
                $("#add_user_form input[name='srcTelephone']").val(telephone);
                $("#add_user_form input[name='telephone']").val(contact['telephone']);
                $("#add_user_form input[name='username']").val(contact['username']);
                $("#add_user_form input[name='email']").val(contact['email']);

                $("#add_user_form input[name='msgInfo']").attr("checked", false);
                $("#add_user_form input[name='mixinInfo']").attr("checked", false);
                $("#add_user_form input[name='emailInfo']").attr("checked", false);
                var warnType = contact['warnType'];
                if(1 & warnType){
                    $("#add_user_form input[name='msgInfo']").attr("checked", true);
                }
                if(2 & warnType){
                    $("#add_user_form input[name='mixinInfo']").attr("checked", true);
                }
                if(4 & warnType){
                    $("#add_user_form input[name='emailInfo']").attr("checked", true);
                }
                w.addUserModal.modal("show");
            }
            return false;
        },

        // 删除一个联系人
        deleteOneContact : function(telephone){
            var w = this;
            //var telephone = event.data.telephone;
            for(var i = 0; i < setting.userAddList.length; i++){
                var tmp = setting.userAddList[i];
                if(tmp['telephone'] == telephone){
                    setting.userAddList.splice(i, 1);
                    i--;
                }
            }
            //initview.initUserTable.call(w);
            return false;
        },

        // 选择联系人【checkbox多选】
        chooseUserList : function(event){
            var w = event.data.contextindex;
            var treeObj = $.fn.zTree.getZTreeObj("choose_contact_ztree");// 获取目标列表
            var select = treeObj.getCheckedNodes(true);
            $.each(select, function(point, item){
                var telephone = item['id'];
                for(var i = 0; i < setting.userList.length; i++){
                    var tmpContact = setting.userList[i];
                    if(tmpContact['username'] == telephone){
                        setting.userAddList.push({
                            "telephone":telephone,
                            "username":tmpContact['name'],
                            "email":tmpContact['email'],
                            "beginTime":"06",
                            "endTime":"22",
                            "warnType":7
                        });
                    }
                }
            });
            initview.initUserTable.call(w);
            w.chooseUserModal.modal("hide");
            return false;
        },
        changeWarnType: function(object,num,phone){
            var checked = $(object).attr("checked");
            var one = null;
            for(var i = 0, length = setting.userAddList.length; i < length; i++){
                if(setting.userAddList[i]['telephone'] == phone){
                    one = setting.userAddList[i];
                    if(checked){//如果勾选上需要加
                        one['warnType'] = one['warnType'] + num;
                    } else {
                        one['warnType'] = one['warnType'] - num;
                    }
                    setting.userAddList[i] = one;
                    break;
                }
            }
        },
        changeBeginTime: function(object,phone){
            var value = $(object).val();
            var one = null;
            for(var i = 0, length = setting.userAddList.length; i < length; i++){
                if(setting.userAddList[i]['telephone'] == phone){
                    one = setting.userAddList[i];
                    one['beginTime'] = value;
                    setting.userAddList[i] = one;
                    break;
                }
            }
        },
        changeEndTime: function(object, phone){
            var value = $(object).val();
            var one = null;
            for(var i = 0, length = setting.userAddList.length; i < length; i++){
                if(setting.userAddList[i]['telephone'] == phone){
                    one = setting.userAddList[i];
                    one['endTime'] = value;

                    setting.userAddList[i] = one;
                    break;
                }
            }
        }
    }

    // 公共方法
    var common_function = {
        // 校验是否为email
        emailValidate: function (param, regex) {
            if (!regex.text(param)) {
                return true;
            } else {
                return false;
            }
        },
        // 校验是否是电话号码
        telephoneValidate: function (param, regex) {
            if (!regex.text(param)) {
                return true;
            } else {
                return false;
            }
        },

        // 将数组中的元素放到select标签中(添加select的option)
        appendSelect: function (param, obj, value, name) {
            $.each(param, function (point, item) {
                var option = $("<option></option>");
                option.text(item[name]);
                option.val(item[value]);
                obj.append(option);
            })
        },

        // 清空数据表
        fnClearDataTable: function (name) {
            var w = this;
            if (w[name]) {
                w[name].clearTable();
            }
        },

        // 重新加载表单
        fnDrawDataTable:function(name,dom,lineNum){
            var w=this;
            if(!w[name]){
                w[name]= dom.DataTable(_dataTable_setting._server());
            }else{
                w[name].destroy();
                w[name]=dom.DataTable(_dataTable_setting._server());
            }
            w[name].draw();
        }
    }

    var initview = {
        // 联系人信息回显到页面
        initUserTable : function(){
            //addSitesTable.clearTable().darw(false);
            addUserTable.clear();
            $.each(setting.userAddList, function(point, item){ // 方法
                //item['name'] = 'hello_world'
                addUserTable.row.add( item).draw( false );
            });
            //var w = this;
            //var tableName = "add_users_table";
            //var table = $("#" + tableName);
            //var tbody = $(".contact-list-table", table);
            //tbody.html("");
            //common_function.fnClearDataTable("contract_contact_table");
            //var email = '';
            //$.each(setting.userAddList, function(point, item){
            //    var tr = $("<tr></tr>");
            //    email = item['email'] ? item['email'] : '';
            //    tr.append($("<td>" + item['username'] + "</td>"));
            //    tr.append($("<td>" + item['telephone'] + "</td>"));
            //    tr.append($("<td>" + email + "</td>"));
            //    var warnType = "";
            //
            //    var oneTd = $("<td></td>");
            //    var div = $("<div class='col-sm-10'></div>");
            //    if(item['warnType'] & 1){
            //        warnType = $('<input type="checkbox" class="msgInfo" name="msgInfo" data-value="1" phone="' + item['telephone'] + '" checked/>短信通知</input>');
            //    } else {
            //        warnType = $('<input type="checkbox" class="msgInfo" name="msgInfo" data-value="1" phone="' + item['telephone'] + '"/>短信通知</input>');
            //    }
            //    //
            //    warnType.bind("click",function(){
            //        functions.changeWarnType(this, 1, item['telephone']);
            //    });
            //    div.append(warnType);
            //    if(item['warnType'] & 2){
            //        warnType = $('<input type="checkbox" class="mixinInfo" name="mixinInfo" data-value="2" phone="' + item['telephone'] + '" checked/>密信通知</input>');
            //    } else {
            //        warnType = $('<input type="checkbox" class="mixinInfo" name="mixinInfo" data-value="2" phone="' + item['telephone'] + '">密信通知</input>');
            //    }
            //    warnType.bind("click",function(){
            //        functions.changeWarnType(this, 2, item['telephone']);
            //    });
            //    div.append(warnType);
            //    if(item['warnType'] & 4){
            //        warnType = $('<input type="checkbox" class="emailInfo" name="emailInfo" data-value="4" phone="' + item['telephone'] + '" checked>邮件通知</input>');
            //    } else {
            //        warnType = $('<input type="checkbox" class="emailInfo" name="emailInfo" data-value="4" phone="' + item['telephone'] + '" >邮件通知</input>');
            //    }
            //    warnType.bind("click",function(){
            //        functions.changeWarnType(this,4,item['telephone']);
            //    });
            //    div.append(warnType);
            //    oneTd.append(div).appendTo(tr);
            //
            //    //tr.append("<td><div class='col-sm-10'>" + warnType + "</div></td>");
            //    tr.append("<td>告警时间范围</td>");
            //    var td = $("<td></td>");
            //    var editBtn=$('<a href="javascript:void(0)" title="修改"><i class="fa fa-edit"></i></a>');
            //    editBtn.bind("click",function(){
            //        functions.editOneContact.call(w,item['telephone']);
            //    });
            //    var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
            //    deleteBtn.bind("click",function(){
            //        functions.deleteOneContact.call(w,item['telephone']);
            //    });
            //    td.append(editBtn).append(deleteBtn).appendTo(tr);
            //    tbody.append(tr);
            //});
        },

        // 初始化告警联系人列表
        initUserAddList : function(){
            var w = this;
            if(w.setting.userListSrc){
                $.each(w.setting.userListSrc, function(point, item){
                    var warnType = item['warning_type'];
                    var user_id = item['user_id'];
                    for(var i = 0; i < w.setting.userList.length; i++){
                        var tmp = w.setting.userList[i];
                        if(tmp['id'] == user_id){
                            w.setting.userAddList.push({
                                "username":tmp['name'],
                                "telephone":tmp['username'],
                                "email":tmp['email'],
                                "warnType": warnType
                            });
                            break;
                        }
                    }
                });
                w.initview.initUserTable.call(w);
            }
        }
    }

    var __bind__ = {
        contactsBind:function(){
            var w = this;
            $(".btn-add-user").bind("click", {contextindex:w}, functions.editContact);
            $(".btn-choose-user").bind("click", {contextindex:w}, functions.chooseContact);

            $(".btn-add-site").bind("click", {contextindex:w}, functions.editSiteModelShow);
            $(".btn-import-site").bind("click", {contextindex:w}, functions.importSiteModelShow);

            $(".ztree-search").bind("click", {contextindex:w}, functions.queryContact);
            $(".contract_choose_add").bind("click", {contextindex:w}, functions.chooseUserList);
            $(".user_add_btn").bind("click", {contextindex:w}, functions.putToUserList);

            $(".add_site_btn").bind("click", {contextindex:w}, functions.addSiteList );
        },


        modalBind : function(){
            var w = this;
            w.addUserModal = $("#add_user_modal");
            w.addUserModal.on("hidden.bs.modal", function(){
                $("#add_user_form input[name='srcTelephone']").val("");
                $("#add_user_form input[name='telephone']").val("");
                $("#add_user_form input[name='username']").val("");
                $("#add_user_form input[name='email']").val("");
                $("#add_user_form input[name='msgInfo']").attr("checked", false);
                $("#add_user_form input[name='mixinInfo']").attr("checked", false);
                $("#add_user_form input[name='emailInfo']").attr("checked", false);
            });
            w.chooseUserModal = $("#choose_user_modal");
            w.chooseUserModal.on("hidden.bs.modal", function(){
                $("#choose_user_modal input[name='ztree_param']").val("");
            });

            w.addSiteModel = $("#add_site_modal");
            w.addSiteModel.on("hidden.bs.modal", function(){
                $("#add_site_form input[name='add_site_name']").val("");
                $("#add_site_form input[name='add_site_domain']").val("");
                $("#add_site_form input[name='add_site_ip']").val("");
                $("#add_site_form input[name='add_site_port']").val("");
            });

            w.importSiteModel = $("#import_site_modal");


        },

        submitBind : function(){
            var w = this;
            $(".button-submit").bind("click", {contextindex:w}, w.functions.submitMethod);
        }

    }



    $(document).ready(function(){
        o.init();

    });


})();
