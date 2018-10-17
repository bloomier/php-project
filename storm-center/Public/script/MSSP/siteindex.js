/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var common_function = {
        compareDate : function(start, end){
            start = start.substring(0, 10);
            end = end.substring(0, 10);
            //var beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + start.substring(10, 19);
            //var endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + end.substring(10, 19);
            var startTime=new Date(start.replace("-", "/").replace("-", "/"));
            var endTime = new Date(end.replace("-", "/").replace("-", "/"));
            return Date.parse(endTime) - Date.parse(startTime);
        },
        getNowTime : function(){
            var date = new Date();
            var seperator1 = "-";
            var seperator2 = ":";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
                //+ " " + date.getHours() + seperator2 + date.getMinutes()
                //+ seperator2 + date.getSeconds();
            return currentdate;
        }
    }

    var SiteIndex = function(){
        this.init_data = init_data;
        this.init_bind = init_bind;
        this.init_view = init_view;
        this.init_function = init_function;
        this.setting = setting;
        this.init = init;
    };

    var init = function(){
        this.init_bind.bindFunction.call(this);
        this.init_data.init.call(this);
        this.init_view.init.call(this);
    };

    var setting = {
        filterParam:[]
    }

    // ajax request
    var init_data = {
        init : function(){
            var o = this;
            this.siteTable = $("#site_table").dataTable($.extend(storm.defaultGridSetting(),{
                "bInfo":false,
                "bLengthChange":false,
                "sAjaxSource": __ROOT__+'/MSSP/Site/query',
                "aoColumns": [
                    {"sDefaultContent": '',"sWidth":"27%"},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''},
                    {"sDefaultContent": ''}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {
                    var serviceInfo = aData['serviceInfo'];
                    var mills = common_function.compareDate(aData['end_time'], common_function.getNowTime());


                    var td1 = "-",td2 = "-",td3 = "-",td4 = "-", td5 = "-";
                    if(serviceInfo){
                        td1 = "<span class='yellow-label'>质量下降</span>";
                        if(serviceInfo.status){
                            td1 = "<span class='green-label'>正常访问</span>";
                        }
                        if(serviceInfo.offline_statistics){
                            td2 = ((86400000 - serviceInfo.offline_statistics.disconnect_time) / 86400000).toFixed(2) + "%";
                            td3 = serviceInfo.offline_statistics.disconnect_count;
                            td4 = serviceInfo.offline_statistics.disconnect_time_desc;
                        }else{
                            td2 = "100%";
                            td3 = 0;
                            td4 = "0分";
                        }
                    }
                    var title = aData['title'] || aData['domain']
                    if(aData['packages']&4){
                        td5=$('<i class="fa fa-desktop"></i>');
                        td5.css("cursor", "pointer").attr("title","云防护实时监测");
                        if(mills < 0){
                            td5.bind("click", function(){
                                window.location = __ROOT__ + "/ScreenCenter/CloudMonitor/index/domain/" + aData['domain'] + "/title/" + title;
                            });
                        }
                    }
                    if(title.length > 15){
                        title = "<abbr title='" + aData['domain'] + "'>" + title.substr(0,15) + "...</abbr>";
                    }
                    var reportIcon = $('<i class="fa fa-file-text-o"></i>');
                    reportIcon.css("cursor", "pointer").attr("title","点击查看报告");
                    reportIcon.bind("click",{"domain" : aData['domain'], "packages":aData['packages']},o.init_function.post);
                    $('td:eq(0)', nRow).html(title + "&nbsp;").append(reportIcon);
                    $('td:eq(1)',nRow).html(td1);
                    $('td:eq(2)',nRow).html(td2);
                    $('td:eq(3)',nRow).html(td3);
                    $('td:eq(4)',nRow).html(td4);
                    $("td:eq(5)",nRow).html(td5);
                    if(mills > 0){
                        $(nRow).css("color", "red").attr("title","已过期！");// 绑定点击点击事件
                        reportIcon.unbind("click");
                    }
                },
                "fnServerParams":function(aoData){
                    $.merge(aoData, o.setting.filterParam);
                }
            }));
        },
        query : function(value){
            var o = this;
            var flag = 0;
            var name = "package";
            $.each(o.setting.filterParam, function(point, item){
                if(item.name==name){
                    item.value = value;
                    flag = 1;
                }
            });
            if(!flag){
                o.setting.filterParam.push({name:name, value:value});
            }
            o.siteTable.fnDraw(true);
        }
    };

    // bind function
    var init_bind = {
        bindFunction: function(){
            var o = this;
            $(".grouptabs li").bind("click", function(){
                $(".active", $(".grouptabs")).removeClass("active");
                $(this).addClass("active");
                var text = $("a", this).attr("package");
                o.init_data.query.call(o, text);
                return false;
            });

            $(".btn-search").bind("click", function(){
                var param = $(this).prev().val();
                var flag = 0;
                $.each(o.setting.filterParam, function(point, item){
                    if(item.name=="param"){
                        item.value = param;
                        flag = 1;
                    }
                });
                if(!flag){
                    o.setting.filterParam.push({name:"param", value:param});
                }
                o.siteTable.fnDraw(true);
            });
        }
    };

    // append value to page
    var init_view = {
        init:function(){
            var w = this;
            //$(".grouptabs li:first").trigger("click");
        }
    };

    var init_function = {
        post : function(event){
            var domain = event.data.domain;
            var packages = event.data.packages;
            var form = $("#report-form");
            $("input[name='domain']", form).val(domain);
            $("input[name='packages']", form).val(packages);
            form.attr("action", __ROOT__ + "/MSSP/Report/index");
            form.submit();
            return false;
        },
        mouseover:function(){
            this.style.cursor='hand';
        },
        mouseout:function(){
            this.style.cursor='point';
        }
    };

    $(document).ready(function(){
        var siteIndex=new SiteIndex();
        siteIndex.init.call(siteIndex);
    });
})();