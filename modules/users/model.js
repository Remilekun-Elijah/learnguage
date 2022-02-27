const path = require("path");
const config = require(path.resolve("utils", "config.js"));
const helper = require(path.resolve("utils", "helpers.js"));
const mail = require(path.resolve("services/mail", "mail.js"));
const queries = require("./query");
const Preference = require(path.resolve("modules/preference", "model"));
const Profile = require(path.resolve("modules/profile", "model"));
const Joi = require("joi");
const template = require(path.resolve("services/mail/templates"));
const sms = require(path.resolve("services", "sms/sms.js"));

function generate6RandomNumbers(){
    const num = Math.ceil(Math.random()*999999)
    return num
}


class User {

    #defaultPermissions = "[user]";

    async textMessage (to){
        return sms.text(to, `your Learnguage verification code is: ${generate6RandomNumbers()}`)
    .then(data=> {
        console.log(data)
        return data
    })
    .catch(err=> {
        console.log(err.message)
        throw err.message
    });

    }

    async makeCall (to){
        const num = generate6RandomNumbers().toString().split("").join(" ");
        return sms.call(to, `Your verification number is ${num}`)
            .then(data=> {
                console.log(data)
                return data
            })
            .catch(err=> {
                console.log(err)
                throw err.message
            });

    }

    /**
     * @params {data - object}
     **/ 
    validate(data) {

        const objectModel = Joi.object().keys({
            login_id: Joi.string().email({ minDomainSegments: 2 }).required(),
            password: Joi.string().min(5).max(255),
            repeat_password: Joi.ref('password'),
        });

        return objectModel.validateAsync(data).then(data => data).catch(error => {
            error = error["details"][0];
            if(error.path[0] == "password"){
                    throw new Error("Password must be at least 5 characters long.")
                }else if(error.path[0] == "repeat_password"){
                    throw new Error("The two new passwords did not match.")
                }
                else {

                    const err = error.message.replace(/"login_id"/g, 'Email address')
                    throw {message:err}
                }
        });
    }

