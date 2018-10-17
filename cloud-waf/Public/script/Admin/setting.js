/**
 * Created by jianghaifeng on 2016/2/23.
 */
(function(){
    $(document).ready(function(){
       $(".btn-submit").bind("click",function(){

           var param=storm.form.simpleSerialize($("#settingForm"));
           if(!param.name || param.name == ''){
               storm.showMsg("姓名不能为空");
               return;
           }
           if(param.password){//需要修改密码
                if(!param.tmp_password || param.tmp_password==''){
                    storm.showMsg("您修改了密码,旧密码不能为空");
                    return;
                }
                if(!param.repassword || param.repassword==''){
                    storm.showMsg("请输入确认密码");
                    return;
                }
                if(param.password != param.repassword){
                    storm.showMsg("新密码和确认密码不一致");
                    return;
                }
                param['password']= $.md5(param['password']);
                param['tmp_password']= $.md5(param['tmp_password']);
                param['repassword']= $.md5(param['repassword']);

            }

           $.post(__ROOT__+"/Admin/Setting/update",param).success(function(json){
               if(json.code>0){
                    storm.confirm("修改成功,重新登陆后配置生效！重新登陆?",function(){
                        location.href=__ROOT__+"/Admin/Login/logout";
                    });
               }else{
                   storm.showMsg(json.msg);
               }

           });


       });
    });

})();
