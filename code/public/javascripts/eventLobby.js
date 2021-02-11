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
    eventDetails(eventid);


}

async function createNav(eventid) {
    var eventMembers = await getEventMembersObj(eventid);
    let thisPlayer = await getSpecificEventMembersObj(eventid);
    let block = "";
    block += "<h1 class='titles' id='navTitle'>Players";
    if (thisPlayer.ranking == 1) {
        block += "<img class='plusimage' onClick='showPlayers()' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png' height='50vh;' >";
    } else if (typeof thisPlayer.ranking === 'undefined') {
        block += "<span></span>";
    }
    block += "</h1>";
    block += "<table class='table'>";
    block += "<tr><th>Name</th><th>Team</th>";

    block += "</tr>";
    for (let i = 0; i < eventMembers.length; i++) {
        if (eventMembers[i].id == loggedUser) {
            block += "<tr><td> You </td>";
        } else
            block += "<tr><td>" + eventMembers[i].name + "</td>";
        if (eventMembers[i].team == null) {
            block += "<td> N / A </td>";
        } else {
            block += "<td>" + eventMembers[i].team + "</td>";
        }

        if (thisPlayer.ranking == 1) {

            block += "<td><div id='buttonCell' onClick='createGroupChoiceUI(" + eventMembers[i].id + ")'>";
            block += "<img src='../images/plus-sign.png' height='50'></td>";
        } else if (typeof thisPlayer.ranking === 'undefined') {
            block += "<span></span>";
        }
        block += "</tr>";
    }
    block += "</table>";
    document.getElementById("eventlobbynav").innerHTML = block;
}

