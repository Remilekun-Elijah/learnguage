const Joi = require("joi");
const path = require("path");
const queries = require(path.resolve("modules/app_settings", "query"));


/*
    *Create settings for the application
    * @parameters:
    * sid ==> unique id for the admin
    * app_name ==> application name
    * website_theme ==> Different background themes to choose from
*/
exports.createSettings = async(req, res) => {
    const reqBody = req.body
    const objectModel = Joi.object().keys({
        sid: Joi.string().required(),
        app_name: Joi.object().required(),
        website_theme:Joi.object().required()
    });

    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }

    const sid = reqBody.sid;
    const data = {app_name:reqBody.app_name, themes:reqBody.website_theme}; 
    queries.createSettings(sid, data).then(data => {
        const appsetting = {
            key: "success",
            details: data.rows[0]
        }
        console.log(appsetting)
        res.json({
            ok: "true",
            status: 200,
            message: appsetting.details ,
        });
    }).catch(e => {
        const error = {
            key: "error",
            details: e
        }
        res.send(error)
    })
}

/*
    *Update settings for the application
    * @parameters:
    * sid ==> unique id for the admin
    * app_name ==> application name
    * website_theme ==> Different background themes to choose from
*/
exports.updateSettings = async(req, res) => {
    const reqBody = req.body;
    const objectModel = Joi.object().keys({
        sid: Joi.string().required(),
        app_name: Joi.object().required(),
        website_theme:Joi.object().required()
    });
    try {
        await objectModel.validateAsync(reqBody);
    } catch (error) {
        res.status(401).send(error["details"]);
    }
    const sid = reqBody.sid;
    const data = {app_name:reqBody.app_name, themes:reqBody.website_theme}; 
    queries.updateSettings(sid, data).then(setting =>{
        res.json(setting.rows[0]);
    }).catch(err => res.status(201).send(err));
}

/*
    Get the seting for the application
    *@parameter:
    *sid ==>unique identifier for the application 
*/
exports.getSettings = async(req, res) => {
    const reqBody = req.body;
    const objectModel = Joi.object().keys({
        sid: Joi.string().required(),
    });
    try {
        await objectModel.validateAsync(reqBody)
    } catch (error) {
        return res.status(401).json(error["details"]);
    }
    const sid = reqBody.sid; 
    queries.getSettings(sid).then(setting =>{
        if(!setting.rows.length){
            res.status(201).send("app settings not found!");
            return;
        }
        res.status(200).send(setting.rows[0]);
    }).catch(err => res.send(err) );
}