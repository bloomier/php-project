// 创建Map实例
var bmap = new BMap.Map('map-container', {
    enableMapClick: false,
    minZoom: 4
    //vectorMapLevel: 3
});

bmap.enableScrollWheelZoom(); // 启用滚轮放大缩小
bmap.centerAndZoom(new BMap.Point(113.930099, 22.532323),15);
//bmap.getContainer().style.background = '#081734';
bmap.getContainer().style.background = '#313845';
bmap.setMapStyle({
    styleJson: [{
        featureType: 'water',
        elementType: 'all',
        stylers: {
            color: '#242A32'
            //color: '#044161'
        }
    }, {
        featureType: 'land',
        elementType: 'all',
        stylers: {
            color: '#313845'
            //color: '#091934'
        }
    }, {
        featureType: 'boundary',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'railway',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'highway',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'arterial',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    },  {
        featureType: 'poi',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'green',
        elementType: 'all',
        stylers: {
            //color: '#056197',
            visibility: 'off'
        }
    }, {
        featureType: 'subway',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'manmade',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'local',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }, {
        featureType: 'building',
        elementType: 'all',
        stylers: {
            //color: '#1a5787',
            visibility: 'off'
        }
    }, {
        featureType: 'label',
        elementType: 'all',
        stylers: {
            visibility: 'off'
        }
    }
    ]
});

