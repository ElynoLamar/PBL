window.onload= async function(){
    let eventid = sessionStorage.getItem("id");
    createNav();
    createEventLobbyUI()
   document.addEventListener('DOMContentLoaded', eventListener());
}

function createNav(){
  let block="";
  block+="<h1 class='titles'>Players</h1>";
  block+="<table class='table'>";
  block+="<tr><th>Name</th><th>Role</th><th>Team</th></tr>";
  block+="</table></span>" ;
  document.getElementById("eventlobbynav").innerHTML = block;
}

function createEventLobbyUI(){
  let block="";
  //runs 1 time for every group
  let numOfGroups=2
  for(let i = 1; i <=numOfGroups; i++){
  block+="<span class='lobbyGroup' id='group"+i+"'>";
  block+="<h1 class='titles'>Group "+i+"</h1>";
  block+="<table class='table'>";
  block+="<tr><th>Name</th><th>Role</th><th>Team</th></tr>";
  block+="</table></span>" ;
  }
  
  document.getElementById("eventlobbymain").innerHTML = block;
}

