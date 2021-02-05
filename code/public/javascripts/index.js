var counter = -1;
var loggedUser;
window.onload = function() {
    fakeLogin();
    counter = 0;
    let logo = document.getElementById('logoheader');

    let block ="";
    block+="<span id='userboxHeader' onclick='changeUser()'>";
    block+="<span id='userimageHeader'><img id='userImage' src='images/userImage.png' height='50px'></span>";
    if(typeof loggedUser !== 'undefined'){
    block+="<span id='userNameHeader'>John Doe</span>";
    }else{
    block+="<span id='userNameHeader'>Choose a User!</span>";
    }
    block+="<span id='badgeContainer'></span>";
    block+="</span>";
    document.getElementById("userBoxDiv").innerHTML = block;
    
}

function fakeLogin(id) {
    loggedUser = id;
    sessionStorage.setItem("loggedUser", loggedUser);
}

function show(index) {

    switch (index) {
        case 0:
            window.location = "index.html";
            break;
        case 1:
            window.location = "Links/map.html";
            break;
        case 2:
            window.location = "Links/event.html";
            break;
        case 3:
            window.location = "Links/team.html";
            break;
    }
}


function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return (rect.bottom < 800 || rect.top - viewHeight >= 800);
}


function onscrollCheck() {

    let logo = document.getElementById('logoheader');
    let map = document.getElementById('mapPointer');
    let events = document.getElementById('eventsPointer');
    let team = document.getElementById('teamPointer');
    let element = document.getElementById("logo");
    if (checkVisible(logo)) {
        document.getElementById("navMap").style.color = "white";
        document.getElementById("navEvents").style.color = "white";
        document.getElementById("navTeam").style.color = "white";

        if (checkVisible(map) == false && checkVisible(events) == false && checkVisible(team) == false) {
            document.getElementById("logo").innerHTML = "";
            counter = 0;

        }
    }
    if (checkVisible(map)) {
        document.getElementById("navMap").style.color = "black";
        document.getElementById("navEvents").style.color = "white";
        document.getElementById("navTeam").style.color = "white";
        if (counter == 0) {

            document.getElementById("logo").innerHTML = "<img id='miniLogo' class='run-animation' onClick='show(" + 0 + ")' onmouseover='this.src=\"../images/miniLogoHover.png\"' onmouseout='this.src=\"../images/miniLogo.png\"' src='../images/miniLogo.png'>";
            element.classList.remove("run-animation");
            void element.offsetWidth;
            element.classList.add("run-animation");
            counter++;
        }
    }
    if (checkVisible(events)) {
        document.getElementById("navMap").style.color = "white";
        document.getElementById("navEvents").style.color = "black";
        document.getElementById("navTeam").style.color = "white";

    }
    if (checkVisible(team)) {
        document.getElementById("navMap").style.color = "white";
        document.getElementById("navEvents").style.color = "white";
        document.getElementById("navTeam").style.color = "black";

    }

}

async function changeUser() {
    
    var playersinfo = await getAllPlayers();
    block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block += "<boxHeader id='choiceHeader'>";
    block += "<h1 id='choiceTitle'>Pick User:</h1>";
    block += "<span class='close' onclick='closeChangeUser()'>&times;</span>";
    block += "</boxHeader>";
    block += "<div class='centerTable'>";
    block += "<table class='table center'>";
    block += "<thead><tr><th>Choose:</th></tr></thead><tbody>";
    for (let i = 0; i < playersinfo.length; i++) {
        block += "<tr><td id='td" + i + "'><span class='allPlayerSpecificInfo' onclick='fakeLogin("+i+")'><a>" + playersinfo[i].name + "</a></span></td></tr>";
    }
    block += "</tbody></table>";
    block += "</div>";
    block += "</div></div>";
    alert(loggedUser);
    document.getElementById("badgeContainer").innerHTML = block;
    document.getElementById("badgeContainer").style.display = "block";
    
}

function closeChangeUser(){
    document.getElementById("badgeContainer").style.display = "none";
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