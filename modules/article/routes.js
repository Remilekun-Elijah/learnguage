const path = require("path");
const route = require("express").Router();
/** middlewares */
const { authorization, adminAuthorization } = require(path.resolve("middleware", "authorization"));
const { upload } = require(path.resolve("middleware", "local_upload"));

/** handler */
const article = require('./handler');

// article
route.post('/article', adminAuthorization, upload, article.createArticle);
route.get("/articles", article.getArticles);
route.get("/article/:slug", article.getSingleArticle);
route.delete("/article/:id", adminAuthorization, article.deleteArticle);
route.put("/article/:id", adminAuthorization, upload, article.updateArticle);

// article comment
route.post("/article/comment/:id", authorization, article.addComment);
route.get("/article/comment/all", article.getComments);
route.get("/article/comment/:id", article.getSingleComment);
route.put("/article/comment/:id", authorization, article.updateComment);
route.delete("/article/comment/:id", authorization, article.deleteComment);

module.exports = route;