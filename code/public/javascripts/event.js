var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
let loggedUser = 1; // assumir que o utilizador autenticado é o id=1

arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = function() {
    createEventUI();

    createMyEventsTable();
}


function createEventUI() {
    let block = "";
    block += "<span id='MiddleBox'></span>";
    block += "<span id='myEvents' >1</span>";
    block += "<span id='pluscontainer'><img onclick='createNewEventForm()' id='plus' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png'><span id='plusText'><p>search event</p><p>create event</p></span></span>";
    document.getElementById("eventDivItems").innerHTML = block;

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

async function createAllEventsTable() {
    var events = await getAllEventsObj();
    let block = "";
    block += "<h1 class='titles'>All Events</h1>";
    block += "<div class='tablediv'><table class='table'>";
    block += "<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for (let i = 0; i < events.length; i++) {
        block += "<tr><td>" + events[i].name + "</td><td>" + events[i].field + "</td><td>" + events[i].date + "</td></tr>";
    }
    block += "</table></div>";
    document.getElementById("allEvents").innerHTML = block;
}

async function getAllEventsObj() {

    try {
        var getallevents = await $.ajax({
            url: "/api/events",
            method: "get",
            dataType: "json"
        });
        return getallevents;
    } catch (err) {
        console.log(err);
    }

}


async function createMyEventsTable() {

    var events = await getMyEventsObj();
    let block = "";
    block += "<p class='titles'>My Events </p>";
    block += "<div class='tablediv'><table class='table'>";
    block += "<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for (let i = 0; i < events.length; i++) {
        block += "<tr onclick='changeToEventLobby(" + events[i].id + ")'><td>" + events[i].name + "</td><td>" + events[i].field + "</td><td>" + events[i].date + "</td></tr>";
    }
    block += "</table></div>";
    document.getElementById("myEvents").innerHTML = block;

}

async function getMyEventsObj() {
    let loggedUser = 1; // assumir que o utilizador autenticado é o id=8
    try {
        var getmyevents = await $.ajax({
            url: "/api/events/player/" + loggedUser,
            method: "get",
            dataType: "json"
        });
        return getmyevents;
    } catch (err) {
        console.log(err);
    }
}


function changeToEventLobby(id) {
    sessionStorage.setItem("id", id);
    window.location = "eventLobby.html"
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
    block += "<span class='close' onclick='closeMiddleBox()'>&times;</span>"
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

function createNewEvent() {
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
        let event = {
            name: document.getElementById("ceventName").value,
            field: document.getElementById("fields").value,
            date: document.getElementById("eventdate").value,
            duration: duration,
            groupNum: document.getElementById("numofgroups").value,
            teamsSize: document.getElementById("playerspergroup").value,
            privacy: eprivacy,
            player: loggedUser
        }
        let result = await $.ajax({
            url: "/api/events/",
            method: "post",
            dataType: "json",
            data: JSON.stringify(event),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }

    createMyEventsTable();
    closeMiddleBox();
}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}


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