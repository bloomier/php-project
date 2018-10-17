/**
 *@name
 *@author ancy.shi
 *@date 2015/09/09
 *@desc
 */

(function(){
    //通过合同id获取的合同对象
    var contract = $("#contract_id").val();

    $(document).ready(function(){
        __init__.bindFunction();
        if(contract){
            contract = decodeURIComponent(contract);
            contract = $.parseJSON(contract);
            __function__.setValues(contract);
        }
    });

    var __init__={
        initView : function(){

        },
        bindFunction : function(){
            //归属区域选择变化后，相应区域责任人和销售责任人变化
            $("#area_id").live("change", function(){
                var saleValues = "";
                var areaValues = "";
                if($('#area_id option:selected').val() != "请选择"){
                    saleValues = $('#area_id option:selected') .attr("saleValue");
                    areaValues = $('#area_id option:selected') .attr("areaValue");
                } else {
                    var obj = $('#area_id');
                    $("#area_id option").each(function (){
                        saleValues += "," + $(this).attr("saleValue");
                        areaValues += "," + $(this).attr("areaValue");
                    });
                }
                __function__.initSelect('sale_responsible_id',saleValues);
                __function__.initSelect('area_responsible_id',areaValues);
            });

            //合同登记（新增）
            $(".contract_register").live("click", function(){
                if(__function__.validate()){
                    __function__.submit();
                }
            });

            //重置form表单
            $(".reset_form").live("click", function(){
                $("#form_id").resetForm();
            });

            //设置开始时间小于结束时间
            //$("#contract_start_date_id").bind("click focus", function () {
            //    WdatePicker({
            //        maxDate: '#F{$dp.$D(\'contract_end_date_id\')}',
            //        dateFmt: "yyyy-MM-dd"
            //    });
            //});
            //
            ////设置结束时间大于开始时间
            //$("#contract_end_date_id").bind("click focus", function () {
            //    WdatePicker({
            //        minDate: '#F{$dp.$D(\'contract_start_date_id\')}',
            //        dateFmt: "yyyy-MM-dd" //  HH:mm:ss
            //    });
            //});
        }
    };

    var __function__ = {
        //初始化下拉框
        initSelect: function(id,values){
            var select = $("#" + id);
            if(id && values){
                select.html("").append("<option value=''>请选择</option>");
                var arr = values.split(",");
                for(var i = 0,num = arr.length; i < num; i++){
                    if(arr[i] != ""){
                        select.append("<option value='" + arr[i] + "'>" + arr[i] + "</option>");
                    }
                }
            } else {
                select.html("").append("<option value=''>请选择</option>");
            }
        },
        // 提交表单
        submit: function(){
            storm.confirm("确定登记该白名单吗？",function(){
                var form=$("#form_id");
                $(form).ajaxSubmit({
                    "type":"POST",
                    "dataType":"json",
                    "success":function(json){
                        if(json.code>0){
                            storm.alert(json.msg);
                            form.resetForm();
                        }else{
                            storm.alert(json.msg);
                        }
                    }
                });
            });
        },
        // 验证数据是否填写完整，不完整返回false
        validate: function(){
            var client_no = $("#client_no_id").val();
            if(client_no == ''){
                storm.alert('请填写客户编号');
                return false;
            }
            var client_name = $("#client_name_id").val();
            if(client_name == ''){
                storm.alert('请填写客户名称');
                return false;
            }
            //var contract_start_date = $("#contract_start_date_id").val();
            //var contract_end_date = $("#contract_end_date_id").val();
            //if(contract_start_date == '' || contract_end_date == ''){
            //    storm.alert('请将合同有效期填写完整');
            //    return false;
            //}
            var domains = $("#domain_id").val();
            if(domains == ''){
                storm.alert('请填写检测网站');
                return false;
            }
            return true;
        },
        //设置值
        setValues: function(contract){
            var form = $("#form_id");
            storm.initForm(form,contract);
            $("#domain_id").val(contract.domains);
            //$("#contract_start_date_id").val(contract.contract_start_date.slice(0,10));
            //$("#contract_end_date_id").val(contract.contract_end_date.slice(0,10));
            $("#client_phone_id").val(contract.client_phone);
            $("#remark_id").val(contract.remark);
        }
    }

})();