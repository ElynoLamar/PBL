var express = require('express');
var router = express.Router();
var mplayer = require("../models/playerModel");

router.get('/', async function(req,res,next) {
    let players = await mplayer.getAllPlayers();
    res.send(players);
    
});

router.get("/:pos", async function(req,res,next){
    let pos = req.params.pos;
    let player = await mplayer.getSpecificPlayer(pos);
    res.send(player);
});

router.get("/:pos/teams", async function(req,res,next){
    let pos = req.params.pos;
    let teams = await mplayer.getPlayerJoinedTeams(pos);
    res.send(teams);
});

router.get("/:pos/events", async function(req,res,next){
    let pos = req.params.pos;
    let events = await mplayer.getPlayerJoinedEvents(pos);
    res.send(events);
});

router.get("/:pos1/team/:pos2", async function(req,res,next){
    let pos1 = req.params.pos1;
    let pos2 = req.params.pos2;
    let playerInfo = await mplayer.getSpecificPlayer(pos1,pos2);
    res.send(playerInfo);
});

module.exports = router;