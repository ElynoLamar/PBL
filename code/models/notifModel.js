var pool = require("../models/connection");

module.exports.getPlayerNotifications = async function(player) {
    try {
        var query = "select * from Notification where receiver=? and status=1";
        const notif = await pool.query(query, player);
        console.log(query);
        return notif;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getSpecificNotification = async function(notifID) {
    try {
        var query = "select * from Notification where id_notif = ?";
        const notif = await pool.query(query, notifID);
        console.log(query);
        return notif[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.updateInviteStatus = async function(invite) {
    try {
        var query = "UPDATE Notification SET status =? WHERE Notification.id_notif=?";
        const result = await pool.query(query, [invite.status, invite.id]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.sendInvToSpecificPerson = async function(newInvite) {
    if (newInvite.team != null) {
        try {
            var query = "insert into Notification(receiver,sender,teamInv,text_notif,invite,status) values(?, ?, ?, ?,1,1);";
            const result = await pool.query(query, [newInvite.playerRec, newInvite.playerSend, newInvite.team, newInvite.text]);
            console.log(query);
            return { status: 200, data: result };
        } catch (err) {
            console.log(err);
            return err;
        }
    } else if (newInvite.event != null) {
        try {
            var query = "insert into Notification(receiver,sender,eventInv,text_notif,invite,status) values(?, ?, ?, ?,1,1);";
            const result = await pool.query(query, [newInvite.playerRec, newInvite.playerSend, newInvite.event, newInvite.text]);
            console.log(query);
            return { status: 200, data: result };
        } catch (err) {
            console.log(err);
            return err;
        }
    }

}


module.exports.getPlayerNotifCount = async function(player) {
    try {
        var query = "SELECT COUNT(id_notif) as num FROM Notification WHERE Notification.receiver=? and status=1; ";
        const count = await pool.query(query, player);
        console.log(query);
        return count[0];
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.requestToJoinTeamNotif = async function(request) {
    try {
        let message = request.playerName;
        var query = "insert into Notification(receiver,sender,text_notif,status,invite,teamInv) VALUES((select player from TeamMember where TeamMember.ranking=1 and TeamMember.team=?),?,?, 1,0,?);";
        const result = await pool.query(query, [request.team, request.player, request.text, request.team]);
        console.log(query);
        return { status: 200, data: result };
    } catch (err) {
        console.log(err);
        return err;
    }
}