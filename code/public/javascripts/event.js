var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload=function(){
    createNav();
    createEventUI();
    createAllEventsTable();
    createMyEventsTable();
}

function createEventUI(){
    let block="";
    block+="<span id='myEvents'>1</span>";
    block+="<span id='allEvents'>2</span>";
    document.getElementById("eventDivItems").innerHTML = block;
}



function createNav(){
    let aux="";
    aux+="<span class='navContainer' onclick='show(0)'>"+arrayOfItems[0]+"</span>";
    aux+="<span class='navContainer' onclick='show(1)'>"+arrayOfItems[1]+"</span>";
    aux+="<span class='clickedNavContainer' onclick='show(2)'>"+arrayOfItems[2]+"</span>";
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

async function createAllEventsTable(){
    var events = await getAllEventsObj();
    let block="";
        block+="<h1 id='titles'>All Events</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for(let i = 0; i <events.length; i++){
        block+="<tr><td>"+events[i].name+"</td><td>"+events[i].field+"</td><td>"+events[i].date+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("allEvents").innerHTML = block;
}

async function getAllEventsObj(){
    
    try {
         var getallevents = await $.ajax({
             url: "/api/events",
             method: "get",
             dataType: "json"
         });
         return getallevents;
    } catch (err) {
        console.log(err);
    }
    
 }


async function createMyEventsTable(){
    
    var events = await getMyEventsObj();
    let block="";
        block+="<h1 id='titles'>My Events</h1>";
        block+="<table class='table'>";
        block+="<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for(let i = 0; i <events.length; i++){
        block+="<tr onclick='changeToEventLobby("+events[i].id+")'><td>"+events[i].name+"</td><td>"+events[i].field+"</td><td>"+events[i].date+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("myEvents").innerHTML = block;

}

async function getMyEventsObj(){
    let loggedUser = 8;// assumir que o utilizador autenticado é o id=8
    try {
         var getmyevents = await $.ajax({
             url: "/api/events/player/"+loggedUser,
             method: "get",
             dataType: "json"
         });
         return getmyevents;
    } catch (err) {
        console.log(err);
    }
 }

 function changeToEventLobby(id) {
    sessionStorage.setItem("id",id);
    window.location = "eventLobby.html"
  }