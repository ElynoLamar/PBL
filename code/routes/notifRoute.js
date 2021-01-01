var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:pos', async function(req,res,next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifications(pos);
    res.send(notif);
});
router.get('/invite/:pos', async function(req,res,next) {
    let pos = req.params.pos;
    let ivnites = await mnotif.getInviteInfo(pos);
    res.send(ivnites);
});
router.post('/:pos', async function(req,res,next) {
    let invite = req.body;
    let updatedInv = await mnotif.updateInviteStatus(invite);
    res.send(updatedInv);
});

module.exports = router;