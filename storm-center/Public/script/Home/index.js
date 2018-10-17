/**
 *@name
 *@author song
 *@date 2015/4/21
 *@desc
 */
$(function() {


    $(document).ready(function () {
        document.getElementsByTagName('form')[0].onkeydown = function(e){
            var e = e || event;
            var keyNum = e.which || e.keyCode;
            return keyNum==13 ? false : true;
        };

        _init_bind.bind();

      //  _init_.init_view();
        _init_bind.bind_enter();
        _init_bind.bind_overflow();
      //  $('.title-cloud').tagcloud({centrex:250, centrey:160, init_motion_x:20, init_motion_y:10, zoom:150, fps: 10});

    });



    // 绑定事件
    var _init_bind = {
        // 绑定发送请求事件
        bind : function(){//queryButton
            $(".queryButton").bind("click", function(){
                if($(".btn-login").length==1){
                    $(".errorInfo").text("请先登录");
                    $(".btn-login").trigger("click");
                    return;
                }
                if($("#query-param").val() == ""){
                    //alert("请输入查询条件！");
                }else{
                    $("#query-form").submit();
                }
            });
        },

        bind_enter : function(){
            $("#query-param").keydown(function(event) {
                if (event.keyCode == 13) {
                    $(".queryButton").click();
                }
            });
        },

        bind_img : function(){
            var imgPath = __PUBLIC__ + "/image/bg-china.png";
            $(".title-cloud").css("background-image", imgPath);
        },

        bind_overflow : function(){

            $(".flow-title-top").bind("hover", function(){
                $.each($(".flow-title-top"), function(point, item){

                });

            });
        }
    }

});