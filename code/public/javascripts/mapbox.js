/**
    async function createMap() {
    
    
        return map;
    }
*/
var latlng = {};
mapboxgl.accessToken = 'pk.eyJ1IjoiZWx5bm8iLCJhIjoiY2tqOG8waWE2MDd1ejJzcGVteHd1Y21vdSJ9.0K2deDMvBrkZXzoHjZvWCw';
var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/satellite-v9', //hosted style id
    center: [-9.314149, 38.77295], // starting position
    zoom: 11 // starting zoom
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

// not used, costumização de um marker
var el = document.createElement('div');
el.className = 'marker';
el.style.backgroundImage = '"../images/bulletMarker.png"';
el.style.width = '80px';
el.style.height = '30px';
el.style.transform = 'skewY(20deg)';


map.on('mousemove', function(e) {
    document.getElementById('info').innerHTML =
        // e.point is the x, y coordinates of the mousemove event relative
        // to the top-left corner of the map
        JSON.stringify(e.point) +
        '<br />' +
        // e.lngLat is the longitude, latitude geographical position of the event
        JSON.stringify(e.lngLat.wrap());
});

//criar markers com BD
map.on('load', async function() {
    var fields = await getAllFields();
    let coords = [];
    let nextInObj = 0;
    let data = {};
    for (let i = 0; i < fields.length; i++) {
        nextInObj = i + 1;
        coords.push([parseFloat(fields[i].lng), parseFloat(fields[i].lat)]);
        if (nextInObj < fields.length) {
            if (fields[i].id != fields[nextInObj].id) {

                data = {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'geometry': {
                            'type': 'Polygon',
                            'coordinates': [
                                coords
                            ]
                        }
                    }
                }
                map.addSource("'" + fields[i].id + "'", data);
                var polygon = turf.polygon([coords]);
                var centroid = turf.centroid(polygon);
                let centroidX = centroid.geometry.coordinates[0];
                let centroidY = centroid.geometry.coordinates[1];
                let myLatlng = new mapboxgl.LngLat(centroidX, centroidY);
                let marker = new mapboxgl.Marker().setLngLat(myLatlng).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<h3>" + fields[i].name + "</h3>"))
                    .addTo(map);
                map.addLayer({
                    'id': "'" + fields[i].id + "'",
                    'type': 'fill',
                    'source': "'" + fields[i].id + "'",
                    'layout': {},
                    'paint': {
                        'fill-color': '#827725',
                        'fill-opacity': 0.8
                    }
                });
                coords = [];
            }
        } else if (nextInObj == fields.length) {
            data = {
                'type': 'geojson',
                'data': {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Polygon',
                        'coordinates': [
                            coords
                        ]
                    }
                }
            }
            map.addSource("'" + fields[i].id + "'", data);
            var polygon = turf.polygon([coords]);
            var centroid = turf.centroid(polygon);
            let centroidX = centroid.geometry.coordinates[0];
            let centroidY = centroid.geometry.coordinates[1];
            let myLatlng = new mapboxgl.LngLat(centroidX, centroidY);
            let marker = new mapboxgl.Marker().setLngLat(myLatlng).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<h3>" + fields[i].name + "</h3>"))
                .addTo(map);
            map.addLayer({
                'id': "'" + fields[i].id + "'",
                'type': 'fill',
                'source': "'" + fields[i].id + "'",
                'layout': {},
                'paint': {
                    'fill-color': '#827725',
                    'fill-opacity': 0.8
                }
            });
        }

    }


});
let html = "<input type='button' value='createevent' onclick='createNewEventForm()'> </input>";
document.getElementById("eventcreatebutton").innerHTML = html;
let block = "";






