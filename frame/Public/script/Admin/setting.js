/**
 * Created by jianghaifeng on 2016/2/23.
 */
(function(){
    $(document).ready(function(){
       $(".btn-submit").bind("click",function(){
            var param=storm.form.simpleSerialize($("#settingForm"));
            if(param.password){//需要修改密码
                if(param.tmp_password==''){
                    swal({ title:"您修改了密码,初始密码不能为空", type:"error",confirmButtonText:"确定"});

                    return;
                }
                if(param.password!=param.repassword){
                    swal({ title:"两次次密码不一致", type:"error",confirmButtonText:"确定"});

                    return;
                }
                param['password']= $.md5(param['password']);
                param['tmp_password']= $.md5(param['tmp_password']);
                param['repassword']= $.md5(param['repassword']);

            }

           $.post(__ROOT__+"/Admin/Setting/update",param).success(function(json){
               if(json.code>0){

                   //swal({   title:"修改成功,重新登陆后配置生效！", type: "error",   confirmButtonText: "确定" });
                    storm.confirm("修改成功,重新登陆后配置生效！重新登陆?",function(){
                        parent.window.location.href=__ROOT__+"/Admin/Login/logout";
                    });
               }else{
                   swal({ title:json.msg, type:"error",confirmButtonText:"确定"});

               }

           });


       });
    });

})();
