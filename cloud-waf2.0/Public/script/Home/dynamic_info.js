(function(){

    var config;//域和用户的基础属性用户
    var appConfig={
        currentLocation:null,
        prevLocation:null,
        animation:"a-flipinY a-flipinX a-bounceinR a-bounceinL a-fadeinR a-fadeinL",
        vuls_level_name_mapper:{
            "high":"高危",
            "mid":"中危",
            "low":"低危",
            "info":"信息",
            "safe":"安全"
        },
        vuls_level_color:{
            "high": '#F0412E',
            "mid":"#F1922C",
            "low":"#FDE866",
            "info":"#2CCB71",
            "safe":"#2CCB71"
        },
        visit_state_mapper:{
            "-1":"请求无响应",
            "-2":"资源找不到",
            "-3":"服务异常",
            "-4":"僵尸站点"
        },
        fingerNameMapper:{
            os:"操作系统",
            thirdparty:"第三方组件",
            waf:"waf",
            framework:"框架",
            webapp:"cms",
            frontend:"前端框架",
            server:"web容器",
            component:"其他组件"

        }
    }
    var app={
        init:function(){

            var w=this;
            var conf= $.parseJSON($("#config").text());
            config=conf['config'];
            view.prepare.call(w,function(){
                event.jump_to_location.call(w,{type:config.type,value:config.root_value});
                handler.init.call(w);
                $(".auto-play").bind("click",function(){
                    if(!w.autoPlaying){
                        autoPlay.start.call(w);
                        w.autoPlaying=true;
                    }else{
                        location.href= location.href;
                    }


                });


            });
        },
        data:{ }

    };
    var __function__={
        cutstr:function(str,len){
            if(str.length>len){
                return str.substr(0,len)+"...";
            }else{
                return str;
            }
        },
        getCurrentMapType:function(){
            var current=appConfig.currentLocation;
            var type=current.type;
            if(type=='china'){
                return "china";
            }
            var value=current.value;
            var tmp=value.split("_");
            if(tmp.length>=2){
                return tmp[1];
            }else{
                return tmp[0];
            }
            //return tmp[tmp.length-1];

        },
        getCurrentTitle:function(){
            var current=appConfig.currentLocation;
            var type=current.type;
            if(type=='china'){
                return "全国";
            }
            var value=current.value;
            var tmp=value.split("_");
            return tmp[tmp.length-1];

        },
        sortMapData:function(json){
            var arr=[];
            $.each(json,function(k,v){
                arr.push({name:k,value:v});
            });
            arr.sort(function(a,b){
               return b.value- a.value;
            });
            return arr;

        },
        overlay:function(show){
            if(show){
                $("#overlay").show();
            }else{
                $("#overlay").hide();
            }

        },
        getZeroRank:function(areaRank){
            var arr=[];
            if(areaRank){
                $.each(areaRank,function(area,num){
                    arr.push({name:area,value:num});
                });
                arr.sort(function(a,b){
                    return b.value- a.value;
                });
            }

            return arr;
        }

    };
    var event={
        //接收1个json参数
        //参数示例 1. {type:"china",value:"全国"},{type:"province",value:"浙江"}
        jump_to_location:function(current,callback){
            if(!current){
                swal({   title:"current 不能为空", type: "error",   confirmButtonText: "确定" });
                return;
            }
            var w=this;



            var flag=__load__.loadData.call(w,current);
            if(!flag){
                swal({   title: current.value+"尚未支持钻取数据", type: "error",   confirmButtonText: "确定" });
                return;
            }
            if(appConfig.currentLocation){
                appConfig.prevLocation=appConfig.currentLocation;
            }else{
                appConfig.prevLocation=current;
            }
            appConfig.currentLocation=current;
            var title=__function__.getCurrentTitle();
            title=title+(config.title_suffix||"");
            $("#location-name").text(title);
            $("title").text(title+$("#location-suffix").text());
            __load__.startLoad.call(w);
            callback&&callback.call(w);


        },
        legend_map_event:function(ecConfig,mapper,mapname,callback){
            var w=this;
            var tabs=[],legends=[];
            $.each(mapper,function(key,value){
                tabs.push(value.tab);
                legends.push(value.value);
            });
            $.each(mapper,function(key,value){
                w[key]&&w[key].on(ecConfig.EVENT.CLICK, function (param){
                    $.each(tabs,function(i,tab){
                        $(tab).removeClass("active");
                    });
                    $(value.tab).addClass("active");
                    $(value.tab).trigger("click");
                });
            });
            for(var i=0;i<tabs.length;i++){
                $(tabs[i]).data("index",i);
                $(tabs[i]).bind("click",function(){
                    legends.forEach(function(legend){
                        prophet_options[mapname].legend.selected[legend]=false;
                    });
                    var index=$(this).data("index");
                    prophet_options[mapname].legend.selected[legends[index]]=true;
                    w[mapname].setOption(prophet_options[mapname]);
                    w[mapname].restore();
                    callback&&callback.call(w,this);

                });
            }
        },
        trigger_jump:function(next,conf){
            var w=this;
            var currentType=appConfig.currentLocation.type;
            var nextType="",nextLocation="",detail=0;//detail=0表示不是现实详单 ，如果是1 表示在这一层要现实详单
            if(currentType=='china'){
                nextType='province';
                nextLocation=next;
            }else if(currentType=='province'){
                nextType="city";
                nextLocation=appConfig.currentLocation.value+"_"+next;
                if(config.deep_type&&config.deep_type=='city'){//说明在城市级已经要展示详单了，不能再下钻了
                    detail=1;
                }
            }else if(currentType=='city'){//点击区县的时候,视图不变化,显示一块详单内容
                nextType='district';
                nextLocation=appConfig.currentLocation.value+"_"+next;
                detail=1;
            }
            if(nextType){
                if(detail==0){
                    event.jump_to_location.call(w,{type:nextType,value:nextLocation});
                    $(".cat-detail").hide();
                    $(".cat-summary").show();
                    appConfig.inDetail=false;
                    conf&&conf.callback&&conf.callback.call(w);

                }else {
                    if(conf&&conf.detailParam){

                        var param=conf.detailParam({location:nextLocation,location_type:config.location_type,type:nextType});
                        __function__.overlay(true);
                        $.post(__ROOT__+"/Home/ProphetInfo/getDetailData",param).success(function(json){
                            __function__.overlay(false);
                            w.detailData=json;
                           if( conf.detailCallback){
                               $(".cat-detail").show();
                               $(".cat-summary").hide();
                               appConfig.inDetail=true;
                               conf.detailCallback.call(w);

                           }

                        });
                    }

                }

            }

        }
    };
    var __detail_load__={
        load_main:function(){
            var w=this;
            var data= w.detailData.items;
            var tbody=$("tbody",$("#main_surveyRankTopNtable_detail"));
            tbody.html("");
            $.each(data||[],function(i,item){
                var tr=$("<tr class='asset-detail' ref='"+item._id+"'><td style='width: 40%'>"+item._id+"</td><td style='width: 40%'>"+item.title+"</td></tr>");
                tbody.append(tr);
                tr.addClass("a-fadeinB");
            });
        },
        load_risklevel:function(){
            var w=this;
            var data= w.detailData.items;
            var warper=$("#riskWebList");
            warper.html("");
            var circleColor={
                'high':"red",
                'low':"yellow",
                'mid':"orange",
                'info':"blue"
            }
            $.each(data||[],function(i,item){
                var name=__function__.cutstr(item.title||item._id,10);
                var color=circleColor[item.vuls.level];
                var level=appConfig.vuls_level_name_mapper[item.vuls.level];
                var item="<div class='col-md-4'><div class='list risk-level-item asset-detail' ref='"+item._id+"'><div class='l-rank bg-"+color+"'>"+level+"</div><div class='l-web'>"+name+"</div></div></div>";
                warper.append(item);
            });


        },
        load_riskarea_area:function(){
            var w=this;
            var data= w.detailData.items;
            var tbody=$("tbody",$("#riskarea_topNtable"));
            tbody.html("");


            for(var i=0;i<data.length;i++){
                var item=data[i];
                var title=(item.title||item._id);
                var domain=item._id;
                var count=0;
                $.each(item.vuls.sd_detail,function(k,num){
                   count=num;
                });
                var tr=$("<tr class='asset-detail' ref='"+item._id+"'><td style='width: 40%'>"+domain+"</td><td style='width: 40%'>"+title+"</td><td>"+count+"</td></tr>");
                tbody.append(tr);
                tr.addClass("a-fadeinB");
            }

        },
        load_security:function(){
            var w=this;
            var data= w.detailData.items;
            var timeRank= w.detailData.security_time_rank;
            var tbody=$("tbody","#security_categoryDeatilTable_detail");
            tbody.html("");
            for(var i=0;i<data.length;i++){
                var d=data[i];
                var tr=$("<tr class='asset-detail' ref='"+ d._id+"' domain='"+ d.domain+"' ><td>"+ (d.title|| d.domain)+"</td><td>"+ d.happen_time.split(" ")[0]+"</td><td>"+config.event_type_name_mapper[d.event_type]+"</td></tr>");
                tr.appendTo(tbody);
                tr.addClass("a-fadeinB");
            }

            var tbody2=$("tbody","#security_timeDetailTable");
            tbody2.html("");
            timeRank.sort(function(a,b){
                return parseInt(b._id)-parseInt(a._id);
            });
            $.each(timeRank,function(i,d){
                var tr=$("<tr><td>"+( d._id.substr(0,4)+"年"+d._id.substr(4,6)+"月")+"</td><td>"+ d.total+"</td><td>"+ config.event_type_name_mapper[w.detailData.event_type]+"</td></tr>");
                tr.appendTo(tbody2);
                tr.addClass("a-fadeinB");
            });
        },
        load_serverexption:function(){
            var w=this;
            var data= w.detailData.items||[];
            var tbody=$("tbody",$("#serverexption_exampleTable_detail"));
            tbody.html("");
            for(var i=0;i<data.length;i++){
                var d=data[i];
                var tr=$("<tr class='asset-detail' ref='"+ d._id+"' domain='"+ d._id+"'><td>"+ d._id+"</td><td>"+d.title+"</td><td>"+ appConfig.visit_state_mapper[d.survey.visit_state]+"</td></tr>");
                tr.appendTo(tbody);
                tr.addClass("a-fadeinB");

            }
        },
        load_zeroday:function(){
            var w=this;
            var data= w.detailData.items||[];

            var wraper=$("tbody",$("#zeroday_table_detail"));
            wraper.html("");


            if(data&&data.length){
                $.each(data,function(i,ex){
                    var tr=$("<tr class='asset-detail' ref='"+ex._id+"'><td>"+(ex.title||ex._id)+"</td><td>"+(ex._id)+"</td></tr>");
                    tr.appendTo(wraper);
                });

            }
        },
        load_finger:function(){
            var w=this;
            var data= w.detailData.items||[];
            var wraper=$("tbody",$("#finger_exapmleTable_detail"));
            wraper.html("");
            if(data&&data.length){
                $.each(data,function(i,ex){
                    var tr=$("<tr class='asset-detail' ref='"+ex._id+"'><td>"+ex._id+"</td><td>"+(ex.title)+"</td></tr>");
                    tr.appendTo(wraper);
                });

            }
        }

    }
    var __load__={
        loadData:function(current){
            var w=this;
            var flag=true;
            __function__.overlay(true);
            $.ajax({
                url:__ROOT__+"/Home/ProphetInfo/getLocationData",
                data:{location:current.value,type:current.type,location_type:config.location_type},
                async:false,//加上同步锁
                type:"POST",
                success:function(json){
                    __function__.overlay(false);
                    if(json.code>0){
                        w.data=json.data;
                        if(!w.data.survey){//普查数据肯定是有的，如果没有，说明该地区不支持下钻
                            flag=false;
                        }

                    }else{
                        flag=false;
                        swal({   title: json.msg, type: "error",   confirmButtonText: "确定" });

                    }
                }
            });
            return flag;


        },
        startLoad:function(callback){
            var w=this;
            __load__.load_riskLevelRank.call(w);//风险等级分布
            __load__.load_vulsTypeRankCloud.call(w,'high');//漏洞类型分布,开始默认显示高危漏洞
            __load__.load_securityAreaRank.call(w);
            __load__.load_zeroDayRank.call(w);
            __load__.load_fingerBar.call(w);

            __load__.load_securityEventExample.call(w);
            __load__.load_surverExample.call(w);

            __load__.load_main.load.call(w);
            //console.info("current map type:"+__function__.getCurrentMapType()+",current:"+JSON.stringify(appConfig.currentLocation));
            callback&&callback.call(w);
        },
        load_riskLevelRank:function(){
            var w=this;
            var vuls=w.data.vuls;
            if(!vuls){
                swal({   title:"未能获取到漏洞信息", type: "error",   confirmButtonText: "确定" });

                return;
            }
            prophet_options.riskLevelRank.series[0].data=[
                {value:vuls.has_risk.yes, name:'有漏洞'},
                {value:vuls.has_risk.no, name:'无漏洞'}
            ];
            prophet_options.riskLevelRank.series[1].data=[
                {value:vuls.risk_rank.high.total, name:'高危'},
                {value:vuls.risk_rank.mid.total, name:'中危'},
                {value:vuls.risk_rank.low.total, name:'低危'},
                {value:vuls.risk_rank.info.total, name:'信息'},
                {value:vuls.risk_rank.safe.total, name:'安全'}
            ];

            w.riskLevelRank.setOption( prophet_options.riskLevelRank);
        },
        load_vulsTypeRankCloud:function(level,callback){
            var w=this;
            if(!w.data.vuls){
                swal({   title:"未能获取到漏洞信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            var _tmp_rank=w.data.vuls.risk_rank[level]['type_rank']||{};
            var type_rank= [];
            $.each(_tmp_rank,function(k,v){
                type_rank.push({name:config.vuls_name_mapper[k]||k,value:v,sd:k});
            });
            type_rank.sort(function(a,b){//降序排列 否则标签云的tooptip显示会混乱
                return b.value- a.value;
            });

            prophet_options.vulsTypeRankCloud.series[0].data=[];
            $.each(type_rank,function(index,rank){
                prophet_options.vulsTypeRankCloud.series[0].data.push({
                    name: rank['name'],
                    value: rank['value'],
                    sd:rank['sd'],
                    itemStyle: options_functions.createRandomItemStyle()
                });
            });
            w.vulsTypeRankCloud.clear();
            w.vulsTypeRankCloud.setOption( prophet_options.vulsTypeRankCloud);
            callback&&callback.call(w);
        },
        load_zeroDayRank:function(type){
            var w=this;
            var zeroday= w.data.zeroday;
            if(!zeroday){
                swal({   title:"未能获取到0day信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            if(!type){

                for(var key in zeroday.data){
                    type=key;
                    break;
                }

            }
            var index=0;
            $("#zeroDayRank-tab-warper").html("");
            var tbody=$("tbody",$("#zeroDayRank"));
            tbody.html("");
            $.each(zeroday.data,function(key,data){

                var btn=$('<li role="presentation" key="'+key+'" class="'+(key==type?'active':'')+'"><a class="tab-zero-day-rank " refId="'+data._id+'" ref="'+key+'"  role="tab" data-toggle="tab">'+key+'</a></li>');
                $("#zeroDayRank-tab-warper").append(btn);
                if(key==type){
                    var arr=__function__.getZeroRank(data.area_rank);
                    if(arr.length){
                        var max=arr[0].value;
                        for(var i=0;i<arr.length;i++){
                            var d=arr[i];

                            var tr=$("<tr typeref='"+key+"' locationref='"+d.name+"'><td>"+ d.name+"</td><td>"
                                + "<div class='progress'><div class='progress-bar' style='width: "+(d.value*100/max)+"%;'></div></div>"
                                +"</td><td>"+ d.value+"</td></tr>");
                            tr.appendTo(tbody);
                            if(i%2==0){
                                tr.addClass("a-fadeinR");
                            }else{
                                tr.addClass("a-fadeinB");
                            }

                        }
                    }



                }
                index++;
            });
            //var btn=$('<li role="presentation"  class="'+(i==0?'active':'')+'"><a class="tab-zero-day-rank " ref="'+name+'"  role="tab" data-toggle="tab">'+name+'</a></li>');
            //$("#zeroDayRank-tab-warper").append(btn)
        },
        load_securityTypeRank:function(callback){
            var w=this;
            if(!w.data.security){
                swal({   title:"未能获取到安全事件信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            $(".view-security-rank").hide();
            $("#securityTypeRank").show();
            $(".tab-security-rank").parent().removeClass("active");
            $(".tab-security-rank").parent().eq(0).addClass("active");
            var type_rank= w.data.security.type_rank||{};
            prophet_options.securityTypeRank.series[0].data=[];
            $.each(type_rank,function(key,rank){
                var value=Math.log(rank['total']);
                if(config.event_type_name_mapper[key]){
                    prophet_options.securityTypeRank.series[0].data.push({
                        name:config.event_type_name_mapper[key],
                        value:(value?value:0.0001)
                    });
                }

            });

            w.securityTypeRank.setOption( prophet_options.securityTypeRank);
            callback&&callback.call(w);

        },
        load_securityAreaRank:function(callback){
            var w=this;
            if(!w.data.security){
                swal({   title:"未能获取到安全事件信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            $(".view-security-rank").hide();
            $("#securityAreaRank").show();

            var areaRank=w.data.security.area_rank;
            prophet_options.securityAreaRank.series[0].mapType=__function__.getCurrentMapType();
            prophet_options.securityAreaRank.series[0].heatmap.data=options_functions.securityAreaRankHeatData.call(w,areaRank,__function__.getCurrentMapType());
            w.securityAreaRank.clear();
            if(prophet_options.securityAreaRank.series[0].heatmap.data.length){
                w.securityAreaRank.setOption( prophet_options.securityAreaRank);
                $("#securityAreaRank").show();
            }else{
                $("#securityAreaRank").hide();
            }
            //w.securityAreaRank.restore();
            callback&&callback.call(w);
        },
        load_securityEventExample:function(callback){
            var w=this;
            var securitys= w.data.security.newest_topn;
            var wraper=$("#securityEventExample");
            wraper.html("");
            var imgserver=config['imgserver'];
            var child=$("#event-clone");
            securitys.forEach(function(d){

                var path=imgserver+"/upload/"+d['snapshot'];
                var img=child.clone().removeAttr("_id").show();
                $(".title",$(img)).text(__function__.cutstr(d.title|| d.domain,10));
                $(".domain",$(img)).text(__function__.cutstr(d.domain,10));
                $("img",$(img)).attr("src",path);
                $(".fancybox",$(img)).attr("href",path);
                $(".type",$(img)).text(d.type);
                wraper.append(img);
            });



            callback&&callback.call(w);
        },
        load_fingerBar:function(type,callback){
            var w=this;
            var finger= w.data.finger;
            if(!finger){
                swal({   title:"未能获取到网站指纹信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            var data=finger.data;

            if(!type){
                if(appConfig.currentFinger){
                    type=appConfig.currentFinger;
                }else{
                    for(var fingerType in data){
                        if(storm.common.jsonSize(data[fingerType])>0){
                            type=fingerType;
                            break;
                        }
                    }
                }

            }
            appConfig.currentFinger=type;


            var arr=[];
            for(var fingerName in data[type]){
                arr.push({name:fingerName,value:data[type][fingerName].total});
            }
            arr.sort(function(a,b){
                return a.value- b.value;
            });
            appConfig.allFingerTypes=storm.common.jsonKeys(data);
            var json=data[fingerType];
            prophet_options.fingerBar.title.text=appConfig.fingerNameMapper[type];
            prophet_options.fingerBar.yAxis[0].data=storm.common.jsonarray_pick(arr,"name");
            prophet_options.fingerBar.series[0].data=storm.common.jsonarray_pick(arr,"value");
            w.fingerBar.clear();
            w.fingerBar.setOption(prophet_options.fingerBar);
            w.fingerBar.hideLoading();
            callback&&callback.call(w);
        },
        load_surverExample:function(callback){
            var w=this;
            var survey= w.data.survey;
            if(!survey){
                swal({   title:"未能获取到网站普查信息", type: "error",   confirmButtonText: "确定" });
                return;
            }
            var data=[];
            $.each(survey.exeption.type_rank,function(type,d){
                if(d.example10){
                    d.example10.forEach(function(_d){
                        data.push(_d);
                    });
                }
            });


            var color={
                "-4":"label-danger",
                "-3":"label-warning",
                "-2":"label-danger",
                "-1":"label-info"
            }
            var tbody=$("tbody",$("#monitorData"));
            tbody.html("");
            $.each(data,function(i,d){
               if(appConfig.visit_state_mapper[d.type]){
                    var tr=$("<tr class='asset-detail' ref='"+ d._id+"' domain='"+ d._id+"'><td>"+ d.time.split(" ")[0]+"</td>" + "<td>"+ d.title+"</td><td><span class='label "+color[d.type]+"'>"+ appConfig.visit_state_mapper[d.type]+"</span></td></tr>");
                }
                tbody.append(tr);
            });
            callback&&callback.call(w);
        },
        load_main:{//主界面
            load:function(callback){
                var w=this;
                $(".content-wraper").hide();
                $(".content-main").show();
                __load__.load_main.load_main_surveyAreaRank.call(w);//主界面地图加载
                __load__.load_main.load_main_surveyCateGoryCycle.call(w);//6个圈圈的加载
                __load__.load_main.load_main_surveyRankTopN.call(w);//网站量TOP3加载
                __load__.load_main.load_main_surveyRankTopNTable.call(w);//Topn 表格加载
                w.data.survey&&$("#webTotalNum").text(w.data.survey.total_web_num);
                appConfig.lastLoad="load_main";
                callback&&callback.call(w);


            },
            load_main_surveyAreaRank:function(callback){
                var w=this;
                if(!w.data.survey){
                    swal({   title:"未能获取到网站普查信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                prophet_options.main_surveyAreaRank.series[0].mapType= __function__.getCurrentMapType();
                prophet_options.main_surveyAreaRank.series[0].data=[];
                var areaRank= w.data.survey.area_nums||{};
                $.each(areaRank,function(area,num){

                    prophet_options.main_surveyAreaRank.series[0].data.push({
                        name:area,
                        value:num
                    });


                });
                options_functions.setMapMaxData(prophet_options.main_surveyAreaRank);
                w.main_surveyAreaRank.clear();
                w.main_surveyAreaRank.setOption(prophet_options.main_surveyAreaRank,true);
                callback&&callback.call(w);
            },
            load_main_surveyCateGoryCycle:function(callback){
                var w=this;
                var survey= w.data.survey;
                var vuls= w.data.vuls;
                var security= w.data.security;
                if(survey){
                    var _5xxError=survey.exeption.type_rank["-3"]?survey.exeption.type_rank["-3"].total:0;
                    options_functions.resetCycleOption( prophet_options.main_categoryCycle1,"服务异常:"+_5xxError,_5xxError,survey.total_web_num);
                    w.main_categoryCycle1.setOption(prophet_options.main_categoryCycle1);

                    var _4xxError=survey.exeption.type_rank["-2"]?survey.exeption.type_rank["-2"].total:0;
                    options_functions.resetCycleOption( prophet_options.main_categoryCycle2,"找不到资源:"+_4xxError,_4xxError,survey.total_web_num);
                    w.main_categoryCycle2.setOption(prophet_options.main_categoryCycle2);
                }
                if(vuls&&survey){
                    options_functions.resetCycleOption(prophet_options.main_categoryCycle3,"高危风险:"+vuls.risk_rank.high.total,vuls.risk_rank.high.total,survey.total_web_num);
                    w.main_categoryCycle3.setOption(prophet_options.main_categoryCycle3);

                    options_functions.resetCycleOption(prophet_options.main_categoryCycle4,"中危风险:"+vuls.risk_rank.mid.total,vuls.risk_rank.mid.total,survey.total_web_num);
                    w.main_categoryCycle4.setOption(prophet_options.main_categoryCycle4);
                }
                if(security){
                    var current=security.type_rank['3']?security.type_rank['3'].total:0;
                    options_functions.resetCycleOption(prophet_options.main_categoryCycle5,"反共事件:"+current,current,security.total);
                    w.main_categoryCycle5.setOption(prophet_options.main_categoryCycle5);
                }







            },
            load_main_surveyRankTopN:function(callback){
                var w=this;
                //var areaRank= w.data.survey.area_nums||{};
                if(!w.data.survey){
                    swal({   title:"未能获取到网站普查信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var _sortRank=__function__.sortMapData( w.data.survey.area_nums||{});
                for(var i=0;i<=2;i++){
                    var rank=_sortRank[i];
                    var titleColor="#FFFFFF";
                    var pieColors=["#fff","#fff"];
                    if(i==0){
                        titleColor="#F0412F";
                        pieColors=["#F0412F","#B63732"];
                    }else if(i==1){
                        titleColor="#F5942C";
                        pieColors=["#F5942C","#BE7C38"];
                    }else if(i==2){
                        titleColor="#FAE266";
                        pieColors=["#FAE266","#C88A61"];
                    }
                    var name=$('#main_surveyRankCycle'+(i+1)).prev(".web-num").find(".name");
                    if(rank){
                        options_functions.resetRankTopNOption(prophet_options['main_surveyRankCycle'+(i+1)],"网站量:"+rank.value,rank.value, w.data.survey.total_web_num,titleColor,pieColors,rank.name);
                        name.html(rank.name)

                    }else{
                        options_functions.resetRankTopNOption(prophet_options['main_surveyRankCycle'+(i+1)],"无",0, 1,"#F0412F");
                        name.html("无");
                    }
                    w['main_surveyRankCycle'+(i+1)].setOption(prophet_options['main_surveyRankCycle'+(i+1)]);


                }
                callback&&callback.call(w);

            },
            load_main_surveyRankTopNTable:function(callback){
                var w=this;
                if(!w.data.survey){
                    swal({   title:"未能获取到网站普查信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var area_rank= w.data.survey.area_nums;
                var table=$("#main_surveyRankTopNtable");
                var tbody=$("tbody",table);
                tbody.html("");
                var _sortRank=__function__.sortMapData( w.data.survey.area_nums||{});
                if(_sortRank.length>=4){
                    for(var i=3;i<_sortRank.length;i++){
                        var rank=_sortRank[i];
                        var tr=$("<tr  ref='"+rank.name+"'><td>"+(i+1)+"</td><td>"+rank.name+"</td><td>"+rank.value+"</td><td>"+(rank.value*100/w.data.survey.total_web_num).toFixed(2)+"%</td></tr>");
                        tr.appendTo(tbody);
                    }
                }

            }


        },
        load_risklevel:{
            load:function(callback){
                var w=this;
                if(!w.data.vuls){
                    swal({   title:"未能获取到漏洞信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                $(".content-wraper").hide();
                $(".content-risklevel").show();
                __load__.load_risklevel.load_risklevel_areaRank.call(w);
                __load__.load_risklevel.load_risklevel_Cycles.call(w);
                __load__.load_risklevel.load_risklevel_exampleTable.call(w);
                __load__.load_risklevel.load_risklevel_top5Table.call(w,'high');
                $(".content-risklevel").removeClass(appConfig.animation).addClass("a-fadeinR");

                appConfig.lastLoad="load_risklevel";
                callback&&callback.call(w);

            },
            load_risklevel_areaRank:function(callback){
                var w=this;
                var vuls= w.data.vuls;
                var ranks=[vuls.risk_rank.high.area_rank,vuls.risk_rank.mid.area_rank,vuls.risk_rank.low.area_rank,vuls.risk_rank.info.area_rank];
                //console.info(ranks);
                for(var i=0;i<4;i++){
                    prophet_options.risklevel_areaRank.series[i].data=[];
                    prophet_options.risklevel_areaRank.series[i].mapType= __function__.getCurrentMapType();
                    $.each(ranks[i],function(area,num){
                        prophet_options.risklevel_areaRank.series[i].data.push({
                            name:area,
                            value:num
                        });

                    });
                }
                options_functions.setMapMaxData(prophet_options.risklevel_areaRank);
                w.risklevel_areaRank.clear();
                w.risklevel_areaRank.setOption(prophet_options.risklevel_areaRank);

                callback&&callback.call(w);
            },
            load_risklevel_Cycles:function(callback){
                var w=this;
                var vuls= w.data.vuls;
                var survey= w.data.survey;

                for(var i=1;i<=4;i++){
                    prophet_options['risklevel_Cycle'+i].series[0].radius=['70%', '100%'];
                }

                options_functions.resetCycleOption(prophet_options.risklevel_Cycle1,'高:'+vuls.risk_rank.high.total, vuls.risk_rank.high.total, survey.total_web_num,"#F0412E");
                w.risklevel_Cycle1.setOption(prophet_options.risklevel_Cycle1);

                options_functions.resetCycleOption(prophet_options.risklevel_Cycle2,'中:'+vuls.risk_rank.mid.total, vuls.risk_rank.mid.total, survey.total_web_num,'#F1922C');
                w.risklevel_Cycle2.setOption(prophet_options.risklevel_Cycle2);

                options_functions.resetCycleOption(prophet_options.risklevel_Cycle3,'低:'+vuls.risk_rank.low.total, vuls.risk_rank.low.total, survey.total_web_num,'#FDE866');
                w.risklevel_Cycle3.setOption(prophet_options.risklevel_Cycle3);

                options_functions.resetCycleOption(prophet_options.risklevel_Cycle4,'信息:'+vuls.risk_rank.info.total, vuls.risk_rank.info.total, survey.total_web_num,'#2CCB71');
                w.risklevel_Cycle4.setOption(prophet_options.risklevel_Cycle4);

                callback&&callback.call(w);
            },
            load_risklevel_exampleTable:function(callback){
                var w=this;
                var vuls= w.data.vuls;
                var data={};
                $.each(vuls.risk_rank,function(key,rank){
                    $.each(rank.area_rank,function(area,num){
                        if(!data[area]){
                            data[area]={};
                        }
                        if(!data[area][key]){
                            data[area][key]=0;
                        }
                        data[area][key]+=num;

                    });
                });
                var area_rank= w.data.survey.area_nums||{};
                var table=$("#risklevel_exampleTable");
                var tbody=$("tbody",table);
                tbody.html("");
                $.each(area_rank,function(area,num){
                    if(data[area]){
                        var total=num;
                        var high = ((data[area]['high']||0)*100/total).toFixed(2);
                        var mid = ((data[area]['mid']||0)*100/total).toFixed(2);
                        var low = ((data[area]['low']||0)*100/total).toFixed(2);
                        var tr=$("<tr><td style='width: 20%'>"+area+
                            "</td><td style='width: 20%'>"+num+
                            "</td><td style='width: 20%'>"+ high +
                            "%</td><td style='width: 20%'>"+ mid +
                            "%</td><td style='width: 20%'>"+ low +
                            "%</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");
                    }

                });
                callback&&callback.call(w);

            },
            load_risklevel_top5Table:function(level,callback){
                var w=this;
                var risks= w.data.vuls.risk_type_rank||{};
                var data=[];
                $.each(risks,function(sd,obj){
                    if(obj.total>0&&obj.level==level){
                        data.push({ sd:sd,name:config.vuls_name_mapper[sd], value:obj.total,level:obj.level});
                    }

                });
                if(data.length){
                    data.sort(function(a,b){
                        return  b.value-a.value;
                    });
                    var table=$("#risklevel_top5Table");
                    var tbody=$("tbody",table);
                    tbody.html("");
                    for(var i=0;i<data.length;i++){
                        var tr=$("<tr riskref='"+data[i]['sd']+"'><td >"+(i+1)+"</td><td >"+data[i]['name']+
                            "</td><td ><span class='label' style='background-color:"+appConfig.vuls_level_color[data[i]['level']]+"' >"+appConfig.vuls_level_name_mapper[data[i]['level']]+"</span></td><td >"+data[i]['value']+"</td></tr>");
                        tr.appendTo(tbody);
                        tr.addClass("a-fadeinB");
                    }
                }
                callback&&callback.call(w);

            }
        },
        load_riskarea:{
            load:function(vulsId,callback){
                var w=this;
                if(!w.data.vuls){
                    swal({   title:"未能获取到漏洞信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                $(".content-wraper").hide();
                $(".content-riskarea").show();
                if(!vulsId){
                    if(appConfig.lastVulsId){
                        vulsId=appConfig.lastVulsId;
                    }else{
                        var vuls= w.data.vuls;
                        for(var item in vuls.risk_type_rank){
                            vulsId=item;
                            break;
                        }
                        appConfig.lastVulsId=vulsId;
                    }

                }
                __load__.load_riskarea.load_riskarea_areaRank.call(w,vulsId);
                __load__.load_riskarea.load_riskarea_properties.call(w,vulsId);
                __load__.load_riskarea.load_riskarea_tables.call(w,vulsId);
                $(".content-riskarea").removeClass(appConfig.animation).addClass("a-fadeinR");
                appConfig.lastLoad="load_riskarea";
                callback&&callback.call(w);
            },
            load_riskarea_areaRank:function(vulsId,callback){
                var w=this;
                var vuls= w.data.vuls;
                var areaRank=vuls.risk_type_rank[vulsId].area_rank;
                prophet_options.riskarea_areaRank.series[0].data=[];
                prophet_options.riskarea_areaRank.series[0].mapType= __function__.getCurrentMapType();
                $.each(areaRank,function(area,num){
                    prophet_options.riskarea_areaRank.series[0].data.push({
                        name:area,
                        value:num
                    });
                });
                options_functions.setMapMaxData(prophet_options.riskarea_areaRank);
                w.riskarea_areaRank.clear();
                w.riskarea_areaRank.setOption(prophet_options.riskarea_areaRank);
                callback&&callback.call(w);
            },
            load_riskarea_properties:function(vulsId,callback){
                var w=this;
                var wraper=$(".content-riskarea");
                var name=config.vuls_name_mapper[vulsId];
                var level=config.vuls_level_mapper[vulsId];
                $(".riskarea-info-name",wraper).html(name).attr("vulsId",vulsId);
                $(".riskarea-info-level",wraper).html(appConfig.vuls_level_name_mapper[level]);
                $(".riskarea-info-level",wraper).css("color",appConfig.vuls_level_color[level]);
                callback&&callback.call(w);
            },
            load_riskarea_tables:function(vulsId,callback){
                var w=this;
                var tbody=$("tbody",$("#riskarea_topNtable"));
                var examples= w.data.vuls.risk_type_rank[vulsId].example20;
                tbody.html("");
                for(var i=0;i<examples.length;i++){
                    var example=examples[i];
                    var title=(example.title||example.domain);
                    var domain=example.domain;
                    var tr=$("<tr ref='"+example.domain+"'><td style='width: 40%'>"+domain+"</td><td style='width: 40%'>"+title+"</td><td>"+example.count+"</td></tr>");
                    tbody.append(tr);
                    tr.addClass("a-fadeinB");
                }
                callback&&callback.call(w);
            }

        },
        load_security:{
            load:function(callback){
                var w=this;
                if(!w.data.security){
                    swal({   title:"未能获取到安全事件信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                $(".content-wraper").hide();
                $(".content-security").show();

                __load__.load_security.load_security_areaRank.call(w);
                __load__.load_security.load_security_categoryDeatilTable.call(w);
                __load__.load_security.load_security_cycles.call(w);
                __load__.load_security.load_security_timeDetailTable.call(w,"1");
                $(".content-security").removeClass(appConfig.animation).addClass("a-fadeinL");
                appConfig.lastLoad="load_security";

                callback&&callback.call(w);

            },
            load_security_areaRank:function(callback){
                var w=this;
                var security= w.data.security;
                var getData=function(type){
                    if(security.type_rank[type]&&security.type_rank[type].area_rank){
                        return security.type_rank[type].area_rank;
                    }else{
                        return {};
                    }
                }
                //黑页  反共 博彩 色情 暗链
                var datas=[getData('1'),getData('3'),getData('5'),getData('6'),getData('2')];
                for(var i=0;i<5;i++){
                    prophet_options.security_areaRank.series[i].data=[];
                    prophet_options.security_areaRank.series[i].mapType= __function__.getCurrentMapType();
                    $.each(datas[i],function(key,value){
                        prophet_options.security_areaRank.series[i].data.push({
                            name:key,
                            value:value
                        });

                    });
                }
                options_functions.setMapMaxData(prophet_options.security_areaRank);
                //console.info(prophet_options.security_areaRank)
                w.security_areaRank.clear();
                w.security_areaRank.setOption(prophet_options.security_areaRank);
                callback&&callback.call(w);

            },
            load_security_categoryDeatilTable:function(callback){
                var w=this;
                var data={};
                var tbody=$("tbody",$("#security_categoryDeatilTable"));
                tbody.html("");
                $.each(w.data.security.type_rank,function(key,d){
                    var area_rank= d.area_rank;
                    $.each(area_rank,function(location,count){
                        if(!data[location]){
                            data[location]={};
                        }
                        data[location][key]=count;

                    });
                });
                var _data=[];
                for( var key in data){
                    var d=data[key];

                    _data.push({
                        name: key,
                        '黑页':d['1']||0,
                        '反共':d['3']||0,
                        '博彩':d['5']||0,
                        '色情':d['6']||0,
                        '暗链':d['2']||0
                    });
                }
                _data.sort(function(a,b){
                    return (b['黑页']+b['反共']+b['博彩']+b['色情']+b['暗链'])-(a['黑页']+a['反共']+a['博彩']+a['色情']+a['暗链']);
                });
                _data.forEach(function(d){
                    var tr=$("<tr><td>"+ d.name+"</td><td>"+(d['黑页']||0)+"</td><td>"+(d['反共']||0)+"</td><td>"+(d['博彩']||0)
                        +"</td><td>"+(d['色情']||0)+"</td><td>"+(d['暗链']||0)+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass('a-fadeinB');
                });
                callback&&callback.call(w);
            },
            load_security_cycles:function(callback){
                var w=this;
                for(var i=1;i<=4;i++){
                    prophet_options['security_Cycle'+i].series[0].radius=['70%', '100%'];
                }
                var type_rank= w.data.security.type_rank;
                var total= w.data.security.total;
                var getTotal=function(type){
                    if(type_rank[type]){
                        return  type_rank[type].total||0;
                    }else{
                        return 0;
                    }
                }
                options_functions.resetCycleOption(prophet_options.security_Cycle1,'黑页:\n'+getTotal("1"), getTotal("1"),total,"#F0412E");
                w.security_Cycle1.setOption(prophet_options.security_Cycle1);

                options_functions.resetCycleOption(prophet_options.security_Cycle2,'反共:\n'+getTotal("3"), getTotal("3"),total,"#F1922C");
                w.security_Cycle2.setOption(prophet_options.security_Cycle2);

                options_functions.resetCycleOption(prophet_options.security_Cycle3,'博彩:\n'+getTotal("5"), getTotal("5"),total,"#FDE866");
                w.security_Cycle3.setOption(prophet_options.security_Cycle3);

                options_functions.resetCycleOption(prophet_options.security_Cycle4,'暗链:\n'+getTotal("2"), getTotal("2"),total,"#2CCB71");
                w.security_Cycle4.setOption(prophet_options.security_Cycle4);
                callback&&callback.call(w);
            },
            load_security_timeDetailTable:function(type,callback){
                var w=this;
                var time_rank={};
                if( w.data.security.type_rank[type]){
                    time_rank= w.data.security.type_rank[type].time_rank;
                }
                var tbody=$("tbody",$("#security_timeDetailTable"));
                tbody.html("");
                if(time_rank){
                    var data=[];
                    $.each(time_rank,function(key,rank){
                        data.push({name:key.replace("NumberLong(","").replace(")",""),value:rank});
                    });
                    data.sort(function(a,b){
                        return parseInt(b.name)-parseInt(a.name);
                    });
                    $.each(data,function(i,d){

                        if(config.event_type_name_mapper[type]){
                            var tr=$("<tr><td>"+( d.name.substr(0,4)+"年"+d.name.substr(4,6)+"月")+"</td><td>"+ d.value+"</td><td>"+config.event_type_name_mapper[type]+"</td></tr>");
                            tr.appendTo(tbody);
                            tr.addClass("a-fadeinB");
                        }

                    });

                }
                callback&&callback.call(w);
            }

        },
        load_serverexption:{
            load:function(callback){
                var w=this;
                if(!w.data.survey){
                    swal({   title:"未能获取到网站普查信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                $(".content-wraper").hide();
                $(".content-serverexption").show();

                __load__.load_serverexption.load_serverexption_areaRank.call(w);
                __load__.load_serverexption.load_serverexption_categoryDeatilTable.call(w);
                __load__.load_serverexption.load_serverexption_cycles.call(w);
                __load__.load_serverexption.load_serverexption_exampleTable.call(w,"-1");
                $(".content-serverexption").removeClass(appConfig.animation).addClass("a-fadeinL");
                appConfig.lastLoad="load_serverexption";

                callback&&callback.call(w);
            },
            load_serverexption_areaRank:function(callback){
                var w=this;
                var server_exptions= w.data.survey.exeption.type_rank;
                var getData=function(excetionType){
                    if(!server_exptions[excetionType]){
                        return {};
                    }
                    return server_exptions[excetionType].area_rank||{};
                }
                var datas=[getData("-1"),getData("-2"),getData("-3"),getData("-4")];
                for(var i=0;i<4;i++){
                    prophet_options.serverexption_areaRank.series[i].data=[];
                    prophet_options.serverexption_areaRank.series[i].mapType= __function__.getCurrentMapType();
                    $.each(datas[i],function(k,v){
                        prophet_options.serverexption_areaRank.series[i].data.push({
                            name:k,
                            value:v
                        });

                    });


                }
                w.serverexption_areaRank.clear();
                w.serverexption_areaRank.setOption(prophet_options.serverexption_areaRank);
                callback&&callback.call(w);
            },
            load_serverexption_categoryDeatilTable:function(callback){
                var w=this;
                var data={};
                var total_data=w.data.survey.area_nums;
                var tbody=$("tbody",$("#serverexption_categoryDeatilTable"));
                tbody.html("");

                $.each(w.data.survey.exeption.type_rank,function(type,d){
                    var area_rank= d.area_rank||{};
                    $.each(area_rank,function(area,num){
                        if(!data[area]){
                            data[area]={};
                        }
                        data[area][type]=num;

                    });
                });

                var arr=[];
                for( var key in data){
                    var d=data[key];
                    arr.push({name:key,total:total_data[key],_unvisiable:(d['-1']||0),_5xx:(d['-3']||0),_4xx:(d['-2']||0)});
                }
                arr.sort(function(a,b){
                   return b.total- a.total;
                });
                arr.forEach(function(obj){
                    var tr=$("<tr><td>"+obj.name+"</td><td>"+obj.total+"</td><td>"+obj._unvisiable+"</td><td>"+obj._5xx
                        +"</td><td>"+obj._5xx+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass('a-fadeinB');
                });


                callback&&callback.call(w);
            },
            load_serverexption_cycles:function(callback){
                var w=this;
                for(var i=1;i<=4;i++){
                    prophet_options['serverexption_Cycle'+i].series[0].radius=['70%', '100%'];
                }
                var type_rank= w.data.survey.exeption.type_rank;
                var getTotal=function(type){
                    if(!type_rank[type]){
                        return 0;
                    }
                    return type_rank[type].total||0;
                }
                options_functions.resetCycleOption(prophet_options.serverexption_Cycle1,'请求无响应\n'+getTotal("-1"), getTotal("-1"), w.data.survey.total_web_num,"#F0412E");
                w.serverexption_Cycle1.setOption(prophet_options.serverexption_Cycle1);
                options_functions.resetCycleOption(prophet_options.serverexption_Cycle2,'找不到资源\n'+getTotal("-2"), getTotal("-2"), w.data.survey.total_web_num,"#F1922C");
                w.serverexption_Cycle2.setOption(prophet_options.serverexption_Cycle2);
                options_functions.resetCycleOption(prophet_options.serverexption_Cycle3,'服务异常\n'+getTotal("-3"), getTotal("-3"), w.data.survey.total_web_num,"#FDE866");
                w.serverexption_Cycle3.setOption(prophet_options.serverexption_Cycle3);
                options_functions.resetCycleOption(prophet_options.serverexption_Cycle4,'僵尸网站\n'+getTotal("-4"), getTotal("-4"), w.data.survey.total_web_num,"#2CCB71");
                w.serverexption_Cycle4.setOption(prophet_options.serverexption_Cycle4);
                callback&&callback.call(w);

            },
            load_serverexption_exampleTable:function(type,callback){
                var w=this;
                var data= w.data.survey.exeption.type_rank[type]?w.data.survey.exeption.type_rank[type].example10:[];
                var tbody=$("tbody",$("#serverexption_exampleTable"));
                tbody.html("");
                for(var i=0;i<data.length;i++){
                    var d=data[i];
                    var tr=$("<tr ref='"+ d._id+"' domain='"+ d._id+"'><td>"+ d._id+"</td><td>"+d.title+"</td><td>"+appConfig.visit_state_mapper[d.type]+"</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass("a-fadeinB");

                }
                callback&&callback.call(w);
            }

        },
        load_zeroday:{
            load:function(type,callback){
                var w=this;
                var zeroDay= w.data.zeroday;
                if(!zeroDay){
                    swal({   title:"未能获取到0day信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                if(!type){
                    if( appConfig.lastzerodayType){
                        type=appConfig.lastzerodayType;
                    }else{
                        for(var key in zeroDay.data){
                            type=key;
                            break;
                        }

                    }
                }
                appConfig.lastzerodayType=type;
                __load__.load_zeroday.load_zeroday_areaRank.call(w,type);
                __load__.load_zeroday.load_zeroday_table.call(w,type);
                __load__.load_zeroday.load_zeroday_properties.call(w,type);
                $(".content-wraper").hide();
                $(".content-zeroday").show();
                $(".content-zeroday").removeClass(appConfig.animation).addClass("a-fadeinR");
                appConfig.lastLoad="load_zeroday";

                callback&&callback.call(w);

            },
            load_zeroday_areaRank:function(type,callback){
                var w=this;
                prophet_options.zeroday_areaRank.series[0].data=[];
                prophet_options.zeroday_areaRank.series[0].mapType= __function__.getCurrentMapType();
                var data= w.data.zeroday.data[type];

                //var json=__functions__.getZeroData.call(w,type);
                prophet_options.zeroday_areaRank.series[0].data=__function__.getZeroRank(data.area_rank);
                options_functions.setMapMaxData(prophet_options.zeroday_areaRank);
                w.zeroday_areaRank.clear();
                w.zeroday_areaRank.setOption(prophet_options.zeroday_areaRank);
                callback&&callback.call(w);
            },
            load_zeroday_table:function(type,callback){
                var w=this;
                var data= w.data.zeroday.data[type];
                data=__function__.getZeroRank(data.area_rank);
                var tbody=$("tbody",$("#zeroday_table"));
                tbody.html("");
                $.each(data,function(i,d){
                    var total=w.data.survey.area_nums[d.name];
                    var tr=$("<tr><td>"+ d.name+"</td><td>"+total+"</td><td>"+ d.value+"</td><td>"+(d.value*100/total).toFixed(0)+"%</td></tr>");
                    tr.appendTo(tbody);
                    tr.addClass("a-fadeinB");
                });

                callback&&callback.call(w);

            },
            load_zeroday_properties:function(type,callback){
                var w=this;
                var desc="";
                if(config.zeroday_policy&&config.zeroday_policy[type]){
                    desc=config.zeroday_policy[type].desc||"";
                }
                var warper=$(".content-zeroday");
                $(".zeroday-info-desc",warper).html(desc);
                callback&&callback.call(w);

            }
        },
        load_finger:{
            load:function(type,callback){
                var w=this;
                var finger= w.data.finger;
                if(!finger){
                    swal({   title:"未能获取到指纹信息", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                if(!type){
                    if(appConfig.currentFinger_type){
                        type=appConfig.currentFinger_type;
                    }else{
                        var fingerType=appConfig.currentFinger;
                        var _tmp=w.data.finger.data[fingerType];
                        for(var key in _tmp){
                            type=key;
                            break;
                        }
                    }


                }
                appConfig.currentFinger_type=type;
                var fingerName=appConfig.fingerNameMapper[appConfig.currentFinger];
                $(".finger-title", $(".content-finger")).text(fingerName+":"+type);
                __load__.load_finger.load_finger_areaRank.call(w,type);
                __load__.load_finger.load_RankTopN.call(w,type);//网站量TOP3加载
                __load__.load_finger.loadExample.call(w,type);
                $(".content-wraper").hide();
                $(".content-finger").show();
                $(".content-finger").removeClass(appConfig.animation).addClass("a-fadeinR");
                appConfig.lastLoad="load_finger";

                callback&&callback.call(w);
            },
            load_finger_areaRank:function(type,callback){
                var w=this;
                var fingerData=w.data.finger.data||{};
                var data=fingerData[appConfig.currentFinger][type].area_rank||{};
                var arr=__function__.sortMapData(data);
                prophet_options.finger_areaRank.series[0].mapType= __function__.getCurrentMapType();
                prophet_options.finger_areaRank.series[0].data=arr;
                options_functions.setMapMaxData(prophet_options.finger_areaRank);
                w.finger_areaRank.clear();
                w.finger_areaRank.setOption(prophet_options.finger_areaRank);
                callback&&callback.call(w);

            },
            load_RankTopN:function(type,callback){
                var w=this;
                var fingerData=w.data.finger.data||{};
                var data=fingerData[appConfig.currentFinger][type].area_rank||{};
                var arr=__function__.sortMapData(data);
                var total=0;
                $.each(data,function(area,num){
                    total+=num;
                });
                var tbody=$("tbody",$("#finger_rankTopNtable"));
                tbody.html("");
                for(var i=0;i<arr.length-1;i++){
                    if(i<=2){
                        var rank=arr[i];
                        var titleColor="#FFFFFF";
                        var pieColors=["#fff","#fff"];
                        if(i==0){
                            titleColor="#F0412F";
                            pieColors=["#F0412F","#B63732"];
                        }else if(i==1){
                            titleColor="#F5942C";
                            pieColors=["#F5942C","#BE7C38"];
                        }else if(i==2){
                            titleColor="#FAE266";
                            pieColors=["#FAE266","#C88A61"];
                        }
                        var name=$('#finger_Cycle'+(i+1)).prev(".web-num").find(".name");
                        options_functions.resetRankTopNOption(prophet_options['finger_Cycle'+(i+1)],"网站量:"+rank.value,rank.value,total,titleColor,pieColors,rank.name);
                        name.html(rank.name);
                        w['finger_Cycle'+(i+1)].setOption(prophet_options['finger_Cycle'+(i+1)]);
                    }else{
                        var rank=arr[i];
                        var tr=$("<tr  ref='"+rank.name+"'><td>"+(i+1)+"</td><td>"+rank.name+"</td><td>"+rank.value+"</td><td>"+(rank.value*100/total).toFixed(2)+"%</td></tr>");
                        tr.appendTo(tbody);
                    }
                }
                callback&&callback.call(w);
            },
            loadExample:function(type,callback){
                var w=this;
                var fingerData=w.data.finger.data||{};
                var example=fingerData[appConfig.currentFinger][type].example10||[];
                var tbody=$("tbody",$("#finger_exapmleTable"));
                tbody.html("");
                for(var i=0;i<example.length;i++){
                    var d=example[i];
                    var tr=$("<tr><td>"+ d._id+"</td><td>"+ d.title+"</td></tr>");
                    tr.appendTo(tbody);
                }
                callback&&callback.call(w);


            }
        }


    };
    var view={
        prepare:function(callback){
            var w=this;
            require.config({
                paths: {
                    echarts: __ECHART__
                }
            });
            require(
                [
                    'echarts',
                    'echarts/chart/map',
                    'echarts/chart/pie',
                    'echarts/chart/bar',
                    'echarts/chart/wordCloud',
                    'echarts/chart/treemap'

                ],
                function (ec) {
                    $("#securityAreaRank").show();
                    var contents=['#securityTypeRank','.content-main','.content-risklevel','.content-riskarea','.content-zeroday'
                        ,'.content-security','.content-porttree','.content-serverexption','.content-pagelarge'];
                    var parts=['riskLevelRank','vulsTypeRankCloud','securityTypeRank','securityAreaRank','fingerBar'];//非中间面板初始化集合
                    $.merge(parts,['main_surveyAreaRank','main_categoryCycle1','main_categoryCycle2','main_categoryCycle3','main_categoryCycle4','main_categoryCycle5',
                        'main_surveyRankCycle1','main_surveyRankCycle2','main_surveyRankCycle3']);//主面板集合
                    $.merge(parts,['risklevel_areaRank','risklevel_Cycle1','risklevel_Cycle2','risklevel_Cycle3','risklevel_Cycle4']);//网站风险分布集合
                    $.merge(parts,['riskarea_areaRank']);//网站区域分布集合
                    $.merge(parts,['zeroday_areaRank']);//0day集合
                    $.merge(parts,['security_areaRank','security_Cycle1','security_Cycle2','security_Cycle3','security_Cycle4']);//安全事件集合
                    $.merge(parts,['finger_areaRank','finger_Cycle1','finger_Cycle2','finger_Cycle3']);//指纹集合
                    $.merge(parts,['serverexption_areaRank','serverexption_Cycle1','serverexption_Cycle2','serverexption_Cycle3','serverexption_Cycle4']);//服务异常集合
                    //$.merge(parts,['pagelarge_areaRank']);//首页过大集合

                    $.each(contents,function(i,content){
                        $(content).show();
                    });
                    $.each(parts,function(i,ecPart){
                        w[ecPart]= ec.init(document.getElementById(ecPart));
                    });

                    $.each(contents,function(i,content){
                        $(content).hide();
                    });
                    $(".content-zeroday").show();
                    var mapGeoData = require('echarts/util/mapData/params');
                    for (var city in CITY_GEO_FILE_MAP) {
                        mapGeoData.params[city] = {
                            getGeoJson: (function (c) {
                                var geoJsonName = CITY_GEO_FILE_MAP[c];
                                return function (callback) {
                                    $.getJSON(__PUBLIC__+'/asset/source/geo/citys/'+geoJsonName+'.json',callback);
                                }
                            })(city)
                        }
                    }

                    callback&&callback.call(w);
                });

        }
    }
    var handler={
        init:function(){
            var w=this;
            var ecConfig = require('echarts/config');
            handler.common_event.call(w,ecConfig);
            handler.map_event.call(w,ecConfig);
            handler.table_line_event.call(w,ecConfig);
            handler.echarts_steps_event.call(w,ecConfig);
            handler.map_legend_event.call(w,ecConfig);
            handler.tab_event.call(w,ecConfig);

        },
        common_event:function(ecConfig){
            var w=this;
            $(".btn-return-prev").bind("click",function(){
                if(appConfig.inDetail){
                    $(".cat-detail").hide();
                    $(".cat-summary").show();
                    appConfig.inDetail=false;
                }else{
                    var current=appConfig.currentLocation;
                    var currentLocation=current.value;
                    var tmp=currentLocation.split("_");
                    var prevType="";
                    var prevLocation="";
                    var lastLoad=appConfig.lastLoad;
                    //先判断当前视图和rootVaue的关系

                    if(tmp.length==2){//当前的视图在市级
                        prevType="province";
                        prevLocation=tmp[0];

                    }else if(tmp.length==1){
                        prevType="china";
                        prevLocation="全国";

                    }
                    var rootValue=config.root_value;
                    if(rootValue=='全国'||prevLocation.indexOf(rootValue)==0){
                        event.jump_to_location.call(w,{type:prevType,value:prevLocation});
                        lastLoad&&__load__[lastLoad].load.call(w);
                    }else{
                        swal({   title:"对不起，您没有访问"+prevLocation+"的权限", type: "error",   confirmButtonText: "确定" });

                    }


                }


            });
            $(".btn-back-home").bind("click",function(){


                __load__.load_main.load.call(w);
            });
            $(".finger-left").bind("click",function(){
                var current=appConfig.currentFinger;
                var allFilgers=appConfig.allFingerTypes;
                var index= $.inArray(current,allFilgers);
                index=index-1;
                if(index<0){
                    index=allFilgers.length-1;
                }
                var next=allFilgers[index];

                __load__.load_fingerBar.call(w,next);
            });
            $(".finger-right").bind("click",function(){
                var current=appConfig.currentFinger;
                var allFilgers=appConfig.allFingerTypes;
                var index= $.inArray(current,allFilgers);
                index=index+1;
                if(index>allFilgers.length-1){
                    index=0;
                }
                var next=allFilgers[index];
                __load__.load_fingerBar.call(w,next);


            });
            $("body").on("click",".asset-detail",function(){
                var asset=$(this).attr("ref");
                var base64=BASE64.encoder(asset);
                window.open(__ROOT__+"/Home/AssetReport/report/id/"+base64);
            });

        },
        map_event:function(ecConfig){
            var w=this;
            var map_triggers={
                main_surveyAreaRank:{
                    callback:function(){},
                    detailParam:function(config){
                        var param= $.extend(config,{config_type:"all",limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_main.call(w);}
                },
                risklevel_areaRank:{
                    callback:function(){__load__.load_risklevel.load.call(w);},
                    detailParam:function(config){
                        var level=$(".active",$(".risklevel-tab-level-container")).attr("key");
                        var param= $.extend(config,{config_type:"risk_level",param:level});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_risklevel.call(w);}

                },
                riskarea_areaRank:{
                    callback:function(){ __load__.load_riskarea.load.call(w)},
                    detailParam:function(config){
                        var sd=$(".riskarea-info-name",$(".content-riskarea")).attr("vulsid");
                        var param= $.extend(config,{config_type:"risk_type",param:sd,limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_riskarea_area.call(w);}
                },
                security_areaRank:{
                    callback:function(){ __load__.load_security.load.call(w)},
                    detailParam:function(config){
                        var key=$(".active",$(".security-tab-type-container")).attr("key");
                        var param= $.extend(config,{config_type:"security",param:key,limit:10});
                        return param;

                    },
                    detailCallback:function(){__detail_load__.load_security.call(w);}
                },
                serverexption_areaRank:{
                    callback:function(){ __load__.load_serverexption.load.call(w)},
                    detailParam:function(config){
                        var key=$(".active",$(".serverexption-tab-type-container")).attr("key");
                        var param= $.extend(config,{config_type:"serverexcetion",param:key,limit:100});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_serverexption.call(w);}
                },
                zeroday_areaRank:{
                    callback:function(){ __load__.load_zeroday.load.call(w)},
                    detailParam:function(config){
                        var key=$(".active",$("#zeroDayRank-tab-warper")).attr("key");
                        var param= $.extend(config,{config_type:"zeroday",param:key,limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_zeroday.call(w);}
                },
                finger_areaRank:{
                    callback:function(){ __load__.load_finger.load.call(w)},
                    detailParam:function(config){
                        var fingerType=appConfig.currentFinger;
                        var param= $.extend(config,{config_type:"finger",finger_type:appConfig.currentFinger,finger_name:appConfig.currentFinger_type,limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_finger.call(w);}
                }
            }
            $.each(map_triggers,function(key,conf){
                w[key].on(ecConfig.EVENT.CLICK,function(param){
                    event.trigger_jump.call(w,param['name'],conf);
                });
            });
        },
        table_line_event:function(ecConfig){
            var w=this;
            var events={
                main_surveyRankTopNtable:{
                    location:function(tr){return tr.attr("ref");},
                    callback:function(tr){},
                    detailParam:function(config){
                        var param= $.extend(config,{config_type:"all",limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_main.call(w);}
                },
                risklevel_exampleTable:{
                    location:function(tr){
                        return $("td:eq(0)",tr).text();
                    },
                    callback:function(tr){
                        __load__.load_risklevel.load.call(w);
                    },
                    detailParam:function(config){
                        var level=$(".active",$(".risklevel-tab-level-container")).attr("key");
                        var param= $.extend(config,{config_type:"risk_level",param:level});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_risklevel.call(w);}
                },
                security_categoryDeatilTable:{
                    location:function(tr){
                        return $("td:eq(0)",tr).text();
                    },
                    callback:function(tr){
                        __load__.load_security.load.call(w);
                    },
                    detailParam:function(config){
                        var key=$(".active",$(".security-tab-type-container")).attr("key");
                        var param= $.extend(config,{config_type:"security",param:key,limit:10});
                        return param;

                    },
                    detailCallback:function(){__detail_load__.load_security.call(w);}
                },
                finger_rankTopNtable:{
                    location:function(tr){return tr.attr("ref");},
                    callback:function(tr){
                        __load__.load_finger.load.call(w);
                    },
                    detailParam:function(config){
                        var fingerType=appConfig.currentFinger;
                        var param= $.extend(config,{config_type:"finger",finger_type:appConfig.currentFinger,finger_name:appConfig.currentFinger_type,limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_finger.call(w);}
                },
                zeroDayRank:{
                    location:function(tr){return tr.attr("locationref");},
                    callback:function(tr){
                        var key=$(".active",$("#zeroDayRank-tab-warper")).attr("key");
                        __load__.load_zeroday.load.call(w,key);
                    },
                    detailParam:function(config){
                        var key=$(".active",$("#zeroDayRank-tab-warper")).attr("key");
                        var param= $.extend(config,{config_type:"zeroday",param:key,limit:20});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_zeroday.call(w);}
                },
                serverexption_categoryDeatilTable:{
                    location:function(tr){
                        return $("td:eq(0)",tr).text();
                    },
                    callback:function(tr){
                        __load__.load_serverexption.load.call(w);
                    },
                    detailParam:function(config){
                        var key=$(".active",$(".serverexption-tab-type-container")).attr("key");
                        var param= $.extend(config,{config_type:"serverexcetion",param:key,limit:100});
                        return param;
                    },
                    detailCallback:function(){__detail_load__.load_serverexption.call(w);}
                }
            }
            $.each(events,function(tableId,conf){
                $("#"+tableId+" tbody").on("click","tr",function(){
                    var tr=$(this);
                    if(conf.location&&conf.callback){
                        var location=conf.location.call(w,$(tr));
                        event.trigger_jump.call(w,location,conf);
                    }


                });
            });
        },
        echarts_steps_event:function(ecConfig){
            var w=this;
            var events={
                riskLevelRank:function(){
                    __load__.load_risklevel.load.call(w);
                },
                vulsTypeRankCloud:function(param){ /**左侧栏漏洞类型分类点击事件**/
                    //console.info(param.data.sd);
                    __load__.load_riskarea.load.call(w,param.data.sd);
                },
                securityTypeRank:function(){
                    __load__.load_security.load.call(w);
                },
                securityAreaRank:function(){
                    __load__.load_security.load.call(w);
                },
                fingerBar:function(param){
                    __load__.load_finger.load.call(w,param.name);
                },
                main_categoryCycle1:function(param){
                    __load__.load_serverexption.load.call(w);
                },
                main_categoryCycle2:function(param){
                    __load__.load_serverexption.load.call(w);
                },
                main_categoryCycle3:function(param){
                    __load__.load_risklevel.load.call(w);
                },
                main_categoryCycle4:function(param){
                    __load__.load_risklevel.load.call(w);
                },
                main_categoryCycle5:function(param){
                    __load__.load_security.load.call(w);
                }

            }
            for(var i=1;i<=3;i++){ ///**----------main 面板排行top3的饼图的点击事件 ----------**/
                events['main_surveyRankCycle'+i]=function(param){
                    event.trigger_jump.call(w,param.seriesName,{
                        detailParam:function(config){
                            var param= $.extend(config,{config_type:"all",limit:20});
                            return param;
                        },
                        detailCallback:function(){__detail_load__.load_main.call(w);}
                    });

                }
            }
            for(var i=1;i<=3;i++) { ///**----------finger 面板排行top3的饼图的点击事件 ----------**/
                events['finger_Cycle'+i]=function(param){
                    event.trigger_jump.call(w,param.seriesName,{
                        detailParam:function(config){
                            var fingerType=appConfig.currentFinger;
                            var param= $.extend(config,{config_type:"finger",finger_type:appConfig.currentFinger,finger_name:appConfig.currentFinger_type,limit:20});
                            return param;
                        },
                        detailCallback:function(){__detail_load__.load_finger.call(w);}
                    });
                    __load__.load_finger.load.call(w);

                }
            }
            $.each(events,function(key,callback){

                w[key].on(ecConfig.EVENT.CLICK,function(param){
                    callback&&callback.call(w,param);
                });
            });
        },
        map_legend_event:function(ecConfig){
            var w=this;
            event.legend_map_event.call(w,ecConfig,{
                risklevel_Cycle1:{ "tab":".risklevel-tab-level:eq(0)", "value":"高危等级" },
                risklevel_Cycle2:{"tab":".risklevel-tab-level:eq(1)", "value":"中危等级"},
                risklevel_Cycle3:{"tab":".risklevel-tab-level:eq(2)", "value":"低危等级"},
                risklevel_Cycle4:{"tab":".risklevel-tab-level:eq(3)","value":"信息等级" }
            },'risklevel_areaRank',function(tab){
                var level=$(tab).attr("key");
                //console.info(level);
                __load__.load_risklevel.load_risklevel_top5Table.call(w,level);
            });
            event.legend_map_event.call(w,ecConfig,{
                security_Cycle1:{"tab":".security-tab-type:eq(0)", "value":"黑页"},
                security_Cycle2:{"tab":".security-tab-type:eq(1)", "value":"反共"},
                security_Cycle3:{"tab":".security-tab-type:eq(2)", "value":"博彩"},
                security_Cycle4:{"tab":".security-tab-type:eq(4)", "value":"暗链"},
                security_Cycle5:{"tab":".security-tab-type:eq(3)", "value":"色情"}
            },'security_areaRank',function(tab){
                var type=$(tab).attr("key");
                __load__.load_security.load_security_timeDetailTable.call(w,type);
            });

            event.legend_map_event.call(w,ecConfig,{
                serverexption_Cycle1:{"tab": ".serverexption-tab-type:eq(0)",value:"请求无响应"},
                serverexption_Cycle2:{"tab": ".serverexption-tab-type:eq(1)",value:"找不到资源"},
                serverexption_Cycle3:{"tab": ".serverexption-tab-type:eq(2)",value:"服务异常"},
                serverexption_Cycle4:{"tab": ".serverexption-tab-type:eq(3)",value:"僵尸网站"}

            },'serverexption_areaRank',function(tab){
                var type=$(tab).attr("key");
                __load__.load_serverexption.load_serverexption_exampleTable.call(w,type);

            });
        },
        tab_event:function(ecCongig){
            var w=this;
            $(".tab-vlus-type-cloud").bind("click",function(){
                var ref=$(this).attr("ref");
                __load__.load_vulsTypeRankCloud.call(w,ref,function(){
                    $("#vulsTypeRankCloud").removeClass(appConfig.animation).addClass("a-flipinY");
                });

            });
            $(".tab-security-rank").bind("click",function(){
                var ref=$(this).attr("ref");
                $(".view-security-rank").hide();
                if(ref=='securityTypeRank'){
                    __load__.load_securityTypeRank.call(w,function(){
                        $("#"+ref).addClass("a-flipinY");
                    });
                }else{
                    __load__.load_securityAreaRank.call(w,function(){
                        $("#"+ref).addClass("a-flipinY");
                    });
                }
            });

            /***左侧栏 0day 行点击事件  */
            $("body").on("click",".tab-zero-day-rank",function(){
                var ref=$(this).attr("ref");
                __load__.load_zeroDayRank.call(w,ref);
                __load__.load_zeroday.load.call(w,ref);

            });
        }
    }
    var autoPlay={
        start:function(){
            var w=this;
            var province="";
            var city="";
            var nextType="",nextLocation="";
            if(config.type=='china'){
                //do nothing
                nextType='province';
            }else if(config.type=='province'){
                nextType="city";
                province=config.root_value;

            }else{
                return;
            }
            if(!nextType){
                return;
            }

            var later=function(callback,delay){
                setTimeout(function(){
                    callback&&callback();

                },delay||3000);

            }
            var reloadStep=function(){
                __load__.load_main.load.call(w);
                //__reload__.reload_main.load.call(w);
                var call_panels=['load_risklevel','load_riskarea','load_security','load_serverexption','load_zeroday','load_finger'];
                $.each(call_panels,function(i,panel){
                    later(function(){
                        __load__[panel].load.call(w);
                    },i*3000);

                });




            }
            $.post(__ROOT__+"/Admin/Location/getSubLocations",{province:province,city:city}).success(function(json){
                if(!json||!json.length){
                    return;
                }
                (function(){
                    reloadStep();
                    var len=json.length;
                    var index=0;
                    setInterval(function(){
                        var next=json[index];
                        if(config.type=='china'){
                            nextLocation=next;
                        }else{
                            nextLocation=config.root_value+"_"+next;
                        }

                        if(index==json.length){
                            location.href=location.href;
                        }else{
                            event.jump_to_location.call(w,{type:nextType,value:nextLocation})
                            reloadStep();
                            //reloadStep();
                        }
                        index+=1;

                    },3000*7);

                })();

            });

        }
    }
    var swiper = {
        init: function(){

            mySwiper = new Swiper('.swiper-container', {
                loop: true,
                slidesPerView: 4,
                pagination: '.swiper-pagination',
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
                preloadImages:false,
                updateOnImagesReady : true,
                spaceBetween: 5,
                centeredSlides: false,
                autoplay: 2500,
                observer:true,
                autoplayDisableOnInteraction: false
            });
            $('.swiper-container').hover(function(){
                mySwiper.stopAutoplay();
            },function(){
                mySwiper.startAutoplay();
            });
        }
    };

    var boxChange = function(){

        var i = 0;
        var w =  $('.box-tab ul li').width();
        $('.box-tab-l').bind('click', function(){
            i++;
            var len = $(this).parent('.box-tab').find('ul li').length;
            $(this).parent('.box-tab').find('ul').animate({marginLeft: -w*i},'slow');
            if(i>=len-1){
                i=0;
                $(this).parent('.box-tab').find('ul').animate({marginLeft: 0},'slow');
            }


        });
        $('.box-tab-r').bind('click', function(){
            i--;
            var len = $(this).parent('.box-tab').find('ul li').length;

            $(this).parent('.box-tab').find('ul').animate({marginLeft: w*i},'slow');
            if((-i)>=len-1){
                i=0;
                $(this).parent('.box-tab').find('ul').animate({marginLeft: 0},'slow');
            }

        })

    };
    var play = function(){
        $('.play').bind('click', function(){
            if($(this).hasClass('open')){
                $(this).removeClass('open');
                $(this).find('i').removeClass('fa-play').addClass('fa-pause');
            }else{
                $(this).addClass('open');
                $(this).find('i').removeClass('fa-pause').addClass('fa-play');

            }
        })
    };

    $(document).ready(function(){
        app.init();
        swiper.init();
        $('.fancybox',$("#securityEventExample")).fancybox();


        boxChange();
        play();


    });
})();