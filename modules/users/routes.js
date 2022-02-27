const path = require("path");
const route = require("express").Router();

/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const user = require('./handler');

// users handler
route.post('/user', user.createAccount);
route.post('/login', user.signIn);
route.get('/user', authorization, user.currentUserDetails);
route.get('/verifyRegistration', user.verifyRegistration);
route.post('/resendVerification', user.resendVerificationEmail);
route.post('/resetPassword', user.sendResetPasswordEmail);
route.get('/resetPasswordPage', user.renderPasswordPage);
route.post('/confirmResetPassword', user.resetPassword);
route.post('/changePassword', authorization, user.changePassword);
route.post("/verifyNumberViaCall", user.callVerification);
route.post("/verifyNumberViaSms", user.smsVerification);


module.exports = route;