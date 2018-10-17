

(function(){

    var PolicyList = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.setting = setting;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);

    }

    var setting = {
        policyRelation:[]
    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#policy_list_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/PolicyList/getPolicyList",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                bAutoWidth: false,
                columns: [
                    { data: '', sWidth: '3%' },
                    { data: '_id', sWidth: '15%' },
                    { data: 'type', sWidth: '10%' },
                    { data: 'desc', sWidth: '10%' },
                    { data: 'site', sWidth: '10%' },
                    { data: 'domains', sWidth: '10%' },
                    { data: 'urls', sWidth: '10%' },
                    { data: 'level', sWidth: '10%' },
                    { data: '' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0,5, 6]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                "order": [[ 1, "asc" ]],
                //"createdRow": function ( row, data, index ) {
                //    //console.info(row);
                //    if($(this).hasClass('selected')){
                //       console.info("ddddd");
                //    }
                //},
                drawCallback: function(){//table数据加载完成后回调，初始化checkBox
                    var checkBox = $('input.i-checks').iCheck({checkboxClass:"icheckbox_square-green"});

                    checkBox.on('ifChecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        //alert(event.type + ' callback');
                        $(this).closest("tr").addClass('selected');
                    });

                    checkBox.on('ifUnchecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        //alert(event.type + ' callback');
                        $(this).closest("tr").removeClass('selected');
                    });
                },
                rowCallback:function( row, data, index ){
                    w.currentData = data;

                    var checkBox = $("<input type='checkbox' class='i-checks' name='one'/>")
                    $("td:eq(0)",row).addClass('text-center').html(checkBox);
                    var policyDesc = data['desc'].length<=20?data['desc']:data['desc'].substr(0,20)+"...";
                    $("td:eq(3)",row).html("<p title='"+data['desc']+"'>"+policyDesc+"</p>");
                    var policyMsg = w.setting.policyRelation[data['_id']];

                    var allSite = data['site'];
                    var policyDomain = data['domains']?data['domains'].split(","):[];
                    var showDomain = policyDomain.length>0?"<p title='"+policyDomain.join("\n")+"'>"+policyDomain[0]+"</p>":"";
                    var allUrlstr = [];
                    if(data['urls']){
                        allUrlstr =  data['urls'].split(",");
                    }
                    var url = allUrlstr.length>0&&allUrlstr[0].length>=30?allUrlstr[0].substr(0,30)+"...":allUrlstr[0];
                    var allUrls = allUrlstr.length>0?"<p title='"+allUrlstr.join("\n")+"'>"+url+"</p>":'';
                    $("td:eq(4)",row).html(allSite);
                    if(allSite == '禁用'){
                        $("td:eq(5)",row).html("");
                        $("td:eq(6)",row).html("");
                    }else{
                        $("td:eq(5)",row).html(showDomain);
                        $("td:eq(6)",row).html(allUrls);
                    }
                    $("td:eq(8)",row).addClass('text-center').html("");
                    //btn-attention
                    var editBtn=$('<a href="javascript:void(0)" class="btn btn-xs btn-primary" title="配置"><i class="fa fa-cogs"> 配置</i></a>');
                    editBtn.bind("click",function(){
                        location.href = __ROOT__ + "/Home/PolicyList/getPolicyMsg?policyId="+data['_id'];
                    });

                    $("td:eq(8)",row).append(editBtn);

                },
                initComplete:function(){
                    var concelBtn=$('<a  href="#" class="btn btn-sm btn-success" ><i class="fa fa-reply"></i> 取消全网禁用</a>');
                    concelBtn.bind("click", function(){
                        __functions__.concelPolicy.call(w);
                    });
                    var stopBtn=$('<a  href="#" class="btn btn-sm btn-danger" ><i class="fa fa-minus"></i> 全网禁用</a>');
                    stopBtn.bind("click", function(){
                        __functions__.stopPolicy.call(w);
                    });
                    var startBtn=$('<a  href="#" class="btn btn-sm btn-primary" ><i class="fa fa-plus"></i> 全网启用</a>');
                    startBtn.bind("click", function(){
                        __functions__.stratPolicy.call(w);
                    });
                    $(".datatable-btn-warper").append(startBtn).append("&nbsp;").append(concelBtn).append("&nbsp;").append(stopBtn);

                }
            }));


            $('#policy_list_table_filter input').attr('placeholder','请输入ID| 名称| 域名| url').css('width','220px');
        }
    }

    var __functions__ = {

        getAllCheckedRowIds:function(rows){
            var _ids = [];
            $.each(rows, function(i,item){
                _ids.push(item._id);
            });
            return _ids.join(",");
        },
        stratPolicy: function(){

            var w = this;
            var rows = w.table.rows('.selected').data();
            if(!rows || rows.length == 0){
                storm.alertMsg("请勾选待启用策略!");
                return ;
            }
            var config = true;
            $.each(rows,function(point,row){
                if(row['site'] == '启用'){
                    storm.alertMsg("勾选策略包含已启用策略");
                    config = false;
                    return ;
                }
            });
            if(config){
                storm.confirm("您确定要删除勾选项目吗？",function(){
                    var _ids = __functions__.getAllCheckedRowIds(rows);
                    var param = {};
                    param['config'] = false;
                    param['policyId'] = _ids;
                    $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                        if(json['code']){
                            $.post(__WEBROOT__+ "/Home/PolicyList/startAll",{'policyId':policys}).success(function(date){
                                if(date['code']){
                                    w.table.ajax.reload(null,false);
                                }
                                swal({   title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                                $("#checkAll_id").iCheck("uncheck");
                            })
                        }
                    });
                });
            }

        },
        stopPolicy: function(){

            var w = this;
            var rows = w.table.rows('.selected').data();
            if(!rows || rows.length == 0){
                storm.alertMsg("请勾选待禁用策略!");
                return ;
            }
            var config = true;
            $.each(rows,function(point,row){
                if(row['site'] == '禁用'){
                    storm.alertMsg("勾选策略包含已禁用策略!");
                    config = false;
                    return ;
                }
            });
            if(config){
                storm.confirm("您确定要删除勾选项目吗？",function(){
                    var _ids = __functions__.getAllCheckedRowIds(rows);
                    var param = {};
                    param['config'] = true;
                    param['policyId'] = _ids;
                    $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                        if(json['code']){
                            var allSite = {};
                            allSite['policyId'] = policys;
                            allSite['allSite'] = '1';
                            $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(){
                                if(json['code']){
                                    w.table.ajax.reload(null,false);
                                }
                                swal({   title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                            });
                        }
                    });
                });
            }
        },
        concelPolicy: function(){
            var w = this;
            var rows = w.table.rows('.selected').data();
            var config = true;
            if(!rows || rows.length == 0){
                storm.alertMsg("请勾选待取消禁用策略!");
                return ;
            }
            $.each(rows,function(point,row){
                if(row['site'] == '启用' || row['site'] == '局部禁用'){
                    storm.alertMsg("勾选策略包含已启用或局部禁用策略");
                    config = false;
                    //each中的return true表示continue false表示break;
                    return ;
                }
            });

            if(config){
                var policys = __functions__.getAllCheckedRowIds(rows);
                var param = {};
                param['config'] = false;
                param['policyId'] = policys;
                $.post(__WEBROOT__+ "/Home/PolicyList/globalPolicy",param).success(function(json){
                    if(json['code']){
                        var allSite = {};
                        allSite['policyId'] = policys;
                        allSite['allSite'] = '0';
                        $.post(__WEBROOT__+ "/Home/PolicyList/editGlobalRelation",allSite).success(function(){
                            if(json['code']){
                                w.table.ajax.reload(null,false);
                            }
                            swal({   title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                        });
                    }
                });
            }
        }
    }


    var init_btn = {
        init_bind : function(){
            var w = this;

            var one = $("#checkAll_id").iCheck({checkboxClass:"icheckbox_square-green"});
            one.on('ifChecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                $('input[type="checkbox"][name="one"]').each(
                    function() {
                        if ( !$(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").addClass('selected');
                        }
                        $(this).iCheck('check');
                    }
                );
                $('input.i-checks').iCheck({checkboxClass:"icheckbox_square-green"});
            });

            one.on('ifUnchecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                $('input[type="checkbox"][name="one"]').each(
                    function() {
                        if ( $(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").removeClass('selected');
                        }
                        //$(this).attr("checked",false);
                        $(this).iCheck('uncheck');
                    }
                );
            });
        }
    }

    $(document).ready(function(){
        var policyList=new PolicyList();
        policyList.init.call(policyList);
    });

})();
