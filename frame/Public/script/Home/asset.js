/**
 * Created by jianghaifeng on 2016/3/15.
 */
(function(){
    var extraParams={};
    var app={
        init:function(){
            app.initView();
            app.initEchart();
            app.initHandler();
        },
        initView:function(){
            var w=this;
            $(".location-wraper").citySelect({
                required:false,
                nodata:"hidden",
                url:__ROOT__+"/Admin/Location/getLocationSelectorData"
            });

            w.searchLabels=$("#searchLabels").searchLabels({
                nameMapper:{
                    _id:"域名",
                    title:"标题",
                    ip:"ip",
                    "location[province]":"IP省份",
                    "location[city]":"IP城市",
                    "location[district]":"IP地县",
                    "admin_location[province]":"行政省份",
                    "admin_location[city]":"行政城市",
                    "admin_location[district]":"行政地县",
                    finger:"指纹",
                    "whois[registrant_name]":"注册人",
                    "whois[registrant_email]":"注册人邮箱",
                    "vuls[level]":"风险等级",
                    "param":"其他",
                    "security":"安全事件",
                    "survey[visit_state]":"服务质量"
                },
                deleteLabel:function(){
                    extraParams=this.getData();
                    app.initCensus();
                    w.table.draw(true);
                    w.noTable.draw(true);
                }
            });
            var initParam=$("#extParam").val();
            if(initParam!=''){
                extraParams= $.parseJSON(initParam.replaceAll("'",'"'));
                w.searchLabels.load(extraParams);
            }

            w.noTable=$("#no_asset_table").DataTable($.extend({
                ajax:{
                    url: __WEBROOT__ + "/Home/Asset/listPage",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        $.extend(d,extraParams);
                    }
                },
                searching:false,
                columns: [
                    { data: 'title',width: '10%' },
                    { data: '_id',width: '10%' },
                    { data: 'ip',width: '10%' },
                    { data: 'location',width: '10%' },
                    { data: 'admin_location',width: '10%' },
                    { data: '',width:'10%' }

                ],
                columnDefs:[
                    {
                        targets: 3,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).html(__functions__.createLocationStr(rowData['location']||{}));

                        }
                    },
                    {
                        targets: 4,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).html(__functions__.createLocationStr(rowData['admin_location']||{}));

                        }
                    },
                    {
                        targets: 5,
                        createdCell: function (td, cellData, rowData, row, col) {
                            var editLink=__ROOT__+"/Home/Asset/editPage/_id/"+BASE64.encoder(rowData['_id']);
                            var editLink=$('<a class="btn-edit btn btn-xs btn-primary mg-l-5" href="'+editLink+'"><i class="fa fa-pencil"></i>&nbsp;修改</a>');
                            $(td).html("").append(editLink);
                        }
                    }
                ],
                rowCallback:function( row, data, index ){

                },
                drawCallback:function(json) {
                    //w.lastJson=json.json;
                }
            }, _dataTable_setting._server()));

            w.table=$("#asset_table").DataTable($.extend({
                ajax:{
                    url: __WEBROOT__ + "/Home/Asset/registerListPage",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        $.extend(d,extraParams);
                    }
                },
                searching:false,
                columns: [
                    { data: '_id',width: '10%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width: '10%' },
                    { sDefaultContent: '',width:'10%' }
                ],
                columnDefs:[
                ],
                rowCallback:function( row, data, index ){

                },
                drawCallback:function(json) {
                    var items = json.json.items;
                    var tbody = $("tbody", $("#asset_table"));
                    var trs = [];
                    $.each(items, function(point, item){
                        trs.push($("tr:eq(" + point + ")", tbody));
                    });
                    var flag = 0;
                    $.each(items, function(point, data){
                        var row = trs[point];
                        var register = data["_id"];
                        var domain_ids = data["domain_id"];
                        var ips = data["ip"];
                        var titles = data["title"];
                        var locations = data["location"];
                        var adminLocations = data["admin_location"];
                        $('td:eq(1)', row).html(titles[0]||domain_ids[0]);
                        $('td:eq(2)', row).html(domain_ids[0]);
                        $('td:eq(3)', row).html(ips[0]);
                        $('td:eq(4)', row).html(__functions__.createLocationStr(locations[0]||{}));
                        $('td:eq(5)', row).html(__functions__.createLocationStr(adminLocations[0]||{}));
                        var editLinkPath=__ROOT__+"/Home/Asset/editPage/_id/"+BASE64.encoder(domain_ids[0]);
                        var editLink=$('<a class="btn-edit btn btn-xs btn-primary mg-l-5" href="'+editLinkPath+'"><i class="fa fa-pencil"></i>&nbsp;修改</a>');
                        $('td:eq(6)', row).html(editLink);
                        for(var i = 1; i < domain_ids.length; i++){
                            var tr = $("<tr></tr>");
                            tr.append("<td>" + (titles[i]||titles[0]||domain_ids[i]) + "</td>");
                            tr.append("<td>" + (domain_ids[i]) + "</td>");
                            tr.append("<td>" + (ips[i] || ips[0]) + "</td>");
                            tr.append("<td>" + __functions__.createLocationStr(locations[i]||locations[0]||{}) + "</td>");
                            tr.append("<td>" + __functions__.createLocationStr(adminLocations[i]||adminLocations[0]||{}) + "</td>");
                            var editLinkPath=__ROOT__+"/Home/Asset/editPage/_id/"+BASE64.encoder(domain_ids[i]);
                            var editLink=$('<a class="btn-edit btn btn-xs btn-primary mg-l-5" href="'+editLinkPath+'"><i class="fa fa-pencil"></i>&nbsp;修改</a>');
                            tr.append($("<td></td>").append(editLink));
                            $(row).after(tr);
                        }
                        if(domain_ids.length>5){
                            var start = 4 + flag;
                            var end = (flag + domain_ids.length - 1);
                            $('td:eq(0)' ,row).attr("rowspan", 5).attr("slice_start", start).attr("slice_end", end);
                            $('td:eq(0)', row).attr("count_row_span",domain_ids.length );
                            $('td:eq(0)', row).parent("tr").siblings().slice(start,end).hide();
                            $('td:eq(0)', row).addClass('sorting_desc');
                            $('td:eq(0)' ,row).bind('click', function(){
                                var rowspan = $(this).attr("count_row_span");
                                var start = $(this).attr("slice_start");
                                var end = $(this).attr("slice_end");
                                if($(this).hasClass('sorting_desc')){
                                    $(this).removeClass('sorting_desc').addClass('sorting_asc');
                                    $(this).parent('tr').siblings().slice(start,end).show();
                                    $(this).attr("rowspan", rowspan);
                                }else{
                                    $(this).removeClass('sorting_asc').addClass('sorting_desc');
                                    $(this).parent('tr').siblings().slice(start,end).hide();
                                    $(this).attr("rowspan", 5);
                                }
                            })
                        }else{
                            $('td:eq(0)', row).attr("rowspan",domain_ids.length);
                        }
                        flag += domain_ids.length;
                    });
                }
            }, _dataTable_setting._server()));

            var treeItems=function(ary,children,pid,location_type){
                $.each(children||{},function(point,data){
                    var d=({
                        _id:pid+"_"+data.deep+":"+point,
                        title:point + '【' + data.count + '】',
                        pid:pid||0,
                        value:{

                        }
                    });
                    ary.push(d);
                    var tmp=d['_id'].substr(1).split("_");
                    $.each(tmp,function(i,t){
                        var tmp2= t.split(":");
                        if(tmp2.length==2){
                            d.value[location_type+'['+tmp2[0]+']']=tmp2[1];
                        }
                    });
                    treeItems(ary,data.children,d['_id'],location_type);
                });
            }

            $.post(__WEBROOT__ + "/Home/AssetReport/assetGroup").success(function(json){
                var ary = [];
                if(json["children"]){
                    treeItems(ary,json["children"],"",json.location_type);
                }
                w.zTree= $.fn.zTree.init($("#ztree"), {
                    data:{
                        key:{
                            name:"title"
                        },
                        simpleData:{
                            enable:true,
                            idKey:"_id",
                            pIdKey:"pid"
                        }
                    },
                    callback:{
                        onClick: function(event, treeId, treeNode){
                            extraParams = treeNode.value;
                            w.searchLabels.load(extraParams);
                            w.noTable.draw(true);
                            w.table.draw(true);
                        }
                    }
                },ary);
            });

        },
        initEchart:function(){

        },
        initHandler:function(){
            var w=this;
            var dialog=$("#dialog-export");
            $(".btn-search").bind("click",function(){
                w.table.draw(true);
            });
            $(".btn-export-asset").bind("click",function(){
                var param=$('#extra').val();
                console.info(extraParams);
                $.ajax({
                    url:__WEBROOT__ + "/Home/Asset/exportTotalCount",
                    method:"POST",
                    async:false,
                    data:extraParams,
                    success:function(json){
                        $(".opt-count",$("#dialog-export")).text(json.total);
                    }
                });
                $(".step-select",dialog).show();
                $(".step-progress",dialog).hide();
                $(".btn-download",dialog).hide();
                if(w.downloadIns){
                    clearInterval(w.downloadIns);
                }
                $(".btn-export-submit").show();
                dialog.modal("show");
            });
            $(".btn-export-submit").bind("click",function(){
                var param= $.trim($('#extra').val());
                var fileName= $.trim($("#fileName").val());
                var field=$("#select_fields").val();
                if(!fileName){
                    swal({   title: "请输入导出文件名称", type: "error",   confirmButtonText: "确定" });
                    return;

                }
                if(!field||field.length==0){
                    swal({   title: "请选择要导出的字段", type: "error",   confirmButtonText: "确定" });
                    return;
                }
                var _field={};
                $.each(field,function(i,f){
                    _field[f]=1;
                });
                $.post(__ROOT__+"/Home/ExportTask/exportAssetBackGround", $.extend({param:param,field:_field,fileName:fileName}, extraParams)).success(function(json){
                    $(".step-select",dialog).hide();
                    $(".step-progress",dialog).show();
                    var task_id=json.task_id;
                    if(json.code>0){
                        $(".btn-download",dialog).attr("href",__ROOT__+"/Home/ExportTask/download/_id/"+task_id);
                        $(".btn-export-submit").hide();
                        __functions__.loadProgress(100,1);
                        w.downloadIns=setInterval(function(){
                            $.post(__ROOT__+"/Home/ExportTask/queryExportProgress",{_id:task_id}).success(function(json){
                                if(json.code>0){
                                    var data=json.data;
                                    var progress=json.data.progress;
                                    if(data.status==1){
                                        __functions__.loadProgress(100,1);
                                    }else if(data.status==2){
                                        if(progress){
                                            __functions__.loadProgress(progress.total,progress.current);
                                        }
                                    }else if(data.status==3){
                                        __functions__.loadProgress(progress.total,progress.total);
                                        $(".btn-download",dialog).show();

                                        clearInterval(w.downloadIns);
                                    }
                                }else{
                                    clearInterval(w.downloadIns);
                                }
                            });

                        },2000);
                    }else{
                        swal({   title:json.msg, type: "error",   confirmButtonText: "确定" });
                    }

                });
            });

        }

    };
    var __functions__={
        createLocationStr:function(location){
            var str="";
            if(location.province){
                str+=location.province;
            }
            if(location.city){
                str+=(" "+location.city);
            }
            if(location.district){
                str+=(" "+location.district);
            }
            return str;
        },
        loadProgress:function(total,current,tip){
            var bar=$("#progress_bar");
            bar.css("width",current*100/total+"%");


            $(".num",bar).text((current*100/total).toFixed(0)+"%");


        }

    }

    $(document).ready(function(){
        app.init();
       

    });
})();
