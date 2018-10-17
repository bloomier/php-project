/**
 * Created by jianghaifeng on 2016/2/17.
 */
var __ROOT__=$("#rootPath").val();
var __WEBROOT__=__ROOT__;
var __PUBLIC__=$("#publicPath").val();
var __ECHART__=$("#echartPath").val();
var context={};

var __GEO__={
    china_province:{
        '上海': [121.4648,31.2891],
        '广东': [113.8953,22.901],
        '山东': [118.7073,37.5513],
        '山西': [111.4783,36.1615],
        '辽宁': [124.541,40.4242],
        '新疆': [87.9236,43.5883],
        '河北': [115.0488,39.0948],
        '甘肃': [103.5901,36.3043],
        '内蒙': [110.3467,41.4899],
        '内蒙古': [110.3467,41.4899],
        '北京': [116.4551,40.2539],
        '广西': [109.314,21.6211],
        '江苏': [118.8062,31.9208],
        '江西': [116.0046,28.6633],
        '福建': [118.1689,24.6478],
        '安徽': [117.29,32.0581],
        '陕西': [108.4131,34.8706],
        '黑龙江': [127.9688,45.368],
        '天津': [117.4219,39.4189],
        '西藏': [91.1865,30.1465],
        '云南': [102.9199,25.4663],
        '浙江': [119.5313,29.8773],
        '湖南': [113.5327,27.0319],
        '湖北': [114.3896,30.6628],
        '海南': [110.3893,19.8516],
        '青海': [101.4038,36.8207],
        '贵州': [106.6992,26.7682],
        '河南': [113.4668,34.6234],
        '重庆': [107.7539,30.1904],
        '宁夏': [106.3586,38.1775],
        '吉林': [125.8154,44.2584],
        '中国':[116.4551,40.2539],
        '局域网':[116.4551,40.2539],
        '未知':[116.4551,40.2539],
        '四川':[103.9526,30.7617],
        '台湾':[121.31,25.03]
    },
    provincial_capital : {
        '北京': [116.4551,40.2539],
        '上海': [121.4648,31.2891],
        '天津': [117.4219,39.4189],
        '重庆': [107.7539,30.1904],
        '郑州': [113.4668,34.6234],
        '哈尔滨': [127.9688,45.368],
        '长春': [125.8154,44.2584],
        '长沙': [113.0823,28.2568],
        '沈阳': [123.1238,42.1216],
        '合肥': [117.29,32.0581],
        '呼和浩特': [111.4124,40.4901],
        '石家庄': [114.4995,38.1006],
        '福州': [119.4543,25.9222],
        '乌鲁木齐': [87.9236,43.5883],
        '兰州': [103.5901,36.3043],
        '西宁': [101.4038,36.8207],
        '西安': [109.1162,34.2004],
        '贵阳': [106.6992,26.7682],
        '银川': [106.3586,38.1775],
        '济南': [117.1582,36.8701],
        '太原': [112.3352,37.9413],
        '武汉': [114.3896,30.6628],
        '南京': [118.8062,31.9208],
        '南宁': [108.479,23.1152],
        '南昌': [116.0046,28.6633],
        '成都': [103.9526,30.7617],
        '昆明': [102.9199,25.4663],
        '拉萨': [91.1865,30.1465],
        '杭州': [119.5313,29.8773],
        '广州': [113.5107,23.2196],
        '海口': [110.3893,19.8516]
    }
}
var __PROVINCES__=[
    '浙江','广东','山东','山西','辽宁','新疆','河北','甘肃','内蒙古','北京','广西','江苏','四川',
    '江西','福建','安徽','陕西','黑龙江','天津','西藏','云南','湖南','湖北','海南','青海','贵州','河南','重庆','宁夏','吉林','上海'
];

