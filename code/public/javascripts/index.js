/**
    var stringHome = "Home";
    var stringTeam = "Teams";
    var stringEvents = "Events";
    var stringMap = "Map";
    
    arrayOfItems=[stringHome,stringTeam, stringEvents, stringMap];
    
*/
window.onload = function() {

    createGoButtons();
}

/**
    function createNav() {
        let aux = "";
        for (let i = 0; i < arrayOfItems.length; i++) {
            aux += "<span class='navContainer' onclick='show(" + i + ")'>" + arrayOfItems[i] + "</span>";
        }
        document.getElementById("navItems").innerHTML = aux;
    }
    
*/
function createGoButtons() {
    let block = "";
    block = "<img src='images/GoButton.png'>";
    document.getElementsByClassName("buttonblackbox")[0].innerHTML = block;
    document.getElementsByClassName("buttonblackbox")[1].innerHTML = block;
    document.getElementsByClassName("buttonblackbox")[2].innerHTML = block;

}

function show(index) {
    //sessionStorage.setItem("playerid", player);
    switch (index) {
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