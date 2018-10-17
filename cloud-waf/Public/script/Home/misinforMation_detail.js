var misinforMation={
    init:function(){
        var w = this;
        w.initWdate();
        w.selTime();
        w.logDetail();
        w.init_handle();
        w.init_zTree();
    },
    selTime:function(){
        var w = this;
        $("#selectTime").live("click",function(){
            var startTime = ($("#startTime").val()).replaceAll("-","/");
            var endTime = ($("#endTime").val()).replaceAll("-","/");
            var startTimeL = new Date(startTime);
            var endTimeL = new Date(endTime);
            var policyId = $("label[name='policyId']",$("#policyForm")).text();
            var param = {};
            param['start'] = parseInt(startTimeL.getTime()/1000);
            param['end'] = parseInt(endTimeL.getTime()/1000);
            param['policyId'] = policyId;
            $.post(__WEBROOT__+ "/Home/WAFMisAnalysis/selPolicy",param).success(function(json){
                $.each(json['items'][0],function(k,v){
                    $("[name='"+k+"']",$("#policyForm")).text(v);
                });

            });

        });
    },
    initWdate:function(){
        $("#startTime").click(function(){
            WdatePicker({maxDate:"#F{$dp.$D('endTime') || '%y-%M-%d %H:%m'}",dateFmt:"yyyy-MM-dd HH:mm"});
        });
        $("#endTime").click(function(){
            WdatePicker({maxDate:"%y-%M-%d %H:%m",minDate:"#F{$dp.$D('startTime')}",dateFmt:"yyyy-MM-dd HH:mm"});
        });
    },

    logDetail:function(){
        var w = this;
        var tbody = $("tbody",$(".correlativeLog"));
        tbody.html("");
        for(var i=0;i<3;i++){
            var tr = '<tr class="url_detail"> ' +
                '<td style="width: 80%">百度</td> ' +
                '<td style="width: 20%"><input type="checkbox"/>加入白名单</td> ' +
                '</tr>';
            tbody.append(tr);
            var addTable = w.addTable(['1','2','3']);
            addTable.hide().appendTo(tbody);
        }
        $("tr.detail:first",$(tbody)).show().css('display',"");
        $(".url_detail").on("click",function(){
            $("tr.detail",$(tbody)).hide();
            $(this).next("tr").show().css('display',"");
        });
    },

    addTable:function(data){
        var outTr = $("<tr class='detail'></tr>");
        var outTd = $("<td colspan='2'></td>");
        var insideTable = $("<table class='u-grid'></table>");
        var insideThead = $("<thead><th>时间</th><th>URL</th><th>请求方式</th><th>post数据</th><th>攻击特征码</th><th>动作</th><th>操作</th></thead>");
        insideTable.append(insideThead);
        var insideTbody = $("<tbody></tbody>");
        $.each(data,function(k,v){
            var insideTr = $("<tr><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>" +
            "<a href='#'>详情</a></td></tr>");
            insideTbody.append(insideTr);
        });
        insideTable.append(insideTbody);
        outTd.append(insideTable);
        outTr.append(outTd);
        return outTr;

    },

    init_zTree:function(){
        var w = this;
        var policyId = $("label[name='policyId']",$("#policyForm")).text();
        $.post(__WEBROOT__+ "/Home/WAFMisAnalysis/getZtreeNodes",{'policyId':policyId}).success(function(json){
            var src_setting = __function__.getZTreeSetting(null,__zTree__.srcDblClick);
            $.fn.zTree.init($("#srcTree"), src_setting, json['canSelectNodes']);
            var dest_setting = __function__.getZTreeSetting(null,__zTree__.destDblClick);
            $.fn.zTree.init($("#destTree"),dest_setting,json['selectedNodes']);
            global.canSelectNodes = json['canSelectNodes'];
            global.selectedNodes = json['selectedNodes'];
            global.selectedUrls = json['urls'];
            $("#select_site_id").html("");
            $("#select_site_id").append("<option>请选择站点</option>");
            $.each(json['canSelectNodes'],function(k,v){
                var option = $("<option value='" + v['value'] +"'>" + v['name'] + "</option>");
                $("#select_site_id").append(option);
            });
            $("#urls_id").val('');
            $("#select_site_id").on('change',function(){
                var flag = true;
                var curDomain = $(this).val();
                var curUrls = json['urls']?json['urls']:[];
                $.each(curUrls,function(point,item){
                    if(item['domain'] == curDomain){
                        $("#urls_id").val(item['urls'].join('\n'));
                        flag = false;
                    }
                });
                if(flag){
                    $("#urls_id").val('');
                }

            });
            $(".all-right").on('click',function(){
                __zTree__.allNodesMove("srcTree","destTree",__zTree__.srcDblClick,__zTree__.destDblClick,'right');
            });

            $(".all-left").on('click',function(){
                __zTree__.allNodesMove("destTree","srcTree",__zTree__.destDblClick,__zTree__.srcDblClick,'left');
            });

            $(".query-reset-src").on("click",function(){
                __zTree__.selectZTree("srcTree","policy-query-param-src",src_setting,'right');
            });

            $(".query-reset-dest").on("click",function(){
                __zTree__.selectZTree("destTree","policy-query-param-dest",dest_setting,'left');
            });
        });
    },

    init_handle:function(){
        var w = this;
        $('li:eq(0)',$(".sub-nav-tab")).on('click',function(){
            global.policyStart=false;
            $(".selectLevel").hide();
            $(".siteWhiteList").hide();
            $(".urlWhiteList").hide();
        });
        $('li:eq(1)',$(".sub-nav-tab")).on('click',function(){
            $(".selectLevel").show();
            global.policyStart=true;
            w.initRuleManage();

        });

        $(".level_select_ip").on('click',function(){
            $(".siteWhiteList").hide();
            $(".urlWhiteList").hide();
        });
        $(".level_select_site").on('click',function(){
            $(".siteWhiteList").show();
            $(".urlWhiteList").hide();
        });
        $(".level_select_url").on('click',function(){
            $(".siteWhiteList").hide();
            $(".urlWhiteList").show();
        });

        $(".btn-save").on('click',function(){
            var level = $('input[type="radio"][name="level"]:checked').val();
            var policyId = $("label[name='policyId']",$("#policyForm")).text();
            var globalParam = {};
            globalParam['policyId'] = [];
            globalParam['policyId'].push(policyId);
            if(global.policyStart){
                globalParam['config'] = true;
                $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",globalParam).success(function(json){
                    if(json['code']){
                        if(level == 'allSite'){
                            var allSite = {};
                            allSite['policyId'] = [];
                            allSite['policyId'].push(policyId);
                            allSite['allSite'] = '1';
                            $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(json){
                                location.href=__WEBROOT__+ "/Home/WAFMisAnalysis/index";
                            });
                        }
                        if(level == 'site'){
                            var domain = [];
                            var destTree = $.fn.zTree.getZTreeObj("destTree");
                            var nodes =  destTree.getNodes();
                            $.each(nodes,function(k,v){
                                domain.push(v['value']);
                            });
                            var sitePolicyParam = {};
                            sitePolicyParam['policyId'] = policyId;
                            sitePolicyParam['domains'] = domain;
                            $.post(__WEBROOT__+ "/Home/PolicyList/sitePolicy",sitePolicyParam).success(function(json){
                                if(json['code']){
                                    location.href=__WEBROOT__+ "/Home/WAFMisAnalysis/index";
                                }else{
                                    storm.alert(json['msg']);
                                }
                            });


                        }
                        if(level == 'url'){
                            var urlPolicyParam = {};
                            urlPolicyParam['policyId'] = policyId;
                            urlPolicyParam['domain'] = $("#select_site_id").val();
                            var urlstr = $("#urls_id").val();
                            urlstr = urlstr.replaceAll('http://','');
                            var urls = urlstr.split('\n');
                            urlPolicyParam['urls'] = [];
                            $.each(urls,function(i,v){
                                if($.trim(v).length>0){
                                    urlPolicyParam['urls'].push($.trim(v));
                                }
                            });
                            $.post(__WEBROOT__+ "/Home/PolicyList/urlPolicy",urlPolicyParam).success(function(json){
                                if(json['code']){
                                    location.href=__WEBROOT__+ "/Home/WAFMisAnalysis/index";
                                }else{
                                    storm.alert(json['msg']);
                                }
                            });

                        }

                    }else{
                        storm.alert(json['msg']);
                    }
                });



            }else{
                globalParam['config'] = false;
                $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",globalParam).success(function(json){
                    if(json['code']){
                        var allSite = {};
                        allSite['policyId'] = [];
                        allSite['policyId'].push(policyId);
                        allSite['allSite'] = '0';
                        $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(json){
                            location.href=__WEBROOT__+ "/Home/WAFMisAnalysis/index";
                        });
                    }else{
                        storm.alert(json['msg']);
                    }
                })
            }
        });

    },
    initRuleManage:function(){
        var w = this;
        $.post(__WEBROOT__ + "/Home/PolicyList/getPolicyRelation").success(function(json){
            var policyId = $("label[name='policyId']",$("#policyForm")).text();
            var policyMsg = json[policyId];
            if(policyMsg&&policyMsg['domains']&&policyMsg['domains'].length>0){
                $('input[type="radio"][value="site"]').attr('checked','checked');
                $(".level_select_site").trigger('click');
            }else if(policyMsg&&policyMsg['urls']&&policyMsg['urls'].length>0){
                $('input[type="radio"][value="url"]').attr('checked','checked');
                $("#select_site_id").val(policyMsg['urls'][0]['domain']);
                $("#select_site_id").trigger('change');
                $(".level_select_url").trigger('click');
            }else{
                $('input[type="radio"][value="allSite"]').attr('checked','checked');
            }
        })
    }
};
var __function__ = {
    getZTreeSetting:function(addDiyDom,dbclick){
        var ztreeSetting ={
            view: {
                showLine: false,
                showIcon: false,
                selectedMulti: true,
                dblClickExpand: false,
                addDiyDom: addDiyDom
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onDblClick:dbclick
            }
        };

        return ztreeSetting;
    }


};

