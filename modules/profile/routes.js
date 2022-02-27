const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const profile = require('./handler');

// update user profile
route.put('/profile', authorization, profile.updateProfile);

// get user profile
route.get('/profile', authorization, profile.getProfile);

module.exports = route;