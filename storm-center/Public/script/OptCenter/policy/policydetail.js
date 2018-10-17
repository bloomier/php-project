/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */

(function(){

    var value = $("#policy-detail").val();

    $(document).ready(function(){
        value = decodeURIComponent(value);
        value = $.parseJSON(value);
        __init__.initView();
        __init__.bindFunction();

    });

    var __init__={
        initView : function(){
            $("#policy-level").val(value['level']);
            var tmp = value['has_danger'];
            var text = "无危害";
            if(tmp){
                text = "有危害";
            }
            $(".policy_danger").text(text);
        },
        bindFunction : function(){
            $(".update-policy").bind("click", function(){
                var id = value['id'];
                var level = $("#policy-level").val();
                var desc = $.trim($(".policy-desc").val());
                var repair = $.trim($(".policy-repair").val());
                var param = {'id':id, 'level':level};
                if(desc){
                    $.extend(param,{'desc':desc});
                }
                if(repair){
                    $.extend(param,{'repair':repair});
                }
                var updatePath = __ROOT__ + '/OptCenter/Policy/update';
                $.post(updatePath, param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                    var href = __ROOT__ + '/OptCenter/Policy/index';
                    window.location.href = href;
                });
            });
        }
    };
})();