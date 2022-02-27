const path = require("path");
const randomstring = require("randomstring");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const helper = require(path.resolve("utils", "helpers"));
const query = require(__dirname + "/query");

class Article {
    #author;
  #type;
  #headline;
  #image;
  #description;
  #body;
  #slug;

    constructor(article) {
        this.#author = article.author
        this.#type = article.type
        this.#headline = article.headline
        this.#image = article.image
        this.#description = article.description
        this.#body = article.body
        this.#slug = article.slug
    }

    getArticle(){
        return {
            author:this.#author,
            type:this.#type,
            headline:this.#headline,
            image:this.#image,
            description:this.#description,
            body:this.#body,
            slug:this.#slug
        }
    }

    async exist(headline){
        headline = headline || this.#headline;
        return await query.checkForArticleHeadline(headline)
    }
    async create() {
        return await query.createArticle(this.getArticle());
    }
    async delete (id){
        return await query.deleteArticle(id)
    }
    async update(id){
        return await query.updateArticle(id,this.getArticle())
    }
    async one (slug){
        return query.getSingleArticle(slug)
    }
    async all (){
        return await query.getArticles()
    }

}

class Comment {
	#article;
	#parent_comment;
	#author;
	#comment;
	
	constructor(data){
		this.#article = data.article;
		this.#parent_comment = data.parent_comment;
		this.#author = data.author;
		this.#comment = data.comment;
	}

	getComment () {
		return {
			article: this.#article,
			parent_comment: this.#parent_comment,
			author: this.#author,
			comment: this.#comment
		}
	}

	async add () {
		/* Get the article user want to comment on */ 
		const articleToCommentOn = await articleQuery.getSingleArticleById(this.#article);
		/* Check the article if it matches any article in the database */ 
		if(articleToCommentOn[0].id === this.#article){
			/* Create the comment if it does*/ 
			let comment = await query.addComment(this.getComment());
			return comment;
		} else return articleToCommentOn
	}

	async all () {
		const comments = await query.getComments();
		return comments;
	}

	async one (id){
		const comment = await query.getOneComment(id);
		return comment;
	}

	async update (data) {
		
		const {id, author, comment} = data;
		let commentToUpdate = await this.one(id);
		if(commentToUpdate){
			if(commentToUpdate.author[0].id === author){
				const updatedComment = await query.updateComment(id, comment);
				return updatedComment;
			}else {
				return false;
			}
		}else return null
	}

	async delete (id) {
		
		const comment = await query.deleteComment(id);
		return comment;
	}
}

module.exports = {
    Article,
    Comment
}