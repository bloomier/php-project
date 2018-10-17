(function($){
    $.fn.wizard=function(setting){
        var o = this;
        o.setting = {
            list:["stmp1", "stmp2","stmp1", "stmp2"],
            currentStmp:0
        };
        $.extend(o.setting, setting);
        __init__.init.call(o);
    };

    var __init__ = {

        init : function(){
            var o = this;

            __init__.initContent.call(o);
        },

        initContent : function(){
            var o = this;
            o.css("background-color",'blue');
            o.css('height','2px');
            var ul = $("<ul></ul>");
            // 计算每个li的长度
            //ul.css('margin-bottom', '5px');
            var liWidth = ($(this).width() / o.setting.list.length).toFixed(0);
            var offsetWidth = (liWidth / o.setting.list.length).toFixed(0) > 50 ? 50 : (liWidth / o.setting.list.length).toFixed(0);
            liWidth = liWidth - offsetWidth;

            $.each(o.setting.list, function(point, item){
                var li = $('<li></li>');
                li.append($('<i>' + item + '</i>'));
                if(point == o.setting.currentStmp){
                    li.addClass('wizard-current');
                }
                li.css('width', liWidth);
                //li.css('align','center');
                li.appendTo(ul);
            });
            ul.appendTo($(this));
        }
    }


})(jQuery);