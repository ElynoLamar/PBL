var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];
var loggedUser;
window.onload = function() {
    loggedUser = sessionStorage.getItem("loggedUser");
    createEventUI();
    notifButton(loggedUser);
    createMyEventsTable();

}

function createEventUI() {
    let block = "";
    block += "<span id='MiddleBox'></span>";
    block += "<div id='ChoiceBox' ></div></td>";
    block += "<span id='myEvents' >1</span>";
    block += "<span id='pluscontainer'><img onclick='createChoice()' id='plus' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png'><span id='plusText'><p>create event</p><p>search event</p></span></span>";
    document.getElementById("eventDivItems").innerHTML = block;
}

function createChoice() {
    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Create / Search</h1>";
    block += "<span class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";
    block += "<div class='aceptBox' onClick='createNewEventForm(); closeChoice()'";
    block += "<a>Create</a>";
    block += "<div class='accept'>✔</div>";
    block += "</div>";
    block += "<div class='aceptBox' onClick='show(4)'";
    block += "<a>Search</a>";
    block += "<div class='accept'>✔</div>";
    block += "</div>";
    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

function closeChoice() {
    document.getElementById("ChoiceBox").innerHTML = "";
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
        case 4:
            window.location = "eventSearch.html";
            break;
    }
}


async function createMyEventsTable() {

    var events = await getMyEventsObj();

    let block = "";
    block += "<p class='titles'>My Events </p>";
    block += "<div class='tablediv'><table class='table'>";
    block += "<thead><tr><th>Name</th><th>Field</th><th>Date</th></tr></thead>";
    block += "<tbody>";
    for (let i = 0; i < events.length; i++) {
        block += "<tr onclick='changeToEventLobby(" + events[i].id + ")'><td>" + events[i].name + "</td><td>" + events[i].field + "</td><td>" + events[i].date + "</td></tr>";
    }
    block += "</tbody></table></div>";
    document.getElementById("myEvents").innerHTML = block;

}

async function getMyEventsObj() {

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
    array = [id, loggedUser]
    sessionStorage.setItem("eventAndLoggedUserID", JSON.stringify(array));

    window.location = "eventLobby.html";
}

async function createNewEventForm() {
    var fields = await getAllDistinctFields();
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
    block += "<input value='Create' type='button' class='btn' onclick='createNewEvent()'></input>";
    block += "<input value='Cancel' type='button' class='btn cancel' onclick='closeMiddleBox()'></input>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
}

async function createNewEvent() {
    let eventName = document.getElementById("ceventName");

    let fields = document.getElementById("fields");
    let publicRadio = document.getElementById("openEvent");

    let privateRadio = document.getElementById("privateEvent");
    let numofgroups = document.getElementById("numofgroups");
    let playerspergroup = document.getElementById("playerspergroup");
    let eventdurationhours = document.getElementById("eventdurationhours");

    if (eventName.value.length > 0 && eventName.value.length <= 30 && fields.value != null && (publicRadio.checked || privateRadio.checked) && (numofgroups.value > 1 && numofgroups.value <= 10) && playerspergroup.value > 0 && eventdurationhours.value > 0) {
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
    } else {
        //invalidar input de nome
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
    }


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