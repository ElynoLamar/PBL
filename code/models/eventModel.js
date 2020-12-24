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
        var query = "select name_event as name, name_field as field, date_event as date from Event, Field, EventMember, Player where Field.id_field=Event.field_event and Player.id_player=? and Player.id_player=EventMember.player and EventMember.event=Event.id_event  ";
        const event = await pool.query(query,index);
        console.log(query);
        return event; 
    } catch (err) {
        console.log(err);
        return err;
    }
}
