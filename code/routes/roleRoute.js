var express = require('express');
var router = express.Router();
var mrole = require("../models/roleModel");

router.get('/', async function(req, res, next) {
    let result = await mrole.getAllRoles();
    res.status(result.status).
    send(result.data);
});

module.exports = router;