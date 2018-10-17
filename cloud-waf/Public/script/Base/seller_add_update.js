/**
 *@name
 *@author ancyshi
 *@date 2016/6/13
 *@version
 *@example
 */


(function(){

    var currentObject = $("#currentObject_id").val();
    var needBack = $("#needBack_id").val();
    var o={
        init:function(){
            o.handler();
            o.view();
        },
        view:function(){

            currentObject = functions.convert(currentObject);
            if(currentObject){
                var level = currentObject['level'];
                $("#name_id").val(currentObject['name']);
                $("#phone_num_id").val(currentObject['phone_num']);
                $("#email_id").val(currentObject['email']);
                $("#desc_id").val(currentObject['desc']);
                var state = currentObject['state'];
                if(state == 1){
                    $(".is_state").addClass('on');
                    $(".is_state").children('span.text').text('有效');
                } else {
                    $(".is_state").removeClass('on');
                    $(".is_state").children('span.text').text('无效');
                }

            }
        },
        handler:function(){
            var w=this;

            $(".btn-save").bind("click", function(){
                functions.addUpdate();
            });

            $('.btn-back').bind("click", function(){
                var href = __ROOT__ + "/Base/Seller/index";
                if(needBack){
                    href = __ROOT__ + "/Base/Contract/index";
                }
                window.location.href = href;
            });


        }
    };


    var setting = {
        emailRegex : /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,// email 正则
        telephoneRegex : /^1\d{10}$/  // 手机号正则
    }

    var functions = {
        //转换数据
        convert:function(value){
            value = decodeURIComponent(value);
            value = $.parseJSON(value);
            return value;
        },
        addUpdate: function(){

            var name = $.trim($("#name_id").val());
            if(name == ''){
                storm.alertMsg('请填写客户名称',"danger");
                return ;
            }

            var phone_num = $.trim($("#phone_num_id").val());
            if(phone_num == ''){
                storm.alertMsg('请填写客户电话',"danger");
                return ;
            }

            if(!setting.telephoneRegex.test(phone_num)){
                storm.alertMsg('请填写合法电话号码',"danger");
                return ;
            }

            var email = $.trim($("#email_id").val());
            if(email != '' && !setting.emailRegex.test(email)){
                storm.alertMsg('请填写合法的邮箱地址',"danger");
                return ;
            }
            var state = $(".is_state").children('span.text').text();
            if(state == '有效'){
                state = 1;
            } else {
                state = 0;
            }


            var desc = $("#desc_id").val();
            var param = {
                name: name,
                phone_num: phone_num,
                email: email,
                state: state,
                desc: desc
            };
            if(currentObject){
                $.extend(param, {_id: currentObject._id});
            }
            $.post(__ROOT__ + "/Base/Seller/addOrUpdate",param).success(function(json){

                if(json.code && json.code == 1){
                    var href = __ROOT__ + "/Base/Seller/index";
                    if(needBack){
                        href = __ROOT__ + "/Base/Contract/index";
                    }
                    window.location.href = href;
                } else {
                    Message.init({
                        text: json.msg,
                        type: 'danger'
                    });
                }
            });
        }
    }


    $(document).ready(function(){
        o.init();

    });

})();
