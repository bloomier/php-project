/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */

(function(){

    $(document).ready(function(){

        __init__.initView();

        __init__.bindFunction();

    });

    var __init__={
        initView : function(){
            $.post($("#rootPath").val()+ "/Self/TaskAdmin/queryApplyForm",{"form_id":$("#formId").val(),"currentpage":1,"limit":1}).success(function(json){
                var info = json['rows'][0];
                var domainList = info['siteList'];
                var domains = [];
                var auditState = info["audit_state"];
                $.each(domainList, function(point, item){
                    if(auditState == 0 || auditState == -1 || auditState == -2){
                        var line = $("<div class='row'><div class='col-sm-6'>" + item['website_domain'] + "</div>")
                        $(".domainList").append(line);
                    }else if(auditState == 1){
                        var line = $("<div class='row'><div class='col-sm-6'>" + item['website_domain'] + "</div><div class='col-sm-2'><label class='showReport' domain='" + item['website_domain'] + "'>查看报告</label></div></div>")
                        $(".domainList").append(line);
                    }

                });

                var reason = info["apply_reason"];
                var applyTime = info["apply_time"];
                var applyName = info["apply_name"];
                var auditTime = info["audit_time"];

                var auditOption = info["audit_opition"];
                if(auditState == 0){
                    auditState = "未审核";
                }else if(auditState == 1){
                    auditState = "已审核";
                }else if(auditState == -1){
                    auditState = "审核未通过";
                }else if(auditState == -2){
                    auditState = "已撤销";
                }
                $(".applyReason").val(reason);
                $(".applyName").html(applyName);
                $(".applyTime").html(applyTime);
                $(".auditState").html(auditState);
                $(".auditTime").html(auditTime);
                $(".auditOption").text(auditOption);
                //$(".applyName").val(applyName);

            });

            $.post($("#rootPath").val()+ "/Self/TaskAdmin/queryDownloadInfo",{"form_id":$("#formId").val()}).success(function(json){
                var info = json['rows'];
                $.each(info, function(point, item){
                    var line = $("<div class='row'><div class='col-sm-6'>" + item['download_time'] + "</div><div class='col-sm-2'><label>下载成功</label></div></div>")
                    $(".downloadList").append(line);
                });
            });
        },
        bindFunction : function(){
            $(".showReport").live("click", function(){
                var domain = $(this).attr("domain");
                var path = __ROOT__ + "/Self/Report/show?url=" + domain;
                location.href = path;
            });
        }
    };

})();