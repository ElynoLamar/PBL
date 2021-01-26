var numOfGroups = 0;
var eventid = 0;
var loggedUser;
window.onload = async function() {
    let JSONarray = sessionStorage.getItem("eventAndLoggedUserID");
    let array = JSON.parse(JSONarray);
    loggedUser = array[1];
    eventid = array[0];
    let group = await getEventGroups(eventid);
    numOfGroups = group.group_num;
    notifButton(loggedUser);
    createNav(eventid);
    createEventLobbyUI(eventid);
}

async function createNav(eventid) {
    var eventMembers = await getEventMembersObj(eventid);
    let block = "";
    block += "<h1 class='titles' id='navTitle'>Players <img class='plusimage' onClick='showPlayers(" + eventid + "," + loggedUser + ")' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png' height='50vh;' ></h1>";
    block += "<table class='table'>";
    block += "<tr><th>Name</th><th>Team</th><th>Add</th></tr>";
    for (let i = 0; i < eventMembers.length; i++) {

        block += "<tr><td>" + eventMembers[i].name + "</td>";
        if (eventMembers[i].team == null) {
            block += "<td> N / A </td>";
        } else {
            block += "<td>" + eventMembers[i].team + "</td>";
        }
        block += "<td><div id='buttonCell' onClick='createGroupChoiceUI(" + eventMembers[i].id + ")'>";
        block += "<img src='../images/plus-sign.png' height='50'>"
        block += "</tr>";
    }
    block += "</table>";
    document.getElementById("eventlobbynav").innerHTML = block;
}

async function getEventMembersObj(id_event) {
    try {
        var geteventmembers = await $.ajax({
            url: "/api/events/" + id_event + "/players",
            method: "get",
            dataType: "json"
        });
        return geteventmembers;
    } catch (err) {
        console.log(err);
    }
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
            window.location = "tactic.html";
            break;
    }
}

async function createEventLobbyUI(event_id) {

    let block = "";
    block += "<div id='ChoiceBox' ></div></td>";
    block += "<div id='PlayerBox' ></div></td>";
    block += "<img id='mapIcon' onClick='show(" + 4 + ")' onmouseover='this.src=\"../images/mapIcon.png\"' onmouseout='this.src=\"../images/mapIcon.png\"' src='../images/mapIcon.png'>";
    block += "<img id='edit' onClick='show(" + 4 + ")' onmouseover='this.src=\"../images/editHover.png\"' onmouseout='this.src=\"../images/edit.png\"' src='../images/edit.png'>";
    block+="<span id='groupDiv'>"
    for (let i = 1; i <= numOfGroups; i++) {
        let groupMembers = await getGroupMembersObj(event_id, i);
        block += "<span class='lobbyGroup' id='group" + i + "'>";
        block += "<h1 class='titles'>Group " + i + "</h1>";
        block += "<div class='tablediv'><table class='table'>";
        block += "<tr><th>Name</th><th>Team</th></tr>";
        for (let i = 0; i < groupMembers.length; i++) {

            block += "<tr><td>" + groupMembers[i].name + "</td><td>" + groupMembers[i].team + "</td></tr>";
        }
        block += "</table></div></span>";
    }
    block+="</span>";

    document.getElementById("eventlobbymain").innerHTML = block;
}

async function getGroupMembersObj(id_event, group_id) {
    try {
        var getgroupmembers = await $.ajax({
            url: "/api/events/" + id_event + "/groups/" + group_id + "/members",
            method: "get",
            dataType: "json"
        });
        return getgroupmembers;
    } catch (err) {
        console.log(err);
    }
}

async function createGroupChoiceUI(eventMember) {

    //eventMember = eventMember + 1;

    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Choose a Group!</h1>";
    block += "<span class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";

    for (let i = 1; i <= numOfGroups; i++) {
        block += "<div onClick=insertIntoGroup(" + i + "," + eventMember + ")>Group " + i;
        block += "<div class='accept'>✔</div>";
        block += "</div>";
    }

    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

async function insertIntoGroup(groupNum, eventMember) {

    try {
        let newGroupMember = {
            event: eventid,
            player: eventMember,
            group: groupNum
        }

        let result = await $.ajax({
            url: "/api/events/group",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newGroupMember),
            contentType: "application/json"
        });

    } catch (err) {
        console.log(err);
    }

}


