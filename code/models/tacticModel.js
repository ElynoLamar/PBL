var pool = require("../models/connection");

module.exports.newTactics = async function(tact) {
    console.log(JSON.stringify(tact));
    try {
        var query = "insert into Tactics(field,name_tactic,team,image_tactic) values (?,?,?,?);";
        const tactics = await pool.query(query, [tact.field, tact.name, tact.team_or_group, tact.image_path]);
        return { status: 200, data: tactics };
    } catch (err) {
        console.log(err);
        return err;
    }
}