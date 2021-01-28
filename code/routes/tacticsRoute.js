var express = require('express');
var router = express.Router();
var mtact = require("../models/tacticModel");



router.post('/', async function(req, res, next) {
    let tactics = req.body;
    let newtact = await mtact.newTactics(tactics);
    res.send(newtact);
});

router.get("/:pos", async function(req, res, next) {
    let pos = req.params.pos;
    let tact = await mtact.getSpecificTact(pos);
    res.send(tact);
});

module.exports = router;