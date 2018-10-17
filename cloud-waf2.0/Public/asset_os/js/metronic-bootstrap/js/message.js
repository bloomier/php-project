/**
 *@name
 *@author Sean.xiang
 *@date 2015/7/7
 *@version
 *@example
 *       Message.init({
        text: '操作成功',
        type: 'success' //info success warning danger
    });
 */
var Message = {
    init: function(o){
        var w = this;

        var t = $('.msg');
        if(t.get(0)){
            w.el = t;
        }else{
            w.el = $('<div></div>');
            w.el.addClass('msg');
            $(document.body).append(w.el);
        }
        w.text(o.text);
        w.type(o.type);
        w.show();

    },

    text: function(str){
        var w = this;
        w.el.text(str);
    },
    type: function(str){
        var w = this;
        w.el.addClass("alert-"+ str );
    },
    show: function(){
        var w = this;
        w.el.show();
        window.setTimeout(function(){
            w.el.hide();
        }, 1000);
    }
};