async function getAllFields() {
    try {
        var fields = await $.ajax({
            url: "/api/fields/",
            method: "get",
            dataType: "json"
        });
        return fields;
    } catch (err) {
        console.log(err);
    }
}
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
    latlng = {};
    var fields = await getAllFields();
    let block = "";
    block += "<form class='form-container'>";
    block += "<div class='form-content'>";
    block += "  <span class='close' onclick='closeMiddleBox()'>&times;</span>"
    block += "<h1>Create a new Event</h1>";
    block += " <label><b>Event name</b></label>";
    block += "<input type='text' placeholder='Enter Event Name' id='ceventName' required>";

    block += "<div id='fieldsarea'>";
    block += "<label><b>New Event Field Name:  </b></label>";
    block += "<input type='text' placeholder='Enter Field Name' id='cfieldName' required><br>";
    block += "</div>";
    block += "<div id='createdFields'>";
    block += " <label><b>Event Field:  </b></label>";
    block += "<select id='fields' name='fields'>";
    for (let i = 0; i < fields.length; i++) {
        block += "<option value=" + fields[i].id + ">" + fields[i].name + "</option>";
    }
    block += "</select><input type='button' value='Create own field' onclick='testing()'></input><br></div>";
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
    block += "<input type='button' class='btn' onclick='createNewEvent()'>Create</input>";
    block += "<input type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</input>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
    document.getElementById("fieldsarea").style.display = "none";
}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "none";
    document.getElementById("fieldsarea").style.display = "none";
}

function testing() {
    document.getElementById("MiddleBox").style.display = "none";
    document.getElementById("createdFields").style.display = "none";
    document.getElementById("fieldsarea").style.display = "block";
    drawEventField();


}

async function createNewEvent() {
    try {
        let eprivacy = 0;
        if (document.getElementById("openEvent").checked) {
            eprivacy = 1;
        } else if (document.getElementById("privateEvent").checked) {
            eprivacy = 2;
        }
        let hours = document.getElementById("eventdurationhours").value;
        let mins = document.getElementById("eventdurationmins").value;
        let duration = (hours * 3600) + (mins * 60);
        let event = {};

        if (Object.keys(latlng).length != 0) {
            event = {
                name: document.getElementById("ceventName").value,
                fieldlats: latlng.lat,
                fieldlngs: latlng.lng,
                date: document.getElementById("eventdate").value,
                duration: duration,
                groupNum: document.getElementById("numofgroups").value,
                teamsSize: document.getElementById("playerspergroup").value,
                privacy: eprivacy,
                player: 1,
                fieldName: document.getElementById("cfieldName").value
            }
        } else {
            event = {
                name: document.getElementById("ceventName").value,
                field: document.getElementById("fields").value,
                date: document.getElementById("eventdate").value,
                duration: duration,
                groupNum: document.getElementById("numofgroups").value,
                teamsSize: document.getElementById("playerspergroup").value,
                privacy: eprivacy,
                player: 1
            }

        }
        console.log(JSON.stringify(event));
        let result = await $.ajax({
            url: "/api/events/",
            method: "post",
            dataType: "json",
            data: JSON.stringify(event),
            contentType: "application/json"
        });
        document.getElementById("MiddleBox").innerHTML = "none";
        document.getElementById("fieldsarea").style.display = "none";
    } catch (err) {
        console.log(err);
    }
}



function drawEventField() {

    map.addControl(draw);
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {

        var data = draw.getAll();
        if (data.features.length > 0) {
            let aux = [];
            for (let i = 0; i < data.features[0].geometry.coordinates[0].length; i++) {
                aux.push(data.features[0].geometry.coordinates[0][i]);
            }
            let lats = [];
            let lngs = [];
            for (let i = 0; i < aux.length; i++) {
                lats.push(aux[i][1]);
                lngs.push(aux[i][0]);

            }

            latlng = {
                lat: lats,
                lng: lngs
            }

            document.getElementById("fieldsarea").style.display = "block";
            document.getElementById("MiddleBox").style.display = "block";
            map.removeControl(draw);


        }
    }
}
/**
    
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
*/