(function(){

    var commons_function = {
        fnClearDataTable:function(name){
            var w=this;
            if(w[name]){
                w[name].fnClearTable();
            }
        },

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
        showMsg : function(msg, type){
            Message.init({
                text: msg,
                type: type //info success warning danger
            });
        }
    }

    var TaskAdd = function(){
        this.setting = setting;
        this.initdata = initdata;
        this.functions = functions;
        this.initbind = initbind;
        this.initview = initview;
        this.init = init;
    }

    var init = function(){

        this.setting.policy_group = $.parseJSON(decodeURIComponent($("#policy_group").val()));
        this.setting.policy_detail = $.parseJSON(decodeURIComponent($("#policy_detail").val()));

        this.initbind.bind.call(this);
    }

    var setting = {
        policy_group:[],
        policy_detail:[],
        policy_list:[]
    }

    var initdata = {
        postData : function(event){
            var w = event.data.context;
            var obj = $(event.data.target);
            var flag = w.functions.validateParam.call(w);
            if(flag){
                var param = w.functions.initParam.call(w);
                obj.attr("disabled", true);
                $.post(__ROOT__ + "/OptCenter/TaskCreate/addTask2", param).success(function(json){
                    if(json['code']){
                        window.location = __ROOT__ + "/OptCenter/TaskTrace/index";
                    }else{
                        commons_function.showMsg(json['msg'], "danger");
                        obj.attr("disabled", true);
                    }
                });
            }
        }
    }

    var functions = {
        showPolicyModel:function(event){
            var w = event.data.context;
            if(w.select_policy_model){
                w.select_policy_model.modal("show");
            }else{
                w.initview.initPolicyGroup.call(w);
                w.initview.initPolicy.call(w);
                w.select_policy_model = $("#seleft_task_policy");
                w.select_policy_model.modal({backdrop:'static'});// 禁止点击空白处关闭
                w.select_policy_model.on('hidden.bs.modal', {context:w}, w.functions.modalCloseFunction);
                w.select_policy_model.modal("show");
            }
            return false;
        },
        queryPolicyGroup:function(event){
            var w = event.data.context;
            w.initview.initPolicyGroup.call(w);
        },
        queryPolicyDetail:function(event){
            var w = event.data.context;
            w.initview.initPolicy.call(w);
        },
        modalCloseFunction:function(event){
            var w = event.data.context;
            $("#policy_group_query_param").val("");
            w.initview.initPolicyGroup.call(w);
            $("#policy_level").select2("val", 0);
            $("#policy_query_param").val("");
            w.initview.initPolicy.call(w);
            var firstTab = $('#policy_tab a:first');
            firstTab.tab('show');
        },
        putSelectToList:function(event){
            var w = event.data.context;
            var tab = $("#policy_tab .active a").attr("href");
            tab = tab.substr(1);
            var table = "";
            var ids = "";
            if(tab == "task_policy_select_tab"){
                table = $("#policy_select_table");
                ids=storm.getTableSelectedIds(table);
            }else{
                table = $("#policy_group_select_table");
                ids=storm.getTableSelectedIds(table);
            }
            if(ids){
                var policyIdList = [];
                var idList = ids.split(",");
                if(tab == "task_policy_group_select_tab"){
                    $.each(idList, function(point, item){
                        for(var i = 0; i < w.setting.policy_group.length; i++){
                            var tmp = w.setting.policy_group[i];
                            if(tmp['id'] == item){
                                var policyIds = tmp['policy_ids'] || [];
                                policyIdList = $.merge(policyIdList, policyIds.split(","));
                            }
                        }
                    });
                }else{
                    policyIdList = idList;
                }
                $.each(policyIdList, function(point, item){
                    var addFlag = true;
                    for(var i = 0; i < w.setting.policy_list.length; i++){
                        var tmpPolicy = w.setting.policy_list[i];
                        if(tmpPolicy['id'] == item){
                            addFlag = false;
                            break;
                        }
                    }
                    if(addFlag){
                        for(var i = 0; i < w.setting.policy_detail.length; i++){
                            var tmpPolicy = w.setting.policy_detail[i];
                            if(tmpPolicy['id'] == item){
                                w.setting.policy_list.push(tmpPolicy);
                                break;
                            }
                        }
                    }
                });
            }
            w.initview.initSelectPolicy.call(w);
            w.select_policy_model.modal("hide");
        },
        dropOnePolicy:function(event){
            var w = event.data.context;
            var obj = $(event.target);
            var policyId = obj.attr("policy_id");
            if(policyId){
                for(var i = 0; i < w.setting.policy_list.length; i++){
                    var tmp = w.setting.policy_list[i];
                    if(tmp['id'] == policyId){
                        w.setting.policy_list.splice(i,1);
                        break;
                    }
                }
            }
            obj.remove();
        },
        scanLevelBtn:function(event){
            var w = event.data.context;
            var obj = $(event.target);
            $.each($("#task_scan_level").find("button"), function(point, item){
                var tmp = $(item);
                tmp.removeClass("active");
            });
            obj.addClass("active");
        },
        policySizeBtn:function(event){
            var w = event.data.context;
            var obj = $(event.target);
            $.each($("#task_policy_size").find("button"), function(point, item){
                var tmp = $(item);
                tmp.removeClass("active");
            });
            obj.addClass("active");
        },
        validateParam:function(event){
            var w = this;
            var urls = [];
            var urlsText = $("#input_domain_list").val().split("\n");
            $.each(urlsText, function(point, item){
                item = $.trim(item);
                if(item){
                    urls.push(item);
                }
            });
            if(!urls.length){
                commons_function.showMsg("请填写扫描域名！", "danger");
                return false;
            }
            if(!$.trim($("#task_name").val())){
                commons_function.showMsg("请填写任务名称!", "danger");
                return false;
            }
            if(!w.setting.policy_list.length){
                commons_function.showMsg("请选择扫描策略!", "danger");
                return false;
            }
            return true;
        },
        initParam : function(){
            var w = this;
            var policyId = [];
            for(var i = 0; i < w.setting.policy_list.length; i++){
                var tmp = w.setting.policy_list[i];
                policyId.push(tmp['id']);
            }
            var deep = $("#task_scan_level .active").attr("value");
            var sliceSize = $("#task_policy_size .active").attr("value");
            var urls = [];
            var urlsText = $("#input_domain_list").val().split("\n");
            $.each(urlsText, function(point, item){
                item = $.trim(item);
                if(item){
                    urls.push(item);
                }
            });
            var param = {};
            $.extend(param,{
                name:$("#task_name").val(),
                remark: $.trim($("#task_desc").val()),
                policy_ids:policyId.join(","),
                deep : deep,
                is_cyc : 0,
                scan_style:$("input[name='task-style']:checked").val(),
                slice_size : sliceSize,
                node_id : $("#task_node").val(),
                urls:urls.join(",")
            });
            return param;
        },
        clearSelectPolicy:function(event){
            var w = event.data.context;
            w.setting.policy_list = [];
            $("#task_policy").html("");
            w.initview.initPolicy.call(w);
        },
        deleteDangerPolicy:function(event){
            var w = event.data.context;
            for(var i = 0; i < w.setting.policy_list.length; i++){
                var tmp = w.setting.policy_list[i];
                if(tmp['has_danger']){
                    w.setting.policy_list.splice(i, 1);
                    i--;
                }
            }
            w.initview.initSelectPolicy.call(w);
        }
    }

    var initview = {
        initPolicy : function(){
            var w = this;
            var tableName = "policy_select_table";
            var table = $("#" + tableName);
            var tbody = table.find("tbody");
            tbody.html("");
            commons_function.fnClearDataTable(tableName);
            var queryParam = $("#policy_query_param").val();
            var taskLevel = $("#policy_level").val();
            $.each(w.setting.policy_detail, function(point, item){
                var flag = true;
                if(queryParam){
                    var remark = item.remark || "";
                    if(item.name.indexOf(queryParam) < 0 && remark.indexOf(queryParam) < 0){
                        flag = false;
                    }
                }
                if(taskLevel > 0){
                    flag = false;
                    if(item.level == taskLevel){
                        flag = true;
                    }
                }
                if(queryParam && taskLevel > 0){
                    flag = true;
                    var remark = item.remark || "";
                    if(item.name.indexOf(queryParam) < 0 && remark.indexOf(queryParam) < 0 && item.level != taskLevel){
                        flag = false;
                    }
                }
                if(flag){
                    for(var i = 0; i < w.setting.policy_list.length; i++){
                        var tmp = w.setting.policy_list[i];
                        if(tmp['id'] == item['id']){
                            flag = false;
                            break;
                        }
                    }
                }
                if(flag){
                    var level = "信息";
                    if(item.level == 30){
                        level = "低危";
                    }else if(item.level == 40){
                        level = "中危";
                    }else if(item.level == 50){
                        level = "高危";
                    }else if(item.level == 60){
                        level = "安全事件";
                    }
                    var tr = $("<tr></tr>");
                    tr.append("<td><input type='checkbox' value='" + item.id + "'/></td>");
                    tr.append("<td>" + item.id + "</td>");
                    tr.append("<td>" + item.name + "</td>");
                    tr.append("<td>" + (item.has_danger?"有危害":"无危害") + "</td>");
                    tr.append("<td>" + level + "</td>");
                    tr.append("<td>" + item.desc || "" + "</td>");
                    tr.append("<td>" + item.repair_advice || "" + "</td>");
                    tr.append("<td>" + item.repair_advice || "" + "</td>");
                    tr.appendTo(tbody);
                }
            });
            commons_function.fnDrawDataTable(tableName, table, 8);
        },

        initPolicyGroup : function(){
            var w = this;
            var tableName = "policy_group_select_table";
            var table = $("#" + tableName);
            var tbody = table.find("tbody");
            tbody.html("");
            commons_function.fnClearDataTable(tableName);
            var queryParam = $("#policy_group_query_param").val();
            $.each(w.setting.policy_group, function(point, item){
                var flag = true;
                if(queryParam){
                    var remark = item.remark || "";
                    if(item.name.indexOf(queryParam) < 0 && remark.indexOf(queryParam) < 0){
                        flag = false;
                    }
                }
                if(flag){
                    var tr = $("<tr></tr>");
                    tr.append("<td><input type='checkbox' value='" + item.id + "'/></td>");
                    tr.append("<td>" + item.name + "</td>");
                    tr.append("<td>" + item.remark + "</td>");
                    tr.append("<td>" + item.remark + "</td>");
                    tr.appendTo(tbody);
                }

            });
            commons_function.fnDrawDataTable(tableName, table, 8);
        },

        initSelectPolicy : function(){
            var w = this;
            $("#task_policy").text("");
            $.each(w.setting.policy_list, function(point, item){
                var level = "【信息】";
                if(item.level == 30){
                    level = "【低危】";
                }else if(item.level == 40){
                    level = "【中危】";
                }else if(item.level == 50){
                    level = "【高危】";
                }else if(item.level == 60){
                    level = "【安全事件】";
                }
                var text = level + item['name'];
                if(item['has_danger']){
                    text = level + "【危害】" + item['name'];
                }
                var line = $("<div class='drop_one_policy' title='" + item['desc'] + "' policy_id='" + item['id'] + "'>" + text + "</div>");
                $("#task_policy").append(line);
            });
        }
    }

    var initbind = {
        bind:function(){
            var w = this;
            $(".select_policy_model_btn").bind("click", {context:w}, w.functions.showPolicyModel);
            $("#policy_group_query_btn").bind("click", {context:w}, w.functions.queryPolicyGroup);
            $("#policy_query_btn").bind("click", {context:w}, w.functions.queryPolicyDetail);
            $("#add_select_policy").bind("click", {context:w}, w.functions.putSelectToList);
            $(".drop_one_policy").live("dblclick", {context:w}, w.functions.dropOnePolicy);
            $("#task_scan_level").find("button").bind("click", {context:w}, w.functions.scanLevelBtn);
            $("#task_policy_size").find("button").bind("click", {context:w}, w.functions.policySizeBtn);
            $(".task-create-btn").bind("click", {context:w}, w.initdata.postData)
            $(".clear_select_policy_btn").bind("click", {context:w}, w.functions.clearSelectPolicy);
            $(".delete_select_danger_policy_btn").bind("click", {context:w}, w.functions.deleteDangerPolicy);
        }
    }

    $(function(){
        var taskAdd = new TaskAdd();
        taskAdd.init.call(taskAdd);
    })
})();