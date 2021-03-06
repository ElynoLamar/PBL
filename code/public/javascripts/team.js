var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
var loggedUser;
arrayOfItems = [stringHome, stringTeam, stringEvents, stringMap];

window.onload = async function() {
    loggedUser = sessionStorage.getItem("loggedUser");
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
        case 4:
            window.location = "teamSearch.html";
            break;
    }
}

function createChoice() {
    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Create / Search</h1>";
    block += "<span id='choiceClose' class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";

    block += "<div class='aceptBox' onClick='createNewTeamForm(); closeChoice()'";
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

function changeToClickedTeam(team, player) {
    array = [team, player]
    sessionStorage.setItem("teamAndLoggedUserID", JSON.stringify(array));
    window.location = "selectedTeam.html"
}

function createTeamUI() {
    let block = "";
    block += "<span id='myTeams'>1</span>";
    block += "<span id='MiddleBox'></span>";
    block += "<div id='ChoiceBox' ></div></td>";
    block += "<span id='pluscontainer'><img onclick='createChoice()' id='plus' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png'><span id='plusText'><p>create team</p><p>search team</p></span></span>";
    document.getElementById("teamDivItems").innerHTML = block;
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

function createNewTeamForm() {
    let block = "";
    block += "<form class='form-container'>";
    block += "<div class='form-content'>";

    block += "  <span class='close' onclick='closeMiddleBox()'>&times;</span>"
    block += "<h1>Create a new Team</h1>";
    block += " <label><b>Team name</b></label>";
    block += "<input type='text' placeholder='Enter Team Name' id='cteamName' required>";
    block += " <label><b>Team Description</b></label>";
    block += " <input type='text' placeholder='Enter Team Description' id='cteamDesc'>";
    block += " <label><b>Choose your team privacy</b></label><br>";
    block += "<div class='radioDiv'><input type='radio' id='openTeam' name='privacy' value='openTeam'></div>";
    block += "<label for='openTeam'>Open team, anyone can join</label><br>";
    block += "<div class='radioDiv'><input type='radio' id='privateTeam' name='privacy' value='privateTeam'></div>";
    block += "<label for='privateTeam'>Private, requires autorization to join</label><br><br>";
    block += " <button type='button' class='btn' onclick='createNewTeam(" + loggedUser + ")'>Create</button>";
    block += "  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block += "</form>";
    block += "</div>";
    document.getElementById("MiddleBox").innerHTML = block;

}

async function createNewTeam(playerID) {

    let teamName = document.getElementById("cteamName");
    let teamDesc = document.getElementById("cteamDesc");

    let publicRadio = document.getElementById("openTeam");

    let privateRadio = document.getElementById("privateTeam");

    if ((teamName.value.length > 0 && teamName.value.length <= 30) && (teamDesc.value.length > 0 && teamDesc.value.length <= 250) && (publicRadio.checked || privateRadio.checked)) {

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
        createMyTeamsTable(playerID);
        closeMiddleBox();
    } else {
        if (!(teamName.value.length > 0 && teamName.value.length <= 30)) {
            teamName.style.borderColor = "red";
        } else {
            teamName.style.borderColor = "black";
        }

        if (!(teamDesc.value.length > 0 && teamDesc.value.length <= 30)) {
            teamDesc.style.borderColor = "red";
        } else {
            teamDesc.style.borderColor = "black";
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
    }



}

function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}




function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
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