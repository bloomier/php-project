/**
 *@name
 *@author Sean.xiang
 *@date 2016/6/15
 *@version
 *@example
 */

var Detail = {
    init: function(){
        var w = this;

        w.initHtml();

    },
    initHtml: function(){
        var w = this;
        var domain=$('#domain').val();
        NProgress.start();
        $.get(__ROOT__ +'/Mobile/Site/getAssetMsg?domain='+domain).success(function(json){
            $('.list').html('');
            var status = json.bypass==0?'已开启':'已关闭';
            $('.j-title').text(json.title);
            $('.j-ip').text(domain);
            $('.j-siteVail').text(json.siteVail);
            $('.j-vulsLevel').text(json.vulsLevel);
            $('.j-visitCount').text(json.visitCount);
            $('.j-attackCount').text(json.attackCount);
            $('.j-flow').text(json.flow);
            $('.j-status').text(json.bypass=json.bypass==0?'开启':'关闭');
            NProgress.done();

        });

        $('.report').attr('href',__ROOT__+"/Mobile/Report/index/domain/"+domain);
        $('.monitor').attr('href',__ROOT__+"/Mobile/Survey/index/domain/"+domain);


    }

};

$(function(){
    Detail.init();
});