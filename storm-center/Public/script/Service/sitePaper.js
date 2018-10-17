/**
 * Created by song on 15-8-19.
 */
(function(){
    var siteTable;
    var filterParam=[];

    var o = {

        init: function () {
            var w = this;
            w.initTable();
            w.bindFunction();
            //console.info(123);
        },
        initTable : function(){
            siteTable = $(".siteTableInfo").dataTable($.extend(storm.defaultGridSetting(),{
                "sAjaxSource": __ROOT__+'/Service/WebSite/querySite',//请求URL
                "aoColumns": [ //参数映射
                    {"mDataProp": 'title'},
                    {"mDataProp": '_id'},

                    {"sDefaultContent": ''}
                ],

                "fnRowCallback": function(nRow, aData, iDisplayIndex) {//行绘制前的回调
                    var web_domain = aData['_id'];
                    var yesterday = new Date().getLastDate(-1);
                    var path = __ROOT__ + '/Service/Report/index?domain=' + web_domain + '&time=' + yesterday;
                    var reportInfo=$('<a class="btn yellow-stripe mini" href="' + path + '" target="_blank">查看</a>');
                    $('td:eq(2)', nRow).html(reportInfo);
                },
                "fnServerParams":function(aoData){//查询条件
                    $.merge(aoData,filterParam);
                }
            }));
        },
        bindFunction : function(){
            $(".btn-search").bind("click",function(){
                var param=$('.query-param').val();
                param= $.trim(param);
                filterParam=[];
                if(param!=''){
                    filterParam.push({name:"param",value:param});
                }
                siteTable.fnDraw(false);
            });
        }
    }

    $(function(){
        o.init();
    })
})();
