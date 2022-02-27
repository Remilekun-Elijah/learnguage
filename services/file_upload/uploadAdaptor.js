const path = require("path");
fs = require("fs").promises;
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
module.exports = function(uploadedFiles, expectedFileTypes) {
    try {
        let img = [],
            pdfs = [],
            mp4 = [],
            mp3 = [],
            fileType = [],
            zips = [],
            docs = [],
            others = [],
            err = [],
            srts = [],
            xlsx = [],
            bin = []
        let expectedFile = [];

        function init() {
            /** Check if no file was uploaded **/
            if (uploadedFiles.length == 0) {
                /** Populate the error array with a message **/
                err.push("Error: You must upload a file")
            } else {
                /** Loop through the expected file(s) **/
                expectedFileTypes.forEach((type, expectedFileindex) => {
                        /** Loop through the uploaded files **/

                        // console.log(type)
                        /** find expected file in uploaded file **/
                        uploadedFiles.find((file, uploadedFileindex) => {
                            /** Compare expected file type with uploaded file type **/
                            // console.log(uploadedFileindex);
                            let ftype = [];
                            // for (let i = 0; i < uploadedFiles.length; i++) {

                            // if (type == uploadedFiles[i].type) {


                            ftype.forEach((t, index) => {
                                console.log(i);
                                if (t != file.type) {
                                    ftype.push(uploadedFiles[uploadedFileindex].type);
                                }

                            })

                            // console.log([type, uploadedFiles[i].type]);
                            /** If expected file type is found, remove the file from the array **/

                            // }
                            // }
                            console.log(ftype);
                            if (file.type == type) {
                                // console.log(file.type);
                                /** Push to the expectedFile array **/
                                expectedFile.push(file)

                                /** Populate the fileType array with the uploaded file type **/
                                fileType.push(file.type);

                                /** check the uploaded file type and then split *
                                 the file(s) in their respective array **/
                                switch (file.type) {
                                    case 'pdf':
                                        pdfs.push(file);
                                        break;
                                    case 'mp4':
                                        mp4.push(file);
                                        break;
                                    case 'mp3':
                                        mp3.push(file);
                                        break;
                                    case 'zip':
                                        zips.push(file);
                                        break;
                                    case 'docx':
                                        docs.push(file);
                                    case 'srt':
                                        srts.push(file);
                                        break;
                                    case 'xlsx':
                                        xlsx.push(file);
                                        break;
                                    case 'img':
                                        img.push(file);
                                        break;
                                        /** Populate the error array with a message if *
                                         the uploaded file isnt supported by this module **/
                                    default:
                                        err = [`${uploadedFiles[uploadedFileindex].type} file is not supported`];

                                        /** Delete the uploaded file from our server**/
                                        deleteFileFrom(file.path);
                                        break;
                                }
                                /** Populate the others array with the uploaded file **/
                                if (file.type !== 'img') others.push(file);
                            } else {
                                /** wait till the end of the loop and then check if the expected length
                                 * length is same same as what was uploaded **/
                                if (expectedFileindex == expectedFileTypes.length - 1 && expectedFile.length == uploadedFiles.length - 1) {
                                    // console.log(file);

                                    /** If file exist in our temp folder, push it to our bin array **/
                                    if (file.path) bin.push(file);

                                    /** Populate our error array with a message **/
                                    err = [`The selected file is not supported`];

                                }
                            }

                        })
                    })
                    /** If our bin is not empty **/
                if (bin.length != 0) {
                    /** Loop through it **/
                    bin.forEach(files => {
                        /** Read the files in it **/
                        fs.readFile(files.path).then(file => {
                            /** Check if its there **/
                            if (file) {
                                /** Then delete it **/
                                deleteFileFrom(files.path);
                            }
                        }).catch(e => {})
                    })
                }
            }

        }
        /** call the file processing function **/
        init();

        function getTypes() {

            /**
             * PS: This returns the uploaded file(s) type(s) in our fileType array
             * only if it matches our expected file 
             * else it returns an empty array **/
            return fileType
        }

        /** 
         * PS: Remember our little algorithm doesn't allow 
         * multiple files with same type *
         **/
        function image() {
            /** Return the first data in our img array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = img[0].path,
                name = img[0].filename,
                file = img;
            return { path, name, file }
        }

        function docx() {
            /** Return the first data in our doc array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = doc[0].path,
                name = doc[0].filename,
                file = doc;
            return { path, name, file }
        }

        function video() {
            /** Return the first data in our mp4 array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = mp4[0].path,
                name = mp4[0].filename,
                file = mp4;
            return { path, name, file }

        }

        function audio() {
            /** Return the first data in our mp3 array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = mp3[0].path,
                name = mp3[0].filename,
                file = mp3;
            return { path, name, file }

        }

        function pdf() {
            /** Return the first data in our pdfs array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = pdfs[0].path,
                name = pdfs[0].filename,
                file = pdfs;
            return { path, name, file }
        }

        function zip() {
            /** Return the first data in our zips array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = zips[0].path,
                name = zips[0].filename,
                file = zips;
            return { path, name, file }
        }

        function srt() {
            /** Return the first data in our srts array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = srts[0].path,
                name = srts[0].filename,
                file = srts;
            return { path, name, file }
        }

        function excel() {
            /** Return the first data in our xlsx array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = xlsx[0].path,
                name = xlsx[0].filename,
                file = xlsx;
            return { path, name, file }
        }

        function other() {
            /** Return the first data in our others array 
             * with the path, filename and the file itself *Ref Multer req.file object **/
            const path = others[0].path,
                name = others[0].filename,
                file = others;
            return { path, name, file }
        }

        function exist() {
            /** This data returns true if only the file we are expecting is what was uploaded **/
            let exists = getTypes().length > 0 ? true : false;
            return exists
        }

        function error() {
            /** return the error message within the array **/
            return err[0]
        }

        return { getTypes, image, docx, zip, video, audio, other, exist, excel, srt, error }
    } catch (e) {
        console.log(e.message)
    }
}