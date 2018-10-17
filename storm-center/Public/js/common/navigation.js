/**
 * Created by kerry on 15/5/20.
 */


(function($){
    var opt={};
    $.fn.nav = function(options){
        options= $.extend(opt,options);
        this.options=options;
        if(this,options.links){
            __functions__.init.call(this,options.links);

        }
        //__functions__.init.call(this,options.links);
        __functions__.handler.call(this);



    }
    var __functions__={
        init:function(links){
            var that=this;
            $.each(links,function(i,link){
                var item=$('<li class="nav-level-1"><a class="nav-level-1-link" loc="'+(link.href||"")+'" href="javascript:void(0);" >'+link.name+'</a></li>');
                if(link.icon){
                    $("a",item).append($("<span class='"+link.icon+"'></span>"))
                }
                item.appendTo(that);
                if(link.children){
                   $("a",item).addClass("dropdown-toggle").attr("data-toggle","dropdown").attr("role","button").attr("aria-expanded","false");
                   var ul=$( '<ul class="dropdown-menu" role="menu" style="background-color: #313131;min-width:100px">');
                   item.append(ul);
                    $.each(link.children,function(i,child){
                        var li=$('<li class="nav-level-2"><a class="nav-level-2-link" loc="'+child.href+'" href="javascript:void(0);">'+child.name+'</a></li>');
                        li.appendTo(ul);

                    });

                }

            });
          //  $(".nav-level-1-link",$(".nav-level-1-link")).remove();


        },
        handler:function(){
           // console.info(this.options.triggerEvent());
            var that=this;
            $(".nav-level-1",that).bind("mouseover",function(){
                $(".sign",that).remove();
                $(".nav-level-1",that).removeClass("active");
                $(".nav-level-1-link",that).css("padding-top","15px");
                var img=__PUBLIC__+"/image/search-icon/search-top.png";
                var sign=$("<div class='sign'  style=\"background: url('"+img+"');height: 3px;\"></div>");
                sign.insertBefore($(".nav-level-1-link",this));
                $(".nav-level-1-link",this).css("padding","12px 15px 15px");
                //$(this).addClass("active");
            });
            $(".nav-level-2-link,.nav-level-1-link",that).bind("click",function(){
                    var loc=$(this).attr("loc");
                    if(loc&&loc!=''){
                        that.options.itemClick&& that.options.itemClick.call(that,loc);
                    }
            });
        }
    };
})(jQuery);
