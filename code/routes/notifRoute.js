var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:playerID', async function(req, res, next) {
    let playerID = req.params.playerID;
    let notif = await mnotif.getPlayerNotifications(playerID);
    res.send(notif);
});
router.get('/player/:playerID/count', async function(req, res, next) {
    let playerID = req.params.playerID;
    let notif = await mnotif.getPlayerNotifCount(playerID);
    res.send(notif);
});


router.post('/', async function(req, res, next) {
    let invite = req.body;
    let updatedInv = await mnotif.updateInviteStatus(invite);
    res.send(updatedInv);
});

router.get('/:idNotif', async function(req, res, next) {
    let idNotif = req.params.idNotif;
    let notifInfo = await mnotif.getSpecificNotification(idNotif);
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