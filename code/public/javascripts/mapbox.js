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


/**
    window.onload = async function() {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZWx5bm8iLCJhIjoiY2tqOG8waWE2MDd1ejJzcGVteHd1Y21vdSJ9.0K2deDMvBrkZXzoHjZvWCw';
        var map = L.mapbox.map('map')
            .setView([38.89399, -77.03659], 17)
            .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/streets-v11'));
    
        var featureGroup = L.featureGroup().addTo(map);
    
        var drawControl = new L.Control.Draw({
            edit: {
                featureGroup: featureGroup
            },
            draw: {
                polygon: true,
                polyline: false,
                rectangle: false,
                circle: false,
                marker: false
            }
        }).addTo(map);
    
        map.on('draw:created', showPolygonArea);
        map.on('draw:edited', showPolygonAreaEdited);
    
        function showPolygonAreaEdited(e) {
            e.layers.eachLayer(function(layer) {
                showPolygonArea({ layer: layer });
            });
        }
    
        function showPolygonArea(e) {
            featureGroup.clearLayers();
            featureGroup.addLayer(e.layer);
            e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
            e.layer.openPopup();
        }
    }
    
    
    
*/
/**
    async function createMap() {
    
        return map;
    }
*/
window.onload = async function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWx5bm8iLCJhIjoiY2tqOG8waWE2MDd1ejJzcGVteHd1Y21vdSJ9.0K2deDMvBrkZXzoHjZvWCw';
    var map = new mapboxgl.Map({
        container: 'map', // container id
        style: 'mapbox://styles/mapbox/satellite-v9', //hosted style id
        center: [-9.314149, 38.77295], // starting position
        zoom: 16 // starting zoom
    });
    // let map = createMap();
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
    map.addControl(draw);

    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);
    /**
            async function createPolygon() {
                alert("hrey");
                var polygon;
                for (let i = 0; i < data.features[0].geometry.coordinates[0].length; i++) {
        
                }
        
                var data = draw.deleteAll();
                alert(JSON.stringify(data));
            }
    */

    function updateArea(e) {

        var data = draw.getAll();
        if (data.features.length > 0) {
            for (let i = 0; i < data.features[0].geometry.coordinates[0].length; i++) {

                // alert(JSON.stringify(data.features[0].geometry.coordinates[0][i]));
            }
        }
        //var center = e.layer.bounds.getCenter().addTo(map);;

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

    map.on('mousemove', function(e) {
        document.getElementById('info').innerHTML =
            // e.point is the x, y coordinates of the mousemove event relative
            // to the top-left corner of the map
            JSON.stringify(e.point) +
            '<br />' +
            // e.lngLat is the longitude, latitude geographical position of the event
            JSON.stringify(e.lngLat.wrap());
    });


    /**
            //criar markers com BD
            async function test() {
                var teste = await getSpecificField();
                alert(JSON.stringify(teste));
                //for (let i = 0; i < teste.length; i++) {
                let eventlng = 0;
                let eventlat = 0;
                $.each(teste, function(i, item) {
                    eventlng += teste[i].lng;
                    eventlat += teste[i].lat;
                    let myLatlng = new mapboxgl.LngLat(teste[i].lng, teste[i].lat);
                    var marker = new mapboxgl.Marker()
                        .setLngLat(myLatlng)
                        .setPopup(new mapboxgl.Popup({ offset: 25 })
                            .setHTML('<h3>' + teste[i].name + '</h3>'))
                        .addTo(map);
                });
                //}
        
            }
    */


    //criar markers com BD
    map.on('load', async function() {
        var teste = await getSpecificField();
        //  alert(JSON.stringify(teste));
        let aux = [];
        for (let i = 0; i < teste.length; i++) {
            aux.push([parseFloat(teste[i].lng), parseFloat(teste[i].lat)]);
        }


        try {
            let data = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            aux
                        ]
                    }
                }
            }
            map.addSource("'" + teste[0].name + "'", data);

            var polygon = turf.polygon([
                aux
                /**
                     [
                         [-81, 41],
                         [-88, 36],
                         [-84, 31],
                         [-80, 33],
                         [-77, 39],
                         [-81, 41]
                     ]
                */
            ]);

            var centroid = turf.centroid(polygon);
            let centroidX = centroid.geometry.coordinates[0];
            let centroidY = centroid.geometry.coordinates[1];
            let myLatlng = new mapboxgl.LngLat(centroidX, centroidY);
            var marker = new mapboxgl.Marker().setLngLat(myLatlng).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<h3> YOOOO </h3>'))
                .addTo(map);
        } catch (err) {
            console.log(err);
        }
        //[-9.314585,38.770270],[-9.306418,38.770481],[-9.314149, 38.772950],[-9.314585,38.770270]

        //[{"lat":"38.770270","lng":"-9.314585","name":"Cacém field"},{"lat":"38.770481","lng":"-9.306418","name":"Cacém field"},{"lat":" 38.772950","lng":"-9.314149","name":"Cacém field"},{"lat":"38.770270","lng":"-9.314585","name":"Cacém field"}]
        map.addLayer({
            'id': "'" + teste[0].name + "'",
            'type': 'fill',
            'source': "'" + teste[0].name + "'",
            'layout': {},
            'paint': {
                'fill-color': '#088',
                'fill-opacity': 0.8
            }
        });
    });

    //  test(map);
}


