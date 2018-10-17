/**
 * Created by jianghaifeng on 2016/4/27.
 */
(function(){

    var SpecialReport = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init = init;
    }

    var init_view = {
        init:function(){
            var w = this;
            w.table=$(".special-report-table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'name' },
                    { data: 'desc'},
                    { data: 'report_template_id'},
                    { data: 'report_year' },
                    { data: 'report_month'},
                    { sDefaultContent: '' }
                ],
                columnDefs:[
                    {orderable:false,targets:[1]}
                ],
                rowCallback:function( row, data, index ){
                    var downloadBtn = $('<a class="btn btn-info btn-xs delete-task-btn" style="margin-left:10px">下载</a>');
                    downloadBtn.attr("href", __WEBROOT__ + "/Home/SpecialReport/download?_id=" + data["_id"]);
                    $('td:eq(5)', row).html(downloadBtn);
                },
                initComplete:function(){
                }
            }));
        }
    }

    var init_data = {
        init:function(){
            var w = this;
            $.post(__WEBROOT__ + "/Home/SpecialReport/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add(json);
                w.table.draw();
            });
        }
    }

    var init = function(){
        var w = this;
        w.init_view.init.call(w);
        w.init_data.init.call(w);
    }


    $(document).ready(function(){
        var specialReport=new SpecialReport();
        specialReport.init.call(specialReport);
    });

})();
