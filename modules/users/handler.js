
const path = require("path");
const helper = require(path.resolve("utils", "helpers"));
const User = require(path.resolve("modules/users", "model"));

/**
 * send sms verification
 * @params {request, response}
 **/ 
exports.smsVerification = (req, res) =>{
    new User().textMessage(req.body.login_id).then(data=>{
        res.json({okay: true, data})
    }).catch(error=>{
        res.json({okay: false, message: error})
    })
 }

/**
 * send sms verification via voice call
 * @params {request, response}
 **/ 
exports.callVerification = (req, res) =>{
    new User().makeCall(req.body.login_id).then(data=>{
        res.json({okay: true, data})
    }).catch(error =>{
        res.json({okay: false, message: error})
    })
 }


/**
 * create an account
 * @params {request, response}
 * */
exports.createAccount = (req, res) => {
    
    new User().createOne(req.body).then(data =>{
        res.json({
            ok: true,
            status: 200,
            message: "Account created successfully",
            data

        });
    }).catch(e => {
        const error = {
            okay: false,
            message: e.message
        }

        res.send(error);

    })
};


/**
 * resend verification email
 * @params {request, response}
 * */

exports.resendVerificationEmail = (req, res) => {
    
    const {sendVerificationEmail} = new User();

        new User().checkIfEmailExists(req.body)
        .then(user => {
            const {login_id, id}= user;
            
            sendVerificationEmail(login_id,id);

            res.json({ ok: true , message: "Email sent", data: {login_id, id} });
        })
        .catch((err) => {

            res.json({
                ok: false,
                message: err.message,
            });
        });
};


/**
 * verify registration
 * @params {request, response}
 * */
exports.verifyRegistration = (req, res) => {
    let secure = req.query.secure;
    new User().verifyRegistration(secure)
            .then(status => {
                res.json({ ok: "true", message: "Account Activated", status});
            })
            .catch((error) => {
                res.json({ ok: "false", message:  error});
            });
};


/**
 * sign in
 * @params {request, response}
 * */
exports.signIn = (req, res) => {
    const body = req.body;
    const user = new User();

    user.get(body).then(data=>{
        res.json({
            okay: true,
            message: "Logged in successfully",
            data
        })
    }).catch(err =>{
        res.json({
            okay: false,
            message: err.message
        })
    })
};


exports.sendResetPasswordEmail = (req, res)=>{
    const body = req.body;
    const user = new User();
    /** send user the email link for reset password **/ 
    user.sendResetPasswordEmail(body).then(data=>{

        res.json({
            okay: true,
            message: "Email sent",
            data
        })
    }).catch(error=>{

        res.json({
            okay: false,
            message: error.message
        })
    })
}

exports.resetPassword = (req, res)=>{
    new User().resetPassword(req.body)
        .then(data=>{
            res.json({okay: true, message: "Password reset successful."})
        })
        .catch(error=>{
            res.json({okay: false, error: error.message})
        })
}
/** renders the resey password form **/ 
exports.renderPasswordPage = (req, res) => {
    const secure = req.query.secure,
        user = new User();
        /**populates the form with user's data **/ 
    user.resetPasswordInfo(secure).then(data=>{
        res.render("resetPasswordForm", {data})    
    }).catch(error=>{
        res.json({
            okay: false,
            message: error.message
        })
    })
}

/**
     * @params {req - object, res - object}
     **/  
exports.changePassword =  (req, res)=>{
    /** finally changes the password **/ 
    new User().changePassword(req.body, req.headers.authorization)
        .then(data=>{
            res.json({
                okay: true,
                message: "Password changed successfully",
                data
            })
        }).catch(error=>{
            res.json({
                okay: false,
                error: error.message
            })
        })
}

/**
 * get current user details
 * @params {request, response}
 * */
exports.currentUserDetails = async(req, res) => {
    const token = req.headers.authorization;
     helper.checkPermission(token, ["user"]).then((data) => {

        if (data) {
            let id = helper.getUserIdFromToken(token);
            queries.getUserRecord(id).then((data) => {
                delete data["password"];
                res.send(data);
            });
        } else {
            res.send("failed");
        }
        
    });
};