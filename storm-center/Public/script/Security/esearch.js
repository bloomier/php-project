/**
 *@name
 *@author Sean.xiang
 *@date 2015/7/6
 *@example
 */

var area_str = "";
var old_area = "11";

function show(obj){
    if(obj == '合计'){
        return;
    }
    if(obj.indexOf('.')>=0){
        //alert('历史事件');
        window.open(__ROOT__+'/Security/Event/history/web_domain/' + obj);

    }else {
        old_area = area_str;
        area_str = obj;
        var site_domain = $("#site_domain_id").val();
        var site_name = $("#site_name_id").val();
        var event_source = $("#event_source_id").val();
        var end_time = $("#end_time_id").val();
        var begin_time = $("#begin_time_id").val();
        var area = obj;
        var oldArea = old_area;
        var deal_state = $("#deal_state_id").val();
        var event_type = $("#event_type_id").val();
        $.getJSON(__ROOT__+'/Security/ESearch/search',
            {
                site_domain: site_domain,
                site_name: site_name,
                event_source: event_source,
                begin_time: begin_time,
                end_time: end_time,
                area: area,
                oldArea: oldArea,
                deal_state: deal_state,
                event_type: event_type
            }
        ).success(function(json){
            var table = "<table class='table table-bordered margin-top-20' >" +
                "<thead class='bg-lightgrey'><tr><th>序号</th><th>区域</th>" +
                "<th>黑页</th><th>暗链</th><th>反共</th><th>其他</th>" +
                "<th>事件总数</th><th>通报次数</th><th>整改次数</th>" +
                "<th>整改率</th></tr></thead><tbody>";
            if(json != null && json.data != null){
                for(var i = 0; i < json.data.length; i++){
                    table += "<tr><td>" + json.data[i].id + "</td>" +
                    "<td><a class='hand' onclick=show('" + json.data[i].area +"');>" + json.data[i].area + "</a></td>" +
                    "<td>" + json.data[i].hacked_num + "</td>" +
                    "<td>" + json.data[i].dark_chain_num + "</td>" +
                    "<td>" + json.data[i].anticommunist_num + "</td>" +
                    "<td>" + json.data[i].other_num + "</td>" +
                    "<td>" + json.data[i].all_num + "</td>" +
                    "<td>" + json.data[i].bulletin_num + "</td>" +
                    "<td>" + json.data[i].repair_num + "</td>" +
                    "<td>" + json.data[i].repair_rate + "%" + "</td>" +"</tr>";
                }
            }
            table += "</tbody></table>";
            document.getElementById("showlist_id").innerHTML = table;
        });
    }

}

