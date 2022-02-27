/** 
 * 
 * test
 * 
 * */

 const mail = require(path.resolve("services/mail", "mail"))
 const message = {
     from: config.sendgrid_from,
     to: "solomonmarvelous97@gmail.com",
     subject: "Plase verify your email address",
     body: `<h1>Welcome to the Learnguage</h1>`,
 }
   
 mail.sendMail(message)