function closeChoice() {
    document.getElementById("ChoiceBox").innerHTML = "";
}

async function getEventGroups(event_id) {

    try {
        var numofgroups = await $.ajax({
            url: "/api/events/" + event_id + "/numofgroups",
            method: "get",
            dataType: "json"
        });
        return numofgroups;
    } catch (err) {
        console.log(err);
    }

}

async function showPlayers(eventid, player) {
    var playersinfo = await getAllPlayers();
    block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>All players:</h1>";
    block += "<input type='button' value='inviteWholeTeam' onclick='inviteWholeTeamDiv()'></input>";
    block += "<span class='close' onclick='closePlayers()'>&times;</span>";
    block += "</boxHeader>";
   
    block += "<table class='table'>";
    block += "<thead><tr><th>INVITE:</th></tr></thead><tbody>";
    for (let i = 0; i < playersinfo.length; i++) {
        block += "<tr><td id='td"+i+"'><span class='allPlayerSpecificInfo' onclick=createNewInvite(" + eventid + "," + playersinfo[i].id +","+i +")><a>" + playersinfo[i].name + "</a></span></td></tr>";
    }
    block += "</tbody></table>";
    block += "</div></div>";
    document.getElementById("PlayerBox").innerHTML = block;
}


function closePlayers() {
    document.getElementById("PlayerBox").innerHTML = "";
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

async function createNewInvite(eventID, clickedPlayerID, rowID) {
    document.getElementById('td'+rowID).style.backgroundColor = '#353321';
    var event = await getEventObj(eventID);
    var player = await getPlayer(loggedUser);
    
    try {
        let newInvite = {
            playerRec: clickedPlayerID,
            playerSend: player.id,
            event: event.id,
            text: "You have been invited to '" + event.name + "' event by the player: '" + player.name + "'"
        }

        let result = await $.ajax({
            url: "/api/notifications/player/invite",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newInvite),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
}

async function getEventObj(id) {
    try {
        var event = await $.ajax({
            url: "/api/events/" + id,
            method: "get",
            dataType: "json"
        });
        return event;
    } catch (err) {
        console.log(err);
    }
}

async function getAllPlayers() {
    try {
        var players = await $.ajax({
            url: "/api/players/",
            method: "get",
            dataType: "json"
        });
        return players;
    } catch (err) {
        console.log(err);
    }
}
async function getAllTeamsObj() {

    try {
        var getallteams = await $.ajax({
            url: "/api/teams",
            method: "get",
            dataType: "json"
        });
        return getallteams;
    } catch (err) {
        console.log(err);
    }

}

async function inviteWholeTeamDiv() {
    var teams = await getAllTeamsObj();
    block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>All players:</h1>";

    block += "<span class='close' onclick='closePlayers()'>&times;</span>";
    block += "</boxHeader>";
    block += "<span id='allPlayerInfo'>";
    block += "<table class='table'>";
    block += "<thead><tr><th>INVITE:</th></tr></thead><tbody>";
    for (let i = 0; i < teams.length; i++) {
        block += "<tr><td id='td"+i+"'><span class='allPlayerSpecificInfo' onclick='inviteWholeTeam(" + teams[i].id + ","+i+ ")'><a>" + teams[i].name + "</a></span></td></tr>";
    }
    block += "</tbody></table>";
    block += "</div></div>";
    document.getElementById("PlayerBox").innerHTML = block;

}
async function getTeamMembersObj(id) {
    try {
        var getteammembers = await $.ajax({
            url: "/api/teams/" + id + "/members",
            method: "get",
            dataType: "json"
        });
        return getteammembers;
    } catch (err) {
        console.log(err);
    }
}
async function inviteWholeTeam(teamID, rowID) {
    document.getElementById('td'+rowID).style.backgroundColor = '#353321';
    let teamMember = await getTeamMembersObj(teamID);
    alert("t")
    alert(JSON.stringify(teamMember));
    alert(teamMember[0].id);
    for (let i = 0; i < teamMember.length; i++) {
        alert(teamMember[i].id);
        createNewInvite(eventid, teamMember[i].id, i);
    }
}