    async createOne(body) {
        
        let { password, login_id } = await this.validate(body);

        password = helper.hashPassword(password.trim());

         return queries.createUser({ password, login_id })
        .then(async user => {

            let sid = user.id;
            
            queries.setupProfile(sid).catch((err) => {
                throw new Error("Could not create user profile")
            });
            queries.setupPermission(sid, this.#defaultPermissions).catch((ex) => {
                throw new Error("Could not create user permission")
            });
            new Preference().create(sid).catch(err => {
                throw new Error("Could not create user preference")
            });

            await this.sendVerificationEmail(login_id, sid);

            delete user.password
            return user
        }).catch(error=>{
            console.log(error)
            throw error
        })
    }

    async get (body){
        const {login_id, password} = await this.validate(body)
     
    return queries
        .fetchLoginCredential(login_id)
        .then(data => {

            if(data === undefined) throw new Error("User not found.")
            else if (!helper.comparePassword(data.password, password)) {
                throw new Error("The password you provided is incorrect")
            } else {
                const {id, login_id, created_at, updated_at} = data;
                const token = helper.generateUserToken(id, login_id);

                return {
                    id,
                    login_id,
                    created_at,
                    updated_at, 
                    token
                };
                
            }
        })
        .catch((err) => {
              throw err
        });
    }

    /***
     * @params {body - object}
     **/ 
    async checkIfEmailExists(body){
        /* validates the data in it */ 
        const {login_id} = await this.validate(body);
        /* lookup the database for the provided user email */ 
        return queries.checkIfEmailExists(login_id).then(data=> {
            /*throws an error if user is not found */ 
            if(data== undefined) throw new Error("The user detail does not match any record on our system")
            else {
                
                return data
            }
        })
        .catch(err=>{
            throw err
        })

    }

    /**
     * @params {body - object}
     **/ 
    sendResetPasswordEmail(body){
        /* validates the passed object's content */ 
        return this.checkIfEmailExists(body)
        .then(data=>{
            delete data.password
            return new Profile().purge(data.id).then(async ( {first_name, last_name} = data)=>{
                let userName;
                if(first_name != null && last_name != null){

                    userName = `${first_name} ${last_name}`;
                }
                else userName = data.login_id;
                /* */ 
                await this.resetPasswordEmail(data.login_id, userName);
                return data
            });
        })
    }
    /**
     * @params {email - string, user - string}
     **/ 
    async resetPasswordEmail(email, user){
        // adds extra security
        const secure = email.concat(":"+config.secret) 
        let encryptedLink = helper.encrypt(secure);
        /**Email template data | content **/ 
        const data = {
               userName: user,
               buttonText: "Reset Password",
               buttonLink: `${config.host}resetPasswordPage/?secure=${encryptedLink}`,
               header: true,
               headerText: "Welcome to Learnguage",
               text: "You requested for a password reset link.",
               additionalText: "Kindly use the button below to reset your password.",
            };
            
        mail.sendMail({
            from: config.sendgrid_from,
            to: email,
            subject: "Reset your password",
            body: await template.use("dynamic-template.ejs", data)
        });
    }

    /**
     * @params {secure - string}
     **/ 
    async resetPasswordInfo(secure){

        let login_id = helper.decrypt(secure);
        // remove the extra security
        login_id = login_id.split(":")[0];
        /**lookup users email **/ 
        return this.checkIfEmailExists({login_id}).then(({id}=data)=>{
            /**fetches users profile data **/ 
            return new Profile().purge(id).then(( {first_name, last_name} = data)=>{
                
                if(first_name != null && last_name != null){
                    return {first_name, last_name, login_id}
                }
                else return {login_id, login_id};
            });
        })
    }

    /**
     * @params {body - object}
     **/ 
    async resetPassword(body){
            /** validates it before accessing**/ 
            const data = await  this.validate(body);
            
            let {password, login_id} = data;
            /** fetches credentials **/ 
            return queries.fetchLoginCredential(login_id).then(credentials=>{
                
                if(credentials === undefined){
                    throw new Error("Error! something went wrong.");
                }else {
                    password = helper.hashPassword(password);
                    const {id} = credentials;
                    /** resets password if no error **/ 
                    return queries.updatePassword(password, id).then(data=> data)
                .catch(error=>{
                    throw new Error("Error! Failed to reset password.");
                })
            }
        }).catch(error=>{
                    throw new Error("Error! something went wrong.");
        })
    }

    /**
     * @params {body - object, token - jwt string}
     **/ 
    async changePassword(body, token){
        const {user_id} = helper.verifyToken(token);
        body.login_id = user_id;
        const {old_password} = body;
        /** delete it from the body object 'cus this.validate() within
            checkIfEmailExists() does not accepts it
        **/
        delete body.old_password;

        /** verify users data**/ 
        return this.checkIfEmailExists(body).then(data=>{
            
            if(helper.comparePassword(data.password, old_password)){
                return this.resetPassword(body).then(async ({login_id, id}=data)=>{
                    
                    return new Profile().purge(id).then(async ( {first_name, last_name} = data)=>{
                        let userName;
                        if(first_name != null && last_name != null){
                            userName = `${first_name} ${last_name}`;
                        }
                        else userName = login_id;

                        await this.changePasswordEmail(login_id, userName);
                    });
                })
            }else{
                throw new Error("The old password is incorrect.")
            }
        })

    }

    /**
     * @params {email: string - user string}
     **/ 
    async changePasswordEmail(email, user){
        // adds extra security
        const secure = email.concat(":"+config.secret) 
        let encryptedLink = helper.encrypt(secure);
        const data = {
               userName: user,
               buttonText: "Reset Password",
               buttonLink: `${config.host}resetPasswordPage/?secure=${encryptedLink}`,
               text: "Your password was successfully changed.",
               additionalText: "If you did not change your password, we strongly advice you to reset your password immediately with the button below.",
            };
        mail.sendMail({
            from: config.sendgrid_from,
            to: email,
            subject: "Your password was changed",
            body: await template.use("dynamic-template.ejs", data),
        });
    }

    /**
     * @params {email - strin, id - uuid string}
     **/ 
    async sendVerificationEmail(email, id) {
        let encryptedLink = helper.encrypt(id);
        const data = {
            header: true,
            headerText: "Welcome to Learnguage",
            userName: email,
            text: "We are happy to welcome you on our platform.",
            additionalText: "Kindly use the button below to activate your account.",
            buttonText: "Activate account",
            buttonLink: `${config.host}verifyRegistration/?secure=${encryptedLink}`
        }
        mail.sendMail({
            from: config.sendgrid_from,
            to: email,
            subject: "Please verify your email address",
            body: await template.use("dynamic-template.ejs", data)
        });

    }
    /**
     * @params {secure - string}
     **/ 
    verifyRegistration(secure){
        /* decripts encrypted data*/ 
        const decryptedSecure = helper.decrypt(secure);
        return this.verifyEmail(decryptedSecure).then(({login_id} = emailData) =>{
            /* attempt to verify the acct status */ 
            return this.verifyAccountStatus(login_id).then(({status} = statusData)=>{
                
                if(status === "active") {
                    throw new Error("Account has already been activated")
                }
                else {
                    /* update status if not -active-*/ 
                    return this.updateUserStatus(login_id).then( async ({login_id, status} = user) => {
                        /* send a notification */ 
                        await this.accountActivatedEmail(login_id);
                        return status

                    }).catch(err=> {
                        console.log(err)
                        throw new Error("Error! could not update your account status.")
                    })
                    
                }
            })
            .catch(err=> {
                throw err.message
            })
            
        })
    }

    async accountActivatedEmail(email) {
        const data = {
            userName: email,
            text: "Your account has been activated successfully.",
            additionalText: "You now have full access to all our online resources."
        }
        mail.sendMail({
            from: config.sendgrid_from,
            to: email,
            subject: "Account Activated",
            body: await template.use("dynamic-template.ejs", data)
        });
    };

    async verifyEmail(id){
        return await queries.verifyEmail(id)
    }
    async verifyAccountStatus(login_id){
        return await queries.verifyAccountStatus(login_id);
    }

    async updateUserStatus(login_id){
        return await queries.updateUserStatus(login_id)
    }
    
}

module.exports = User;