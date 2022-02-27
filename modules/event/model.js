const path = require("path");
const randomstring = require("randomstring");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const query = require(__dirname + "/query");

class Event {
	#author;
	#title;
	#description;
	#body;
	#image;
	#venue;
	#start_date;
	#end_date;
	#slug;

	constructor(data){
		this.#author = data.author;
		this.#title = data.title;
		this.#description = data.description;
		this.#body = data.body;
		this.#venue = data.venue;
		this.#start_date = data.start_date;
		this.#end_date = data.end_date;
		this.#image = data.image;
	}

	getEvent (){
		this.#slug = this.#title ? this.#title.replace(/ /g, "-").toLowerCase() +
            `-${randomstring.generate(10)}` : '';
		return {
			author: this.#author,
			title: this.#title,
			description: this.#description,
			body: this.#body,
			image: this.#image,
			venue: this.#venue,
			start_date: this.#start_date,
			end_date: this.#end_date,
			slug: this.#slug
		};
	};

	async create () {

		let data = await query.createEvent(this.getEvent());
		return data;
	}

	async one (slug) {
		let data = await query.getSingleEventBySlug(slug)
		return data;
	}

	async all (){
		let data = await query.getEvents();
		return data;
	}

	async delete (id){
		let data = query.deleteEvent(id);
		return data
	}
	async exist (id){
		let data = await query.getSingleEventById(id);
		return data;
	}

	async update (id){
		const toUpdate = await this.exist(id);

        if(toUpdate){
            const title = this.#title || toUpdate.title,
            description = this.#description || toUpdate.description,
            body = this.#body || toUpdate.body,
            image = this.#image ? `uploads/event/event_thumbnail/${this.#image.name}` : toUpdate.image,
            venue = this.venue || toUpdate.venue,
            start_date = this.#start_date || toUpdate.start_date,
            end_date = this.#end_date || toUpdate.end_date,
            slug = this.#title ? this.#title.replace(/ /g, "-").toLowerCase() +
            `-${randomstring.generate(10)}` : toUpdate.slug;

            if(this.#image){
            	moveFile(this.#image.path, `uploads/event/event_thumbnail/${this.#image.name}`);
            	deleteFileFrom(toUpdate.image);
            }
            const data = query.updateEvent(id, {title, description, body, image, venue, start_date, end_date, slug})
        	return data
        }else return null

	}
};

module.exports = Event;