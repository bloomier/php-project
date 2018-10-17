/**
 *@name
 *@author ancyshi
 *@date 2016/6/16
 *@version
 *@example
 */



(function(){

    var OptionsLog = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.parsley = $("#wafForm").parsley();
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);
        w.init_btn.init_dialog.call(w);

    }



    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#options_log_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Base/OptionsLog/getList",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                "bAutoWidth": false,
                columns: [
                    { data: '', sWidth: '12%' },
                    { data: 'name', sWidth: "25%" },
                    { data: 'username', sWidth: '15%' },
                    { data: 'time', sWidth: '15%' },
                    { data: 'ip', sWidth: '15%' },
                    { data: 'param', sWidth: '8%' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0, 5]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                "order": [[ 3, "desc" ]],
                rowCallback:function( row, data, index ){
                    $("td:eq(0)",row).addClass("text-center").html(index + 1);

                    //
                    var editBtn=$('<a href="javascript:void(0)" title="详情"><i class="fa fa-info-circle"></i></a>');
                    editBtn.bind("click",function(){
                        var row= w.table.row($(this).closest("tr"));
                        //console.info($.parseJSON(row.data().param));
                        $(".param_text").val(row.data().param);
                        w.dialog.open();
                    });
                    //var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                    //deleteBtn.bind("click",function(){
                    //    __functions__.delete.call(w,data['_id']);
                    //});
                    $("td:eq(5)",row).addClass('text-center').html("");
                    $("td:eq(5)",row).append(editBtn);


                },
                initComplete:function(){

                    //var deleteBtn=$('<a  href="#" class="btn-delete-all u-btn u-btn-danger" ><i class="fa fa-minus"></i> 删除</a>');

                    //$(".datatable-btn-warper").append(deleteBtn);

                }
            }));


            $('#waf_site_table_filter input').attr('placeholder','客户名称|客户电话  ');
        }
    }

    var __functions__ = {
        setState: function(data){
            if(data && data.state){
                var sipArr = data.match;
                if(data.state == 1){
                    return '有效';
                } else {
                    return '无效';
                }
            } else {
                return '无效';
            }
        },
        delete: function(_id){
            var w = this;
            var delObjMsg = "<p>您确定要删除吗?</p>";
            storm.confirm(delObjMsg,function(){
                $.post(__ROOT__+"/Base/Client/delete",{_id: _id}).success(function(json){
                    if(json['code']){
                        //w.table.row.remove().draw(false);
                        w.table.ajax.reload( null, false );
                        storm.alertMsg(json['msg'],"success");
                    }else{
                        storm.alertMsg(json['msg'],"danger");
                    }
                });
            });
        }

    }


    var init_btn = {
        init_bind : function(){
            var w = this;


            $(".btn-delete-all").live("click", function(){
                //console.info(w.table.rows('.selected').data());
                var rows = w.table.rows('.selected').data();
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待删除项!");
                    return ;
                }
                storm.confirm("您确定要删除勾选项目吗？",function(){
                    var _ids = [];
                    $.each(rows, function(i,item){
                        _ids.push(item._id);
                    });
                    var _id = _ids.join(",");
                    $.post(__ROOT__+"/Base/Client/delete",{_id: _id}).success(function(json){
                        if(json['code']){
                            w.table.ajax.reload( null, false );
                            storm.alertMsg(json['msg'],"success");
                        } else {
                            storm.alertMsg(json['msg'],"danger");
                        }

                        $("#checkAll_id").attr("checked",false);
                    });
                });
            });

            $("#checkAll_id").live("click", function(){
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

        },
        init_dialog:function(){
            var w = this;
            w.dialog=new BootstrapDialog({
                title: '<h3>操作日志详情</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                message: function () {
                    return $(".options-log-dialog-content").show();
                },
                buttons: [
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            $(".param_text").val("");
                            dialogItself.close();
                        }
                    }]
            });

        }
    }

    $(document).ready(function(){
        var optionsLog=new OptionsLog();
        optionsLog.init.call(optionsLog);
    });

})();
