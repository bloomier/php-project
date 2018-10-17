/**
 *@name
 *@author Sean.xiang
 *@date 2016/6/15
 *@version
 *@example
 */

var i =1;
var Index = {
    init: function(){
        var w = this;

        w.initHtml();
        w.initEvent();
        w.search();

    },
    initHtml: function(){
        var w = this;
        $('.list').html('');
        //初始显示第一页
        w.getData(i);

    },
    initEvent: function(){
        var w = this;

        //定义鼠标滚动事件
        w.scrollHandle();
    },
    getData: function(page){
        var w = this;
        NProgress.start();
        $.get(__ROOT__ +'/Mobile/Site/pageSite?curPage='+page).success(function(json){
            w.data = json;
            w.infoHtml(json);
            NProgress.done();
        });
        i++;

    },
    infoHtml: function(json){
        var w  =this;
        $.each(json, function(k,v){
            var status = v.siteVail=='访问正常'?'正常':'异常';
            var el =' <a class="item" href="'+__ROOT__+"/Mobile/Site/detail/domain/"+v.domain+'">' +
                '<span class="item-info">' +
                '<span class="title">'+ v.site+'</span>' +
                '<span class="domain">'+ v.domain+'</span> ' +
                '</span>'+
                '<span class="item-service"><i class="fa fa-flag"></i><i class="status">'+ status+'</i></span> ' +
                '<span class="item-detail"><i class="c-red">'+ v.attackCount+'</i>/<i class="c-green">'+ v.visitCount+'</i></span> ' +
                '</a>';
            $('.list').append(el);
        });
        $('.status').each(function(){
            var status = $(this).text();
            if(status=='异常'){
                $(this).prev().addClass('s-error');
                $(this).parents('.item').addClass('item-error')
            }
        })

    },
    scrollHandle: function(){
        var w = this;
        NProgress.start();
        $(window).scroll(function(){
            var winH = $(window).height();
            var scrollTop =$(window).scrollTop();
            var scrollHeight = $(document.body).height();
            if( scrollTop + winH >= scrollHeight-20){
                if(w.data.length>0){
                    w.getData(i);
                    $('.loading').show();
                    NProgress.done();
                }else{
                    $('.loading').html('没有更多数据').show();
                }
            }

        });




    },
    search: function(){
        var w =this;
        $('.search-box').bind('focusin', function(){
            $(this).parent('.search').addClass('focus');
        })
        $('.search-box').bind('focusout', function(){
            $(this).parent('.search').removeClass('focus');
        })
        $('.search-box').bind('change', function(){
            var param = $(this).val();
            $.ajax({
                type: 'get',
                dataType: 'json',
                url: __ROOT__ +'/Mobile/Site/pageSite',
                data: 'param='+param,
                success: function(d){
                    $('.list').html('');
                    if(d.length>0){
                        w.infoHtml(d);
                    }else{
                        $('.content').html('暂无搜索结果').css('text-align','center');
                    }
                }

            })
        })

    }

};

$(function(){
    Index.init();
});