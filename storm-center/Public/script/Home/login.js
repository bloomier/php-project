/**
 * Created with JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-7-13
 * Time: 10:17
 * To change this template use File | Settings | File Templates.
 */
function myCheck(){
    var phoneNum = $("#phoneNum_id").val();
    if(phoneNum == ""){
        $(".success").hide();
        $(".error").show();
        $(".error").html("请输入手机号码！");
        return false;
    }
    if(phoneNum && /^1[3|4|5|8]\d{9}$/.test(phoneNum)){
    } else{
        $(".success").hide();
        $(".error").show();
        $(".error").html("请输入有效手机号码！");
        return false;
    }
    var password = $("#password").val();
    if(password == ''){
        $(".success").hide();
        $(".error").show();
        $(".error").html("请输入密码！");
        return false;
    }
    var valicode = $("#reVerity_id").val();
    if(valicode == ''){
        $(".success").hide();
        $(".error").show();
        $(".error").html("请输入密信动态密码！");
        return false;
    }
    return true;
}

(function(){

    $(document).ready(function(){
        var loginType=$("#loginType").val();
        if(loginType != 88){
            var tab=$("[loginType='"+loginType+"']");
            $("a",tab).click();
            addHandler();
        } else {
            addHandlerMssp();
            var errorMsg = $("#errorMsg_id").html();
            if(errorMsg && errorMsg != ''){
                $(".error").show();
                $(".error").html(errorMsg);
            }
        }

        $("#phoneNum_id").focus();
    });



    var addHandler=function(){
        $("#passwordTmp").bind("change",function(){
            var value=$(this).val();
            $("#password").val($.md5(value));
        });
        $("#securityCode_id").bind("click",function(){

            var phoneNum = $("#phoneNum_id").val();
            if(phoneNum == ""){
                $(".show-msg-label").show();
                $(".show-msg").html("请输入手机号码！");
                return ;
            }
            if(phoneNum && /^1[3|4|5|8]\d{9}$/.test(phoneNum)){
            } else{
                $(".show-msg-label").show();
                $(".show-msg").html("请输入有效手机号码！");
                return ;
            }
            $.post($("#rootPath").val()+'/Home/Login/verify/phoneNum/' + phoneNum).success(function(json){
                if(json.code == 1){
                    $(".show-msg-label").show();
                    $("#securityCode_id").attr('disabled',"true");
                    var last = 179;
                    var time = setInterval(function(){
                        $(".usable-time").html(last--);
                        if(last == 0){
                            $(".show-msg-label").hide();
                            $(".usable-time").html(180);
                            $("#securityCode_id").removeAttr("disabled");
                            clearInterval(time);
                        }
                    }, 1000);
                } else {
                    $(".show-msg-label").show();
                    $(".show-msg").html("信息发送失败！");
                }
            });

        });
    }

    var addHandlerMssp=function(){
        $("#passwordTmp").bind("change",function(){
            var value=$(this).val();
            $("#password").val($.md5(value));
        });
        $("#securityCode_id").bind("click",function(){

            var phoneNum = $("#phoneNum_id").val();
            if(phoneNum == ""){
                $(".success").hide();
                $(".error").show();
                $(".error").html("请输入手机号码！");
                return ;
            }
            if(phoneNum && /^1[3|4|5|8]\d{9}$/.test(phoneNum)){
            } else{
                $(".success").hide();
                $(".error").show();
                $(".error").html("请输入有效手机号码！");
                return ;
            }
            $.post($("#rootPath").val()+'/Home/Login/verify/phoneNum/' + phoneNum).success(function(json){
                if(json.code == 1){
                    $(".error").hide();
                    $(".success").show();
                    $("#securityCode_id").attr('disabled',"true");
                    var last = 179;
                    var time = setInterval(function(){
                        $(".usable-time").html(last--);
                        if(last == 0){
                            $(".success").hide();
                            $(".usable-time").html(180);
                            $("#securityCode_id").removeAttr("disabled");
                            clearInterval(time);
                        }
                    }, 1000);
                } else if(json.code == 0){
                    $(".success").hide();
                    $(".error").show();
                    $(".error").html(json.msg);
                    return ;
                } else {
                    $(".error").show();
                    $(".error").html("信息发送失败！");
                }
            });
        });
    }


})();