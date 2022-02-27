require('dotenv').config()
require("app-module-path").addPath(__dirname);
const express = require("express");
const fs = require("fs");
const multer = require("multer");
const uuid = require("uuid");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/uploads', express.static(__dirname + '/uploads'));

// setup storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, `${__dirname}/uploads/books`);
        }
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, `${__dirname}/uploads/image`);
        }
    },
    filename: function (req, file, cb) {
        // Set the name of the file in the upload folder
        if (file.mimetype === "application/pdf") {
            cb(null, `${uuid.v4()}.pdf`);
        }
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg"
        ) {
            cb(null, `${uuid.v4()}.png`);
        }
    },
    fileSize: 20000000,
    fileFilter: function (req, file, cb) {
    },
});

const upload = multer({storage: storage}).any();

// upload file
app.post("/single-file", upload, (req, res, next) => {
    // const {username, password} = req.body
    const {title, headline} = req.body;

    if (req.files["image"]) {
        try {
            const imageName = `${uuid.v4().png}`;
            const raw = fs.readFileSync(`uploads/image/${imageName}`);
        } catch (ex) {
            res.status(500).send({
                ok: false,
                error: "Something went wrong on the server",
            });
        }
    }
    res.send(200);
});

// read pdf
app.get("/read/:filename", upload, (req, res, next) => {
    res.send(config.host + 'uploads/image/' + req.params['filename'])
    res
    res.send(200)
})

app.use(express.urlencoded({extended: true}));

// lift off 🚀
app.listen(3000, () => console.log("🚀 Server running on port ", 3000));
