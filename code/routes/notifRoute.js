var express = require('express');
var router = express.Router();
var mnotif = require("../models/notifModel");

router.get('/player/:playerID', async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mnotif.getPlayerNotifications(playerID);
    res.status(result.status).
    send(result.data);
});
router.get('/player/:playerID/count', async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mnotif.getPlayerNotifCount(playerID);
    res.status(result.status).
    send(result.data);
});


router.post('/', async function(req, res, next) {
    let invite = req.body;
    let result = await mnotif.updateInviteStatus(invite);
    res.status(result.status).
    send(result.data);
});

router.get('/:idNotif', async function(req, res, next) {
    let idNotif = req.params.idNotif;
    let result = await mnotif.getSpecificNotification(idNotif);
    res.status(result.status).
    send(result.data);
});


router.post('/player/invite', async function(req, res, next) {
    let invite = req.body;
    let result = await mnotif.sendInvToSpecificPerson(invite);
    res.status(result.status).
    send(result.data);
});


router.post('/player/:pos/teams/:pos2/requests/', async function(req, res, next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let request = req.body;
    let result = await mnotif.requestToJoinTeamNotif(request);
    res.status(result.status).
    send(result.data);
});

router.post('/player/:pos/events/:pos2/requests/', async function(req, res, next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let request = req.body;
    let result = await mnotif.requestToJoinEventNotif(request);
    res.status(result.status).
    send(result.data);
});



module.exports = router;