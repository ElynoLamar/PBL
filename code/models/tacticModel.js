var pool = require("../models/connection");

module.exports.newTactics = async function(tact) {

    try {
        if (tact.event != null) {
            var query = "insert into Tactics(field,name_tactic,groupnum,event,image_tactic) values (?,?,?,?,?);";
            const tactics = await pool.query(query, [tact.field, tact.name, tact.team_or_group, tact.event, tact.image_path]);
            return { status: 200, data: tactics };
        } else {
            var query = "insert into Tactics(field,name_tactic,team,image_tactic) values (?,?,?,?);";
            const tactics = await pool.query(query, [tact.field, tact.name, tact.team_or_group, tact.image_path]);
            return { status: 200, data: tactics };
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getSpecificTact = async function(index) {
    try {
        var query = "SELECT id_tactic as id, name_field, name_tactic as name, team, image_tactic as path from Tactics, Field where id_field = Tactics.field and  id_tactic = ?";
        const tact = await pool.query(query, index);
        console.log(query);

        if (tact.length > 0) {
            return { status: 200, data: tact[0] };
        } else {
            return { status: 400, msg: 'tactic id not found' };
        }
    } catch (err) {
        return { status: 500, data: err };

    }
}
module.exports.getSpecificTactforGroup = async function(event, groupnum) {
    try {
        var query = "select image_tactic, name_tactic from Tactics, EventGroup WHERE Tactics.groupnum = EventGroup.groupNumber AND EventGroup.event = Tactics.event and EventGroup.event = ? and EventGroup.groupNumber = ? ORDER BY id_tactic DESC";
        const tact = await pool.query(query, [event, groupnum]);
        if (tact.length > 0) {
            return { status: 200, data: tact[0] };
        } else {
            return { status: 400, msg: 'one of the ids not found' };
        }
    } catch (err) {
        return { status: 500, data: err };

    }
}