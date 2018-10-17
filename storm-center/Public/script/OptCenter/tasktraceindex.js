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
        },
        timeSub:function(end, start){
            var startDate = new Date(start.replace(/-/g,   "/"));
            var endDate = new Date(end.replace(/-/g,   "/"));
            var startMilliseconds = startDate.getTime();
            var endMilliseconds = endDate.getTime();
            var time = endMilliseconds - startMilliseconds;
            var hour = (time / 1000  /  60  /  60).toFixed(2);
            return hour + "小时";
        },
        judgeStatus : function(value){
            var status = value['status'];
            var sliceTotal = value['slice_total_num'];
            var btn = $("<button class='btn mini'></button>").attr("disabled", true);
            if(status == 1){
                btn.text("等待扫描");
                btn.addClass("blue-stripe");
            }else if(status == 2){
                btn.text("正在扫描");
                btn.addClass("yellow-stripe");
            }else if(status == 3){
                var syncSlice = value['slice_sync_num'];
                if(sliceTotal == syncSlice){
                    btn.text("任务完成");
                }else{
                    btn.text("正在同步");
                }
                btn.addClass("blue-stripe");
            }else{
                btn.text("扫描终止");
                btn.addClass("red-stripe");
            }
            return btn;
        },
        initProgressBar : function(status, totalNum, remainNum){
            var progressDiv = $('<div class="progress"></div>');
            var progressDivInnerDiv = $('<div class="progress-bar progress-bar-success" role="progressbar" aria-valuemin="0" style="color:#000000" aria-valuemax="100"></div>');
            var runningState = 100;
            if(status == 3){
                progressDivInnerDiv.css("width", runningState + "%");
            }else if(status == 2){
                var endedSlice = totalNum - remainNum;
                runningState = (endedSlice / totalNum * 100).toFixed(0);
            }
            progressDivInnerDiv.html(runningState + '%');
            if(status == 1){
                progressDivInnerDiv.removeClass("progress-bar-success");
                progressDivInnerDiv.addClass("progress-bar-danger");
                progressDivInnerDiv.html("正在等待");
            }
            progressDiv.append(progressDivInnerDiv);
            return progressDiv;
        },
        initOptionBtn:function(status, data){
            var wrapper = $("<div></div>");
            var infoDetail = $('<a class="btn blue-stripe mini">查看</a>');
            infoDetail.attr("href", __ROOT__ + "/OptCenter/TaskTrace/detail?id=" + data['id']);
            wrapper.append(infoDetail);
            var endTask = "";
            var reCheck = "";
            var reStart = "";
            if(status == 3){
                reCheck = $('<a class="btn blue-stripe mini start_task_btn" href="#">重扫</a>').attr("info", data['id']);
                wrapper.append(reCheck);
            }else if(status == -2){
                reStart = $('<a class="btn red-stripe mini start_task_btn" href="#">开始</a>').attr("info", data['id']);
                wrapper.append(reStart);
            }else{
                endTask = $('<a class="btn red-stripe mini stop_task_btn" href="#">终止</a>').attr("info", data['id']);
                wrapper.append(endTask);
            }
            return wrapper;
        }
    }

    var TaskTraceIndex = function(){
        this.setting = setting;
        this.initdata = initdata;
        this.functions = functions;
        this.initbind = initbind;
        this.initview = initview;
        this.init = init;
    }

    var init = function(){
        this.setting.userList = $.parseJSON(decodeURIComponent($("#userList").val()));
        this.initview.initTable.call(this);
        this.initbind.tableBind.call(this);
        this.initbind.exchangeBind.call(this);
        this.initbind.searchBind.call(this);
    }

    var setting = {
        filterParam:[],
        userList:[]
    }

    var initdata = {
        stopTask:function(event){
            var w = event.data.context;
            var value = $(event.target).attr("info");

            $.post(__ROOT__ + "/OptCenter/TaskTrace/stopTask", {id:value}).success(function(json){
                if(json['code']){
                    commons_function.showMsg("操作成功！", "success");
                    w.taskTable.fnDraw(false);// 刷新
                }else{
                    commons_function.showMsg("暂停失败！","danger");
                }
            });
        },
        startTask:function(event){
            var w = event.data.context;
            var value = $(event.target).attr("info");

            $.post(__ROOT__ + "/OptCenter/TaskTrace/restart", {id:value}).success(function(json){
                if(json['code']){
                    commons_function.showMsg("操作成功！", "success");
                    w.taskTable.fnDraw(false);// 刷新
                }else{
                    commons_function.showMsg("操作失败！","danger");
                }
            });
        }
    }

    var functions = {
        exchangeSeq : function(event){
            var w = event.data.context;
            w.changeModel = $("#myModal");
        },
        queryByParam : function(event){
            var w = event.data.context;
            var param=$(event.target).prev().val();
            param= $.trim(param);
            w.setting.filterParam=[];
            if(param!=''){
                w.setting.filterParam.push({name:"name",value:param});
            }
            var selectValue = $("#task-state").val();
            if(selectValue){
                w.setting.filterParam.push({name:"status",value:selectValue});
            }
            var task_node = $("#task-node").val();
            w.setting.filterParam.push({name:"task_node", value:task_node});
            w.taskTable.fnPageChange(0);
        }
    }

    var initview = {
        initTable:function(){
            var w = this;
            w.taskTable = $("#task_list_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/TaskTrace/query',//请求URL
                "aoColumns": [ //参数映射
                    {"sDefaultContent": ''},
                    {"mDataProp": 'name'},
                    {"mDataProp": 'task_creater'},
                    {"mDataProp": 'slice_size'},
                    {"mDataProp": 'url_num'},
                    {"mDataProp": 'create_time'},
                    {"mDataProp": 'start_time'},
                    {"sDefaultContent": ''},// 扫描耗时
                    {"sDefaultContent": ''},// 完成状态
                    {"sDefaultContent": ''},// 扫描进度
                    {"sDefaultContent": ''}// 操作
                ],
                "aoColumnDefs": [//指定列属性
                    {"aTargets":[1],"mRender":function(value,type,aData){
                        var seq = "【" + aData['seq'] + "】";
                        if(value.length > 15){
                            value = "<abbr title='" + value + "'>" + value.substr(0,15) + "</abbr>";
                        }
                        return seq + value;
                    }},
                    {"aTargets":[2],"mRender":function(value,type,aData){
                        var userId = value || 1;
                        for(var i = 0; i < w.setting.userList.length; i++){
                            var tmp = w.setting.userList[i];
                            if(tmp['id'] == userId){
                                return tmp['name'];
                            }
                        }
                    }}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var status = aData['status'];
                    if(status == 1){
                        var checkBox = $("<input type='checkbox' value='"+aData['id']+"'>");
                        $('td:eq(0)', nRow).append(checkBox);
                    }else{
                        $('td:eq(0)', nRow).html("");
                    }
                    if(aData['end_time'] && aData['start_time']){
                        $('td:eq(7)', nRow).html(commons_function.timeSub(aData['end_time'], aData['start_time']));
                    }
                    $('td:eq(8)', nRow).append(commons_function.judgeStatus(aData));
                    $('td:eq(9)', nRow).append(commons_function.initProgressBar(status, aData['slice_total_num'], aData['slice_remain_num']));
                    $('td:eq(10)', nRow).append(commons_function.initOptionBtn(status, aData));
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData, w.setting.filterParam);
                }
            }));
        }
    }

    var initbind = {
        tableBind:function(){
            var w = this;
            $(".start_task_btn").live("click", {context:w}, w.initdata.startTask);
            $(".stop_task_btn").live("click", {context:w}, w.initdata.stopTask);
        },
        exchangeBind:function(){
            var w = this;
            $(".btn-task-change-priority").bind("click", {context:w}, w.functions.exchangeSeq);
        },
        searchBind:function(){
            var w = this;
            $(".btn-search").bind("click",{context:w}, w.functions.queryByParam);
        }
    }

    $(function(){
        var taskTrace = new TaskTraceIndex();
        taskTrace.init.call(taskTrace);
    })
})();