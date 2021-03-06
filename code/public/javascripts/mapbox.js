mapboxgl.accessToken = 'pk.eyJ1IjoiZWx5bm8iLCJhIjoiY2tqOG8waWE2MDd1ejJzcGVteHd1Y21vdSJ9.0K2deDMvBrkZXzoHjZvWCw';
var map = new mapboxgl.Map({
    container: 'mapmap', // container id
    style: 'mapbox://styles/mapbox/satellite-v9', //hosted style id
    center: [-9.314149, 38.77295], // starting position
    zoom: 11, // starting zoom
    preserveDrawingBuffer: true

});

var loggedUser;
window.onload = function() {
    loggedUser = sessionStorage.getItem("loggedUser");
    notifButton(loggedUser);
    map.resize();
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

var latlng = {};



// desenhar polygon
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


/** USADO PARA DEBUGG
    map.on('mousemove', function(e) {
        document.getElementById('info').innerHTML =
            // e.point is the x, y coordinates of the mousemove event relative
            // to the top-left corner of the map
            JSON.stringify(e.point) +
            '<br />' +
            // e.lngLat is the longitude, latitude geographical position of the event
            JSON.stringify(e.lngLat.wrap());
    });
*/

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
                let marker = new mapboxgl.Marker().setLngLat(myLatlng).setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML("<b>Field Name:</b>: " + fields[i].name + "<br> <input type='button' value='ZOOM' onclick='zoomToField(" + JSON.stringify(coords) + ")'>  </input> to <div id ='buttonSwitch'><input type='button' value='Save field' onclick='printMap()'> </input></div><br><div id ='goToEvents'><input type='button' value='View Events' onclick='showEventsOnThisField(" + fields[i].id + ")'> </input></div>"))
                    .addTo(map);
                map.addLayer({
                    'id': "'" + fields[i].id + "'",
                    'type': 'fill',
                    'source': "'" + fields[i].id + "'",
                    'layout': {},
                    'paint': {
                        'fill-color': '#827725',
                        'fill-opacity': 0.5
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
            console.log(coords);
            try {
                let marker = new mapboxgl.Marker().setLngLat(myLatlng)
                    .setPopup(new mapboxgl.Popup({ offset: 25 })
                        .setHTML("<b>Field Name:</b>: " + fields[i].name + "<br> <input type='button' value='ZOOM' onclick='zoomToField(" + JSON.stringify(coords) + ")'>  </input> to <div id ='buttonSwitch'><input type='button' value='Save field' onclick='printMap()'> </input></div><br><div id ='goToEvents'><input type='button' value='View Events' onclick='showEventsOnThisField(" + fields[i].id + ")'> </input></div>"))
                    .addTo(map);
            } catch (err) {
                console.log(err);
            }
            map.addLayer({
                'id': "'" + fields[i].id + "'",
                'type': 'fill',
                'source': "'" + fields[i].id + "'",
                'layout': {

                },
                'paint': {
                    'fill-color': '#827725',
                    'fill-opacity': 0.5
                }
            });

        }

    }


});

let html = "<div id='eventButton'> ";
html += "<img onclick='createNewEventForm()' id='plus' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png'></div>";


document.getElementById("eventcreatebutton").innerHTML = html;
let block = "";

function printMap() {
    map.getCanvas().toBlob(function(blob) {
        saveAs(blob, 'map.png');
    })
    let html = "<input type='button' value='Go to tactics' onclick='changeToTacticsHTML()'> </input>";
    document.getElementById("buttonSwitch").innerHTML = html;
}



