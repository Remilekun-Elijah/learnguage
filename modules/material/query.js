const path = require("path")
const db = require(path.resolve("db"))
const randomstring = require("randomstring");
const helper = require(path.resolve("utils", "helpers"));

/**
 * create learning material
 * @params {object} reqBody
 * */
exports.createMaterial = async(reqBody) => {
    let { author, type, title, image, description, body, material } = reqBody;
    const text = "INSERT INTO learningMaterials( author, type, title, image, description, body, material)" +
        "VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const value = [author, type, title, image, description, body, material];
    const query = await db.query(text, value);
    return query.rows[0]
}

/**
 * get single material with id
 * @params {uuid} id
 * */
exports.getSingleMaterial = async (id) => {
    const query = await db.query(`
        SELECT
        *
        FROM learningMaterials
        INNER JOIN (
        SELECT profile.sid,
        json_agg(
            json_build_object (
                'id', profile.sid,
                'firstName', profile.first_name,
                'lastName', profile.last_name
            )
        ) author
        FROM profile
        GROUP BY profile.sid
        ) profile ON learningMaterials.author = profile.sid WHERE id='${id}';`);
    return query.rows[0]
}

/**
 * get all materials with paginatuon
 * @params {int} limit
 * @params {int} page
 * */
exports.getMaterials = async (limit, page) => {
    const query = await db.query(`
              SELECT
              *
              FROM learningMaterials
              INNER JOIN (
              SELECT profile.sid,
              json_agg(
                json_build_object (
                    'id', profile.sid,
                    'firstName', profile.first_name,
                    'lastName', profile.last_name
                )
              ) author
            FROM profile
            GROUP BY profile.sid
            ) profile ON learningMaterials.author = profile.sid;`);
    return query.rows
}

/**
 * delete learning material with id
 * @params {uuid} id
 * */
exports.deleteMaterial = async (id) => {
    const query = await db.query(`DELETE FROM learningMaterials WHERE id = '${id}' RETURNING *`);
    return query.rows[0]
}

/**
 * update existing learning material
 * @params {object} newMat
 * @params {uuid} id
 * */
exports.updateMaterial = async (id, newMat) => {
    const {type, title, image,description,body,material} = newMat;
    const query = await db.query(`UPDATE  learningMaterials SET  type = '${type}', title = '${title}', image= '${image}', description = '${description}', body = '${body}', material =  '${material}' WHERE id = '${id}' RETURNING *`);
    return query.rows[0]
}

/**
 * check if material title is already used
 * @params {string} title
 * */
exports.checkForMaterialTitle = async(title) => {
    const query = await db.query(`SELECT * FROM learningMaterials WHERE title = '${title}'`);
    return query.rows
};

/**
 * get all materials with paginatuon
 * @params {int} limit
 * @params {int} page
 * */
exports.getSingleMaterialById = async(id) => {
    const query = await db.query(`SELECT * FROM learningMaterials WHERE id = '${id}' `);
    return query.rows[0]
};