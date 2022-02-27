// jshint esversion: 8
const path = require("path");
const db = require(path.resolve("db"));
const pool = require(path.resolve("db"));
const randomstring = require("randomstring");
const helper = require(path.resolve("utils", "helpers"));
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));

/**
 * Creating a new article in db
 * @params {object} reqBody - containing all article details
 * */
exports.createArticle = async(reqBody) => {
    const { author, type, headline, image, description, body, slug } = reqBody;
    let text = "INSERT INTO article( author, type, headline, image, description, body, slug) VALUES($1," +
        " $2, $3, $4, $5, $6, $7) RETURNING *";
    let value = [author, type, headline, image, description, body, slug ];
    const query = await db.query(text,value);
    console.log(query)
    return query.rows
};

/**
 * Handler for getting all articles with limits and pages
 * @params {in\t} limit - number of articles to be returned
 * @params {int} pages - handle pagination
 * */
exports.getArticles = async() => {
    // return await db.many("SELECT  * FROM article INNER JOIN json_build_object(profile) on article.author = profile.sid");
    const query = await db.query(`
              SELECT
              *
              FROM article
              FULL OUTER JOIN (
              SELECT profile.sid,
              json_agg(
                json_build_object (
                    'id', profile.sid,
                    'firstName', profile.first_name,
                    'lastName', profile.last_name
                )
              ) author
            FROM profile
            GROUP BY profile.sid
            ) profile ON article.author = profile.sid;`);
    // console.log(query.rows)

    return query.rows
};


/**
 * Deliting an article
 * @params {uuid} id
 * */
exports.deleteArticle = async(id) => {
    const query = await db.query(`DELETE FROM article WHERE id = '${id}' RETURNING *`);
    return query.rows[0]
};


/**
 * Check if headline is already in use
 * @params {string} headline
 * */
exports.checkForArticleHeadline = async(headline) => {

    const query = await db.query(`SELECT * FROM article WHERE headline = '${headline}'`);

    return query.rows[0]
};


/**
 * Get profile of an article author
 * @params {uuid} author
 * */
exports.getArticleAuthor = async(author) => {
    const query = await db.query(`SELECT first_name, last_name, other_names, profile_picture, social_links FROM profile WHERE sid = '${author}'`);
    return query.rows[0]
};


/**
 * Check if headline is already in use
 * @params {string} headline
 * */
exports.getSingleArticle = async(slug) => {
    const query = await db.query(`
        SELECT
        *
        FROM article
        INNER JOIN (
        SELECT profile.sid,
        json_agg(
            json_build_object (
        'id', profile.sid,
        'firstName', profile.first_name,
        'lastName', profile.last_name
            )
        ) author
        FROM profile
        GROUP BY profile.sid
        ) profile ON article.author = profile.sid WHERE slug='${slug}';`);
    return query.rows[0]
};


/**
 * Get single article
 * @params {uuid} aticle id
 * */
exports.getSingleArticleById = async(id) => {
    const query = await db.query(`SELECT * FROM article WHERE id = '${id}' `);
    // console.log(query.rows) 
    return query.rows
};


/**
 * update article using article id
 * @params {uuid} id
 * @params {reqBody} accepts update parameters from model
 * */
exports.updateArticle = async(id, reqBody) => {
    
    let savedArticles = await db.query(`SELECT * FROM article WHERE id = '${id}' `);
    savedArticles= savedArticles.rows[0];

    if (savedArticles) {
        const type = reqBody.type ? reqBody.type : savedArticles.type,
            headline = reqBody.headline ? reqBody.headline : savedArticles.headline,
            description = reqBody.description ?
            reqBody.description :
            savedArticles.description,
            body = reqBody.body ? reqBody.body : savedArticles.body,
            slug = helper.isEmpty(headline) ?
            savedArticles.slug :
            headline.replace(/ /g, "-").toLowerCase() +
            `-${randomstring.generate(10)}`;
        let image;
        if (reqBody.image) {

            // Delete old image  if new one is spotted
            deleteFileFrom(savedArticles.image,function (){
                console.log("Deleted")
            });

            // Move new image to parmanent folder

            moveFile(reqBody.image.path, `uploads/article/article_thumbnail/${reqBody.image.filename}`);
            image = `uploads/article/article_thumbnail/${reqBody.image.filename}`;
        } else {
            // if image wasnt uploaded use the previous image
            image = savedArticles.image;

        }

    const query = await db.query(`UPDATE article SET type = '${type}', headline = '${headline}', image= '${image}', description = '${description}', body = '${body}', slug = '${slug}' WHERE id = '${id}' RETURNING *`);

    return query.rows[0]
    }
};

/**
 	* Add comment
	* @Params (data) i.e req.body
**/ 
exports.addComment = async (data)=>{
	const {article, parent_comment, author, comment} = data;
	const text = "INSERT INTO articleComments(article, parent_comment, author, comment) VALUES($1, $2, $3, $4) RETURNING *";
	const value = [article, parent_comment, author, comment];
	const query = await db.query(text, value);

	return query.rows[0];
}

/**
 * update comment
	* @Params (id, data) i.e comment id and data containing comment
**/ 
exports.updateComment = async (id, comment)=>{
	const text = "UPDATE articleComments SET comment = $1 WHERE id = $2 RETURNING *";
	const value = [comment, id ];
	const query = await db.query(text, value);

	return query.rows[0]
}

/**
 * Delete comment
	* @Params (id) i.e comment id
**/ 
exports.deleteComment = async (id) => {
	const text = `DELETE FROM articleComments WHERE id = $1 RETURNING *`;
	const value = [ id ];
	const query = await db.query(text, value);

	return query.rows[0]
}

/**
 * get comments
	* @noParams i.e not accepting parameter
**/ 
exports.getComments = async()=>{
	const text = `SELECT * FROM articleComments 
	INNER JOIN(
		SELECT profile.sid,
		json_agg(
			json_build_object (
			'id', profile.sid,
			'firstName', profile.first_name,
			'lastName', profile.last_name,
			'image', profile.profile_picture 
			)
		) author
		FROM profile
		GROUP BY profile.sid
	) profile ON articleComments.author = profile.sid;`;
	const query = await db.query(text);

	return query.rows
}

/**
 * get one comment
	* @Params (id) i.e id of the comment
**/ 
exports.getOneComment = async(id)=>{
	const text = `SELECT * FROM articleComments 
	INNER JOIN(
		SELECT profile.sid,
		json_agg(
			json_build_object (
			'id', profile.sid,
			'firstName', profile.first_name,
			'lastName', profile.last_name,
			'image', profile.profile_picture 
			)
		) author
		FROM profile
		GROUP BY profile.sid
	) profile ON articleComments.author = profile.sid WHERE id = '${id}';`;
	const query = await db.query(text);

	return query.rows[0]
}
