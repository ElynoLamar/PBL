var express = require('express');
var router = express.Router();
var mplayer = require("../models/playerModel");

router.get('/', async function(req, res, next) {
    let result = await mplayer.getAllPlayers();
    res.status(result.status).
    send(result.data);
});

router.get("/:playerID", async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mplayer.getPlayer(playerID);
    res.status(result.status).
    send(result.data);
});

router.get("/:playerID/teams", async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mplayer.getPlayerJoinedTeams(playerID);
    res.status(result.status).
    send(result.data);
});

router.get("/:playerID/leaderships/teams", async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mplayer.getPlayerTeamLeadershipDuties(playerID);
    res.send(result);
});

router.get("/:playerID/leaderships/groups", async function(req, res, next) {
    let playerID = req.params.playerID;
    let result = await mplayer.getPlayerGroupLeadershipDuties(playerID);
    res.send(result);
});



router.get("/:playerID/teams/:teamID", async function(req, res, next) {
    let playerID = req.params.playerID;
    let teamID = req.params.teamID;
    let playerInfo = await mplayer.getSpecificPlayer(playerID, teamID);
    res.send(playerInfo);
});

module.exports = router;