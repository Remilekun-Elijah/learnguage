const path = require("path");
const mjml = require("mjml");
const fs = require("fs");
const ejs = require("ejs");

/**
 * @params {fileName - The file name of the template, object - datas that will be displayed in the email body **/ 
exports.use = async (fileName, object)=>{

    object.header = object.header === false? false : true;
    object.headerText = object.headerText || "";
    object.userName= object.userName || "";
    object.buttonText = object.buttonText || "";
    object.buttonLink = object.buttonLink || "";
    object.additionalText = object.additionalText || "";
    

    const filePath = await ejs.renderFile(path.resolve("services/mail/templates/files", fileName),object);
    const html = mjml(filePath).html;
    console.log(object)
    return html
}