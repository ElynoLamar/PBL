var express = require('express');
var router = express.Router();
var mfield = require("../models/fieldModel");

router.get('/', async function(req,res,next) {
    let fields = await mfield.getAllFields();
    res.send(fields);
});

module.exports = router;