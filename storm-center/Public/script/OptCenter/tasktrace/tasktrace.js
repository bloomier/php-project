/**
 * Created with JetBrains PhpStorm.
 * User: sakoo
 * Date: 15-9-11
 * Time: 17:08
 * To change this template use File | Settings | File Templates.
 */
(function(){
    var text = $("#detailData").text();
    var btnStyle={
      1:"<div class='badge'>未开始</div>",
      2:"<div class='badge badge-success'>正在扫描</div>",
      0:"<div class='badge badge-danger'>终止</div>",
      3:"<div class='badge badge-yellow'>等待同步</div>",
      4:"<div class='badge badge-warning'>正在同步</div>",
      5:"<div class='badge badge-info'>已同步</div>"
    };

    var o={
        init:function(){

            var w=this;
            w.data=$.parseJSON(text);
            w.policy_group = $.parseJSON(decodeURIComponent($("#policy_group").val()));
            w.policy_detail = $.parseJSON(decodeURIComponent($("#policy_detail").val()));
            w.initBasicInfo();
            w.initPolicyInfo();
            w.initTables();
        },

        initPolicyInfo : function(){
            var w = this;
            var policyList = [];
            if(w.data["task"]["policy_group_id"]){
                var groupId = w.data["task"]["policy_group_id"];
                for(var i = 0; i < w.policy_group.length; i++){
                    var tmp = w.policy_group[i];
                    if(groupId == tmp['id']){
                        policyList = tmp['policy_ids'].split(",");
                    }
                }
            }else{
                policyList = w.data['task']['policy_ids'].split(",");
            }
            var wrapper = $("#scan_policy");
            wrapper.html("");
            $.each(policyList, function(point, item){
                for(var i = 0; i < w.policy_detail.length; i++){
                    var tmp = w.policy_detail[i];
                    if(tmp['id'] == item){
                        var level = "【信息】";
                        if(tmp.level == 30){
                            level = "【低危】";
                        }else if(tmp.level == 40){
                            level = "【中危】";
                        }else if(tmp.level == 50){
                            level = "【高危】";
                        }else if(tmp.level == 60){
                            level = "【安全事件】";
                        }
                        var text = level + tmp['name'];
                        if(tmp['has_danger']){
                            text = level + "【危害】" + item['name'];
                        }
                        var line = $("<div class='drop_one_policy' title='" + tmp['desc'] + "' policy_id='" + tmp['id'] + "'></div>");
                        line.text(text);
                        wrapper.append(line);
                    }
                }
            });
        },

        initTables:function(){
            //全部
            var w=this;
            var slices= w.data.slices||[];
            var historys= w.data.sliceHistorys||[];
            //网站分层 1:未扫描  2:正在扫描  3:未同步  4:正在同步  5:同步完成  0:已终止
            var webs=[];
            slices.forEach(function(o){
                var urls= o.urls.split(",");
                urls.forEach(function(url){
                    if(o.status==1){
                        webs.push({url:url,status:1});
                    }else if(o.status=2){
                        webs.push({url:url,status:2});
                    }else if(o.status=-2){
                        webs.push({url:url,status:0});
                    }
                });
            }) ;
            historys.forEach(function(o){
                var urls= o.urls.split(",");
              //  console.info(o);
                urls.forEach(function(url){
                    if(o.is_sync==1){
                        webs.push({url:url,status:3});
                    }else if(o.is_sync==2){
                        webs.push({url:url,status:4});
                    }else if(o.is_sync==3){
                        webs.push({url:url,status:5});
                    }

                });
            });
           // console.info(webs);
            w.initOneTable($("#table-all"),webs,function(status){
                return true;
            },function(aData){
                var opt=(aData['status']==5)?"<a class='btn blue-stripe mini' href='javascript:void(0)'>查看报告</a>":"";
                return $("<tr><td>"+aData.url+"</td><td></td><td>"+btnStyle[aData.status]+"</td><td>"+opt+"</td></tr>");

            });
            w.initOneTable($("#table-scan-wait"),webs,function(status){
                if(status==1){
                    return true;
                }
                return false;
            });
            w.initOneTable($("#table-scan-ing"),webs,function(status){
                if(status==2){
                    return true;
                }
                return false;
            });
            w.initOneTable($("#table-sync-wait"),webs,function(status){
                if(status==3){
                    return true;
                }
                return false;
            });
            w.initOneTable($("#table-sync-ing"),webs,function(status){
                if(status==4){
                    return true;
                }
                return false;
            });
            w.initOneTable($("#table-sync-finish"),webs,function(status){
                if(status==5){
                    return true;
                }
                return false;
            },function(aData){
                var opt="<a class='btn blue-stripe mini' href='javascript:void(0)'>查看报告</a>";
                return $("<tr><td>"+aData.url+"</td><td></td><td>"+btnStyle[aData.status]+"</td><td>"+opt+"</td></tr>");

            });



        },
        initOneTable:function(table,data,filter,draw){
                var tbody=$("tbody",table);
                data.forEach(function(aData){
                    if(filter(aData['status'])){
                        var tr;
                        if(!draw){
                            tr= $("<tr><td>"+aData.url+"</td><td></td><td>"+btnStyle[aData.status]+"</td></tr>");
                        }else{
                            tr= draw.call(this,aData);
                        }
                      tr.appendTo(tbody);

                    }
                });
                table.dataTable($.extend(storm.defaultStaticGridSetting(),{
                    "bInfo":true,
                    "bLengthChange":true
                }));



        },
        initBasicInfo:function(){
            var w=this;
            //扫描进度进度条
            var finished= w.data.task.slice_total_num-w.data.task.slice_remain_num;
            var scanProgress=(finished*100/w.data.task.slice_total_num).toFixed(0);
            $(".progress-bar",$(".scan-progress")).css("width",scanProgress+"%");
            if(w.data.task.status==2){
                $(".progress-bar",$(".scan-progress")).addClass("active");
            }
            //同步进度条
            var historys= w.data.sliceHistorys;
            var synced=0;
            if(historys&&historys.length){
                historys.forEach(function(his){
                    if(his.is_sync==2){
                        synced+=0.5;
                    }else if(his.is_sync==3){
                        synced+=1;
                    }
                });
            }
            var syncProgress=(synced*100/w.data.task.slice_total_num).toFixed(0);
            $(".progress-bar",$(".sync-progress")).css("width",syncProgress+"%");
            //扫描时间
            var scanTime="";
            if(w.data.task.status!=1&&w.data.task.start_time){

                scanTime+=(w.data.task.start_time+" 至 ");
                if(w.data.task.status==3&&w.data.task.end_time){
                    scanTime+=w.data.task.end_time;

                }
            }
            $(".scan_time").text(scanTime);

            if(w.data.task.status==3&&w.data.useTime){
                $(".use_time").text(w.data.useTime);
            }

            //设置任务进度
            var wraper=$(".plan");
            w.data.task.create_time&&w.findItem($(".step1",wraper)).text(w.data.task.create_time);

            if(w.data.task.status!=1){
                $(".step2",wraper).addClass("green").addClass("fa-check-circle").removeClass("fa-circle");
                w.data.task.start_time&&w.findItem($(".step2",wraper)).text(w.data.task.start_time);
                w.findItem($(".step3",wraper),'.date').text('扫描 '+scanProgress+"%");
                w.findItem($(".step4",wraper),'.date').text('同步 '+syncProgress+"%");
            }

            if(w.data.task.status==3||w.data.task.status==-2){
                var color=(w.data.task.status==3?"green":"red");
                $(".step3",wraper).addClass(color).addClass("fa-check-circle").removeClass("fa-circle");
                $(".step4",wraper).addClass(color).addClass("fa-check-circle").removeClass("fa-circle");
                var task_status;
                if(syncProgress == 100 || w.data.task.status==-2){
                    if(w.data.task.status == -2){
                        task_status = "<span class='text-danger'>扫描终止</span>";
                        $(".task_status_point").html(task_status);
                    }
                    $(".step5",wraper).addClass(color).addClass("fa-check-circle").removeClass("fa-circle");
                }else{
                    var status = "正在同步";
                    if(historys.length == 1){
                        var is_sync = historys[0]['is_sync'];
                        if(is_sync == 1){
                            status = "等待同步";
                        }
                    }else{
                        if(0 == syncProgress){
                            status = "等待同步";
                        }
                    }
                    task_status = "<span class='text-success'>" + status + "</span>&nbsp;&nbsp;<span class='fa fa-spinner fa-spin'></span>";
                    $(".task_status_point").html(task_status);
                }

            }
        },
        findItem:function(cycle,cls){
            var pli=cycle.parent();
            if(!cls){
                cls=".date";
            }
            var dateItem=pli.siblings(cls);
            return dateItem;
        }





    };
    $(function(){
        o.init();


    })

})();
