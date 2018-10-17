/**
 *@name
 *@author song
 *@date 2015/4/21
 *@desc
 */
(function(){

    var mapChart;
    var barChart;
    var highHole;
    var midHole;
    var lowHole;
    var infoHole;

    $(function(){

        __init__.initView();// 初始化页面各种echart的大小

        __init__.drawView();// 初始化页面的echart图片

        __bind__.bindFunction();// 绑定事件

        __init__.valueToPage();// 将数据渲染到页面


        $("#myTab li:first a").click();

        $(".event_year li:first").addClass("current");

    });

    var __init__ = {
        initView : function(){
            var height = window.screen.height;
            $('#mapChart').height(height * 0.5);
            $('#barChart').height(height * 0.5);
            $('#holePie').height(height * 0.3);
            $('#highHole').height(200);
            $('#midHole').height(200);
            $('#lowHole').height(200);
            $('#infoHole').height(200);
        },

        drawView : function(){
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map',
                    'echarts/chart/line',
                    'echarts/chart/bar',
                    'echarts/chart/pie'
                ],
                function (ec) {

                    highHole = ec.init(document.getElementById('highHole'));
                    midHole = ec.init(document.getElementById('midHole'));
                    lowHole = ec.init(document.getElementById('lowHole'));
                    infoHole = ec.init(document.getElementById('infoHole'));

                    var allCount = $.parseJSON($("#vulsCount").val());

                    var high = Number(allCount['high']);
                    var mid = Number(allCount['mid']);
                    var info = Number(allCount['info']);
                    var low = Number(allCount['low']);

                    var allCount = high + mid + info + low;

                    if(allCount == 0){
                        allCount = 100;
                    }
                    var re = /^[0-9]*[1-9][0-9]*$/;

                    var highCount = high * 100/allCount;
                    var highLeaveCount = 100 - highCount;
                    if(String(highCount).indexOf(".")>-1){
                        highCount = highCount.toFixed(2);
                        highLeaveCount = highLeaveCount.toFixed(2);
                    }

                    var midCount = mid * 100/allCount;
                    var midLeaveCount = 100 - midCount;
                    if(String(midCount).indexOf(".")>-1){
                        midCount = midCount.toFixed(2);
                        midLeaveCount = midLeaveCount.toFixed(2);
                    }

                    var lowCount = low * 100/allCount;
                    var lowLeaveCount = 100 - lowCount;
                    if(String(lowCount).indexOf(".")>-1){
                        lowCount = lowCount.toFixed(2);
                        lowLeaveCount = lowLeaveCount.toFixed(2);
                    }

                    var infoCount = info * 100/allCount;
                    var infoLeaveCount = 100 - infoCount;
                    if(String(infoCount).indexOf(".")>-1){
                        infoCount = infoCount.toFixed(2);
                        infoLeaveCount = infoLeaveCount.toFixed(2);
                    }

                    highHole.setOption(__option__.highHoleOption(highCount, highLeaveCount));
                    midHole.setOption(__option__.midHoleOption(midCount, midLeaveCount));
                    lowHole.setOption(__option__.lowHoleOption(lowCount, lowLeaveCount));
                    infoHole.setOption(__option__.infoHoleOption(infoCount , infoLeaveCount));

                    $(".highLevelCount").html(high);
                    $(".midLevelCount").html(mid);
                    $(".lowLevelCount").html(low);
                    $(".infoLevelCount").html(info);
                });
        },

        initSite : function(webSafe, div){
            if(webSafe == "" || webSafe == "[]"){
                return;
            }
            webSafe = $.parseJSON(webSafe);

            var have = webSafe.know;
            var unhave = webSafe.unknow;

            $.each(have, function(item, point){
                var domain = point.domain;
                var vinfo = point.info;
                var security = 0;
                var high = 0;
                var status = "无危险";
                var mid = 0;
                var low = 0;
                var info = 0;
                var count = 0;
                var infoCount = 0;
                var level = "无危险";
                if(vinfo){
                    status = vinfo.status;
                    high = vinfo.high;
                    mid = vinfo.mid;
                    low = vinfo.low;
                    info = vinfo.info;
                    security = vinfo.security;
                    count = high + mid + low + info + 0;
                    infoCount = info + 0;
                    var levelInfo = "未发现";
                    var color = "";
                    if(count > 0){
                        if((security + high) > 0){
                            levelInfo = "高危";
                            color = "red";
                        }else if(mid > 0){
                            levelInfo = "中危";
                            color = "orange";
                        }else if(low > 0){
                            levelInfo = "低危";
                            color = "blue";
                        }else if(info > 0){
                            levelInfo = "信息";
                        }
                        level = "<button type='button' class='btn mini disable " + color + "' domain='" + domain + "'>" + levelInfo + "</button>";
                    }else{
                        level = "<button type='button' class='btn mini disable' domain='" + domain + "'>" + levelInfo + "</button>";
                    }
                }
                var title = point.title || point.domain;
                var titleLabel;
                if(title.length > 10){
                    titleLabel = "<label title='" + title + "'>" + title.substr(0, 10) + "...</label>";
                }else{
                    if(title.length == 0){
                        title = "未收录";
                    }
                    titleLabel = "<label>" + title + "</label>";
                }
                div.append($("<tr><td><a href='http://" + domain + "' target='_blank'>" + titleLabel + "</a></td><td>" + level + "</td><td>" + security + "</td><td>" + high + "</td><td>" + mid + "</td><td>" + low + "</td><td>" + info + "</td><td>" + "<button class='btn mini otherdomain' domain='" + domain + "'>查看</button>" + "</td></tr>"));
            });

            $.each(unhave, function(item, point){
                div.append($("<tr><td><a href='http://" + point + "' target='_blank'>" + point + "</a></td><td><button class='btn btn-info mini disable' domain='" + point + "'>未知</button></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"));
            });
        },

        valueToPage : function(){
            var title = $("#domainTitle").val() || $("#domainSite").val();
            var domain = $("#domainSite").val();

            if(title.length > 15){
                title = title.substr(0, 15) + "...";
            }
            $(".domainTitle").html(title);// 初始化标题


            $(".domainSite").html(domain);// 初始化域名

            var ipWebSrc = $("#ipWebSafeSrc").val();
            __init__.initSite(ipWebSrc, $("#ip-web-info"));// 初始化Ip旁站

            var subWebSrc = $("#subWebSafeSrc").val();
            __init__.initSite(subWebSrc, $("#sub-web-info"));// 初始化二级网站旁站

            var roomWebSrc = $("#roomWebSafeSrc").val();
            __init__.initSite(roomWebSrc, $("#room-web-info"));// 初始化网站旁站

            var securityCount = $("#securityCount").val(); // 初始化安全事件

            var securityDealArray = $.parseJSON(decodeURIComponent($("#securityDealArray").val()));

            if(securityCount){
                var securityArray = $("#securityArray").val();
                securityArray = $.parseJSON(decodeURIComponent(securityArray));
                var countAll = securityArray['count'];
                $(".securityEventCountAll").html(countAll);

                var d = new Date();
                var vYear = d.getFullYear();
                var vMon = d.getMonth() + 1;
                var thisMonthCount = 0;
                //var vDay = d.getDate()()

                for(; vYear>2000; vYear--){
                    // 年
                    if(securityArray[vYear]){
                        $(".event_year").append($("<li><label for='" + vYear + "'>" + vYear + "</label></li>"));
                        var this_year = $("<div class='list'></div>");
                        this_year.append($("<h3 id='" + vYear + "'>" + vYear + "</h3>"));
                        var securityYear = securityArray[vYear];
                        for(var i = 12; i > 0; i--){
                            var tmp;
                            if(i > 10){
                                tmp = vYear + "-" + i;
                            }else{
                                tmp = vYear + "-0" + i;
                            }
                            // 月
                            if(securityYear[tmp]){
                                var securityMonth = securityYear[tmp];
                                if(i == vMon){
                                    thisMonthCount = securityMonth['count'];
                                }
                                for(var j = 31; j > 0; j--){
                                    var tmpDay;
                                    if(j > 10){
                                        tmpDay = tmp + "-" + j;
                                    }else{
                                        tmpDay = tmp + "-0" + j;
                                    }
                                    // 日
                                    if(securityMonth[tmpDay]){
                                        var securityDay = securityMonth[tmpDay];
                                        $.each(securityDay, function(point, item){
                                            var wraper = $("#one-event-time").clone().removeAttr("id");
                                            $(".event_date",wraper).html(i + "-" + j);
                                            var typeCh = item.vname;
                                            $(".type",wraper).html(typeCh);
                                            var desc = item.poc;
                                            if(desc){
                                                if(desc.indexOf("[") == 0 && (desc.lastIndexOf("]") + 1) == desc.length){
                                                    desc = desc.substr(1, desc.length -1);
                                                    var value = "";
                                                    $.each(desc.split("}, {"), function(point, item){
                                                        if(item.indexOf("{") == 0){
                                                            item = item.substr(1);
                                                        }
                                                        if(item.lastIndexOf("}]") != -1){
                                                            item = item.split("}]")[0];
                                                        }
                                                        value = value + item + "\n";
                                                    })
                                                    desc = value;
                                                }
                                            }

                                            var event_snapshot = "";
                                            var happendTime = item.timestamp;
                                            var status = "";
                                            var repairTime = "";
                                            var srcUrl = item.url;
                                            var vid=item["vid"];
                                            $.each(securityDealArray, function(point, item){
                                                if(srcUrl == item["web_url"]){
                                                    if(vid=="SD6016"){
                                                        event_snapshot = item["event_snapshot"];
                                                        status = item["deal_state"];
                                                        repairTime = item["repair_date"];
                                                    }
                                                }
                                            });

                                            $(".this_event_url",wraper).html(item.url).attr("imgPath",event_snapshot)
                                                .attr("happendTime", happendTime).attr("href", item.url)
                                                .attr("status", status).attr("desc", desc).attr("repairTime", repairTime).attr("srcUrl", item.url);
                                            if(status){
                                                if(status == 0){
                                                    status = "未审核";
                                                }else if(status == 1){
                                                    status = "误报";
                                                }else if(status == 2){
                                                    status = "已通报";
                                                }else{
                                                    status = "已修复";
                                                }
                                                $(".repair",wraper).html(status);
                                            }else{
                                                $(".repair",wraper).html("未审核");
                                            }

                                            wraper.show().appendTo(this_year);

                                        });

                                    }
                                }
                            }
                        }
                        this_year.appendTo($(".event_list"));
                    }
                }

                $(".thisMonthSecurityEvent").html(thisMonthCount);
            }
        },

        initTimeLine: function(){
            var urls=$('.this_event_url');
            var imgServer = $("#imgServer").val();
            $.each(urls,function(i,url){
                var img = "";
                var imgPath = $(url).attr("imgPath");
                if(imgPath){
                    img = '<img src="' + imgServer + "/" + imgPath + '"/>';
                }
                var status = $(url).attr("status") || 0;
                if(status == 0){
                    status = "未审核";
                }else if(status == 1){
                    status = "误报";
                }else if(status == 2){
                    status = "已通报";
                }else{
                    status = "已修复";
                }
                $(url).tooltip({
                    trigger: 'hover',
                    title: '提示',
                    placement: 'bottom',
                    html: true,
                    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div>' +
                    img +
                    '<p><span class="col-md-3 ft-dd">网页</span><span class="col-md-8 ft-s">' + $(url).attr("srcUrl") + '</span></p>' +
                    '<p><span class="col-md-3 ft-dd">时间</span><span class="col-md-8 ft-s">' + $(url).attr("happendTime") + '</span></p>' +
                    '<p><span class="col-md-3 ft-dd">描述</span><pre class="col-md-8">' + $(url).attr("desc") +'</pre></p>' +
                    '<p><span class="col-md-3 ft-dd">处理状态</span><span class="col-md-8 ft-s green">' + status + '</span></p>' +
                    '<p><span class="col-md-3 ft-dd">修复时间</span><span class="col-md-8 ft-s">' + $(url).attr("repairTime")||"" + '</span></p>' +
                    '</div>'
                });

            });

        }

    };



    var __option__ = {
        labelTop : function(){
            var labelTop = {
                normal : {
                    label : {
                        show : true,
                        position : 'center',
                        formatter : '{b}',
                        textStyle: {
                            baseline : 'bottom'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            return labelTop;
        },
        labelFromatter : function(){
            var labelFromatter = {
                normal : {

                    label : {
                        formatter : function (params){
                            return 100 - params.value + '%'
                        },
                        textStyle: {
                            baseline : 'top'
                        }
                    }
                }
            };
            return labelFromatter;
        },
        labelBottom : function(){
            var labelBottom = {
                normal : {
                    color: '#ccc',
                    label : {
                        show : true,
                        position : 'center'
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
            return labelBottom;
        },

        radius : function(){
            return [40, 55];
        },

        highHoleOption : function(high, sub){
            var option = {
                color: ['#d32a03', '#ddd'],
                calculable : false,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        center: ['50%','50%'],
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {
                                value:high,
                                name:'直接访问',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : '{c}'+'%',
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }

                                }
                            },
                            {
                                value:sub,
                                name:'邮件营销'
                            }
                        ]
                    }
                ]
            };
            return option;
        },

        midHoleOption : function(mid, sub){
            var option = {
                color: ['#ff7a04', '#ddd'],
                calculable : false,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        center: ['50%','50%'],
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false
                                }
                            }


                        },
                        data:[
                            {
                                value:mid,
                                name:'直接访问',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : '{c}'+'%',
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }

                                }
                            },
                            {
                                value:sub,
                                name:'邮件营销'
                            }

                        ]
                    }
                ]
            }
            return option;
        },

        lowHoleOption : function(low, sub){
            var option = {
                color: ['#ffcd04', '#ddd'],
                calculable : false,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        center: ['50%','50%'],
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {
                                value:low,
                                name:'直接访问',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : '{c}'+'%',
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }

                                }
                            },
                            {
                                value:sub,
                                name:'邮件营销'
                            }

                        ]
                    }
                ]
            };
            return option;
        },


        infoHoleOption : function(info, sub){
            var option = {
                color: ['#CDE71B', '#ddd'],
                calculable : false,
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        center: ['50%','50%'],
                        radius : ['50%', '70%'],
                        itemStyle : {
                            normal : {
                                label : {
                                    show : false
                                },
                                labelLine : {
                                    show : false
                                }
                            },
                            emphasis : {
                                label : {
                                    show : false
                                }
                            }
                        },
                        data:[
                            {
                                value:info,
                                name:'直接访问',
                                itemStyle : {
                                    normal : {
                                        label : {
                                            show : true,
                                            position: 'center',
                                            formatter : '{c}'+'%',
                                            textStyle: {
                                                fontSize: 24
                                            }
                                        },
                                        labelLine : {
                                            show : false
                                        }
                                    }

                                }
                            },
                            {
                                value:sub,
                                name:'邮件营销'
                            }

                        ]
                    }
                ]
            };
            return option;
        }

    };

    var __function__ = {
        replaceStr : function(str){
            str = str.replaceAll("&lts", "&lt;").replaceAll("&amp;lts", "&lt;").replaceAll("&gts", "&gt;").replaceAll("&amp;gts", "&gt;");
            str = str.replaceAll("&quots", "\"").replaceAll("&amp;quots", "\"").replaceAll("&amp", "&");
            return str;
        }
    }

    var __setting__ = {
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
                "iDisplayLength": 5,//每页显示10条数据
                "oLanguage": zh_CN,
                "bProcessing": false,//开启读取服务器数据时显示正在加载中……
                "bServerSide": false,//服务器模式
                "sServerMethod": "POST",
                "bSort":false,//不支持排序
                "bSortClasses":false,
                "sPaginationType":"bs_full",
                "bLengthChange": false,
                "bInfo":false
            };
            return gridSetting;

        }
    }

    var __bind__ = {
        bindFunction : function(){
            /*绑定进入其他报告的点击事件*/
            $(".otherdomain").live("click",function(){
                var path = "domainReport?url=" + $(this).attr("domain");
                window.open(path);
            });

            /*折叠*/
            $('.tool').click(function(e){
                var el =$(this).children('i');
                if(el.hasClass('fa-angle-down')){
                    el.removeClass('fa-angle-down').addClass('fa-angle-up');
                }else{
                    el.removeClass('fa-angle-up').addClass('fa-angle-down');
                }
                e.preventDefault();
            });

            /*时间轴*/
            $('.timeline li label').click(function(){
                $('.event_year>li').removeClass('current');
                $(this).parent('li').addClass('current');
                var year = $(this).attr('for');
                $('#'+year).parent().prevAll('div').slideUp(800);
                $('#'+year).parent().slideDown(800).nextAll('div').slideDown(800);
            });

            /*页面滚动*/
            $(window).scroll( function() {
                var scrollValue=$(window).scrollTop();
                scrollValue > 100 ? $('.scroll').slideDown():$('.scroll').slideUp();
            });

            $('.scroll').click(function(){
                $("html,body").animate({scrollTop:0},200);
            });

            $(".vuls-content-table").dataTable(__setting__.defaultGridSetting());
            //$(".vuls-content-table").dataTable();

            $(".pocbtn").live("click", function(){
                $.post("getPocInfo", {"rowkey":$(this).attr("rowkey")}).success(function(json){
                    $("#pocContent").html("");
                    $("#pocResponseHeader").html("");
                    $("#pocHeader").html("");
                    console.info(json);
                    var value = json['resp'];
                    var arg = json['arg'];
                    var requestHeader = json['responseHeader'];
                    if(requestHeader != ""){
                        requestHeader = __function__.replaceStr(requestHeader);
                        $("#pocResponseHeader").html(requestHeader);
                    }
                    value = __function__.replaceStr(value);
                    arg = __function__.replaceStr(arg);
                    if(arg != ""){
                        value = value.replaceAll(arg, "<samp><span style='color:red'>" + arg + "</span></samp>")
                    }
                    var header = json['req'];
                    header = __function__.replaceStr(header);

                    $("#pocHeader").html(header);
                    $("#pocContent").html(value);
                    $('#myPocModal').modal('show')
                });


            });

            $("#pocModelClose").bind("click", function(){
                $('#myPocModal').modal('hide')
            });

            // 显示模态框
            $(".send-email").live("click", function(){
                $('#myModal').modal('show')
            });

            // 关闭
            $(".unsend-btn").live("click", function(){
                $('#myModal').modal('hide')
            });

            // 发送邮件
            $("#sendMail").bind("click", function(){
                if($("#emailTitle").val() == "" || $("#emailContent").val() == ""){
                    $("#email-result").html("邮件标题或正文不能为空");
                    return;
                }
                if($.trim($("#emailContact").val()) == ''){
                    $("#email-result").html("收件人不能为空");
                    return;
                }
                var param = {"url" : encodeURIComponent($("#encodeDomain").val()),  "to" : $("#emailContact").val(), "cp" : $("#emailContactCp").val()};
                $.extend(param, {"title" : $("#emailTitle").val(), "content" : $("#emailContent").val()});


                $('#myModal').modal('hide');
                $.ajax({"dataType":'json', "type":"POST", "url": "emailDomainReport", "data":param, "success":function(data) {
                    if(data.code == 0){
                        $("#email-result").html(data.msg);
                    }else{
                        $("#email-result").html(data.msg);
                    }

                    $("#sendMail").html("发送");
                }});
            });



            $(".domina-report-export").bind("click", function(){
                var href ="exportDomainReport?url=" + encodeURIComponent($("#encodeDomain").val());
                window.open(href);
            });

            $.post("getAutoEmailList").success(function(emails){
                $('#emailContact,#emailContactCp').autocomplete(emails,{
                    width :400,
                    scrollHeight: 300,   //提示的高度，溢出显示滚动条
                    matchContains: true,    //包含匹配，就是data
                    autoFill: false,    //自动填充
                    multiple: true,
                    multipleSeparator: ";\n",
                    formatItem: function (row, i, max) {

                        return row.name+"["+row.address+"]&lt;"+row.gname+"&gt;";
                    },
                    formatMatch: function(row, i, max){
                        return row.name+row.address+row.gname;

                    } ,
                    formatResult: function(row, i, max) {

                        return row.name+"["+row.address+"]";
                    }
                });

            });
        }
    };
})();


