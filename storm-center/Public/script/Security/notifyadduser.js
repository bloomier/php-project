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

                var userName= $.trim($("[name='userName']").val());
                var userSex= $.trim($("[name='userSex']:checked").val());
                var userPosition= $.trim($("[name='userPosition']").val());
                var userFirm= $.trim($("[name='userFirm']").val());
                var userTel= $.trim($("[name='userTel']").val());
                var userHands= $.trim($("[name='userHands']").val());
                var userEmail= $.trim($("[name='userEmail']").val());
                var userMixin= $.trim($("[name='userMixin']").val());
                var userWeixin= $.trim($("[name='userWeixin']").val());
                var userQQ= $.trim($("[name='userQQ']").val());
                var remark= $.trim($("[name='remark']").val());
                var count = 0;
                $("input[name='userType']:checked").each(function () {
                    count += parseInt($(this).val());
                })
                var userType= count;
                var notifyCount = 0;
                $("input[name='notifyType']:checked").each(function () {
                    notifyCount += parseInt($(this).val());
                })
                if(2 & notifyCount && !userMixin){
                    Message.init({
                        text: '密信不能为空',
                        type: 'success' //info success warning danger
                    })
                    return;
                }
                if(!userName){
                    Message.init({
                        text: '用户名不能为空',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                if(!userSex){
                    Message.init({
                        text: '性别不能为空',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                if(!userPosition){
                    Message.init({
                        text: '职务不能为空',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                if(!userFirm){
                    Message.init({
                        text: '单位不能为空',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var handsReg = /^1[3-9][0-9]\d{4,8}$/;
                if(!userHands || !handsReg.test(userHands)){
                    Message.init({
                        text: '手机号不能为空,或格式不对',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
                if(!userEmail || !emailReg.test(userEmail)){
                    Message.init({
                        text: '邮箱不能为空，或格式不对',
                        type: 'success' //info success warning danger
                    });
                    return;
                }
                var notifyType = notifyCount;
                $.extend(param,{"userName":userName});
                $.extend(param,{"userSex":userSex});
                $.extend(param,{"userPosition":userPosition});
                $.extend(param,{"userType":userType});
                $.extend(param,{"userFirm":userFirm});
                $.extend(param,{"userTel":userTel});
                $.extend(param,{"userHands":userHands});
                $.extend(param,{"userEmail":userEmail});
                $.extend(param,{"userMixin":userMixin});
                $.extend(param,{"userWeixin":userWeixin});
                $.extend(param,{"notifyType":notifyType});
                $.extend(param,{"userQQ":userQQ});
                $.extend(param,{"remark":remark});
                $.post(__ROOT__+"/Security/NotifyUser/add",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                });
            });
        }
    };
})();