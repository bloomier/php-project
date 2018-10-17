/**
 * Created with JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-3-27
 * Time: 15:22
 * To change this template use File | Settings | File Templates.
 */

var __ECHART__=$("#echartPath").val();
var __ROOT__=$("#rootPath").val();
var __WEBROOT__=__ROOT__;
var __PUBLIC__=$("#publicPath").val();
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

var storm={

    defaultGridSetting:function(){
        var zh_CN={
            "sProcessing":   "处理中...",
            "sLengthMenu":   "_MENU_ 记录/页",
            "sZeroRecords":  "没有匹配的记录",
            "sInfo":         "显示第 _START_ 至 _END_ 项记录，共  _TOTAL_项，共_PAGE_页 ",
            "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
            "sInfoPostFix":  "",
            "sSearch":       "过滤:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "首页",
                "sPrevious": "上页",
                "sNext":     "下页",
                "sLast":     "末页"
            }
        };
        var gridSetting={
            "iDisplayLength": 10,//每页显示10条数据
            "oLanguage": zh_CN,
            "bProcessing": true,//开启读取服务器数据时显示正在加载中……
            "bServerSide": true,//服务器模式
            "sServerMethod": "POST",
            "bSort":false,//不支持排序
            "bStateSave": true,
            "bSortClasses":false,
            "sPaginationType":"bs_full",
            "sAjaxDataProp":'rows'//需要展示的数据是json中的items
        };
        return gridSetting;

    },

    defaultStaticGridSetting : function(){

        var zh_CN={
            "sProcessing":   "处理中...",
            "sLengthMenu":   "_MENU_ 记录/页",
            "sZeroRecords":  "没有匹配的记录",
            "sInfo":         "显示第 _START_ 至 _END_ 项记录，共  _TOTAL_项，共_PAGE_页 ",
            "sInfoEmpty":    "显示第 0 至 0 项记录，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项记录过滤)",
            "sInfoPostFix":  "",
            "sSearch":       "过滤:",
            "sUrl":          "",
            "oPaginate": {
                "sFirst":    "首页",
                "sPrevious": "上页",
                "sNext":     "下页",
                "sLast":     "末页"
            }
        };
        var gridSetting={
            "iDisplayLength": 10,//每页显示10条数据
            "oLanguage": zh_CN,
            "bSort":false,//不支持排序
            "bSortClasses":true,
            "sPaginationType":"bs_full",
            "bLengthChange": false,
            "bDestroy": false,
            "bInfo":false,
            "bRetrieve": false,
            "bAutoWidth": false//自动宽度

        };
        return gridSetting;

    },
    confirm:function(msg,callback){
        var dialog= new BootstrapDialog({
            title: '系统消息',
            size:BootstrapDialog.SIZE_SMALL,
            type:BootstrapDialog.TYPE_DEFAULT,
            message: msg,
            buttons: [
                {
                    label: '确定',
                    cssClass: 'btn-primary',
                    action: function(dialogItself){
                        callback&&callback.call(this);
                        dialogItself.close();
                    }
                },

                {
                    label: '关闭',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
        });
        dialog.open();

    },
    alert:function(msg){
        var dialog= new BootstrapDialog({
            title: '系统消息',
            size:BootstrapDialog.SIZE_SMALL,
            type:BootstrapDialog.TYPE_DEFAULT,
            message: msg,
            buttons: [
                {
                    label: '确定',
                    cssClass: 'btn-default',
                    action: function(dialogItself){
                        dialogItself.close();
                    }
                }]
        });
        dialog.open();
    },
    showMsg:function(msg){
        $.gritter.add({
            time:2,
            text:msg
            // (string | mandatory) the heading of the notification
            // (string | mandatory) the text inside the notification
        });
    },
    initForm:function(form,json){

        $.each(json,function(k,v){
            var o=$("[name='"+k+"']",form);
            if(o){
                if(o.is(":input")&&o.attr("type")){
                    if(o.attr("type")=='password'){
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
                    o.val(v);
                }
            }
        });
    },
    resetForm:function(form){
        $("input",form).val("");
        $("select",form).val("");
    },
    getTableSelectedIds:function(table){
        var tbody=$("tbody",table);
        var ids=[];
        var checks=$(":checked",tbody);
        $.each(checks,function(i,o){
            ids.push($(o).val());
        });
        return ids.join(",");
    }

};


Date.prototype.Format = function (fmt) { //author: meizz
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

String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

Date.prototype.getLastDate = function(count, date){
    if(!date){
        var d = new Date();
        var vYear = d.getFullYear();
        var vMon = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth()+1) : (d.getMonth()+1);
        var vDay = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
        date = vYear + '-' + vMon + '-' + vDay;
    }
    var result = date;
    if(count){
        var dd = new Date();
        var tmpDate = result.split('-');
        dd.setFullYear(tmpDate[0]);
        dd.setMonth(tmpDate[1] - 1);
        dd.setDate(tmpDate[2]);
        dd.setDate(dd.getDate()+count);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth()+1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1);
        var d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate();
        result = y + '-' + m + '-' + d;
    }

    return result;
}


var JsonSort=function (json,key){
    //console.log(json);
    for(var j=1,jl=json.length;j < jl;j++){
        var temp = json[j],
            val  = temp[key],
            i    = j-1;
        while(i >=0 && json[i][key]>val){
            json[i+1] = json[i];
            i = i-1;
        }
        json[i+1] = temp;

    }
    //console.log(json);
    return json;

}



