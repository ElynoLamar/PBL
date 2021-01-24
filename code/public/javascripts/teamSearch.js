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