var DefenseCapability={
    init:function(){
        var w = this;
        w.init_table();
        w.addHandler();
    },
    init_table:function(){
        var w = this;
        w.filterParam=[];
        w.table=$("#waf_site_table").DataTable($.extend(_dataTable_setting._server(),{
            processing: true,
            serverSide: true,
            ordering:false,
            //ajax: __ROOT__+'/Home/DefenseCapability/getDefense',
            ajax:{
                url: __ROOT__+'/Home/DefenseCapability/getDefense',
                type:"post"
                //data: function () {
                //    var value = $.trim($(".search_param").val());
                //    return {'url':value};
                //}
            },
            columns: [
                { data: '', sWidth: '3%' },
                { data: 'time', sWidth: '10%' },
                { data: '', sWidth: '10%' },
                { data: 'url', sWidth: '25%' },
                { data: 'type', sWidth: '10%' },
                { data: '', sWidth: '5%' },
                { data: '', sWidth: '10%' }
            ],
            rowCallback:function( row, data, index ){
                $('td:eq(0)', row).html("<input type='checkbox' value='"+data['id']+"'>");

                $('td:eq(1)',row).html("<p>"+data['time']+"</p><p>"+data['dateKey']+"</p>");

                var site = data['url']&&data['url'].substring(0,data['url'].indexOf("/"));
                var title = globalObj.domainTitle[site]&&globalObj.domainTitle[site].length<30?globalObj.domainTitle[site]:globalObj.domainTitle[site].substr(0,30)+"...";

                $('td:eq(2)',row).html("<p title='"+globalObj.domainTitle[site]+"'>"+title+"</p>");

                var url = data['url'].length<=35?data['url']:data['url'].substr(0,35)+"...";
                $('td:eq(3)',row).html("<p title='"+data['url']+"'>"+url+"</p>");

                var attackType = data['type'].substr(0,4);
                $('td:eq(4)',row).html(globalObj.attackTypeId[attackType]);

                var hanldState = data['handleState']&&data['handleState'] == 1?"已处理":"未处理";
                $('td:eq(5)',row).html(hanldState);

                var btnDisPost = $('<a href="javascript:void(0)" title="处理"><i class="fa fa-cogs"></i>处理</a>');
                $('td:eq(6)',row).html(btnDisPost);
            },
            serverParams:function(aoData){//查询条件
                w.filterParam=[];
                var value = $.trim($(".search_param").val());
                w.filterParam.push({'url':value});
                var handleState = $(".handle_state").val();
                w.filterParam.push({'handleState':handleState});
                $.merge(aoData, w.filterParam);
            }
        }));
    },
    addHandler:function(){
        var w = this;
        $(".btn-search").on("click",function(){
            w.filterParam=[];
            var value = $.trim($(".search_param").val());
            w.filterParam.push({'url':value});

            var handleState = $(".handle_state").val();
            w.filterParam.push({'handleState':handleState});
            //w.table.draw();
            w.table.ajax.reload(null,false);
        });

    }
};
var globalObj = {
    domainTitle:$.parseJSON($("#domainTitle").text()),
    attackTypeId:$.parseJSON($("#attackTypeId").text())
};

$(function(){
    DefenseCapability.init();
});