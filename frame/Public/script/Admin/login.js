/**
 * Created by jianghaifeng on 2016/2/22.
 */
(function(){

    var  timer ;
    $(document).ready(function(){
        //var parentDocument=parent.document;
        //var pathInfo=window.location.href;
        //var parentPathInfo= parent.window.location.href;
        //if(pathInfo!=parentPathInfo){
        //    parent.window.location=pathInfo;
        //}




        var __ROOT__=$("#rootPath").val();
        var __functions__={
            showError:function(err){
                //当定时器开启时会把当前错误信息覆盖掉
                if(timer){
                    clearInterval(timer);
                }
                var wraper=$("#errorMsg_id");
                wraper.css('color','red');
                wraper.html(err);
            },
            showMsg:function(msg){
                var wraper=$("#errorMsg_id");
                wraper.css('color','green');
                wraper.html(msg);
            }

        }
        $("#verify_code").bind("click",function(){
            var src=$(this).attr("src");
            src=src+"/randmon/"+Math.random();
            $(this).attr("src",src);
        });

        $(".btn-verify").bind("click",function(){
            var username= $.trim($("#username").val());
            if(username==''){
                __functions__.showError("请先填写用户名（手机号码）");
                return;
            }
            if(username && /^1[3|4|5|7|8]\d{9}$/.test(username)){
            } else{
                __functions__.showError("请输入有效手机号码！");
                return;
            }
            var param={"username":username}
            $.post(__ROOT__+"/Admin/Login/verify",param).success(function(json){
                if(json.code==0){
                    __functions__.showError(json.msg);
                }else if(json.code==1){//验证码发送成功
                    var last = 179;
                    timer = setInterval(function(){
                        var msgStr = '验证码已发送,剩余有效时间'+ last + '秒';
                        __functions__.showMsg(msgStr);
                        if(last == 0){
                            clearInterval(timer);
                        }
                        last--;
                    }, 1000);
                }
            });
        });


        $(".btn-login").bind("click",function(){
            var username= $.trim($("#username").val());
            var pwd= $.trim($("#_password").val());
            var verify_code=$.trim($("#verify_code_text").val());

            if(verify_code==""){
                __functions__.showError("验证码不能为空");
                return;
            }

            if(username==''||pwd==''){
                __functions__.showError("用户名和密码不能为空");
                return;
            }

            pwd= $.md5(pwd);
            var param={"username":username,"password":pwd,"verify_code":verify_code};

            $.post(__ROOT__+"/Admin/Login/login",param).success(function(json){
                //$("#verify_code").trigger("click");
                if(json.code==0){
                    __functions__.showError(json.msg);
                }else if(json.code==1){//登录成功
                    //var first=__ROOT__+"/"+json.firstAction;
                    //location.href=first;
                    var firstAction=__WEBROOT__+"/"+json.firstAction;
                    console.info(firstAction)
                    if(firstAction){
                        $.cookie("currentPage",firstAction,{path: __WEBROOT__ + "/Home/Index/index"});
                        $.cookie("currentPage",firstAction,{path: __WEBROOT__ + "/Home/Index"});
                    }
                    var href=__WEBROOT__+"/Home/Index/index";
                    location.href=href;
                    //location.href = firstAction;
                }
            });
        });
    });
})();
