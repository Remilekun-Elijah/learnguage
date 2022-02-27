const path = require("path");
const query = require(__dirname+'/query');
const randomstring = require("randomstring");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));

class Course {
	#author;
	#title;
	#slug;
	#short_description; 
	#outcomes; 
	#languages; 
	#category;
	#sub_category_id;
	#requirements; 
	#price; 
	#discount_flag; 
	#discounted_price;
	#difficulty_level; 
	#thumbnail; 
	#preview_video_url; 
	#visibility; 
	#is_top_course;
	#status; 
	#meta_keywords; 
	#meta_description; 
	#is_free_course;

	constructor(data){
		this.#author = data.author;
		this.#title=data.title;
		this.#slug = this.#title ? data.title.replace(/ /g, '-').toLowerCase() +
                `-${randomstring.generate(10)}` : undefined;
		this.#short_description=data.short_description; 
		this.#outcomes=data.outcomes; 
		this.#languages=data.languages;
		this.#category=data.category;
		this.#sub_category_id=data.sub_category_id;
		this.#requirements=data.requirements; 
		this.#price=data.price; 
		this.#discount_flag=data.discount_flag; 
		this.#discounted_price=data.discounted_price;
		this.#difficulty_level=data.difficulty_level; 
		this.#thumbnail= data.thumbnail; 
		this.#preview_video_url=data.preview_video_url; 
		this.#visibility=data.visibility; 
		this.#is_top_course=data.is_top_course;
		this.#status=data.status; 
		this.#meta_keywords=data.meta_keywords; 
		this.#meta_description=data.meta_description; 
		this.#is_free_course=data.is_free_course;
	}

	getCourse (){
		return{
			author: this.#author,
			title: this.#title,
			slug: this.#slug,
			short_description: this.#short_description,
			outcomes: this.#outcomes,
			languages: this.#languages,
			category: this.#category,
			sub_category_id: this.#sub_category_id ===''? null : this.#sub_category_id,
			requirements: this.#requirements,
			price: this.#price,
			discount_flag: this.#discount_flag,
			discounted_price: this.#discounted_price,
			difficulty_level: this.#difficulty_level,
			thumbnail: this.#thumbnail,
			preview_video_url: this.#preview_video_url,
			visibility: this.#visibility,
			is_top_course: this.#is_top_course,
			status: this.#status,
			meta_keywords: this.#meta_keywords,
			meta_description: this.#meta_description,
			is_free_course: this.#is_free_course
		}
	}

	async create (){
		const course = await query.createCourse(this.getCourse());
		return course;
	}

	async all (){
		const courses = await query.getCourses();
		return courses;
	}

	async one (slug) {
		const course = await query.getSingleCourseBySlug(slug);
		return course;
	}

	async exist (id) {
		const course = await query.getSingleCourseById(id);
		return course;
	}

	async delete (id) {
		const course = await query.deleteCourse(id);
		return course
	}

	async update (id){
		
		const toUpdate = await this.exist(id);
		
		if(toUpdate){
			const data = {
				title: this.#title ? this.#title : toUpdate.title,
				slug:  this.#title ? this.#title.replace(/ /g, '-').toLowerCase() +
	                `-${randomstring.generate(10)}` : toUpdate.slug,
				short_description: this.#short_description ? this.#short_description : toUpdate.short_description,
				outcomes: this.#outcomes ? this.#outcomes : toUpdate.outcomes,

				languages: this.#languages ? this.#languages : toUpdate.languages,
				category: this.#category ? this.#category : toUpdate.category,
				sub_category_id: this.#sub_category_id ? this.#sub_category_id : toUpdate.sub_category_id,
				requirements: this.#requirements ? this.#requirements : toUpdate.requirements,
				price: this.#price ? this.#price : toUpdate.price,
				discount_flag: this.#discount_flag ? this.#discount_flag : toUpdate.discount_flag,
				discounted_price: this.#discounted_price ? this.#discounted_price : toUpdate.discounted_price,
				difficulty_level: this.#difficulty_level ? this.#difficulty_level : toUpdate.difficulty_level,
				preview_video_url: this.#preview_video_url ? this.#preview_video_url : toUpdate.preview_video_url,
				visibility: this.#visibility ? this.#visibility : toUpdate.visibility,
				is_top_course: this.#is_top_course ? this.#is_top_course : toUpdate.is_top_course,
				status: this.#status ? this.#status : toUpdate.status,
				meta_keywords: this.#meta_keywords ? this.#meta_keywords : toUpdate.meta_keywords,
				meta_description: this.#meta_description ? this.#meta_description : toUpdate.meta_description,
				is_free_course: this.#is_free_course ? this.#is_free_course : toUpdate.is_free_course
			};

			if(this.#thumbnail){
				data.thumbnail= this.#thumbnail;
				console.log(this.#thumbnail, toUpdate.thumbnail);
				deleteFileFrom(toUpdate.thumbnail, ()=>console.log("Old course image deleted"))
			}else {
				data.thumbnail = toUpdate.thumbnail
			}
			
			const course = await query.updateCourse(id, data);
			
			return course;
		}else {
			console.log("no file")
			return null
		}
	}
}

module.exports = Course;