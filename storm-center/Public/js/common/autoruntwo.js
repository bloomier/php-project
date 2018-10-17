/**
 * Created with JetBrains PhpStorm.
 * User: jianchang.song
 * editer:sakoo.jiang
 * Date: 15-6-4
 * Time: 19:12
 * To change this template use File | Settings | File Templates.
 */
(function() {

    var flag = false;
    $(document).ready(function () {

        // 判断scoller
        var scoller = $("#scoller").val();

        o.scoller(scoller);

        // 判断autorun
        var autorun =  $("#autorun").val();
        o.autorun(autorun);

        //自动切换
        setInterval(function(){
            if(flag){
                o.pageScrollers();
            }
        },45000);


        o.pageTurn();
        o.autoPlay();


    });

    document.onreadystatechange = function () {
        if(document.readyState=="complete") {
            // 显示鼠标
            var mousehidden = $("#mousehidden").val();
            o.mousehidden(mousehidden);

        }
    };

    var o = {
        allInfoPages:  ["world-network","world-zjrm",'world-zjga','world-txzf','world-jxzf'],
        scoller : function(value){
            if(value == "true"){
                $("body").css("overflow", "hidden");
            }
        },
        autorun : function(value){
            if(value == "true"){
                flag = true;
            }
        },
        mousehidden : function(value){
            if(value == "true"){
                $("canvas").css("cursor", "none");
                $("body").css("cursor", "none");
            }
        },
        pageScrollers: function(){
            //下页
            var href = window.location.href;
            var cur_href=href.split("/key/")[1];
            cur_href=cur_href.split("?")[0];
            cur_href=cur_href.split("/")[0];
            var pageIndex= $.inArray(cur_href, o.allInfoPages);
            var nextPageIndex=(pageIndex+1==o.allInfoPages.length)?0:pageIndex+1;

            var nextPage= o.allInfoPages[nextPageIndex];
            var nextHref=href.replace(cur_href,nextPage);
            window.location.href=nextHref;

        },
        pageScrollersUp: function(){
            //上页

            var href = window.location.href;

            var cur_href=href.split("/key/")[1];
            cur_href=cur_href.split("?")[0];
            cur_href=cur_href.split("/")[0];

            var pageIndex= $.inArray(cur_href, o.allInfoPages);
            var nextPageIndex=(pageIndex==0)? o.allInfoPages.length-1:pageIndex-1;

            var nextPage= o.allInfoPages[nextPageIndex];

            var nextHref=href.replace(cur_href,nextPage);
            window.location.href=nextHref;


        },
        pageTurn: function(){
            var href = window.location.href;
            var mouse = href.indexOf('mousepen');
            var params = href.split("?");
            var autorun =  $("#autorun").val();
            $(window).keydown(function(e){
                if(e.keyCode ==34 || e.keyCode==40){ //pageDown
                    if(mouse == -1){
                        return false;
                    }
                    else{
                        window.location.href = params[0]+'?'+params[1];
                        o.pageScrollers();
                    }
                }
                if(e.keyCode ==33 || e.keyCode==38){ //pageUp
                    if(mouse == -1){
                        return false;
                    }
                    else{
                        window.location.href = params[0]+'?'+params[1];
                        o.pageScrollersUp();
                    }
                }
            });

        },
        autoPlay : function(){
            var href = window.location.href;
            var params = href.split("?");

            $('.autoPlay').click(function(e){
                var href = window.location.href;
                var params = href.split("?");

                if($("#autorun").val()=='true'){
                    $("i",$(".autoPlay")).removeClass("fa-play").addClass("fa-pause");

                    window.location.href = params[0]+'?autorun=false&scoller=true';

                }else{
                    $("i",$(".autoPlay")).addClass("fa-play").removeClass("fa-pause");

                    window.location.href = params[0]+'?autorun=true&scoller=true';
                }
                e.stopPropagation();
            });
        }
    };




})();


