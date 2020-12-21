var express = require('express');
var router = express.Router();
var mteam = require("../models/teamModel");

router.get('/', async function(req,res,next) {
    let teams = await mteam.getAllTeams();
    res.send(teams);
    
});

router.get("/:pos", async function(req,res,next){
    let pos = req.params.pos;
    let team = await mteam.getSpecificTeam(pos);
    res.send(team);
});
router.get("/:pos/members", async function(req,res,next){
    let pos = req.params.pos;
    let members = await mteam.getTeamMembers(pos);
    res.send(members);
});

router.get("/:pos/tactics", async function(req,res,next){
    let pos = req.params.pos;
    let tactics = await mteam.getTeamTactics(pos);
    res.send(tactics);
});


module.exports = router;