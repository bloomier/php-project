/**
 *@name
 *@author song
 *@date 2015/5/22
 *@desc
 */
$(function() {

    var _intervals={
        refreshTime:15*1000//刷新时间
    };

    var domainList = {"www.wicwuzhen.cn":"世界互联网大会官网","http://220.191.243.248/":"浙江省公安厅","www.zj.gov.cn":"浙江省政府","www.tx.gov.cn":"桐乡人民政府","www.jiaxing.gov.cn":"嘉兴人民政府"};
    var domainDiv = {"www.wicwuzhen.cn":"world-net","http://220.191.243.248/":"world-zjga","www.zj.gov.cn":"word-zjrm","www.tx.gov.cn":"word-txzf","www.jiaxing.gov.cn":"word-jxzf"}


    $(document).ready(function () {
        _init_.init_view();
        _init_query.inter_fun();
    });


    // 初始化选项
    var _init_ = {
       init_view:function(){
           var width = $(window).width();
           var height = $(window).height();
           $(".show-tab").height(height * 0.05)
           $(".div-tab").height(height * 0.12).css("font-size","16px");
       }
    }

    // 从服务器获取数据
    var _init_query = {

        inter_fun : function(){
            var start = function(){
                $(".show-tab").html("正在刷新");
                $.each(domainList, function(point, item){
                    $("." + domainDiv[point] + "-tab").html(domainList[point] + " 正在刷新")
                    $.ajax(__ROOT__+"/Home/WebAvail/warnsms?domains="+ point).success(function(json){
                        $("." + domainDiv[point] + "-tab").html(domainList[point]);
                        var value = json['data'][point];
                        var node = json['other']['nodes'];
                        var errorList = [];
                        $.each(value, function(p,v ){
                            if(v['value'] != 200){
                                errorList.push(node[p]);
                            }
                        });
                        if(errorList.length == 0){
                            $("." + domainDiv[point]).html("全部正常");
                            $("." + domainDiv[point] + "-tab").css("color","green");
                        }else if(errorList.length <= 2){
                            $("." + domainDiv[point]).html("异常节点有：" + errorList);
                            $("." + domainDiv[point] + "-tab").css("color","green");
                        }else if(errorList.length > 2 && errorList.length < 5){
                            $("." + domainDiv[point]).html("异常节点有：" + errorList);
                            $("." + domainDiv[point] + "-tab").css("color","yellow");
                        }else{
                            $("." + domainDiv[point]).html("异常节点有：" + errorList);
                            $("." + domainDiv[point] + "-tab").css("color","red");
                        }
                    });
                    $(".show-tab").html("");
                });
            }
            start();
            setInterval(start,_intervals.refreshTime);
        }
    }

});