async function getSpecificEventMembersObj(id_event) {
    try {
        var geteventmember = await $.ajax({
            url: "/api/events/" + id_event + "/players/" + loggedUser,
            method: "get",
            dataType: "json"
        });
        return geteventmember;
    } catch (err) {
        console.log(err);
    }
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
    let thisPlayer = await getSpecificEventMembersObj(event_id);
    let block = "";
    block += "<div id='ChoiceBox' ></div></td>";
    block += "<div id='PlayerBox' ></div></td>";
    block += "<span id='groupDiv'>";
    for (let j = 1; j <= numOfGroups; j++) {
        let groupMembers = await getGroupMembersObj(event_id, j);
        block += "<span class='lobbyGroup' id='group" + j + "'>";
        block += "<h1 class='titles'>Group " + j + "</h1>";
        block += "<div class='tablediv'>  <table class='table'>";
        block += "<tr><th>Name</th><th>Team</th></tr>";
        for (let i = 0; i < groupMembers.length; i++) {
            if (groupMembers[i].team == null) {

                block += "<tr ";
                if (thisPlayer.ranking == 1) {
                    block += "onclick='removeOrMakeLeader(" + groupMembers[i].id_player + "," + j + ")'"
                } else if (typeof thisPlayer.ranking === 'undefined') {
                    block += "<span></span>";
                }
                block += "><td>";
                if (groupMembers[i].ranking == 1) {
                    block += "(Leader) ";
                } else {
                    block += "<span></span>";
                }
                if (groupMembers[i].id_player == loggedUser) {
                    block += "You </td><td> N / A </td></tr> ";
                } else block += "" + groupMembers[i].name_player + " </td><td> N / A </td></tr> ";
            } else {
                let membersTeam = await getTeamObj(groupMembers[i].team);
                block += "<tr ";
                if (thisPlayer.ranking == 1) {
                    block += "onclick='removeOrMakeLeader(" + groupMembers[i].id_player + "," + j + ")'"
                } else if (typeof thisPlayer.ranking === 'undefined') {
                    block += "<span></span>";
                }
                block += "><td>";
                if (groupMembers[i].ranking == 1) {
                    block += "(Leader) ";
                } else {
                    block += "<span></span>";
                }

                if (groupMembers[i].id_player == loggedUser) {
                    block += "You </td><td>" + membersTeam.name + "</td></tr>";
                } else block += "" + groupMembers[i].name_player + "</td><td>" + membersTeam.name + "</td></tr>";

            }

            if (groupMembers[i].ranking == 1 && loggedUser == groupMembers[i].id_player) {
                block += "<img id='edit' onClick='show(" + 4 + ")' onmouseover='this.src=\"../images/editHover.png\"' onmouseout='this.src=\"../images/edit.png\"' src='../images/edit.png'>";
            }
            if (loggedUser == groupMembers[i].id_player) {
                block += "<img id='mapIcon' onClick='showTacticOfGroup(" + j + ")' onmouseover='this.src=\"../images/mapIcon.png\"' onmouseout='this.src=\"../images/mapIcon.png\"' src='../images/mapIcon.png'>";
            }
        }

        block += "</table></div></span>";

    }
    document.getElementById("eventlobbymain").innerHTML = block;
}
async function getTacticOfGroup(groupnum) {
    try {
        var tact = await $.ajax({
            url: "/api/tactics/events/" + eventid + "/groups/" + groupnum,
            method: "get",
            dataType: "json"
        });
        return tact;
    } catch (err) {
        console.log(err);
    }
}
async function showTacticOfGroup(groupnum) {
    let tactic = await getTacticOfGroup(groupnum);

    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Your groups Tactic!</h1>";

    block += "<span class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";
    if (tactic != null) {
        block += "<h2> Tactic name: " + tactic.name_tactic + "</h2>";
        block += "<img src=\"" + tactic.image_tactic + "\" height='350'></img>";
    } else {
        block += "<h2>No tactic has been created yet.</h2>";
    }


    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

function removeOrMakeLeader(eventMember, group) {

    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Make leader <br>or <br>Remove from group</h1>";
    block += "<span class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";

    block += "<div onClick=makeLeaderofGroup(" + eventMember + "," + group + ")> Make this player leader of the group";
    block += "<div class='accept'>✔</div>";
    block += "</div>";
    block += "<div onClick=removeFromGroup(" + eventMember + ")> Remove this player from this group";
    block += "<div class='accept'>✔</div>";
    block += "</div>";

    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

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
    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Choose a Group!</h1>";
    block += "<span class='close' onclick='closeChoice()'>&times;</span>";
    block += "</boxHeader>";
    block += "<div id='overflowgroupdiv'>";
    for (let i = 1; i <= numOfGroups; i++) {
        block += "<div onClick=insertIntoGroup(" + i + "," + eventMember + ")>Group " + i;
        block += "<div class='accept'>✔</div>";
        block += "</div>";
    }
    block += "</div>";

    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

async function makeLeaderofGroup(eventMember, group) {

    try {
        let result = await $.ajax({
            url: "/api/events/" + eventid + "/players/" + eventMember + "/group/" + group + "/leader",
            method: "put",
            dataType: "json"
        });
        location.reload();

    } catch (err) {
        console.log(err);
    }

}
async function removeFromGroup(eventMember) {

    try {
        let result = await $.ajax({
            url: "/api/events/" + eventid + "/players/" + eventMember + "/group",
            method: "delete",
            dataType: "json"
        });
        location.reload();

    } catch (err) {
        console.log(err);
    }

}
async function insertIntoGroup(groupNum, eventMember) {

    try {
        let newGroupMember = {
            event: eventid,
            player: eventMember,
            group: groupNum
        }
        console.log(JSON.stringify(newGroupMember));
        let result = await $.ajax({
            url: "/api/events/group",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newGroupMember),
            contentType: "application/json"
        });
        location.reload();

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

async function showPlayers() {
    var playersinfo = await getAllPlayers();
    block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>All players:</h1>";
    block += "<input type='button' value='inviteWholeTeam' onclick='inviteWholeTeamDiv()'></input>";
    block += "<span class='close' onclick='closePlayers()'>&times;</span>";
    block += "</boxHeader>";
    block += "<div class='centerTable'>";
    block += "<table class='table center'>";
    block += "<thead><tr><th>INVITE:</th></tr></thead><tbody>";
    for (let i = 0; i < playersinfo.length; i++) {
        block += "<tr><td id='td" + i + "'><span class='allPlayerSpecificInfo' onclick=createNewInvite(" + eventid + "," + playersinfo[i].id + "," + null + "," + i + ")><a>" + playersinfo[i].name + "</a></span></td></tr>";
    }
    block += "</tbody></table>";
    block += "</div>";
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

/**
    async function createNewInvite(eventID, clickedPlayerID, rowID) {
    
        var event = await getEventObj(eventID);
        var player = await getPlayer(loggedUser);
        alert(rowID)
        alert(clickedPlayerID);
        try {
            let newInvite = {
                playerRec: clickedPlayerID,
                playerSend: player.id,
                event: event.id,
                team: null,
                text: "You have been invited to '" + event.name + "' event by the player: '" + player.name + "'"
            }
            alert(JSON.stringify(newInvite));
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
*/

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
    block += "<table class='table center'>";
    block += "<thead><tr><th>INVITE:</th></tr></thead><tbody>";
    for (let i = 0; i < teams.length; i++) {
        block += "<tr><td id='teamtd" + i + "'><span class='allPlayerSpecificInfo' onclick='inviteWholeTeam(" + teams[i].id + "," + i + ")'><a>" + teams[i].name + "</a></span></td></tr>";
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
    let teamMember = await getTeamMembersObj(teamID);

    for (let i = 0; i < teamMember.length; i++) {
        createNewInvite(eventid, teamMember[i].id, teamID);
    }
}

async function createNewInvite(eventID, clickedPlayerID, teamID, rowID) {

    var event = await getEventObj(eventID);
    var player = await getPlayer(loggedUser);
    try {
        if (teamID != null) {

            let newInvite = {
                playerRec: clickedPlayerID,
                playerSend: player.id,
                event: event.id,
                team: teamID,
                text: "You have been invited to '" + event.name + "' event by the player: '" + player.name + "'"
            }
        } else {

            let newInvite = {
                playerRec: clickedPlayerID,
                playerSend: player.id,
                event: event.id,
                text: "You have been invited to '" + event.name + "' event by the player: '" + player.name + "'"
            }
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

async function eventDetails(eventID) {
    var event = await getEventSettingsObj(eventID);

    let block = "";
    block += "<span id='eventDef'>"
    block += "<h3>Event Settings:</h3>";
    block += "<a>   <img src='../images/pistol.png' height='10'> Name: " + event.name + "</a><br>";
    block += "<a>   <img src='../images/pistol.png' height='10'> Field: " + event.field + "</a><br>";
    block += "<a>   <img src='../images/pistol.png' height='10'> Date: " + event.date + "            </a>";
    block += "<a>    Duration:  " + event.duration + "</a><br>";
    block += "<a>   <img src='../images/pistol.png' height='10'> Number of groups:  " + event.group_num + "       </a>";
    block += "<a>   Number of players per group:  " + event.team_size_event + "</a><br>";
    block += "<a>   <img src='../images/pistol.png' height='10'> Event Owner:  " + event.name_player + "       </a>";
    block += "<a>   Email:  " + event.email_player + "</a>";
    block += "</span>"

    document.getElementById("articleEL").innerHTML = block;
}