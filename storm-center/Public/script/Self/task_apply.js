$.ajaxSetup ({
    cache: false //设置成false将不会从浏览器缓存读取信息
});

(function(){

    $(function(){
        _init_.view();
        _init_.bind();

    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;

        },
        bind : function() {
            $(".apply_form_audti").live("click", function () {
                _do_.insert();
            });
        },
        draw: {
            showLine : function(op){

            }
        }
    };
    var _init_data = {
        byUse : function(){

        },
        insert : function(){

        }
    }

    var _do_ = {
        byUse : function(){

        },
        insert : function(){
            var param = {};
            var domainList = $.trim($("#domainList_id").val());
            var applyReason = $.trim($("#applyReason_id").val());
            if(domainList == ''){
                alert('请填写域名列表');
                return ;
            }
            if(applyReason == ''){
                alert('请填写申请原因');
                return ;
            }
            $.extend(param,{"domain_list":domainList});
            $.extend(param,{"apply_reason":applyReason});
            $.post(__ROOT__+"/Self/Task/insert",param).success(function(json){
                if(json.code > 0){
                    alert(json.msg);
                    $("#domainList_id").val('');
                    $("#applyReason_id").val('');
                } else {
                    alert('操作失败');
                }
            });
        }
    }

})();