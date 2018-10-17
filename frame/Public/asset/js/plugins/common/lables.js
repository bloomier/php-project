/**
 * Created by kerry on 15/5/20.
 */
(function($){

    $.fn.labels = function(options){
        var w=this;
        w.setting= $.extend({},options);
        w.wraper=$('<div class="chosen-container chosen-container-multi chosen-with-drop chosen-container-active" style="width: 100%;" title=""><ul class="chosen-choices"></ul></div>');
        w.html(w.wraper);
        w.ul=$("ul", w.wraper);

        __call__.init.call(w);
        __call__.handler.call(w);
        w.getData=__call__.getData;
        w.loadData=__call__.loadData;
        return w;

    }
    var __call__={

        init:function(){
            var w=this;
            var data= w.setting.data;
            if(w.setting.simpleData){//简单数据 数组形式
                if(data){
                    data=__function__.convert2SimpleData(data);
                }


            }

            data&&__call__.loadData.call(w,data);
            w.ul.append('<a class="fa fa-plus-circle btn-add"></a>');
            if(!w.setting.simpleData){

                w.selector=$("<select class='lables-selector'><option value=''>=="+ w.setting.title+"==</option></select>");
                var nameMaper= w.setting.nameMapper;

                $.each(nameMaper,function(k,v){
                    w.selector.append("<option value='"+k+"'>"+v+"</option>");
                });
            }
            w.warningDiv=$('   <div class="alert alert-warning ">'+ (w.setting.warning||"")+'</div>');
            w.inputText= $(' <input  class="lables-input" placeholder="请输入'+ w.setting.title+'" style="display:inline;width: auto;height: 30px; " value="" >');


        },
        getData:function(){
            var w=this;
            var data=__function__.getCurrentData.call(w);
            if(w.setting.simpleData){
                var arr=[];
                $.each(data,function(k,v){
                    arr.push(k);
                });
                return arr;
            }else{
               return data;
            }
        },
        loadData:function(data){
            var w=this;
            if(w.setting.simpleData){
                data=__function__.convert2SimpleData(data);
            }
            $.each(data,function(k,v){

                if($.trim(v)!=''){
                    __function__.addItem.call(w,k,v);

                }

            });

        },
        handler:function(){
            var w=this;
            w.ul.on("click",".search-choice-close",function(){
                $(this).closest("li").remove();
            });
            w.ul.on("click",".btn-add",function(){
                var html='';
                if(w.setting.warning){
                    html+= w.warningDiv.prop("outerHTML");
                }
                if(w.setting.simpleData){
                    html+=  w.inputText.prop("outerHTML");
                }else{
                    html+= w.selector.prop("outerHTML")+ w.inputText.prop("outerHTML");

                }
                swal({
                    title: "<small>添加"+w.setting.title+"</small>",
                    text: html,
                    html:true,
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: "确定",   cancelButtonText: "取消",
                },function(){
                    var type,value='';
                    if(w.setting.simpleData){
                        type=$(".lables-input").val();
                        if(type==''){
                            swal({   title: "请填写"+w.setting.title, type: "error",   confirmButtonText: "确定" });
                            return;
                        }
                    }else{
                        type=$(".lables-selector").val();
                        if(type==''){
                            swal({   title: "请选择"+w.setting.title, type: "error",   confirmButtonText: "确定" });
                            return;
                        }

                        value=$(".lables-input").val();
                        if(value==''){
                            swal({   title: "请填写"+w.setting.title, type: "error",   confirmButtonText: "确定" });
                            return;
                        }
                    }

                    var currentData=__function__.getCurrentData.call(w);
                    if(currentData[type]){
                        swal({   title: "已经存在的"+w.setting.title+",请先删除对应"+w.setting.title+"再进行添加", type: "error",   confirmButtonText: "确定" });
                        return;
                    }
                    swal({   title: "添加成功", type: "success",   confirmButtonText: "确定" ,timer:0});

                    __function__.addItem.call(w,type,value);
                    //console.info(__function__.getCurrentData.call(w));

                });
            });

        }
    }

    var __function__={
        convert2SimpleData:function(data){
            var json={};
            data.forEach(function(d){
                json[d]=1;
            });

            return json;
        },
        getCurrentData:function(){
            var w=this;
            var lis=$("li", w.ul);
            var json={};
            $.each(lis,function(i,li){
                var key=$(li).attr("lable_key");
                if(w.setting.simpleData){
                    json[key]=1;
                }else{
                    var value=$(".value",$(li)).text();
                    json[key]=value;
                }


            });
            if(!w.setting.simpleData){
                var nameMaper= w.setting.nameMapper;
                $.each(nameMaper,function(k,v){
                    if(!json[k]){
                        json[k]='';
                    }
                });
             }


            return json;
        },
        addItem:function(k,v){
            var w=this;
            var isSimple= w.setting.simpleData;
            var nameMaper= w.setting.nameMapper;
            k=k.replaceAll("<","&lt;").replaceAll(">","&gt;");
            //console.info(typeof v);
            if(v&&(typeof v==='string')){
                v=v.replaceAll("<","&lt;").replaceAll(">","&gt;");

            }
            if(isSimple){
                w.ul.append("<li class='search-choice' lable_key='"+k+"'>"+k+"<a class='search-choice-close' data-option-array-index='2'></a></li>");
            }else{
                w.ul.append("<li class='search-choice' lable_key='"+k+"'>"+((nameMaper[k]||k)+":<span class='value'>"+v)+"</span><a class='search-choice-close' data-option-array-index='2'></a></li>");
            }

        }
    }
})(jQuery);
