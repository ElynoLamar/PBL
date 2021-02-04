var pool = require("../models/connection");

module.exports.getAllRoles = async function() {
    try {
        var query = "SELECT id_role as id, name_role as name from Role";
        const role = await pool.query(query);

        console.log(query);
        if (role.length > 0) {
            return { status: 200, data: role };
        } else {
            return { status: 400, msg: 'roles not found' };
        }
    } catch (err) {
        return { status: 500, data: err };

    }
}