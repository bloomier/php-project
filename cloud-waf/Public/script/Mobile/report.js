/**
 *@name
 *@author Sean.xiang
 *@date 2016/6/15
 *@version
 *@example
 */

(function(){
    var inited={
        monitor:false,
        vuls:false,
        cloudwaf:false
    }
    var cloudFlag = true;
    var vulsFlag = true;
    var app={

        init:function(){
            var w=this;

            w.domain=$("#currentDomain").val();
            w.handler();

        },
        showDatas: function(){
            var w = this;
            monitor.init(w.domain, w.currentDateKey);
        },
        handler:function(){
            var w =this;


            $("a",$(".list-header")).bind("click",function(){
                var type=$(this).attr("_type");
                $("a",$(".list-header")).removeClass("active");
                $(this).addClass("active");
                $(".product").hide();
                $("#"+type).show();
                if(type == "cloudwaf_id" && cloudFlag){
                    cloudwaf.init(w.domain, w.currentDateKey);
                    cloudFlag = false;
                }

            });


            $(".sort-nav li",$("#cloudwaf_id")).bind("click",function(){
                var id=$(this).attr("_id");
                $(".sort-nav li",$("#cloudwaf_id")).removeClass("active");
                $(this).addClass("active");
                $(".view").hide();
                $("."+id).show();
            });
            $(".sort-nav li:eq(0)",$("#cloudwaf_id")).click();



        }

    }
    $(document).ready(function(){
        app.init();
        app.showDatas();

    });


})();