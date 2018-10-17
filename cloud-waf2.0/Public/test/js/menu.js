/**
 * Created by shijiaoyun on 2016/11/16.
 */

/**
 * Created by Administrator on 2016/11/16.
 */

var Menu = {
    init: function () {
        var w = this;

        w.initView();
        w.initEvent();

    },
    // 初始化页面
    initView: function(){
        var w = this;
        var height= $(window).height();

    },
    // 初始化事件
    initEvent: function(){
        var w = this;

        //绑定菜单点击事件
        $(".sim-link").click(function(){
            var link = $(this).attr('data-value');
            _functions_.addTab(link,$(this).html());
            console.info(link);
        });

        $(".acdc-page-item").click(function(){
            console.info('dd');
            _functions_.checkTab($(this).attr('data-value'));
        });
    }

}

/** 公共方法 */
var _functions_ = {
    getAllTab: function(){
        var w = this;
        var tabs = new Array();
        $('.acdc-page-group-tabs .acdc-page-group-item .acdc-page-item').each(function(){
            tabs.push($(this).attr('data-value'));
        });
        return tabs;
    },
    hadTab: function(link){
        var w = this;
        var tabs = w.getAllTab();
        if(tabs.indexOf(link) == -1){
            return false;
        }
        return true;
    },
    addTab: function(url,title){
        var w = this;
        if(!w.hadTab(url)){
            var oneTab   = $('<li class="acdc-page-group-item acdc-page-group-active-item" >' +
                '<ul class="acdc-page-item-tabs">' +
                '<li class="acdc-page-item first last active " data-value="' + url + '">' +
                '<strong id="ext-gen136" style="width: 140px;">' +
                '<div class="close"></div>' +
                '<em>' + title + '</em></strong>' +
                '</li>' +
                '</ul>' +
                '</li>');
            oneTab.click(function(){
                w.checkTab(url);
            });
            $(".acdc-page-group-tabs").append(oneTab);
            w.addIframe(2,url);
        }
        w.checkTab(url);
    },
    checkTab: function(url){
        console.info('checkTab');
        var w = this;
        $('.acdc-page-item').each(function(){
            if($(this).attr('data-value') == url){
                console.info('checkTab in');
                $(".acdc-page-item").removeClass('active');
                $(this).addClass('active').siblings(".acdc-page-item").removeClass('active');
                $(this).addClass("active").siblings(".acdc-page-item").removeClass("active");
                $(".acdc-page-group-item").removeClass('acdc-page-group-active-item');
            }
        });
        console.info(url);
        $(".J_iframe").each(function(){
            console.info($(this).attr('data-value'));
            if($(this).attr('data-value') == url){
                console.info('check frame')
                $(".sf_main_tabpanel").find("iframe.J_iframe").hide();
                $(this).show();
            }
        });
    },
    addIframe: function(num, link){
        var n='<iframe class="J_iframe" name="iframe'+ num +'" width="100%" height="100%" src="'+ link + '" frameborder="0" data-value="'+ link +'"></iframe>';
        $(".i-frame-content").find("iframe.J_iframe").hide().parents(".i-frame-content").append(n);
    }
}

/** 初始化数据 */
var _init_data = {

}


$(function(){
    Menu.init();
});