const path = require("path");
const db = require(path.resolve("db"));
const helper = require(path.resolve("utils", "helpers"));

/**
 * update user status (user verification)
 * @params {body} profilePicturePath
 * @params {uuid} sid
 * */
exports.updateProfile = async function(sid, body) {
    const { firstName, lastName, otherNames, socialLinks, bio } = body;
    const values = [sid, firstName, lastName, otherNames, JSON.stringify(socialLinks), bio];
    const text = `UPDATE profile SET first_name=$2, last_name=$3, other_names=$4, social_links=$5, bio=$6 WHERE sid=$1 RETURNING *;`;

    const query = await db.query(text, values);
    return query.rows[0]
};

/**
 * update profile photo
 * @params {string} profilePicturePath
 * @params {uuid} sid - unique user id
 * */
exports.updateProfilePhotoPath = async function(profilePicturePath, sid) {
    const values = [profilePicturePath, sid];
    const text = 'UPDATE profile SET profile_picture= $1 WHERE sid= $2 RETURNING *;'
    const query = await db.query(text, values);
    return query.rows[0];
};

/**
 * get user profile
 * @params {sid} unique user id
 * */
exports.getUserPofile = async(sid) => {
    const values = [sid]
    const text = 'SELECT * from profile WHERE sid = $1'
    const query = await db.query(text, values);
    return query.rows[0];
}