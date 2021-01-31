var express = require('express');
var router = express.Router();
var mteam = require("../models/teamModel");

router.get('/', async function(req, res, next) {
    let result = await mteam.getAllTeams();
    res.status(result.status).
    send(result.data);

});
router.get("/:pos", async function(req, res, next) {
    let pos = req.params.pos;
    let result = await mteam.getSpecificTeam(pos);
    res.status(result.status).
    send(result.data);
});
router.post("/:pos/newmember", async function(req, res, next) {
    let pos = req.params.pos;
    let team = req.body;
    let result = await mteam.newTeamMember(team, pos);
    res.status(result.status).
    send(result.data);
});

router.post('/', async function(req, res, next) {
    let team = req.body;
    let result = await mteam.newTeam(team);
    res.status(result.status).
    send(result.data);

});


router.get("/:pos/members", async function(req, res, next) {
    let pos = req.params.pos;
    let result = await mteam.getTeamMembers(pos);
    res.status(result.status).
    send(result.data);
});

router.get("/:pos/tactics", async function(req, res, next) {
    let pos = req.params.pos;
    let result = await mteam.getTeamTactics(pos);
    res.status(result.status).
    send(result.data);
});


router.put("/:pos/player/:pos2/role/:pos3", async function(req, res, next) {
    let team = req.params.pos;
    let player = req.params.pos2;
    let role = req.params.pos3;
    let result = await mteam.changeRole(team, player, role);
    res.status(result.status).
    send(result.data);
});
//not used
router.post("/:pos/player/:pos2/rank/:pos3", async function(req, res, next) {
    let pos = req.params.pos;
    let pos2 = req.params.pos2;
    let pos3 = req.params.pos3;
    let newRankInfo = req.body;
    let newRank = await mteam.changeRank(newRankInfo);
    res.send(newRank);
});

router.delete("/:pos/player/:pos2", async function(req, res, next) {
    let team = req.params.pos;
    let player = req.params.pos2;
    let result = await mteam.removeTeammate(team, player);
    res.status(result.status).
    send(result.data);
});

router.put("/:pos/player/:pos2/giveLead/:pos3", async function(req, res, next) {
    let team = req.params.pos;
    let oldleader = req.params.pos2;
    let newleader = req.params.pos3;
    let result = await mteam.promoteToLeader(team, oldleader, newleader);
    res.status(result.status).
    send(result.data);
});


module.exports = router;