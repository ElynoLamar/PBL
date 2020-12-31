var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:pos', async function(req,res,next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifications(pos);
    res.send(notif);
});

module.exports = router;