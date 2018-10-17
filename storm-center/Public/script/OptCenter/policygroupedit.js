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

    var PolicyGroupEdit = function(){
        this.setting = setting;
        this.initdata = initdata;
        this.functions = functions;
        this.initbind = initbind;
        this.initview = initview;
        this.init = init;
    }

    var init = function(){

        this.setting.policy_detail = $.parseJSON(decodeURIComponent($("#policy_detail").val()));

        this.initbind.bind.call(this);

        if($("#policy_group_info").val()){
            this.setting.policy_group_info = $.parseJSON(decodeURIComponent($("#policy_group_info").val()));
            this.initview.initContent.call(this);
        }
    }

    var setting = {
        policy_detail:[],
        policy_list:[],
        policy_group_info:[]
    }

    var initdata = {
        postData : function(event){
            var w = event.data.context;
            var obj = $(event.data.target);
            var flag = w.functions.validateParam.call(w);
            if(flag){
                var param = w.functions.initParam.call(w);
                obj.attr("disabled", true);
                $.post(__ROOT__ + "/OptCenter/PolicyGroup/insert", param).success(function(json){
                    if(json['code']){
                        window.location = __ROOT__ + "/OptCenter/PolicyGroup/index";
                    }else{
                        commons_function.showMsg(json['msg'], "danger");
                        obj.attr("disabled", true);
                    }
                });
            }
        },
        postUpdate:function(event){
            var w = event.data.context;
            var obj = $(event.target);

            var flag = w.functions.validateParam.call(w);
            if(flag){
                var param = w.functions.initParam.call(w);
                obj.attr("disabled", true);
                $.extend(param, {"id":w.setting.policy_group_info['id']});
                $.post(__ROOT__ + "/OptCenter/PolicyGroup/update", param).success(function(json){
                    if(json['code']){
                        window.location = __ROOT__ + "/OptCenter/PolicyGroup/index";
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
                w.initview.initPolicy.call(w);
                w.select_policy_model = $("#seleft_group_policy");
                w.select_policy_model.modal({backdrop:'static'});// 禁止点击空白处关闭
                w.select_policy_model.on('hidden.bs.modal', {context:w}, w.functions.modalCloseFunction);
                w.select_policy_model.modal("show");
            }
            return false;
        },
        validateParam:function(event){
            var w = this;
            if(!$.trim($("#policy_group_name").val())){
                commons_function.showMsg("请填写任务名称!", "danger");
                return false;
            }
            if(!w.setting.policy_list.length){
                commons_function.showMsg("请选择扫描策略!", "danger");
                return false;
            }
            return true;
        },
        queryPolicyDetail:function(event){
            var w = event.data.context;
            w.initview.initPolicy.call(w);
        },
        modalCloseFunction:function(event){
            var w = event.data.context;
            $("#policy_level").select2("val", 0);
            $("#policy_query_param").val("");
            w.initview.initPolicy.call(w);
        },
        putSelectToList:function(event){
            var w = event.data.context;
            var table = $("#policy_select_table");
            var ids = "";
            ids=storm.getTableSelectedIds(table);
            if(ids){
                var policyIdList = ids.split(",");
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
        initParam : function(){
            var w = this;
            var policyId = [];
            for(var i = 0; i < w.setting.policy_list.length; i++){
                var tmp = w.setting.policy_list[i];
                policyId.push(tmp['id']);
            }
            var param = {};
            $.extend(param,{
                name: $.trim($("#policy_group_name").val()),
                desc: $.trim($("#policy_group_desc").val()),
                policy_ids:policyId.join(",")
            });
            return param;
        },
        clearSelectPolicy:function(event){
            var w = event.data.context;
            w.setting.policy_list = [];
            $("#group_policy").html("");
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

        initSelectPolicy : function(){
            var w = this;
            $("#group_policy").text("");
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
                $("#group_policy").append(line);
            });
        },

        initContent : function(){
            var w = this;
            $("#policy_group_name").val(w.setting.policy_group_info['name']);
            $("#policy_group_desc").val(w.setting.policy_group_info['remark']);
            var policyIds = w.setting.policy_group_info['policy_ids'].split(",");
            $.each(policyIds, function(point, item){
                for(var i = 0; i < w.setting.policy_detail.length; i++){
                    var tmp = w.setting.policy_detail[i];
                    if(item == tmp['id']){
                        w.setting.policy_list.push(tmp);
                        return;
                    }
                }
            });
            w.initview.initSelectPolicy.call(w);
            $(".page_detail_name").text("修改策略组");
            w.initbind.bindUpdate.call(w);
        }
    }

    var initbind = {
        bind:function(){
            var w = this;
            $(".select_policy_model_btn").bind("click", {context:w}, w.functions.showPolicyModel);
            $("#policy_query_btn").bind("click", {context:w}, w.functions.queryPolicyDetail);
            $("#add_select_policy").bind("click", {context:w}, w.functions.putSelectToList);
            $(".task-create-btn").bind("click", {context:w}, w.initdata.postData);
            $(".clear_select_policy_btn").bind("click", {context:w}, w.functions.clearSelectPolicy);
            $(".delete_select_danger_policy_btn").bind("click", {context:w}, w.functions.deleteDangerPolicy);
            $(".drop_one_policy").live("dblclick", {context:w}, w.functions.dropOnePolicy);
        },
        bindUpdate : function(){
            var w = this;
            var updateBtn = $(".task-create-btn");
            updateBtn.text("修改");
            updateBtn.unbind("click");
            updateBtn.bind("click", {context:w}, w.initdata.postUpdate);
        }
    }

    $(function(){
        var policyGroupEdit = new PolicyGroupEdit();
        policyGroupEdit.init.call(policyGroupEdit);
    })
})();