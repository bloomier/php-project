var GovWeb = {

    init:function(){
        var w = this;
        w.echartOne = null;
        w.allPage = 0;
        w.currentPage = 0;
        w.echarts_map();
        w.serviceNode();
        w.highDanger();
        w.highPoint();
        w.siteFault();
        w.siteFaultlist();
        w.strutsBug();
        w.initHandle();
        setInterval(function(){
            w.serviceNode();
            w.highDanger();
            w.highPoint();
            w.siteFault();
            w.siteFaultlist();
            w.strutsBug();
        },300*1000);
    },

    //服务质量下降站点
    serviceNode:function(){
        var w = this;
        $("#quality-site tbody").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getDomainServiceDown").success(function(json){
            var i = 0;
            var domainSum=0;
            $.each(globalObj.domainTitle,function(k,v){
                domainSum++;
            });
            if(json['code']){
                json['items'].sort(function(a,b){
                    var dateTimeA = a['startTime'].split(" ");
                    var dateTimeB = b['startTime'].split(" ");
                    return parseInt(dateTimeB[1].replaceAll(":",""))-parseInt(dateTimeA[1].replaceAll(":",""));

                });
                $.each(json['items'],function(key,value){
                        var times = value['startTime'].split(" ");
                        var time = times[1];
                        var title = globalObj.domainTitle[value['domain']]?globalObj.domainTitle[value['domain']]:value['domain'];
                        var tr = "<tr> <td>"+time+"</td> <td>"+title+"</td> <td>"+value['continueTime']+"</td></tr>";
                        $(".gridRoll tbody").append(tr);

                        i++;
                });
                $(".serviceWarn span.num").text(i);
                $(".total .site span").text(i);

                if(!json['items']&&__function__.timeDifToCur(json['items'][0]['startTime'])<=500){
                    GovWeb.initModel(json['items'][0],"服务质量下降");

                }

            }

        });

    },

    //高中风险站点分布
    highDanger:function(){
        var w = this;
        globalObj.highSitCount=0;
        $(".highDangerTable tbody").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getVulsMsg").success(function(json){
            if(json&&json.length>0) {
                $(".highDanger span.num").text(json.length);
                json.sort(function (a, b) {
                    if (a['highCount'] == b['highCount']) {
                        return b['midCount'] - a['midCount'];

                    }
                    return b['highCount'] - a['highCount'];
                });
                $.each(json, function (point, items) {
                    if(items['highCount']>0){
                        globalObj.highSitCount++;
                    }
                    var title = globalObj.domainTitle[items['_id']] ? globalObj.domainTitle[items['_id']] : items['title']?items['title']:items['_id'];
                    //var titleSub=title.length<=15?title:title.substr(0,15)+"...";
                    var highDetail = items['highList'].join("\n");
                    var midDetail = items['midList'].join("\n");
                    var tr = '<tr> <td style="text-align: left" title='+title+'>' + title + '</td>'
                        + '<td title="'+highDetail+'"><span class="c-red"><i class="fa fa-flash"></i> 高危：' + items['highCount'] + '</span></td>'
                        + '<td title="'+midDetail+'"><span class="c-yellow"><i class="fa fa-flash"></i> 中危：' + items['midCount'] + '</span></td></tr>';
                    $(".highDangerTable tbody").append(tr);
                });

                $(".total .node span").text(globalObj.highSitCount);
            }
        });
    },

    //高危端口分布
    highPoint:function(){
        var w = this;
        $(".highPointTable tbody").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getRiskPort").success(function(json){
            var highnumpoint=0;
            if(json&&json['portMsg']){
                $.each(json['portMsg'],function(k,v){
                    var portDomain;
                    $.each(json['ipPort'],function(key,value){
                        if(value==k){
                            portDomain=key;
                        }
                    });
                    var title = globalObj.domainTitle[portDomain]?globalObj.domainTitle[portDomain]:portDomain;
                    var herfUrl = portDomain;
                    if(herfUrl&&herfUrl.substring(0,4) !="http"){
                        herfUrl = "http://" + herfUrl;
                    }
                    //var tr = "<tr><td style='width: 30%;text-align: left'><a target='_blank' href='"+herfUrl+"'>"+title+"</a></td><td style='width: 70%;text-align: left' title='"+ json['portServer'][k].join("\n")+"'>"+ v.join()+"</td></tr>";
                    var tr = "<tr><td><a target='_blank' href='"+herfUrl+"'>"+title+"</a></td>";
                    var trTitle="";
                    var arrPoint = [];
                    $.each(json['portServer'][k],function(point,item){
                        var portServer=item.split(":");
                        arrPoint.push(portServer[0]);
                        trTitle+=item+"\n"+portServer[1]+"："+globalObj.serverNode[portServer[1]]+"\n";


                        //var portServer=item.split(":");
                        //var span = "<span title='"+item+"\n"+portServer[1]+"："+globalObj.serverNode[portServer[1]]+"'>"+portServer[0]+",</span>";
                        //if(point==json['portServer'][k].length-1){
                        //    span = "<span title='"+item+"\n"+portServer[1]+"："+globalObj.serverNode[portServer[1]]+"'>"+portServer[0]+"</span>";
                        //}
                        //tr=tr+span
                    });
                    var td = "<td title='"+trTitle+"'>"+arrPoint.join(",")+"</td>";

                    tr=tr+td;
                    $(".highPointTable tbody").append(tr);
                    highnumpoint++;
                });
            }
            $(".highPoint span.num").text(highnumpoint);
            $(".total .survey span").text(highnumpoint);
        });

    },

    //站点故障统计
    siteFault:function(){
        var w = this;
        $(".siteFaultTable tbody").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getSiteFault").success(function(json){
            if(json['code']&&json['data']){
                var i = 0;
                json['data'].sort(function(a,b){
                    return b['count']-a['count'];
                });
                $.each(json['data'],function(key,value){
                        //console.info(value);
                        var title = globalObj.domainTitle[value['data']['domain']]?globalObj.domainTitle[value['data']['domain']]:value['data']['domain'];
                        var tr = "<tr> <td>"+title+"</td> <td>"+value['data']['contineTimeDesc']+"</td> <td>"+value['count']+"</td> </tr>";
                        $(".siteFaultTable tbody").append(tr);
                        i++;
                });

                $(".siteFault span.num").text(i);
            }
        });


    },
    //断网清单（含时间）
    siteFaultlist:function(){
        var w = this;
        $.post(__ROOT__+"/Home/VulsAndValidate/getSiteFaultList").success(function(json){
            //console.info(json);
            if(json&&json['code']){
                $.each(json['data'],function(k,v){
                        if(__function__.timeDifToCur(v[v.length-1]['record_time'])<=500){
                            GovWeb.initModel(v[v.length-1],"站点故障");
                        }
                });
            }
        });
    },

    //指纹
    strutsBug:function(){
        var w = this;
        $(".strutsBugTable tbody").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getFingerprint").success(function(json){
            if(json['code']&&json['rows'].length>0){
                $.each(json['rows'],function(point,item){
                    var msg = [];
                    if(item['msg']&&item['msg']['server']&&item['msg']['server']['version']){
                        item['msg']&&item['msg']['server']&&msg.push(item['msg']['server']['name']+item['msg']['server']['version']);
                    }else{
                        item['msg']&&item['msg']['server']&&msg.push(item['msg']['server']['name']);
                    }
                    item['msg']&&item['msg']['X-Powered-By']&&msg.push(item['msg']['X-Powered-By']);
                    item['msg']&&item['msg']['waf']&&msg.push(item['msg']['waf']);
                    item['msg']&&item['msg']['thirdparty']&&msg.push(item['msg']['thirdparty']['name']);
                    item['msg']&&item['msg']['language']&&msg.push(item['msg']['language']['name']+item['msg']['language']['version']);
                    item['msg']&&item['msg']['os']&&item['msg']['os']!="other"&&msg.push(item['msg']['os']);
                    var title = globalObj.domainTitle[item['domain']]?globalObj.domainTitle[item['domain']]:item['domain'];
                    if(msg&&msg.length>0){
                        var tr = "<tr> <td>"+title+"</td> <td title='"+msg.join()+"'>"+msg.join()+"</td> </tr>";
                        $(".strutsBugTable tbody").append(tr);
                    }
                });
            }

        });

    },

    ////echarts map option
    service_Map:function(domain,mapDate,i,ec){
        var mapOption = __function__.mapOptions();
        mapOption['title']['text']=globalObj.domainTitle[domain]?globalObj.domainTitle[domain]:domain;
        //var mapContainer = $(".mapChart",$("#quality"));
        $.each(mapDate,function(name,value){
            mapOption['series'][0]['data'].push({"name":name,"value":value});
        });
        ec.init(i).setOption(mapOption);

    },
    //初始化echarts容器
    echarts_map:function(){
        var w=this;
        require.config({
            paths: {
                echarts: __ECHART__
            }
        });
        require(
        [
            'echarts',
            'echarts/chart/map'

        ],
        function (ec) {
            w.echartOne = ec;
            w.handle(ec);
            setInterval(function(){
                w.handle(ec);
            },5 * 60 * 1000);

        });
    },
    initHandle: function(){
        var w = this;
        $(".tab-vlus-type-cloud").bind('click',function(){
            if($(this).attr('data') == 1){
                $('.is_show_div').show();
            } else {
                $('.is_show_div').hide();
            }
        });
        $(".page-btn").bind('click',function(){
            var num = $(this).attr('data');
            if(num == 0){
                w.currentPage = 0;
            } else if (num == 2){
                w.currentPage = w.allPage - 1;
            } else if(num == 1) {
                if(w.currentPage == w.allPage - 1){
                    w.currentPage = 0;
                } else {
                    w.currentPage++;
                }
            } else {
                if(w.currentPage == 0){
                    w.currentPage = w.allPage - 1;
                } else {
                    w.currentPage--;
                }
            }
            w.mapQulity(w.echartOne);
        });
    },


    handle:function(ec){
        var w = this;

        $(".nav-tabs li").each(function(point,item){
            $(item).unbind("click").on("click",function(){
                if(point==0){
                    $('.is_show_div').show();
                    w.mapQulity(ec);
                    $(item).unbind("click");
                }
                if(point==1){
                    $('.is_show_div').hide();
                    w.mapFault(ec);
                    $(item).unbind("click");
                }
                if(point==2){
                    $('.is_show_div').hide();
                    w.mapMainSite(ec);
                    $(item).unbind("click");
                }
            });

            if($(item).attr('class')=='active'){
                if(point==0){
                    w.mapQulity(ec);
                    $(item).unbind("click");
                }
                if(point==1){
                    w.mapFault(ec);
                    $(item).unbind("click");
                }
                if(point==2){
                    w.mapMainSite(ec);
                    $(item).unbind("click");
                }

            }
        });
    },
    //
    mapQulity:function(ec){
        var w = this;
        $("#quality").html("");
        $.post(__ROOT__+"/Home/VulsAndValidate/getAllSiteValidate",{currentPage: w.currentPage}).success(function(json){
        //$.post(__ROOT__+"/Home/VulsAndValidate/getDownloadSite",{currentPage: w.currentPage}).success(function(json){
            w.allPage = json.total;
            var i=0;
            $.each(json['data'],function(point,item){
                var mapdiv = '<div class="col-md-3 map"> <div class="mapChart"></div></div>';
                $("#quality").append(mapdiv);
                var mapContainer = $(".mapChart",$("#quality"));
                if(item){
                    GovWeb.service_Map(point,item,mapContainer[i],ec);
                    i++;
                }else{
                    GovWeb.service_Map(point,[],mapContainer[i],ec);
                    i++;
                }
            });
        });
    },
    //map持续故障
      mapFault:function(ec){
          var w = this;
          $("#fault").html("");
          $.post(__ROOT__+"/Home/VulsAndValidate/getAllSiteFault").success(function(json){
              if(json) {
                  var i = 0;
                  $.each(json, function (k, v) {
                      var mapdiv = '<div class="col-md-3 map"> <div class="mapChart"></div></div>';
                      $("#fault").append(mapdiv);
                      var mapContainer = $(".mapChart", $("#fault"));
                      w.service_Map(k, v, mapContainer[i], ec);
                      i++;
                  });
              }

          });

      },

    //重点关注
    mapMainSite:function(ec){
        var w = this;
       $("div.mapDou",$("#monitor")).remove();
        $.post(__ROOT__+"/Home/VulsAndValidate/userMainSites").success(function(json){
            if(json&&json['domains']){
                globalObj.mainSites=json['domains'];
                $.each( globalObj.mainSites,function(point,item){
                    if(item.length>0){
                        var cloneDiv = GovWeb.getMapDiv();
                        $.post(__ROOT__+"/Home/VulsAndValidate/getImportanSite",{'domain':item}).success(function(data){
                            if(data){
                                //$(".select2",$(cloneDiv)).val(item);
                                $("a.add",$(cloneDiv)).hide();
                                $("div.select",$(cloneDiv)).hide();
                                $(".mapChart",$(cloneDiv)).show();
                                $(cloneDiv).attr("value",item);
                                if(data[item]){
                                    GovWeb.service_Map(item,data[item],$(".mapChart",$(cloneDiv))[0],ec);
                                }else{
                                    GovWeb.service_Map(item,[],$(".mapChart",$(cloneDiv))[0],ec);
                                }
                            }
                        });
                    }
                });
            }else{
                globalObj.mainSites=[];
            }
            GovWeb.getMapDiv();
        });

        $(".select2",$("#monitor")).unbind("change").change(function(e){
            e.stopPropagation();
            var w = this;
            var curDomain = $(w).val();
            curDomain!=0&&globalObj.mainSites.push(curDomain);
            if(curDomain&&curDomain!=0){
                $.post(__ROOT__+"/Home/VulsAndValidate/addOrUpdateSites",{'domains':globalObj.mainSites}).success(function(json){
                    if(json['code']){
                        $.post(__ROOT__+"/Home/VulsAndValidate/getImportanSite",{'domain':curDomain}).success(function(data){
                            if(data){
                                $("a.add",$(w).parent().parent()).hide();
                                $("div.select",$(w).parent().parent()).hide();
                                $(".mapChart",$(w).parent().parent()).show();
                                if(data[curDomain]){
                                    GovWeb.service_Map(curDomain,data[curDomain],$(".mapChart",$(w).parent().parent())[0],ec);
                                }else{
                                    GovWeb.service_Map(curDomain,[],$(".mapChart",$(w).parent().parent())[0],ec);

                                }

                                if($($(".mapChart",$("#monitor"))[$(".mapChart",$("#monitor")).length-1]).html()){
                                    GovWeb.getMapDiv();
                                }
                            }
                        });
                    }
                });
            }

        });

        $('#monitor .mapChart').unbind("dblclick").dblclick(function(e){
            e.stopPropagation()
            var w = this;
            $(w).hide();
            $(w).next("a").show();
            var curDomain = $(w).parent(".map").attr("value")?$(w).parent(".map").attr("value"):$(".select2",$(w).parent(".map")).val();
            for(var i=0;i<globalObj.mainSites.length;i++){
                if(globalObj.mainSites[i]==curDomain){
                    globalObj.mainSites.splice(i,1);
                    break;
                }
            }

            $.post(__ROOT__+"/Home/VulsAndValidate/addOrUpdateSites",{'domains':globalObj.mainSites}).success(function(json){
                if(!json['code']){
                    //storm.alertMsg("未修改","danger");
                    return;
                }
            });

            $.each($(".mapChart",$("#monitor")),function(option,item){
                //if(!$(item).html()){
                    $(".select2",$(item).parent(".map")).html("").append("<option value='0'>请选择</option>");
                    $.each(globalObj.domainTitle,function(key,value){
                        if($.inArray(key,globalObj.mainSites)<0){
                            var title = value?value:key;
                            var option = "<option value='"+key+"'>"+title+"</option>";
                            $(".select2",$(item).parent(".map")).append(option);
                            $(".select2",$(item).parent(".map")).select2();
                        }
                    });

                //}
            });

        });

    },

    //
    getMapDiv:function(){
        var w = this;
        var cloneDiv = $($("#monitor div.map")[0]).clone(true).show().addClass("mapDou");
        $("#monitor").append(cloneDiv);
        var domainTitle = globalObj.domainTitle;
        $(".select2",$(cloneDiv)).append("<option value='0'>请选择</option>");
        $.each(domainTitle,function(key,value){
            if($.inArray(key,globalObj.mainSites)<0){
                var title = value?value:key;
                var option = "<option value='"+key+"'>"+title+"</option>";
                $(".select2",$(cloneDiv)).append(option);
            }
        });
        $(".select2",$(cloneDiv)).select2();

        return cloneDiv;

    },

    //告警弹框
    initModel:function(data,warnCenter){
            $("#myModal").modal("hide");
            $(".targetSite",$("#myModal")).text(globalObj.domainTitle[data['domain']]);
            $(".warnCenter",$("#myModal")).text(warnCenter);
            var happend_time = data['startTime']?data['startTime'].split(" ")[1]:data['happen_time'].split(" ")[1];
            $(".warnTime",$("#myModal")).text(happend_time);
            $.post(__ROOT__+"/Home/VulsAndValidate/getImportanSite",{'domain':data['domain']}).success(function(json){
                if(data){
                    var nodeTotal = 0;
                    var nodeUnuseCount = 0;
                    var nodeUnuse=[];
                    $.each(json[data['domain']],function(k,v){
                        nodeTotal++;
                        if((v-0)<0){
                            nodeUnuseCount++;
                            nodeUnuse.push(k);
                        }
                    });

                    $(".availNode",$("#myModal")).text((nodeTotal-nodeUnuseCount)+"/"+nodeTotal);
                    $(".disableNode",$("#myModal")).text(nodeUnuse.join());
                    $("#myModal").modal("show");
                    setTimeout(function(){
                        $("#myModal").modal("hide");
                    },10*1000);
                }
            });
    }


};
var __function__ = {
    mapOptions:function(){
        var option={
            title:{
                show:true,
                text:"",
                x:"center",
                textStyle:{
                    fontSize: 18,
                    fontWeight: 'bolder',
                    color: '#fff'
                }
            },
            //tooltip : {
            //    trigger: 'item'
            //},
            dataRange: {
                show: false,
                textStyle: {
                    color: '#eee'
                },
                x: -10,
                y: 'bottom',
                calculable: false,
                splitList: [
                    {start: 0, end: 300, color: 'green',label: '0~0.3秒'},
                    {start: 300, end: 1000, color: '#b36715',label: '0.3~1秒'},
                    {start: 1000, end: 10000, color: '#f9e400',label: '1~10秒'},
                    {start: 10000, color: 'grey',label: '>10秒'},
                    {end: 0, color: 'red',label: '无法访问'}
                ]
            },

            series : [
                {
                    name: '全国地图',
                    type: 'map',
                    mapType: 'china',
                    //hoverable:false,
                    //selectedMode : 'single',
                    showLegendSymbol:false,
                    itemStyle:{
                        normal: {
                            borderColor: 'rgba(19, 105,167, 1)',
                            borderWidth:.5,
                            areaStyle: {
                                color: 'rgba(2, 89,255, .2)'
                            }
                        }


                    },
                    data:[

                    ]
                }
            ]
        }
        return option;
    },
    timeDifToCur:function(time){
        var curDate = new Date();
        var curHour = curDate.getHours().toString();
        var curMinute = curDate.getMinutes().toString()=="0"?"00":curDate.getMinutes().toString().length<2?"0"+curDate.getMinutes().toString():curDate.getMinutes().toString();
        var curSecond = curDate.getSeconds().toString()=="0"?"00":curDate.getSeconds().toString().length<2?"0"+curDate.getSeconds().toString():curDate.getSeconds().toString();
        var targetTime = time.split(" ");

        return parseInt(curHour+curMinute+curSecond)-parseInt(targetTime[1].replaceAll(":",""));
    }

};
var globalObj = {
    "domainTitle": $.parseJSON($("#domainTitle").text()),
    "serverNode": $.parseJSON($("#serviceNote").text()),
    "highSitCount":0,
    "mainSites":[],
    "echartsEc":null,
    "intervals":{
        "warnPrompt":300*1000,
        "serviceNode":300*1000,  //服务质量下降站点数据刷新时间
        "highDanger":300*1000,   //高中风险站点分布
        "siteFault":300*1000,    //站点故障统计
        "highPoint":300*1000,    //高危端口分布
        "strutsBug":300*1000,     //远程代码漏洞
        "echarts_map":300*1000    //站点服务质量map数据
    }
}
$(function(){
    GovWeb.init();
});