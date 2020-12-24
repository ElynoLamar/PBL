var pool = require("../models/connection");


module.exports.getSpecificTeam= async function(index) { 
    try {
        var query = "SELECT id_team as id, name_team as name, description_team as description from Team where id_team = ?";
        const team = await pool.query(query, index);
        console.log(query);
        return team[0];
    } catch (err) {
        console.log(err);
        return err;
    }
} 

module.exports.getAllTeams= async function() { 
    try {
        var query = "SELECT id_team as id, name_team as name, description_team as description from Team";
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
        var query = "select id_player as id, name_player as name,name_role as Role,name_ranking as Ranking from Player,Team,TeamMember,Ranking,Role where Ranking.id_ranking = TeamMember.ranking and TeamMember.player = Player.id_player and Team.id_team = TeamMember.team and TeamMember.ranking = Ranking.id_ranking and TeamMember.role= Role.id_role and Team.id_team=?";
        const members = await pool.query(query,index);
        console.log(query);
        return members; 
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.getTeamTactics= async function(index) { 
    try {
        var query = "select name_tactic as name, field as fieldID, name_field  as field, image_tactic as image from Tactics, Field, Team WHERE Team =? and Tactics.team=Team.id_team and Tactics.field=Field.id_field ";
        const tactics = await pool.query(query,index);
        console.log(query);
        return tactics; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.newTeam= async function(team) { 
    try {
        var query = "insert into Team(name_team, description_team) values(?,?);";
        const result = await pool.query(query,[team.name,team.desc]);
        console.log(query);
        return {status:200, data: result}; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.newTeamMember= async function(newMember) { 
    try {
        var query = "insert into TeamMember(player, team,ranking, role) values(?, ?, ?, ?);";
        const result = await pool.query(query,[newMember.player,newMember.team,newMember.ranking,newMember.role]);
        console.log(query);
        return {status:200, data: result}; 
    } catch (err) {
        console.log(err);
        return err;
    }
}