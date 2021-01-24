var counter=-1;
var loggedUser;
window.onload = function() {
   fakeLogin();
   counter=0;
   let logo = document.getElementById('logoheader');
   
}

function fakeLogin(){
  loggedUser=3;
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


function onscrollCheck(){
    
    let logo = document.getElementById('logoheader');
    let map = document.getElementById('mapPointer');
    let events = document.getElementById('eventsPointer');
    let team = document.getElementById('teamPointer');
    let element = document.getElementById("logo");
      if(checkVisible(logo)){
        document.getElementById("navMap").style.color="white";
        document.getElementById("navEvents").style.color="white";
        document.getElementById("navTeam").style.color="white";
        
        if(checkVisible(map)==false && checkVisible(events)==false && checkVisible(team)==false){
          document.getElementById("logo").innerHTML = "";
          counter=0;
        
        }
      }
      if(checkVisible(map)){
        document.getElementById("navMap").style.color="black";
        document.getElementById("navEvents").style.color="white";
        document.getElementById("navTeam").style.color="white";
        if(counter==0){
          
          document.getElementById("logo").innerHTML = "<img id='miniLogo' class='run-animation' onClick='show("+0+")' onmouseover='this.src=\"../images/miniLogoHover.png\"' onmouseout='this.src=\"../images/miniLogo.png\"' src='../images/miniLogo.png'>";
          element.classList.remove("run-animation");
          void element.offsetWidth;
          element.classList.add("run-animation");
          counter++;
        }
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
