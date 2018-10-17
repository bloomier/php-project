/**
 * Created by jianghaifeng on 2016/2/18.
 */
(function(){
    var role_mapper={};
    var o={
        init:function(){

            o.view();
            o.handler();
        },
        view:function(){
            var users= $.parseJSON($("#users").text());
            var w=this;
            w.table=$("#log_table").DataTable($.extend(_dataTable_setting._server(),{
                ajax:{
                    url: __WEBROOT__ + "/Admin/Log/listPage",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {


                    }
                },
                searching:false,
                columns: [
                    { data: 'name',width: '20%' },
                    { data: 'success',width: '20%' },
                    { data: 'uid',width: '20%' },
                    { data: 'ip',width: '20%' },
                    { data: 'time',width: '20%' }


                ],
                columnDefs:[
                    {
                        targets: 1,
                        createdCell: function (td, cellData, rowData, row, col) {
                            $(td).html(rowData.success?"成功":"失败");

                        }
                    },
                    {
                        targets: 2,
                        createdCell: function (td, cellData, rowData, row, col) {
                             if(rowData['uid']==0){
                                $(td).html("超级管理员");
                             }else{
                                var userName=users[rowData['uid']]['name'];
                                 $(td).html(userName);
                             }


                        }
                    }
                ]

            }));


        },
        handler:function(){
            var w=this;
        }
    };

    $(document).ready(function(){
        o.init();
    });

})();
