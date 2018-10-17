/**
 *@name
 *@author ancyshi
 *@date 2016/3/30
 *@version
 *@example
 */


/**
 * Created by jianghaifeng on 2016/3/1.
 */
(function(){

    var Test = function() {

    }

    $(document).ready(function(){
        // var test = new Test();
        var table = $('#table_id').DataTable({
            //"deferRender": true, // 控制表格的延迟渲染，可以提高初始化的速度，默认false
            //"autoWidth": false, //启用或者禁止自动列宽的计算 默认true
            //scrollY: 300,  // 允许滚动
            //paging: false  // 禁止分页
            //"scrollX": true //设置水平滚动
            //"searching": true //是否开启本地搜索，默认true
            //"stateSave": ture // 状态保存 - 再次加载页面时还原表格状态
                buttons: [
                    'selectRows'
                ]
        }
    );

        //$('#table_id tbody').on( 'click', 'td', function () {
        //    alert( 'Clicked on: '+this.innerHTML );
        //} );


        $('#table_id tbody').on( 'click', 'tr', function () {
            $(this).toggleClass('selected');
        } );

        $('#button').click( function () {
            alert( table.rows('.selected').data().length +' row(s) selected' );
        } );

        //
        //$('#example').dataTable( {
        //    "ajax": {
        //        "url": "data.json",
        //        "data": {
        //            "user_id": 451
        //        }
        //    }
        //} );

        //$('#example').dataTable( {
        //    "ajax": {
        //        "url": "data.json",
        //        "data": function ( d ) {
        //            d.extra_search = $('#extra').val();
        //        }
        //    }
        //} );

        //$('#example').dataTable( {
        //    "ajax": {
        //        "url": "data.json",
        //        "data": function ( d ) {
        //            return $.extend( {}, d, {
        //                "extra_search": $('#extra').val()
        //            } );
        //        }
        //    }
        //} );

        //$('#example').dataTable( {
        //    "ajax": {
        //        "url": "data.json",
        //        "contentType": "application/json",
        //        "data": function ( d ) {
        //            return JSON.stringify( d );
        //        }
        //    }
        //} );


        //初始化表格
        //var oTable = $("#example").DataTable({
        //    ajax: {
        //        url: "dataList.action",
        //        data: {
        //            args1: "我是固定传参的值，在服务器接收参数[args1]"
        //        }
        //    }
        //});

        //当你需要多条件查询，你可以调用此方法，动态修改参数传给服务器
        //function reloadTable() {
        //    var name = $("#seName").val();
        //    var admin = $("#seAdmin").val();
        //    var param = {
        //        "obj.name": name,
        //        "obj.admin": admin
        //    };
        //    oTable.settings()[0].ajax.data = param;
        //    oTable.ajax.reload();
        //}

    });

})();
