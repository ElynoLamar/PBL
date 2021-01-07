var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";
let loggedUser = 1;// assumir que o utilizador autenticado é o id=1

arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload=function(){
    createNav();
    createEventUI();
    createAllEventsTable();
    createMyEventsTable();
}

function createEventUI(){
    let block="";
    block+="<span id='myEvents' >1</span>";
    block+="<span id='allEvents' >2</span>";
    //modal box
    block+="<div id='myModal' class='modal'>"
    block+="</div>"
    
    //
    document.getElementById("eventDivItems").innerHTML = block;

    buildModal();

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
        block+="<h1 class='titles'>All Events</h1>";
        block+="<div class='tablediv'><table class='table'>";
        block+="<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for(let i = 0; i <events.length; i++){
        block+="<tr><td>"+events[i].name+"</td><td>"+events[i].field+"</td><td>"+events[i].date+"</td></tr>";
    }
    block+="</table></div>";
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
        block+="<h1 class='titles'>My Events</h1>";
        block+="<div class='tablediv'><table class='table'>";
        block+="<tr><th>Name</th><th>Field</th><th>Date</th></tr>";
    for(let i = 0; i <events.length; i++){
        block+="<tr onclick='changeToEventLobby("+events[i].id+")'><td>"+events[i].name+"</td><td>"+events[i].field+"</td><td>"+events[i].date+"</td></tr>";
    }
    block+="</table></div>";
    block+="<div onClick='plusClick()'>";
    block += "<img src='../images/plusIcon.png' height='100' >";
    block+="</div>";
    document.getElementById("myEvents").innerHTML = block;

}

async function getMyEventsObj(){
    let loggedUser = 1;// assumir que o utilizador autenticado é o id=8
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

//   function createNewEventForm(){
//     var popup = document.getElementById("eventForm");
//     popup.classList.toggle("show");
//   }

  //modal box
  
function plusClick(){
    
    let content = document.querySelector('#myModal');
    
        content.style.display = "block";
    
}

function buildModal(){
    let block="";
    
    block+="<div class='modal-content'>"
    block+="<div class='modal-header'>"
    block+="  <span class='close'>&times;</span>"
    block+="  <h2>Modal Header</h2>"
    block+="</div>"
    block+="<div class='modal-body'>"
    block+="  <p>Some text in the Modal Body</p>"
    block+="  <p>Some other text...</p>"
    block+="</div>"
    block+="<div class='modal-footer'>"
    block+="  <h3>Modal Footer</h3>"
    block+="</div>"
    block+="</div>"

    
    document.getElementById("myModal").innerHTML = block
}