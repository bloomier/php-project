$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});


(function(){

    $(document).ready(function(){
        __init__.initData();

        __init__.bindEvent();

    });

    var __init__={
        initData : function(){

        },
        bindEvent : function(){
            $(".undo_task_apply").bind("click", function(){
                var formId = $("#form_id").val();
                $.post($("#rootPath").val()+ "/Self/Task/batchUndo",{"ids":formId}).success(function(json){
                    if(json.code > 0){
                        alert(json.msg);
                        location.reload();
                    } else {
                        alert('撤销失败');
                    }
                });
            });
            $().bind("click",function(){
                var form_id = $("#form_id").val();
                var form_report_path = $("#form_report_path_id").val();
                $.post(__ROOT__ + "/Self/Task/exportReport", {"form_id":form_id,"form_report_path":form_report_path}).success(function(json){
                    if(json.code > 0){
                        alert(json.msg);
                    } else {
                        alert(json.msg);
                    }

                });
            });
        }
    };

})();