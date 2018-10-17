/**
 *@name
 *@author Sean.xiang
 *@date 2015/8/27
 *@example
 */
var WebMonitorMap = {
    init: function(){
        var w = this;

        w.initHtml();
        w.initEvent();


    },
    initHtml: function(){
        var w = this;

        var width = $(window).width();
        var height = $(window).height();
        w.width = $('mapCanvas').width(width *.6);
        w.height = $('mapCanvas').width(height *.6);
        w.mapCanvas();
    },
    initEvent: function(){
        var w = this;
    },
    mapCanvas : function(){
    var w =this;
    var width = 600, height= 600;

    var canvas = document.getElementById('mapCanvas');
    var context = canvas.getContext('2d');

    var projection =d3.geo.mercator()
        .translate([width/2 , height/2])
        .center([94,34])
        .scale(500);

    var path =d3.geo.path().projection(projection);


    d3.json('/storm-center/Public/js/map3d/china.topojson.json', function(error,json){

        context.beginPath();
        path.context(context)(topojson.feature(json, json.objects.china));
        context.fillStyle=  "#06304e";
        context.strokeStyle= '#001320';
        context.fill();
        context.stroke();
        /*
         context.beginPath();
         path.context(context)({type: 'Sphere'});
         context.fillStyle=  "#001320";
         context.strokeStyle= '#06304e';
         context.fill();
         context.stroke();

         context.beginPath();
         path.context(context)(topojson.mesh(json, json.objects.countries,function(a, b) { return a !== b; }));
         context.fillStyle=  "#06304e";
         context.strokeStyle= '#001320';
         context.fill();
         context.stroke();*/


        var circle= d3.geo.circle().origin([116.4551, 40.2539])
            .angle(1)();
        context.beginPath();
        context.strokeStyle = 'red';
        path.context(context)(circle);
        context.stroke();


        var line= d3.svg.diagonal()
            .source({x:116.46,y:39.92})
            .target({x:119.5313,y:29.8773})();
        //{type: "LineString", coordinates: [[116.46, 39.92], [119.5313,29.8773]]}
        context.beginPath();
        context.moveTo( projection([116.46, 39.92])[0],projection([116.46, 39.92])[1]);
        context.lineTo( projection([119.5313,29.8773])[0], projection([119.5313,29.8773])[1]);
        context.fillStyle=  "red";
        context.strokeStyle = 'red';
        context.strokeWidth = 5;
        context.lineWidth = 1;
        //path.context(context)(line);
        context.fill();
        context.stroke();

        console.info(line)


    })


    }

};
$(function(){
    WebMonitorMap.init();
})