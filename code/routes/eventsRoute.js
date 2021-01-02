var express = require('express');
var router = express.Router();
var mevent = require("../models/eventModel");

router.get('/', async function(req,res,next) {
    let events = await mevent.getAllEvents();
    res.send(events);
});

router.get("/:pos", async function(req,res,next){
    let pos = req.params.pos;
    let event = await mevent.getSpecificEvent(pos);
    res.send(event);
});

router.get("/player/:pos", async function(req,res,next){
    let pos = req.params.pos;
    let events = await mevent.getPlayerJoinedEvents(pos);
    res.send(events);
});

router.get("/:pos/players", async function(req,res,next){
    let pos = req.params.pos;
    let event = await mevent.getEventMembers(pos);
    res.send(event);
});

router.get("/:pos1/groups/:pos2", async function(req,res,next){
    let pos1 = req.params.pos1;
    let pos2 = req.params.pos2;
    let members = await mevent.getEventGroupMembers(pos1, pos2);
    res.send(members);
});

module.exports = router;