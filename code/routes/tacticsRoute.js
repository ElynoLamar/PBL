var express = require('express');
var router = express.Router();
var mtact = require("../models/tacticModel");



router.post('/', async function(req, res, next) {
    let tactics = req.body;
    let newtact = await mtact.newTactics(tactics);
    res.send(newtact);
});

router.get("/:tacticID", async function(req, res, next) {
    let tacticID = req.params.tacticID;
    let tact = await mtact.getSpecificTact(tacticID);
    res.send(tact);
});

router.get("/events/:event/groups/:groupnum", async function(req, res, next) {
    let groupnum = req.params.groupnum;
    let event = req.params.event;
    let tact = await mtact.getSpecificTactforGroup(event, groupnum);
    res.send(tact);
});


module.exports = router;