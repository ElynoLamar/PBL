var express = require('express');
var router = express.Router();
var mevent = require("../models/eventModel");

router.get('/', async function(req, res, next) {
    let events = await mevent.getAllEvents();
    res.send(events);
});

router.get("/:pos", async function(req, res, next) {
    let pos = req.params.pos;
    let event = await mevent.getSpecificEvent(pos);
    res.send(event);
});

router.get("/player/:pos", async function(req, res, next) {
    let pos = req.params.pos;
    let events = await mevent.getPlayerJoinedEvents(pos);
    res.send(events);
});

router.get("/:pos/players", async function(req, res, next) {
    let pos = req.params.pos;
    let event = await mevent.getEventMembers(pos);
    res.send(event);
});

router.get("/:eventid/players/:playerid", async function(req, res, next) {
    let eventid = req.params.eventid;
    let playerid = req.params.playerid;

    let result = await mevent.getspecificEventMember(eventid, playerid);
    res.send(result);
});

router.get("/:pos1/groups/:pos2/members", async function(req, res, next) {
    let pos1 = req.params.pos1;
    let pos2 = req.params.pos2;
    let members = await mevent.getEventGroupMembers(pos1, pos2);
    res.send(members);
});

router.get("/:pos1/numofgroups", async function(req, res, next) {
    let pos1 = req.params.pos1;
    let numofgroups = await mevent.getEventNumOfGroups(pos1);
    res.send(numofgroups);
});


router.post('/', async function(req, res, next) {
    let event = req.body;
    let newevent = await mevent.newEvent(event);
    res.send(newevent);
});

router.post('/group', async function(req, res, next) {
    let GroupMember = req.body;
    let newGroupMember = await mevent.insertPlayerIntoGroup(GroupMember);
    res.send(newGroupMember);
});

router.delete('/:eventid/players/:playerid/group', async function(req, res, next) {
    let eventID = req.params.eventid;
    let playerID = req.params.playerid;
    let groupMember = await mevent.removePlayerFromGroup(eventID, playerID);
    res.send(groupMember);
});

router.put('/:eventid/players/:playerid/group/:group/leader', async function(req, res, next) {
    let eventID = req.params.eventid;
    let group = req.params.group;
    let playerID = req.params.playerid;
    let groupMember = await mevent.setGroupLeader(eventID, playerID, group);
    res.send(groupMember);
});


router.put("/newmember", async function(req, res, next) {
    let event = req.body;
    let newMember = await mevent.newEventMember(event);
    res.send(newMember);
});

router.get("/fields/:pos1", async function(req, res, next) {
    let pos1 = req.params.pos1;
    let events = await mevent.getEventsOnField(pos1);
    res.send(events);
});

router.get("/:pos/settings", async function(req, res, next) {
    let pos = req.params.pos;
    let event = await mevent.getSpecificEventSettings(pos);
    res.send(event);
});

module.exports = router;