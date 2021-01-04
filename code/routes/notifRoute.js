var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:pos', async function(req,res,next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifications(pos);
    res.send(notif);
});
router.get('/player/:pos/count', async function(req,res,next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifCount(pos);
    res.send(notif);
});

router.get('/invite/:pos', async function(req,res,next) {
    let pos = req.params.pos;
    let ivnites = await mnotif.getInviteInfo(pos);
    res.send(ivnites);
});

//not used
router.post('/:pos', async function(req,res,next) {
    let invite = req.body;
    let updatedInv = await mnotif.updateInviteStatus(invite);
    res.send(updatedInv);
});



router.post('/team/:pos/player/:pos2', async function(req,res,next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let invite = req.body;
    let newInv = await mnotif.sendInvSpecificTeam(invite);
    res.send(newInv);
});


module.exports = router;