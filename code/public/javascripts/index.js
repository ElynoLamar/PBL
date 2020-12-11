var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";

arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload=function(){
    createNav();
}

function createNav(){
    let aux="";
    for(let i=0; i<arrayOfItems.length; i++){
        aux+="<span class='navContainer' onclick='show("+i+")'>"+arrayOfItems[i]+"</span>";
    }
    document.getElementById("navItems").innerHTML = aux;
}

function show(index){
    switch(index){
        case 0:
            window.location = "index.html";
            break;
        case 1:
            window.location = "Links/team.html";
            break;
        case 2:
            window.location = "Links/event.html";
            break;
        case 3:
            window.location = "Links/map.html";
            break;
    }
}