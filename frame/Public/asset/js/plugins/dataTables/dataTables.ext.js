/**
 * Created by jianghaifeng on 2016/2/18.
 */
var zh_CN={
    language:{
        paginate:{
            first:"首页",
            previous:"上一页",
            next:"下一页",
            last:"末页"
        },
        //processing:'<div style="position: absolute;left: 50%;top: 50%;" class="sk-spinner sk-spinner-chasing-dots"><div class="sk-dot1"></div><div class="sk-dot2"></div></div>',
        processing:'<div style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;background-color: darkgray;opacity:0.5; -moz-opacity:0.5; filter:alpha(opacity=50);"><div style="position: absolute;left: 50%;top: 50%;"  class="sk-spinner sk-spinner-wave"> <div class="sk-rect1"></div><div class="sk-rect2"></div> <div class="sk-rect3"></div><div class="sk-rect4"></div><div class="sk-rect5"></div> </div></div>',
        info:"第_PAGE_/_PAGES_页 共_TOTAL_条 ",
        emptyTable:"暂无数据",
        infoEmpty:"暂无数据",
        infoFiltered: "(由 _MAX_ 项记录过滤)",
        lengthMenu:"每页_MENU_条",
        search:"查询",
        zeroRecords:"无匹配的记录"
    }
}
var _dataTable_setting={
    _static:function(){
        var setting={
            stateSave:false,
            order: [],
            pagingType:"full_numbers",
            dom:"<'row'<'col-sm-6 datatable-btn-warper'><'col-sm-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            //"<'row'<'col-sm-2 'l><'col-sm-2'i><'col-sm-8'p>>"
            //"<'grid-page'<'page'<'page-per'l><'page-total'i><'page-num'p>>>"
            "<'dataTables-bottom'<'page'<'page-length'l><'page-info'i><'page-num'p>>>"
        }
        return $.extend(zh_CN,setting);
    }
    ,
    _server:function(){
        var setting = {
            serverSide: true,
            pagingType:"full_numbers",
            ordering:false,
            processing:true,
            dom:"<'row'<'col-sm-6 datatable-btn-warper'><'col-sm-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
                //"<'row'<'col-sm-2 'l><'col-sm-2'i><'col-sm-8'p>>"
                //"<'grid-page'<'page'<'page-per'l><'page-total'i><'page-num'p>>>"
            "<'dataTables-bottom'<'page'<'page-length'l><'page-info'i><'page-num'p>>>"
        }
        return $.extend(zh_CN,setting);
    },
    _report:function(){//专用于报告
        var setting={
            stateSave:false,
            order: [],
            pagingType:"full",
            dom:
            "<'row'<'col-sm-12'tr>>" +
            "<'grid-page'<'page'<'page-per'l><'page-total'i><'page-num'p>>>"
        }
        return $.extend(zh_CN,setting);
    }
}

