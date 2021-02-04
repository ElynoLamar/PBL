var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifications(pos);
    res.send(notif);
});
router.get('/player/:pos/count', async function(req, res, next) {
    let pos = req.params.pos;
    let notif = await mnotif.getPlayerNotifCount(pos);
    res.send(notif);
});

router.get('/invite/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let ivnites = await mnotif.getInviteInfo(pos);
    res.send(ivnites);
});

//not used
router.post('/', async function(req, res, next) {
    let invite = req.body;
    let updatedInv = await mnotif.updateInviteStatus(invite);
    res.send(updatedInv);
});

router.get('/:pos', async function(req, res, next) {
    let pos = req.params.pos;
    let notifInfo = await mnotif.getSpecificNotification(pos);
    res.send(notifInfo);
});


router.post('/player/invite', async function(req, res, next) {
    let invite = req.body;
    let newInv = await mnotif.sendInvToSpecificPerson(invite);
    res.send(newInv);
});


router.post('/player/:pos/teams/:pos2/requests/', async function(req, res, next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let request = req.body;
    let nRequest = await mnotif.requestToJoinTeamNotif(request);
    res.send(nRequest);
});

router.post('/player/:pos/events/:pos2/requests/', async function(req, res, next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let request = req.body;
    let nRequest = await mnotif.requestToJoinEventNotif(request);
    res.send(nRequest);
});



module.exports = router;