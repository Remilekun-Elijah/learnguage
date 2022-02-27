//jshint esversion:6
const path = require("path");
const db = require(path.resolve("db"));
const helper = require(path.resolve("utils", "helpers"));


/** 
 * Create new user in db
 * @param {string} login_id - user unique login id
 * @param {string} hashedPassword - encrypted password
 * */

exports.createUser = async function({login_id, password} = data) {

    const id = helper.generateUuid();
    const values = [id, login_id, password];
    const text = `INSERT INTO "user"(id, login_id, password) VALUES($1, $2, $3) RETURNING *`
    return db.query(text, values).then(query=> query.rows[0]).catch(err=>{
        throw new Error("User already exist")
    });
  // return
};


/** 
 * Update password
 * @param {password} 
 * */

exports.updatePassword = async (newPassword, id)=>{
    const text = `UPDATE "user" SET password = $1 WHERE id = $2 RETURNING id, login_id, created_at, updated_at`,
        values = [newPassword, id];
    const query = await db.query(text, values);
    return query.rows[0];
}

/** 
 * Create new user profile referencing user account
 * @param {uuid} sid - unqiue id
 * @param id {uuid}
 * */

exports.setupProfile = async function(sid) {
    const id = helper.generateUuid();
    const text = 'INSERT INTO profile (id, sid) VALUES($1, $2) RETURNING *',
        value = [id, sid];
    const query = await db.query(text, value);
    return query.rows[0]
};


/** 
 * Setup User Permission
 * @param {uuid} sid - user unique id
 * @param {list} permissions - List of default permissions
 * */

exports.setupPermission = async function(sid, permissions) {
    const id = helper.generateUuid();
    const values = [id, sid, permissions]
    const text = 'INSERT INTO permission(id, sid, permissions) VALUES($1, $2, $3) RETURNING *'
    return await db.query(text, values);
};


/** 
 * Fetch user login credentials
 * @param {string} login_id
 * */
exports.fetchLoginCredential = async function(login_id) {
    const query = await db.query(`SELECT * FROM "user" WHERE login_id = '${login_id}'`);
    return query.rows[0]
};

/** 
 * Check if email exists
 * @param {uuid} id
 * */
exports.verifyEmail = async function(id) {
    const query = await db.query(`SELECT * FROM "user" WHERE id = '${id}'`);
    return query.rows[0]
};


/** 
 * Check if email exists
 * @param {string} login_id
 * */
exports.checkIfEmailExists = async function(login_id) {
    const query = await db.query(
        `SELECT id, login_id, password FROM "user" WHERE login_id = '${login_id}'`
    );
    return query.rows[0]
};

/** 
 * update user status
 * @param {string} login_id
 * */
exports.updateUserStatus = async function(login_id) {
    const query = await db.query(`
      UPDATE "user" SET status='active' WHERE login_id='${login_id}' RETURNING status,login_id
    `);
    return query.rows[0]
};

/** 
 * verify account status
 * @param {string} login id
 * */
exports.verifyAccountStatus = async function(login_id) {
    const query = await db.query(
        `SELECT status FROM "user" WHERE login_id = '${login_id}'`
    );
    return query.rows[0]
};

/** 
 * get user record
 * @param {uuid} id
 * */
exports.getUserRecord = async function(id) {
    const query = await db.query(`SELECT * FROM "user" WHERE id = '${id}'`);
    return query.rows[0]
};

/** 
 * get user permissions
 * @param {uuid} sid
 * */
exports.getUserPermission = async function(sid) {
    const query = await db.query(
        `SELECT permissions FROM permission WHERE sid = '${sid}'`
    );
    return query.rows[0]
};