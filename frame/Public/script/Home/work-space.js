/**
 * Created by jianghaifeng on 2016/4/14.
 */
(function(){
    var app={
        init:function(){
            app.initView();
            app.initHandler();
        },
        initView:function(){
            var w=this;
            w.table=$("#exportTask_table").DataTable($.extend(_dataTable_setting._server(),{
                ajax:{
                    url: __WEBROOT__ + "/Home/ExportTask/listPage",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {


                    }
                },
                searching:false,
                columns: [
                    { data: 'name' },
                    { data: 'fileName'},
                    { data: 'time'},
                    { data: 'status' },
                    { data: '' }

                ],
                columnDefs:[
                    {
                        "targets": [3],
                        "render": function(data, type, full) {
                            if(data==1){
                                return  "<span class='text-danger'>等待文件生成</span>";
                            }else if(data==3){
                                return "<span class='text-success'>文件已生成</span>";
                            }else if(data==2){
                                var bar= '<div class="progress progress-striped active" style="margin-top: 5px;">'+
                                    '<div class="progress-bar progress-bar-info " id="progress_bar" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: '+(full.progress.current*100/full.progress.total)+'%">'+
                                    '<span class="num">'+(full.progress.current*100/full.progress.total).toFixed(0)+'%</span>'+
                                    '<span class="tip"></span></div> </div>'
                                   return bar;
                            }

                            //return str;

                        }
                    },
                    {
                        "targets": [4],
                        "render": function (data, type, full) {
                            if(full.status==3){
                                var downloadLink=__ROOT__+"/Home/ExportTask/download/_id/"+full._id;
                                return '<a class=" btn btn-xs btn-info " href="'+downloadLink+'"> <i class="fa fa-download"></i>下载 </a>';
                            }

                        }
                    }

                ],
                rowCallback:function( row, data, index ){

                },
                drawCallback:function(json) {
                    w.lastJson=json.json;

                }
            }));

        },
        initHandler:function(){

        }
    };

    $(document).ready(function(){
        app.init();
    });
})();
