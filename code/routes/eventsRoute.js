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

module.exports = router;