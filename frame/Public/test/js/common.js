/**
 * Created by Administrator on 2016/11/16.
 */

var Common = {
    init: function () {
        var w = this;

        w.initView();
        w.initEvent();
        $(window).resize(function () {
            w.initView();
        });

    },
    // 初始化页面
    initView: function(){
        var w = this;
        var height= $(window).height();
        height = height - 50;
        $("#sf_main_tabpanel").height(height);
        $("#footer").css({top: height,position:"absolute"});
    },
    // 初始化事件
    initEvent: function(){
        var w = this;


    }

}

/** 公共方法 */
var _functions_ = {
    getSelect: function(){
        var ids = new Array();
        $('.chkOne').each(function(){
            if($(this).prop('checked')){
                ids.push($(this).attr('data-value'));
            }
        });
        return ids.join(",");
    }
}

/** 初始化数据 */
var _init_data = {

}


$(function(){
    Common.init();
});