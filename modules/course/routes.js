const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const course = require('./handler');

route.post('/course', authorization, upload, course.createCourse);
route.get('/courses', course.getCourses);
route.get('/course/:slug', course.getSingleCourse);
route.delete('/course/:id', authorization, course.deleteCourse);
route.put('/course/:id', authorization,upload, course.updateCourse);


module.exports = route;