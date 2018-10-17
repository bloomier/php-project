$(function(){
   app.init();

});

var app = {
    init : function(){


        app.handleSidebarMenu();
        app.handleSidebarToggler();
        app.handleFixedSidebarHoverable();
        app.initUniform();

    },
    //initializes uniform elements
    initUniform: function (els) {


        $("input[type=checkbox]:not(input[class='bigdataLogCheck']), input[type=radio]:not(input[name='time'])").uniform();
        //$("input:not(input[name='basketball'])")

        $('select:not(.prov, .city,.dist, .avail-nav-site-select, .fault-nav-node-select, .province-choose, #domainSelector)').select2();
        //$(' select:not(.city)').select2();

    },
    handleSidebarMenu : function(){
        $('.page-sidebar li a').click(function(e){
            if ($(this).next().hasClass('sub-menu') == false) {
                if ($('.btn-navbar').hasClass('collapsed') == false) {
                    $('.btn-navbar').click();
                }
                return;
            }

            var parent = $(this).parent().parent();

            parent.children('li.open').children('a').children('.arrow').removeClass('open');
            parent.children('li.open').children('.sub-menu').slideUp(200);
            parent.children('li.open').removeClass('open');

            var sub = $(this).next();
            if (sub.is(":visible")) {
                $('.arrow', $(this)).removeClass("open");
                $(this).parent().removeClass("open");
                sub.slideUp(200);
            } else {
                $('.arrow', $(this)).addClass("open");
                $(this).parent().addClass("open");
                sub.slideDown(200);
            }

            e.preventDefault();
        })
    },
    handleSidebarToggler : function () {
        // handle sidebar show/hide

        $('.page-sidebar .sidebar-toggler').click(function (e) {
            var body = $('body');
            var sidebar = $('.page-sidebar');
            if ((body.hasClass("page-sidebar-hover-on") && body.hasClass('page-sidebar-fixed')) || sidebar.hasClass('page-sidebar-hovering')) {
                body.removeClass('page-sidebar-hover-on');
                sidebar.css('width', '').hide().show();
                e.stopPropagation();
                return;
            }

            $(".sidebar-search", sidebar).removeClass("open");

            if (body.hasClass("page-sidebar-closed")) {
                body.removeClass("page-sidebar-closed");
                if (body.hasClass('page-sidebar-fixed')) {
                    sidebar.css('width', '');
                }
            } else {
                body.addClass("page-sidebar-closed");
            }

        });


    },
    handleFixedSidebarHoverable : function () {
        var sidebarWidth = 225;
        var sidebarCollapsedWidth = 35;
        if ($('body').hasClass('page-sidebar-fixed') === false) {
            return;
        }
        $('.page-sidebar').off('mouseenter').on('mouseenter', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-closed') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            body.removeClass('page-sidebar-closed').addClass('page-sidebar-hover-on');
            $(this).addClass('page-sidebar-hovering');
            $(this).animate({
                width: sidebarWidth,
                height: $(this).parent().height()
            }, 400, '', function () {
                $(this).removeClass('page-sidebar-hovering');
            });
        });

        $('.page-sidebar').off('mouseleave').on('mouseleave', function () {
            var body = $('body');

            if ((body.hasClass('page-sidebar-hover-on') === false || body.hasClass('page-sidebar-fixed') === false) || $(this).hasClass('page-sidebar-hovering')) {
                return;
            }

            $(this).addClass('page-sidebar-hovering');
            $(this).animate({
                width: sidebarCollapsedWidth
            }, 400, '', function () {
                $('body').addClass('page-sidebar-closed').removeClass('page-sidebar-hover-on');
                $(this).removeClass('page-sidebar-hovering');
            });
        });

    }


};