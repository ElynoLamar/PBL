var express = require('express');
var router = express.Router();
var mteam = require("../models/teamModel");

router.get('/', async function(req, res, next) {
    let result = await mteam.getAllTeams();
    res.status(result.status).
    send(result.data);

});
router.get("/:teamID", async function(req, res, next) {
    let teamID = req.params.teamID;
    let result = await mteam.getSpecificTeam(teamID);
    res.status(result.status).
    send(result.data);
});
router.post("/:teamID/newmember", async function(req, res, next) {
    let teamID = req.params.teamID;
    let team = req.body;
    let result = await mteam.newTeamMember(team, teamID);
    res.status(result.status).
    send(result.data);
});

router.post('/', async function(req, res, next) {
    let team = req.body;
    let result = await mteam.newTeam(team);
    res.status(result.status).
    send(result.data);

});


router.get("/:teamID/members", async function(req, res, next) {
    let teamID = req.params.teamID;
    let result = await mteam.getTeamMembers(teamID);
    res.status(result.status).
    send(result.data);
});

router.get("/:teamID/tactics", async function(req, res, next) {
    let teamID = req.params.pos;
    let result = await mteam.getTeamTactics(teamID);
    res.status(result.status).
    send(result.data);
});


router.put("/:teamID/player/:playerID/role/", async function(req, res, next) {
    let team = req.params.teamID;
    let player = req.params.playerID;
    let obj = req.body;
    let role = obj.role;
    let result = await mteam.changeRole(team, player, role);
    res.status(result.status).
    send(result.data);
});
//not used
router.post("/:teamID/player/:playerID/rank/", async function(req, res, next) {
    let newRankInfo = req.body;
    let newRank = await mteam.changeRank(newRankInfo);
    res.send(newRank);
});

router.delete("/:teamID/player/:playerID", async function(req, res, next) {
    let team = req.params.teamID;
    let player = req.params.playerID;
    let result = await mteam.removeTeammate(team, player);
    res.status(result.status).
    send(result.data);
});

router.put("/:team/player/:oldleader/giveLead/:newleader", async function(req, res, next) {
    let team = req.params.team;
    let oldleader = req.params.oldleader;
    let newleader = req.params.newleader;
    let result = await mteam.promoteToLeader(team, oldleader, newleader);
    res.status(result.status).
    send(result.data);
});


module.exports = router;