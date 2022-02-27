const path = require("path");
const route = require("express").Router();

/** middlewares */
const { adminAuthorization } = require(path.resolve("middleware", "authorization"));

/** handler */
const settings = require('./handler');

// users handler
route.post('/settings',  settings.createSettings);
route.get('/settings',  settings.getSettings);
route.put('/settings', settings.updateSettings);

module.exports = route;