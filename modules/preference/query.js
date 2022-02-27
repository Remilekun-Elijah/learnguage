const path = require("path");
const db = require(path.resolve("db"));
const helper = require(path.resolve("utils", "helpers"));
/** 
 * Create new preference in db
 * */
// console.log(helper.generateUuid());
exports.createPreference = async(sid, preferences) => {
    const id = helper.generateUuid();
    preferences = preferences || `{
        "privacy": "public",
        "share_my_data": "false",
        "share_my_location": "false",
        "currency": "USD",
        "backgroud": "white",
        "theme": "light",
        "language": "en",
        "notification": "false"
    }`;
    const text = `INSERT INTO preference(id, sid,data) VALUES('${id}', '${sid}', '${preferences}'
)
`;
    const query = await db.query(text);
    return query.rows[0];
};

// const text = `
//     update preference set data = jsonb_set(data, '{"${Object.keys(preferences)[0]}"}', '"${preferences[Object.keys(preferences)[0]]}"') where sid = '${sid}' RETURNING data
// `;

exports.updatePreference = async(sid, preferences) => {
    const text = `
            UPDATE preference SET data = '${JSON.stringify(preferences)}' WHERE sid = '${sid}' RETURNING data
        `;

    const result = await db.query(text);
    return result.rows[0];
};


exports.deletePreference = async function(sid) {
    const text = `DELETE FROM preference WHERE sid = $1 RETURNING data`,
        query = await db.query(text, [sid]);
    return query.rows[0];
};


exports.getPreference = async function(sid) {
    const text = `
        SELECT * FROM preference WHERE sid = '${sid}'
        `;
    const query = await db.query(text);
    return query.rows[0];
}