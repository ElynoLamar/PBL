var stringMap = "Map";
var stringEvents = "Events";
var stringTeam = "Team";

arrayOfItems=[stringMap, stringEvents, stringTeam];

    window.onload=function(){
        let aux=""
        for(let i=0; i<arrayOfItems.length; i++){
            aux+="<div class='container' onclick='showStudent("+i+")'>"+arrayOfItems[i]+"</div>";
        }
        
        document.getElementById("main").innerHTML = aux;
    }
    function showStudent(index){
        switch(index){
            case 0:
                window.location = "mainPages/map.html";
            case 1:
                window.location = "mainPages/events.html";
            case 2:
                window.location = "mainPages/team.html";
        }
    }