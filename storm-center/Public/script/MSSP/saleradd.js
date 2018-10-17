/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){


    $(document).ready(function(){
        __init__.bind_function();

    });

    var __init__={
        bind_function : function(){
            $(".notify-user-save").bind("click", function(){
                var param = {};
                //var id= $.trim($("[name='id']").val());
                var name= $.trim($("[name='name']").val());
                var phone= $.trim($("[name='phone']").val());
                var email= $.trim($("[name='email']").val());
                var remark= $.trim($("[name='remark']").val());
                if(!name){
                    Message.init({
                        text: '用户名不能为空',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var handsReg = /^1[3-9][0-9]\d{4,8}$/;
                if(!phone || !handsReg.test(phone)){
                    Message.init({
                        text: '手机号不能为空,或格式不对',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                if(!email || !emailReg.test(email)){
                    Message.init({
                        text: '邮箱不能为空，或格式不对',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                //var notifyType = notifyCount;
                //$.extend(param,{"id":id});
                $.extend(param,{"name":name});
                $.extend(param,{"phone":phone});
                $.extend(param,{"email":email});
                $.extend(param,{"remark":remark});
                $.post(__ROOT__+"/MSSP/Saler/insert",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                });
                $(".form-control").val("");
            });
        }
    };
})();