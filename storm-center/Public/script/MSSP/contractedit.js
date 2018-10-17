/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/5
 *@example
 */
(function(){

    // 公共方法
    var common_function = {
        // 校验是否为email
        emailValidate : function(param, regex){
            if(!regex.text(param)){
                return true;
            }else{
                return false;
            }
        },
        // 校验是否是电话号码
        telephoneValidate : function(param, regex){
            if(!regex.text(param)){
                return true;
            }else{
                return false;
            }
        },

        // 将数组中的元素放到select标签中(添加select的option)
        appendSelect : function(param, obj, value, name){
            $.each(param, function(point, item){
                var option = $("<option></option>");
                option.text(item[name]);
                option.val(item[value]);
                obj.append(option);
            })
        },

        // 清空数据表
        fnClearDataTable:function(name){
            var w=this;
            if(w[name]){
                w[name].fnClearTable();
            }
        },

        // 重新加载表单
        fnDrawDataTable:function(name,dom,lineNum){
            var w=this;
            if(!w[name]){
                w[name]= dom.dataTable(storm.defaultStaticGridSetting());
            }else{
                w[name].fnDestroy();
                w[name]=dom.dataTable(storm.defaultStaticGridSetting());
            }
            w[name].fnDraw();
        },

        // 显示告警
        showMsg : function(msg, type){
            Message.init({
                text: msg,
                type: type //info success warning danger
            });
        },

        // 初始化提交参数
        initParam : function(){
            var param = {};
            $.extend(param, {
                "contract_id":$("#contract_id").val(),
                "contract_name":$("#contract_name").val(),
                "customer_name":$("#customer_name").val(),
                "contract_begin":$("#contract_begin").val(),
                "contract_end":$("#contract_end").val(),
                "contract_pm":$("#contract_pm").val(),
                "contract_saler":$("#contract_saler").val()
            });
            var packages = 0;
            var serverTypeList = $(".server_type_check_box");
            for(var i = 0; i < serverTypeList.length; i++){
                var tmp = $(serverTypeList[i]);
                if(tmp.attr("checked")){
                    var id = tmp.attr("id");
                    if(id == "vuls-scan"){
                        packages += 1;
                        $.extend(param,{'webscan_params':common_function.initVulsScan()});
                    }else if(id == "security-scan"){
                        packages += 8;
                        $.extend(param, {'securityscan_params':common_function.initSecurityScan()});
                    }else if(id == "server-check"){
                        packages += 2
                    }else if(id == "cloud-waf"){
                        packages += 4;
                    }
                }
            }
            $.extend(param, {
                'packages':packages,
                'domainList':common_function.initDomainList()
            });
            return param;
        },

        // 初始化漏洞扫描套餐配置【请求提交时使用】
        initVulsScan : function(){
            var wrapper = $("#web-scan-config-div");
            var task_node = $("#task-node", wrapper).val();
            var policy_group = $("#policy-group", wrapper).val();
            var task_level = $("#task-level", wrapper).val();
            var task_min_slip = $("#task-min-slip", wrapper).val();
            var task_cycle = $("input[name='task-cycle']").val();
            var vulsParam = {
                node_id : task_node,
                policy_group_id : policy_group,
                deep : task_level,
                slice_size : task_min_slip,
                is_cyc : task_cycle
            };
            return JSON.stringify(vulsParam);
        },

        // 初始化安全事件扫描套餐配置【请求提交时使用】
        initSecurityScan : function(){
            var wrapper = $("#security-event-config-div");
            var task_node = $("#event-task-node", wrapper).val();
            var policy_group = $("#event-policy-group", wrapper).val();
            var task_level = $("#event-task-level", wrapper).val();
            var task_min_slip = $("#event-task-min-slip", wrapper).val();
            var task_cycle = $("input[name='event-task-cycle']").val();
            var securityParam = {
                node_id : task_node,
                policy_group_id : policy_group,
                deep : task_level,
                slice_size : task_min_slip,
                is_cyc : task_cycle
            };
            return JSON.stringify(securityParam);
        },

        // 初始化域名列表【请求提交时使用】
        initDomainList : function(){
            var domainList = [];
            var domainTmp = $("#contract-domain-list").val().split("\n");
            $.each(domainTmp, function(point, item){
                var tmp = $.trim(item);
                if(tmp != '' ){
                    domainList.push(tmp);
                }
            });
            return domainList.join(",");
        },

        // 判断是否为云waf套餐【云waf套餐索要接收的域名跟其他几项有区别】
        judgeWafDomain : function(obj){
            var type = obj.eq(0).find("select").val();
            var domain = obj.eq(1).find("p").text();
            var port = obj.eq(2).find("p").text();//收入金额
            var ip = obj.eq(3).find("p").text();//    备注
            if( domain != null && domain != '' && domain !="域名" && port != null && port != "端口" && port != '' && ip != null && ip != '' && ip != 'ip'){
                return domain + "-->" + type + "-->" + port + "-->" + ip;
            }else{
                return "";
            }
        },

        // 基础信息为空判断
        baseInfoCheck : function(){
            var objs = [
                {id:"contract_id",name:"合同编号不能为空！"},
                {id:"contract_name",name:"合同名称不能为空！"},
                {id:"contract_begin",name:"合同起始时间不能为空！"},
                {id:"contract_end",name:"合同截至时间不能为空！"}
            ];
            for(var i = 0; i < objs.length; i++){
                var tmp = objs[i];
                var value = $("#" + tmp['id']).val();
                if(value == null || value == ""){
                    common_function.showMsg(tmp['name'], "danger");
                    return false;
                }
            }
            var domainList = $.trim($("#contract-domain-list").val());
            if(domainList == null || domainList == ""){
                common_function.showMsg("请填写域名！", "danger");
                return false;
            }
            var serverTypeList = $(".server_type_check_box");
            var packages = 0;
            for(var i = 0; i < serverTypeList.length; i++){
                var tmp = serverTypeList[i];
                if($(tmp).attr("checked")){
                    packages += 1;
                }
            }
            if(!packages){
                common_function.showMsg("请选择套餐！", "danger");
                return false;
            }
            return true;
        },

        // 将云WAF套餐所选择的域名写入指定textarea中
        wafDomainAppend : function(){
            if($("#cloud-waf").attr("checked")){
                $("#contract-domain-list").html("");
                var trList = $("#contract_domain_list_wrapper").find("tbody").children("tr");
                var wafDomainList = "";
                $.each(trList, function(point, item){
                    var tdArr = $(item).find("td");
                    var domainInfo = common_function.judgeWafDomain(tdArr);
                    if(domainInfo != ""){
                        wafDomainList += domainInfo +"\n";
                    }
                });
                if(wafDomainList == ""){
                    common_function.showMsg("请填写域名！", "danger");
                }else{
                    $("#contract-domain-list").val(wafDomainList);
                }
            }
        }
    }

    var ContractIndex = function () {
        this.functions = functions;
        this.bind = bind;
        this.initview = initview;
        this.setting = setting;
        this.init = init;
    }

    var setting = {
        emailRegex : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,// email 正则
        telephoneRegex : /^1\d{10}$/,// 手机号正则
        customerList : [],// 客户列表
        pmList : [],// 项目经理列表
        salerList : [],// 销售列表
        contactList : [],// 联系人列表
        contactAddList : [],// 联系人添加列表
        contractInfoSrc : "",// 合同基本信息--修改使用
        contactListSrc: [],// 联系人基本信息--修改使用
        domainListSrc : [],// 域名基本信息--修改使用
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
    var init = function() {

        this.setting.pmList = $.parseJSON(decodeURIComponent($("#pmListSrc").val())); // 加载后台传过来的项目经理到内存
        this.setting.salerList = $.parseJSON(decodeURIComponent($("#salerListSrc").val())); // 加载后台传过来的销售人员到内存
        this.setting.customerList = $.parseJSON(decodeURIComponent($("#customerListSrc").val())); // 加载后台传过来的客户信息到内存
        this.setting.contactList = $.parseJSON(decodeURIComponent($("#contactListSrc").val())); // 加载后台传过来的联系人列表到内存

        this.setting.contractInfoSrc = $.parseJSON(decodeURIComponent($("#contractInfoSrc").val())); // 加载合同基础信息到内存 --> 当页面为修改时使用
        this.setting.contactListSrc = $.parseJSON(decodeURIComponent($("#alertListSrc").val())); // 加载合同联系人列表到内存 --> 当页面为修改时使用
        this.setting.domainListSrc = $.parseJSON(decodeURIComponent($("#domainListSrc").val())); // 加载合同域名列表到内存 --> 当页面为修改时使用

        this.initview.initContact.call(this); // 页面初始化
        this.initview.initWizard.call(this);

        this.bind.servertype.call(this); // 绑定服务套餐相关事件
        this.bind.contactbind.call(this); // 绑定联系人管理相关事件
        this.bind.modalBtn.call(this); // 绑定联系人管理model 按钮相关事件
        this.bind.modalBind.call(this); // 绑定联系人管理model 相关事件[显示、关闭]
        this.bind.submitBind.call(this); // 绑定提交相关事件

        this.initview.initContent.call(this);// 修改时绑定基本信息

    }

    var functions = {

        // 点击下一步
        wizardNext : function(tab, navigation, index){
            common_function.wafDomainAppend();
            var flag = common_function.baseInfoCheck();
            if(!flag){
                return false;
            }
            return true;
        },

        // 服务套餐选中事件
        typeCheck : function(event){
            var w = event.data.contextindex;
            var target = $(event.target);
            if(target.attr("checked")){
                $("#" + target.attr('sub_div')).show();
            }else{
                $("#" + target.attr('sub_div')).hide();
            }
        },

        // 编辑联系人事件
        editContact : function(event){
            var w = event.data.contextindex;
            w.addUserModal.modal("show");
        },

        // 选择联系人事件
        chooseContact : function(event){
            var w = event.data.contextindex;
            w.functions.initContactZtree.call(w);// 初始化ztree
            w.chooseUserModal.modal("show");
        },

        // 初始化联系人ztree 【ztree中只展示未选择的联系人】
        initContactZtree : function(){
            var w = this;
            var nodeList = [];
            var param = $("#contract_choose_modal input[name='ztree_param']").val();
            $.each(w.setting.contactList, function(point, item){
                var flag = true;
                var telephone = item['username'];
                for(var i = 0; i < w.setting.contactAddList.length; i++){
                    var tmpAddContact = w.setting.contactAddList[i];
                    if(tmpAddContact['telephone'] == telephone){
                        flag = false;
                        break;
                    }
                }
                if(flag){
                    var remark = "未知";
                    var name = item['name'] + "(" + item['username'] + ")";
                    if(item['is_follow'] == 1){
                        name += " 关注人";
                    }else{
                        if(item['remark']){
                            var customerId = item['remark'];
                            for(var i = 0; i < w.setting.customerList.length; i++){
                                var tmpCustomer = w.setting.customerList[i];
                                if(tmpCustomer.id == customerId){
                                    remark = tmpCustomer['name'];
                                    break;
                                }
                            }
                        }
                        name += " 所属客户:" + remark;
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
            $.fn.zTree.init($("#choose_contact_ztree"), w.setting.ztreeSetting, nodeList);
        },

        // 查询联系人【选择联系人】
        queryContact : function(event){
            var w = event.data.contextindex;
            w.functions.initContactZtree.call(w);
            return false;
        },

        // 将联系人添加到联系人列表
        putToContactList : function(event){
            var w = event.data.contextindex;
            var srcTelephone = $("#add_contact_form input[name='srcTelephone']").val();
            var telephone = $("#add_contact_form input[name='telephone']").val();
            var username = $("#add_contact_form input[name='username']").val();
            var email = $("#add_contact_form input[name='email']").val();
            var remark = $("#add_contact_form input[name='contact_remark']").val();
            var alertType = 0;
            if($("#add_contact_form input[name='msgInfo']").attr("checked")){
                alertType+=1;
            }
            if($("#add_contact_form input[name='mixinInfo']").attr("checked")){
                alertType+=2;
            }
            if($("#add_contact_form input[name='emailInfo']").attr("checked")){
                alertType+=4;
            }
            for(var i = 0; i < w.setting.contactAddList.length; i++){
                var tmp = w.setting.contactAddList[i];
                if(tmp['telephone'] == telephone || tmp['telephone'] == srcTelephone){
                    w.setting.contactAddList.splice(i, 1);
                    i--;
                }
            }
            w.setting.contactAddList.push({
                "telephone":telephone,
                "username":username,
                "email":email,
                "alertType":alertType,
                "remark":remark
            });
            w.addUserModal.modal("hide");
            w.initview.initContactTable.call(w);
        },

        // 编辑一个联系人
        editOneContact : function(event){
            var w = event.data.contextindex;
            var telephone = event.data.telephone;
            var contact = "";
            for(var i = 0; i < w.setting.contactAddList.length; i++){
                var tmp = w.setting.contactAddList[i];
                if(tmp['telephone'] == telephone){
                    contact = tmp;
                    break;
                }
            }
            if(contact != ""){
                $("#add_contact_form input[name='srcTelephone']").val(telephone);
                $("#add_contact_form input[name='telephone']").val(contact['telephone']);
                $("#add_contact_form input[name='username']").val(contact['username']);
                $("#add_contact_form input[name='email']").val(contact['email']);
                var alertType = contact['alertType'];
                if(1 & alertType){
                    $("#add_contact_form input[name='msgInfo']").attr("checked", true);
                }
                if(2 & alertType){
                    $("#add_contact_form input[name='mixinInfo']").attr("checked", true);
                }
                if(4 & alertType){
                    $("#add_contact_form input[name='emailInfo']").attr("checked", true);
                }
                w.addUserModal.modal("show");
            }
            return false;
        },

        // 删除一个联系人
        deleteOneContact : function(event){
            var w = event.data.contextindex;
            var telephone = event.data.telephone;
            for(var i = 0; i < w.setting.contactAddList.length; i++){
                var tmp = w.setting.contactAddList[i];
                if(tmp['telephone'] == telephone){
                    w.setting.contactAddList.splice(i, 1);
                    i--;
                }
            }
            w.initview.initContactTable.call(w);
            return false;
        },

        // 选择联系人【checkbox多选】
        chooseContactList : function(event){
            var w = event.data.contextindex;
            var treeObj = $.fn.zTree.getZTreeObj("choose_contact_ztree");// 获取目标列表
            var select = treeObj.getCheckedNodes(true);
            $.each(select, function(point, item){
                var telephone = item['id'];
                for(var i = 0; i < w.setting.contactList.length; i++){
                    var tmpContact = w.setting.contactList[i];
                    if(tmpContact['username'] == telephone){
                        w.setting.contactAddList.push({
                            "telephone":telephone,
                            "username":tmpContact['name'],
                            "email":tmpContact['email'],
                            "alertType":7
                        });
                    }
                }
            });
            w.initview.initContactTable.call(w);
            w.chooseUserModal.modal("hide");
            return false;
        },

        // 套餐选择域名列表输入框改变【云WAF跟其他所需域名有区别】
        domainListType : function(event){
            var w = event.data.contextindex;
            var obj = $(event.target);
            if(obj.attr("checked")){
                $("#contract_domain_list_wrapper").show();
                $("#contract-domain-list").hide();
            }else{
                $("#contract-domain-list").text("");
                $("#contract_domain_list_wrapper").hide();
                $("#contract-domain-list").show();
            }
        },

        // 云WAF套餐选择之后，云WAF域名列表记录可插入数目改变【默认为5条】
        wafDomainListChange : function(event){
            var w = event.data.contextindex;
            var obj = $(event.target);
            var size = obj.val();
            $("#contract-domain-list").text("");
            var tbody = $("#contract_domain_list_wrapper").find("tbody");
            tbody.html("");
            for(var i = 0; i < size; i++){
                var tr = $("<tr></tr>");
                tr.append('<td><select><option value="http" checked>http</option><option value="https">https</option></select></td>');
                tr.append('<td><p contenteditable="true">域名</p></td>');
                tr.append('<td><p contenteditable="true">端口</p></td>');
                tr.append('<td><p contenteditable="true">防护网站公网真实IP</p></td>');
                tr.appendTo(tbody);
            }
        },

        // 提交按钮事件
        submitMethod : function(event){
            var w = event.data.contextindex;
            var obj = $(event.target);
            if(w.setting.contactAddList.length == 0){
                common_function.showMsg("请填写联系人信息", "danger");
            }else{
                var param = common_function.initParam();
                $.extend(param, {
                    'contactList':JSON.stringify(w.setting.contactAddList)
                });
                if(w.setting.contractInfoSrc){
                    $.extend(param, {id: w.setting.contractInfoSrc['id']});
                    $.post(__ROOT__+"/MSSP/Contract/update", param).success(function(json){
                        if(json['code']){
                            window.location = __WEBROOT__ + "/MSSP/Contract/index";
                        }else{
                            common_function.showMsg("合同修改失败！", "danger");
                        }
                    });
                }else{
                    $.post(__ROOT__+"/MSSP/Contract/addContract", param).success(function(json){
                        if(json['code']){
                            window.location = __WEBROOT__ + "/MSSP/Contract/index";
                        }else{
                            common_function.showMsg("合同添加成功！", "danger");
                        }
                    });
                }
            }
            return false;
        }

    }

    var bind = {

        servertype:function(){
            var w = this;
            $(".server_type_check_box").bind("click",{contextindex:w}, w.functions.typeCheck);

            $("#cloud-waf").bind("click", {contextindex:w}, w.functions.domainListType);

            $(".cloud_waf_tr_size").bind("change", {contextindex:w}, w.functions.wafDomainListChange);

            $("#contract_domain_list_wrapper p").live("click", function(){
                $(this).text("");
            });
        },

        contactbind:function(){
            var w = this;
            $(".btn-add-user").bind("click", {contextindex:w}, w.functions.editContact);
            $(".btn-chose-user").bind("click", {contextindex:w}, w.functions.chooseContact);
        },

        modalBtn : function(){
            var w = this;
            $(".contract_add").bind("click", {contextindex:w}, w.functions.putToContactList);
            $(".ztree-search").bind("click", {contextindex:w}, w.functions.queryContact);
            $(".contract_choose_add").bind("click", {contextindex:w}, w.functions.chooseContactList);
        },

        modalBind : function(){
            var w = this;
            w.addUserModal = $("#contract_edit_modal");
            w.addUserModal.on("hidden.bs.modal", function(){
                $("#add_contact_form input[name='srcTelephone']").val("");
                $("#add_contact_form input[name='telephone']").val("");
                $("#add_contact_form input[name='username']").val("");
                $("#add_contact_form input[name='email']").val("");
                $("#add_contact_form input[name='msgInfo']").attr("checked", false);
                $("#add_contact_form input[name='mixinInfo']").attr("checked", false);
                $("#add_contact_form input[name='emailInfo']").attr("checked", false);
            });
            w.chooseUserModal = $("#contract_choose_modal");
            w.chooseUserModal.on("hidden.bs.modal", function(){
                $("#contract_choose_modal input[name='ztree_param']").val("");
            });
        },

        submitBind : function(){
            var w = this;
            $(".button-submit").bind("click", {contextindex:w}, w.functions.submitMethod);
        }

    }



    var initview = {

        // 初始化页面的所有select标签
        initContact : function(){
            var w = this;
            common_function.appendSelect(w.setting.pmList, $("#contract_pm"), "id", "name");
            common_function.appendSelect(w.setting.salerList, $("#contract_saler"), "id", "name");
            common_function.appendSelect(w.setting.customerList, $("#customer_name"), "id", "name");
            common_function.appendSelect(w.setting.customerList, $("#contract_remark"), "id", "name");
        },

        // 初始化wizard
        initWizard : function(){
            var w = this;
            w.formWizard = $('#form_wizard');
            $('#form_wizard').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index) {
                    return false;
                },
                onPrevious: function (tab, navigation, index) {
                    w.initview.initWizardBtn.call(w, tab, navigation, index);
                },
                onNext: function (tab, navigation, index) {
                    var flag = w.functions.wizardNext(tab, navigation, index);
                    if(flag){
                        w.initview.initWizardBtn.call(w, tab, navigation, index);
                    }
                    return flag;
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.bar').css({
                        width: $percent + '%'
                    });
                }
            });
        },

        // wizard按钮事件
        initWizardBtn : function(tab, navigation, index){
            var total = navigation.find('li').length;
            var current = index + 1;
            var formWizard = $('#form_wizard');
            if (current == 1) {
                formWizard.find('.button-previous').hide();
            } else {
                formWizard.find('.button-previous').show();
            }
            if (current >= total) {
                formWizard.find('.button-next').hide();
                formWizard.find('.button-submit').show();
            } else {
                formWizard.find('.button-next').show();
                formWizard.find('.button-submit').hide();
            }
        },

        // 联系人信息回显到页面
        initContactTable : function(){
            var w = this;
            var tableName = "contract_contact_table";
            var table = $("#" + tableName);
            var tbody = $(".contract-contact-table-list", table);
            tbody.html("");
            common_function.fnClearDataTable("contract_contact_table");
            $.each(w.setting.contactAddList, function(point, item){
                var tr = $("<tr></tr>");
                tr.append($("<td>" + item['username'] + "</td>"));
                tr.append($("<td>" + item['telephone'] + "</td>"));
                tr.append($("<td>" + item['email'] + "</td>"));
                var alertType = "";
                if(item['alertType'] & 1){
                    alertType = " 短信 "
                }
                if(item['alertType'] & 2){
                    alertType += " 密信 ";
                }
                if(item['alertType'] & 4){
                    alertType += " 邮件 ";
                }
                tr.append("<td>" + alertType + "</td>");
                var editBtn = $("<button class='btn'>修改</button>");
                var deleteBtn = $("<button class='btn'>删除</button>");
                var td = $("<td></td>");
                editBtn.bind("click", {contextindex:w, telephone:item['telephone']}, w.functions.editOneContact);
                deleteBtn.bind("click", {contextindex:w, telephone:item['telephone']}, w.functions.deleteOneContact);
                td.append(editBtn).append(deleteBtn).appendTo(tr);
                tbody.append(tr);
            });
            common_function.fnDrawDataTable(tableName, $("#"+tableName), 8);
        },

        // 初始化联系人列表【修改合同时调用】
        initContactAddList : function(){
            var w = this;
            if(w.setting.contactListSrc){
                $.each(w.setting.contactListSrc, function(point, item){
                    var alertType = item['warning_type'];
                    var user_id = item['user_id'];
                    for(var i = 0; i < w.setting.contactList.length; i++){
                        var tmp = w.setting.contactList[i];
                        if(tmp['id'] == user_id){
                            w.setting.contactAddList.push({
                                "username":tmp['name'],
                                "telephone":tmp['username'],
                                "email":tmp['email'],
                                "alertType":alertType
                            });
                            break;
                        }
                    }
                });
                w.initview.initContactTable.call(w);
            }
        },

        // 将合同信息回显到页面【合同修改时调用】
        initContent : function(){
            var w = this;
            if(w.setting.contractInfoSrc){
                var contractInfo = w.setting.contractInfoSrc;
                $("#contract_id").val(contractInfo['number']);
                $("#contract_name").val(contractInfo['name']);
                $("#customer_name").val(contractInfo['customer_id']);
                var startTime = contractInfo['start_time'];
                startTime = startTime.substr(0, 10);
                $("#contract_begin").val(startTime);
                var endTime = contractInfo['end_time'];
                endTime = endTime.substr(0, 10);
                $("#contract_end").val(endTime);
                $("#contract_pm").val(contractInfo['pm_id']);
                $("#contract_saler").val(contractInfo['saler_id']);
                var packages = contractInfo['packages'];
                if(1&packages){
                    $("#vuls-scan").attr("checked", true);
                    $("#web-scan-config-div").show();
                    var vulsScan = $.parseJSON(contractInfo['webscan_params']);
                    $("#task-node").val(vulsScan['node_id']);
                    $("#policy-group").val(vulsScan['policy_group_id']);
                    $("#task-level").val(vulsScan['deep']);
                    $("#task-min-slip").val(vulsScan['slice_size']);
                    $("#task-cycle input[value='" + vulsScan['is_cyc']  + "']").attr("checked", true);
                }
                if(2&packages){
                    $("#server-check").attr("checked", true);
                    $("#web-server-config-div").show();
                }
                if(4&packages){
                    $("#cloud-waf").attr("checked", true);
                    $("#web-waf-config-div").show();
                    $("#contract_domain_list_wrapper").show();
                    $("#contract-domain-list").hide();
                    if(w.setting.domainListSrc){
                        $("#contract-domain-list").text("");
                        var tbody = $("#contract_domain_list_wrapper").find("tbody");
                        tbody.html("");
                        for(var i = 0; i < w.setting.domainListSrc.length; i++){
                            var tmp = w.setting.domainListSrc[i];
                            var tr = $("<tr></tr>");
                            tr.append('<td><select><option value="http" checked>http</option><option value="https">https</option></select></td>');
                            tr.append('<td><p contenteditable="true">' + tmp['domain'] + '</p></td>');
                            tr.append('<td><p contenteditable="true">端口</p></td>');
                            tr.append('<td><p contenteditable="true">防护网站公网真实IP</p></td>');
                            tr.appendTo(tbody);
                        }
                    }
                }
                if(8&packages){
                    $("#security-scan").attr("checked", true);
                    $("#security-event-config-div").show();
                    var securityScan = $.parseJSON(contractInfo['securityscan_params']);
                    $("#event-task-node").val(securityScan['node_id']);
                    $("#event-policy-group").val(securityScan['policy_group_id']);
                    $("#event-task-level").val(securityScan['deep']);
                    $("#event-task-min-slip").val(securityScan['slice_size']);
                    $("#event-task-cycle input[value='" + securityScan['is_cyc']  + "']").attr("checked", true);
                }
                if(!$("#cloud-waf").attr("checked")){
                    var domain = "";
                    for(var i = 0; i < w.setting.domainListSrc.length; i++){
                        domain += w.setting.domainListSrc[i]['domain'] + "\n";
                    }
                    $("#contract-domain-list").val(domain);
                }
                w.initview.initContactAddList.call(w);
                $(".page_desc").text("修改合同");
            }
        }

    }
    $(function(){
        var w = new ContractIndex();
        w.init.call(w);
    })
})();