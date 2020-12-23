var pool = require("../models/connection");

module.exports.getSpecificEvent= async function(index) { 
    try {
        var query = "SELECT * from Event where id_event = ?";
        const unit = await pool.query(query, index);
        console.log(query);
        return unit; 
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

