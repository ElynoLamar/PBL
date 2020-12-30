var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
let loggedUser = 3;// assumir que o utilizador autenticado é o id=8

arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload= async function(){
    
    createNav();
    createTeamUI();
    createAllTeamsTable(loggedUser);
    createMyTeamsTable(loggedUser);
}



function createNav(){
    let aux="";
    aux+="<span class='navContainer' onclick='show(0)'>"+arrayOfItems[0]+"</span>";
    aux+="<span class='clickedNavContainer' onclick='show(1)'>"+arrayOfItems[1]+"</span>";
    aux+="<span class='navContainer' onclick='show(2)'>"+arrayOfItems[2]+"</span>";
    aux+="<span class='navContainer' onclick='show(3)'>"+arrayOfItems[3]+"</span>";
    document.getElementById("navItems").innerHTML = aux;
}

function show(index){
    switch(index){
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
function changeToClickedTeam(id) {
    sessionStorage.setItem("id",id);
    window.location = "selectedTeam.html"
  }
function createTeamUI(){
    let block="";
    block+="<span id='myTeams'>1</span>";
    block+="<span id='MiddleBox'></span>";
    block+="<span id='allTeams'>2</span>";
    document.getElementById("teamDivItems").innerHTML = block;
}

async function getAllTeamsObj(){
    
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

 async function getMyTeamsObj(player){
    
    try {
         var getmyteams = await $.ajax({
             url: "/api/players/"+player+"/teams",
             method: "get",
             dataType: "json"
         });
         return getmyteams;
    } catch (err) {
        console.log(err);
    }
 }

 async function createAllTeamsTable(player){
    
    var teams = await getAllTeamsObj();
    let block="";
        block+="<h1 id='titles'>All Teams</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Description</th></tr>";
    for(let i = 0; i <teams.length; i++){
        block+="<tr onclick='joinTeamForm("+teams[i].id+","+player+")'><td>"+teams[i].name+"</td><td>"+teams[i].description+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("allTeams").innerHTML = block;

}


async function createMyTeamsTable(player){
    
    var teams = await getMyTeamsObj(player);
    let block="";
        block+="<h1 id='titles'>My Teams</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Description</th></tr>";
    for(let i = 0; i <teams.length; i++){
        block+="<tr onclick='changeToClickedTeam("+teams[i].id+")'><td>"+teams[i].name+"</td><td>"+teams[i].description+"</td></tr>";
    }
    block+="</table>";
    block+="CREATE A NEW TEAM";
    block+="<img src='../images/plusIcon.png' height='100' onclick='createNewTeamForm("+player+")'>";
    document.getElementById("myTeams").innerHTML = block;

}

async function createNewTeam(playerID){
    try {
        let team = {
            name: document.getElementById("cteamName").value,
            desc: document.getElementById("cteamDesc").value
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
    createAllTeamsTable(playerID);
    createMyTeamsTable(playerID);
    closeMiddleBox();
}

function createNewTeamForm() {
    closeMiddleBox();
    let block="";
    block+="<form class='form-container'>";
    block+="<h1>Create a new Team</h1>";
    block+=" <label><b>Team name</b></label>";
    block+="<input type='text' placeholder='Enter Team Name' id='cteamName' required>";
    block+=" <label><b>Team Description</b></label>";
    block+=" <input type='text' placeholder='Enter Team Description' id='cteamDesc'>";
    block+=" <button type='button' class='btn' onclick='createNewTeam()'>Create</button>";
    block+="  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block+="</form>";
    block+="</div>";
    document.getElementById("MiddleBox").innerHTML = block;
  }
  
function closeMiddleBox() {
    document.getElementById("MiddleBox").innerHTML = "";
}


async function joinTeam(teamID,playerID){
    try {
        let newMember = {
            player: playerID,
            team: teamID,
            ranking: 10,
            role: 1
        }
        
        let result = await $.ajax({
            url: "/api/teams/"+teamID+"/members",
            method: "post",
            dataType: "json",
            data: JSON.stringify(newMember),
            contentType: "application/json"
        });
        alert(JSON.stringify(result));
        } catch (err) {
            console.log(err);
        }  
        closeMiddleBox();      
}
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
async function getSpecificTeamObj(id){
    
    try {
         var getTeam = await $.ajax({
             url: "/api/teams/"+id,
             method: "get",
             dataType: "json"
         });
         return getTeam;
    } catch (err) {
        console.log(err);
    } 
}
async function joinTeamForm(id,player) {
    closeMiddleBox();
    var team = await getSpecificTeamObj(id);
    let block="";
    block+="<form class='form-container'>";
    block+="<h1>Join this team?</h1>";
    block+=" <label><b>Team name: "+team.name+" </b></label>";
    block+=" <label><b>Team Description: "+team.description+" </b></label>";
    block+=" <button type='button' class='btn' onclick='joinTeam("+id+","+player+")'>Join</button>";
    block+="  <button type='button' class='btn cancel' onclick='closeMiddleBox()'>Cancel</button>";
    block+="</form>";
    block+="</div>";
    document.getElementById("MiddleBox").innerHTML = block;
  }