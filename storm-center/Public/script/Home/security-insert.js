/**
 *@name
 *@author song
 *@date 2015/5/22
 *@desc
 */
$(function() {

    $(document).ready(function () {
        $("#citys").citySelect({prov:"北京", city:"北京"});

        $('.form_datetime').datetimepicker({
            language:  'zh-CN',
            weekStart: 1,
            todayBtn:  1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1
        });

        $("#btn").bind("click", function(){
            $.ajaxFileUpload({
                url:'SecurityEvent/insertTo',
                fileElementId:'file',
                fileSize: 500,
                dataType:'text',
                data:{
                    "title" : $("#title").val(),
                    "domain" : $("#domain").val(),
                    "description" : $("#description").val(),
                    "createTime" : $("#createTime").val(),
                    "imgType" : $("#imgType").val(),
                    "province" : $("#province").val(),
                    "city" : $("#city").val()
                },
                success:function(info){
                    $(".sendResult").text("");
                    $(".sendResult").text(info);
                    $("#resultModal").modal("show");
                }
            });

        });

        $("#pocModelClose").bind("click",function(){
            $("#resultModal").modal("hide");
        });
    });


});

