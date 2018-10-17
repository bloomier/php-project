/**
 *@name
 *@author ancyshi
 *@date 2015/09/11
 *@desc
 */
(function(){
    var contractTable;
    var filterParam=[];

    $(document).ready(function(){
        __init__.initView();
        __init__.addHandler();

    });

    var __init__={
        initView:function(){
            contractTable=$("#contractTable_id").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Security/WhiteList/queryWhiteList',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": ''},
                    {"mDataProp": 'client_no'},
                    {"mDataProp": 'client_name'},
                    {"mDataProp": 'domains'},
                    {"mDataProp": ''},
                    //{"mDataProp": 'contract_end_date'},
                    {"sDefaultContent": ''}
                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var is_deleted = aData['is_deleted'];
                    if(is_deleted == "1"){
                        $('td:eq(0)', nRow).html("<input type='checkbox' value='"+aData['id']+"'>");
                    }

                    var domains = aData['domains'];
                    if(domains.length > 50){
                        domains = domains.substr(0, 50) + "...";
                    } else {
                        domains = domains.substr(0, domains.length - 1);
                    }
                    $('td:eq(3)', nRow).text(domains);

                    var contract_end_date = aData['contract_end_date'];
                    var state = "<button type='button' class='btn grey btn-xs mini' disabled='disabled'>无效</button>";
                    if(is_deleted == "1"){//未删除的，未删除分为 预警、过期、和正常
                    //    if(contract_end_date != ""){
                    //        var days = __function__.getDays(__function__.stringToDate(contract_end_date));
                    //        if(days < 0 ){
                    //            state = "<button type='button' class='btn yellow btn-xs mini' disabled='disabled'>逾期</button>";
                    //        } else if( days < 30) {
                    //            state = "<button type='button' class='btn red btn-xs mini' disabled='disabled'>预警</button>";
                    //        } else {
                                state = "<button type='button' class='btn green btn-xs mini' disabled='disabled'>正常</button>";
                    //        }
                    //        contract_end_date = contract_end_date.substr(0, 10);
                    //    }
                    }
                    $('td:eq(4)', nRow).html(state);
                    //$('td:eq(5)', nRow).text(contract_end_date);

                    var editBtn=$('<a class="btn blue-stripe mini" href="#">查看</a>');
                    editBtn.bind("click",function(){
                        var path = __ROOT__ + "/Security/WhiteList/register/contract_id/" + aData["id"];
                        location.href = path;
                    });

                    var deleteBtn=$('<a class="btn red-stripe mini" href="#">删除</a>');
                    deleteBtn.bind("click",function(){
                        __function__.deleteContract(aData["id"]);
                    });

                    $('td:eq(5)', nRow).append(editBtn);
                    if(is_deleted == "1"){
                        $('td:eq(5)', nRow).append(deleteBtn);
                    }
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
        },
        addHandler:function(){
            //绑定删除按钮事件
            $(".bth-batch-delete").bind("click",function(){
                var ids=storm.getTableSelectedIds($("#contractTable_id"));
                __function__.deleteContract(ids);
            });
            //绑定查询按钮事件
            $(".btn-search").bind("click",function(){
                var param=$(this).prev().val();
                var is_deleted = $("#is_deleted_id").val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"groupName",value:param});
                }
                if(is_deleted != ''){
                    filterParam.push({name:"is_deleted",value:is_deleted});
                }
                contractTable.fnDraw(false);
            });
        }
    };

    var __function__ = {
        /** 删除合同 */
        deleteContract : function(ids){
            if(ids == ''){
                alert('请选择待删除记录！');
                return;
            }
            storm.confirm("确定删除白名单吗？",function(){
                $.post(__ROOT__ + "/Security/WhiteList/delete", {"ids":ids}).success(function(json){
                    if(json.code > 0){
                        storm.alert(json.msg);
                        contractTable.fnDraw(false);
                    } else {
                        storm.alert('删除失败');
                    }
                });
            });

        },
        //字符串转日期
        stringToDate: function(dateStr){
            var separator = "-";
            if(dateStr.indexOf("-") == -1){
                separator="/";
            }
            var dateArr = dateStr.split(separator);
            var year = parseInt(dateArr[0]);
            var month;
            if(dateArr[1].indexOf("0") == 0){
                month = parseInt(dateArr[1].substring(1));
            }else{
                month = parseInt(dateArr[1]);
            }
            var day = parseInt(dateArr[2]);
            var date = new Date(year,month -1,day);
            return date;
        },
        //获取日期和当前相差的天数
        getDays: function(date){
            var oneDayMiseconds = 24 * 60 * 60 * 1000;
            var today = new Date();
            var allMiSecons = date.getTime() - today.getTime();
            return Math.floor((allMiSecons / oneDayMiseconds) * 1);
        }
    }
})();