/**
 * Created by jianghaifeng on 2016/3/24.
 */
(function(){
    var select_side={
        getSelectUser:function(){
            var m2=$(".ms2side__select:eq(1)");
            var arr=[];
            $.each($("option",m2),function(i,o){
                arr.push($(o).val());
            });
            return arr;

        },
        clear:function(){
            var m1=$(".ms2side__select:eq(0)");
            var m2=$(".ms2side__select:eq(1)");
            $.each($("option",m2),function(i,o){
                $("select",m1).append($(o));
            });
            //console.info( $(".RemoveAll",$(".ms2side__div")))
            //$(".RemoveAll",$(".ms2side__div")).trigger("click");

        },
        reset:function(userList){
            var m2=$(".ms2side__select:eq(1)");
            $.each( $("option",$("#user_listms2side__sx")),function(i,o){
                var value=parseInt($(this).val());
                if($.inArray(value,userList)!=-1){
                    $("select",m2).append($(o));
                }
            });
        }
    }

    var app={
        init:function(){
            app.view();
            app.hander();
        },
        view:function(){
            this.creaters= $.parseJSON($("#creaters").text());
            $("#searchable").multiselect2side({
                search: "待选区　　搜索：" ,
                selectedPosition: "right",
                moveOptions: false,
                labelsx: "待选区",
                labeldx: "已选区"
            });
            var w=this;
            w.table=$(".notice_group").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'name',width: '30%' },
                    { data: 'count',width: '20%' },
                    { data: 'creater',width: '20%' },
                    { sDefaultContent: '' }
                ],
                columnDefs:[
                    {orderable:false,targets:[3]},
                    {
                        "targets": [1],
                        "render": function(data, type, full) {
                            var userList=full.user_list||[];
                            return userList.length;
                            //return str;

                        }
                    },

                    {
                        "targets": [2],
                        "render": function(data, type, full) {
                            var user= w.creaters[data+""];
                            return user.name;

                        }
                    },
                    {
                        "targets": [3],
                        "render": function(data, type, full) {
                            var editBtn='<a class="btn-edit btn btn-xs  btn-info " href="javascript:void(0)"><i class="fa fa-pencil"></i>&nbsp;修改</a>';
                            var deleteBtn='<a class="btn-delete btn btn-xs btn-danger mg-l-5" href="javascript:void(0)"><i class="fa fa-trash"></i>&nbsp;删除</a>';
                            return editBtn+deleteBtn;

                        }
                    }

                ],

                rowCallback:function( row, data, index ){

                },
                initComplete:function(){
                    var addBtn=$('<a class="btn-add btn btn-sm  btn-primary " href="javascript:void(0)"><i class="fa fa-plus"></i>&nbsp;添加</a>');
                    $(".datatable-btn-warper").html(addBtn);
                }
            }));
            $.post(__ROOT__+"/Home/NotifyGroup/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
            w.myModal = $("#notify-user-add");
            w.dialog=$("#dialog-notify-group");
        },
        hander:function(){
            var w=this;
            $("body").on("click",".btn-add",function(){
                storm.form.reset($(".notify-group-form"));

                $(".modal-title", w.dialog).text("添加群组");
                w.dialog.data("row", null);
                $("input[name='_id']").val("");
                w.dialog.modal("show");
                select_side.clear();


            });
            $(".notice_group").on("click", ".btn-edit", function(){
                var row= w.table.row($(this).closest("tr"));
                storm.form.init($(".notify-group-form"), row.data());
                $(".modal-title", w.dialog).text("修改群组");
                w.dialog.data("row", row);
                $("input[name='_id']").val(row.data()['_id']);
                var userList=row.data()['user_list'];
                select_side.clear();
                select_side.reset(userList);

                w.dialog.modal("show");
            });

            $(".notifySave").bind("click",function(){
                var param=storm.form.simpleSerialize($(".notify-group-form"));
                param['remark']= $.trim(param['remark']);
                delete param['user_listms2side__dx[]'];
                delete param['user_listms2side__sx'];
                param['user_list']=select_side.getSelectUser();
                $.post(__ROOT__+"/Home/NotifyGroup/addOrUpdate",param).success(function(json){
                    if(json['code']>0){
                        w.dialog.modal("hide");
                        if(w.dialog.data("row")){
                            var row=w.dialog.data("row");
                            row.data(json.item).draw(false);        //编辑
                        }else{
                            w.table.row.add(json.item).draw(false);//添加
                        }
                    }else{
                        swal({ title:json.msg, type:"error",confirmButtonText:"确定"});
                    }
                });
            });

            ////删除
            $(".notice_group").on("click", ".btn-delete", function(){
                var row= w.table.row($(this).closest("tr"));
                var id = row.data()["_id"];
                storm.confirm("确定要删除吗?", function(){
                    $.post(__ROOT__ + "/Home/NotifyGroup/delete", {_id:id}).success(function(json){
                        if(json["code"]){
                            row.remove().draw();
                            swal({   title: json.msg, type: "success",   confirmButtonText: "确定" });
                        }else{
                            swal({   title: json.msg,  type: "error",   confirmButtonText: "确定" });
                        }
                    });
                });
            });

        }

    }
    $(document).ready(function(){
        app.init();
    });

})();
