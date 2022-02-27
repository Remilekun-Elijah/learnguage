const Joi = require("joi");
const path = require("path");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const helper = require(path.resolve("utils", "helpers"));
const files = require(path.resolve("services/file_upload", "uploadAdaptor"));

const Material = require(__dirname + "/model");

/**
 * create learning material
 * @params {request, response}
 * */
exports.createMaterial = async(req, res) => {

    const file = files(req.files, ['img', 'mp4', 'pdf']);

    let reqBody = { title, description, body, type } = req.body;

    const objectModel = Joi.object().keys({
        type: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        body: Joi.string().required(),
    });

    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }

    try {
        /** check if there is an error **/
        if (file.error()) {
            res.json({ ok: false, message: file.error() })
        } else {

            const imageName = file.image().name;
            const learningMaterial = file.other().name;
            const id = helper.getUserIdFromToken(req.headers.authorization);

            reqBody.author = id;
            reqBody.image = `uploads/material/material_thumbnail/${file.image().name}`;
            reqBody.material = `uploads/material/material_thumbnail/${file.other().name}`;

            const material = new Material(reqBody);

            await material.create().then(data => {
                if (data) {
                    // Move file to parmanent location
                    moveFile(file.image().path, data.image,
                        () => console.log("Moved successfully"));
                    moveFile(file.other().path, data.material,
                        () => console.log("Moved successfully"));

                    // reply with object
                    res.json({ ok: true, status: 201, message: data });
                } else {
                    res.json({
                        ok: false,
                        status: 400,
                        message: 'Something went wrong'
                    });
                }

            }).catch(err => {

                res.json({
                    ok: false,
                    status: 400,
                    message: "Failed to create material."
                });
            })
        }

    } catch (error) {

        res.status(500).send({
            ok: false,
            message: 'Internal server error'
        });
    }
};


/**
 * get single learning material
 * @params {request, response}
 */
exports.getSingleMaterial = async(req, res) => {
    const { id } = req.params;
    let material = new Material({})
    await material.one(id).then(data => {
        if (data) {
            res.json({
                okay: true,
                status: 200,
                message: data
            })
        } else res.json({ okay: false, message: "This material  is no longer on our server" })
    }).catch(err => {
        res.json({
            okay: false,
            status: 404,
            message: "The material you seek for doesn't exist"
        })
    })

};


/**
 * get many learning materials
 * @params {request, response}
 * */
exports.getMaterials = async(req, res) => {
    const material = new Material({});
    await material.all().then(data => {
        if(data.length !== 0 )res.json({ okay: true, status: 200, message: data })
        else res.json({ okay: false, message: "No material at the moment, please check back later" })
    }).catch(err => {
        res.json({ okay: false, message: "An error occur please try again" })
    });

};


/**
 * delete learning material
 * @params {request, response}
 * */
exports.deleteMaterial = async(req, res) => {
    const { id } = req.params;
    let material = new Material({})
    await material.delete(id).then(data => {

        if (data) {
            deleteFileFrom(data.image, () => console.log("image deleted"));
            deleteFileFrom(data.material, () => console.log("material deleted"));
            res.json({
                okay: true,
                status: 200,
                message: "Material deleted successfully."
            });
        } else {

            res.json({
                okay: false,
                message: "Material has already been deleted."
            })
        }
    }).catch(err => {
        res.json({
            okay: false,
            message: "This material doesn't exist."
        })
    })
};


/**
 * update learning material
 * @params {request, response}
 * */
exports.updateMaterial = async(req, res) => {
    const file = files(req.files, ['mp4', 'img', 'mpeg', 'pdf']);
    let reqBody = req.body;
    let imagePath = null,
        learningMaterial = null;
    try {
        if (file.exist()) {
            if (file.getTypes() == ['img']) {
                imagePath = `uploads/material/material_thumbnail/${file.image().name}`;
                moveFile(file.image().path, imagePath);
            } else if (file.getTypes().length > 1) {
                imagePath = `uploads/material/material_thumbnail/${file.image().name}`;
                learningMaterial = `uploads/material/material_thumbnail/${file.other().name}`;
                moveFile(file.image().path, imagePath);
                moveFile(file.other().path, learningMaterial);
            } else {
                learningMaterial = `uploads/material/material_thumbnail/${file.other().name}`;
                moveFile(file.other().path, learningMaterial);
            }
        }
    } catch (e) {
        console.log(file.error())
    } finally {
        reqBody.image = imagePath;
        reqBody.material = learningMaterial;

        const { id } = req.params;
        let material = new Material(reqBody)
        await material.update(id).then(data => {
            if (data) {
                res.json({ okay: true, status: 201, message: data })
            } else res.json({ okay: false, status: 404, message: "This material has been deleted from our server" })
        }).catch(err => {
            res.json({ okay: false, message: "Material not found on our server" })
        })

    }
};