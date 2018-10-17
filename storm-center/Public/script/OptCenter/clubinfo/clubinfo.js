/**
 *@name
 *@author Sean.xiang
 *@date 2016/1/26
 *@example
 */

(function(){


    var filterParam = [];

    var port_table;
    var subdomain_table;
    var same_netWork_table;
    var attack_table;
    var attacked_table;
    var thisBtn ;
    var whoisDialog;


//     var domainInfoList = [];


    $(document).ready(function(){


        __init__.initView();
        __init__.addHandler();
        __init__.initTable();
    });



    var __init__={
        initView:function(){
            whoisDialog = new BootstrapDialog({
                title: '<h3>whois信息</h3>',
                // type: BootstrapDialog.TYPE_DEFAULT,
                autodestroy: false,
                closable: false,
                message: function(){
                    return $(".whois-dialog-content").show();
                },
                buttons: [{
                    label: '关闭',
                    action: function(dialogItself){
                        dialogItself.close();
                        whoisFlag = true;
                    }
                }]
            });
        },

        addHandler:function(){
            // 搜索按钮事件
            $(".search_clubinfo").bind("click", function(){
                var param = $.trim($(".ip_or_domain").val());
                if(!param){
                    Message.init({
                        text: '请先填写IP或域名',
                        type: 'warning' //info success warning danger
                    });
                    return;
                }

                thisBtn = $(this);
                thisBtn.attr("disabled", 'disabled');

                // 设置个表的查询条件
                filterParam=[];
                if(param != ''){
                    filterParam.push({name:"ip_domain",value:param});
                }


                __function__.getAddressInfo(param);
                __function__.getPortTableInfo();
                __function__.getWhoisInfo(param);
                __function__.getSubdomainTableInfo();
                __function__.getSameNetworkTableInfo();
                __function__.getAttackTableInfo();
                __function__.getAttackedTableInfo();

            });


        },
        initTable : function(){
            port_table = $(".port_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/ClubInfo/queryPort',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'id'},
                    {"mDataProp": 'port'},
                    {"mDataProp": 'state'},
                    {"mDataProp": 'service'}
                ],
                "aoColumnDefs": [//指定列属性

                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调

                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));

            subdomain_table = $(".subdomain_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/ClubInfo/querySubdomain',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'title',"sWidth": "20%"},
                    {"mDataProp": 'domain',"sWidth": "10%"},
                    {"mDataProp": 'securitVuls',"sWidth": "10%"},
                    {"mDataProp": 'highVuls',"sWidth": "10%"},
                    {"mDataProp": 'midVuls',"sWidth": "10%"},
                    {"mDataProp": 'lowerVuls',"sWidth": "10%"},
                    {"mDataProp": 'infoVuls',"sWidth": "10%"},
                    {"mDataProp": '',"sWidth": "10%"}
                ],
                "aoColumnDefs": [//指定列属性

                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var checkBtn=$('<a class="btn blue-stripe mini" href="#">获取whois信息</a>');
                    checkBtn.bind("click",function(){
                        var domain = aData['domain'];
                        __function__.getWhoisStrMsg(domain);
                    });
                    $('td:eq(7)', nRow).append(checkBtn);
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));

            same_netWork_table = $(".same_netWork_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/ClubInfo/querySameNetwork',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'title',"sWidth": "20%"},
                    {"mDataProp": 'ip',"sWidth": "8%"},
                    {"mDataProp": 'domain',"sWidth": "8%"},
                    {"mDataProp": 'securitVuls',"sWidth": "8%"},
                    {"mDataProp": 'highVuls',"sWidth": "8%"},
                    {"mDataProp": 'midVuls',"sWidth": "8%"},
                    {"mDataProp": 'lowerVuls',"sWidth": "8%"},
                    {"mDataProp": 'infoVuls',"sWidth": "8%"},
                    {"mDataProp": '',"sWidth": "8%"}
                ],
                "aoColumnDefs": [//指定列属性

                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var checkBtn=$('<a class="btn blue-stripe mini" href="#">获取whois信息</a>');
                    checkBtn.bind("click",function(){
                        var domain = aData['domain'];
                        __function__.getWhoisStrMsg(domain);
                    });
                    $('td:eq(8)', nRow).append(checkBtn);
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));

            attack_table = $(".attack_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/ClubInfo/queryAttack',//请求URL
                "aoColumns": [ //参数映射
                    //{"mDataProp": 'id'},
                    {"mDataProp": ''},
                    {"mDataProp": 'dip'},
                    {"mDataProp": 'deviceName'},
                    {"mDataProp": 'total'},
                    {"mDataProp": 'first_time'},
                    {"mDataProp": 'last_time'}
                ],
                "aoColumnDefs": [//指定列属性

                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).append(iDisplayIndex + 1);
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));



            attacked_table = $(".attacked_table").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/OptCenter/ClubInfo/queryAttacked',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": ''},
                    {"mDataProp": 'sip'},
                    {"mDataProp": 'total'},
                    {"mDataProp": 'first_time'},
                    {"mDataProp": 'last_time'}
                ],
                "aoColumnDefs": [//指定列属性

                ],
                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    $('td:eq(0)', nRow).append(iDisplayIndex + 1);
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));


        }

    };

    var __function__ = {
        getAddressInfo: function(param){
            $.ajax({
                type: "POST",
                url: __ROOT__ + "/OptCenter/ClubInfo/queryPhysicalAddress",
                data: {'ip_domain': param},
                dataType: "json",
                async: true,
                success : function(json){
                    if(json && json['code'] && json['code'] > 0){
                        $('#span_ip_id').html(json['other']);
                        $('#span_ip_addr_id').html(json['msg']);
                    }
                    thisBtn.removeAttr("disabled");
                }
            });
        },
        getWhoisInfo: function(param){
            $.ajax({
                type: "POST",
                url: __ROOT__ + "/OptCenter/ClubInfo/getWhoisInfo",
                data: {'ip_domain': param},
                dataType: "json",
                async: true,
                success : function(json){
                    if(json && json['code'] && json['code'] > 0){
                        var data = json['data'];
                        $("#whois_ip_id").html(data.ip);
                        //$("#whois_title_id").html(data.ip);
                        $("#whois_register_id").html(data.register);
                        $("#whois_owner_id").html(data.owner);
                        $("#whois_time_id").html(data.time);
                        //$("#whois_register_id").html(data.ip);
                    }
                    thisBtn.removeAttr("disabled");
                }
            });
        },
        getPortTableInfo: function(){
            port_table.fnDraw(true);
        },
        getSubdomainTableInfo: function(){
            subdomain_table.fnDraw(true);
        },
        getSameNetworkTableInfo: function(){
            same_netWork_table.fnDraw(true);
        },
        getAttackTableInfo: function(){
            attack_table.fnDraw(true);
        },
        getAttackedTableInfo: function(){
            attacked_table.fnDraw(true);
        },
        getWhoisStrMsg: function(domain){
            var param = {};
            param['ip'] = domain;
            var whoisStr = "";
            $(".whois_message").val(whoisStr);
            $.post(__ROOT__ + "/OptCenter/ClubInfo/getWhoisStrMsg", param).success(function(json){
                if(json && json.code && json.rows){
                    var rows = json.rows;
                    rows.forEach(function(item){
                        whoisStr += item + "\n";
                    });

                    $(".whois_message").val(whoisStr);
                    whoisDialog.open();
                }
            });
        }
    };
})();