function changeToTacticsHTML() {
    sessionStorage.setItem("loggedUser", loggedUser);
    window.location = "../Links/tactic.html";
}
/**
    $('#downloadLink').click(function() {
        var img = map.getCanvas().toDataURL('image/png')
        this.href = img
    })
*/
/**
    function screenshot() {
        alert("test");
        try {
            var img = map.getCanvas().toDataURL('image/png')
            this.href = img
        } catch (err) {
            console.log(err);
        }
    }
*/





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
async function getAllDistinctFields() {
    try {
        var fields = await $.ajax({
            url: "/api/fields/distinct",
            method: "get",
            dataType: "json"
        });
        return fields;
    } catch (err) {
        console.log(err);
    }
}
//not used
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
    var fields = await getAllDistinctFields();
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
    block += "<div class='radioDiv'><input type='radio' id='openEvent' name='privacy' value='openEvent'></div>";
    block += "<label for='openEvent'>Open event, anyone can join</label><br>";
    block += "<div class='radioDiv'><input type='radio' id='privateEvent' name='privacy' value='privateEvent'></div>";
    block += "<label for='privateEvent'>Private event, requires autorization to join</label><br>";
    block += "<label for='start'><b>Start date:</b></label>"

    var today = new Date();

    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    block += "<input type='date' id='eventdate' name='event-start' value='" + today + "' min='" + today + "'></input><br>"

    block += "<label for='numofgroups'>Number of groups (between 2 and 10):</label>"
    block += "<input type='number' id='numofgroups' name='numofgroups' min='2' max='10'></input><br>"
    block += "<label for='playerspergroup'>Number of players per group:</label>"
    block += "<input type='number' id='playerspergroup' name='playerspergroup' min='1' max='100'></input><br>"
    block += "<label for='eventduration'>Event duration (hours/minutes):</label><br>"
    block += "<input type='number' id='eventdurationhours' name='eventdurationhours' min='0' max='24'></input>"
    block += "<label for='eventdurationhours'>hours</label><br>"
    block += "<input type='number' id='eventdurationmins' name='eventdurationmins' min='0' max='59'></input>"
    block += "<label for='eventdurationmins'>mins</label><br><br>"
    block += "<input type='button' class='btn' value='Create' onclick='createNewEvent()'></input>";
    block += "<input type='button' class='btn cancel' value='Cancel' onclick='closeMiddleBox()'></input>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
    document.getElementById("fieldsarea").style.display = "none";
}

async function getEventsOnField(fieldID) {
    try {
        var events = await $.ajax({
            url: "/api/events/fields/" + fieldID,
            method: "get",
            dataType: "json"
        });

        return events;
    } catch (err) {
        console.log(err);
    }
}

async function showEventsOnThisField(fieldID) {
    var events = await getEventsOnField(fieldID);
    let block = "";
    block += "<form class='form-container'>";
    block += "<div class='form-content' id='form-content2'>";
    block += "  <span class='close' onclick='closeMiddleBox()'>&times;</span>"
    block += "<h2>Events on this field: </h2>";
    block += "<table class='table'>";
    block += "<thead><tr><th>Name</th><th>Date</th><th>Duration</th><th>Nº of teams</th><th>Nº of players</th></tr></thead><tbody>";
    for (let i = 0; i < events.length; i++) {
        // block += "<tr onclick='changeToSelectedEvent(" + events[i].id + ")'><td>" + events[i].name + " </td><td>" + events[i].date + " </td><td>" + events[i].duration + "</td><td>" + events[i].numOfTeams + " Teams </td><td>" + events[i].group_num + " Players</td></tr>";
        block += "<tr onclick='joinEventForm(" + events[i].id + ")'><td>" + events[i].name + " </td><td>" + events[i].date + " </td><td>" + events[i].duration + "</td><td>" + events[i].numOfTeams + " Teams </td><td>" + events[i].group_num + " Players</td></tr>";
    }
    block += "</tbody></table>";
    block += "</span>";

    block += "</div>";
    block += "</form>";
    document.getElementById("MiddleBox").innerHTML = block;

}

function changeToSelectedEvent(eventid) {
    array = [eventid, loggedUser]
    sessionStorage.setItem("eventAndLoggedUserID", JSON.stringify(array));
    window.location = "../Links/eventLobby.html";
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
    let eventName = document.getElementById("ceventName");

    let fields = document.getElementById("fields");
    let publicRadio = document.getElementById("openEvent");

    let privateRadio = document.getElementById("privateEvent");
    let numofgroups = document.getElementById("numofgroups");
    let playerspergroup = document.getElementById("playerspergroup");
    let eventdurationhours = document.getElementById("eventdurationhours");
    let fieldName = document.getElementById("cfieldName");

    if (eventName.value.length > 0 && eventName.value.length <= 30 && fields.value != null && (publicRadio.checked || privateRadio.checked) && (numofgroups.value > 1 && numofgroups.value <= 10) && playerspergroup.value > 0 && eventdurationhours.value > 0 && (fields.value.length > 0 || (fieldName.value.length > 0 && fieldName.value.length <= 30))) {

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
    } else {
        //invalidar/desinvalidar inputs
        if (!(eventName.value.length > 0 && eventName.value.length <= 30)) {
            eventName.style.borderColor = "red";
        } else {
            eventName.style.borderColor = "black";
        }

        if (fields.value === null) {
            fields.style.borderColor = "red";
        } else {
            fields.style.borderColor = "black";
        }

        if (!(publicRadio.checked || privateRadio.checked)) {
            let radioDivs = document.getElementsByClassName("radioDiv");
            radioDivs[0].style.borderColor = "red";
            radioDivs[1].style.borderColor = "red";
        } else {
            let radioDivs = document.getElementsByClassName("radioDiv");
            radioDivs[0].style.borderColor = "black";
            radioDivs[1].style.borderColor = "black";
        }

        if (!(numofgroups.value > 1 && numofgroups.value <= 10)) {
            numofgroups.style.borderColor = "red";
        } else {
            numofgroups.style.borderColor = "black";
        }

        if (!playerspergroup.value > 0) {
            playerspergroup.style.borderColor = "red";
        } else {
            playerspergroup.style.borderColor = "black";
        }

        if (!eventdurationhours.value > 0) {
            eventdurationhours.style.borderColor = "red";
        } else {
            eventdurationhours.style.borderColor = "black";
        }
        if (!(fieldName.value.length > 0 && fieldName.value.length <= 30)) {
            fieldName.style.borderColor = "red";
        } else {
            fieldName.style.borderColor = "black";
        }
    }
    location.reload();
}



