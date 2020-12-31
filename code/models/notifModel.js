var pool = require("../models/connection");

module.exports.getPlayerNotifications= async function(player) { 
    try {
        var query = "select * from Notification where Notification.player=?";
        console.log(query);
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