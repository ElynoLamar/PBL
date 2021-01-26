var express = require('express');
var router = express.Router();
var mtact = require("../models/tacticModel");


//not used
router.post('/', async function(req, res, next) {
    let tactics = req.body;
    let newtact = await mtact.newTactics(tactics);
    res.send(newtact);
});

module.exports = router;