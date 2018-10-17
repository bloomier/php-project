var App = {
    init: function(){
        this.listScroll = new ScrollBar(".list-scroll", {
            scrollElement: "#list"
        }),
            this.sideBar = SideBar.init({
                ontoggle: $.proxy(this, "setMapOffset")
            }),
            this.searchBox = new SearchBox(".search-container", {
                onsearch: $.proxy(this, "onsearch"),
                oncancel: $.proxy(this, "cancelSearch"),
                onclick: $.proxy(this, "clickSearch"),
                onprev: $.proxy(this, "scrollSearch"),
                onnext: $.proxy(this, "scrollSearch")
            }),
            this.scenicList = ScenicList.init({
                onclick: $.proxy(this, "changeScenic")
            }),
            this.setMapSize(),
            $(window).on("resize", $.proxy(this, "setMapSize"))
    },
    setMapSize: function() {
        var t = $(window).height();
        $("#map-container, #side").height(t - 60),
            this.onresizeMap(t)
    },
    onresizeMap: function(t) {
        this.scenicList.setHeight(t - 190),
            this.listScroll.refresh()
    },
    scrollList: function() {
        var t = this.scenicList.getHighLight();
        if (t && t.length) {
            var e = this.listScroll.visible(t);
            e > 0 ? this.listScroll.scrollTo(t.position().top - this.listScroll.scrollHeight() + t.outerHeight(!0)) : 0 > e && this.listScroll.scrollTo(t.position().top)
        }
    },
    highlightScenic: function(t) {
        this.scenicList.highlightScenic(t),
            this.scrollList()
    },
    setMapOffset: function(t) {
        this.travelMap.setLegendOffset(mapOptions.legendPosition.x - (t ? 320 : 0)),
            this.travelMap.setCenterOffset(t),
            $(".back-to").toggleClass("back-to-slide", t)
    },
};

App.init();