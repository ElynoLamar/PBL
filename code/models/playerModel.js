var pool = require("../models/connection");

module.exports.getSpecificPlayer = async function(playerID, teamID) {
    try {
        var query = "select id_player as id, name_player as name,age_player as age,email_player as email,description_player as description,photo_path as photo, name_role as role, name_ranking as ranking from Player,Ranking,Team,Role, TeamMember where Player.id_player=TeamMember.player AND TeamMember.ranking=Ranking.id_ranking AND Role.id_role=TeamMember.role AND Player.id_player=? and TeamMember.team=Team.id_team and Team.id_team=?;";
        const player = await pool.query(query, [playerID, teamID]);
        console.log(query);
        return player[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getPlayer = async function(playerID) {
    try {
        var query = "select id_player as id, name_player as name,age_player as age,email_player as email,description_player as description,photo_path as photo from Player where Player.id_player=?;";
        const player = await pool.query(query, playerID);
        console.log(query);
        return player[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getAllPlayers = async function() {
    try {
        var query = "SELECT id_player as id, name_player as name, age_player as age from Player";
        const players = await pool.query(query);
        console.log(query);
        return players;
    } catch (err) {
        console.log(err);
        return err;
    }
}
module.exports.getPlayerJoinedTeams = async function(index) {
    try {
        var query = "SELECT id_team as id, name_team as name,description_team as description from Player,Team,TeamMember where Player.id_player=TeamMember.player and TeamMember.team=Team.id_team and Player.id_player=? ";
        const teams = await pool.query(query, index);
        console.log(query);
        return teams;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getPlayerTeamLeadershipDuties = async function(player) {
    try {
        var query = "SELECT Team.id_team as id, Team.name_team as name FROM Team , TeamMember WHERe player = ? and ranking = 1 and TeamMember.team = Team.id_team";
        const leaderships = await pool.query(query, player);

        return leaderships;
    } catch (err) {
        console.log(err);
        return err;
    }
}


module.exports.getPlayerGroupLeadershipDuties = async function(player) {
    try {
        var query = "select ranking, groupNumber, Event.name_event, EventGroup.event from Event, EventGroup where EventGroup.event=Event.id_event and EventGroup.player = ? and ranking=1";
        const leaderships = await pool.query(query, player);

        return leaderships;
    } catch (err) {
        console.log(err);
        return err;
    }
}