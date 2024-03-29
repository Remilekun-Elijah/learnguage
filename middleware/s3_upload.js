const path = require("path")
const config = require(path.resolve("utils", "config.js"));
const multer = require('multer')
const AWS = require('aws-sdk')

exports.s3Config = new AWS.S3({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
})


const storage = multer.memoryStorage()
exports.s3Upload = multer({storage: storage, limits: {fields: 5, fileSize: 6000000, files: 5, parts: 5}}).single('file')
exports.s3MultipleFileUpload = multer({
    storage: storage,
    limits: {fields: 5, fileSize: 6000000, files: 5, parts: 5}
}).single('file')


// working with multer.any()
const multerAny = async (req, res) => {
    let body = req.body
    let files = req.files.forEach(element => {
        if (element.fieldname == 'avatar')
            console.log(element)
    });
    res.send('ok')
}

// working with multer.fields()
exports.multerFields = async (req, res) => {
    let body = req.body
    let files = req.files['avatar']
    console.log(files)
    res.send('ok')
}

// working with multer.fields()
exports.multerSingle = async (req, res) => {
    let body = req.body
    let files = req.file
    console.log(file)
    res.send('ok')
}