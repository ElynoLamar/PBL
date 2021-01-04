
var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";


arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = async function () {
    let teamid = sessionStorage.getItem("teamid");
    let loggedUser = sessionStorage.getItem("playerid");
    createTeamUI();
    createTeammatesTable(teamid, loggedUser);
    createTacticsTable(teamid);
    createMiddleBox(teamid);
    //notifButton();
}
// buscar obj da team usando o teamid
async function getTeamObj(id) {
    try {
        var team = await $.ajax({
            url: "/api/teams/" + id,
            method: "get",
            dataType: "json"
        });
        return team;
    } catch (err) {
        console.log(err);
    }
}
//criar as caixas onde vamos por informaçoes e modificar
function createTeamUI() {
    let block = "";
    block += "<span id='teamMembers'>1</span>";
    block += "<span id='actionTeamBox'>2</span>";
    block += "<span id='teamMaps'>3</span>";
    document.getElementById("teamDivItems").innerHTML = block;
}
// vai buscar os players desta equipa
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
//uma lista que mostra os players desta equipa
async function createTeammatesTable(teamid, player) {
    var teammember = await getTeamMembersObj(teamid);
    let block = "";
    if (Object.keys(teammember).length != 0) {
        block += "<div class='flex-container'>";
        block += "<span></span><h1 class='titles'>Team members</h1><span><img id='plusimage' src='../images/plus-sign.png' height=30 onclick=changeMiddleBox_AllPlayers(" + teamid + "," + player + ")></span>";
        block += "</div>";
        block += "<table class='table'>";
        block += "<tr><th>Name</th><th>Rank</th><th>Role</th></tr>";
        for (let i = 0; i < teammember.length; i++) {
            block += "<tr onclick='changeMiddleBox_Player(" + teammember[i].id + "," + teamid + "," + player + ")'><td>" + teammember[i].name + "</td><td>" + teammember[i].Ranking + "</td><td>" + teammember[i].Role + "</td></tr>";
        }
        block += "</table>";
    } else {
        block = "<h1 class='titles'> No teammembers found</h1>";
    }
    document.getElementById("teamMembers").innerHTML = block;
}
//vai buscar as tacticas/campos desta equipa
async function getTeamTactics(id) {
    try {
        var teamtacts = await $.ajax({
            url: "../api/teams/" + id + "/tactics",
            method: "get",
            dataType: "json"
        });

        return teamtacts;
    } catch (err) {
        console.log(err);
    }
}
//criar tabela de tacticas/campos desta equipa
async function createTacticsTable(id) {
    var tactics = await getTeamTactics(id);
    let block = "";
    if (Object.keys(tactics).length != 0) {
        block += "<h1 class='titles'>Map tactics</h1>";
        block += "<table class='table'>";
        block += "<tr><th>Name</th><th>Field</th></tr>";
        for (let i = 0; i < tactics.length; i++) {
            block += "<tr onclick=changeMiddleBox_Tactics(" + id + ",\'" + tactics[i].image + "\')><td>" + tactics[i].name + "</td><td>" + tactics[i].field + "</td></tr>";
        }
        block += "</table>";
    } else {
        block = "<h1 class='titles'> No tactics found</h1>";
    }
    document.getElementById("teamMaps").innerHTML = block;
}
// buscar informação do jogador NESTA equipa(roles e rankings especificos desta equipa) na middle box
async function getPlayerInfo(player, team) {
    try {//fixar isto para /api/team/id/player/id
        var playerinfo = await $.ajax({
            url: "/api/players/" + player + "/team/" + team,
            method: "get",
            dataType: "json"
        });
        return playerinfo;
    } catch (err) {
        console.log(err);
    }
}

async function getAllRoles() {
    try {
        var roles = await $.ajax({
            url: "/api/roles/",
            method: "get",
            dataType: "json"
        });
        return roles;
    } catch (err) {
        console.log(err);
    }
}


// mostrar informação do jogador nesta equipa
async function changeMiddleBox_Player(player, team, loggedPlayer) {
    //ARRANJAR O ROUTE, TROCAR DE PLAYER PRA TEAM
    let block = "";
    var playerinfo = await getPlayerInfo(player, team);
    var loggedPlayerinfo = await getPlayerInfo(loggedPlayer, team);
    var roles = await getAllRoles();
    block += "<h2>Player Details: </h2>";
    block += "<span id='playerBox'>"
    block += "<span id='playerInfo'>"
    block += "<p><img src='../images/pistol.png' height='10'> Age: " + playerinfo.name + "</p>";
    block += "<p><img src='../images/pistol.png' height='10'> Age: " + playerinfo.age + "</p>";
    block += "<p><img src='../images/pistol.png' height='10'> Team Rank: " + playerinfo.ranking + "</p>";
    block += "<p><img src='../images/pistol.png' height='10'> Team Role: " + playerinfo.role;
    if (loggedPlayerinfo.ranking == 'Leader') {
        block += "<div class='dropdown'><button class='dropbtn'>Change Role</button><div class='dropdown-content'>";
        for (let i = 0; i < roles.length; i++) {
            block += "<a onclick=changeRole(" + roles[i].id + "," + playerinfo.id + "," + team + "," + loggedPlayer + ")>" + roles[i].name + "</a>";
        }
        block += "</div></div>";
    }
    block += "</p>";
    block += "<p><img src='../images/pistol.png' height='10'> email: " + playerinfo.email + "</p>";
    block += "</span>"
    block += "<span id='playerPhoto'>"
    block += "<img src='../images/" + playerinfo.photo + "' height='150'>";
    block += "</span>"
    block += "<span id='deadSpace'></span>"
    block += "</span>"
    block += "<span id='playerDesc'><img src='../images/pistol.png' height='10'> Description: " + playerinfo.description + "</span>";
    if (loggedPlayerinfo.ranking == 'Leader' && loggedPlayerinfo.id!=playerinfo.id) {
        block += "<span id='removeOrGiveLeaderFlex'>";
        block += "<div class='promote' onclick=promoteToLeader(" + playerinfo.id + "," + team + "," + loggedPlayer + ")>Promote to Leader</div>";
        block += "<div class='removeTeammate' onclick='removeThisPlayer(" + playerinfo.id + "," + team + "," + loggedPlayer + ")'> Remove Teammate </div> </span>";
    } else if(loggedPlayerinfo.id==playerinfo.id && loggedPlayerinfo.ranking != 'Leader'){
        block += "<span id='removeOrGiveLeaderFlex'>";
        block += "<div class='removeTeammate' onclick='removeThisPlayer(" + playerinfo.id + "," + team + "," + loggedPlayer + ")'> Leave team </div> </span>";
        
    }
    document.getElementById("actionTeamBox").innerHTML = block;
}


