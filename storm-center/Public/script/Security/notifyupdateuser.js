/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){


    $(document).ready(function(){


        __init__.bind_function();

        __init__.initView();

    });

    var __init__={

        initView : function(){
            //console.info(userType);
            var userType = $("#userDefaultType").val();
            //console.info(userType);
            userType = parseInt(userType);
            if(16 & userType){
                $("input[name='userType'][value='16']").attr("checked", "checked");
            }
            if(8 & userType){
                $("input[name='userType'][value='8']").attr("checked", "checked");
            }
            if(4 & userType){
                $("input[name='userType'][value='4']").attr("checked", "checked");
            }
            if(2 & userType){
                $("input[name='userType'][value='2']").attr("checked", "checked");
            }
            if(1 & userType){
                $("input[name='userType'][value='1']").attr("checked", "checked");
            }

            var notifyType = $("#userDefaultNotifyType").val();
            notifyType = parseInt(notifyType);
            if(4 & notifyType){
                $("input[name='notifyType'][value='4']").attr("checked", "checked");
            }
            if(2 & notifyType){
                $("input[name='notifyType'][value='2']").attr("checked", "checked");
            }
            if(1 & notifyType){
                $("input[name='notifyType'][value='1']").attr("checked", "checked");
            }


        },

        bind_function : function(){
            $(".notify-user-save").bind("click", function(){
                var param = {};
                var userId = $("#defaultUserId").val();
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
                        type: 'success'
                    });
                    return;
                }
                var notifyType = notifyCount;
                $.extend(param,{"userId":userId});
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
                $.post(__ROOT__+"/Security/NotifyUser/update",param).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                });
            });
        }
    };
})();