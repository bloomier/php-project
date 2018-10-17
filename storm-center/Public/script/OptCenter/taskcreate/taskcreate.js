/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){


    var domainInfoList = [];
    var domainInfoListSrc = [];
    var srcDomainList;

    $(document).ready(function(){

        srcDomainList = $("#srcDomainList").val();
        srcDomainList = decodeURIComponent(srcDomainList);

        __init__.initView();
        __init__.addHandler();
    });

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
                "iDisplayLength": 10,//每页显示10条数据
                "oLanguage": zh_CN,
                "bSort":true,//不支持排序
                "bSortClasses":true,
                "sPaginationType":"bs_full",
                "bLengthChange": true,
                "bDestroy": true,
                "bInfo":true,
                "aLengthMenu": [10, 25, 50],
                "bRetrieve": true,
                "bAutoWidth": true//自动宽度

            };
            return gridSetting;

        }
    }


    var __init__={
        initView:function(){
            if(srcDomainList.split(",").length > 0){
                $.ajax({
                    type: "POST",
                    url: __ROOT__ + "/OptCenter/TaskCreate/domainListHistory",
                    data: {domainList:srcDomainList},
                    dataType: "json",
                    async: true,
                    success : function(json){
                        if(json['code']){
                            $.each(json['rows'], function(point, item){
                                domainInfoList.push(item);
                                domainInfoListSrc.push(item);
                            });
                        }
                        __init__.initTable(domainInfoList);
                    }
                });
            }
        },

        addHandler:function(){
            // 添加单个域名
            $(".add-one-domain").bind("click", function(){
                var param = $.trim($(".one-domain").val());
                if(!param){
                    Message.init({
                        text: '域名不能为空!',
                        type: 'warning' //info success warning danger
                    });
                    return;
                }
                for(var i = 0; i < domainInfoList.length; i++){
                    var tmp = domainInfoList[i];
                    if(tmp['domain'] == param){
                        Message.init({
                            text: '域名已存在，不能重复添加!',
                            type: 'warning' //info success warning danger
                        });
                        return;
                    }
                }
                $.each(domainInfoList, function(){});
                var paramList = param;
                var thisBtn = $(this);
                thisBtn.attr("disabled", 'disabled');
                $.ajax({
                    type: "POST",
                    url: __ROOT__ + "/OptCenter/TaskCreate/domainListHistory",
                    data: {domainList:paramList},
                    dataType: "json",
                    async: true,
                    success : function(json){
                        if(json['code']){
                            domainInfoList.push(json['rows'][0]);
                            domainInfoListSrc.push(json['rows'][0]);
                        }
                        thisBtn.removeAttr("disabled");
                        __init__.initTable();
                    }
                });
            });

            // 绑定input file
            $("#sourcefile").fileinput({
                'allowedFileExtensions' : ['txt'],// 过滤文件类型(只接受txt文件)
                'showCaption' : true, //是否显示文件名
                'showPreview' : false,// 是否显示文件预览内容
                'uploadUrl': __ROOT__ + "/OptCenter/TaskCreate/upload",// 文件上传url
                'ajaxSettings':{
                    success:__file__.success // 操作成功内容
                }
            });

            // 删除所有已监测
            $(".btn-all-check-group").bind("click",function(){
                var tmp = [];
                $.each(domainInfoList, function(point, item){
                    item['timestamp'] ? 0 : tmp.push(item);
                });
                domainInfoList = tmp;
                __init__.initTable();
            });

            // 删除所有7天内
            $(".btn-7-check-group").bind("click",function(){
                var tmp = [];
                $.each(domainInfoList, function(point, item){
                    item['lastTime'] ? (item['lastTime'] < 7 ? 0 : tmp.push(item)) : tmp.push(item);
                });
                domainInfoList = tmp;
                __init__.initTable();
            });

            // 删除所有30天内
            $(".btn-30-check-group").bind("click",function(){
                var tmp = [];
                $.each(domainInfoList, function(point, item){
                    item['lastTime'] ? (item['lastTime'] < 30 ? 0 : tmp.push(item)) : tmp.push(item);
                });
                domainInfoList = tmp;
                __init__.initTable();
            });

            // 删除所有30天内
            $(".btn-30-check-group").bind("click",function(){
                var tmp = [];
                $.each(domainInfoList, function(point, item){
                    item['lastTime'] ? (item['lastTime'] < 30 ? 0 : tmp.push(item)) : tmp.push(item);
                });
                domainInfoList = tmp;
                __init__.initTable();
            });

            // 重置
            $(".btn-reset-check-group").bind("click",function(){
                domainInfoList = domainInfoListSrc;
                __init__.initTable();
            });

            // 删除按钮
            $(".domainList-delete").live("click", function(){
                var domain = $(this).attr("domain");
                var tmp = [];
                $.each(domainInfoList, function(point, item){
                    item['domain'] == domain ? 0 : tmp.push(item);
                });
                domainInfoList = tmp;
                __init__.initTable();
            });

            // 下一步按钮绑定事件[提交form表单]
            $(".task-create-next-btn").bind("click", function(){
                var form = $(".task-create-next-form");
                var domains = [];
                $.each(domainInfoList, function(point, item){
                    domains.push(item['domain']);
                });
                if(domains.length == 0){
                    Message.init({
                        text: "扫描域名列表不能为空！",
                        type: 'danger' //info success warning danger
                    });
                    return false;
                }
                $("input[name='domainList']").val(domains.join(","));
                form.attr("action", __ROOT__ + "/OptCenter/TaskCreate/nextStmp");
                form.submit();
            });
        },
        initTable : function(){
            $("#table-wraper").html("");
            var table=$("#task-domain-table").clone().removeAttr("id").show().appendTo($("#table-wraper"));
            $.each(domainInfoList, function(point, item){
                var tr = $("<tr></tr>");
                var domain = item['domain'];
                var title = item['title'] ? item['title'] : "";
                var lastTime = item['lastTime'] ? item['lastTime'] : 0;
                var checkTime = item['timestamp'] ? item['timestamp'] : '';
                if(domain.length > 20){
                    var addr = $("<abbr title='" + domain + "'>" + domain.substr(0,15) + "...</abbr>");
                    tr.append($("<td></td>").append(addr));
                }else{
                    tr.append($("<td>" + domain + "</td>"));
                }
                if(title.length > 15){
                    var addr = $("<abbr title='" + title + "'>" + title.substr(0,10) + "...</abbr>");
                    tr.append($("<td></td>").append(addr));
                }else{
                    tr.append($("<td>" + title + "</td>"));
                }

                tr.append($("<td>" + checkTime + "</td>"));
                tr.append($("<td>" + lastTime + "</td>"));
                tr.append($("<td></td>").append($('<button class="btn yellow-stripe mini domainList-delete" domain="' + domain + '">删除</button>')));
                $(".check-domain-result",table).append(tr);
            });
            table.dataTable($.extend(__setting__.defaultGridSetting(),{
                "bSort" : true,
                "bLengthChange" : true,
                "bDestroy" : true,
                "bInfo":true,
                "aLengthMenu": [10, 25, 50],
                "aoColumnDefs": [ { "bSortable": false, "aTargets": [ 0, 1, 2, 4 ] }]
            }));
        }

    };

    var __file__ = {
        success: function(json){
            if(json['code']){
                var domainList = [];
                $.each(json['rows'], function(point, item){
                    domainList.push(item);
                });
                var paramList = domainList.join(",");
                $.ajax({
                    type: "POST",
                    url: __ROOT__ + "/OptCenter/TaskCreate/domainListHistory",
                    data: {domainList:paramList},
                    dataType: "json",
                    async: false,
                    success : function(json){
                        if(json['code']){
                            $.each(json['rows'], function(point, item){
                                domainInfoList.push(item);
                                domainInfoListSrc.push(item);
                            });
                        }
                        __init__.initTable(domainInfoList);
                    }
                });
            }
        }
    };
})();