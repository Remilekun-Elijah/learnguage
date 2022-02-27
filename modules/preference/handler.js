const Joi = require("joi");
const path = require("path");
const Preference = require("./model");
const helper = require(path.resolve("utils", "helpers"));
const { response } = require(path.resolve("utils", "response.js"))



exports.createPreference = async(req, res) => {

    const objectModel = Joi.object().keys({
        preferences: Joi.string().required(),
    });

    try {
        await objectModel.validateAsync(req.body);

        const sid = helper.getUserIdFromToken(req.headers.authorization);
        const preferences = req.body.preferences;

        new Preference().create(sid, preferences).then(data => {
            res.json({ okay: true, data });
        }).catch(err => {
            res.json({ okay: false, message: "Failed to create user preferences" })
        });

    } catch (err) {
        return res.status(401).json(err["details"]);
    }
}


exports.updatePreference = async(req, res) => {

    const sid = helper.getUserIdFromToken(req.headers.authorization);
    const preference = new Preference(req.body);
    preference.update(sid).then(preferences => {
        res.json({ okay: true, message: "Preferences updated successfully", preferences: preferences["data"] });
    }).catch(err => {
        console.log(err);
        res.json({ okay: false, message: err });
    });

}


exports.deletePreference = async(req, res) => {

}

exports.getPreference = async(req, res) => {
    try {
        const token = req.headers.authorization;
        const sid = helper.getUserIdFromToken(token);
        const preference = await new Preference().get(sid);
        return res.json({ okay: true, preference });
    } catch (err) {
        console.log(err);
    }
}