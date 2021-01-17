
window.onload = function() {
   let logo = document.getElementById('logoheader');
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


function onscrollCheck(){
    let logo = document.getElementById('logoheader');
    let map = document.getElementById('mapPointer');
    let events = document.getElementById('eventsPointer');
    let team = document.getElementById('teamPointer');
      if(checkVisible(logo)){
        document.getElementById("navMap").style.color="white";
        document.getElementById("navEvents").style.color="white";
        document.getElementById("navTeam").style.color="white";
      }
      if(checkVisible(map)){
        document.getElementById("navMap").style.color="black";
        document.getElementById("navEvents").style.color="white";
        document.getElementById("navTeam").style.color="white";
      }
      if(checkVisible(events)){
        document.getElementById("navMap").style.color="white";
        document.getElementById("navEvents").style.color="black";
        document.getElementById("navTeam").style.color="white";
      }
      if(checkVisible(team)){
        document.getElementById("navMap").style.color="white";
        document.getElementById("navEvents").style.color="white";
        document.getElementById("navTeam").style.color="black";
      }

  }
