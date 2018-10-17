/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){


    $(document).ready(function(){


        __init__.bind_function();

        //__init__.initView();

    });

    var __init__={

        bind_function : function(){
            $(".notify-user-save").bind("click", function(){
                var param = {};
                var id = $.trim($("[name='id']").val());
                var name= $.trim($("[name='name']").val());
                var phone= $.trim($("[name='phone']").val());
                var email= $.trim($("[name='email']").val());
                var state= $.trim($("[name='state']").val());
                var remark= $.trim($("[name='remark']").val());

                $.extend(param,{"id":id});
                $.extend(param,{"name":name});
                $.extend(param,{"phone":phone});
                $.extend(param,{"email":email});
                $.extend(param,{"state":state});
                $.extend(param,{"remark":remark});
                $.post(__ROOT__+"/MSSP/Saler/update",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                });
            });
        }
    };
})();