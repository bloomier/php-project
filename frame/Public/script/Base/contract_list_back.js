/**
 * Created by jianghaifeng on 2016/3/1.
 */

//$.fn.modal.Constructor.prototype.enforceFocus = function () { };

$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var whichOne = $("#clickWhichCountId").val();
        if(whichOne == "allCount" ||
            (whichOne == "validCount" && (data[8] == '正常' || data[8] == '临期')) ||
            (whichOne == "adventCount" && data[8] == '临期') ||
            (whichOne == "overdueCount" &&  data[8] == "逾期")
        ){
            return true;
        }
        return false;
    }
);

(function(){

    var Contract = function(){
        this.init_view = init_view;
        this.init_data = init_data;
        this.init_btn = init_btn;
        this.setting = setting;
        this.__functions__ = __functions__;
        this.init = init;
    }

    var init = function(){
        var w = this;

        w.init_data.init_client_info.call(w);
        w.init_data.init_user_info.call(w);
        w.init_data.init_seller_info.call(w);

        w.init_view.init_table.call(w);
        w.init_view.init_dialog.call(w);

        w.init_btn.init_bind.call(w);
        w.__functions__.getAllKindsOfCount.call(w);
        w.__functions__.setDefaultValue.call(w);
        w.__functions__.initSelects.call(w);


    }

    var setting = {
        sourceProjectManager: {},
        sourceSeller: {},
        sourceClient: {}
    }


    var init_view = {
        init_table:function(){
            var w = this;

            w.table=$("#contract_site_table").DataTable($.extend(_dataTable_setting._static(),{
                ajax:{
                    url: __WEBROOT__ + "/Base/Contract/getList",
                    type:"post",
                    dataSrc:"items",
                    data: function ( d ) {
                        var wraper=$(".location-wraper");
                        d.param = $.trim($('#extra').val());

                    }
                },
                columns: [
                    { data: '', sWidth: '3%' },
                    { data: 'no', sWidth: '15%' },
                    { data: 'name', sWidth: '10%' },
                    { data: 'client', sWidth: '10%' },
                    { data: 'seller', sWidth: '10%' },
                    { data: 'project_manager', sWidth: '10%' },
                    { data: 'begin_date', sWidth: '13%' },
                    { data: 'end_date', sWidth: '12%' },
                    { data: 'stateDesc', sWidth: '10%' },
                    { data: 'state', sWidth: '7%' } //用户模糊搜索
                ],
                columnDefs:[
                    {orderable:false,targets:[0, 9]}
                ],
                //跟数组下标一样，第一列从0开始，这里表格初始化时，第7列默认降序
                "order": [[ 6, "desc" ]],
                rowCallback:function( row, data, index ){
                    w.currentData = data;
                    console.info(data);
                    var checkBox = $("<input type='checkbox' name='one'/>");
                    checkBox.bind("click",function(){
                        if ( !$(this).attr("checked")) {
                            // && $(this).closest("tr").hasClass('selected')
                            $(this).closest("tr").removeClass('selected');
                        } else {
                            $(this).closest("tr").addClass('selected');
                        }
                    });


                    var type = data['type'] && data['type'] == 1 ? "【正式】":"【试用】";
                    $("td:eq(2)",row).html(type + data['name']);

                    $("td:eq(3)",row).html(w.setting.sourceClient[data['client']]);
                    $("td:eq(4)",row).html(w.setting.sourceSeller[data['seller']]);
                    $("td:eq(5)",row).html(w.setting.sourceProjectManager[data['project_manager']]);

                    //var state = data['state'];
                    //if(state == 2){
                    //    state == '终止';
                    //} else {
                    //    var endDate = new Date(data['end_date']);
                    //    var nowDate = new Date();
                    //    var diff = endDate.valueOf() - nowDate.valueOf();
                    //    var diff_day = parseInt(diff/(1000*60*60*24));
                    //    if(diff_day < 0){
                    //        state = '逾期';
                    //    } else if(diff_day < 8) {
                    //        state = '临期';
                    //    } else {
                    //        state = '正常';
                    //    }
                    //
                    //}
                    //$("td:eq(8)",row).html(state);

                    $("td:eq(9)",row).html("");
                    //btn-attention
                    var editBtn=$('<a href="javascript:void(0)" title="修改"><i class="fa fa-edit"></i></a>');
                    editBtn.bind("click",function(){
                        __functions__.update_contract.call(w,data);
                    });

                    var location=__ROOT__+"/Home/Sites/addSite/contract_id/"+data['_id'];
                    var addSite=$('<a class="btn-report " target="_blank" href="' + location + '" title="添加站点"><i class="fa fa-plus"></i></a>');


                    var detailLocation = __ROOT__+"/Base/Contract/contractDetail/contract_id/"+data['_id'];
                    var detailBtn = $('<a class="btn-report " target="_blank" href="' + detailLocation + '" title="详情"><i class="fa fa-info-circle"></i></a>');

                    $("td:eq(9)",row).append(detailBtn);
                    if(data['state'] == 1){
                        $("td:eq(9)",row).append(editBtn);
                    }

                    //逾期和过期的就不用在此显示
                    if(data['state'] == 1 && data['stateDesc'] != '逾期'){
                        $("td:eq(0)",row).addClass('text-center').html("").append(checkBox);
                        $("td:eq(9)",row).append(addSite);
                    }

                },
                initComplete:function(){
                    var addBtn=$('<a  href="#" class="btn-add u-btn u-btn-success" ><i class="fa fa-plus"></i> 添加合同</a>');
                    var deleteBtn=$('<a  href="#" class="btn-delete-all u-btn u-btn-danger" ><i class="fa fa-minus"></i> 终止合同</a>');
                    $(".datatable-btn-warper").append(addBtn).append("&nbsp;").append(deleteBtn);
                }
            }));

            $('#waf_site_table_filter input').attr('placeholder','请输入域名|名称|IP')
        },
        init_dialog:function(){
            var w = this;
            w.dialog=new BootstrapDialog({
                title: '<h3>添加合同</h3>',
                type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                message: function () {
                    return $(".contract-dialog-content").show();
                },
                buttons: [
                    {
                        label: '确定',
                        hotkey:13,
                        cssClass: 'btn-primary',
                        action: function(dialogItself){
                            w.__functions__.addOrUpdateContract.call(w);
                        }
                    },
                    {
                        label: '关闭',
                        action: function(dialogItself){
                            dialogItself.close();
                            w.__functions__.clearForm.call(w);
                        }
                    }]
            });

        }
    }

    var __functions__ = {
        //修改合同弹出框时
        update_contract:function(data){
            var w = this;
            w.dialog.setTitle("<h3>修改合同</h3>");
            $("#_id_id").val(data['_id']);
            $("#no_id").val(data['no']);
            $("#name_id").val(data['name']);
            //$("#project_manager_id").select2({val: data['project_manager']});
            $('#project_manager_id').select().val(data['project_manager'] || '').trigger('change');
            $('#seller_id').select().val(data['seller'] || '').trigger('change');
            $('#client_id').select().val(data['client'] || '').trigger('change');
            $("#start_date_id").val(data['begin_date']);
            $("#end_date_id").val(data['end_date']);

            //$('input[type="radio"][name="type"]').val(data['type']);
            if(data['type'] == 1){
                $("input:radio[name='type']").attr("checked",false);
                $("input:radio[name='type']").eq(0).attr("checked",true);
            } else {
                $("input:radio[name='type']").attr("checked",false);
                $("input:radio[name='type']").eq(1).attr("checked",true);
            }
            w.dialog.open();
        },
        //点击保存按钮，新增或者保存
        addOrUpdateContract: function(){
            var w = this;
            var no = $("#no_id").val();
            if(no == ''){
                storm.alertMsg('请填写合同编号',"danger");
                return ;
            }
            var name = $("#name_id").val();
            if(name == ''){
                storm.alertMsg('请填写合同名称',"danger");
                return ;
            }
            var client = $("#client_id").val();
            if(client == ''){
                storm.alertMsg('请选择客户',"danger");
                return ;
            }
            var begin_date = $("#start_date_id").val();
            var end_date = $("#end_date_id").val();
            if(begin_date == '' || end_date == ''){
                storm.alertMsg('请填写合同期限',"danger");
                return ;
            }
            var project_manager = $("#project_manager_id").val();
            if(project_manager == ''){
                storm.alertMsg('请选择项目经理',"danger");
                return ;
            }
            var seller = $("#seller_id").val();
            if(seller == ''){
                storm.alertMsg('请选择销售',"danger");
                return ;
            }
            var type = $('input:radio[name="type"]:checked').val();

            param = {
                no: no,
                name: name,
                client: client,
                begin_date: begin_date,
                end_date: end_date,
                project_manager: project_manager,
                seller: seller,
                type: type
            }
            var _id = $("#_id_id").val();
            if(_id != ''){
                $.extend(param, {_id: _id});
            }
            storm.before_dialog_submit(w.dialog);
            $.post(__WEBROOT__ + "/Base/Contract/addOrUpdate", param).success(function(json){
                w.dialog.enableButtons(true);
                w.dialog.setClosable(true);
                if(json.code){
                    storm.alertMsg(json.msg,"success");
                    w.table.ajax.reload( null, false );
                    w.dialog.close();
                    w.__functions__.clearForm.call(w);
                } else {
                    storm.alertMsg(json['msg'], "danger");
                }
                //storm.dialog_submit(w.dialog, w.table, json);
            });
        },
        //清空弹框内容
        clearForm: function(){
            var w = this;
            $("#_id_id").val("");
            $("#no_id").val("");
            $("#name_id").val("");
            w.__functions__.setDefaultValue.call(w);

            $('#project_manager_id').select().val('').trigger('change');
            $('#seller_id').select().val('').trigger('change');
            $('#client_id').select().val('').trigger('change');
            $("input:radio[name='type']").attr("checked",false);
            $("input:radio[name='type']").eq(0).attr("checked",true);
        },
        //显示个数量
        getAllKindsOfCount: function(){
            $.post(__ROOT__+"/Base/Contract/getAllKindsOfCount",null).success(function(json){
                if(json){
                    console.info(json);
                    $.each(json, function(point, item){

                        $("." + point).text(item);
                    });
                }
            });
        },
        //设置时间默认值
        setDefaultValue : function(){
            var myDate = new Date();
            var fullYear = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            if(month < 10){
                month = '0' + month;
            }
            if(day < 10){
                day = '0' + day;
            }
            var happen_time = '' + fullYear + '-' + month + '-' + day;
            $("#start_date_id").val(happen_time);
            $("#end_date_id").val(happen_time);
        },
        initSelects: function(){

            $('#project_manager_id').select2();
            $('#client_id').select2();
            $('#seller_id').select2();

        }

    }

    var init_data = {
        //初始化项目经理
        init_user_info:function(){
            var w = this;
            $.ajax({
                async: false,
                type : "POST",
                dataType : 'json',
                url:__WEBROOT__ + "/Base/Contract/listUser",
                success:function(json){
                    $("#project_manager_id").append($("<option value=''>--请选择--</option>"));
                    $.each(json.items, function(point, item){
                        w.setting.sourceProjectManager[item['_id']] = item['name'] + "(" + item['username'] + ")";
                        $("#project_manager_id").append($("<option value='"+ item['_id']+ "'>" + item['name'] + "(" + item['username'] + ")</option>"));
                    });
                }
            });
        },
        //初始化销售信息
        init_seller_info : function(){
            var w = this;
            $.ajax({
                async : false,
                type : "POST",
                dataType : "json",
                url : __WEBROOT__ + "/Base/Contract/listSeller",
                success:function(json){
                    $("#seller_id").append($("<option value=''>--请选择--</option>"));
                    $.each(json.items, function(point, item){
                        w.setting.sourceSeller[item['_id']] = item['name'] + "(" + item['phone_num'] + ")";
                        $("#seller_id").append($("<option value='"+ item['_id']+ "'>" + item['name'] + "(" + item['phone_num'] + ")</option>"));
                    });
                }
            });
        },
        //初始化客户信息
        init_client_info : function(){
            var w = this;
            $.ajax({
                async : false,
                type : "POST",
                dataType : "json",
                url : __WEBROOT__ + "/Base/Contract/listClient",
                success:function(json){
                    $("#client_id").append($("<option value=''>--请选择--</option>"));
                    $.each(json.items, function(point, item){
                        w.setting.sourceClient[item['_id']] = item['name'] + "(" + item['phone_num'] + ")";
                        $("#client_id").append($("<option value='"+ item['_id']+ "'>" + item['name'] + "(" + item['phone_num'] + ")</option>"));
                    });
                }
            });
        }
    }

    var init_btn = {
        init_bind : function(){
            var w = this;
            //新增合同
            $(".btn-add").live("click", function(){
                w.dialog.setTitle("<h3>添加合同</h3>");
                w.dialog.open();
            });
            //批量终止合同
            $(".btn-delete-all").live("click", function(){
                //console.info(w.table.rows('.selected').data());
                var rows = w.table.rows('.selected').data();
                if(!rows || rows.length == 0){
                    storm.alertMsg("请勾选待终止项!");
                    return ;
                }
                storm.confirm("您确定要终止勾选的合同吗？",function(){
                    var _ids = "";
                    $.each(rows, function(i,item){
                        _ids += item._id + ",";
                    });
                    _ids = _ids.substr(0,_ids.length - 1);
                    $.post(__ROOT__+"/Base/Contract/stopContract",{_ids: _ids}).success(function(json){
                        if(json['code']){
                            w.table.ajax.reload( null, false );
                        }
                        storm.alertMsg(json['msg'],"danger");
                        $("#checkAll_id").attr("checked",false);
                        w.__functions__.getAllKindsOfCount.call(w);
                    });
                });
            });

            //全选
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

            //绑定各种类型点击时
            $(".font-num").live("click", function(){
                var val = $(this).attr("class")
                var array = val.split(" ");
                if($(this).html() != "0"){
                    $("#clickWhichCountId").val(array[0]);
                    w.table.draw();
                }
            });

        }
    }

    $(document).ready(function(){
        var contract = new Contract();
        contract.init.call(contract);
    });

})();
