var pool = require("../models/connection");

module.exports.getSpecificEvent = async function(index) {
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

module.exports.getAllEvents = async function() {
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

module.exports.getPlayerJoinedEvents = async function(index) {
    try {
        var query = "select id_event as id, name_event as name, name_field as field, date_event as date from Event, Field, EventMember, Player where Field.id_field=Event.field_event and Player.id_player=? and Player.id_player=EventMember.player and EventMember.event=Event.id_event  ";
        const event = await pool.query(query, index);
        console.log(query);
        return event;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getEventMembers = async function(id_event) {
    try {
        var query = "select Player.name_player as name, Team.name_team as team from EventMember Left join Player ON EventMember.player=Player.id_player Left join Team on EventMember.team=Team.id_team Left OUTER join EventGroup ON EventMember.player = EventGroup.player where EventMember.event=? and EventGroup.player is null";
        const member = await pool.query(query, id_event);
        console.log(query);
        return member;
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.getEventGroupMembers = async function(id_event, groupNumber) {
    try {
        var query = "select Player.name_player as name, Team.name_team as team from EventMember Left join Player ON EventMember.player=Player.id_player Left join Team on EventMember.team=Team.id_team Left OUTER join EventGroup ON EventMember.player = EventGroup.player where EventMember.event=? and EventGroup.groupNumber=?";
        const groupMember = await pool.query(query, [id_event, groupNumber]);
        console.log(query);
        return groupMember;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getEventNumOfGroups = async function(id_event) {
    try {
        var query = "Select group_num from Event WHERE id_event = ?";
        const numofgroups = await pool.query(query, id_event);
        console.log(query);
        return numofgroups[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.newEvent = async function(event) {

    console.log(JSON.stringify(event));
    if (event.fieldName != null) {
        try {
            var query = "insert into Field (name_field) values(?);";
            const result2 = await pool.query(query, event.fieldName);
            let addedFieldID = result2.insertId;
            for (let i = 0; i < event.fieldlats.length; i++) {
                query = "Insert into Coordinates (field, lng, lat) values(?,?,?);";
                let result3 = await pool.query(query, [addedFieldID, event.fieldlngs[i], event.fieldlats[i]]);
            }
            query = "insert into Event(name_event, field_event, date_event, duration_event, team_size_event ,group_num, privacy) values(?,?,?,?,?,?,?);";
            const result4 = await pool.query(query, [event.name, addedFieldID, event.date, event.duration, event.teamsSize, event.groupNum, event.privacy]);
            let addedEventID = result4.insertId;
            let sql = "insert into EventMember(player, event,ranking) values(?,?,1);"
            const result1 = await pool.query(sql, [event.player, addedEventID, 1]);
            return { status: 200, data: result1 };
        } catch (err) {
            console.log(err);
            return err;
        }
    } else {
        try {
            var query = "insert into Event(name_event, field_event, date_event, duration_event, team_size_event ,group_num, privacy) values(?,?,?,?,?,?,?);";
            const result = await pool.query(query, [event.name, event.field, event.date, event.duration, event.teamsSize, event.groupNum, event.privacy]);
            console.log(query);
            let addedEventID = result.insertId;
            let sql = "insert into EventMember(player, event,ranking) values(?,?,1);"
            const result1 = await pool.query(sql, [event.player, addedEventID, 1]);

            return { status: 200, data: result };
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}