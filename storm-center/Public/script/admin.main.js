

(function(){
    //普通的全选操作
    $(".datatable thead th :checkbox").live("change",function(){
        var target=$(this).closest(".datatable");
        $(":checkbox",$(target)).attr("checked",$(this).is(":checked"));
    });

})();