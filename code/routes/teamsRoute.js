var express = require('express');
var router = express.Router();
var mteam = require("../models/teamModel");

router.get('/', async function(req,res,next) {
    let teams = await mteam.getAllTeams();
    res.send(teams);
});

router.post("/:pos/members", async function(req,res,next){
    let pos = req.params.pos;
    let team = req.body;
    let newMember = await mteam.newTeamMember(team);
    res.send(newMember);
});

router.post('/', async function(req,res,next) {
    let team = req.body;
    let newteam = await mteam.newTeam(team);
    res.send(newteam);
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

router.post('/', async function(req,res,next) {
    let team = req.body;
    let newteam = await mteam.newTeam(team);
    res.send(newteam);
});

router.post("/:pos/player/:pos2/role/:pos3", async function(req,res,next){
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let pos3 = req.params.pos3;
    let newRoleInfo = req.body;
    let newRole = await mteam.changeRole(newRoleInfo);
    res.send(newRole);
});

router.post("/:pos/player/:pos2/rank/:pos3", async function(req,res,next){
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let pos3 = req.params.pos3;
    let newRankInfo = req.body;
    let newRank = await mteam.changeRank(newRankInfo);
    res.send(newRank);
});

module.exports = router;