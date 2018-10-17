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
                "sAjaxSource": __ROOT__+'/Security/NotifyUser/query',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'user_ID'},
                    {"mDataProp": 'user_NAME'},
                    {"mDataProp": 'user_FIRM'},
                    {"mDataProp": 'user_TYPE'},
                    {"mDataProp": 'user_HANDSET'},
                    {"mDataProp": 'user_EMAIL'},
                    {"mDataProp": 'user_MIXIN'},
                    //{"mDataProp": 'user_WEIXIN'},
                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                    $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['user_ID']+"'>");
                    var userType = aData['user_TYPE'];
                    var typeCn = "";
                    if(1 & userType){
                        typeCn = typeCn + " 公安部 ";
                    }
                    if(8 & userType){
                        typeCn = typeCn + " 省CERT ";
                    }
                    if(2 & userType){
                        typeCn = typeCn + " 省公安厅 ";
                    }
                    if(4 & userType){
                        typeCn = typeCn + " 市公安局 ";
                    }
                    if(16 & userType){
                        typeCn = " 公司业务员 ";
                    }
                    $('td:eq(3)', nRow).html(typeCn);
                    var editBtn=$('<a class="btn blue-stripe mini" href="#">修改</a>');
                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/Security/NotifyUser/toUpdate?u_id=" + aData["user_ID"];
                        location.href = path;
                    });
                    deleteBtn.bind("click",function(){
                        storm.confirm("确定要删除吗",function(){
                            $.post(__ROOT__ + "/Security/NotifyUser/delete", {"userId":aData["user_ID"]}).success(function(json){
                                Message.init({
                                    text: json.msg,
                                    type: 'success' //info success warning danger
                                });
                                roleTable.fnDraw(false);
                            });
                        });
                    });

                    $('td:eq(7)', nRow).append(editBtn).append(deleteBtn);
                },

                "fnServerParams":function(aoData){//查询条件
                    filterParam.push({"name":"is_DELETE",value : 0});
                    $.merge(aoData,filterParam);

                }
            }));
        },
        addHandler:function(){
            $(".btn-add-role").attr("href", __ROOT__ + "/Security/NotifyUser/toAdd");
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#roleTable"));
                __function__.beathDelete(ids);
            });
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"userName",value:param});
                }
                roleTable.fnPageChange(0);
                // roleTable.fnDraw(false);
            });


        }
    };

    var __function__ = {
        beathDelete : function(ids){
            if(ids == ''){
                storm.alert("请先勾选通报用户");
                return ;
            }
            storm.confirm("确定要删除吗",function(){
                $.post(__ROOT__ + "/Security/NotifyUser/beatchDelete", {"ids":ids}).success(function(json){
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