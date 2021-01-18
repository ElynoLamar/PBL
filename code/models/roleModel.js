var pool = require("../models/connection");

module.exports.getAllRoles = async function() {
    try {
        var query = "SELECT id_role as id, name_role as name from Role";
        const role = await pool.query(query);

        console.log(query);
        return role;
    } catch (err) {
        console.log(err);
        return err;
    }
}