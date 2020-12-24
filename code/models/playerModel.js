var pool = require("../models/connection");

module.exports.getSpecificPlayer= async function(playerID,teamID) { 
    try {
        var query = "select name_player as name,age_player as age,email_player as email,description_player as description,image_path as photo, name_role as role, name_ranking as ranking from Player,Ranking,Team,Role, TeamMember where Player.id_player=TeamMember.player AND TeamMember.ranking=Ranking.id_ranking AND Role.id_role=TeamMember.role AND Player.id_player=? and TeamMember.team=Team.id_team and Team.id_team=?;";
        const player = await pool.query(query,[playerID, teamID]);
        console.log(query);
        return player[0]; 
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
        var query = "SELECT id_team as id, name_team as name,description_team as description from Player,Team,TeamMember where Player.id_player=TeamMember.player and TeamMember.team=Team.id_team and Player.id_player=? ";
        const teams = await pool.query(query,index);
        console.log(query);
        return teams; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

