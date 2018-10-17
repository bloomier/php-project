var GovWeb = {
    init:function(){
        var w = this;
        w.DDOSAttackRecord();
        w.DDOSAttackSource();
        w.DDOSAttackGoal();
        w.untreatedHighWarn();
        w.getZabbix24Count();
        setInterval(function(){
            w.DDOSAttackRecord();
            w.untreatedHighWarn();
            w.getZabbix24Count();
        },300*1000);

    },

    //DDOS攻击记录24小时
    DDOSAttackRecord:function(){
        var w = this;
        $(".DDOSAttackRecord tbody").html("");
        $.post(__ROOT__+"/Home/ColonyNode/DDOSAttackRecord").success(function(json){
            var num=0;
            if(json['code']){
                $.each(json['rows'],function(point,item){
                    if(point<10){
                        //var dataTime = item['date'].split(" ");
                        //var time = dataTime[1].substring(0,dataTime[1].lastIndexOf(":"));
                        var targetNode=null;
                        $.each(wafServerIp,function(k,v){
                            if($.inArray(item['targetIp'], v.split(","))>=0){
                                targetNode=k+"_"+item['targetIp'];
                            }
                        });
                        targetNode=targetNode?targetNode:item['targetIp'];
                        var time=item['date'].substring(item['date'].indexOf("-")+1,item['date'].lastIndexOf(":"));
                        var tr = "<tr> <td>"+time+"</td> <td>"+item['sourceIp']+"</td> <td title='"+targetNode+"'>"+targetNode+"</td> </tr>"
                        $(".DDOSAttackRecord tbody").append(tr);
                        num++;
                    }
                });
            }
        });
    },

    //DDOS攻击源分布
    DDOSAttackSource:function(){
        var w=this;
        var attackSourceRank=function(){
            w.flowRankScoller= $("tbody",$('#attack-now')).itemScoller({
                ajaxUrl:__ROOT__+"/Home/ColonyNode/DDOSAttackSource",
                items:"rows",
                key:"name",
                value:"value",
                refresh_interval:GlobalObj._intervals.attackSourceRefresh,//刷新间隔
                interval:GlobalObj._intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var config = true;
                    var max=json['totalCount'];
                    var pecent=(item['count']*100/max).toFixed(2);
                    var title=null;
                    $.each(wafServerIp,function(k,v){
                        if($.inArray(item['targetIP'], v.split(","))>=0){
                            title=k+"_"+item['targetIP'];
                        }
                    });
                    title=title?title:item['targetIP'];

                    //var el = $(" <tr><td>"+item['sourceIP']+"</td>"+
                    //"<td><div class='progress'><div class='progress-bar' style='width: "+pecent+"%;'><span>"+title+"</span></div></div></td>"+
                    //+"</tr>");

                    var el=$('<tr> <td>'+item['sourceIP']+'</td> <td>'+title+' </td> <td> <div class="progress">'
                        +'<div class="progress-bar" style="width: '+pecent+'%;"> <span>'+item['count']+'次</span> </div>'
                        +'</div> </td> </tr>');
                    if(config){
                        $(".DDOSAttackSource span.num").text(json['rows'].length);
                        config = false;
                    }
                    return el;
                },
                compare:function(v1,v2){
                    return v2>v1?true:false;//降序排列
                }
            });
        };

        attackSourceRank();

    },

    //DDOS攻击目标分布
    DDOSAttackGoal:function(){
        var w = this;
        var attackGoalRank=function(){
            w.flowRankScoller= $("tbody",$('#visit-now')).itemScoller({
                ajaxUrl:__ROOT__+"/Home/ColonyNode/DDOSAttackGoal",
                items:"rows",
                key:"name",
                value:"value",
                refresh_interval:GlobalObj._intervals.attackSourceRefresh,//刷新间隔
                interval:GlobalObj._intervals.sortInterval,//排序间隔
                draw:function(index,item,json){
                    var config = true;
                    var title=null;
                    $.each(wafServerIp,function(k,v){
                        if($.inArray(item['targetIp'], v.split(","))>=0){
                            title=k+"_"+item['targetIp'];
                        }
                    });
                    title=title?title:item['targetIp'];
                    var max=json['totalCount'];
                    var pecent=(item['count']*100/max).toFixed(2);
                    var el = $(' <tr> <td>'+title+' </td> <td> <div class="progress"> <div class="progress-bar" style="width: '+pecent+'%;">'
                    +'<span>'+item['count']+'次</span> </div> </div></td></tr>');

                    if(config){
                        $(".DDOSAttackGoal span.num").text(json['rows'].length);
                        $(".total .survey span").text(json['totalCount']);
                        config = false;
                    }
                    return el;
                },
                compare:function(v1,v2){
                    return v2>v1?true:false;//降序排列
                }
            });
        };

        attackGoalRank();

    },

    //未处理高级别告警
    untreatedHighWarn:function(){
        var w = this;
        $(".untreatedHighWarn tbody").html("");
        $.post(__ROOT__+"/Home/ColonyNode/untreatedHighWarn").success(function(json){
            if(json['code']){
                GlobalObj._wafWarnMsg={};
                $.each(json['rows'],function(point,item){
                    if(item['severity']>=3){
                        var dateTime = new Date(item['latestAlertTime']*1000);
                        var hour = dateTime.getHours();
                        var minu = dateTime.getMinutes();
                        var second = dateTime.getSeconds();
                        var time = __function__.secondTodate(item['duration']);
                        var tr = '<tr name="'+item['severity']+'"> <td>'+hour+':'+minu+':'+second+'</td> <td>'+item['nodeName']+'</td> <td>'+item['ip']+'</td>'
                            +'<td title="'+item['message']+'">'+item['message']+'</td> <td>'+time+'</td> </tr>'
                        $(".untreatedHighWarn tbody").append(tr);
                        var wafWarnMsg={};
                        wafWarnMsg['severity'] = item['severity'];
                        wafWarnMsg['msg']=item['message'];
                        GlobalObj._wafWarnMsg[item['ip']]=wafWarnMsg;

                    }
                    //GlobalObj._wafWarnMsg[item['ip']]['severity'] = item['severity'];
                    //GlobalObj._wafWarnMsg[item['ip']]['msg']=item['message'];

                });


                $("tr[name='5']",$(".untreatedHighWarn")).addClass("c-red");
                $("tr[name='4']",$(".untreatedHighWarn")).addClass("c-orange");
                $("tr[name='3']",$(".untreatedHighWarn")).addClass("c-yellow");

                GovWeb.wafGroupWarn(GlobalObj._wafWarnMsg);
            }
        });
    },
    //24小时内告警统计
    getZabbix24Count:function(){
        var w = this;
        $(".getZabbix24Count tbody").html("");
        $.post(__ROOT__+"/Home/ColonyNode/getZabbix24Count").success(function(json){
            if(json['code']){
                $.each(json['rows'],function(point,item){

                    //var tr = '<tr><td>'+item['groupName']+'</td> <td>'+item['disaster']+'</td> <td>'+item['high']+'</td>'
                    //+'<td>'+item['average']+'</td> </tr>';
                    var disaster =item['disaster']==0?"":"label bg-red";
                    var high =item['high']==0?"":"label bg-orange";
                    var average =item['average']==0?"":"label bg-yellow";
                    var tr = '<tr><td>'+item['groupName']+'</td> ' +
                    '<td><span class="'+disaster+'">'+item['disaster']+'</span></td>'+
                    '<td><span class="'+high+'">'+item['high']+'</span></td>'+
                    '<td><span class="'+average+'">'+item['average']+'</span></td> </tr>';
                    $(".getZabbix24Count tbody").append(tr);
                });

            }
        });



    },

    //WAF集群实时状态监测告警
    wafGroupWarn:function(wafWarn){
        $.each(wafWarn,function(k,v){
            $.each(wafServerIp,function(key,value){
                var ips = value.split(",");
                if($.inArray(k,ips)>=0){
                    var flig = key+"_"+k;
                    if(v['severity']==5){
                        $("rect[name='"+flig+"']").length>0&&$("rect[name='"+flig+"']").attr("fill","red") ||$("rect[name='"+key+"']").attr("fill","red");
                        //$("rect[name='"+key+"']").attr("fill","red");
                        //setTimeout(function(){
                        //    $("rect[name='"+key+"']").attr("fill","green");
                        //},3000);

                        if($.inArray(key,bigDataGroup)>=0){
                            $(".total .site span").text("异常");
                            $(".total .site span").removeClass("c-green").addClass("c-red");
                        }else{
                            $(".total .site span").text("正常");
                        }
                    }
                    if(v['severity']==4){
                        $("rect[name='"+flig+"']").length>0&&$("rect[name='"+flig+"']").attr("fill","orange")||$("rect[name='"+key+"']").attr("fill","orange");
                        //$("rect[name='"+key+"']").attr("fill","orange");
                        //setTimeout(function(){
                        //    $("rect[name='"+key+"']").attr("fill","green");
                        //},3000);
                    }
                    if(v['severity']==3){
                        ($("rect[name='"+flig+"']").length>0&&$("rect[name='"+flig+"']").attr("fill","yellow")) || $("rect[name='"+key+"']").attr("fill","yellow");
                        //$("rect[name='"+key+"']").attr("fill","yellow");
                        //setTimeout(function(){
                        //    $("rect[name='"+key+"']").attr("fill","green");
                        //},3000);
                    }

                    $("rect[name='"+key+"']").attr("title",v['msg']);
                }
            });
        });
    }


}

var __function__ = {
    secondTodate:function(second){
        var day,hour,minu;
        var remainder = second;
        var result="";
        if(remainder/60/60/24>=1){
            day=Math.floor(second/60/60/24);
            remainder=second%(60*60*24);

            result=day+"d ";
        }
        if(remainder/60/60>=1){
            hour=Math.floor(remainder/60/60);
            remainder=remainder%(60*60);
            if(hour<10){
                if(day){
                    result=result+"0"+hour+"h ";
                }else{
                    result=result+hour+"h ";
                }
            }else{
                result=result+hour+"h ";
            }
        }
        if(remainder/60>=1){
            minu=Math.floor(remainder/60);
          if(minu<10){
              if(hour){
                  result=result+"0"+minu+"m ";
              }else{
                  result=result+minu+"m ";
              }

          }else{
              result=result+minu+"m ";
          }
        }else{
            result = remainder+"s";
        }



        return result;
    }
};

var GlobalObj = {
    _intervals:{
        attackSourceRefresh:60*1000,
        sortInterval:500
    },
    _wafWarnMsg:{}
}

$(function(){
    GovWeb.init();
});