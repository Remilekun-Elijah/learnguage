const path = require("path");

const db = require(path.resolve("db"));



/** update user status */
exports.updatePermissions = async function (sid, permissions) {
    const text = `UPDATE permission SET permissions='${permissions}' WHERE sid='${sid}' RETURNING *;`
    const query = await db.query(text);
  return query.rows[0];
};


/**
 * get single user to verify if the user exists
 * @params {uuid} sid
 * */
exports.userInPermissions = async function async(sid) {
    const query = await db.query(`SELECT id AS sid FROM "user" WHERE id='${sid}'`);
    return query.rows[0]
};

/** check if user exists */
exports.userExists = async function async(sid) {
    const query = await db.query(`SELECT sid FROM permission WHERE sid = '${sid}'`);
    return query.rows[0]
};