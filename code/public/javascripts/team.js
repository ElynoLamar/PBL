var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

let loggedUser = 2; // assumir que o utilizador autenticado é o este id

arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = async function() {

    createTeamUI();
    notifButton(loggedUser);
    createMyTeamsTable(loggedUser);
  
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

function changeToClickedTeam(team, player) {
    sessionStorage.setItem("teamid", team);
    sessionStorage.setItem("playerid", player);
    window.location = "selectedTeam.html"
}

function createTeamUI() {
    let block = "";
    block += "<span id='myTeams'>1</span>";
    block += "<span id='MiddleBox'></span>";
    block += "<span id='pluscontainer'><img onclick='createNewTeamForm()' id='plus' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png'><span id='plusText'><p>search team</p><p>create team</p></span></span>";
    document.getElementById("teamDivItems").innerHTML = block;
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

async function getMyTeamsObj(player) {

    try {
        var getmyteams = await $.ajax({
            url: "/api/players/" + player + "/teams",
            method: "get",
            dataType: "json"
        });
        return getmyteams;
    } catch (err) {
        console.log(err);
    }
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


async function createMyTeamsTable(player) {

    var teams = await getMyTeamsObj(player);
    let block = "";
    block += "<h1 class='titles'>My Teams</h1>";
    block += "<div class='tablediv'><table class='table'><thead>";
    block += "<tr><th>Name</th><th>Description</th></tr></thead><tbody>";
    for (let i = 0; i < teams.length; i++) {
        block += "<tr onclick='changeToClickedTeam(" + teams[i].id + "," + player + ")'><td>" + teams[i].name + "</td><td>" + teams[i].description + "</td></tr>";
    }
    block += "</tbody></table></div>";
    document.getElementById("myTeams").innerHTML = block;

}

async function createNewTeam(playerID) {
    try {
        let tprivacy = 0;
        if (document.getElementById("openTeam").checked) {
            tprivacy = 1;
        } else if (document.getElementById("privateTeam").checked) {
            tprivacy = 2;
        }
        let team = {
            name: document.getElementById("cteamName").value,
            desc: document.getElementById("cteamDesc").value,
            privacy: tprivacy,
            player: playerID
        }
        let result = await $.ajax({
            url: "/api/teams",
            method: "post",
            dataType: "json",
            data: JSON.stringify(team),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }

    //changeRank(playerID, teamID);

    createMyTeamsTable(playerID);
    closeMiddleBox();
}

function createNewTeamForm() {
    let block = "";
    block += "<form class='form-container'>";
    block +="<div class='form-content'>";
    block+="  <span class='close'>&times;</span>"
    block += "<h1>Create a new Team</h1>";
    block += " <label><b>Team name</b></label>";
    block += "<input type='text' placeholder='Enter Team Name' id='cteamName' required>";
    block += " <label><b>Team Description</b></label>";
    block += " <input type='text' placeholder='Enter Team Description' id='cteamDesc'>";
    block += " <label><b>Choose your team privacy</b></label><br>";
    block += "<input type='radio' id='openTeam' name='privacy' value='openTeam'>";
    block += "<label for='openTeam'>Open team, anyone can join</label><br>";
    block += "<input type='radio' id='privateTeam' name='privacy' value='privateTeam'>";
    block += "<label for='privateTeam'>Private, requires autorization to join</label><br><br>";
    block += " <button type='button' class='btn' onclick='createNewTeam(" + loggedUser + ")'>Create</button>";
    block += "  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;

}


function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}


async function joinTeam(teamID, playerID) {
    try {
        let newMember = {
            player: playerID,
            team: teamID,
            ranking: 2,
            role: 1
        }

        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/members",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newMember),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
    closeMiddleBox();

    createMyTeamsTable(loggedUser);
}

//not used
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
    } catch (err) {
        console.log(err);
    }
}
//not used
async function changeRank(playerID, teamID) {
    try {
        let newRankInfo = {
            rank: 1,
            player: playerID,
            team: teamID
        }

        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/player/" + playerID + "/rank/" + 1,
            method: "post",
            dataType: "json",
            data: JSON.stringify(newRankInfo),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
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
async function joinTeamForm(teamID, player) {
    closeMiddleBox();
    var team = await getSpecificTeamObj(teamID);
    
    let block = "";
    block += "<form class='form-container'>";
    block += "<h1>Join this team?</h1>";
    block += " <label><b>Team name: " + team.name + " </b></label>";
    block += " <label><b>Team Description: " + team.description + " </b></label>";
    if (team.privacy == 2) {
        block += " <button type='button' class='btn' onclick='requestToJoinTeam(" + teamID + "," + player + ")'>Request to join</button>";
    } else if (team.privacy == 3) alert("team por pass")
    else if (team.privacy == 1) {
        block += " <button type='button' class='btn' onclick='joinTeam(" + teamID + "," + player + ")'>Join</button>";
    }
    block += "  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;
}




/**
    async function getInviteInfo(invNum) {
    
        try {
            var inviteInfo = await $.ajax({
                url: "/api/notifications/invite/" + invNum,
                method: "get",
                dataType: "json"
            });
    
            return inviteInfo;
        } catch (err) {
            console.log(err);
        }
    }
*/


