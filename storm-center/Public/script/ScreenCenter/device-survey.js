/**
 * Created by jianghaifeng on 2015/11/13.
 */
(function(){
    var _intervals={
        filterAttackRefresh:60*1000,//拦截攻击次数
        deviceHelthRefresh:60*1000,//设备的刷新时间
        deviceLogNumRefresh: 60 * 1000, //设备日志条数刷新时间
        warningMsgRefresh: 60 * 1000, //设备日志条数刷新时间
        warningSpecial:5*1000 //告警特效持续时间
    };
    var _thresholds={
        flow_mid:[5,10],//kb/s
        disk_mid:[50,80],//残余风险的定义级别(多少级以上定义为残余风险)
        cpu_mid:[50,80],//主机健康cpu阈值
        memory_mid:[50,80]//主机健康内存阈值
    };
    var deviceColor={
        1:"#14d673",
        2:"orange",
        3:"red"
    };
    var deviceWarn = {};

    var currentIndex;
    var dataText;
    var typetypet;
    var warnningFlag = false;
    //var attackLevel = {
    //    0:{text:'低',color:'yellow'},
    //    1:{text:'低',color:'yellow'},
    //    2:{text:'低',color:'yellow'},
    //    3:{text:'低',color:'yellow'},
    //    4:{text:'中',color:'orange'},
    //    5:{text:'中',color:'orange'},
    //    6:{text:'中',color:'orange'},
    //    7:{text:'中',color:'orange'},
    //    8:{text:'高',color:'red'},
    //    9:{text:'高',color:'red'},
    //    10:{text:'高',color:'red'},
    //    11:{text:'高',color:'red'},
    //    12:{text:'高',color:'red'}
    //
    //}
    var __functions__={
        runFilterCount:function(prev,current){
            var obj=$(".filter-count");
            startCount(obj,{
                from:prev,
                to:current,
                speed:_intervals.filterAttackRefresh
            });
        },

        warnningMsg:function(){
            currentIndex = 0;
            typetypet = setInterval(function(){
                if(warnningFlag){
                    $(".alert-modal-body").html(dataText.substring(0,currentIndex));
                    if(currentIndex++ >= dataText.length){
                        clearInterval("typetypet");
                        warnningFlag = false;
                    }
                }
            },100);
        },

        setDeviceHealthColor:function(obj,value,threshold){
            var warning=0;
            var n1=threshold[0];
            var n2=threshold[1];
            var color=deviceColor[1];
            if(value>=n1&value<n2){
                color=deviceColor[2];
                warning=1;
            }else if(value>=n2){
                color=deviceColor[3];
                warning=2;
            }
            obj.css("color",color);
            return warning;
        },
        setPointAngle:function(obj,value){
            obj.css("transform","rotate("+value+"deg)");
            obj.css("-webkit-transform","rotate("+value+"deg)");
            obj.css("-moz-transform","rotate("+value+"deg)");
            obj.css("-ms-transform","rotate("+value+"deg)");
            obj.css("-o-transform","rotate("+value+"deg)");
        },
        getFlag:function(location){
            var flag="default";
            if($.inArray(location,__PROVINCES__)!=-1 || "中国" == location){
                flag="中国";
            }
            if(countryReflects[location]&&countryReflects[location]['f']){
                flag= countryReflects[location]['f'];
            }else if(countryReflects[location]){
                flag=location;
            }
            return flag;

        }

    };
    var app={
        init:function(){
            var w=this;
            w.config.call(w);
            w.deviceDraw.call(w);
            w.signalDraw.call(w);
            w.loadClock.call(w);
            w.defense.call(w);
            w.deviceHealth.call(w);
         //w.countryFlag.call(w);

            // w.deviceAlert.call(w);

            w.showDeviceLogNum.call(w);
            w.getWarningMsg.call(w);


        },
        config:function(){
            var w=this;
            var cloudKey = $("#cloudKey").val();
            if(!socConf[cloudKey]){
                cloudKey=socSimpleKey[cloudKey];
            }
            $("title").html(cloudKey);
            $("h1",$(".header")).html(cloudKey);
            w.deviceGroup=deviceGroup[cloudKey]||{};
            w.deviceConf=socConf[cloudKey]['deviceConf'];
        },
        signalDraw:function(){
            var w=this;
            //sinal1
            (function(){
                var signal=$(".signal1");
                //signal.css("height",30);
                var left=$(".visit-area").position().left+$(".visit-area").width();
                signal.css("left",left);
                var top=$(".visit-area").position().top+$(".visit-area").height()/2-signal.height()/2;
                signal.css("top",top);
                var right=$(".protect-area").position().left;
                signal.css("width",right-left+10);

            })();
            //sinal2
            (function(){
                var signal=$(".signal2");
                //signal.css("height",30);
                var left=$(".protect-area").position().left+$(".protect-area").width();
                signal.css("left",left-10);
                var top=$(".protect-area").position().top+$(".protect-area").height()/2-signal.height()/2;
                signal.css("top",top);
                var right=$(".apply-area").position().left;
                signal.css("width",right-left+20);

            })();
          //  sinal3
            (function(){
                var signal=$(".signal3");
                //signal.css("width",22);
                var left=$(".apply-area").position().left+40;
                signal.css("left",left);
                var top=$(".apply-area").position().top+$(".apply-area").height();
                signal.css("top",top-10);
                var bottom=$(".data-area").position().top;
                var merge=$(".title",$(".data-area")).height()+8;//8px是marning的值
                signal.css("height",bottom-top+merge+20);

            })();
        },
        deviceDraw:function(){
            var w=this;
            $.each(w.deviceGroup,function(k,v){
                 var wraper=$(".wraper-"+k);
                $.each(v,function(i,device){
                    var _wrap=$(".dev_"+i,wraper);
                    var img=__PUBLIC__+"/image/screen/"+device.icon;
                    var html;
                    if(device.type=='group'){
                        html=$("<img src='"+img+"'/>");
                    }else{
                        html=$("<img src='"+img+"'/><div class='text02' >"+device.name+"</div>");

                    }
                    _wrap.append(html);
                    _wrap.attr("value",device['keys']);
                    //_wrap.on("click",function(){
                    //    myModalkey=device['keys'];
                    //    $("#myModal").modal("show");
                    //});

                });
            })
        },
        loadClock:function(){
            var w=this;
            $.post(__ROOT__+"/ScreenCenter/DeviceSurvey/getRunningTime",{"key": $("#cloudKey").val()}).success(function(json){
                    var second=json.other||0;
                    w.clock=$("#clock").clock();
                    w.clock.load.call(w.clock,second);


            });
        },
        defense:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/ScreenCenter/DeviceSurvey/defense",{keys: w.deviceConf['keys'],point:1440}).success(function(json){
                    if(json.code>0){
                        if(w.currentAttack){
                            w.prevAttack= w.currentAttack;
                        }else{
                            w.prevAttack=0;
                        }
                        w.currentAttack=json.data.attack;
                        if(w.currentAttack< w.prevAttack){
                            w.currentAttack= w.prevAttack;
                        }
                        __functions__.runFilterCount(w.prevAttack, w.currentAttack);
                    }

                });
            }
            start();
            setInterval(start,_intervals.filterAttackRefresh);
        },
        deviceHealth:function(){
            var w=this;
            var start=function(){
                $.post(__ROOT__+"/ScreenCenter/DeviceSurvey/health").success(function(json){
                    if(json.hostinfo){
                        var data=json.hostinfo;
                        var i=0;
                        $.each(data,function(k,info){
                            var level=0;

                            $(".r-device-name",$(".device-info-"+i)).text(k);

                            //$(".info-flow",$(".device-info-"+i)).text((info.io).toFixed(2));
                            if(info.io > 1024){
                                $(".info-flow",$(".device-info-"+i)).html((info.io / 1024).toFixed(2) + "<i>m/s</i>");
                            }else{
                                $(".info-flow",$(".device-info-"+i)).html(info.io + "<i>k/s</i>");
                            }
                            level+= __functions__.setDeviceHealthColor( $(".info-flow",$(".device-info-"+i)),(info.io / 1024),_thresholds.flow_mid);

                            $(".info-cpu",$(".device-info-"+i)).text(info.cpu);
                            level+=__functions__.setDeviceHealthColor( $(".info-cpu",$(".device-info-"+i)),info.cpu,_thresholds.cpu_mid);


                            $(".info-memory",$(".device-info-"+i)).text(info.memery);
                            level+=__functions__.setDeviceHealthColor( $(".info-memory",$(".device-info-"+i)),info.memery,_thresholds.memory_mid);

                            $(".info-disk",$(".device-info-"+i)).text(info.disk);
                            level+=__functions__.setDeviceHealthColor( $(".info-disk",$(".device-info-"+i)),info.disk,_thresholds.disk_mid);
                            var angle=level*42.5-130;

                            //通过level控制指针
                            __functions__.setPointAngle($(".r-chart-pointer",$(".device-info-"+i)),angle);
                            i++;
                        });
                    }

                });
            }
            start();
            setInterval(start,_intervals.deviceHelthRefresh);

        },
        countryFlag: function(){/*外部访问区 不同国家访问显示*/
            var w =this;

            setInterval(function(){
                $.ajax({
                    url: __ROOT__+'/ScreenCenter/CloudMonitor/visitAreaTopN?keys=deviceId_160030,deviceId_160033,deviceId_160036,deviceId_160039',
                    type: 'get',
                    dataType: 'json',
                    success: function(json){

                        $('.visit-country').html(' ');
                        for (var i = 0; i < 5; i++) {
                            $('.visit-country').append(' <img class="ani-img" src="' + __PUBLIC__ + '/image/attack-src/'+ __functions__.getFlag(json.dataList[i].name)+'.png" alt=""/>');
                            $('.visit-country img').css(
                                'margin-left', Math.random()*50+'%'
                            )

                        }
                    }
                });
            },10000);

        },
        deviceAlert: function(){ /*某一个设备告警效果展示*/
            var w = this;
            //    判断条件 将deviceGroup增加个status字段，有且值为1（0正常1告警），触发告警

            //需要增加效果的地方，确定DOM节点，然后添加

            //火焰效果
           /* var el='<img class="fire-img" src="'+__PUBLIC__+'/image/screen/fire.png" alt=""/>';

            $('.manage-area .thumbnail.dev_0').append(el);*/

            //红色告警效果
            // $('.protect-area .thumbnail.dev_0').addClass('bg03');

            // 告警消息数
            var numEl = '<div class="alert-num"></div>';

            $('.protect-area .thumbnail.dev_0').append(numEl);
            $('.protect-area .thumbnail.dev_0 .alert-num').text('999');

            var deviceNum = '<div class="device-num"><i>x</i><i class="num"></i> </div>'

            $('.protect-area .thumbnail.dev_0').append(deviceNum);
            $('.protect-area .thumbnail.dev_0 .device-num i.num').text('2');

        },
        showDeviceLogNum: function(){
            var w=this;
            var data = {
                "keys": w.getAllKeys
            }
            var refreshDeviceLogNum = function(){
                $.ajax({
                    url: __ROOT__+'/ScreenCenter/DeviceSurvey/getDeviceLogNum',
                    type: 'get',
                    dataType: 'json',
                    data: data,
                    success: function(json){
                        if(json.code){
                            $(".alert-num").remove();
                            $.each(w.deviceGroup,function(k,v){
                                var wraper=$(".wraper-"+k);
                                $.each(v,function(i,device){
                                    var _wrap=$(".dev_"+i,wraper);
                                    var num = w.getLogNumByKeys(json.data,device.keys);
                                    if(num > 0&&num<99999){
                                        var numEl = '<div class="alert-num">' + num + '</div>';
                                        _wrap.append(numEl);
                                    }
                                    if(num>=99999){
                                        var numEl = '<div class="alert-num">99999<i>+</i></div>';
                                        _wrap.append(numEl);
                                    }
                                    if(num){
                                        _wrap.css("cursor","pointer");
                                        _wrap.unbind("click");
                                        _wrap.on("click",function(){
                                            var myModalkey=device['keys'];
                                            //$("#myModal").modal("show");
                                            w.initMyModal(myModalkey);
                                            $(".modal-title").html($(".text02",$(this)).text()+"设备详情");

                                        });
                                    }
                                });
                            })
                        }
                    }
                });
            }

            refreshDeviceLogNum();
            setInterval(refreshDeviceLogNum,_intervals.deviceLogNumRefresh);


        },
        getAllKeys: function(){
            var w = this;
            var keys = "";
            $.each(w.deviceGroup,function(k,v){
                $.each(v,function(i,device){
                    $.each(device,function(j,one){
                        keys += one['keys'] + ","
                    })
                });
            })
            return keys;
        },
        getLogNumByKeys: function(json,keys){
            var keysArr = new Array(); //定义一数组
            var num = 0;
            var tmpNum = 0;
            keysArr = keys.split(","); //字符分割
            for (var i=0; i<keysArr.length;i++ ){
                tmpNum = json[keysArr[i]] ? json[keysArr[i]] : 0;
                num += tmpNum;
            }
            return num;
        },
        getWarningMsg: function(){
            var w=this;
            var data = {
                "keys": w.getAllKeys
            }
            var refreshWarningMsg = function(){
                $.ajax({
                    url: __ROOT__+'/ScreenCenter/DeviceSurvey/getWarningMsg',
                    type: 'get',
                    dataType: 'json',
                    data: data,
                    success: function(json){
                        w.initTables(json);
                        w.deviceMsgData(json);
                    }
                });
            }
            refreshWarningMsg();
            setInterval(refreshWarningMsg,_intervals.warningMsgRefresh);
        },
        initTables: function(items){
            //console.info(items);
            var w = this;

            $(".waf-items").html("");
            for(var i=items.length-1;i>=0;i--){
                var item=items[i];
                var severity=item.severity;
                var url=item.requestUrl;
                var srcRegion=item.srcGeoRegion;
                if(srcRegion.length>3){
                    srcRegion=srcRegion.substr(0,3);
                }
                url = url.length > 20 ? "..." + url.substr(url.length - 20 ,url.length) : url;
                var protocal=item.name||item.appProtocol;
                if(protocal.indexOf('扫描目录') ==0){
                    protocal='扫描目录';
                }

                var tr=$("<tr class='s-alert' value='"+i+"'>" +
                "<td>" + item.deviceName + "</td>" +
                "<td>" + url + "</td>"+
                // "<td >" + w.formatTime(item.collectorReceiptTime) + "</td>"+
                "<td >" + item.srcAddress + "</td>"+
                "<td >" + (spec[item.srcAddress]?spec[item.srcAddress]:srcRegion) + "</td>"+
                //"<td>"+$('<div/>').text(url).html()+"</td>"+
                "<td>" + protocal + "</td>" +
                //"<td>"+(attackLevel[severity]['text']||"低")+"</td>" +
                "</tr>");
                //$("td",tr).css("color",attackLevel[severity]['color']||"green");
                tr.appendTo($(".waf-items"));

            }

            $('.alert-modal').height($('#info-grid').height());

            $(".waf-items tr").click(function(e){
                var dataNum = $(this).attr("value");
                var dataMsg = items[dataNum];
                var harmlevel = dataMsg['severity']>5?"高危":dataMsg['severity']>3?"中危":"低危";
                var srcGeoRegion = spec[dataMsg.srcAddress]?spec[dataMsg.srcAddress]:dataMsg['srcGeoRegion'];
                e.stopPropagation();
                $('.alert-modal').show();


                /*"来自"+dataMsg['srcGeoRegion']+"的"+dataMsg['srcAddress']+"，在"+dataMsg['collectorReceiptTime']+
                "攻击了"+dataMsg['deviceName']+"的"+dataMsg['requestUrl']+"，该攻击类型为"+dataMsg['name']+
                ",危害等级为"+harmlevel*/
                //$('.alert-modal-body p span:eq(0)').html("").delay(1000).typetype('来自'+dataMsg['srcGeoRegion']+"的"
                //    ,{
                //        e: 0,
                //        t: 300
                //       /* callback: function(){
                //            $('.alert-modal-body p span:eq(1)').html("").typetype(dataMsg['srcGeoRegion'],{
                //                    e: 0,
                //                    t: 300
                //            }
                //               )
                //        }*/
                //    }
                //)
                //$('.alert-modal-body p span:eq(1)').html("").delay(1010).typetype(dataMsg['srcAddress'],{
                //    e: 0,
                //    t: 300
                //})
                //$('.alert-modal-body p span:eq(2)').html("").delay(1020).typetype("，在"+dataMsg['collectorReceiptTime']+
                //"攻击了"+dataMsg['deviceName']+"的"+dataMsg['requestUrl']+"，该攻击类型为",{
                //    e: 0,
                //    t: 300
                //})
                //$('.alert-modal-body p span:eq(3)').html("").delay(1030).typetype(dataMsg['name'],{
                //    e: 0,
                //    t: 300
                //})
                //$('.alert-modal-body p span:eq(4)').html("").delay(1040).typetype(",危害等级为",{
                //    e: 0,
                //    t: 300
                //})
                //$('.alert-modal-body p span:eq(5)').html("").delay(1050).typetype(harmlevel,{
                //    e: 0,
                //    t: 300
                //})


               dataText = "来自"+dataMsg['srcGeoRegion']+"的<span class = 'alert-data'>"+dataMsg['srcAddress']+"</span>，在"+dataMsg['collectorReceiptTime']+
                    "攻击了"+dataMsg['deviceName']+"的"+dataMsg['requestUrl']+"，该攻击类型为<span class = 'alert-data'>"+dataMsg['name']+
                    "</span>,危害等级为<span class = 'alert-data'>"+harmlevel+"</span>";

                warnningFlag = true;

            });
            $('.alert-modal').click(function(){
                $('.alert-modal').hide();
                clearInterval("typetypet");
                currentIndex = 0;
                dataText="";
                warnningFlag = false;
                $(".alert-modal-body").html("");
            });



        },
        //设备告警特效
        deviceMsgData:function(json){
            var w=this;
            deviceWarn={};
            $.each(json,function(point,item){
               if(item['severity']>5){
                   var key = "deviceId_"+item['deviceId'];
                   deviceWarn[key] = 1;
               }
            });
            $(".device-num").remove();
            $.each(w.deviceGroup,function(k,v){
                var wraper=$(".wraper-"+k);
                $.each(v,function(i,device){
                    var _wrap=$(".dev_"+i,wraper);
                    if(device['num']>1){
                        var deviceNum = '<div class="device-num"><i>x</i><i class="num">'+device['num']+'</i> </div>'
                        _wrap.append(deviceNum);
                        //$('.device-num i.num',_wrap).text(device['num']);
                    }
                    var key = device['keys'].split(",");
                    if(deviceWarn[key[0]] || deviceWarn[key[1]]){
                        //_wrap.addClass("bg03");
                        //_wrap.addClass("shake5");
                        if(k == "defense"){
                            _wrap.addClass("bg03");
                            _wrap.addClass("shake5");
                            $(".signal1").removeClass("sign-h-success").addClass("sign-h-info");
                        }
                        //if(k == "application"){
                        //    $(".signal2").removeClass("sign-h-success").addClass("sign-h-info");
                        //}
                        //if(k == "datacenter" || k == "operation"){
                        //    $(".signal1").removeClass("sign-h-success").addClass("sign-h-info");
                        //    $(".signal2").removeClass("sign-h-success").addClass("sign-h-info");
                        //    $(".signal3").removeClass("sign-v-success").addClass("sign-v-info");
                        //}
                        setTimeout(function(){
                            _wrap.removeClass("bg03");
                            _wrap.removeClass("shake5");
                            if(k == "defense"){
                                $(".signal1").removeClass("sign-h-info").addClass("sign-h-success");
                            }
                            //if(k == "application"){
                            //    $(".signal2").removeClass("sign-h-info").addClass("sign-h-success");
                            //}
                            //if(k == "datacenter" || k == "operation"){
                            //    $(".signal1").removeClass("sign-h-info").addClass("sign-h-success");
                            //    $(".signal2").removeClass("sign-h-info").addClass("sign-h-success");
                            //    $(".signal3").removeClass("sign-v-info").addClass("sign-v-success");
                            //}
                        },_intervals.warningSpecial);

                    }
                });
            })

        },
        initMyModal:function(event){
            $("#myModal").modal("show");
            $.post(__ROOT__+"/ScreenCenter/DeviceSurvey/getLastestTenLogs",{"keys":event}).success(function(json){
                $(".m-info","#myModal").html("");
                var flag = false;
                var key = event.split(",");
                $.each(key,function(point,item){
                    var i = 0;
                    if(json['data'][item] && json['data'][item] != 0){
                        flag = true;
                        $.each(json['data'][item],function(k,v){
                            if(i<10){
                                $(".m-info","#myModal").append("<p>"+v+"</p>");
                            }
                            i++;
                        });
                    }
                });
                if(!flag){
                    $(".m-info","#myModal").html("<p>暂未数据</p>");
                }
            });

        },
        formatTime: function(time){
            return time.substr(11,time.length-1);
        },


        scroll:function(dom){
            var y = 0;
            var innerEl = $('#'+dom);
            var rollEl = innerEl.parent();
            var waitEl = innerEl.clone(true).removeAttr('id');
            rollEl.append(waitEl);
            var time;
            function start(){
                time = setInterval(function(){
                    y = y - 0.2;
                    innerEl.css({
                        top: y
                    });
                    waitEl.css({
                        top: y + innerEl.height()
                    });

                    if(y * -1 > innerEl.height()){
                        y = 0;
                        var tmp = innerEl;

                        innerEl = waitEl;
                        waitEl = tmp;
                    }
                },20);
            }
            function stop(){
                clearInterval(time);
            }

            rollEl.mouseover(function(e){
                e.stopPropagation();
                //console.info('over')
                stop();
            });
            rollEl.mouseout(function(e){
                e.stopPropagation();
                //console.info('out')
                start();
            });
            start();

        }

    }

    $(document).ready(function(){
        app.init();
        app.scroll('info');
        __functions__.warnningMsg();

    });

})();
