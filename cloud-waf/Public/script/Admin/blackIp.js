/**
 * Created by jianghaifeng on 2016/2/18.
 */
(function(){
    var o={
        init:function(){
            o.view();
            o.handler();
        },
        view:function(){
            var w=this;


            w.table=$("#ip_table").DataTable($.extend(_dataTable_setting._static(),{
                columns: [
                    { data: '_id' },
                    { data: 'userName' },
                    { data: ''}
                ],
                columnDefs:[
                    {orderable:false,targets:[2]}
                ],
                rowCallback:function( row, data, index ){
                    var deleteBtn = $('<a class="btn-delete" href="javascript:void(0)" title="解封该IP"><i class="fa fa-trash"></i></a>');
                    $("td:eq(2)",row).addClass('text-center').html("").append(deleteBtn);
                },
                initComplete:function(){

                }
            }));
            $.post(__ROOT__+"/Admin/BlackIp/listAll").success(function(json){
                w.table.clear();
                w.table.rows.add( json);
                w.table.draw();
            });
        },
        handler:function(){
            var w=this;

            $(".btn-delete").live("click",function(){
                var row= w.table.row($(this).closest("tr"));
                //ajax update
                var _id=row.data()['_id'];
                var userName=row.data()['userName'];
                storm.confirm("确定要解封" + _id + "吗?",function(){
                    $.post(__ROOT__+"/Admin/BlackIp/delete",{_id:_id, userName: userName}).success(function(json){
                        if(json.code){
                            row.remove().draw();
                        }
                        storm.showMsg(json.msg,json.code);
                    });
                });
            });
        }
    };
    var __functions__={
        getTreeSelectedIds:function(){
            var w=this;
            var ids=[];
            $.each(w.zTree.getCheckedNodes(),function(i,node){
                if(node._id>0){
                    ids.push(node._id);

                }
            });

            return ids.join(",");
        },
        resetTree:function(){
            var w=this;
            w.zTree.checkAllNodes(false);
        },
        setTreeSelected:function(ids){
            var w=this;
            w.zTree.checkAllNodes(true);
            var nodes= w.zTree.getCheckedNodes();
            $.each(nodes,function(i,node){
                var nodeId=node._id;

                if($.inArray(nodeId,ids)==-1){
                    w.zTree.checkNode(node,false);
                }
            });

        }
    }
    $(document).ready(function(){
        o.init();
    });

})();
