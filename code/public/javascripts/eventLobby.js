window.onload= async function(){
    let eventid = sessionStorage.getItem("id");
    //let eventid=1;
    createNav(eventid);
    createEventLobbyUI(eventid);
}

async function createNav(eventid){
  var eventMembers = await getEventMembersObj(eventid);
  let block="";
  block+="<h1 class='titles'>Players</h1>";
  block+="<table class='table'>";
  block+="<tr><th>Name</th><th>Team</th></tr>";
  for(let i = 0; i <eventMembers.length; i++){
    
    block+="<tr><td>"+eventMembers[i].name+"</td>";
    if(eventMembers[i].team == null){
      block+="<td> N / A </td></tr>";
    }else{
      block+="<td>"+eventMembers[i].team+"</td></tr>";
    }
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

async function createEventLobbyUI(event_id){
  let block="";
  //runs 1 time for every group
  let numOfGroups=2
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
        url: "/api/events/"+id_event+"/groups/"+group_id,
        method: "get",
        dataType: "json"
    });
    return getgroupmembers;
      } catch (err) {
   console.log(err);
  }
}
