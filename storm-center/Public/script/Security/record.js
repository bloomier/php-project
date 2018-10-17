
function test(){
    //alert('ok');
    //var seObj = $("#event_type_id");
    //var obj = $("#event_type_id").get(0).options;
    //$("#event_type_id").select("setText","");
    ////seObj.val("");
    //seObj.val = "";
    //seObj.value = "";
    //document.getElementById("event_type_id")[2].selected=true;
    // seObj.setValue("");
    //var opt = "";
    //// $("#event_type_id").val('');
    //for(var i = 0, num = obj.length; i < num; i++){
    //    if(obj[i] != null && obj[i].value != null && obj[i].value != ''){
    //        opt += "<option value='" + obj[i].value + "'>" + obj[i].text + "</option>";
    //    }
    //}
    //seObj.html(opt);
    //$("#event_type_id").val("1");
    location.reload();

    // alert('ok');
}


(function(){


    $(function(){
        _init_.view();
        //$(".bth-batch-delete").bind("click",function(){
        //    __functions__.delete();
        //});

        _image_.bind();

        _init_Wdate_.setDefaultValue();

    });


    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
        }
    };

    var _image_ = {
        bind : function(){
            $("#span_id").live("click",function(){
                //alert('ok');
                //火狐获取不到file的onchange事件因此添加此事件，span的click和file的onchange不会同时发生
               // $("#file").click();
                $("#file").trigger("click");
            });
            $("#file").live("change",function(){
                // alert($(this).val());
                if($(this).val()==''){
                    return;
                }

                document.getElementById('tishi_id').innerHTML = "正在上传图片......";
                $("#event_snapshot_id").val('');
                $.ajaxFileUpload({
                    url: __ROOT__ + "/Home/Image/uploadImgToServer",
                    type: "post",
                    secureuri: false,
                    fileElementId: "file",
                    data:{type: 'security'},
                    dataType: 'json', //返回值类型 一般设置为json
                    success:function(json){
                        console.info(json);
                        if(json.code > 0){
                            var src = json.path;
                            $("#event_snapshot_id").val(json.relation_path);
                            $("#imgView").attr("src",src).show();
                            //实现图片点击显示功能
                            $(".one-event-pic").attr("href", src);
                            $(".fancybox-button").fancybox({
                                groupAttr: 'data-rel',
                                prevEffect: 'none',
                                nextEffect: 'none',
                                closeBtn: true,
                                helpers: {
                                    title: {
                                        type: 'inside'
                                    }
                                }
                            });

                            document.getElementById('tishi_id').innerHTML = "上传图片已完成";

                        }else{
                            storm.alert('上传失败');
                            $("#imgView").attr("src","").show();
                            document.getElementById('tishi_id').innerHTML = "上传失败，请重新上传";
                        }
                    }
                });
            });
        }
    };



    save_click = function(){
        if(__functions__.validate()){
            return ;
        }
        __functions__.submit();
    }

    var __functions__={
        // 提交表单
        submit:function(){
            var form=$("#form_id");
            $(form).ajaxSubmit({
                "type":"POST",
                "dataType":"json",
                "success":function(json){
                    if(json.code>0){
                        // storm.showMsg(json.msg);
                        storm.alert(json.msg);
                        //alert(json.msg);
                        form.resetForm();
                        $("#event_snapshot_id").val('');
                        $("#imgView").hide();
                        $("#tishi_id").html("请上传事件截图");
                        $("#event_type_id").select2("val","1");
                        //页面重新加载一遍，因为事件类型中的文本一直去不掉
                        //$("#event_type_id").val("");
                        //location.reload();
                    }else{
                        storm.alert(json.msg);
                    }
                }
            });
        },
        // 验证数据是否填写完整，不完整返回true
        validate:function(){
            var web_url = $("#web_url_id").val();
            if(web_url == ''){
                storm.alert('请填写黑页地址');
                return true;
            }
            if(web_url.indexOf("://") == -1){
                storm.alert('请将黑页地址填写正确');
                return true;
            }
            var web_title = $("#web_title_id").val();
            if(web_title == ''){
                storm.alert('请填写网站标题');
                return true;
            }
            var happen_time = $("#happen_time_id").val();
            if(happen_time == ''){
                storm.alert('请填写提交时间');
                return true;
            }
            var event_type = $("#event_type_id").val();
            if(event_type == ''){
                storm.alert('请选择事件类型');
                return true;
            }
            var event_desc = $("#event_desc_id").val();
            if(event_desc == ''){
                storm.alert('请填写事件描述');
                return true;
            }
            var event_snapshot = $("#event_snapshot_id").val();
            if(event_snapshot == ''){
                //alert('请上传黑页照片');
                // return true;
                $("#event_snapshot_id").val("/");
            }
            // 事件来源设置为：界面录入
            $("#event_source_id").val("界面录入");
            return false;
        }

    };

    var _init_Wdate_ = {
        setDefaultValue : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var hour = myDate.getHours();
            var minites = myDate.getMinutes();
            var second = myDate.getSeconds();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            if(hour < 10){
                hour = '0' + hour;
            }
            if(minites < 10){
                minites = '0' + minites;
            }
            if(second < 10){
                second = '0' + second;
            }
            var happen_time = '' + fullYear + '-' + month + '-' + day + ' ' + hour + ':' + minites + ':' + second;
            $("#happen_time_id").val(happen_time);
        }
    };

})();