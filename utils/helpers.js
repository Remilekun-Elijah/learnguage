const path = require("path")
const fs = require('fs').promises;
const config = require(path.resolve("utils", "config.js"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const uuid = require("uuid");
const secret = config.secret;
const userQueries = require(path.resolve("modules/users", "query.js"))
const chalk = require('chalk');
const crypto = require("crypto");
const ENCRYPTION_KEY = config.platformEncryptionKey;
const IV_LENGTH = 16;

// hash password
exports.hashPassword = (password) => bcrypt.hashSync(password, salt);

// encrypt
exports.encrypt = (value) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

// decrypt
exports.decrypt = (value) => {
    let textParts = value.split(":");
    let iv = Buffer.from(textParts.shift(), "hex");
    let encryptedText = Buffer.from(textParts.join(":"), "hex");
    let decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(ENCRYPTION_KEY),
        iv
    );
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// compare password
exports.comparePassword = (hashedPassword, password) => {
    return bcrypt.compareSync(password, hashedPassword);
};

// valiate email
exports.isValidEmail = (email) => {
    const regEx = /\S+@\S+\.\S+/;
    return regEx.test(email);
};

// validate password
exports.validatePassword = (password) => {
    if (password.length <= 5 || password === "") {
        return false;
    }
    return true;
};

// is empty or undefined
exports.isEmpty = (input) => {
    if (input === undefined || input === "") {
        return true;
    }
    if (input.replace(/\s/g, "").length) {
        return false;
    }
    return true;
};

/** is empty*/
exports.empty = (input) => {
    if (input === undefined || input === "") {
        return true;
    }
};

// generate jwt token
exports.generateUserToken = (id, user_id) => {
    const token = jwt.sign({
            id: id,
            user_id: user_id,
        },
        secret, { expiresIn: "1d" }
    );
    return `Bearer ${token}`;
};

// generate and remember jwt token
exports.generateRememberedToken = (id, is_admin) => {
    const token = jwt.sign({
            user_id: user_id,
        },
        secret, { expiresIn: "2d" }
    );
    return `Bearer ${token}`;
};

// verify token
const verifyToken = token => {
    const token_slice = token.replace(/Bearer/g, "").trim();
    const decode = jwt.decode(token_slice)
    var seconds = 1000;
    var d = new Date();
    var t = d.getTime();
    if (decode.exp < Math.round(t / seconds)) {
        return 'token_expired';
    }
    const isVerified = jwt.verify(token_slice, secret);
    return isVerified;
};
exports.verifyToken = verifyToken;

// get user id from token
exports.getUserIdFromToken = (token) => {
    let isVerified = verifyToken(token)
    const id = isVerified["id"];
    return id;
};

// check user permissions
exports.checkPermission = async(token, args) => {
    let isVerified = verifyToken(token)
    const id = isVerified["id"];
    let permissions = [];
    await userQueries.getUserPermission(id)
        .then((data) => {

            const userPermissions = data["permissions"]
                .replace("[", "")
                .replace("]", "");
            const permissionSlice = userPermissions.split(",");
            permissionSlice.forEach((element) => {
                permissions.push(element.trim());
            });
        })
        .catch((error) => {
            return `User does not exist ${error}`;
        });
    return args.some((r) => permissions.indexOf(r) >= 0);
};

// get user permissions
exports.getUserPermissions = async(token) => {
    const token_slice = token.replace(/Bearer/g, "").trim();
    let isVerified = verifyToken(token);
    const id = isVerified["id"];
    let permissions = [];
    await userQueries
        .getUserPermission(id)
        .then((data) => {
            const userPermissions = data["permissions"]
                .replace("[", "")
                .replace("]", "");
            const permissionSlice = userPermissions.split(",");
            permissionSlice.forEach((element) => {
                permissions.push(element.trim());
            });
        })
        .catch((error) => {
            return `User does not exist ${error}`;
        });
    return {...[permissions] }
};

// generate uuid
exports.generateUuid = () => uuid.v4();

// delete file helper
exports.deleteFileFrom = (filePath, cb) => {
    fs.unlink(path.resolve(filePath)).then(cb).catch(err => { console.log(err) });
}

// move file helper
exports.moveFile = (from, to, cb) => {
    fs.rename(path.resolve(from), path.resolve(to)).then(cb).catch(err => { throw err })
}

// file watcher
exports.watcher = () => {
    fs.watch(path.resolve("uploads"), { persistent: true }, function(rename) {
        fs.readdir(path.resolve("uploads/temp"), (err, files) => {
            let arr = []
            for (var i = 0; i < files.length; i++) {
                let b = i;
                fs.stat(path.resolve("uploads/temp", files[i]), (err, stat) => {
                    console.log(chalk.whiteBright(`There was a`, chalk.yellowBright(rename), `event on`, chalk.yellowBright(files[b]), `the file size is`, chalk.yellowBright(Number(stat.size / 1000).toString().concat('KB')), 'and it happened at', chalk.yellowBright(stat.birthtime.toISOString().split('T')[1].split('.')[0])));
                })
            }
        })
        console.log(chalk.whiteBright(`There was a`, chalk.yellowBright(rename), `event on in temp`));
    });
    watcher.on('', (e) => {
        console.log("file was", e);
    })
}