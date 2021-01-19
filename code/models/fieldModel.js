var pool = require("../models/connection");

module.exports.getAllFields = async function() {
    try {
        var query = "select id_field as id, lat,lng, name_field as name from Coordinates, Field where Field.id_field = Coordinates.field ORDER by Coordinates.id_coord asc";
        const fields = await pool.query(query);
        console.log(query);
        return fields;
    } catch (err) {
        console.log(err);
        return err;
    }
}

module.exports.getSpecificFieldCoords = async function(pos) {
    try {
        var query = "select lat,lng, name_field as name from Coordinates, Field where Field.id_field= ? and Field.id_field = Coordinates.field ORDER by Coordinates.id_coord asc ";
        const fieldCoords = await pool.query(query, pos);
        console.log(query);
        return fieldCoords;
    } catch (err) {
        console.log(err);
        return err;
    }
}