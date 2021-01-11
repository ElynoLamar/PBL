var numOfGroups=0;

window.onload= async function(){
    let eventid = sessionStorage.getItem("id");
    let group= await getEventGroups(eventid);
    numOfGroups = group.group_num;

    createNav(eventid);
    createEventLobbyUI(eventid);
}

async function createNav(eventid){
  var eventMembers = await getEventMembersObj(eventid);
  let block="";
  block+="<h1 class='titles'>Players</h1>";
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
    block += "<img src='../images/plus-sign.png' height='50'><span class='badge'>3</span>"
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

async function createEventLobbyUI(event_id){
  let block="";
  block+="<div id='ChoiceBox' ></div></td>";
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
        block +="<div class='accept'>✔</div>"
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
