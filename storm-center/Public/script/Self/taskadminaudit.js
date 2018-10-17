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
                $.each(domainList, function(point, item){
                    var line = $("<div class='row'><div class='col-sm-6'>" + item['website_domain'] + "</div></div>")
                    $(".domainList").append(line);

                });

                var reason = info["apply_reason"];
                var applyTime = info["apply_time"];
                var applyName = info["apply_name"];
                var auditTime = info["audit_time"];
                var auditState = info["audit_state"];

                $(".applyReason").val(reason);
                $(".applyName").html(applyName);
                $(".applyTime").html(applyTime);


                //$(".applyName").val(applyName);

            });
        },
        bindFunction : function(){
            $(".apply_form_audti").bind("click", function(){
                var formId = $("#formId").val();
                var auditState = $("input[name='auditState']:checked").val();
                console.info($.trim($(".auditOption").val()));
                var auditOpition = $.trim($(".auditOption").val());
                $.post($("#rootPath").val()+ "/Self/TaskAdmin/updateApplyForm",{"formId":formId, "auditState":auditState, "auditOpition":auditOpition}).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                    if(json.code){
                        $(".apply_form_audti").addClass("disabled");
                    }
                });
            });
        }
    };

})();