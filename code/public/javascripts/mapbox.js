var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

function createNav() {
    let aux = "";
    for (let i = 0; i < arrayOfItems.length; i++) {
        aux += "<span class='navContainer' onclick='show(" + i + ")'>" + arrayOfItems[i] + "</span>";
    }
    document.getElementById("navItems").innerHTML = aux;
}




function show(index) {
    switch (index) {
        case 0:
            window.location = "../index.html";
            break;
        case 1:
            window.location = "team.html";
            break;
        case 2:
            window.location = "event.html";
            break;
        case 3:
            window.location = "map.html";
            break;
    }
}

window.onload = function () {
    createNav();
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWx5bm8iLCJhIjoiY2tqOG8waWE2MDd1ejJzcGVteHd1Y21vdSJ9.0K2deDMvBrkZXzoHjZvWCw';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/satellite-v9', //hosted style id
        center: [-9.314149, 38.77295], // starting position
        zoom: 16 // starting zoom
    });

    var draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });
    //caixa de texto procurar
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    );
    //localização do utilizador
    map.addControl(
        new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        })
    );
        
    var marker = new mapboxgl.Marker()
        .setLngLat([-9.26218, 38.76958])
        .addTo(map);
    map.addControl(draw);
    map.on('click', addMarker);
    function addMarker(e) {
        console.log('Map clicked!',e.lngLat.lat,e.lngLat.lng);
        newMarker();
    }
    function newMarker(){
        alert("hey!");
        var marker = new mapboxgl.Marker()
            .setLngLat([-10.26218, 38.76958])
            .addTo(map);
        map.addControl(draw);
    }
    geojson.features.forEach(function(marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';
      
        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
          .setLngLat(marker.geometry.coordinates)
          .addTo(map);
      });    

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {
        var data = draw.getAll();
        if (data.features.length > 0) {
            for (let i = 0; i < data.features[0].geometry.coordinates[0].length; i++) {
                //alert(JSON.stringify(data.features[0].geometry.coordinates[0][i]));
            }
        }

        // calcular area
        var answer = document.getElementById('calculated-area');
        if (data.features.length > 0) {
            var area = turf.area(data);
            // restrict to area to 2 decimal points
            var rounded_area = Math.round(area * 100) / 100;
            answer.innerHTML =
                '<p><strong>' +
                rounded_area +
                '</strong></p><p>square meters</p>';
        } else {
            answer.innerHTML = '';
            if (e.type !== 'draw.delete')
                alert('Use the draw tools to draw a polygon!');
        }
    }

    map.on('mousemove', function (e) {
        document.getElementById('info').innerHTML =
            // e.point is the x, y coordinates of the mousemove event relative
            // to the top-left corner of the map
            JSON.stringify(e.point) +
            '<br />' +
            // e.lngLat is the longitude, latitude geographical position of the event
            JSON.stringify(e.lngLat.wrap());
    });


    

}

