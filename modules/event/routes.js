const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const event = require('./handler');

route.post('/event', adminAuthorization, upload, event.createEvent);
route.get('/event/:slug', event.getSingleEvent);
route.get('/events', event.getEvents);
route.delete('/event/:id', adminAuthorization, event.deleteEvent);
route.put('/event/:id', adminAuthorization, upload, event.updateEvent);

module.exports = route;