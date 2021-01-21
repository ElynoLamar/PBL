var numOfGroups=0;

let loggedUser = 2; // assumir que o utilizador autenticado é o este id
window.onload= async function(){
    let eventid = sessionStorage.getItem("id");
    let group= await getEventGroups(eventid);
    numOfGroups = group.group_num;
    notifButton(loggedUser);
    createNav(eventid);
    createEventLobbyUI(eventid);
}

async function createNav(eventid){
  var eventMembers = await getEventMembersObj(eventid);
  let block="";
  block+="<h1 class='titles' id='navTitle'>Players <img class='plusimage' onClick='showPlayers("+eventid+","+ loggedUser+")' onmouseover='this.src=\"../images/plusHover.png\"' onmouseout='this.src=\"../images/plus.png\"' src='../images/plus.png' height='50vh;' ></h1>";
  block+="<table class='table'>";
  block+="<tr><th>Name</th><th>Team</th><th>Add</th></tr>";
  for(let i = 0; i <eventMembers.length; i++){
    
    block+="<tr><td>"+eventMembers[i].name+"</td>";
    if(eventMembers[i].team == null){
      block+="<td> N / A </td>";
    }else{
      block+="<td>"+eventMembers[i].team+"</td>";
    }
    block+="<td><div id='buttonCell' onClick='createGroupChoiceUI("+i+")'>";
    block += "<img src='../images/plus-sign.png' height='50'>"
    block+="</tr>";
  }
  block+="</table>" ;
  document.getElementById("eventlobbynav").innerHTML = block;
}

async function getEventMembersObj(id_event){
  try {
    var geteventmembers = await $.ajax({
        url: "/api/events/"+id_event+"/players",
        method: "get",
        dataType: "json"
    });
    return geteventmembers;
      } catch (err) {
   console.log(err);
  }
}

function show(index) {
  switch (index) {
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

async function createEventLobbyUI(event_id){
  let block="";
  block+="<div id='ChoiceBox' ></div></td>";
  block+="<div id='PlayerBox' ></div></td>";
  for(let i = 1; i <=numOfGroups; i++){
    let groupMembers = await getGroupMembersObj(event_id, i);
    block+="<span class='lobbyGroup' id='group"+i+"'>";
    block+="<h1 class='titles'>Group "+i+"</h1>";
    block+="<div class='tablediv'><table class='table'>";
    block+="<tr><th>Name</th><th>Team</th></tr>";
    for(let i = 0; i <groupMembers.length; i++){
      block+="<tr><td>"+groupMembers[i].name+"</td><td>"+groupMembers[i].team+"</td></tr>";
    }
    block+="</table></div></span>" ;
  }
  
  document.getElementById("eventlobbymain").innerHTML = block;
}

async function getGroupMembersObj(id_event, group_id){
  try {
    var getgroupmembers = await $.ajax({
        url: "/api/events/"+id_event+"/groups/"+group_id+"/members",
        method: "get",
        dataType: "json"
    });
    return getgroupmembers;
      } catch (err) {
   console.log(err);
  }
}

async function createGroupChoiceUI(eventMember){
   eventMember=eventMember+1;
    let block = "";
    block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block+="<boxHeader id='choiceHeader'>";
    block+="<h1 id='choiceTitle'>Choose a Group!</h1>";
    block+="<span class='close' onclick='closeChoice()'>&times;</span>";
    block+="</boxHeader>";
    
        for (let i = 1; i <= numOfGroups; i++) {
        block += "<div onClick=insertIntoGroup("+i+")>Group " + i;
        block +="<div class='accept'>✔</div>";
        block += "</div>";
    }
  
    block += "</div>";
    block += "</div>";
    document.getElementById("ChoiceBox").innerHTML = block;
}

function insertIntoGroup(groupNum){

}


function closeChoice() {
  document.getElementById("ChoiceBox").innerHTML = "";
}

async function getEventGroups(event_id){
    
    try {
         var numofgroups = await $.ajax({
             url: "/api/events/"+event_id+"/numofgroups",
             method: "get",
             dataType: "json"
         });
         return numofgroups;
    } catch (err) {
        console.log(err);
    }
    
 }

async function showPlayers(eventid, player){
  var playersinfo = await getAllPlayers();
  block="";
  block += "<div  class='form-container'>";
    block += "<div class='form-content'>";
    block+="<boxHeader id='choiceHeader'>";
    block+="<h1 id='choiceTitle'>All players:</h1>";
    block+="<span class='close' onclick='closePlayers()'>&times;</span>";
    block+="</boxHeader>";
  block += "<span id='allPlayerInfo'>";
  for (let i = 0; i < playersinfo.length; i++) {
      block += "<span class='allPlayerSpecificInfo'><a>" + playersinfo[i].name + "</a><div class='invite' onclick=createNewInvite(" + eventid + "," + playersinfo[i].id + "," + player + ")>Invite</div></span>";
  }
  block += "</div></div>";
  document.getElementById("PlayerBox").innerHTML = block;
}

function closePlayers() {
  document.getElementById("PlayerBox").innerHTML = "";
}

async function createNewInvite(teamID, clickedPlayerID, loggedPlayer) {
    
  var event = await getTeamObj(teamID);

  try {
      let newInvite = {
          playerRec: clickedPlayerID,
          playerSend: player.id,
          team: team.id,
          text: "You have been invited to " + event.name + " event"
      }
     
// AQUI AJUDA WHAT BRO? FAZER INVITE PARA EVENTO

      let result = await $.ajax({
          url: "/api/notifications/team/" + teamID + "/player/" + clickedPlayerID,
          method: "post",
          dataType: "json",
          data: JSON.stringify(newInvite),
          contentType: "application/json"
      });
  } catch (err) {
      console.log(err);
  }
}

async function getEventObj(id) {
  try {
      var team = await $.ajax({
          url: "/api/events/" + id,
          method: "get",
          dataType: "json"
      });
      return team;
  } catch (err) {
      console.log(err);
  }
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
