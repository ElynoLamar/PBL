var express = require('express');
var router = express.Router();
var mfield = require("../models/fieldModel");

router.get('/', async function(req, res, next) {
    let fields = await mfield.getAllFields();
    res.send(fields);
});

router.get('/distinct', async function(req, res, next) {
    let fields = await mfield.getAllFieldsDistinct();
    res.send(fields);
});

router.get('/:fieldID/coordinates', async function(req, res, next) {
    let fieldID = req.params.fieldID;
    let fieldsCoords = await mfield.getSpecificFieldCoords(fieldID);
    res.send(fieldsCoords);
});


module.exports = router;