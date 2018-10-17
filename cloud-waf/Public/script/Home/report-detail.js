(function(){
        var inited={
            monitor:false,
            vuls:false,
            cloudwaf:false
        }
    var cloudFlag = true;
    var vulsFlag = true;
    var app={
        prepare:function(){
            $.post(__ROOT__+"/Home/WafSite/listAll").success(function(json){
                $.each(json,function(i,d){
                    var domain=d['_id'];
                    currentDomain=$("#currentDomain").val();
                    $("#domainSelector").append("<option value='"+domain+"'>"+domain+"</option>");
                    $("#domainSelector").val(currentDomain);
                });
            });
        },
        init:function(){
            var w=this;
           /* var json= $.parseJSON($("#data").text());
            w.cloudwafData=json.data;*/
            w.currentDateKey=$("#currentDateKey").val();
            console.info(w.currentDateKey)
            w.domain=$("#currentDomain").val();
            w.handler();

        },
        showDatas: function(){
            var w = this;
            monitor.init(w.domain, w.currentDateKey);
            //vuls.init("","");
        },
        handler:function(){
            var w =this;

            $("#btn-search").bind("click",function(){
                var domain=$("#domainSelector").val();
                var dateKey=$("#currentDateKey").val();
                if(domain==''||dateKey==''){
                    storm.alert("网站和日期不能为空!")
                    return;
                }
                var href=__ROOT__+"/Home/DailyReport/index/domain/"+domain+"/dateKey/"+dateKey;
                location.href=href;
            });
            $(".return-btn").bind("click", function(){
                var href = __ROOT__ + "/Home/WafSite/index";
                window.location.href = href;
                return false;
            });

            $("li",$("#reportTab")).bind("click",function(){
                var type=$(this).attr("_type");
                $("li",$("#reportTab")).removeClass("active");
                $(this).addClass("active");
                $(".product").hide();
                $("#"+type).show();
                if(type == "cloudwaf_id" && cloudFlag){
                    cloudwaf.init(w.domain, w.currentDateKey);
                    cloudFlag = false;
                }
                if(type == "vuls_id" && vulsFlag){
                    vuls.init(w.domain, w.currentDateKey);
                    vulsFlag = false;
                }
            });

            //导出报告
            $(".export_report").bind("click", function(){
                location.href= __ROOT__+"/Home/DailyReport/exportReport?domain=" + w.domain + "&dateKey=" + w.currentDateKey;
            });

        }

    }
$(document).ready(function(){
    app.init();
    app.prepare();
    app.showDatas();


});


})();