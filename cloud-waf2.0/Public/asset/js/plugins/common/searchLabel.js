/**
 * Created by kerry on 15/5/20.
 */
(function($){

    $.fn.searchLabels = function(options){
        var w=this;
        w.setting= $.extend({},options);

        w.getData=__call__.getData;
        w.load=__call__.load;
        __call__.handler.call(w);
        return w;

    }
    var __call__={
        load:function(data){
            var w=this;
            w.html("");
            var i=0;
            $.each(data,function(k,v){
                i++;
                var key= w.setting.nameMapper[k]||k;
                k=k.replaceAll("<","&lt;").replaceAll(">","&gt;");
                if(v&&(typeof v==='string')){
                    v=v.replaceAll("<","&lt;").replaceAll(">","&gt;");

                }
                var item= '<button class="btn btn-default btn-item" style="margin-right: 5px;" type="button" key="'+k+'">  '+(key+':<span class="value">'+v+'</span>')+'  <a class="fa fa-times a-btn-close" data-option-array-index="2"></a> </button>';
                w.append(item);

            });
            if(i==0){
                w.hide();
                if(w.parent().hasClass("panel")){
                    w.parent().hide();
                }
            }else{
                w.show();
                if(w.parent().hasClass("panel")){
                    w.parent().show();
                }
            }



        },
        getData:function(){
            var w=this;
            var items=$(".btn-item",w);
            var json={};
            $.each(items,function(i,item){
                var key=$(item).attr("key");
                var value=$(".value",item).text();
                json[key]=value;
            });
            return json;


        },
        handler:function(){
            var w=this;
            $(w).on("click",'.btn-item',function(){
                $(this).remove();
                var len=$(".btn-item",w).length;
                if(len==0){
                    w.hide();
                    if(w.parent().hasClass("panel")){
                        w.parent().hide();
                    }

                }
                if(w.setting.deleteLabel){

                    w.setting.deleteLabel.call(w);
                }
            });

        }

    }



})(jQuery);
