var pool = require("../models/connection");

module.exports.test=  function(){
    return "teste";
}

module.exports.getSpecificTeam= async function(index) { 
    try {
        var query = "SELECT * from Team where id_team = ?";
        const unit = await pool.query(query, index);
        console.log(query);
        return unit; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getAllTeams= async function() { 
    try {
        var query = "SELECT * from Team";
        const teams = await pool.query(query);
        console.log(query);
        return teams; 
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.getTeamMembers= async function(index) { 
    try {
        var query = "select name_player as name,role, ranking from Player,Team,TeamMember where Player.id_player=TeamMember.player and TeamMember.team=Team.id_team and Team.id_team=? ";
        const members = await pool.query(query,index);
        console.log(query);
        return members; 
    } catch (err) {
        console.log(err);
        return err;
    }
}