var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload= async function(){
    createNav();
    createTeamUI();
    createAllTeamsTable();
    createMyTeamsTable();
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

 async function getMyTeamsObj(){
    let loggedUser = 2;// assumir que o utilizador autenticado é o id=2
    try {
         var getmyteams = await $.ajax({
             url: "/api/players/"+loggedUser+"/teams",
             method: "get",
             dataType: "json"
         });
         return getmyteams;
    } catch (err) {
        console.log(err);
    }
    
 }

 async function createAllTeamsTable(){
    
    var teams = await getAllTeamsObj();
    let block="";
        block+="<h1 id='titles'>All Teams</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Description</th></tr>";
    for(let i = 0; i <teams.length; i++){
        block+="<tr><td>"+teams[i].name+"</td><td>"+teams[i].description+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("allTeams").innerHTML = block;

}


async function createMyTeamsTable(){
    
    var teams = await getMyTeamsObj();
    let block="";
        block+="<h1 id='titles'>My Teams</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Description</th></tr>";
    for(let i = 0; i <teams.length; i++){
        block+="<tr onclick='changeToClickedTeam("+teams[i].id+")'><td>"+teams[i].name+"</td><td>"+teams[i].description+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("myTeams").innerHTML = block;

}