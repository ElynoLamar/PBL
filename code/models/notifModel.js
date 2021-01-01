var pool = require("../models/connection");

module.exports.getPlayerNotifications= async function(player) { 
    try {
        var query ="select * from Notification where receiver=? and status=1";
        const notif = await pool.query(query,player);
        console.log(query);
        return notif;
    } catch (err) {
        console.log(err);
        return err;
    }
} 
// add time da notif?
// new Date().toLocaleString();
//>> "09/08/2014, 2:35:56 AM"

module.exports.getInviteInfo= async function(invite) { 
    try {
        var query = "select id_invite, status, teamInv, eventInv from Invite where Invite.id_invite=?";
        const inviteInfo = await pool.query(query,invite);
        console.log(query);
        return inviteInfo[0];
    } catch (err) {
        console.log(err);
        return err;
    }
} 

module.exports.updateInviteStatus= async function(invite) { 
    try {
        var query = "UPDATE Notification SET status =? WHERE Notification.id_notif=?";
        const result = await pool.query(query,[invite.status,invite.id]);
        console.log(query);
        return {status:200, data: result}; 
    } catch (err) {
        console.log(err);
        return err;
    }
} 
