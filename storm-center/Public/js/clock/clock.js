/**
 * Created by kerry on 15/5/20.
 */
(function($){
    $.fn.clock = function(options){
        var o=this;
        o.day=0;
        o.hour=0;
        o.min=0;
        o.sec=0;
        o.load=__call__.load
        __call__.auto_run.call(o);
        return o;
    }
    var __call__={
        load:function(seconds){
            var w=this;
            __function__.getTime.call(w,seconds);
           __function__.showTime.call(w);

        },
        auto_run:function(){
            var w=this;
            setInterval(function(){
                w.sec= w.sec+1;
                if(w.sec==60){
                    w.sec=0;
                    w.min= w.min+1;
                }
                if(w.min==60){
                    w.min=0;
                    w.hour= w.hour+1;
                }
                if(w.hour==24){
                    w.hour=0;
                    w.day= w.day+1;
                }
                __function__.showTime.call(w);
            },1000);

        }

    };
    var __function__={
        getTime:function(seconds){
            var w=this;
            w.day= Math.floor(seconds/86400);
            w.hour=Math.floor(seconds%86400/3600);
            w.min=Math.floor(seconds%3600/60);
            w.sec=Math.floor(seconds%60);

        },
        showTime:function(){
            var w=this;
            $("._day",w).text(w.day);
            $("._hour",w).text((w.hour>=10?"":"0")+w.hour);
            $("._min",w).text((w.min>=10?"":"0")+w.min);
            $("._sec",w).text((w.sec>=10?"":"0")+w.sec);
        }
    }




})(jQuery);
