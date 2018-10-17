/**
 *@name
 *@author ancyshi
 *@date 2016/6/13
 *@version
 *@example
 */



(function(){

    var ClientList = function(){
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);

    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#client_list_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Base/Client/getList",
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
                drawCallback: function(){//table数据加载完成后回调，初始化checkBox
                    var checkBox = $('input.i-checks').iCheck({checkboxClass:"icheckbox_square-green"});

                    checkBox.on('ifChecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        //alert(event.type + ' callback');
                        $(this).closest("tr").addClass('selected');
                    });

                    checkBox.on('ifUnchecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                        //alert(event.type + ' callback');
                        $(this).closest("tr").removeClass('selected');
                    });
                },
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第6列默认降序
                //"order": [[ 6, "desc" ]],
                rowCallback:function( row, data, index ){
                    w.currentData = data;

                    $("td:eq(0)",row).addClass('text-center').html($("<input type='checkbox' class='i-checks' name='one'/>"));


                    var state = __functions__.setState(data);
                    $("td:eq(4)",row).html("");
                    $("td:eq(4)",row).append(state);

                    var editBtn=$('<a href="javascript:void(0)" title="修改" class="btn btn-xs btn-info"><i class="fa fa-edit"></i> 修改</a>');
                    editBtn.bind("click",function(){
                        var href = __ROOT__ + "/Base/Client/addUpdatePage?_id=" + data['_id'];
                        window.location.href = href;
                    });
                    var deleteBtn=$('<a href="javascript:void(0)" title="删除" class="btn btn-xs btn-danger" style="margin-left: 4px;"><i class="fa fa-trash"></i> 删除</a>');
                    deleteBtn.bind("click",function(){
                        __functions__.delete.call(w,data['_id']);
                    });
                    $("td:eq(6)",row).addClass('text-center').html("");
                    $("td:eq(6)",row).append(editBtn).append(deleteBtn);


                },
                initComplete:function(){
                    var addBtn=$('<a  href="#" class="btn-add btn btn-sm btn-primary" ><i class="fa fa-plus"></i> 新增</a>');
                    addBtn.bind("click", function(){
                        var path = __ROOT__ + "/Base/Client/addUpdatePage";
                        location.href = path;
                    });
                    var deleteBtn=$('<a  href="#" class="btn-delete-all btn btn-sm btn-danger" ><i class="fa fa-minus"></i> 删除</a>');

                    deleteBtn.bind("click",function(){
                        __functions__.deleteAll.call(w);
                    });
                    $(".datatable-btn-warper").append(addBtn).append("&nbsp;").append(deleteBtn);

                }
            }));


            $('#client_list_table_filter input').attr('placeholder','客户名称|客户电话  ');
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
            var delObjMsg = "您确定要删除吗?";
            storm.confirm(delObjMsg,function(){
                $.post(__ROOT__+"/Base/Client/delete",{_id: _id}).success(function(json){
                    if(json['code']){
                        //w.table.row.remove().draw(false);
                        w.table.ajax.reload( null, false );
                        storm.alertMsg(json['msg'],"success");
                    }else{
                        storm.alertMsg(json['msg'],"danger");
                    }
                });
            });
        },
        deleteAll: function(){
            var w = this;
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
                $.post(__ROOT__+"/Base/Client/delete",{_id: _id}).success(function(json){
                    if(json['code']){
                        w.table.ajax.reload( null, false );
                    }

                    swal({   title: json.msg, type: json.code ? "success" : "error",   confirmButtonText: "确定" });
                    $("#checkAll_id").iCheck("uncheck");
                });
            });
        }

    }


    var init_btn = {
        init_bind : function(){
            var w = this;


            var one = $("#checkAll_id").iCheck({checkboxClass:"icheckbox_square-green"});
            one.on('ifChecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                $('input[type="checkbox"][name="one"]').each(
                    function() {
                        if ( !$(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").addClass('selected');
                        }
                        $(this).iCheck('check');
                    }
                );
                $('input.i-checks').iCheck({checkboxClass:"icheckbox_square-green"});
            });

            one.on('ifUnchecked', function(event){ //ifCreated 事件应该在插件初始化之前绑定
                $('input[type="checkbox"][name="one"]').each(
                    function() {
                        if ( $(this).closest("tr").hasClass('selected') ) {
                            $(this).closest("tr").removeClass('selected');
                        }
                        //$(this).attr("checked",false);
                        $(this).iCheck('uncheck');
                    }
                );
            });

        }
    }

    $(document).ready(function(){
        var clientList=new ClientList();
        clientList.init.call(clientList);
    });

})();