async function eventMarkers(long, lat) {
    var marker = new mapboxgl.Marker().setLngLat([-9.314149, 38.77295]).addTo(map);
}



/**
    async function test(map) {
    
    
        //for (let i = 0; i < teste.length; i++) {
        let eventlng = 0;
        let eventlat = 0;
        $.each(teste, function(i, item) {
            eventlng += parseInt(teste[i].lng);
            eventlat += parseInt(teste[i].lat);
        });
        //}
        eventlng = eventlng / (teste.length - 1);
        eventlat = eventlat / (teste.length - 1);
    
        
    }
    
*/
async function getSpecificField() {
    try {
        var getField = await $.ajax({
            url: "/api/fields/" + 1 + "/coordinates",
            method: "get",
            dataType: "json"
        });

        return getField;
    } catch (err) {
        console.log(err);
    }
}
async function createNewEventForm() {
    /**
        var popup = document.getElementById("eventForm");
        popup.classList.toggle("show");
    */
    var fields = await getAllFields();
    let block = "";
    block += "<form class='form-container'>";
    block += "<div class='form-content'>";
    block += "  <span class='close' onclick='closeMiddleBox()'>&times;</span>"
    block += "<h1>Create a new Event</h1>";
    block += " <label><b>Event name</b></label>";
    block += "<input type='text' placeholder='Enter Event Name' id='ceventName' required>";
    block += " <label><b>Event Field:  </b></label>";
    block += "<select id='fields' name='fields'>";
    for (let i = 0; i < fields.length; i++) {
        block += "<option value=" + fields[i].id + ">" + fields[i].name + "</option>";
    }
    block += "</select><br>";
    block += " <label><b>Choose your event privacy</b></label><br>";
    block += "<input type='radio' id='openEvent' name='privacy' value='openEvent'>";
    block += "<label for='openEvent'>Open event, anyone can join</label><br>";
    block += "<input type='radio' id='privateEvent' name='privacy' value='privateEvent'>";
    block += "<label for='privateEvent'>Private event, requires autorization to join</label><br>";
    block += "<label for='start'><b>Start date:</b></label>"
    block += "<input type='date' id='eventdate' name='event-start' value='2021-01-01' min='2021-01-01'></input><br>"
    block += "<label for='numofgroups'>Number of groups (between 2 and 10):</label>"
    block += "<input type='number' id='numofgroups' name='numofgroups' min='2' max='10'></input><br>"
    block += "<label for='playerspergroup'>Number of players per group:</label>"
    block += "<input type='number' id='playerspergroup' name='playerspergroup' min='1' max='100'></input><br>"
    block += "<label for='eventduration'>Event duration (hours/minutes):</label><br>"
    block += "<input type='number' id='eventdurationhours' name='eventdurationhours' min='0' max='24'></input>"
    block += "<label for='eventdurationhours'>hours</label><br>"
    block += "<input type='number' id='eventdurationmins' name='eventdurationmins' min='0' max='59'></input>"
    block += "<label for='eventdurationmins'>mins</label><br><br>"
    block += "<button type='button' class='btn' onclick='createNewEvent()'>Create</button>";
    block += "<button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}