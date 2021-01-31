var pool = require("../models/connection");
module.exports.getAllTeams = async function() {
    try {
        var query = "SELECT id_team as id, name_team as name, description_team as description from Team";
        const result = await pool.query(query);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        return { status: 500, data: err };
    }
}

module.exports.getSpecificTeam = async function(index) {
    try {
        var query = "SELECT privacy, id_team as id, name_team as name, description_team as description from Team where id_team = ?";
        const team = await pool.query(query, index);
        if (team.length > 0) {
            return { status: 200, data: team[0] };
        } else {
            return { status: 400, msg: 'team id not found' };
        }
    } catch (err) {
        return { status: 500, data: err };

    }
}
module.exports.newTeamMember = async function(newMember, teamid) {

    try {
        var query = "insert into TeamMember(player, team,ranking, role) values(?, ?, ?, ?);";
        const result = await pool.query(query, [newMember.player, teamid, newMember.ranking, newMember.role]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.newTeam = async function(team) {
    try {
        var query = "insert into Team(name_team, description_team,privacy) values(?,?,?);";
        const result = await pool.query(query, [team.name, team.desc, team.privacy]);
        let addedTeamID = result.insertId;
        let sql = "insert into TeamMember(player, team, ranking, role) values(?,?,1,1);"
        const result1 = await pool.query(sql, [team.player, addedTeamID]);
        if (result1.length > 0) {
            return { status: 200, data: result };
        } else {
            return { status: 400, msg: "couldn't post the inserted parameters" };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.getTeamMembers = async function(index) {
    try {
        var query = "select id_player as id, name_player as name,name_role as Role,name_ranking as Ranking from Player,Team,TeamMember,Ranking,Role where Ranking.id_ranking = TeamMember.ranking and TeamMember.player = Player.id_player and Team.id_team = TeamMember.team and TeamMember.ranking = Ranking.id_ranking and TeamMember.role= Role.id_role and Team.id_team=? ORDER BY id ASC ";
        const members = await pool.query(query, index);
        if (members.length > 0) {
            return { status: 200, data: members };
        } else {
            return { status: 400, msg: 'team id not found' };
        }
    } catch (err) {
        return { status: 500, data: err };
    }
}

module.exports.getTeamTactics = async function(index) {
    try {
        var query = "select id_tactic as id, name_tactic as name, field as fieldID, name_field  as field, image_tactic as image from Tactics, Field, Team WHERE Team =? and Tactics.team=Team.id_team and Tactics.field=Field.id_field ";
        const tactics = await pool.query(query, index);
        if (tactics.length > 0) {
            return { status: 200, data: tactics };
        } else {
            return { status: 400, msg: 'team id not found' };
        }
    } catch (err) {
        return { status: 500, data: err };
    }
}

module.exports.changeRole = async function(team, player, role) {
    try {
        var query = "UPDATE TeamMember SET role = ? WHERE TeamMember.player = ? AND TeamMember.team = ?;";
        const result = await pool.query(query, [role, player, team]);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

//not used
module.exports.changeRank = async function(newRank) {
    try {
        var query = "UPDATE TeamMember SET ranking = ? WHERE TeamMember.player = ? AND TeamMember.team = ?;";
        const result = await pool.query(query, [newRank.ranking, newRank.player, newRank.team]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.removeTeammate = async function(team, player) {
    try {
        var query = "DELETE FROM TeamMember WHERE team=? and player=?;";
        const result = await pool.query(query, [team, player]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}

module.exports.promoteToLeader = async function(team, oldLeader, newLeader) {
    try { // ranking 1 é "leader", ranking 2 é "player"
        if (playerID > 0 && teamID > 0 && loggedPlayer > 0) {
            let sql = "UPDATE TeamMember SET ranking = 2 WHERE TeamMember.player = ? AND TeamMember.team = ?;"
            const result1 = await pool.query(sql, [oldLeader, team]);
            console.log(sql);
            var query = "UPDATE TeamMember SET ranking = 1 WHERE TeamMember.player = ? AND TeamMember.team = ?;";
            const result = await pool.query(query, [newLeader, team]);
            console.log(query);
            return { status: 200, data: result };
        } else {
            return { status: 400, msg: 'couldnt find one of these IDs' };
        }
    } catch (err) {
        console.log(err);
        return { status: 500, data: err };
    }
}