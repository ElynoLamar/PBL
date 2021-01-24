var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

let loggedUser = 2; // assumir que o utilizador autenticado é o este id

arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = function() {
    createEventUI();
    notifButton(loggedUser);
    createAllEventsTable();
}

function createEventUI() {
    let block = "";
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
        block += "<tr><td>" + events[i].name + "</td><td>" + events[i].field + "</td><td>" + events[i].date + "</td></tr>";
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