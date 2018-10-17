(function(){

    var ContractIndex = function(){
        this.setting = setting;
        this.initdata = initdata;
        this.initfunction = initfunction;
        this.initbind = initbind;
        this.initview = initview;
        this.init = init;
    }

    var init = function(){
        var w = this;
        var height= $(window).height();
        $('#left-pie').height(height* .4);
        $('#right-pie').height(height* .4);
        w.setting.customerSrc = $.parseJSON(decodeURIComponent($("#customerSrc").val()));
        w.initdata.initTable.call(w);
        w.initbind.bind.call(w);
        w.initview.initechart.call(w,function(){
            w.initview.initoption.call(w, w.leftPie, w.setting.option(), $.parseJSON(decodeURIComponent($("#contract_state").val())), w.setting.leftLegend, "合同状态统计");
            w.initview.initoption.call(w, w.rightPie, w.setting.option(), $.parseJSON(decodeURIComponent($("#contract_packages").val())), w.setting.riughtLegend, "服务套餐统计");
            var ecConfig = require('echarts/config');
            w.initfunction.initchart.call(w, w.leftPie, ecConfig);
            w.initfunction.initchart.call(w, w.rightPie, ecConfig);
        });
    }

    var setting = {
        filterParam:[],
        customerSrc:[],
        leftLegend:{"inuse":"未过期","ended":"已结束","seven":"7天内结束"},
        riughtLegend:{"webScan":"网站漏洞监测","serverScan":"服务质量","webWaf":"云防护","securityEventScan":"安全事件监测"},
        packageItem:{"网站漏洞监测":1,"服务质量":2, "云防护":4, "安全事件监测":8},
        option:function(){
            var opt = {
                title : {
                    text: '',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    show: false,
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show:false,
                    orient : 'vertical',
                    x : 'left',
                    data:[]
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : false,
                series : [
                    {
                        name:'网站套餐统计',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                        ]
                    }
                ]
            }
            return opt;
        }
    }

    var initdata = {
        initTable:function(){
            var w = this;
            w.contractTable = $(".contract-list-table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/MSSP/Contract/listContract',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'number'},
                    {"mDataProp": 'name'},
                    {"mDataProp": 'customer_id'},
                    {"mDataProp": 'packages'},
                    {"mDataProp": 'start_time'},
                    {"mDataProp": 'end_time'},
                    {"mDataProp": 'create_time'},
                    {"mDataProp": 'state'},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[3],"mRender":function(value,type,aData){
                        for(var i = 0; i < w.setting.customerSrc.length; i++) {
                            var item = w.setting.customerSrc[i];
                            if(item['id'] == value){
                                return item['name'];
                            }
                        };
                    }},
                    {"aTargets":[4],"mRender":function(value,type,aData){
                        return w.initfunction.dealdate.call(w, value);
                    }},
                    {"aTargets":[5],"mRender":function(value,type,aData){
                        return value.substr(0,10);
                    }},
                    {"aTargets":[6],"mRender":function(value,type,aData){
                        return value.substr(0,10);
                    }},
                    {"aTargets":[7],"mRender":function(value,type,aData){
                        return value.substr(0,10);
                    }},
                    {"aTargets":[8],"mRender":function(value,type,aData){
                        return value==0?'无效':'有效';
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var detailBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');
                    detailBtn.bind("click", {contract_id:aData['id'],contractcontext:w}, w.initfunction.info);
                    var editBtn=$('<a class="btn yellow-stripe mini" href="#">修改</a>');
                    editBtn.bind("click",{contract_id:aData['id'],contractcontext:w}, w.initfunction.edit);
                    if(aData['state']){
                        var createUrl=$('<a class="btn blue-stripe mini">生成链接</a>');
                        createUrl.bind("click", {contract_id:aData['id'],contractcontext:w,packages_id:aData['packages']}, w.initdata.createUrl);
                        var delBtn=$('<a class="btn red-stripe mini">删除</a>');
                        delBtn.bind("click", {contract_id:aData['id'],contractcontext:w}, w.initdata.batchDelete);
                        $('td:eq(0)',nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                        $('td:eq(9)', nRow).append(editBtn).append(delBtn).append(detailBtn).append(createUrl);
                    }else{
                        $('td:eq(0)',nRow).html("");
                        $('td:eq(9)',nRow).append(editBtn).append(detailBtn);
                    }
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData, w.setting.filterParam);
                }
            }));
        },
        batchDelete:function(event){
            var w = event.data.contractcontext;
            $.post(__ROOT__+"/MSSP/Contract/beatchDelete",{'ids':event.data.contract_id}).success(function(json){
                Message.init({
                    text: json.msg,
                    type: 'success'
                });
                w.contractTable.fnDraw(false);
            });
        },
        createUrl:function(event){
            var modal = $("#url_confirm_modal");
            var w = event.data.contractcontext;
            var contract_id = event.data.contract_id;
            var packages_id = event.data.packages_id;
            if(contract_id){
                $(".contract_id", modal).val(contract_id)
            }else{
                contract_id = $(".contract_id", $("#url_confirm_modal")).val();
            }
            if(packages_id){
                $(".packages_id", modal).val(packages_id);
                if(1&packages_id || 8 & packages_id){
                    $("#vuls_report_check").attr("checked",'true');
                    $("#vuls_report_div").show();
                }
                if(2&packages_id){
                    $("#server_report_check").attr("checked",'true');
                    $("#server_report_div").show();
                }
                if(4 & packages_id){
                    $("#cloudwaf_report_check").attr("checked",'true');
                    $("#cloudwaf_report_div").show();
                }
            }else{
                if($("#vuls_report_check").attr("checked")==true){
                    packages_id += 1;
                }
                if($("#server_report_check").attr("checked")==true){
                    packages_id += 2;
                }
                if($("#cloudwaf_report_check").attr("checked")==true){
                    packages_id += 4;
                }
            }
            $.post(__WEBROOT__ + "/MSSP/Contract/generateUrl", {contract_id:contract_id, packages_id:packages_id}).success(function(json){
                w.initview.initModal.call(w, json);
            });
        },
        sendEmail:function(event){
            var w = event.data.contractcontext;
            var domainParam = [];
            var contactParam = [];
            var param = [];
            var modal = $("#url_confirm_modal");
            $.each($(".domain-list").find("option"), function(point, item){
                var tmp = $(item);
                domainParam.push({name:tmp.text(),"value":tmp.val()});
            });
            $.each($(".contact-list").find("option"), function(point, item){
                var tmp = $(item);
                contactParam.push(tmp.val());
            });
            if(contactParam.length == 0){
                Message.init({
                    text: "收件人不能为空。",
                    type: 'error'
                });
                return;
            }
            $.post(__WEBROOT__+"/MSSP/Contract/sendUrlEmail", {domainUrl:JSON.stringify(domainParam),contactList:JSON.stringify(contactParam)}).success(function(json){
                modal.modal("hide");
                w.modalShow = 0;
            });
            return false;
        }
    }

    var initfunction = {
        dealdate:function(value){
            var text = "";
            if(1 & value){
                text += " 漏洞扫描 ";
            }
            if(8 & value){
                text += " 安全事件扫描 ";
            }
            if(2 & value){
                text += " 服务监测 ";
            }
            if(4 & value){
                text += " 云防护 ";
            }
            return text;
        },
        edit:function(event){
            var path = __ROOT__ + "/MSSP/Contract/toUpdate?id=" + event.data.contract_id;
            location.href = path;
        },
        showreport:function(event){
            var obj = event.data.eventObj;
            var path = obj.find("option:selected").val();
            window.open(path, "_blank");
        },
        info:function(event){
            var path = __ROOT__ + "/MSSP/Contract/detail?id=" + event.data.contract_id;
            location.href = path;
        },
        btnSearch:function(event){
            var w = event.data.contractcontext;
            var paramState = 0;
            var typeState = 0;
            var packagesState = 0;
            var param = $.trim($("#query-param").val());
            var state = $("#contract-state").val();
            var packages = $("#query_packages").val();
            for(var i = 0; i < w.setting.filterParam.length; i++){
                var item = w.setting.filterParam[i];
                if(item.name == "param"){
                    item.value = param;
                    paramState = 1;
                }
                if(item.name == "state"){
                    item.value = state;
                    typeState = 1;
                }
                if(item.name == "packages"){
                    item.value = packages;
                    packagesState = 1;
                }
            }
            if(!paramState){
                w.setting.filterParam.push({name:"param",value:param});
            }
            if(!typeState){
                w.setting.filterParam.push({name:"state",value:state});
            }
            if(!packagesState){
                w.setting.filterParam.push({name:"packages",value:packages});
            }
            console.info(w.setting.filterParam);
            w.contractTable.fnPageChange(0);
        },
        deleteContract:function(event){
            var w = event.data.contractcontext;
            var ids=storm.getTableSelectedIds($(".contract-list-table"));
            event.data.contract_id=ids;
            w.initdata.batchDelete.call(w, event);
        },
        selectdbremove:function(event){
            var obj = event.data.eventObj;
            var option = obj.find("option:selected");
            option.remove();
        },
        addEmailBtn:function(){
            var modal = $("#url_confirm_modal");
            var email = $("input[name='add_email']", modal).val();
            var option = $("<option></option>");
            option.text(email);
            option.val(email);
            $(".contact-list", modal).append(option);
            $("input[name='add_email']", modal).val("");
            return false;
        },
        initchart:function(obj,ecConfig){
            var w = this;
            obj.on(ecConfig.EVENT.CLICK, function(param){
                var name = param.name;
                var value = w.setting.packageItem[name];
                $("#query_packages").val(value);
                $(".btn-search").trigger("click");
            });
        }
    }

    var initview = {
        initechart:function(callback){
            var w =this;
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/pie'
                ],
                function (ec) {
                    w.leftPie= ec.init(document.getElementById('left-pie'));
                    w.rightPie = ec.init(document.getElementById('right-pie'));
                    callback&&callback();
                }
            );
        },
        initoption:function(obj,option, value, arrays, title){
            var w = this;
            option.title.text = title;
            $.each(arrays, function(point, item){
                if(value[point]){
                    option.legend.data.push(item);
                    option.series[0].data.push({value:value[point], name:item});
                }
            });
            obj.setOption(option);
        },
        initModal:function(value){
            var w = this;
            var modal = $("#url_confirm_modal");
            var urlSelect = $(".domain-list", modal);
            var contactSelect = $(".contact-list", modal);
            urlSelect.empty();
            contactSelect.empty();
            var domainList = value['urlList'];
            $.each(domainList, function(point, item){
                var option = $("<option></option>");
                option.text(point);
                option.val(item);
                urlSelect.append(option);
            });
            var contactList = value['userList'];
            $.each(contactList, function(point, item){
                var option = $("<option></option>");
                option.text(item['email']);
                option.val(item['email']);
                contactSelect.append(option);
            });
            $(".contract_id", modal).val(value['contract_id']);
            if(!w.modalShow){
                w.modalShow = 1;
                modal.modal("show");
            }
        }
    }

    var initbind = {
        bind:function(){
            var w = this;
            $(".btn-search").bind("click",{contractcontext:w}, w.initfunction.btnSearch);
            $(".bth-batch-delete").bind("click",{contractcontext:w}, w.initfunction.deleteContract);
            $(".contact-list").bind("dblclick", {eventObj:$(".contact-list")},w.initfunction.selectdbremove);
            $(".domain-list").bind("dblclick", {contractcontext:w,eventObj:$(".domain-list")}, w.initfunction.showreport);
            $(".add_email_btn").bind("click", w.initfunction.addEmailBtn);
            var modal = $("#url_confirm_modal");
            $(".domain_re_create").bind("click",{contractcontext:w}, w.initdata.createUrl);
            $(".domain_url_send").bind("click", {contractcontext:w}, w.initdata.sendEmail);
            $("#url_confirm_modal").on("hide.bs.modal", function(){
                $("#cloudwaf_report_check").attr("checked", false);
                $("#cloudwaf_report_div").hide();
                $("#vuls_report_check").attr("checked", false);
                $("#vuls_report_div").hide();
                $("#server_report_check").attr("checked", false);
                $("#server_report_div").hide();
                w.modalShow = 0;
            });
        }
    }

    $(function(){
        var contractIndex = new ContractIndex();
        contractIndex.init.call(contractIndex);
    })
})();