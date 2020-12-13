var pool = require("./connection");

module.exports.getSpecificPlayer= async function(index) { 
    try {
        var query = "SELECT * from Player where id_player = ?";
        const player = await pool.query(query, index);
        console.log(query);
        return player; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getAllPlayers= async function() { 
    try {
        var query = "SELECT name_player as name, age_player as age from Player";
        const players = await pool.query(query);
        console.log(query);
        return players; 
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.getPlayerJoinedTeams= async function(index) { 
    try {
        var query = "SELECT name_team as name,description_team as description from Player,Team,TeamMember where Player.id_player=TeamMember.player and TeamMember.team=Team.id_team and Player.id_player=? ";
        const teams = await pool.query(query,index);
        console.log(query);
        return teams; 
    } catch (err) {
        console.log(err);
        return err;
    }
}