async function changeRole(roleID, playerID, teamID, loggedPlayer) {
    try {
        let newRoleInfo = {
            role: roleID,
            player: playerID,
            team: teamID
        }

        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/player/" + playerID + "/role/" + roleID,
            method: "post",
            dataType: "json",
            data: JSON.stringify(newRoleInfo),
            contentType: "application/json"
        });
        changeMiddleBox_Player(playerID, teamID, loggedPlayer);
        createTeammatesTable(teamID);
    } catch (err) {
        console.log(err);
    }
}



//caixa onde mostramos info especifica sobre (inicialmente) teams, e apos cliques nas tabelas laterais sobre players ou tacticas
async function createMiddleBox(teamid) {
    var team = await getTeamObj(teamid);
    let block = "";
    block += "<span id='playerPhoto'>";
    block += "<h2>Selected Team</h2>";
    block += "<p>Team Name:" + team.name + " </p>";
    block += "</span>";
    block += "<span id='playerPhoto'> <img src='../images/teamlogo.png' height='150' ></span>";
    document.getElementById("actionTeamBox").innerHTML = block;
}
// mostrar info sobre tacticas
async function changeMiddleBox_Tactics(teamid, tacticmap) {
    let block = "";
    //  block+="<h2>Tactic name:"+ tacticName+ "</h2>";
    block += "<h2>Tactic location: HEHEHE </h2>";
    block += "<h2>Team id:" + teamid + "</h2>";
    block += "<img src='../images/" + tacticmap + "' height='450'></img>";
    block += "<span>";
    block += "</span>";
    document.getElementById("actionTeamBox").innerHTML = block;
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

async function changeMiddleBox_AllPlayers(teamid, player) {
    let block = "";
    var playersinfo = await getAllPlayers();
    block += "<h2>All players: </h2>";
    block += "<span id='allPlayerInfo'>";
    for (let i = 0; i < playersinfo.length; i++) {
        block += "<span id='allPlayerSpecificInfo'><a>" + playersinfo[i].name + "</a><div onclick=createNewInvite(" + teamid + "," + playersinfo[i].id + "," + player + ")>Invite</div></span>";
    }
    block += "</span>";
    document.getElementById("actionTeamBox").innerHTML = block;
}

async function createNewInvite(teamID, clickedPlayerID, loggedPlayer) {

    var player = await getPlayer(loggedPlayer);

    var team = await getTeamObj(teamID);

    try {
        let newInvite = {
            playerRec: clickedPlayerID,
            playerSend: player.id,
            team: team.id,
            text: "You have been invited to join " + team.name + " by the player " + player.name
        }

        let result = await $.ajax({
            url: "/api/notifications/team/" + teamID + "/player/" + clickedPlayerID,
            method: "post",
            dataType: "json",
            data: JSON.stringify(newInvite),
            contentType: "application/json"
        });
    } catch (err) {
        console.log(err);
    }
}

async function removeThisPlayer(playerID, teamID, loggedPlayer) {
    try {
        let teammate = {
            player: playerID,
            team: teamID
        }
        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/player/" + playerID,
            method: "post",
            dataType: "json",
            data: JSON.stringify(teammate),
            contentType: "application/json"
        });
        createTeammatesTable(teamID, loggedPlayer);
        createMiddleBox(teamID);
        if(playerID==loggedPlayer){
            window.location = "team.html";
            return;
        }
    } catch (err) {
        console.log(err);
    }
}



async function promoteToLeader(playerID, teamID, loggedPlayer) {
    alert("logged player: " + loggedPlayer);
    alert("player escolhido: " + playerID);
    try {
        let teammate = {
            newLeader: playerID,
            team: teamID,
            oldLeader: loggedPlayer
        }
        let result = await $.ajax({
            url: "/api/teams/" + teamID + "/player/" + loggedPlayer + "/giveLead/" + playerID,
            method: "post",
            dataType: "json",
            data: JSON.stringify(teammate),
            contentType: "application/json"
        });
        createTeammatesTable(teamID, loggedPlayer);
        changeMiddleBox_Player(playerID, teamID, loggedPlayer);
    } catch (err) {
        console.log(err);
    }
}

//not using
function createNav() {
    let aux = "";
    for (let i = 0; i < arrayOfItems.length; i++) {
        aux += "<span class='navContainer' onclick='show(" + i + ")'>" + arrayOfItems[i] + "</span>";
    }
    document.getElementById("navItems").innerHTML = aux;
}
//not using
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



