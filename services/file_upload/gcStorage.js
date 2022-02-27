const {createWriteStream} = require("fs");
const path = require("path");
const Multer = require("multer");
const {Storage} = require("@google-cloud/storage");
const uuid = require("uuid");

const files = [];


const storage = new Storage({
    projectId: config.gcloud_project,
    credentials: {
        client_email: config.gcloud_client_email,
        private_key: config.gcloud_private_key
    }
});

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const bucket = storage.bucket(config.gcs_bucket);

module.exports = function (app) {
    app.post("/api/imageupload", multer.single("file"), (req, res) => {
        const newFileName = uuidv1() + "-" + req.file.originalname
        const blob = bucket.file(newFileName)
        const blobStream = blog.createWriteStream()

        blobStream.on("error", err => console.log(err));

        blobStream.on("finish", () => {
            const publicUrl = `https://storage.googleapis.com/${config.gcs_bucket}/${blob.name}`
            const imageDetails = JSON.parse(req.body.data)
            imageDetails.image = publicUrl
        })
    })
}