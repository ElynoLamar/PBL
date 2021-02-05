var express = require('express');
var router = express.Router();
var mevent = require("../models/eventModel");

router.get('/', async function(req, res, next) {
    let events = await mevent.getAllEvents();
    res.send(events);
});

router.get("/:eventID", async function(req, res, next) {
    let eventID = req.params.eventID;
    let event = await mevent.getSpecificEvent(eventID);
    res.send(event);
});

router.get("/player/:playerID", async function(req, res, next) {
    let playerID = req.params.playerID;
    let events = await mevent.getPlayerJoinedEvents(playerID);
    res.send(events);
});

router.get("/:eventID/players", async function(req, res, next) {
    let eventID = req.params.eventID;
    let event = await mevent.getEventMembers(eventID);
    res.send(event);
});

router.get("/:eventid/players/:playerid", async function(req, res, next) {
    let eventid = req.params.eventid;
    let playerid = req.params.playerid;

    let result = await mevent.getspecificEventMember(eventid, playerid);
    res.send(result);
});

router.get("/:eventID/groups/:num/members", async function(req, res, next) {
    let eventID = req.params.eventID;
    let num = req.params.num;
    let members = await mevent.getEventGroupMembers(eventID, num);
    res.send(members);
});

router.get("/:eventID/numofgroups", async function(req, res, next) {
    let eventID = req.params.eventID;
    let numofgroups = await mevent.getEventNumOfGroups(eventID);
    res.send(numofgroups);
});

router.get("/fields/:fieldID", async function(req, res, next) {
    let fieldID = req.params.fieldID;
    let events = await mevent.getEventsOnField(fieldID);
    res.send(events);
});

router.get("/:eventID/settings", async function(req, res, next) {
    let eventID = req.params.eventID;
    let event = await mevent.getSpecificEventSettings(eventID);
    res.send(event);
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


module.exports = router;