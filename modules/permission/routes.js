const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));

/** handler */
const permissions = require('./handler');

// permissions handler
route.get('/permissions', authorization, permissions.getUserPermissions);
route.put('/permissions/update', authorization, permissions.updatePermissions);

module.exports = route;