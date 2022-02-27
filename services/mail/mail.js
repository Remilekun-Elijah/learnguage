const path = require("path");
const config = require(path.resolve("utils", "config.js"));
const nodemailer = require("nodemailer");

exports.sendMail = async function(message) {

    const transporter = nodemailer.createTransport({

        host: "smtp.sendgrid.net",
        port: 587,
        secure: false,
        auth:{
            user: config.sendgrid_username,
            pass: config.sendgrid_api_key
        }
    })
    const packet = {
        from: `"Learnguage" <${config.sendgrid_from}>`,
        to: message.to,
        replyTo: `<${config.sendgrid_from}>`,
        subject: message.subject,
        html: message.body
    };

    try{
        /* send the mail */ 
        await transporter.sendMail(packet)

    }catch(e){
        /* retry if an error occure */ 
        await transporter.sendMail(packet)
    }
};