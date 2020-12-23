
var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";


arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload= async function(){
    let teamid = sessionStorage.getItem("id");
    createTeamUI();
    createTeammatesTable(teamid);
    createTacticsTable(teamid);
    createMiddleBox(teamid);
}

async function getTeamMembersObj(id){
   try {
        var getteammembers = await $.ajax({
            url: "../api/teams/"+id+"/members",
            method: "get",
            dataType: "json"
        });
        return getteammembers;
   } catch (err) {
       console.log(err);
   }
   
}

async function getTeamTactics(id){
    try {
         var teamtacts = await $.ajax({
             url: "../api/teams/"+id+"/tactics",
             method: "get",
             dataType: "json"
         });
         
         return teamtacts;
    } catch (err) {
        console.log(err);
    }
    
 }

 async function getPlayerInfo(player, team){
    try {
         var playerinfo = await $.ajax({
             url: "/api/players/"+player+"/team/"+team,
             method: "get",
             dataType: "json"
         });
         
         return playerinfo;
    } catch (err) {
        console.log(err);
    }
    
 }
 

  

function createTeamUI(){  
    let block="";
    block+="<span id='teamMembers'>1</span>";
    block+="<span id='actionTeamBox'>2</span>";
    block+="<span id='teamMaps'>3</span>";
    document.getElementById("teamDivItems").innerHTML = block;
}



async function createTeammatesTable(teamid){
    var teammember = await getTeamMembersObj(teamid);
    let block="";
        block+="<h1 id='titles'>Team members</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Rank</th><th>Role</th></tr>";
    for(let i = 0; i <teammember.length; i++){
        block+="<tr onclick='changeMiddleBox_Player("+teammember[i].id+","+teamid+")'><td>"+teammember[i].name+"</td><td>"+teammember[i].Ranking+"</td><td>"+teammember[i].Role+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("teamMembers").innerHTML = block;
}

async function changeMiddleBox_Player(player,team){ 
    //ARRANJAR O ROUTE, TROCAR DE PLAYER PRA TEAM
    let block = "";
    var playerinfo = await getPlayerInfo(player,team);
    block+="<h2>Player Details: </h2>";
    block+= "<span id='playerBox'>"
    block+= "<span id='playerInfo'>"
    block+="<p><img src='../images/pistol.png' height='10'> Age: "+playerinfo[0].name+"</p>";
    block+="<p><img src='../images/pistol.png' height='10'> Age: "+playerinfo[0].age+"</p>";
    block+="<p><img src='../images/pistol.png' height='10'> Team Rank: "+playerinfo[0].ranking+"</p>";
    block+="<p><img src='../images/pistol.png' height='10'> Team Role: "+playerinfo[0].role+"</p>";
    block+="<p><img src='../images/pistol.png' height='10'> email: "+playerinfo[0].email+"</p>";
    block+= "</span>"
    block+= "<span id='playerPhoto'>"
    block+="<img src='../images/"+playerinfo[0].photo+"' height='150'>";
    block+= "</span>"
    block+= "<span id='deadSpace'></span>"
    block+= "</span>"
    block+="<span id='playerDesc'><img src='../images/pistol.png' height='10'> Description: "+playerinfo[0].description+"</span>"; 
    document.getElementById("actionTeamBox").innerHTML = block;
}

async function getTeamObj(id){
    try {
         var team = await $.ajax({
             url: "/api/teams/"+id,
             method: "get",
             dataType: "json"
         });
         
         return team;
    } catch (err) {
        console.log(err);
    }
    
 }
async function createMiddleBox(teamid){
    var team = await getTeamObj(teamid);
    let block="";
    block+="<span id='playerPhoto'>";
    block+="<h2>Selected Team</h2>";
    block+="<p>Team Name:"+team[0].name_team+" </p>";
    block+="</span>";
    block+="<span id='playerPhoto'> <img src='../images/teamlogo.png' height='150'></span>";
    document.getElementById("actionTeamBox").innerHTML = block;
}

async function changeMiddleBox_Tactics(teamid, tacticmap){ 

    let block = "";
  //  block+="<h2>Tactic name:"+ tacticName+ "</h2>";
    block+="<h2>Tactic location: HEHEHE </h2>";
    block+="<h2>Team id:"+ teamid+ "</h2>";
    block+="<img src='../images/"+tacticmap+"' height='450'></img>";
    block+= "<span>";
    block+= "</span>";
    document.getElementById("actionTeamBox").innerHTML = block;
}

async function createTacticsTable(id){
    var tactics = await getTeamTactics(id);
    let block="";
    block+="<h1 id='titles'>Map tactics</h1>";
    block+="<table class='table'>";
    block+="<tr><th>Name</th><th>Field</th></tr>";
    for(let i = 0; i <tactics.length; i++){
        block+="<tr onclick=changeMiddleBox_Tactics("+id+",\'"+tactics[i].image+"\')><td>"+tactics[i].name+"</td><td>"+tactics[i].field+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("teamMaps").innerHTML = block;
}

//not using
function createNav(){
    let aux="";
    for(let i=0; i<arrayOfItems.length; i++){
        aux+="<span class='navContainer' onclick='show("+i+")'>"+arrayOfItems[i]+"</span>";
    }
    document.getElementById("navItems").innerHTML = aux;
}
//not using
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

