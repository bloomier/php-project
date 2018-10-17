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
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.init_view.init_table.call(w);
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
                    var editBtn=$('<a href="javascript:void(0)" class="btn btn-xs  btn-success" title="详情"><i class="fa fa-info-circle"></i> 详情</a>');
                    editBtn.bind("click",function(){
                        var row= w.table.row($(this).closest("tr"));
                        //console.info($.parseJSON(row.data().param));
                        $(".param_text").val(row.data().param);
                        w.dialog.open();
                    });

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



    var init_btn = {
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
