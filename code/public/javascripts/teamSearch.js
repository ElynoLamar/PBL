var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
var loggedUser;
arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = async function() {
    loggedUser= sessionStorage.getItem("loggedUser");
    createTeamUI();
    notifButton(loggedUser);
    createAllTeamsTable(loggedUser);
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

function createTeamUI() {
    let block = "";
    block+="<span id='MiddleBox'> </span>";
    block += "<span id='allTeams'>1</span>";
    block+="<span id='pluscontainer'><img onclick='show(1)' id='plus' onmouseover='this.src=\"../images/backHover.png\"' onmouseout='this.src=\"../images/back.png\"' src='../images/back.png'><span id='plusText'>";
    document.getElementById("teamDivItems").innerHTML = block;
}

async function createAllTeamsTable(player) {

    var teams = await getAllTeamsObj();
    let block = "";
    block += "<h1 class='titles'>All Teams</h1>";
    block += "<div class='tablediv'><table><thead>";
    block += "<tr><th>Name</th><th>Description</th></tr></thead><tbody>";
    for (let i = 0; i < teams.length; i++) {
        block += "<tr onclick='joinTeamForm(" + teams[i].id + "," + player + ")'><td>" + teams[i].name + "</td><td>" + teams[i].description + "</td></tr>";
    }
    block += "</tbody></table></div>";
    document.getElementById("allTeams").innerHTML = block;

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

async function joinTeamForm(teamID, player) {
    var team = await getSpecificTeamObj(teamID);
    closeMiddleBox();
    let block = "";
    block += "<div class='form-container'>";
    block += "<div class='form-content'>";
    block += "<h1>Join this team?</h1>";
    block += " <label><b>Team name: " + team.name + " </b></label>";
    block += " <label><b>Team Description: " + team.description + " </b></label>";
    if (team.privacy == 2) {
        block += " <button type='button' class='btn' onclick='requestToJoinTeam(" + teamID + "," + player + ")'>Request to join</button>";
    } else if (team.privacy == 3) {
        //
    } else if (team.privacy == 1) {
        block += " <button type='button' class='btn' onclick='joinTeam(" + teamID + "," + player + ")'>Join</button>";
    }
    block += "  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</div></div>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
}

async function getSpecificTeamObj(id) {

    try {
        var getTeam = await $.ajax({
            url: "/api/teams/" + id,
            method: "get",
            dataType: "json"
        });
        return getTeam;
    } catch (err) {
        console.log(err);
    }
}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}

async function requestToJoinTeam(teamID, loggedPlayer) {
    var player = await getPlayer(loggedPlayer);
    try {
        let request = {
            player: loggedPlayer,
            team: teamID,
            text: "Player " + player.name + " is requesting to join your team."
        }

        let result = await $.ajax({
            url: "/api/notifications/player/:pos/team/:pos2/request/",
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