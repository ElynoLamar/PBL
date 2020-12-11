var team = [
    {   
        name: "GangGang", 
        id: 1,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"ezpz",rank:"Initiate",role:"Tech"}
        ]
    },
    {   
        name: "GangGang1", 
        id: 2,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"ezpz",rank:"Initiate",role:"Tech"}
        ]
    },
    {   
        name: "GangGang2", 
        id: 3,
        teammate:[
            {id:1,name:"swagmaster",rank:"BOSS",role:"Sniper"},
            {id:2,name:"Trollolol",rank:"Initiate",role:"Medic"},
            {id:3,name:"swagmaster",rank:"Initiate",role:"Tech"}
        ]
    },
];
var stringHome = "Home";
var stringTeam = "Teams";
var stringEvents = "Events";
var stringMap = "Map";


arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];

window.onload=function(){
    createTeamUI();
    createTeammatesTable();
    createMapsTable();

}



  

function createTeamUI(){
    let block="";
    block+="<span id='teamMembers'>1</span>";
    block+="<span id='actionTeamBox'>2</span>";
    block+="<span id='teamMaps'>3</span>";
    document.getElementById("teamDivItems").innerHTML = block;
}


function createTeammatesTable(){
    let block="";
    block+="<h1 id='titles'>Team members</h1>";
    block+="<table class='table'>";
    block+="<tr><th>Name</th><th>Rank</th><th>Role</th></tr>";
    for(let i=0;i<team[1].teammate.length;i++){
        block+="<tr><td>"+team[1].teammate[i].name+"</td><td>"+team[1].teammate[i].rank+"</td><td>"+team[1].teammate[i].role+"</td></tr>";
    }
    block+="</table>";
    document.getElementById("teamMembers").innerHTML = block;
}

function createMapsTable(){
    let block="";
    block+="<h1 id='titles'>Map tactics</h1>";
    block+="<table class='table'>";
    block+="<tr><th>Name</th><th>Date</th><th>Local</th></tr>";
    block+="<tr><td>blabla[i].name</td><td>blabla[i].Date</td><td>blabla[i].Local</td></tr>";
    block+="<tr><td>blabla[i].name</td><td>blabla[i].Date</td><td>blabla[i].Local</td></tr>";
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