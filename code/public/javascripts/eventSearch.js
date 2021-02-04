var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
var loggedUser;
arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = function() {
    loggedUser = sessionStorage.getItem("loggedUser");
    createEventUI();
    notifButton(loggedUser);
    createAllEventsTable();
}

function createEventUI() {
    let block = "";
    block += "<span id='MiddleBox'> </span>";
    block += "<span id='allEvents' >1</span>";
    block += "<span id='pluscontainer'><img onclick='show(2)' id='plus' onmouseover='this.src=\"../images/backHover.png\"' onmouseout='this.src=\"../images/back.png\"' src='../images/back.png'><span id='plusText'>";
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
    block += "<thead><tr><th>Name</th><th>Field</th><th>Date</th></tr></thead>";
    block += "<tbody>";
    for (let i = 0; i < events.length; i++) {
        block += "<tr onclick='joinEventForm(" + events[i].id + ")'><td>" + events[i].name + "</td><td>" + events[i].field + "</td><td>" + events[i].date + "</td></tr>";
    }
    block += "</tbody>";
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