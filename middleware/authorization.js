const path = require("path");
const helper = require(path.resolve("utils", "helpers"));
const { upload } = require("./local_upload");
const db = require(path.resolve("db"));

exports.authorization = async(req, res, next) => {
    const token = req.headers.authorization;
    const verifyToken = helper.verifyToken(token);

    //here is the code that is making this show the error expired token on postman
    if (verifyToken == 'token_expired') {
        res.json({ ok: "false", message: "Expired token" })
    } else if (verifyToken) {
        userExists(helper.getUserIdFromToken(token)).catch((err) => {
            console.log(err)
            res.json({ ok: "false", message: "invalid user account" });
        });
        next();
    } else {
        res.json({ ok: "false", message: "bad token" })
    }
};

/** check if user has admin permission */
exports.adminAuthorization = async(req, res, next) => {
    const token = req.headers.authorization;
    const verifyToken = helper.verifyToken(token);
    if (verifyToken == 'token_expired') {
        res.json({ ok: "false", message: "Expired token" })
    } else if (helper.verifyToken(token)) {
        await helper.checkPermission(token, ["admin"]).then((data) => {

            if (data) {
                next();
            } else {
                console.log(data)
                res.json({
                    ok: "false",
                    message: "sorry, you do not have admin privillage",
                });
            }
        });
    } else {
        res.json({
            ok: "false",
            message: "bad token",
        })
    }

};


/** check if user exists */
const userExists = async function async(sid) {
    let query = await db.query(`SELECT sid FROM permission WHERE sid = '${sid}'`);
    return query.rows[0]
};