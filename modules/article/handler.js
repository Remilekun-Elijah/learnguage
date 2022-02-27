const Joi = require("joi");
const path = require("path");
const randomstring = require("randomstring");
const fs = require("fs");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const helper = require(path.resolve("utils", "helpers"));
const { response } = require(path.resolve("utils", "response.js"))
const { Article } = require(__dirname + "/model");


/**
 * create an article
 * @params {request, response}
 * */
exports.createArticle = async(req, res) => {
    let reqBody = { headline, description, body, type } = req.body;
    const objectModel = Joi.object().keys({
        type: Joi.string().required(),
        headline: Joi.string().required(),
        description: Joi.string().required(),
        body: Joi.string().required(),
    });
    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }

    try {
        if (req.files[0]) {
            const imageName = req.files[0].filename,
                filePath = req.files[0].path,
                raw = fs.readFileSync(path.resolve(filePath));
            const uniqueUrl =
                headline.replace(/ /g, "-").toLowerCase() +
                `-${randomstring.generate(10)}`,
                id = helper.getUserIdFromToken(req.headers.authorization);
            reqBody.image = `uploads/article/article_thumbnail/${imageName}`;
            reqBody.slug = uniqueUrl;
            reqBody.author = id;

            const article = new Article(reqBody)

            if (await article.exist()) {

                deleteFileFrom(req.files[0].path, () => console.log('temp file deleted'));
                res.json({
                    ok: false,
                    status: 400,
                    message: "An article with this headline already exist"
                });
            } else {
                // Create the article if it doesnt exist
                await article.create().then(data => {
                    console.log(data)
                        // Move file to parmanent location
                    moveFile(req.files[0].path, `uploads/article/article_thumbnail/${imageName}`,
                        () => console.log("Moved successfully"));
                    // reply with object
                    res.json({ ok: true, status: 201, message: data });
                }).catch(err => {
                    res.json({ ok: false, status: 400, message: err });
                });
            }
        } else
            res.json({ ok: false, status: 400, message: response.file_upload_error });
    } catch (error) {
        deleteFileFrom(req.files[0].path);
        console.log(error);
        res.status(500).send({
            ok: false,
            error: error,
        });
    }
};


/**
 * delete an article
 * @params {request, response}
 * */
exports.deleteArticle = async(req, res) => {
    const { id } = req.params;
    console.log(id)
    const article = new Article({});
    await article.delete(id).then((data) => {
            console.log(data)
            deleteFileFrom(data.image);
            res.json({
                ok: true,
                status: 200,
                message: "Article deleted successfully.",
            });
        })
        .catch((err) => {
            console.log(err);
            res.json({ ok: false, status: 404, message: "Article not found." });
        });

};


/**
 * get many articles
 * @params {request, response}
 * */
exports.getArticles = async(req, res) => {
    /**
     * @TODO add query parameters options [ limit, pages, offset ]
     */


    const article = new Article({});

    await article.all().then(async(data) => {
        console.log(data);
        // for (var i = 0; i < data.length; i++) {
        //     data[i].author = await query.getArticleAuthor(data[i].author);
        // }
        if (data.length === 0) {
            res.json({ ok: true, status: 200, message: "No article at the moment, check back later." })
        } else res.json({ ok: true, status: 200, message: data });
    }).catch((err) => {
        console.log(err);
        res.json({
            ok: false,
            status: 404,
            message: "No article at the moment, check back later."
        });
    })
};


/**
 * get single article
 * @params {request, response}
 * */
exports.getSingleArticle = async(req, res) => {
    const { slug } = req.params;
    const article = new Article({})
    await article.one(slug)
        .then((data) => {
            console.log(data);
            if (data === undefined) {
                res.json({ ok: false, status: 404, message: "Article wasn't found." });
            } else res.json({ ok: true, status: 200, message: data });
        })
        .catch((error) => {

            res.json({ ok: false, status: 404, message: "Article doesn't exist." });
        });
};


/**
 * update article
 * @params {request, response}
 * */
exports.updateArticle = async(req, res) => {
    const { id } = req.params;
    const image = req.files[0];
    const reqBody = { headline, description, body, type } = req.body;
    // to be sure user don't send empty field
    const objectModel = Joi.object().keys({
        type: Joi.string().required(),
        headline: Joi.string().required(),
        description: Joi.string().required(),
        body: Joi.string().required(),
    });
    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }
    reqBody.image = image;
    const article = new Article(reqBody);
    if (await article.exist()) {
        deleteFileFrom(req.files[0].path, () => console.log("temp file deleted"));
        res.json({
            ok: false,
            status: 400,
            message: "An article with this headline already exist"
        });
    } else {
        await article.update(id).then((data) => {

            if (data === undefined) {
                res.json({ ok: false, status: 404, message: "Article wasn't found." });
            } else res.json({ ok: true, status: 201, message: data });
        }).catch((err) => {
            console.log(err);
            res.json({
                ok: false,
                status: 404,
                message: "Could not update article.",
            });
        });
    }
};


exports.addComment = async(req, res) => {
    let reqBody = {};
    const objectModel = Joi.object().keys({
        comment: Joi.string().required(),
    });
    try {
        await objectModel.validateAsync(req.body);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }
    reqBody.comment = req.body.comment;
    const id = helper.getUserIdFromToken(req.headers.authorization);
    const article = req.params.id;
    /* Save user id as value to the user key in reqBody*/
    reqBody.author = id;
    reqBody.article = article;
    const comment = new Comment(reqBody);

    await comment.add().then(data => {
        if (data) res.json({ okay: true, message: data })
        else res.json({ okay: true, message: "Error: failed to save your comment" })
    }).catch(err => {
        res.json({ okay: false, message: "The Article you want to comment on does not exist" });
    })

}

exports.getComments = async(req, res) => {
    const comment = new Comment({});

    await comment.all().then(data => {
        if (data) res.json({ okay: true, status: 200, message: data })
        else res.json({ okay: false, message: "No comment at the moment" });
    }).catch(e => {
        res.json({ okay: false, message: e.message });
    })

}

exports.deleteComment = async(req, res) => {
    const { id } = req.params;

    const comment = new Comment({});
    comment.delete(id).then(data => {
        if (data) res.json({ okay: true, status: 200, message: "Comment deleted successfully." })
        else res.json({ okay: false, message: "This comment is no longer on our server" })
    }).catch(err => res.json({ okay: false, message: "Comment not found" }));
}

exports.updateComment = async(req, res) => {
    const comment = req.body.comment;
    const { id } = req.params;
    const author = helper.getUserIdFromToken(req.headers.authorization)

    try {
        const data = { id, author, comment };
        const comments = new Comment({});
        comments.update(data).then(data => {
            if (data) res.json({ okay: true, status: 201, message: data });
            else if (data === false) res.json({ okay: false, status: 401, message: "This comment is not posted by you" })
            else res.json({ okay: false, status: 404, message: "This comment is no longer on our server" });
        }).catch(err => res.json({ okay: false, message: "Comment not found" }));
    } catch (err) {
        console.log(err);
    }

}

exports.getSingleComment = async(req, res) => {
    const comment = new Comment({});
    const { id } = req.params;

    await comment.one(id).then(data => {
        if (data) res.json({ okay: true, status: 200, message: data })
        else res.json({ okay: false, message: "This comment is no longer on our server" });
    }).catch(e => {
        res.json({ okay: false, message: "Comment not found" });
    })
}