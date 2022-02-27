const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization } = require(path.resolve("middleware", "authorization"));

/** handler */
const preference = require('./handler');

// users handler
route.post('/preference', preference.createPreference);
route.get('/preference', authorization, preference.getPreference);
route.put('/preference', authorization, preference.updatePreference);
route.delete('/preference', preference.deletePreference);

module.exports = route;