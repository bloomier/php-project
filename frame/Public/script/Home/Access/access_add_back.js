


(function(){

    var canSelectSites = $("#canSelectSites").val();
    var selectedSites = $("#selectedSites").val();
    var currentObject = $("#currentObject").val();
    var __tree__ = {

        // 自定义样式
        addDiyDom : function(treeId, treeNode){
            var spaceWidth = 2;
            var switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico");
            switchObj.remove();
            icoObj.before(switchObj);
            if (treeNode.level > 1) {
                var spaceStr = "<span style='display: inline-block;width:" + (spaceWidth * treeNode.level)+ "px'></span>";
                switchObj.before(spaceStr);
            }
        },

        // 添加节点
        addNode:function(treeNode, src, dest,direction){
            src.removeNode(treeNode);
            var pId = treeNode['pId'];
            var parentNode = dest.getNodeByParam('id', null);
            dest.addNodes(parentNode, {id:treeNode['id'], pId:pId, name:treeNode['name'],value:treeNode['value'], open:true});

            if(direction == 'right'){
                for(var i=0;i<canSelectSites.length;i++){
                    if(canSelectSites[i]['value'] == treeNode['value']){
                        canSelectSites.splice(i,1);
                    }
                }
                selectedSites.push(treeNode);
            }
            if(direction == 'left'){
                for(var i=0;i<selectedSites.length;i++){
                    if(selectedSites[i]['value'] == treeNode['value']){
                        selectedSites.splice(i,1);
                    }
                }
                canSelectSites.push(treeNode);
            }
        },

        // 左侧的双击事件
        srcDbclick : function(event, treeId, treeNode){
            var src = $.fn.zTree.getZTreeObj("srcTree");
            var dest = $.fn.zTree.getZTreeObj("destTree");
            __tree__.addNode(treeNode, src, dest,'right');
        },

        // 右侧的双击事件
        destDbclick : function(event, treeId, treeNode){
            var src = $.fn.zTree.getZTreeObj("destTree");
            var dest = $.fn.zTree.getZTreeObj("srcTree");
            __tree__.addNode(treeNode, src, dest,'left');
        }

    };
    // 源操作
    var src_setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: true,
            dblClickExpand: false,
            addDiyDom: __tree__.addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onDblClick:__tree__.srcDbclick
        }
    };

    // 目标操作
    var dest_setting = {
        view: {
            showLine: false,
            showIcon: false,
            selectedMulti: true,
            dblClickExpand: false,
            addDiyDom: __tree__.addDiyDom
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onDblClick:__tree__.destDbclick
        }
    };


    var o={
        init:function(){
            $(".div_ip").hide();
            $(".for-time").hide();
            $('#select_site_id').select2();
            o.initTree();
            o.handler();
            o.view();
        },
        view:function(){

            currentObject = functions.convert(currentObject);
            if(currentObject){
                var level = currentObject['level'];
                $('.level_select_' + level).click();
                if(currentObject['level'] == 'url'){

                    if(currentObject['match']['domain'].length == 1){
                        //$('#select_site_id').val(currentObject['match']['domain'][0]);
                        var tt = currentObject['match']['domain'][0];
                        $('#select_site_id').select().val(tt).trigger('change');
                        //$('#select_site_id').select2("val", tt);
                        //$('#select_site_id').select2({"val": tt});
                        //$("#select_site_id").trigger('change');
                    }
                }

                if(currentObject.action == 'block'){
                    $('input[type="radio"][name="action"]').eq(1).attr("checked","checked");
                    $('input[type="radio"][name="action"]').eq(0).removeAttr("checked");
                    $('input[type="radio"][name="action"]').eq(1).click();
                } else {
                    $('input[type="radio"][name="action"]').eq(0).attr("checked","checked");
                    $('input[type="radio"][name="action"]').eq(1).removeAttr("checked");
                    $('input[type="radio"][name="action"]').eq(0).click();
                }
                if(currentObject.expire == 0){
                    $('input[type="radio"][name="time"]').eq(0).attr("checked","checked");
                    $('input[type="radio"][name="time"]').eq(1).removeAttr("checked");
                    $('input[type="radio"][name="time"]').eq(0).click();
                } else {
                    $('input[type="radio"][name="time"]').eq(1).attr("checked","checked");
                    $('input[type="radio"][name="time"]').eq(0).removeAttr("checked");
                    $('input[type="radio"][name="time"]').eq(1).click();
                    var expire = currentObject.expire;
                    //if ( expire > 86400){
                    //    $("#day_id").val(parseInt(expire / 86400));
                    //    expire = expire % 86400;
                    //}
                    if( expire > 3600) {
                        var hour = parseInt(expire / 3600);
                        if(hour != 0){
                            $("#hour_id").val(hour);
                        }
                        expire = expire % 3600;
                    }
                    if( expire > 60 ){
                        var minutes = parseInt(expire / 60);
                        if(minutes != 0){
                            $("#minutes_id").val(minutes);
                        }
                    }
                    $(".for-time").show();
                }

                if(currentObject.match){
                    if(currentObject.match.sip){
                        //设置当前ip
                        var ip = currentObject.match.sip[0][0];
                        $("#ip_id").val(ip);
                        //设置forward层级
                        //var forwarded = currentObject.match.sip[0][1];
                        //for(var i = 1, num = 4; i < num; i++){
                        //    var data = $('.X-Forwarded-For').eq(i).attr("data");
                        //    if(forwarded == data){
                        //        $('.X-Forwarded-For').eq(i).parent().addClass('active');
                        //        $('.X-Forwarded-For').eq(0).parent().removeClass('active');
                        //        break ;
                        //    }
                        //}
                    }
                }

                if(currentObject.match){
                    if(currentObject.match.url){
                        var urls = currentObject.match.url;
                        $("#urls_id").val(urls.join("\n"));
                    }
                }
                if(currentObject.desc){
                    $("#desc_id").val(currentObject.desc);
                }
            }
        },
        initTree: function(){
            canSelectSites = functions.convert(canSelectSites);
            selectedSites = functions.convert(selectedSites);
            $.each(canSelectSites, function(point, item){
                $("#select_site_id").append($("<option value='" + item['value'] +"'>" + item['name'] + "</option>"));
            });
            $.each(selectedSites, function(point, item){
                $("#select_site_id").append($("<option value='" + item['value'] +"'>" + item['name'] + "</option>"));
            });
            //var srcNode = functions.initNode(leaveIds);
            var srcNode = functions.initNode(canSelectSites);
            var targetNode = functions.initNode(selectedSites);
            o.initTreeOne("srcTree", srcNode,src_setting);
            o.initTreeOne("destTree", targetNode, dest_setting);
        },
        // 初始化树
        initTreeOne:function(target, zNodes, setting){
            var treeObj = $("#" + target + "");
            $.fn.zTree.init(treeObj, setting, zNodes);
            treeObj.hover(function () {
                if (!treeObj.hasClass("showIcon")) {
                    treeObj.addClass("showIcon");
                }
            }, function() {
                treeObj.removeClass("showIcon");
            });
        },
        handler:function(){
            var w=this;


            $(".btn-save").bind("click", function(){
                functions.addAccess();
            });

            $('.btn-back').bind("click", function(){
                var href = __ROOT__ + "/Home/Access/index";
                window.location.href = href;
            });

            $(".query-reset-src").bind("click", function(){
                var tmp = $(".policy-query-param-src").val();
                var srcNode = [];
                if(tmp == ''){
                    srcNode = functions.initNode(canSelectSites);

                }else{
                    srcNode = functions.initNode(canSelectSites, tmp);
                }
                o.initTreeOne("srcTree", srcNode,src_setting);
                return false;
            });

            $(".query-reset-dest").bind("click", function(){
                var tmp = $(".policy-query-param-dest").val();
                var srcNode = [];
                if(tmp == ''){
                    srcNode = functions.initNode(selectedSites);

                }else{
                    srcNode = functions.initNode(selectedSites, tmp);
                }
                o.initTreeOne("destTree", srcNode,dest_setting);
                return false;
            });

            // 将左边全部添加到右边
            $(".all-right").bind("click", function(){
                var srcNode = functions.initNode({});
                var srcZTree = $.fn.zTree.getZTreeObj("srcTree");
                var tempNodes = srcZTree.getNodes();
                $.each(tempNodes,function(point,item){
                    for(var i=0;i<canSelectSites.length;i++){
                        if(canSelectSites[i]['value'] == item['value']){
                            canSelectSites.splice(i,1);
                        }
                    }
                });
                o.initTreeOne("srcTree", srcNode,src_setting);
                $.extend(selectedSites,tempNodes);

                var targetNode = functions.initNode(selectedSites);
                o.initTreeOne("destTree", targetNode, dest_setting);
            });

            // 将右边全部添加到左边
            $(".all-left").bind("click", function(){
                var srcZTree = $.fn.zTree.getZTreeObj("destTree");
                var tempNodes = srcZTree.getNodes();
                $.each(tempNodes,function(point,item){
                    for(var i=0;i<selectedSites.length;i++){
                        if(selectedSites[i]['value'] == item['value']){
                            selectedSites.splice(i,1);
                        }
                    }
                });

                $.extend(canSelectSites,tempNodes);
                var srcNode = functions.initNode({});
                o.initTreeOne("destTree", srcNode,dest_setting);

                var targetNode = functions.initNode(canSelectSites);
                o.initTreeOne("srcTree", targetNode, src_setting);

            });

            $(".for-time-radio-checked").bind("click", function(){
                var c = this;
                if($(this).attr("checked")){
                    $(".for-time").show();
                }
            });

            $(".for-time-radio-nochecked").bind("click", function(){
                var c = this;
                if($(this).attr("checked")){
                    $(".for-time").hide();
                }
            });

            $(".level_select_ip").bind("click", function(){
                var c = this;
                if($(this).attr("checked")){
                    $(".div_ip").hide();
                }
            });

            $(".level_select_site").bind("click", function(){
                $(".div_ip").hide();
                $(".div_site").show();

            });

            $(".level_select_url").bind("click", function(){
                //var c = this;
                //if($(this).attr("checked")){
                    $(".div_ip").hide();
                    $(".div_url").show();
                //}
            });

        }
    };


    var setting = {
        ipRegex: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
        contactList : [],    // 可添加联系人列表
        contactAddList : [], // 已添加联系人列表
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
        }
    }

    var functions = {
        //转换数据
        convert:function(value){
            value = decodeURIComponent(value);
            value = $.parseJSON(value);
            return value;
        },
        //初始化节点
        initNode : function(src, param){
            var node = [];
            if(!src || src.length == 0){
                return node;
            }
            $.each(src, function(point, item){
                var pId = item['pId'];
                //if(pId){
                    if(param){
                        if(item['name'].indexOf(param) > -1){
                            node.push({id:item['id'], pId:pId, name:item['name'], value:item['value']});
                        }
                    }else{
                        node.push({id:item['id'], pId:pId, name:item['name'], value:item['value']});
                    }
                //}
            });
            return node;
        },
        addAccess: function(){

            var ip = $.trim($("#ip_id").val());
            if(ip == ''){
                storm.alertMsg('请填写ip',"danger");
                return ;
            }
            if(!setting.ipRegex.test(ip)){
                storm.alertMsg('请填写合法ip',"danger");
                return ;
            }

            //var forwardedData = $(".active").children().attr("data");

            var action = $('input[type="radio"][name="action"]:checked').val();

            var time = $('input[type="radio"][name="time"]:checked').val();

            var level = $('input[type="radio"][name="level"]:checked').val();

            if(time == 1){//最长时长为3小时
                //var day = $("#day_id").val();
                var hour = $("#hour_id").val();
                var minutes = $("#minutes_id").val();
                //time = day * 24 * 60 * 60 + hour * 60 * 60 + minutes * 60;
                time = hour * 60 * 60 + minutes * 60;
                if(time == 0){
                    storm.alertMsg('请填写限定时间',"danger");
                    return ;
                }
            }

            var dest = $.fn.zTree.getZTreeObj("destTree");
            var nodes = dest.getNodes();
            var domainList = []
            $.each(nodes, function(point, item){
                domainList.push(item['value'])
            });
            var domains = domainList.join(",");

            var urlDomain = $('#select_site_id').val();

            var urlList = [];
            var urlTmp = $("#urls_id").val().split("\n");
            $.each(urlTmp, function(point, item){
                var tmp = $.trim(item);
                if(tmp != '' ){
                    urlList.push(tmp);
                }
            });

            var urls = urlList.join(",");

            var desc = $("#desc_id").val();
            var param = {ip: ip,  action: action,
                level: level, urlDomain: urlDomain,
                expire: time,domains: domains,
                urls: urls, desc: desc};
            if(currentObject){
                $.extend(param, {_id: currentObject._id});
            }
            $.post(__ROOT__ + "/Home/Access/addOrUpdateAccess",param).success(function(json){
                Message.init({
                    text: json.msg,
                    type: 'success'
                });
                if(json.code && json.code == 1){
                    var href = __ROOT__ + "/Home/Access/index";
                    window.location.href = href;
                }
            });
        }
    }




    $(document).ready(function(){
        o.init();

    });

})();
