var express = require('express');
var router = express.Router();
var mrole = require("../models/roleModel");

router.get('/', async function(req,res,next) {
    let roles = await mrole.getAllRoles();
    res.send(roles);
});

module.exports = router;