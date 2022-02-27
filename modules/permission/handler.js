const Joi = require("joi");
const path = require("path");
const helper = require(path.resolve("utils", "helpers"));
const queries = require(path.resolve("modules/permission", "query"));

/**
 * get current user permissions
 * @params {request, response}
 * */
exports.getUserPermissions = async(req, res) => {
    const token = req.headers.authorization;
    await helper.getUserPermissions(token).then((data) => {
        res.send(data);
    });
};


/**
 * update user permissions
 * @params {request, response}
 * */
exports.updatePermissions = async(req, res) => {
    let body = req.body;
    const objectModel = Joi.object().keys({
        sid: Joi.string().required(),
        permissions: Joi.string().required(),
    });
    try {
        await objectModel.validateAsync(body);
      
          const { sid, permissions } = body;
        queries.userInPermissions(sid).then(({ sid } = userData) => {
          queries.updatePermissions(sid, permissions).then((data) => {
            res.json({
                ok: "true",
                status: 201,
                message: "Permission Updated",
                data: data,
            });
          });
        }).catch((err) => {
          res.json({
            ok: "false",
            status: 404,
            message: "user was not found",
          });
      });

    } catch (err) {
        return res.status(401).json(err["details"]);
    }

};
