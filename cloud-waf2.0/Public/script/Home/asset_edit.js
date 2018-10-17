/**
 * Created by jianghaifeng on 2016/3/17.
 */
(function(){
    var app={
        init:function(){
            app.initView();
            app.initHandler();
        },
        initView:function(){
            var w=this;
            w.fingerLabels=$("#fingerWraper").labels({
                title:"指纹",
                nameMapper:{
                    os:"操作系统",
                    thirdparty:"第三方组件",
                    waf:"waf",
                    framework:"框架",
                    webapp:"cms",
                    frontend:"前端框架",
                    server:"web容器",
                    component:"其他组件"

                },
                warning:"重要提示:指纹和版本之间请以【空格】隔开"

            });
            w.labelLables=$("#labelsWraper").labels({
                title:"标签",
                simpleData:true//支持data 以数据形式传值  example:["我的标签1","我的标签的"]  getData的返回值 和data的结构一致
            });
            var isUpdate=$("#isUpdate").val();
            if(isUpdate=='1'){//如果是修改
                var asset= $.parseJSON($("#assetJson").text());
                asset.finger=asset.finger||{};
                w.fingerLabels.loadData(
                    {
                        os:asset.finger.os,
                        thirdparty:asset.finger.thirdparty,
                        waf:asset.finger.waf,
                        framework:__function__.simpleValues(asset.finger.framework),
                        webapp:__function__.simpleValues(asset.finger.webapp),
                        frontend:asset.finger.frontend||"",
                        server:__function__.simpleValues(asset.finger.server),
                        component:__function__.simpleValues(asset.finger.component)
                    }
                );
                var labels=[];
                if(asset.labels){
                    labels=asset.labels.split(",");
                }
                w.labelLables.loadData(labels);

                $("#location").citySelect({
                    required:false,
                    nodata:"hidden",
                    prov:asset.location?asset.location.province:null,
                    city:asset.location?asset.location.city:null,
                    dist:asset.location?asset.location.district:null,
                    url:__ROOT__+"/Admin/Location/getLocationSelectorData"
                });
                $("#admin_location").citySelect({
                    required:false,
                    nodata:"hidden",
                    prov:asset.admin_location?asset.admin_location.province:null,
                    city:asset.admin_location?asset.admin_location.city:null,
                    dist:asset.admin_location?asset.admin_location.district:null,
                    url:__ROOT__+"/Admin/Location/getLocationSelectorData"
                });
                $("[name='_id']",$(".ibox-content")).attr("disabled",'disabled');

            }else{
                $("#location").citySelect({
                    required:false,
                    //nodata:"hidden",
                    url:__ROOT__+"/Admin/Location/getLocationSelectorData"
                });
                $("#admin_location").citySelect({
                    required:false,
                    nodata:"hidden",
                    url:__ROOT__+"/Admin/Location/getLocationSelectorData"
                });
            }
        },
        initHandler:function(){
            var w=this;
            $(".btn-asset-save").bind("click",function(){
                var forms=$("form",$("body"));
                var params={};
                $.each(forms,function(i,form){
                    $.extend(params,storm.form.simpleSerialize(form,true));
                });
                var fingers=w.fingerLabels.getData();
                $.each(fingers,function(k,v){
                    params["finger["+k+"]"]= v.tolow;
                }) ;
                params['labels']= (w.labelLables.getData()).join(",");
                if(!params['_id']){
                    params['_id']=$("[name='_id']",$(".ibox-content")).val();
                }
                if(!params['_id']){
                    swal({   title: "域名不能为空", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var flag=true;
                var ips= $.trim(params['ip']).split(",");
                var exp=/^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$/;
                for(var i=0;i<ips.length;i++){
                    var ip=ips[i];
                    if(ip!=''&&!exp.test(ip)){
                        flag=false;
                    }
                }
                if(!flag){
                    swal({   title: "请正确填写IP地址", type: "error",   confirmButtonText: "确定" });
                    return;
                }

                var emailExp  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                var registerEmail = $.trim(params["whois[registrant_email]"]);
                if(registerEmail != '' && !emailExp.test(registerEmail)){
                    swal({   title: "请正确填写注册人邮箱地址", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var isUpdate=$("#isUpdate").val();
                params['update']=isUpdate;

                $.post(__ROOT__+"/Home/asset/addOrUpdate",params,function(json){
                    if(json.code>0){
                        swal({   title: json.msg, type: "success",   confirmButtonText: "确定" },function(){
                            location.href=__ROOT__+"/Home/Asset/index";
                        });
                    }else{
                        swal({   title: json.msg, type: "error",   confirmButtonText: "确定" });
                    }

                });

            });
        }

    };
    var __function__={
        simpleValues:function(json,split){
            if(!json){
                return '';
            }
            if(typeof json==='object'){
                var s="";
                $.each(json,function(k,v){
                    s+=(v+(split||" "));
                });
                return s;
            }else{
                return json;
            }

        }
    };
    $(document).ready(function(){
        app.init();
    });

})();