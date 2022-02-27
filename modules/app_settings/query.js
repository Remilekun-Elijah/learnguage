const path = require("path");
const db = require(path.resolve("db"));
const {v4: uuidv4} = require("uuid");

/** 
 * Create new app settings in db
 * */
exports.createSettings = async function (sid, data) {
    const text = `INSERT INTO app_settings(id,sid, data) VALUES('${uuidv4()}', '${sid}','${JSON.stringify(data)}') RETURNING *`;
    return await db.query(text);
};

/** 
 * Update existing app_setting in db
 * */
exports.updateSettings = async function (sid, data){
    const text =`UPDATE app_settings SET data=$2 where sid=$1 RETURNING *`;
    return  await db.query(text, [sid,JSON.stringify(data)]);
};


/** 
 * Get existing app settings in db
 * */
exports.getSettings = async function (sid) {
    return await db.query(`SELECT * FROM app_settings WHERE sid = '${sid}'`)
}