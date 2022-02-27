const path = require("path");
const helper = require(path.resolve("utils", "helpers"));
let Profile = require("./model.js");
const { response } = require(path.resolve("utils", "response.js"))
console.log(Profile);

/**
 * update user profile
 * @params {request, response}
 * */
exports.updateProfile = async(req, res) => {
    const token = req.headers.authorization,
        profile = new Profile(req.body);
    let id = helper.getUserIdFromToken(token);

    profile.update(id)
        .then(data => {
            res.json({ okay: true, message: "Updated successfully", data });
        })
        .catch((err) => {
            console.log(err)
            res.json({ okay: false, message: "Error! something went wrong.", error: err.message });
        });
};


/**
 * update user profile photo
 * @params {request, response}
 * */
const upload = async(req, res) => {
    if (req.file) {
        let supportedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (supportedFileTypes.includes(req.file.mimetype)) {
            let sid = helper.getUserIdFromToken(req.headers.authorization);
            try {
                let myFile = req.file.originalname.split(".");
                const fileType = myFile[myFile.length - 1];
            } catch (err) {
                return res.json({ okay: false, message: err });
            }
        } else {
            return res.json({ okay: false, message: "Invalid File Type" });
        }
    }
};

exports.getProfile = async(req, res) => {
    const profile = new Profile(),
        sid = helper.getUserIdFromToken(req.headers.authorization);
    profile.purge(sid).then(data => {
        res.json({ okay: true, message: data })
    }).catch(err => {
        res.json({ okay: false, message: "Error! could not fetch user profile.", error: err.message })
    })
};