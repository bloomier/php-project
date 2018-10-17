(function() {
  var canvas = document.getElementById('quakeCanvas');

    var __PUBLIC__=$("#publicPath").val();
  // Create our Planetary.js planet and set some initial values;
  // we use several custom plugins, defined at the bottom of the file
  var planet = planetaryjs.planet();
  //planet.loadPlugin(autocenter({extraHeight: -20}));
  //planet.loadPlugin(autoscale({extraHeight: -20}));
  planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: { file:  __PUBLIC__+'/js/map3d/world-110m.json' },
    oceans:   { fill:   '#001320' },
    land:     { fill:   '#06304e' },
    borders:  { stroke: '#001320' }
  }));
  planet.loadPlugin(planetaryjs.plugins.pings());

  planet.loadPlugin(planetaryjs.plugins.drag({
    onDragStart: function() {
      this.plugins.autorotate.pause();
    },
    onDragEnd: function() {
      this.plugins.autorotate.resume();
    }
  }));
  planet.loadPlugin(autorotate(-5));
  //planet.projection.rotate([60, -10, 0]);
    planet.projection.scale(250).translate([300, 300]).rotate([10, -10, 0]);
  planet.draw(canvas);



    var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
    setInterval(function() {
        var lat = Math.random() * 170 - 85;
        var lng = Math.random() * 360 - 180;
        var color = colors[Math.floor(Math.random() * colors.length)];
        var angle = Math.random() * 10;
        planet.plugins.pings.add(lng, lat, { color: color, ttl: 2000, angle: angle });
    }, 250);



  // Plugin to resize the canvas to fill the window and to
  // automatically center the planet when the window size changes
  function autocenter(options) {
    options = options || {};
    var needsCentering = false;
    var globe = null;

    var resize = function() {
      var width  = window.innerWidth + (options.extraWidth || 0);
      var height = window.innerHeight + (options.extraHeight || 0);
      globe.canvas.width = width;
      globe.canvas.height = height;
      globe.projection.translate([width / 2, height / 2]);
    };

    return function(planet) {
      globe = planet;
      planet.onInit(function() {
        needsCentering = true;
        d3.select(window).on('resize', function() {
          needsCentering = true;
        });
      });

      planet.onDraw(function() {
        if (needsCentering) { resize(); needsCentering = false; }
      });
    };
  }

  // Plugin to automatically scale the planet's projection based
  // on the window size when the planet is initialized
  function autoscale(options) {
    options = options || {};
    return function(planet) {
      planet.onInit(function() {
        var width  = window.innerWidth + (options.extraWidth || 0);
        var height = window.innerHeight + (options.extraHeight || 0);
        planet.projection.scale(Math.min(width, height) / 2);
      });
    };
  }

  // Plugin to automatically rotate the globe around its vertical
  // axis a configured number of degrees every second.
  function autorotate(degPerSec) {
    return function(planet) {
      var lastTick = null;
      var paused = false;
      planet.plugins.autorotate = {
        pause:  function() { paused = true;  },
        resume: function() { paused = false; }
      };
      planet.onDraw(function() {
        if (paused || !lastTick) {
          lastTick = new Date();
        } else {
          var now = new Date();
          var delta = now - lastTick;
          var rotation = planet.projection.rotate();
          rotation[0] -= degPerSec * delta / 1000;
          if (rotation[0] >= 180) rotation[0] -= 360;
          planet.projection.rotate(rotation);
          lastTick = now;
        }
      });
    };
  }
})();
