/**
 *@name
 *@author Sean.xiang
 *@date 2015/6/30
 *@desc
 */
(function(){

    var roleTable;

    var parsley;
    var filterParam=[];

    $(document).ready(function(){
        //parsley=$("#roleForm").parsley();
        __init__.initView();
        __init__.addHandler();


    });

    var __init__={
        initView:function(){
            roleTable=$("#roleTable").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/NotifyGroup/query',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'groupId'},
                    {"mDataProp": 'groupName'},
                    {"mDataProp": 'groupType'},
                    {"mDataProp": 'notifyTarget'},
                    {"mDataProp": 'remark'},
                    {"mDataProp": 'notifyUserCount'},
                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['groupId']+"'>");
                    var groupType = aData['groupType'];
                    var groupTypeCn = "";
                    if(groupType == 1){
                        groupTypeCn = "中央部委";
                    }
                    if(groupType == 2){
                        groupTypeCn = "省公安厅";
                    }
                    if(groupType == 3){
                        groupTypeCn = "市公安局";
                    }
                    if(groupType == 4){
                        groupTypeCn = "省CERT";
                    }
                    if(groupType == 5){
                        groupTypeCn = "业务员";
                    }
                    $('td:eq(2)', nRow).html(groupTypeCn);

                    var notifyTarget = aData['notifyTarget'];
                    if(notifyTarget == "全国-"){
                        notifyTarget = "全国";
                    }
                    $('td:eq(3)', nRow).html(notifyTarget);
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/Security/NotifyGroup/toUpdate?groupId=" + aData["groupId"];
                        location.href = path;
                    });
                    deleteBtn.bind("click",function(){
                        storm.confirm("确定要删除吗",function(){
                            $.post(__ROOT__+"/Security/NotifyGroup/delete", {groupId:aData["groupId"],groupName:aData["groupName"]}).success(function(json){
                                roleTable.fnDraw(false);
                            });
                        });
                    });

                    $('td:eq(6)', nRow).append(editBtn).append(deleteBtn);
                },

                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);

                }
            }));
        },
        addHandler:function(){
            $(".btn-add-role").attr("href", __ROOT__ + "/Security/NotifyGroup/toAdd");
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#roleTable"));
                __function__.beathDelete(ids);

            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"groupName",value:param});
                }
                roleTable.fnDraw(false);
            });

        }
    };

    var __function__ = {
        beathDelete : function(ids){
            if(ids == ''){
                storm.alert("请先勾选通报群组");
                return ;
            }
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__ + "/Security/NotifyGroup/beatchDelete", {"ids":ids}).success(function(json){
                    Message.init({
                        text: json.msg,
                        type: 'success' //info success warning danger
                    });
                    roleTable.fnDraw(false);
                });
            });
        }
    }
})();