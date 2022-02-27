const multer = require('multer')
const AWS = require('aws-sdk')
const uuid = require('uuid')

const s3 = new AWS.S3({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).any()

app.post('/upload', upload, (req, res) => {
    let myFile = req.file.originalname.split(".")
    const fileType = myFile[myFile.length - 1]

    const params = {
        Bucket: config.aws_bucket_name + "/public/images",
        Key: `${uuid.v4()}.${fileType}`,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if (error) {
            res.status(500).send(error)
        }
        res.status(200).send(data)
    })
})

app.post('/textUpload', upload, function (req, res, next) {
    // req.body contains the text fields
    console.log(req.body['username'])
    req.files.forEach(function (f) {
        console.log(f);
        if (f['fieldname'] == 'image') {
            console.log(f['originalname'])
        }
    });
    res.send("Done")
})

app.post('/login', upload, function (req, res, next) {
    console.log(req.body.data["username"])
    console.log(req.body.data["password"])
    res.send("done")
})



const s3 = new AWS.S3({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
    bucketName: config.aws_bucket_name,
});

/** update profile photo */
const updateProfilePhoto = async (req, res) => {
    if (req.file) {
        let supportedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (supportedFileTypes.includes(req.file.mimetype)) {
            let sid = helper.getUserIdFromToken(req.headers.authorization);
            try {
                let myFile = req.file.originalname.split(".");
                const fileType = myFile[myFile.length - 1];
                const params = {
                    Bucket: config.aws_bucket_name + "/uploads/user_image",
                    Key: `${sid}.${fileType}`,
                    Body: req.file.buffer,
                };

                s3.upload(params, (error, data) => {
                    let profilePhotoPath = data.Location;
                    queries.updateProfilePhotoPath(sid, profilePhotoPath);
                    if (error) {
                        res.status(500).send(error);
                    }
                    // image url "https://learnguage.s3.amazonaws.com/uploads/user_image/example.png"
                    res.json({
                        ok: "true",
                        status: 200,
                        message: "Profile Photo Updated",
                        url: data.Key,
                    });
                });
            } catch (err) {
                return res.json({success: false, message: err});
            }
        } else {
            return res.json({success: false, message: "Invalid File Type"});
        }
    }
};

/** get user image */
const download = async (req, res) => {
    const key = req.query.key;
    const downloadParams = {
        Key: key,
        Bucket: config.aws_bucket_name
    }
    let readStreamValue = s3.getObject(downloadParams).createReadStream()
    readStreamValue.pipe(res)
}