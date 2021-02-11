var pool = require("../models/connection");

module.exports.getSpecificEvent = async function(index) {
    try {
        var query = "SELECT id_event as id, name_event as name, field_event as field, date_event as date, duration_event as duration, team_size_event as team_size, group_num, privacy from Event where id_event = ?";
        const event = await pool.query(query, index);
        console.log(query);
        return event[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getAllEvents = async function() {
    try {
        var query = "SELECT id_event as id, name_event as name, name_field as field, date_event as date from Event, Field where Field.id_field = Event.field_event";
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
        var query = " select Player.name_player as name, EventMember.ranking as ranking, EventMember.player as id, EventMember.event as event, Team.name_team as team " +
            " from EventMember" +
            " Left join EventGroup ON EventMember.player = EventGroup.player and EventMember.event = EventGroup.event " +
            " Left join Team on EventMember.team=Team.id_team " +
            " Left join Player on EventMember.player=Player.id_player" +
            " where EventGroup.player is null and EventMember.event=?";
        const member = await pool.query(query, id_event);
        console.log(query);
        return member;
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.getspecificEventMember = async function(id_event, playerid) {
    try {
        var query = "select EventMember.ranking as ranking, EventMember.player as id, EventMember.event as event, EventMember.team as team from EventMember where EventMember.event=? and EventMember.player= ? order by EventMember.player";
        const member = await pool.query(query, [id_event, playerid]);
        console.log(query);
        return member[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.getEventGroupMembers = async function(id_event, groupNumber) {
    try {
        var query = "select Player.id_player, EventGroup.ranking, Player.name_player, EventMember.team from Player, EventGroup , EventMember where EventGroup.event = EventMember.event and EventGroup.player = EventMember.player and EventMember.player = Player.id_player and EventGroup.event =?  AND EventGroup.groupNumber=? order by Player.id_player ;";
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

module.exports.insertPlayerIntoGroup = async function(newGroupMember) {
    try {
        var query = "insert into EventGroup (groupNumber,player,event,ranking) values(?,?,?,?);";
        const result2 = await pool.query(query, [newGroupMember.group, newGroupMember.player, newGroupMember.event, 2]);
        return { status: 200, data: result2 };
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.removePlayerFromGroup = async function(eventid, playerid) {
    try {
        var query = "DELETE FROM EventGroup WHERE EventGroup.event = ? AND EventGroup.player = ?;";
        const result2 = await pool.query(query, [eventid, playerid]);
        return { status: 200, data: result2 };
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.newEventMember = async function(newMember) {
    try {
        var query = "insert into EventMember(player, event,ranking) values(?, ?, ?);";
        const result = await pool.query(query, [newMember.player, newMember.event, newMember.ranking]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.getEventsOnField = async function(fieldID) {
    try {
        var query = "select id_event as id, name_event as name, date_event as date , duration_event as duration, team_size_event as numOfTeams, group_num from Event , Field where Event.field_event = Field.id_field and id_field = ?;";
        const result = await pool.query(query, [fieldID]);
        console.log(query);
        return result;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getSpecificEventSettings = async function(eventid) {
    try {
        var query = "select id_event as id, name_event as name, name_field as field, date_event as date, duration_event as duration, team_size_event, group_num, privacy, name_player, email_player from Player, EventMember, Event, Field where Field.id_field = Event.field_event and EventMember.event= Event.id_event and EventMember.player = Player.id_player and EventMember.ranking = 1 and Event.id_event = ?;";
        const event = await pool.query(query, eventid);
        console.log(query);
        return event[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.setGroupLeader = async function(eventid, playerid, group) {
    try {
        var query = "UPDATE EventGroup SET ranking = 2 where EventGroup.event = ? and EventGroup.groupNumber = ?;";
        const result1 = await pool.query(query, [eventid, group]);
        query = "UPDATE EventGroup SET ranking = 1 where EventGroup.event = ? and EventGroup.groupNumber = ? and EventGroup.player = ?;";
        const result2 = await pool.query(query, [eventid, group, playerid]);
        return { status: 200, data: result2 };
    } catch (err) {
        console.log(err);
        return err;
    }
}