var pool = require("../models/connection");

module.exports.newTactics = async function(tact) {

    try {
        var query = "insert into Tactics(field,name_tactic,team,image_tactic) values (?,?,?,?);";
        const tactics = await pool.query(query, [tact.field, tact.name, tact.team_or_group, tact.image_path]);
        return { status: 200, data: "SUCESS!" };
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getSpecificTact = async function(index) {
    try {
        var query = "SELECT id_tactic as id, field, name_tactic as name, team, image_tactic as path from Tactics where id_tactic = ?";
        const tact = await pool.query(query, index);
        console.log(query);
        return tact[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}