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

module.exports = router;