/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var domainList = $("#domainList").val();

    $(document).ready(function(){
        domainList = decodeURIComponent(domainList);
        __init__.bindFunction();
        __init__.initView();
        __init__.addHandler();
    });



    var __init__={
        initView:function(){
        },
        bindFunction:function(){
            $("input[name='task-cycle']").bind("click", function(){
                if($(this).attr("checked")){
                    $(this).parent().addClass("checked");
                }else{
                    $(this).parent().removeClass("checked");
                }
                if($(this).val() == "1"){
                    $(".cyc-day").show();
                }else{
                    $(".cyc-day").hide();
                }
            });
        },
        addHandler:function(){
            // 上一步
            $(".task-create-last-stmp").bind("click", function(){
                var form = $(".task-create-last-form");
                $("input[name='domainList']").val(domainList);
                form.attr("action", __ROOT__ + "/OptCenter/TaskCreate/index");
                form.submit();
            });

            // 添加任务
            $(".task-create-btn").bind("click", function(){
                var task_name = $.trim($(".task-name").val());
                var task_desc = $.trim($(".task-desc").val());
                var task_node = $("#task-node").val();
                var policy_group = $("#policy-group").val();
                var task_level = $("#task-level").val();
                var task_min_slip = $("#task-min-slip").val();
                var task_cycle = $("input[name='task-cycle']:checked").val();
                var url = domainList;
                var cyc_day = $("#cyc_day").val();
                var task_style = $("input[name='scan_style']:checked").val();
                if(!task_name){
                    Message.init({
                        text: '任务名称不能为空!',
                        type: 'warning' //info success warning danger
                    });
                    return;
                }
                if(!task_desc){
                    Message.init({
                        text: '任务描述不能为空!',
                        type: 'warning' //info success warning danger
                    });
                    return;
                }

                var param = {
                    name:task_name,
                    policy_group_id:policy_group,
                    remark:task_desc,
                    deep:task_level,
                    is_cyc:task_cycle,
                    slice_size:task_min_slip,
                    node_id:task_node,
                    scan_style:$("input[name='task-style']:checked").val(),
                    urls: url,
                    cyc_day:cyc_day
                };
                var thisBtn = $(this);
                var lastStmp = $(".task-create-last-stmp");
                // 设置用户不能点击
                thisBtn.attr("disabled", "disabled");
                lastStmp.attr("disabled", "disabled");
                $.post(__ROOT__ + "/OptCenter/TaskCreate/addTask", param).success(function(json){
                    if(json['code']){
                        Message.init({
                            text: '任务创建成功!',
                            type: 'success' //info success warning danger
                        });
                        // 跳转到任务列表页面
                        var path = __ROOT__ + "/OptCenter/TaskTrace/index";
                        window.location.href = path;
                    }else{
                        Message.init({
                            text: '任务创建失败!' + json['msg'],
                            type: 'danger' //info success warning danger
                        });
                        thisBtn.removeAttr("disabled");
                        lastStmp.removeAttr("disabled");
                    }
                });
            });
        }
    };

})();