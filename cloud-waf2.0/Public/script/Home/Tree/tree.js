/**
 * Created by jianghaifeng on 2016/3/15.
 */
(function(){
    var zTreeObj;
    var tree = {
        init:function(){
            tree.initEvent();
        },
        initEvent:function(){
            // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
            var setting = {
                check:{
                    autoCheckTrigger: false,
                    chkboxType:{"Y":"ps","N":"ps"},
                    chkStyle: "checkbox"
                }
            };
            // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
            var zNodes = [
                {name:"test1", open:true, children:[
                    {name:"test1_1"}, {name:"test1_2"}]},
                {name:"test2", open:true, children:[
                    {name:"test2_1"}, {name:"test2_2"}]}
            ];
            zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        }

    };


    $(document).ready(function(){
        tree.init();


    });
})();
