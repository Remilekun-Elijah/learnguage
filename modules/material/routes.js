const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const material = require('./handler');

route.post('/resource', adminAuthorization, upload, material.createMaterial);
route.get("/resource/:id", material.getSingleMaterial);
route.get("/resources", material.getMaterials);
route.delete("/resource/:id", adminAuthorization, material.deleteMaterial);
route.put("/resource/:id", adminAuthorization, upload, material.updateMaterial);

module.exports = route;