var pool = require("../models/connection");

module.exports.getAllFields= async function() { 
    try {
        var query = "SELECT id_field as id, name_field as name FROM Field ";
        const fields = await pool.query(query);
        console.log(query);
        return fields; 
    } catch (err) {
        console.log(err);
        return err;
    }
}