var storm = {
    before_dialog_submit:function(dialog){
        dialog.enableButtons(false);
        dialog.setClosable(false);
    },
    dialog_submit:function(dialog,table,json){
        dialog.enableButtons(true);
        dialog.setClosable(true);

        if(json.code>0){
            dialog.close();
            if(dialog['options']['data']['row']){//修改
                var row = dialog['options']['data']['row'];
                row.data(json.item).draw(false );
            }else{
                table.row.add( json.item).draw(false );
            }
        }
        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
    },

    confirm:function(msg,callback,closeOnConfirm){

        swal({
                title: msg,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "让我再考虑一下",
                confirmButtonText: "是的,我确定！",
                closeOnConfirm: closeOnConfirm?closeOnConfirm:false
            },
            function(){
                callback&&callback();
                //swal("操作成功！", "您已经永久删除了这条信息。", "success");
            });
    },
    alertMsg: function(msg, type){
        swal({ title: msg, type: type || 'info', confirmButtonText: "确定"});//
        //Message.init({
        //    text: msg,
        //    type: type ? type : "info"
        //});
    },

    form:{
        init:function(form, json){
            $.each(json,function(k,v){
                var o=$("[name='"+k+"']",form);
                if(o){
                    if(o.is(":input")&&o.attr("type")){
                        if(o.attr("type")=='password'||o.attr("type")=='checkbox'){
                            //do nothing
                        }else if(o.attr("type")=='radio'){
                            $.each(o,function(j,radio){
                                if($(radio).val()==v){
                                    $(radio).click();
                                }
                            });
                        }else{
                            o.val(v);
                        }
                    }else if(o.is("select")){
                        if(o.attr("multiple")){
                            $.each(v,function(i,one){
                                $("[value='"+one+"']",o).attr("selected","selected");
                            });
                        }else{
                            o.val(v);
                        }
                        //o.val(v);
                    }
                }
            });

        },
        reset:function(form){

            form[0].reset();
            $("[name='_id']",form).val("");
            $("select",form).val("");
        },
        serialize:function(form){
            var text=form.serialize();
            var tmps=text.split("&");
            var params={};
            tmps.forEach(function(p){
                var _t= p.split("=");
                if(_t.length==2&&_t[1]){
                    if(params[_t[0]]){
                        params[_t[0]]= params[_t[0]]+","+_t[1];
                    }else{
                        params[_t[0]]=_t[1];
                    }
                }
            });
            var serialize='';
            $.each(params,function(k,v){
                serialize=serialize+k+"="+v+"&";
            });
            return serialize.substr(0,serialize.length-1);
        },
        simpleSerialize:function(form,withEmptyData){
            var inputs=$("input,select,textarea",form);
            var param={};
            $.each(inputs,function(i,input){
                if(!$(input).attr("disabled")){
                    var name=$(input).attr("name");
                    var value= $.trim($(input).val());
                    if(withEmptyData){
                        param[name]=value?value:"";
                    }else{
                        if(value!=''){
                            param[name]=value;
                        }
                    }


                }
            });
            return param;
        }

    },
    common:{
        jsonSize:function(json){
            if(!json){
                return 0;
            }
            var count=0;
            for(var k in json){
                count++;
            }
            return count;
        },
        jsonKeys:function(json){
            if(!json){
                return [];
            }
            var arr=[];
            for(var k in json){
                arr.push(k);
            }
            return arr;

        },
        jsonarray_pick:function(arr,key){
            if(!arr){
                return [];
            }
            //console.info(arr);
            var newArr=[];
            arr.forEach(function(json){
                newArr.push(json[key]);
            });
            return newArr;

        }
    }
}

var nisp3 = {
    before_dialog_submit:function(dialog){
        dialog.enableButtons(false);
        dialog.setClosable(false);
    },
    dialog_submit:function(dialog,table,json){
        dialog.enableButtons(true);
        dialog.setClosable(true);

        if(json.code>0){
            dialog.close();
            if(dialog['options']['data']['row']){//修改
                var row = dialog['options']['data']['row'];
                row.data(json.item).draw(false );
            }else{
                table.row.add( json.item).draw(false );
            }
        }
        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
    },

    confirm:function(msg,callback,closeOnConfirm){

        swal({
                title: msg,
                text: "",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                cancelButtonText: "让我再考虑一下",
                confirmButtonText: "是的,我确定！",
                closeOnConfirm: closeOnConfirm?closeOnConfirm:false
            },
            function(){
                callback&&callback();
                //swal("操作成功！", "您已经永久删除了这条信息。", "success");
            });
    },
    alertMsg: function(msg, type){
        swal({ title: msg, type: type || 'info', confirmButtonText: "确定"});//
        //Message.init({
        //    text: msg,
        //    type: type ? type : "info"
        //});
    },

    form:{
        init:function(form, json){
            $.each(json,function(k,v){
                var o=$("[name='"+k+"']",form);
                if(o){
                    if(o.is(":input")&&o.attr("type")){
                        if(o.attr("type")=='password'||o.attr("type")=='checkbox'){
                            //do nothing
                        }else if(o.attr("type")=='radio'){
                            $.each(o,function(j,radio){
                                if($(radio).val()==v){
                                    $(radio).click();
                                }
                            });
                        }else{
                            o.val(v);
                        }
                    }else if(o.is("select")){
                        if(o.attr("multiple")){
                            $.each(v,function(i,one){
                                $("[value='"+one+"']",o).attr("selected","selected");
                            });
                        }else{
                            o.val(v);
                        }
                        //o.val(v);
                    }
                }
            });

        },
        reset:function(form){

            form[0].reset();
            $("[name='_id']",form).val("");
            $("select",form).val("");
        },
        serialize:function(form){
            var text=form.serialize();
            var tmps=text.split("&");
            var params={};
            tmps.forEach(function(p){
                var _t= p.split("=");
                if(_t.length==2&&_t[1]){
                    if(params[_t[0]]){
                        params[_t[0]]= params[_t[0]]+","+_t[1];
                    }else{
                        params[_t[0]]=_t[1];
                    }
                }
            });
            var serialize='';
            $.each(params,function(k,v){
                serialize=serialize+k+"="+v+"&";
            });
            return serialize.substr(0,serialize.length-1);
        },
        simpleSerialize:function(form,withEmptyData){
            var inputs=$("input,select,textarea",form);
            var param={};
            $.each(inputs,function(i,input){
                if(!$(input).attr("disabled")){
                    var name=$(input).attr("name");
                    var value= $.trim($(input).val());
                    if(withEmptyData){
                        param[name]=value?value:"";
                    }else{
                        if(value!=''){
                            param[name]=value;
                        }
                    }


                }
            });
            return param;
        }

    },
    common:{
        jsonSize:function(json){
            if(!json){
                return 0;
            }
            var count=0;
            for(var k in json){
                count++;
            }
            return count;
        },
        jsonKeys:function(json){
            if(!json){
                return [];
            }
            var arr=[];
            for(var k in json){
                arr.push(k);
            }
            return arr;

        },
        jsonarray_pick:function(arr,key){
            if(!arr){
                return [];
            }
            //console.info(arr);
            var newArr=[];
            arr.forEach(function(json){
                newArr.push(json[key]);
            });
            return newArr;

        }
    }
}