(function(){


    $(function(){
        _init_Wdate_.setDefaultValue();
        $("#button_search_id").bind("click",function(){
            _init_list_.search();
        });
        $("#button_export_id").bind("click",function(){
            _init_list_.submit();
        });

        $("#button_export_detail_id").bind("click",function(){
            _init_list_.submitdetail();
        });
        //
        $(".citys").citySelect({prov:"请选择",city:"请选择"});
    });
    var _init_ = {
        view : function(){
            var height = window.screen.height;
            var weight = window.screen.width;
            $('#map').height(height*0.4);
            $('#pie').height(height*0.4);

        },
        draw: {
            init : function(){
                require.config({
                    paths: {
                        echarts: __ECHART__
                    }
                });

                require(
                    [
                        'echarts',
                        'echarts/chart/map',
                        'echarts/chart/pie'
                    ],
                    function (ec) {
                        // 基于准备好的dom，初始化echarts图表
                        var chartMap = ec.init(document.getElementById('map'));
                        var chartPie = ec.init(document.getElementById('pie'));

                        // 为echarts对象加载数据
                        chartMap.setOption(_init_data.mapOption());
                        chartPie.setOption(_init_data.pieOption());

                    }
                )
            }
        }

    };

    var _init_Wdate_ = {
        setDefaultValue : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            var begin_time = '' + fullYear + '-' + month + '-01';
            var end_time = '' + fullYear + '-' + month + '-' + day;
            $("#begin_time_id").val(begin_time);
            $("#end_time_id").val(end_time);
        }
    };




    var _init_list_ = {
        init : function(){

        },
        search : function(){
            var site_domain = $("#site_domain_id").val();
            var site_name = $("#site_name_id").val();
            var event_source = $("#event_source_id").val();
            var end_time = $("#end_time_id").val();
            var begin_time = $("#begin_time_id").val();
            var area = "";//$("#area_id").val();
            var province = $(".prov-location").val();
            var city = $(".city-location").val();// 市区
            if(province == "全国"){
                area = "";
            } else {
                if(city == null || city == "全省" || city == ""){
                    area = province;
                } else {
                    area = city;
                }
            }

            var deal_state = $("#deal_state_id").val();
            var event_type = $("#event_type_id").val();
            area_str = area;
            $.getJSON(__ROOT__+'/Security/ESearch/search',
                {
                    site_domain: site_domain,
                    site_name: site_name,
                    event_source: event_source,
                    begin_time: begin_time,
                    end_time: end_time,
                    area: area,
                    deal_state: deal_state,
                    event_type: event_type
                }
            ).success(function(json){
                    var table = "<table class='table table-bordered margin-top-20' >" +
                                "<thead class='bg-lightgrey'><tr><th>序号</th><th>区域</th>" +
                                "<th>黑页</th><th>暗链</th><th>反共</th><th>其他</th>" +
                                "<th>事件总数</th><th>通报次数</th><th>整改次数</th>" +
                                "<th>整改率</th></tr></thead><tbody>";
                    //typeof(json) == 'object'
                    if(json != null && json != 'null' && json.data != null && json.data != 'null'){
                        for(var i = 0; i < json.data.length; i++){
                            table += "<tr><td>" + json.data[i].id + "</td>" +
                            "<td><a class='hand' onclick=show('" + json.data[i].area +"');>" + json.data[i].area + "</a></td>" +
                            "<td>" + json.data[i].hacked_num + "</td>" +
                            "<td>" + json.data[i].dark_chain_num + "</td>" +
                            "<td>" + json.data[i].anticommunist_num + "</td>" +
                            "<td>" + json.data[i].other_num + "</td>" +
                            "<td>" + json.data[i].all_num + "</td>" +
                            "<td>" + json.data[i].bulletin_num + "</td>" +
                            "<td>" + json.data[i].repair_num + "</td>" +
                            "<td>" + json.data[i].repair_rate + "%" + "</td>" +"</tr>";
                        }
                    }


                    table += "</tbody></table>";
                    document.getElementById("showlist_id").innerHTML = table;
            });
        },
        submit : function(){
            if(area_str == ''){
                var province = $(".prov-location").val();
                var city = $(".city-location").val(); // 市区
                if(province == "全国"){
                    area_str = "";
                } else {
                    if(city == null || city == "全省" || city == ""){
                        area_str = province;
                    } else {
                        area_str = city;
                    }
                }
            }
            var params = "site_domain=" + $("#site_domain_id").val() +
                         "&site_name=" + $("#site_name_id").val() +
                         "&event_source=" + $("#event_source_id").val() +
                         "&end_time=" + $("#end_time_id").val() +
                         "&begin_time=" + $("#begin_time_id").val() +
                         "&area=" + area_str +
                         "&deal_state=" + $("#deal_state_id").val() +
                         "&event_type=" + $("#event_type_id").val();
            window.open(__ROOT__+'/Security/ESearch/export?' + params);
        },
        submitdetail : function(){
            if(area_str == ''){
                var province = $(".prov-location").val();
                var city = $(".city-location").val(); // 市区
                if(province == "全国"){
                    area_str = "";
                } else {
                    if(city == null || city == "全省" || city == ""){
                        area_str = province;
                    } else {
                        area_str = city;
                    }
                }
            }
            var params = "site_domain=" + $("#site_domain_id").val() +
                "&site_name=" + $("#site_name_id").val() +
                "&event_source=" + $("#event_source_id").val() +
                "&end_time=" + $("#end_time_id").val() +
                "&begin_time=" + $("#begin_time_id").val() +
                "&area=" + area_str +
                "&deal_state=" + $("#deal_state_id").val() +
                "&report_email=" + $("#event_email_id").val() +
                "&event_type=" + $("#event_type_id").val();
            window.open(__ROOT__+'/Security/ESearch/exportDetail?' + params);
        },
        _export : function(){

            var site_domain = $("#site_domain_id").val();
            var site_name = $("#site_name_id").val();
            var event_source = $("#event_source_id").val();
            var end_time = $("#end_time_id").val();
            var begin_time = $("#begin_time_id").val();
            var area = area_str;
            var deal_state = $("#deal_state_id").val();
            var event_type = $("#event_type_id").val();

            $.getJSON(__ROOT__+'/Security/ESearch/exportDetail/',
                {
                    site_domain: site_domain,
                    site_name: site_name,
                    event_source: event_source,
                    begin_time: begin_time,
                    end_time: end_time,
                    area: area,
                    deal_state: deal_state,
                    event_type: event_type
                }
            ).success(function(json){
                if(json.code > 0){
                    alert(json.msg);
                }
            });
        }
    };


    var _init_data = {
        mapOption : function(){
            var option = {

                tooltip : {
                    trigger: 'item'
                },
                dataRange: {
                    orient: 'horizontal',
                    min: 0,
                    max: 2500,
                    x: 'left',
                    y: 'bottom',
                    text:['高','低'],           // 文本，默认为数值文本
                    calculable : true
                },
                series : [
                    {
                        type: 'map',
                        mapType: 'china',
                        roam: false,
                        itemStyle:{
                            normal:{label:{show:true}},
                            emphasis:{label:{show:true}}
                        },
                        data:[
                            {name: '北京',value: Math.round(Math.random()*1000)},
                            {name: '天津',value: Math.round(Math.random()*1000)},
                            {name: '上海',value: Math.round(Math.random()*1000)},
                            {name: '重庆',value: Math.round(Math.random()*1000)},
                            {name: '河北',value: Math.round(Math.random()*1000)},
                            {name: '河南',value: Math.round(Math.random()*1000)},
                            {name: '云南',value: Math.round(Math.random()*1000)},
                            {name: '辽宁',value: Math.round(Math.random()*1000)},
                            {name: '黑龙江',value: Math.round(Math.random()*1000)},
                            {name: '湖南',value: Math.round(Math.random()*1000)},
                            {name: '安徽',value: Math.round(Math.random()*1000)},
                            {name: '山东',value: Math.round(Math.random()*1000)},
                            {name: '新疆',value: Math.round(Math.random()*1000)},
                            {name: '江苏',value: Math.round(Math.random()*1000)},
                            {name: '浙江',value: Math.round(Math.random()*1000)},
                            {name: '江西',value: Math.round(Math.random()*1000)},
                            {name: '湖北',value: Math.round(Math.random()*1000)},
                            {name: '广西',value: Math.round(Math.random()*1000)},
                            {name: '甘肃',value: Math.round(Math.random()*1000)},
                            {name: '山西',value: Math.round(Math.random()*1000)},
                            {name: '内蒙古',value: Math.round(Math.random()*1000)},
                            {name: '陕西',value: Math.round(Math.random()*1000)},
                            {name: '吉林',value: Math.round(Math.random()*1000)},
                            {name: '福建',value: Math.round(Math.random()*1000)},
                            {name: '贵州',value: Math.round(Math.random()*1000)},
                            {name: '广东',value: Math.round(Math.random()*1000)},
                            {name: '青海',value: Math.round(Math.random()*1000)},
                            {name: '西藏',value: Math.round(Math.random()*1000)},
                            {name: '四川',value: Math.round(Math.random()*1000)},
                            {name: '宁夏',value: Math.round(Math.random()*1000)},
                            {name: '海南',value: Math.round(Math.random()*1000)},
                            {name: '台湾',value: Math.round(Math.random()*1000)},
                            {name: '香港',value: Math.round(Math.random()*1000)},
                            {name: '澳门',value: Math.round(Math.random()*1000)}
                        ]
                    }
                ]
            };
            return option;
        },
        pieOption: function(){
            var option = {

                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable : true,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:335, name:'北京'},
                            {value:310, name:'上海'},
                            {value:234, name:'广东'},
                            {value:135, name:'浙江'},
                            {value:448, name:'江苏'},
                            {value:156, name:'重庆'},
                            {value:566, name:'河南'},
                            {value:386, name:'山东'},
                            {value:598, name:'其他'}
                        ]
                    }
                ]
            };
            return option;
        }
    }

})();