function drawEventField() {

    map.addControl(draw);
    map.on('draw.create', updateArea);
    map.on('draw.delete', updateArea);
    map.on('draw.update', updateArea);

    function updateArea(e) {

        var data = draw.getAll();
        if (data.features.length > 0) {
            let lats = [];
            let lngs = [];

            for (let i = 0; i < data.features[0].geometry.coordinates[0].length; i++) {
                lats.push(data.features[0].geometry.coordinates[0][i][1]);
                lngs.push(data.features[0].geometry.coordinates[0][i][0]);
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



function zoomToField(cur) {
    var bounds = cur.reduce(function(bounds, coord) {
        return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(cur[0], cur[0]));
    console.log("Bounds:   " + bounds);
    map.fitBounds(bounds, {
        padding: 20
    });
}


async function joinEventForm(eventID) {
    var event = await getEventSettingsObj(eventID);
    closeMiddleBox();
    let block = "";
    block += "<div class='form-container'>";
    block += "<div class='form-content'>";
    block += "<h1>Join this event?</h1>";

    block += "<a> <b>Name:</b> " + event.name + "</a><br>";
    block += "<a> <b>Field:</b> " + event.field + "</a><br>";
    block += "<a> <b>Date:</b> " + event.date + "            </a>";
    block += "<a> <b>Duration:</b>  " + event.duration + "</a><br>";
    block += "<a> <b>Number of groups:</b>  " + event.group_num + "       </a><br>";
    block += "<a> <b>Number of players per group:</b>  " + event.team_size_event + "</a><br>";
    block += "<a> <b>Event Owner:</b>  " + event.name_player + "       </a><br>";
    block += "<a> <b>Email:</b>  " + event.email_player + "</a><br><br><br><br>";
    //event shit
    if (event.privacy == 2) {
        block += " <button type='button' class='btn' onclick='requestToJoinEvent(" + eventID + "," + loggedUser + ")'>Request to join</button>";
    } else if (event.privacy == 3) {
        //se tivesse password
    } else if (event.privacy == 1) {
        block += " <button type='button' class='btn' onclick='joinEvent(" + eventID + "," + loggedUser + ")'>Join</button>";
    }
    block += "  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</div></div>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
}

async function getEventSettingsObj(id) {
    try {
        var event = await $.ajax({
            url: "/api/events/" + id + "/settings",
            method: "get",
            dataType: "json"
        });
        return event;

    } catch (err) {
        console.log(err);
    }
}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}


async function requestToJoinEvent(eventID, loggedPlayer) {
    var player = await getPlayer(loggedPlayer);
    var eventOBJ = await getEventSettingsObj(eventID);
    try {
        let request = {
            player: loggedPlayer,
            event: eventID,
            text: "Player '" + player.name + "' is requesting to join your event '" + eventOBJ.name + "'."
        }

        let result = await $.ajax({
            url: "/api/notifications/player/:pos/events/:pos2/requests/",
            method: "post",
            dataType: "json",
            data: JSON.stringify(request),
            contentType: "application/json"

        });
        closeMiddleBox();
    } catch (err) {
        console.log(err);
    }
}

async function getPlayer(id) {
    try {
        var player = await $.ajax({
            url: "/api/players/" + id,
            method: "get",
            dataType: "json"
        });
        return player;
    } catch (err) {
        console.log(err);
    }
}