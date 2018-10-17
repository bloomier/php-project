/**
 * dw
 */

(function(){
	
	var init_view = {
		init_table : function() {
			var w = this;
			// console.info(_dataTable_setting._static());
			w.table = $("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
				ajax:{
					url: __WEBROOT__ + "/Home/Index/dataTable",
					type:"post",
					dataSrc:"items",
					data: function ( d ) {
						
					}
				},
				columns: [
                    { data: 'id', sWidth: '20%' },
                    { data: 'no', sWidth: "20%" },
                    { data: 'name', sWidth: '20%' },//expire
                    { data: 'ip', sWidth: '20%' },
                    { data: 'address', sWidth: '20%' }
                ],
                columnDefs:[
                    {orderable:false}
                ],
                rowCallback:function( row, data, index ){
                    console.info(data);


                }
                
			}));
		}
	};
	
	$(document).ready(function(){
		init_view.init_table();
	});
	
})();