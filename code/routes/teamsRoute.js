var express = require('express');
var router = express.Router();
var mteam = require("../models/teamModel");

router.get('/', async function(req,res,next) {
    let teams = await mteam.getAllTeams();
    res.send(teams);
    
});

router.get("/:pos", async function(req,res,next){
    let pos = req.params.pos;
    let members = await mteam.getAllTeamMembers(pos);
    res.send(members);
});


module.exports = router;