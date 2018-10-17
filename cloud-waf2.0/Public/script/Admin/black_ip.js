/**
 *@name
 *@author ancyshi
 *@date 2016/6/29
 *@version
 *@example
 */

(function(){
    var o={
        init:function(){
            o.view();
            o.handler();
        },
        view:function(){
            var w=this;


            w.table=$("#ip_table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: '_id' },
                    { data: 'userName' },
                    { data: 'createTime' },
                    { data: ''}
                ],
                columnDefs:[
                    {orderable:false,targets:[3]}
                ],
                rowCallback:function( row, data, index ){
                    var deleteBtn = $('<a class="btn-delete  btn btn-xs btn-danger mg-l-5" href="javascript:void(0)"><i class="fa fa-trash"></i> 解封IP</a>');
                    $("td:eq(3)",row).addClass('text-center').html("").append(deleteBtn);
                },
                initComplete:function(){

                }
            }));
            $.post(__ROOT__+"/Admin/BlackIp/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
        },
        handler:function(){
            var w=this;

            //$(".btn-delete").bind("click",function(){
            $("#ip_table").on("click",'.btn-delete',function(){
                var row = w.table.row($(this).closest("tr"));
                var _id = row.data()['_id'];
                var userName = row.data()['userName'];
                storm.confirm("确定要解封" + _id + "吗?",function(){
                    $.post(__ROOT__+"/Admin/BlackIp/delete",{_id:_id, userName: userName}).success(function(json){
                        if(json.code){
                            row.remove().draw();
                        }
                        //storm.alertMsg(json.msg,json.code);
                        swal({   title: json.msg, type: json.code?"success":"error",   confirmButtonText: "确定" });
                    });
                });
            });
        }
    };

    $(document).ready(function(){
        o.init();
    });

})();
