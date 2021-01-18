var express = require('express');
var router = express.Router();
var mfield = require("../models/fieldModel");

router.get('/', async function(req, res, next) {
    let fields = await mfield.getAllFields();
    res.send(fields);
});

router.get('/:pos/coordinates', async function(req, res, next) {
    let pos = req.params.pos;
    let fieldsCoords = await mfield.getSpecificFieldCoords(pos);
    res.send(fieldsCoords);
});


module.exports = router;