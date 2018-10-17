/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var taskTable;

    var filterParam=[];

    var idSeq=[];
    var num;

    var checkboxes = [];
    $(document).ready(function(){
        var task_node = $("#task-node").val();

        filterParam.push({name:'task_node', value:task_node});
        __init__.initView();
        __init__.addHandler();
    });

    var __init__={
        initView:function(){
            taskTable=$("#task-table").dataTable($.extend(storm.defaultGridSetting(),{
                'bStateSave': true,
                "sAjaxSource": __ROOT__+'/OptCenter/TaskTrace/query',//请求URL
                "aoColumns": [ //参数映射
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"mDataProp": 'slice_size'},
                    {"mDataProp": 'url_num'},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''}
                ],
                "aoColumnDefs": [//指定列属性
                    //{"aTargets":[2],"mRender":function(value,type,aData){
                    //    return
                    //}}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var check_status = aData['status'];
                    // 选择框
                    if(check_status == 1){
                        var checkBox = $("<input type='checkbox' value='"+aData['id']+"'>");
                        checkBox.data("srcData", aData);
                        for(var i=0;i<checkboxes.length;i++){
                            if(checkboxes[i].val()==checkBox.val()){
                                checkBox.attr("checked",true);
                            }
                        }
                        checkBox.bind("click",function(){
                            if(checkBox.attr("checked")){
                                checkboxes.push(checkBox);
                            }else{
                                for(var i=0;i<checkboxes.length;i++){
                                    if(checkboxes[i].val()==checkBox.val()){
                                        checkboxes.splice(i,1);
                                    }
                                }
                            }
                        });
                        $('td:eq(0)', nRow).append(checkBox);
                    }else{
                        $('td:eq(0)', nRow).html("");
                    }


                    // 任务名称
                    if(aData['name'] && aData['name'].length > 15){
                        var addr = $("<abbr title='" + aData['name'] + "'>" + aData['name'].substr(0,15) + "...</abbr>");
                        $('td:eq(1)', nRow).append(addr);
                    }else{
                        $('td:eq(1)', nRow).html(aData['name'] ? aData['name'] : '');
                    }

                    // 备注
                    if(aData['remark'] && aData['remark'].length > 15){
                        var addr = $("<abbr title='" + aData['remark'] + "'>" + aData['remark'].substr(0,15) + "...</abbr>");
                        $('td:eq(2)', nRow).append(addr);
                    }else{
                        $('td:eq(2)', nRow).html(aData['remark'] ? aData['remark'] : '');
                    }

                    // 开始时间
                    $('td:eq(5)', nRow).html(aData['start_time'] && aData['start_time'] != 'null' ? aData['start_time'] : '');

                    if(aData['end_time'] && aData['start_time']){
                        var startDate = new Date(aData['start_time'].replace(/-/g,   "/"));
                        var endDate = new Date(aData['end_time'].replace(/-/g,   "/"));

                        var startMilliseconds = startDate.getTime();
                        var endMilliseconds = endDate.getTime();
                        var time = endMilliseconds - startMilliseconds;
                        var hour = (time / 1000  /  60  /  60).toFixed(2);

                        $('td:eq(6)', nRow).html(hour + " 小时");
                    }

                    // 进度条
                    if(check_status == 3){
                        $('td:eq(7)', nRow).html("扫描结束");
                    }else if(check_status == 2){
                        var progressDiv = $('<div class="progress"></div>');
                        var allSlice = aData['slice_total_num'];
                        var lastSlice = aData['slice_remain_num'];
                        var endedSlice = allSlice - lastSlice;
                        var runningState = (endedSlice / allSlice * 100).toFixed(0);
                        var progressDivInnerDiv = $('<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100""></div>');
                        progressDivInnerDiv.css("width", runningState + "%");
                        progressDivInnerDiv.html(runningState + '%');
                        progressDiv.append(progressDivInnerDiv);
                        $('td:eq(7)', nRow).append(progressDiv);
                    }else if(check_status == 1){
                        $('td:eq(7)', nRow).html("正在等待");
                    }

                    // 操作
                    var infoDetail = $('<a class="btn blue-stripe mini">查看</a>');
                    infoDetail.attr("href", __ROOT__ + "/OptCenter/TaskTrace/detail?id=" + aData['id']);
                    var endTask = "";
                    var reCheck = "";
                    var reStart = "";
                    if(check_status == 3){
                        reCheck = $('<a class="btn blue-stripe mini" href="#">重新扫描</a>');
                        $('td:eq(8)', nRow).append(infoDetail).append(reCheck);
                    }else if(check_status == -2){
                        reStart = $('<a class="btn red-stripe mini" href="#">开始</a>');
                        $('td:eq(8)', nRow).append(infoDetail).append(reStart);
                    }else{
                        endTask = $('<a class="btn red-stripe mini" href="#">终止</a>');
                        $('td:eq(8)', nRow).append(infoDetail).append(endTask);
                    }

                    // 绑定终止任务操作
                    if(endTask != ""){
                        endTask.bind("click", function(){
                            $.post(__ROOT__ + "/OptCenter/TaskTrace/stopTask", {id:aData['id']}).success(function(json){
                                if(json['code']){
                                    Message.init({
                                        text: "操作成功!",
                                        type: 'success' //info success warning danger
                                    });
                                    taskTable.fnDraw(false);// 刷新
                                }else{
                                    Message.init({
                                        text: "终止失败!",
                                        type: 'warning' //info success warning danger
                                    });
                                }
                            });
                        });
                    }

                    // 绑定重扫操作
                    if(reCheck != ""){
                        reCheck.bind("click", function(){
                            $.post(__ROOT__ + "/OptCenter/TaskTrace/restart", {id:aData['id']}).success(function(json){
                                if(json['code']){
                                    Message.init({
                                        text: "操作成功!",
                                        type: 'success' //info success warning danger
                                    });
                                    taskTable.fnDraw(false);// 刷新
                                }else{
                                    Message.init({
                                        text: "操作失败!",
                                        type: 'warning' //info success warning danger
                                    });
                                }
                            });
                        });
                    }

                    // 绑定重扫操作
                    if(reStart != ""){
                        reStart.bind("click", function(){
                            $.post(__ROOT__ + "/OptCenter/TaskTrace/restart", {id:aData['id']}).success(function(json){
                                if(json['code']){
                                    Message.init({
                                        text: "操作成功!",
                                        type: 'success' //info success warning danger
                                    });
                                    taskTable.fnDraw(false);// 刷新
                                }else{
                                    Message.init({
                                        text: "操作失败!",
                                        type: 'warning' //info success warning danger
                                    });
                                }
                            });
                        });
                    }

                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
        },
        addHandler:function(){

            // 查询
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"name",value:param});
                }
                var selectValue = $("#task-state").val();
                if(selectValue){
                    filterParam.push({name:"status",value:selectValue});
                }
                var task_node = $("#task-node").val();
                filterParam.push({name:"task_node", value:task_node});
                taskTable.fnPageChange(0);
            });

            // 优先级调整控制器
            $(".btn-task-change-priority").bind("click", function(){
                $(".exchange-level").html("");
                //var tbody=$("tbody",$("#task-table"));
                //var checks=$(":checked",tbody);
                var checks = checkboxes;
                num=checks.length;
                var point = 0;
                if(checks.length < 2){
                    Message.init({
                        text: "请选择多个任务进行调整!",
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var tmp = checks;
                var result = [];

                // 排序 从小到大
                for(var x = 0 ; x < checks.length; x++){//控制趟数
                    for(var y = x + 1 ; y < checks.length ; y++){
                        var xsrcData = $(checks[x]).data("srcData");
                        var ysrcData = $(checks[y]).data("srcData");
                        if(xsrcData['seq'] > ysrcData['seq']){
                            var temp = checks[x];
                            checks[x] = checks[y];
                            checks[y] = temp;
                        }
                    }
                }

                $.each(checks, function(point, item){
                    var id = "exchange-prority-" + point;
                    var srcData = $(item).data("srcData");
                    //console.info(srcData['seq']);
                    var wapper = $("#exchange-priority-one").clone().removeAttr("id").attr("id",id).attr("task-id", srcData['id']).attr("seq-id", srcData['seq']);
                    $(".priority-up", wapper).attr("parentDiv_id", id);
                    $(".priority-down", wapper).attr("parentDiv_id",id);
                    $(".title", wapper).html(srcData['name']);
                    wapper.show().appendTo($(".exchange-level"));
                    point++;
                });
                $("#myModal").modal("show");
            });

            // 向上移动
            $(".priority-up").live("click", function(){
                var thisElement = $(this);
                var parentId = thisElement.attr("parentDiv_id");
                var thisDiv = $("#" + parentId);
                var prevDiv = thisDiv.prev();
                var param = {
                    "prevId":prevDiv.attr("task-id"),
                    "prevSeq":thisDiv.attr("seq-id"),
                    "lastId":thisDiv.attr("task-id"),
                    "lastSeq":prevDiv.attr("seq-id")
                };
                var thisSeq=thisDiv.attr("seq-id");
                thisDiv.attr("seq-id",prevDiv.attr("seq-id"));
                prevDiv.attr("seq-id",thisSeq);
                thisDiv.insertBefore(prevDiv);
                // 更新
                //$.post(__ROOT__ + "/OptCenter/TaskTrace/update", param).success(function(json){
                //    if(json['code']){
                //        if(!prevDiv){
                //            Message.init({
                //                text: "已经到顶部了,没办法继续移动!",
                //                type: 'success' //info success warning danger
                //            });
                //        }else{
                //            thisDiv.insertBefore(prevDiv);
                //        }
                //    }else{
                //        Message.init({
                //            text: "操作失败!",
                //            type: 'success' //info success warning danger
                //        });
                //    }
                //});

            });

            // 向下移动
            $(".priority-down").live("click", function(){
                var thisElement = $(this);
                var parentId = thisElement.attr("parentDiv_id");
                var thisDiv = $("#" + parentId);
                var prevDiv = thisDiv.next();
                var param = {
                    "prevId":prevDiv.attr("task-id"),
                    "prevSeq":thisDiv.attr("seq-id"),
                    "lastId":thisDiv.attr("task-id"),
                    "lastSeq":prevDiv.attr("seq-id")
                };
                var thisSeq=thisDiv.attr("seq-id");
                thisDiv.attr("seq-id",prevDiv.attr("seq-id"));
                prevDiv.attr("seq-id",thisSeq);
                thisDiv.insertAfter(prevDiv);
                // 更新
                //$.post(__ROOT__ + "/OptCenter/TaskTrace/update", param).success(function(json){
                //    if(json['code']){
                //        if(!prevDiv){
                //            Message.init({
                //                text: "已经到顶部了,没办法继续移动!",
                //                type: 'success' //info success warning danger
                //            });
                //        }else{
                //            thisDiv.insertAfter(prevDiv);
                //        }
                //    }else{
                //        Message.init({
                //            text: "操作失败!",
                //            type: 'success' //info success warning danger
                //        });
                //    }
                //});
            });

            // 不调整
            $(".exchange-level-unsent").live("click", function(){
                $(".exchange-level").html("");
                $("#myModal").modal("hide");
                for(var i=0;i<checkboxes.length;i++){
                    checkboxes[i].attr("checked",false);
                }
                checkboxes=[];
                idSeq=[];
            });

            // 调整内容保存
            $(".exchange-level-sent").live("click", function(){
                for(var i=0;i<num;i++){
                    var id=$("#exchange-prority-"+i).attr("task-id");
                    var seq=$("#exchange-prority-"+i).attr("seq-id");
                    idSeq.push({"id":id,"seq":seq});
                }
                $.post(__ROOT__ + "/OptCenter/TaskTrace/update", {"idSeq":idSeq}).success(function(json){
                    if(json['code']){
                        Message.init({
                            text:"优先级调整成功",
                            type:'success'
                        });
                    }else{
                        Message.init({
                            text: "操作失败!",
                            type: 'success' //info success warning danger
                        });
                    }
                });
                checkboxes=[];
                idSeq=[];

                $(".exchange-level").html("");
                //taskTable.fnDraw();
                taskTable.fnDraw(false);
                $("#myModal").modal("hide");
            });
        }
    };
})();