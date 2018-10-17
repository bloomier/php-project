/**
 * Created by ancyshi on 2016/05/31.
 */
(function(){
    var order={
        init:function(){
            order.view();
            order.handler();
        },
        view:function(){
            var w=this;


            w.table=$("#order_table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'aliUid' },
                    { data: 'instanceId' },
                    { data: 'orderId'},
                    { data: 'domainCount'},
                    { data: 'mobile'},
                    { data: 'email'},
                    { data: 'createTime'},
                    { data: 'expiredOn'}
                ],
                columnDefs:[
                    //{orderable:false,targets:[2]}
                ],
                rowCallback:function( row, data, index ){

                },
                initComplete:function(){

                }
            }));
            $.post(__ROOT__+"/Home/AliOrder/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
        },
        handler:function(){

        }
    };

    $(document).ready(function(){
        order.init();
    });

})();