var setting = {
    ztreeSetting : {
        check:{
            enable:true
        },
        data:{
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        view:{
            showIcon: false
        }
    },
    src_setting : {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: true,
            dblClickExpand: false
            //addDiyDom: __tree__.addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            //onDblClick:__tree__.srcDbclick
        }
    }
};

var __zTree__ = {
    addNode:function(treeNode,src,dest,direction){
        src.removeNode(treeNode);
        var parentNode = dest.getNodeByParam('id', null);
        dest.addNodes(parentNode,treeNode);
        if(direction == 'right'){
            for(var i = 0;i<global.canSelectNodes.length;i++){
                if(global.canSelectNodes[i]['value'] == treeNode['value']){
                    global.canSelectNodes.splice(i,1);
                }
            }
            global.selectedNodes.push(treeNode);
        }

        if(direction == 'left'){
            for(var i = 0;i<global.selectedNodes.length;i++){
                if(global.selectedNodes[i]['value'] == treeNode['value']){
                    global.selectedNodes.splice(i,1);
                }
            }

            global.canSelectNodes.push(treeNode);
        }

    },
    srcDblClick:function(event, treeId, treeNode){
        var src = $.fn.zTree.getZTreeObj("srcTree");
        var dest = $.fn.zTree.getZTreeObj("destTree");
        __zTree__.addNode(treeNode,src,dest,'right');

    },
    destDblClick:function(event, treeId, treeNode){
        var src = $.fn.zTree.getZTreeObj("srcTree");
        var dest = $.fn.zTree.getZTreeObj("destTree");
        __zTree__.addNode(treeNode,dest,src,'left');
    },
    allNodesMove:function(srcTarget,destTarget,srcDblClick,destDblClick,direction){
        var src = $.fn.zTree.getZTreeObj(srcTarget);
        var dest = $.fn.zTree.getZTreeObj(destTarget);
        var srcNodes = src.getNodes();
        var destNodes = dest.getNodes();

        if(direction == "right"){
            $.each(srcNodes,function(point,item){
                for(var i=0;i<global.canSelectNodes.length;i++){
                    if(global.canSelectNodes[i]['value'] == item['value']){
                        global.canSelectNodes.splice(i,1);
                    }
                }

                global.selectedNodes.push(item);
            });
        }
        if(direction == "left"){
            $.each(srcNodes,function(point,item){
                for(var i=0;i<global.selectedNodes.length;i++){
                    if( global.selectedNodes[i]['value'] == item['value']){
                        global.selectedNodes.splice(i,1);
                    }
                }
                global.canSelectNodes.push(item);
            });
        }

        var newsrc = [];
        var newdest = $.merge(srcNodes,destNodes);

        var src_setting = __function__.getZTreeSetting(null,srcDblClick);
        $.fn.zTree.init($("#"+srcTarget), src_setting, newsrc);
        var dest_setting = __function__.getZTreeSetting(null,destDblClick);
        $.fn.zTree.init($("#"+destTarget),dest_setting,newdest);

    },
    selectZTree:function(target,keyTarget,zTreeSetting,direction){
        if(direction == 'right'){
            var nodes = global.canSelectNodes;
        }
        if(direction == 'left'){
            var nodes = global.selectedNodes;
        }
        var selKey = $.trim($("."+keyTarget).val());
        var newNodes = [];
        $.each(nodes,function(point,item){
            if(item['name'].indexOf(selKey)>-1){
                newNodes.push(item);
            }
        });
        if(!selKey){
            if(direction == 'right'){
                $.fn.zTree.init($("#"+target),zTreeSetting,global.canSelectNodes);
            }
            if(direction == 'left'){
                $.fn.zTree.init($("#"+target),zTreeSetting,global.selectedNodes);
            }
        }else{
            $.fn.zTree.init($("#"+target),zTreeSetting,newNodes);
        }
    }

};

var global = {
    canSelectNodes:[],
    selectedNodes:[],
    policyStart:false
};

$(function(){
    misinforMation.init();

});