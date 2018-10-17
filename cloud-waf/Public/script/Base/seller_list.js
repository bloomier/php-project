/**
 *@name
 *@author ancyshi
 *@date 2016/6/13
 *@version
 *@example
 */


/**
 * Created by jianghaifeng on 2016/3/1.
 */

(function(){

    var WafSite = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.setting = setting;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.parsley = $("#wafForm").parsley();
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);

    }

    var setting = {
        sourceUser:[],
        attentionId:[]
    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Base/Seller/getList",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                "bAutoWidth": false,
                columns: [
                    { data: '', sWidth: '3%' },
                    { data: 'name', sWidth: "25%" },
                    { data: 'phone_num', sWidth: '15%' },
                    { data: 'email', sWidth: '15%' },
                    { data: 'state', sWidth: '10%' },
                    { data: 'desc', sWidth: '22%' },
                    { data: '', sWidth: '10%' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0, 6]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                //"order": [[ 6, "desc" ]],
                rowCallback:function( row, data, index ){
                    w.currentData = data;
                    var checkBox = $("<input type='checkbox' name='one'/>");
                    checkBox.bind("click",function(){
                        if ( !$(this).attr("checked")) {
                            // && $(this).closest("tr").hasClass('selected')
                            $(this).closest("tr").removeClass('selected');
                        } else {
                            $(this).closest("tr").addClass('selected');
                        }
                    });
                    $("td:eq(0)",row).html(checkBox);

                    //var action = '<a class="u-btn u-btn-success u-btn-sm">放行</a>';
                    //if(data.action == 'block'){
                    //    action = '<a class="u-btn u-btn-danger u-btn-sm">拦截</a>';
                    //}
                    //$("td:eq(3)",row).html(action);


                    //var expire = __functions__.setExpire(data);
                    //$("td:eq(2)",row).html(expire);
                    // var row= w.table.row($(this).closest("tr"));




                    //var forward = __functions__.setForward(data);
                    //$("td:eq(2)",row).html("");
                    //$("td:eq(2)",row).append(forward);

                    var state = __functions__.setState(data);
                    $("td:eq(4)",row).html("");
                    $("td:eq(4)",row).append(state);

                    var editBtn=$('<a href="javascript:void(0)" title="修改"><i class="fa fa-edit"></i></a>');
                    editBtn.bind("click",function(){
                        var href = __ROOT__ + "/Base/Seller/addUpdatePage?_id=" + data['_id'];
                        window.location.href = href;
                    });
                    var deleteBtn=$('<a href="javascript:void(0)" title="删除"><i class="fa fa-trash"></i></a>');
                    deleteBtn.bind("click",function(){
                        __functions__.delete.call(w,data['_id']);
                    });
                    $("td:eq(6)",row).html("");
                    $("td:eq(6)",row).append(editBtn).append(deleteBtn);


                },
                initComplete:function(){
                    var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-success" ><i class="fa fa-plus"></i> 新增</a>');
                    addBtn.bind("click", function(){
                        var path = __ROOT__ + "/Base/Seller/addUpdatePage";
                        location.href = path;
                    });
                    var deleteBtn=$('<a  href="#" class="btn-delete-all u-btn u-btn-danger" ><i class="fa fa-minus"></i> 删除</a>');

                    $(".datatable-btn-warper").append(addBtn).append("&nbsp;").append(deleteBtn);

                }
            }));


            $('#waf_site_table_filter input').attr('placeholder','姓名 | 电话  ');
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
                $.post(__ROOT__+"/Base/Seller/delete",{_id: _id}).success(function(json){
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
                    $.post(__ROOT__+"/Base/Seller/delete",{_id: _id}).success(function(json){
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


        }
    }

    $(document).ready(function(){
        var wafSite=new WafSite();
        wafSite.init.call(wafSite);
    });

})();
