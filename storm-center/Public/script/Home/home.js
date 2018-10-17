/**
 * Created with JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-7-13
 * Time: 12:50
 * To change this template use File | Settings | File Templates.
 */
(function(){
    $(document).ready(function(){
        var mTypes=$("#mTypes").val();
        $.each(mTypes.split(","),function(i,type){
           var mod= $("[mType='"+type+"']");
          var color=mod.attr("color-store");
           mod.removeClass('disabled').addClass("active");

        });


        $(".model-enter").bind("click",function(){
           if($(this).hasClass("active")){
               var mType=$(this).attr("mType");

               $.post(__ROOT__+"/Home/Login/jump",{mType:mType}).success(function(json){
                    if(json.code>0){
                        var href=json.msg;
                       // console.info(__ROOT__);
                        location.href=__ROOT__+"/"+href;
                    }
               });
           }else{
                storm.alert("对不起,您没有权限访问此模块");
           }
        });
    });

})();