var main__init={
    region_switch:function(){
        var div=$("<div>当前域:<span id='current_region_name'></span><br><br><select id='region_switch_selector'><option value=''>===请选择域===</option></select></div>");
        var dialog;
        var listRegion=function(){
            dialog= new BootstrapDialog({
                title: '<h3>切换域</h3>',
                type:BootstrapDialog.TYPE_DEFAULT,
                autodestroy:false,
                size:BootstrapDialog.SIZE_SMALL,
                message: function(){
                    return div;
                },
                buttons: [
                    {
                        label: '确定',
                        cssClass: 'btn-primary',
                        action: function(dialogItself){
                            var region_id=$("#region_switch_selector",div).val();
                            if(region_id){
                                $.post(__ROOT__+"/Admin/Region/switchRegion",{"region_id":region_id}).success(function(json){
                                    if(json.code>0){
                                        location.href=location.href;
                                    }

                                });
                            }
                        }
                    },
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                        }
                    }]
            });
            $.post(__ROOT__+"/Admin/Region/listAll").success(function(json){
                var waper=$("#region_switch_selector",div);
                $.each(json,function(i,region){
                    waper.append("<option value='"+region._id+"'>"+region.name_cn+"</option>");
                });

            });
        }
        var inited=false;
        $("#swicth_region").bind("click",function(){
            if(!inited){
                listRegion();
                inited=true;
            }
            $.post(__ROOT__+"/Admin/Region/currentRegion").success(function(json){
                $("#current_region_name",div).html(json.name_cn);
                dialog.open();
            });


        });
    },
    _about:function(){
        $("#about_btn").bind("click",function(){
            $.post(__ROOT__+"/Admin/Login/about").success(function(json){
                storm.alert("版本:"+json.version);
            });
        });
    },
    maxture:function(){
        var parentDocument=parent.document;
        var pathInfo=$("#pathInfo").val();
        var parentPathInfo=$("#pathInfo",parentDocument).val();
        $(".btn-maxture").bind("click",function(){
            if(pathInfo!=parentPathInfo){//不是最大化
                parent.window.location=__ROOT__+"/"+pathInfo;
            }else{
                $.cookie("currentPage",__ROOT__+"/"+pathInfo,{path:__ROOT__+"/Home/Index/index"});
                location.href=__ROOT__+"/Home/Index/index";
            }
        });

        if(pathInfo!=parentPathInfo){//不是最大化
            $(".btn-maxture").attr('title','最大化');
            $(".btn-maxture").removeClass('compress').addClass('expand')


        }else{
            $(".btn-maxture ").attr('title','最小化');
            $(".btn-maxture").removeClass('expand').addClass('compress');

        }
    },
    step_prev:function(){
        $(".navbar-return-prev",parent.document).bind("click",function(){
            var pathInfo=$("#pathInfo").val();
            var parentDocument=parent.document;
            var parentPathInfo=$("#pathInfo",parentDocument).val();
            if(pathInfo!=parentPathInfo){
                window.history.go(-1);
            }

        });
    }

}

main__init.region_switch();

main__init._about();
main__init.maxture();
//main__init.step_prev();
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
