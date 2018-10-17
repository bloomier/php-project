/**
 * Created by jianghaifeng on 2016/3/1.
 */
(function(){

    var Notify = function(){
        this.parsley = $(".notify-user-form").parsley();
        this.init_view = init_view;
        this.init_btn = init_btn;
        this.init = init;
    }

    var init = function(){
        var w = this;
        initGroup.call(w);
        w.init_view.init_table.call(w);
        w.init_btn.init_bind.call(w);


    }
    var initGroup=function(){
        var w=this;
        w.groups= $.parseJSON($("#group").text());

        w.user_group={};
        $.each(w.groups,function(i,group){
            var userList=group.user_list||[];
            userList.forEach(function(uid){
                if(!w.user_group[uid]){
                    w.user_group[uid]=[];
                }
                w.user_group[uid].push(group.name);
            });

        });

    }

    var init_view = {
        init_table:function(){
            var w = this;
            w.table=$(".notice_user").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: 'name',width: '10%' },
                    { data: 'telephone',width: '15%' },
                    { data: 'email',width: '15%' },
                    { data: 'notify_group',width: '25%' },
                    { data: 'notify_type',width: '15%' },
                    { sDefaultContent: '' }
                ],
                columnDefs:[
                    {orderable:false,targets:[5]},
                    {
                        "targets": [3],
                        "render": function(data, type, full) {
                            var uid=full._id;
                            if(w.user_group[uid]){
                                var str="";
                                w.user_group[uid].forEach(function(n){
                                    str+=(n+",")
                                });
                                if(str.length>1){
                                    return str.substr(0,str.length-1);
                                }

                                return str;
                            }

                        }
                    },
                    {
                        "targets": [4],
                        "render": function(data, type, full) {
                            var str="";
                            if((data&1)==1){
                                str=str+" 短信";
                            }
                            if((data&2)==2){
                                str=str+" 邮件";
                            }
                            //console.info(text);
                            return str;

                        }
                    },
                    {
                        "targets": [5],
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
            $.post(__ROOT__+"/Home/NotifyUser/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
            w.myModal = $("#notify-user-add");
        }
    };


    var init_btn = {
        init_bind : function(){
            var w = this;
            //// 添加
            $(".datatable-btn-warper").on("click", ".btn-add", function(){

                storm.form.reset($(".notify-user-form"));
                $("input[name='_id']").val("");
                w.myModal.data("row", null);
                w.myModal.modal("show");
                $(".modal-title", $("#notify-user-add")).text("添加用户");
            });


            $(".notifySave").bind("click",function(){
                var param = storm.form.simpleSerialize($(".notify-user-form"));
                var checkbox=$("[name='notify_type']");
                var notify_type=0;
                $.each(checkbox,function(i,check){
                    if($(check).is(":checked")){
                        notify_type+=parseInt($(check).val());
                    }
                });
                param['notify_type']=notify_type;
                w.parsley.validate();
                if(w.parsley.isValid()){
                    $.ajax({
                        url:__WEBROOT__ + "/Home/NotifyUser/addOrUpdate",
                        type:"post",
                        data:param,
                        success:function(json){
                            if(json['code']>0){
                                w.myModal.modal("hide");
                                if(w.myModal.data("row")){
                                    var row=w.myModal.data("row");
                                    row.data(json.items).draw(false);        //编辑
                                }else{
                                    w.table.row.add(json.items).draw(false);//添加
                                }
                            }else{
                                swal({ title:json.msg, type:"error",confirmButtonText:"确定"});
                            }
                        }

                    });
                }

            });
            //
            //编辑
            $(".notice_user").on("click", ".btn-edit", function(){
                var row= w.table.row($(this).closest("tr"));
                storm.form.init($(".notify-user-form"), row.data());
                var form = $(".notify-user-form");
                //var checkbox =$("input[name='notify_type']");
                var notify_type=parseInt( row.data()['notify_type']);
                if((notify_type&1)==1){
                    $("[name='notify_type']:eq(0)").attr("checked","checked");
                }
                if((notify_type&2)==2){
                    $("[name='notify_type']:eq(1)").attr("checked","checked");
                }
                w.myModal.data("row", row);
                w.myModal.modal("show");
                $(".modal-title", $("#notify-user-add")).text("编辑用户");
            });



            ////删除
            $(".notice_user").on("click", ".btn-delete", function(){
                var row= w.table.row($(this).closest("tr"));
                var id = row.data()["_id"];
                storm.confirm("确定要删除吗?", function(){
                    $.post(__ROOT__ + "/Home/NotifyUser/delete", {_id:id}).success(function(json){
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
    };

    $(document).ready(function(){
        var notify=new Notify();
        notify.init();
    });

})();

