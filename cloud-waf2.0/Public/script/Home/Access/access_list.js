/**
 * Created by jianghaifeng on 2016/3/1.
 */

(function(){

    var WafSite = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;

        w.init_view.init_table.call(w);

        w.init_btn.init_bind.call(w);

    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/Access/getAccessList",
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
                    { data: 'ip', sWidth: "17%" },
                    //{ data: 'forward', sWidth: '10%' },
                    { data: '', sWidth: '10%' },//expire
                    { data: 'action', sWidth: '10%' },
                    { data: 'domainCount', sWidth: '10%' },
                    { data: 'type', sWidth: '10%' },
                    { data: 'createModifyTime', sWidth: '10%' },
                    { data: 'state', sWidth: '10%' },
                    { data: 'desc', sWidth: '10%' },
                    { data: 'domains', sWidth: '10%' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0, 2, 4, 8]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                order: [[ 6, "desc" ]],
                drawCallback: function(){//table数据加载完成后回调，初始化checkBox
                    var checkBox = $('input.i-checks').iCheck({checkboxClass:"icheckbox_square-green"});

                    checkBox.on('ifChecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        if ( !$(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").addClass('selected');
                        }
                    });

                    checkBox.on('ifUnchecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        if ( $(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").removeClass('selected');
                        }
                    });
                },
                rowCallback:function( row, data, index ){
                    w.currentData = data;
                    var checkBox = $("<input type='checkbox' name='one'/>");
                    $("td:eq(0)",row).addClass('text-center').html($("<input type='checkbox' class='i-checks' name='one'/>"));

                    var action = '<s       pan class="label label-primary"> 放 行 </span>';
                    if(data.action == 'block'){
                        action = '<span class="label label-danger"> 拦 截 </span>';
                    }
                    $("td:eq(3)",row).html(action);


                    var expire = __functions__.setExpire(data);
                    $("td:eq(2)",row).html(expire);
                    // var row= w.table.row($(this).closest("tr"));


                    var editBtn=$('<a href="javascript:void(0)" title="修改" class="btn btn-xs  btn-info"><i class="fa fa-edit"></i> 修改</a>');
                    editBtn.bind("click",function(){
                        var href = __ROOT__ + "/Home/Access/addAccess?uuid=" + data['_id'];
                        window.location.href = href;
                    });
                    var deleteBtn=$('<a href="javascript:void(0)" title="删除" class="btn btn-xs btn-danger" style="margin-left: 4px;"><i class="fa fa-trash"></i> 删除</a>');
                    deleteBtn.bind("click",function(){
                        __functions__.deleteAccess.call(w,data['_id']);
                    });

                    //var forward = __functions__.setForward(data);
                    //$("td:eq(2)",row).html("");
                    //$("td:eq(2)",row).append(forward);

                    var domainCount = __functions__.setDomainCount(data);
                    var domains = __functions__.setDomains(data);

                    $("td:eq(4)",row).attr('title',domains);
                    $("td:eq(4)",row).html("");
                    $("td:eq(4)",row).append(domainCount);

                    var state = __functions__.setState(data)
                    $("td:eq(7)",row).html("");
                    $("td:eq(7)",row).append(state);

                    $("td:eq(9)",row).addClass('text-center').html("");
                    $("td:eq(9)",row).append(editBtn).append(deleteBtn);


                },
                initComplete:function(){
                    var addBtn=$('<a  href="#" class="btn-add btn btn-sm  btn-primary" ><i class="fa fa-plus"></i> 新增</a>');
                    addBtn.bind("click", function(){
                        var path = __ROOT__ + "/Home/Access/addAccess";
                        location.href = path;
                    });
                    var deleteBtn=$('<a  href="#" class="btn-delete-all btn btn-sm  btn-danger" ><i class="fa fa-minus"></i> 删除</a>');

                    deleteBtn.bind("click",function(){
                        __functions__.deleteAllAccess.call(w);
                    });

                    $(".datatable-btn-warper").append(addBtn).append("&nbsp;").append(deleteBtn);

                }
            }));


            $('#waf_site_table_filter input').attr('placeholder','请输入IP| 时间| 域名  ')
        }
    }

    var __functions__ = {
        deleteAllAccess: function(){
            var w = this;
            var rows = w.table.rows('.selected').data();
            if(!rows || rows.length == 0){
                storm.alertMsg("请勾选待删除项!");
                return ;
            }
            storm.confirm("您确定要删除勾选项目吗？",function(){
                var uuids = [];
                $.each(rows, function(i,item){
                    uuids.push(item._id);
                });
                var uuid = uuids.join(",");
                $.post(__ROOT__+"/Home/Access/deleteAccess",{uuid: uuid}).success(function(json){
                    if(json['code']){
                        w.table.ajax.reload( null, false );
                    }
                    swal({ title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                    $("#checkAll_id").iCheck('uncheck');
                });
            });
        },
        setForward: function(data){
            if(data && data.match){
                var sipArr =data.match;
                var forward = "";
                forward = sipArr.sip[0][1];
                if(forward == ''){
                    return 0;
                }
                if(forward == 'X-Forwarded-For,-1'){
                    return 1;
                }
                if(forward == 'X-Forwarded-For,-2'){
                    return 2;
                }
                if(forward == 'X-Forwarded-For,-3'){
                    return 3;
                }
            } else {
                return '';
            }
        },
        setSip: function(data){
            if(data && data.match){
                var sipArr =data.match;
                var sip = "";
                $.each(sipArr.sip,function(k,v){
                    sip += v[0] + "\n";
                });
                return sip;
            } else {
                return '';
            }
        },
        setExpire: function(data){
            var expire = data.expire;
            if(expire == 0){
                expire = '永久';
            } else {
                var temp = "";
                //if ( expire > 86400){
                //    temp += parseInt(expire / 86400) + "天";
                //    expire = expire % 86400;
                //}
                if( expire > 3600) {
                    var hour = parseInt(expire / 3600);
                    if(hour != 0){
                        temp += hour + "小时";
                    }
                    expire = expire % 3600;
                }
                if( expire >= 60 ){
                    var minutes = parseInt(expire / 60);
                    if(minutes != 0){
                        temp += minutes + "分钟"
                    }
                }
                expire = temp;
            }
            return expire;
        },
        setState: function(data){
            var expire = data.expire ? data.expire : 0;
            if(expire == 0){
                return "有效";
            }
            var timeStr = data.createModifyTime;
            var now = new Date();  //开始时间
            var begin = new Date(Date.parse(timeStr.replace(/-/g, "/")));     //结束时间
            var seconds = (now.getTime() - begin.getTime()) / 1000;   //时间差的毫秒数
            if(seconds * 1 > expire){
                return "无效";
            } else {
                return "有效";
            }
        },
        setDomains: function(data){
            if(data && data.match){
                var sipArr = data.match;
                var result = "";
                if(sipArr.domain){
                    //return sipArr.domain.join("\n");
                    for(var i = 0,num = sipArr.domain.length; i < num; i++){
                        if( i != 0 && i % 5 == 0){
                            result += sipArr.domain[i] + ";\n";
                        } else {
                            result += sipArr.domain[i] + ";";
                        }
                    }
                    return result;
                } else {
                    return '';
                }
            } else {
                return '';
            }
        },
        setDomainCount: function(data){
            if(data && data.match){
                var sipArr = data.match;
                if(sipArr.domain){
                    return sipArr.domain.length;
                } else {
                    return '全局';
                }
            } else {
                return '全局';
            }
        },
        deleteAccess: function(uuid){
            var w = this;
            var delObjMsg = "您确定要删除吗?";
            storm.confirm(delObjMsg,function(){
                $.post(__ROOT__+"/Home/Access/deleteAccess",{uuid: uuid}).success(function(json){
                    if(json['code']){
                        w.table.ajax.reload( null, false );
                    }
                    swal({ title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                });
            });
        },
        setTitleColumn: function(row,data){
            var w = this;
            var data = w.currentData;
            $("td:eq(1)",row).html("");
            var title = "";
            if(data && data['title']){
                title = data['title'];
                if(title.length > 10){
                    title = title.substr(0,10) + "...";
                }
            } else {
                title = data['_id'];
            }
            var herfUrl = data['_id'];
            if(herfUrl.substring(0,4) !="http"){
                herfUrl = "http://" + herfUrl;
            }
            var a = "<a target='_blank' href='" + herfUrl + "'>" + title + "</a>"
            $("td:eq(1)",row).html(a);
        }

    }


    var init_btn = {
        init_bind : function(){
            var w = this;

            $(".btn-delete").bind("click", function(){
                var row= w.table.row($(this).closest("tr"));
                storm.confirm("警告！确定要删除吗？",function(){
                    var _id=row.data()['_id'];
                    $.post(__ROOT__+"/Home/WafSite/delete",{domain:_id}).success(function(json){
                        if(json['code']){
                            row.remove().draw(false);
                        }else{
                            storm.alertMsg(json['msg'],"danger");
                        }
                    });
                });
            });

            //$(".btn-delete-all").bind("click", function(){
            //    console.info('okok');
            //    //console.info(w.table.rows('.selected').data());
            //    var rows = w.table.rows('.selected').data();
            //    if(!rows || rows.length == 0){
            //        storm.alertMsg("请勾选待删除项!");
            //        return ;
            //    }
            //    storm.confirm("您确定要删除勾选项目吗？",function(){
            //        var uuids = [];
            //        $.each(rows, function(i,item){
            //            uuids.push(item._id);
            //        });
            //        var uuid = uuids.join(",");
            //        $.post(__ROOT__+"/Home/Access/deleteAccess",{uuid: uuid}).success(function(json){
            //            if(json['code']){
            //                w.table.ajax.reload( null, false );
            //            }
            //            storm.alertMsg(json['msg'],"danger");
            //            $("#checkAll_id").attr("checked",false);
            //        });
            //    });
            //});

            $("#checkAll_id").bind("click", function(){
                if($(this).attr("checked") == "checked"){
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            if ( !$(this).closest("tr").hasClass('selected') ) {
                                $(this).closest("tr").addClass('selected');
                            }
                            $(this).attr("checked","checked");
                        }
                    );
                }else{
                    $('input[type="checkbox"][name="one"]').each(
                        function() {
                            if ( $(this).closest("tr").hasClass('selected') ) {
                                $(this).closest("tr").removeClass('selected');
                            }
                            $(this).attr("checked",false);
                        }
                    );
                }
            });

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
        var wafSite=new WafSite();
        wafSite.init.call(wafSite);
    });

})();
