/**
 * Created by kerry on 15/5/20.
 */
(function($){
    var reflect={
        "上海":[],
        "云南":[{name:"云南",value:"未知"},"昆明","曲靖","玉溪","文山","西双版纳","丽江","楚雄","昭通","普洱","德宏","怒江傈","红河","临沧","保山","大理","迪庆"],
        "内蒙古":[{name:"内蒙古",value:"未知"},"呼和浩特","包头","巴彦淖尔","乌海","鄂尔多斯","呼伦贝尔","赤峰","通辽","兴安","锡林郭勒","乌兰察布","阿拉善"],
        "北京":[],
        "台湾":[],
        "吉林":[{name:"吉林",value:"未知"},"白山","长春","白城","延边","辽源市","四平","吉林","通化","松原"],
        "四川":[{name:"四川",value:"未知"},"绵阳","成都","乐山","南充","内江","眉山","宜宾","自贡","甘孜","巴中","达州","遂宁","广元","凉山","广安","雅安","德阳","攀枝花","泸州","资阳","阿坝"],
        "天津":[],
        "宁夏":[{name:"宁夏",value:"未知"},"银川","石嘴山","中卫","吴忠","固原"],
        "安徽":[{name:"安徽",value:"未知"},"芜湖","淮南","六安","合肥","淮北","巢湖","宣城","安庆","马鞍山","蚌埠","阜阳","黄山","亳州","宿州","滁州","铜陵","池州"],
        "山东":[{name:"山东",value:"未知"},"济南","潍坊","烟台","威海","青岛","泰安","东营","枣庄","菏泽","聊城","济宁","临沂","日照","淄博","德州","莱芜","滨州"],
        "山西":[{name:"山西",value:"未知"},"太原","临汾","朔州","忻州","吕梁","长治","大同","晋城","运城","晋中","阳泉"],
        "广东":[{name:"广东",value:"未知"},"广州","深圳","东莞","湛江","珠海","佛山","韶关","汕头","中山","茂名","江门","云浮","汕尾","肇庆","阳江","惠州","河源","梅州","潮州","清远","揭阳"],
        "广西":[{name:"广西",value:"未知"},"南宁","河池","桂林","北海","柳州","贵港","梧州","百色","崇左","玉林","来宾","贺州","防城港","钦州"],
        "新疆":[{name:"新疆",value:"未知"},"乌鲁木齐","和田","巴音郭楞","博尔塔拉","塔城","克拉玛依","阿克苏","喀什","昌吉","石河子","哈密","伊犁","吐鲁番","阿勒泰","克孜勒苏"],
        "江苏":[{name:"江苏",value:"未知"},"镇江","扬州","常州","苏州","无锡","泰州","南京","南通","盐城","宿迁","连云港","淮安","徐州"],
        "江西":[{name:"江西",value:"未知"},"九江","南昌","吉安","萍乡","景德镇","上饶","新余","赣州","鹰潭","宜春","抚州"],
        "河北":[{name:"河北",value:"未知"},"保定","石家庄","唐山","邯郸","廊坊","沧州","秦皇岛","衡水","邢台","承德","张家口"],
        "河南":[{name:"河南",value:"未知"},"南阳","郑州","驻马店","周口","洛阳","漯河","开封","安阳","三门峡","鹤壁","平顶山","焦作","新乡","济源","许昌","信阳","商丘","濮阳"],
        "海南":[{name:"海南",value:"未知"},"海口","儋州","三亚","琼海","东方","乐东","万宁","五指山"],
        "湖北":[{name:"湖北",value:"未知"},"荆州","黄石","宜昌","武汉","襄阳","荆门","咸宁","恩施","随州","仙桃","十堰","黄冈","鄂州","孝感","荆州","襄樊","潜江","天门","神农架"],
        "湖南":[{name:"湖南",value:"未知"},"长沙","郴州","常德","株洲","衡阳","怀化","湘潭","岳阳","娄底","邵阳","永州","张家界","湘西","益阳"],
        "甘肃":[{name:"甘肃",value:"未知"},"天水","兰州","庆阳","平凉","武威","张掖","嘉峪关","酒泉","白银","金昌","定西","陇南","临夏","甘南"],
        "福建":[{name:"福建",value:"未知"},"厦门","福州","莆田","泉州","漳州","三明","龙岩","南平","宁德"],
        "西藏":[{name:"西藏",value:"未知"},"拉萨","阿里","日喀则","昌都","山南","那曲","林芝"],
        "贵州":[{name:"贵州",value:"未知"},"贵阳","六盘水","铜仁","遵义","黔西南","黔东南","安顺","毕节","黔南"],
        "辽宁":[{name:"辽宁",value:"未知"},"锦州","沈阳","鞍山","葫芦岛","辽阳","丹东","大连","抚顺","盘锦","阜新","朝阳","营口","铁岭","本溪"],

        "浙江":[{name:"浙江",value:"未知"},"杭州","绍兴","宁波","舟山","金华","温州","湖州","衢州","嘉兴","台州","丽水"],

        "重庆":[],
        "陕西":[{name:"陕西",value:"未知"},"西安","咸阳","汉中","铜川","宝鸡","渭南","安康","延安","榆林","商洛"],
        "青海":[{name:"青海",value:"未知"},"西宁","海北","海西","黄南","果洛","玉树","海东"],
        "香港":[],
        "澳门":[],
        "黑龙江":[{name:"黑龙江",value:"未知"},"哈尔滨","大庆","齐齐哈尔","牡丹江","黑河","大兴安岭","佳木斯","七台河","绥化","伊春","鸡西","双鸭山","鹤岗"],
        "未知":[]
    };


    var opt={
        sortBy:"desc",
        limit:-1,
        //一些回调的定义
        selectItem:null,
        createItem:null,
        backBtn:null,
        moreBtn:null,
        setStyle:null,
        noSubItem:null

    };

    $.fn.mapcount = function(options){
        options= $.extend(opt,options);
        this.options=options;
        this.provinces=__functions__.getProvinces();
        this.load=__call__.load;
        this.reload=__call__.reload;
        this.clear=__call__.clear;
        this.sort=__call__.sort;
        return this;
    }

    var __call__={
        load:function(data){
            this.data=data;
            __functions__.list.call(this,"",0);
        },
        clear: function () {
            this.html("");
        },
        reload:function(){
            __call__.load.call(this,this.data);
            // __functions__.list(this,this.provinces,0);
        },
        sort:function(sortBy){
            this.sortBy=sortBy;
            __call__.reload.call(this);
        }
    };

    var __functions__={
        list:function(key,level){
            var that=this;
            var areas;
            if(level==0){
                areas=that.provinces;
            }else{
                areas=reflect[key];
            }
            if(!areas||areas.length==0){
                that.options.noSubItem&&that.options.noSubItem.call(that,key);
                return;
            }

            var currents=[];
            //对有值的省份/城市取出来放入数组
            var maxValue=0;

            if(level == 0){
                $.each(reflect, function(a_p, a_v){
                    var size = 0;
                    $.each(a_v, function(sub_p, sub_v){
                        if(that.data[sub_v]){
                            size += that.data[sub_v];
                        }
                    });
                    if(that.data[a_p]){
                        size += that.data[a_p];
                    }
                    if(size > 0){
                        if(size > maxValue){
                            maxValue = size;
                        }
                        currents.push({key:a_p,value:size});
                    }
                });
            }else{
                $.each(areas,function(index,area){
                    var _key=area;
                    var  _show;
                    if(typeof  area=== "object"){
                        _key=area['name'];
                        _show=area['value'];
                       // console.info(_show);
                    }
                    //console.info(_key);

                    if(that.data[_key]){
                        if(that.data[_key]>maxValue){
                            maxValue=that.data[_key];
                        }
                        currents.push({key:_show||_key,value:that.data[_key]});
                    }

                });
            }
            if(currents.length==0){
                that.options.noSubItem&&that.options.noSubItem.call(that,key);
                return;
            }
            //对数据进行倒序排列
            if(that.options.sortBy){
                currents.sort(function(a,b){
                    if(that.options.sortBy=='desc'){
                        return b.value-a.value;
                    }else{
                        return a.value-b.value;
                    }

                });
            }

            that.html("");
            var ul=$("<ul></ul>");
            if(level!=0&&that.options.backBtn){
                var  back;
                if(!that.options.backBtn){
                    back=$("<a href='javascript:void(0)'>返回</a>");
                }else{
                    back=that.options.backBtn.call(that);
                }
                that.append(back);
                back.bind("click",function(){
                    __functions__.list.call(that,"",0);
                    that.options.selectItem&&that.options.selectItem.call(that,"","全国");
                });

            }
            ul.appendTo(that);

            //更多按钮
            if(that.options.limit!=-1){//有最大值限制
                var more;
                if(!that.options.moreBtn){
                    more=$("<a href='javascript:void(0)'></a>");
                }else{
                    more=that.options.moreBtn.call(that);
                }
                more.text("更多");

                more.appendTo(that);
                more.bind("click",function(){
                    if(more.text()=='更多'){
                        $("li",ul).slideDown();
                        more.text('收起');
                    }else{
                        $("li:gt("+(that.options.limit-1)+")",ul).slideUp();
                        more.text('更多');
                    }

                });
            }

            $.each(currents,function(i,obj){
                var curWidth=parseInt(obj.value*100/maxValue);
                if(curWidth==0){
                    curWidth=1;
                }
                var li=$("<li style='width: 100%;'></li>");
                if(that.options.limit!=-1&&i>=that.options.limit){
                    li.hide();
                }
                that.options.createItem&&that.options.createItem.call(that,obj.key,obj.value,curWidth,li);

                li.appendTo(ul)
                li.bind("click",function(){
                    __functions__.list.call(that,obj.key,1);
                    that.options.selectItem&&that.options.selectItem.call(that,key,obj.key);
                });
            });
            that.options.setStyle&&that.options.setStyle.call(that,ul);
        },
        // 获取省份
        getProvinces:function(){
            var provinces=[];
            $.each(reflect,function(k,v){
                provinces.push(k);
            });
            return provinces;
        }
    };





})(jQuery);
