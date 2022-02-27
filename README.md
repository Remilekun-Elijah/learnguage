default credentials after running migration


-- email is email@domain.com
-- password is abcd12345


1. First you require the upload adaptor file // require(fileAdaptor)
2. Next you you pass in the file(s) that is being uploaded in the first parameter  // file(req.files)
3. It takes a second parameter which is basically an array of the type of files you are accepting // file(..., ['img', 'mp3', 'mp4', 'pdf', etc]);

4. after that the file adaptor has an error method within it, it should be the first thing to check for after passing in the file and the types of file you're expecting // if(file.error()) 
5. The error method returns a string containing the specific error which you can send back to the client // res.json({message: file.error()}); 

6. the file adaptor splits uploaded files in seperate chunks depending on the types of files you are expecting // file.image(), file.pdf(), file.video(), file.audio() etc
7. These methods returns an object // file.pdf().name, file.pdf().path, file.pdf().file
8. if you are expecting multiple files and you have a primary type that must be a specific file i.e img and then the second can be any type of file you might want to call file.other() // returns file that isn't image



<!-- CHANGES -->
##     What's new ?
1. The email template files in **services/mail/templates**.
* The **/files/partials folder:** They are reusable components that'd be used across all the templates.
* To use them: Just import the index.js file in the **services/mail/templates** you can even skip the */index.js* filename and it'll still work fine because its literally the index file in the folder.
* The index.js file contains one function called **use**, its what you're always going to be using
* It accepts 2 parameter; first is the template fileName plus it extension **.ejs**. Second is an object containing the dynamic data that you'd be needing.

2. **dynamic-template:** helps to make email dynamic, and it accepts a couple of informations
> Here is how to use it below 👇
```javascript
	async resetPasswordEmail(email, user){
        // adds extra security
        const secure = email.concat(":"+config.secret) 
        let encryptedLink = helper.encrypt(secure);
        /**
         * In the data which is the params of the .use() function of the template
         * only **text** property is required
         * **buttonText** won't display if **buttonLink** is not present 
         **/
        const data = {
               userName: user,
               buttonText: "Reset Password",
               buttonLink: `${config.host}resetPasswordPage/?secure=${encryptedLink}`,
               header: true, // it's true by default
               headerText: "Welcome to Learnguage", // won't display if *header* is set to false
               text: "You requested for a password reset link.", // only this field is mandatory
               additionalText: "Kindly use the button below to reset your password.",
            };
            
        mail.sendMail({
            from: config.sendgrid_from,
            to: email,
            subject: "Reset your password",
            body: await template.use("dynamic-template.ejs", data)
        });
    }
```
