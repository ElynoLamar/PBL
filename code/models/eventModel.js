var pool = require("../models/connection");

module.exports.getSpecificEvent= async function(index) { 
    try {
        var query = "SELECT * from Event where id_event = ?";
        const event = await pool.query(query, index);
        console.log(query);
        return event; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getAllEvents= async function() { 
    try {
        var query = "SELECT name_event as name, name_field as field, date_event as date from Event, Field where Field.id_field = Event.field_event";
        const events = await pool.query(query);
        console.log(query);
        return events; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getPlayerJoinedEvents= async function(index) { 
    try {
        var query = "select id_event as id, name_event as name, name_field as field, date_event as date from Event, Field, EventMember, Player where Field.id_field=Event.field_event and Player.id_player=? and Player.id_player=EventMember.player and EventMember.event=Event.id_event  ";
        const event = await pool.query(query,index);
        console.log(query);
        return event; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getEventMembers= async function(id_event) { 
    try {
        var query = "select Player.name_player as name, Team.name_team as team from EventMember Left join Player ON EventMember.player=Player.id_player Left join Team on EventMember.team=Team.id_team Left OUTER join EventGroup ON EventMember.player = EventGroup.player where EventMember.event=? and EventGroup.player is null";
        const member = await pool.query(query,id_event);
        console.log(query);     
        return member; 
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.getEventGroupMembers= async function(id_event, groupNumber) { 
    try {
        var query = "select Player.name_player as name, Team.name_team as team from EventMember Left join Player ON EventMember.player=Player.id_player Left join Team on EventMember.team=Team.id_team Left OUTER join EventGroup ON EventMember.player = EventGroup.player where EventMember.event=? and EventGroup.groupNumber=?";
        const groupMember = await pool.query(query,[id_event, groupNumber]);
        console.log(query);     
        return groupMember; 
    } catch (err) {
        console.log(err);
        return err;
    }
}