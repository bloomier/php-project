
var _hmt = _hmt || [],
    T = T || {};
var ScenicList = {
    init: function(i) {
        var t = {
            emptyTip: "抱歉，暂未获得#{0}数据。",
            onclick: null,
            ongetData: null
        };
        return this.options = $.extend(!0, {},
            t, i),
            $("#list").on("click", "li", $.proxy(this, "_onclick")),
            this
    },
    onkeydown: function(i) {
        var t = $("#list").find("li.selected");
        if (t && t.length) {
            var e = null;
            switch (i.which) {
                case 38:
                    var e = t.prev("li");
                    break;
                case 40:
                    var e = t.next("li");
                    break;
                default:
                    return
            }
            if (e && e.length) {
                var n = this.data[e.data("index")];
                this.options.onclick && this.options.onclick(n)
            }
        }
    },
    _onclick: function(i) {
        var t = $(i.currentTarget).data("index"),
            e = this.data[t];
        this.options.onclick && this.options.onclick(e)
    },
    render: function(i, t, e) {
        var n = e.split(",")[0];
        if (this.data = i, i.length) {
            for (var l = "",
                     s = 0; s < i.length; s++) {
                var a = i[s];
                "heat" == n ? l += T.Util.format('<li data-index="#{0}" id="scenic-#{3}"><a href="javascript: void(0);"><span class="scenic" title="#{1}">#{1}</span><span class="scenic-heat heat-#{2}"></span></a></li>', s, a.label, a.heat, a.id) : "uv" == n && (l += T.Util.format('<li data-index="#{0}" id="scenic-#{3}"><a href="javascript: void(0);"><span class="scenic scenic-name-uv" title="#{1}">#{1}</span><span class="scenic-uv">#{2}人</span></a></li>', s, a.label, T.Util.formatNumber(a.uv), a.id))
            }
            $("#list").html(l)
        } else $("#list").html(T.Util.format('<li class="empty-list">#{0}</li>', T.Util.format(this.options.emptyTip, t.label)))
    },
    setHeight: function(i) {
        $(".list-scroll").height(i)
    },
    highlightScenic: function(i) {
        $("#list").find("li.selected").removeClass("selected"),
            $("#list").find("#scenic-" + i.id).addClass("selected")
    },
    getHighLight: function() {
        return $("#list").find("li.selected")
    }
};
var SideBar = {
    init: function(s) {
        return this.options = s || {},
            this._side = $("#side"),
            this._side.find(".side-toggle").on("click", $.proxy(this, "toggle")),
            this
    },
    toggle: function() {
        this._side.toggleClass("close"),
            $(".side-container").toggle()
        this.options.ontoggle && this.options.ontoggle(this.isClosed())
    },
    isClosed: function() {
        return this._side.hasClass("close")
    }
};
function SearchBox(t, e) {
    this._element = $(t);
    var i = {
        searchDelay: 700,
        keydownKeyCode: [8, 46, 32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
        loadingHtml: '<div class="search-loading">搜索中……</div>',
        tipTpl: '<div class="search-tip">#{0}</div>',
        emptyTip: "啊哦，没找到你要的景点或省份。目前我们只提供全国5A景点拥挤预测服务。",
        listTpl: '<ul class="search-list">#{0}</ul>',
        itemTpl: '<li class="search-item #{className}" data-index="#{index}">#{label}</li>',
        wordTpl: '<span class="search-word">#{0}</span>',
        scenicTpl: '<span class="search-scenic">#{scenic}</span>&emsp;-&emsp;#{province}',
        provinceTpl: '<span class="search-province">#{0}</span>',
        onsearch: null,
        oncancel: null,
        onclick: null,
        onnext: null,
        onprev: null
    };
    return this.options = $.extend(!0, {},
        i, e),
        this.init(),
        this
}
SearchBox.prototype.init = function() {
    this._input = this._element.find(".search-input"),
        this._close = this._element.find(".search-close"),
        this._button = this._element.find(".search-button"),
        this._result = this._element.find(".search-result"),
        this._needPlaceholder = !("placeholder" in document.createElement("input")),
        this._hasInputEvent = "oninput" in document.createElement("input"),
        this._debounce = 0,
        this._timeout = null,
        this._ready = !1,
        this._value = "",
        this._data = [],
        this._input.toggleClass("with-placeholder", this._needPlaceholder),
        this._bindEvents()
},
    SearchBox.prototype._bindEvents = function() {
        this._close.on("click", $.proxy(this, "reset")),
            this._button.on("click", $.proxy(this, "_onbutton")),
            this._input.on("focus", $.proxy(this, "_onfocus")).on("blur", $.proxy(this, "_onblur")).on("input", $.proxy(this, "_oninput")).on("keydown", $.proxy(this, "_onkeydown")).on("keyup", $.proxy(this, "_onkeyup")),
            this._result.on("mouseenter", ".search-item", $.proxy(this, "_onhover")).on("click", ".search-item", $.proxy(this, "_onclick")),
            $(document).on("click", $.proxy(this, "close"))
    },
    SearchBox.prototype.close = function(t) {
        T.Util.clickInContainer(t.target, $(".search-container").get(0)) || (this.reset(), this._input.blur())
    },
    SearchBox.prototype._checkPlaceholder = function(t) {
        this._input.toggleClass("with-placeholder", this._needPlaceholder && !t)
    },
    SearchBox.prototype.reset = function() {
        this._ready = !1,
        this._timeout && clearTimeout(this._timeout),
            this._result.empty().parent().hide(),
            this._element.removeClass("active"),
            this._close.removeClass("search-close-active"),
            this._needPlaceholder ? this._input.val(this._input.attr("value")) : this._input.val(""),
            this._value = "",
            this._checkPlaceholder(),
        $.isFunction(this.options.oncancel) && this.options.oncancel()
    },
    SearchBox.prototype.focus = function() {
        this._input.focus()
    },
    SearchBox.prototype._onfocus = function() {
        this._input.addClass("focus-search-input"),
            this._input.val("")
    },
    SearchBox.prototype._onblur = function() {
        this._input.removeClass("focus-search-input"),
            this._input.val(this._input.attr("value"))
    },
    SearchBox.prototype._onbutton = function() {
        var t = this._input.val(),
            e = (new Date).getTime();
        this._timeout && clearTimeout(this._timeout),
            this._debounce = e,
            this._onsearch({
                value: t
            })
    },
    SearchBox.prototype._oninput = function(t) {
        var e = $(t.target).val();
        this._checkPlaceholder(e);
        var i = "" !== $.trim(e);
        this._element.toggleClass("active", i),
            this._close.toggleClass("search-close-active", i);
        var o = (new Date).getTime();
        o - this._debounce < this.options.searchDelay && this._timeout && clearTimeout(this._timeout),
            this._timeout = setTimeout($.proxy(this, "_onsearch", {
                value: e
            }), this.options.searchDelay),
            this._debounce = o
    },
    SearchBox.prototype._onsearch = function(t) {
        var e = $.trim(t.value);
        this._value = e,
            e ? (this._ready = !0, $.isFunction(this.options.onsearch) && this.options.onsearch(e)) : this.reset()
    },
    SearchBox.prototype._onkeydown = function(t) {
        switch (t.which) {
            case 13:
                t.preventDefault(),
                    t.stopPropagation();
                var e = this._result.find(".search-item.focus");
                e.length ? this._onclick(t, e) : this._onbutton();
                break;
            case 38:
                this._prev(),
                    t.preventDefault(),
                    t.stopPropagation();
                break;
            case 40:
                this._next(),
                    t.preventDefault(),
                    t.stopPropagation();
                break;
            case 27:
                this._value.length && (this.reset(), t.preventDefault(), t.stopPropagation())
        }
    },
    SearchBox.prototype._onkeyup = function(t) {
        return T.Util.contains(this.options.keydownKeyCode, t.which) ? ((!this._hasInputEvent || this._needPlaceholder && this._hasInputEvent && T.Util.contains([8, 46], t.which)) && this._oninput(t), void 0) : (t.preventDefault(), t.stopPropagation(), void 0)
    },
    SearchBox.prototype.loading = function() {
        this._result.html(this.options.loadingHtml).parent().show()
    },
    SearchBox.prototype.tip = function(t) {
        this._ready && this._result.html(T.Util.format(this.options.tipTpl, t)).parent().show()
    },
    SearchBox.prototype._renderWord = function(t, e) {
        var i = new RegExp(t.replace(/([\\\/\?\(\)\[\]\^\$\-\*\+\.])/g, "\\$1"), "gi");
        return e.replace(i, T.Util.format(this.options.wordTpl, t))
    },
    SearchBox.prototype.render = function(t) {
        if (this._ready) {
            var e = [],
                i = [],
                o = this;
            if ($.each(t,
                    function(s, n) {
                        var r = {};
                        if ("undefined" == typeof n.id) {
                            var a = T.Util.format(o.options.provinceTpl, o._renderWord(o._value, n.province));
                            r.isProvince = !0,
                                r.zoom = n.zoom
                        } else {
                            var a = T.Util.format(o.options.scenicTpl, {
                                province: n.province,
                                scenic: o._renderWord(o._value, n.label)
                            });
                            r.id = n.id,
                                r.label = n.label
                        }
                        r.province = n.province,
                            r.provinceId = n.provinceId,
                            r.x = n.x,
                            r.y = n.y,
                            e.push(r),
                            i.push(T.Util.format(o.options.itemTpl, {
                                index: s,
                                label: a,
                                className: 0 === s ? "first": s === t.length - 1 ? "last": ""
                            }))
                    }), this._data = e, !t.length) return this.tip(this.options.emptyTip),
                void 0;
            var s = T.Util.format(this.options.listTpl, i.join(""));
            this._result.html(s).parent().show()
        }
    },
    SearchBox.prototype._focus = function(t) {
        this._result.find(".search-item").removeClass("focus").eq(t).addClass("focus")
    },
    SearchBox.prototype._prev = function() {
        var t = this._result.find(".search-item"),
            e = t.filter(".focus"),
            i = t.index(e) - 1;
        if (i >= 0) {
            e.removeClass("focus");
            var o = t.eq(i);
            o.addClass("focus"),
            $.isFunction(this.options.onprev) && this.options.onprev({
                index: i,
                length: this._data.length,
                dom: o
            })
        }
    },
    SearchBox.prototype._next = function() {
        var t = this._result.find(".search-item"),
            e = t.filter(".focus"),
            i = t.index(e) + 1;
        if (i < t.length) {
            e.removeClass("focus");
            var o = t.eq(i);
            o.addClass("focus"),
            $.isFunction(this.options.onnext) && this.options.onnext({
                index: i,
                length: this._data.length,
                dom: o
            })
        }
    },
    SearchBox.prototype._onhover = function(t) {
        var e = $(t.currentTarget),
            i = e.attr("data-index");
        this._focus(i)
    },
    SearchBox.prototype._onclick = function(t, e) {
        var e = e || $(t.currentTarget),
            i = e.attr("data-index");
        $.isFunction(this.options.onclick) && this.options.onclick(this._data[i]),
            this.reset(),
            this._input.blur()
    };;
function ScrollBar(t, i) {
    var o = {
        wheelSpeed: 20,
        minScrollbarLength: 20,
        scrollBarGrabTpl: '<div class="scroll-bar-grab"></div>',
        scrollBarRailTpl: '<div class="scroll-bar-rail"></div>',
        scrollBarLineTpl: '<div class="scroll-bar-line"></div>',
        className: "scroll-bar",
        scrollElement: ""
    };
    return this.options = $.extend(!0, {},
        o, i),
        this._element = $(t),
        this.init(),
        this
}
ScrollBar.prototype.init = function() {
    this._render(),
        this._grab = this._element.find(".scroll-bar-grab"),
        this._rail = this._element.find(".scroll-bar-rail"),
        this._line = this._element.find(".scroll-bar-line"),
        this._scroll = this._element.find(this.options.scrollElement).addClass("scroll-bar-item"),
        this._inHeight = this._scroll.outerHeight(!0),
        this._outHeight = this._element.height(),
        this._top = 0,
        this._scrollTop = 0,
        this._barHeight = this._rail.height() - this._grab.height(),
        this._scrollHeight = Math.max(this._inHeight - this._outHeight, 0),
       /* this._grab.draggable({
            addClasses: !1,
            appendTo: this._rail,
            axis: "y",
            containment: "parent"
        }),*/
        this._bindEvents(),
        this.refresh()
},
    ScrollBar.prototype._render = function() {
        if (!this._element.hasClass(this.options.className)) {
            var t = $(this.options.scrollBarRailTpl).append(this.options.scrollBarLineTpl).append(this.options.scrollBarGrabTpl);
            this._element.addClass(this.options.className).append(t)
        }
    },
    ScrollBar.prototype._bindEvents = function() {
        this._element.on("mousewheel", $.proxy(this, "_onmousewheel")),
            this._grab.on("drag", $.proxy(this, "_ondrag")).on("click", $.proxy(this, "_onclickGrab")),
            this._rail.on("click", $.proxy(this, "_onclick"))
    },
    ScrollBar.prototype._onclickGrab = function(t) {
        t.preventDefault(),
            t.stopPropagation()
    },
    ScrollBar.prototype._ondrag = function(t) {
        this.scrollBarTo(this._grab.position().top),
            t.stopPropagation()
    },
    ScrollBar.prototype._onclick = function(t) {
        this.scrollBarTo(Math.floor(t.offsetY - this._grab.height() / 2)),
            t.preventDefault(),
            t.stopPropagation()
    },
    ScrollBar.prototype._onmousewheel = function(t) {
        this.scrollTo(this._scrollTop - this.options.wheelSpeed * t.deltaY),
            t.preventDefault(),
            t.stopPropagation()
    },
    ScrollBar.prototype.refresh = function() {
        this._inHeight = this._scroll.outerHeight(!0),
            this._outHeight = this._element.height();
        var t = this._inHeight,
            i = this._outHeight;
        i >= t ? this._hide() : (this._show(), this._calcRailHeight(), this._calcGrabHeight(), this._barHeight = this._rail.height() - this._grab.height(), this._scrollHeight = this._inHeight - this._outHeight, this.scrollTo(0))
    },
    ScrollBar.prototype._calcGrabHeight = function() {
        this._grab.height(this._inHeight <= this._outHeight ? 0 : Math.max(this._outHeight / this._inHeight * this._rail.height(), this.options.minScrollbarLength))
    },
    ScrollBar.prototype._calcRailHeight = function() {
        this._rail.add(this._line).height(this._element.height())
    },
    ScrollBar.prototype._show = function() {
        this._rail.show()
    },
    ScrollBar.prototype._hide = function() {
        this._rail.hide()
    },
    ScrollBar.prototype._setTop = function(t, i) {
        var i = parseInt(i);
        return i !== i && (i = 0),
            t.css("top", [i, "px"].join(""))
    },
    ScrollBar.prototype.scrollBarTo = function(t) {
        this.scrollTo(t / this._barHeight * this._scrollHeight)
    },
    ScrollBar.prototype.scrollTo = function(t) {
        var t = parseInt(t);
        t === t && (0 > t && (t = 0), t > this._scrollHeight && (t = this._scrollHeight), this._scrollTop = t, this._setTop(this._scroll, -this._scrollTop), this._top = this._scrollTop / this._scrollHeight * this._barHeight, this._setTop(this._grab, this._top))
    },
    ScrollBar.prototype.scrollTop = function() {
        return this._scrollTop
    },
    ScrollBar.prototype.height = function() {
        return this._element.height()
    },
    ScrollBar.prototype.visible = function(t) {
        return t.position().top - this._scrollTop < 0 ? -1 : this._outHeight + this._scrollTop - t.position().top - t.outerHeight() < 0 ? 1 : 0
    },
    ScrollBar.prototype.scrollHeight = function() {
        return this._outHeight
    };

var Map = {
    setLegendOffset: function(t, i) {
        var t = "number" == typeof t ? t: this.legend.getOffset().width,
            i = "number" == typeof i ? i: this.legend.getOffset().height;
        this.legend.setOffset(new BMap.Size(t, i))
    },
};

$.extend(T, {
    Util: {
        format: function(r) {
            return params = [].slice.call(arguments, 1),
            1 == params.length && "[object Object]" == String(params[0]) && (params = params[0]),
                r.replace(/(#|\=)\{(\w+)\}/g,
                    function(r, e, n) {
                        var t = params[n];
                        return void 0 === t ? "": "=" === e ? t: "#" === e ? t: void 0
                    })
        },
        encodeHTML: function(r) {
            return String(r).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;")
        },
        formatNumber: function(r) {
            r = String(r);
            for (var e = /(-?\d+)(\d{3})/; e.test(r);) r = r.replace(e, "$1,$2");
            return r
        },
        indexOf: function(r, e) {
            if (null == r) return - 1;
            var n = Array.prototype.indexOf;
            if (n && r.indexOf === n) return r.indexOf(e);
            for (var t = 0,
                     a = r.length; a > t; t++) if (r[t] === e) return t;
            return - 1
        },
        contains: function(r, e) {
            return - 1 != this.indexOf(r, e)
        },
        clickInContainer: function(r, e) {
            for (;;) {
                if (r === e) return ! 0;
                if (r = r.parentNode, null === r) return ! 1
            }
        }
    }
});