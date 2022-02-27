const Joi = require("joi");
const path = require("path");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const helper = require(path.resolve("utils", "helpers"));
const files = require(path.resolve("services/file_upload", "uploadAdaptor"));

const Course = require(__dirname + "/model");

exports.createCourse = async (req, res) => {
	
	let reqBody = { title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug } = req.body;
	/*
		"author" uuid,
	    "slug" varchar NOT NULL, 
	    "thumbnail" varchar,
	    
	    "title" varchar NOT NULL,
	    "short_description" varchar NOT NULL,
	    "outcomes" varchar,
	    "languages" varchar,
	    "category" uuid NOT NULL,
	    "sub_category_id" uuid,
	    "requirements" varchar,
	    "price" numeric,
	    "discount_flag" bool,
	    "discounted_price" numeric,
	    "difficulty_level" varchar,

	    "preview_video_url" varchar,
	    "visibility" bool,
	    "is_top_course" bool,
	    "status" varchar,
	    "meta_keywords" varchar,
	    "meta_description" varchar,
	    "is_free_course" bool,
	*/ 
    const objectModel = Joi.object().keys({
        title: Joi.string().required(),
        short_description: Joi.string().required(),
        outcomes: Joi.string().allow(null, ''),
        languages: Joi.string().allow(null, ''),
        category: Joi.string().required(),
        sub_category_id: Joi.string().allow(null, ''),
        requirements: Joi.string().allow(null, ''),
        price: Joi.number().min(0),
        discount_flag: Joi.boolean(),
        discounted_price: Joi.number(),
        difficulty_level: Joi.string().allow(null, ''),
        preview_video_url: Joi.string().allow(null, ''),
        visibility: Joi.boolean(),
        is_top_course: Joi.boolean(),
        status: Joi.string().allow(null, ''),
        meta_keywords: Joi.string().allow(null, ''),
        meta_description: Joi.string().allow(null, ''),
        is_free_course: Joi.boolean()
    });

    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }

    try{

		const file = files(req.files, ['img'])
		if(file.error()){
			res.json({okay: false, message: file.error()})
		}else {
			const id = helper.getUserIdFromToken(req.headers.authorization);
			reqBody.author = id;
			/*
				* Will change it when i create the course category
			*/ 
			reqBody.category=id;

			reqBody.thumbnail = `uploads/course/course_thumbnail/${file.image().name}`;
			moveFile(file.image().path, reqBody.thumbnail);

			const course = new Course(reqBody);
			await course.create().then(data=>{
				if(data) res.json({okay: true, status:201, message: data})
				else res.json({okay: false, message: "Failed to create course! :)"})
			}).catch(err=>{
				console.log(err)
				deleteFileFrom(file.image().path)
				res.json({okay: false, message: err.message})
			})

		}
    }catch(error){
    	console.log(error);
    	res.status({okay: false, message: error.message})
    }
}

exports.getCourses = async (req, res)=>{
	const course = new Course({});
	course.all().then(data=>{
		if (data.length>0) res.json({okay: true, status:200, message: data})
		else res.json({okay: false, message: "No courses at the moment please check back later."})
	}).catch(err=>{
		console.log(err);
		res.json({okay: false, message: err.message})
	})
}

exports.getSingleCourse = async (req, res)=>{
	const { slug } = req.params;
	const course = new Course({});
	course.one(slug).then(data=>{
		if (data) res.json({okay: true, status:200, message: data})
		else res.json({okay: false, message: "This course is no longer on our server."})
	}).catch(err=>{
		console.log(err);
		res.json({okay: false, message: "Course not found"})
	})
}

exports.deleteCourse = async (req, res)=> {
	const { id } = req.params;
	const course = new Course({});
	course.delete(id).then(data=>{
		if (data) {
			deleteFileFrom(data.thumbnail, ()=>console.log("course image deleted"))
			res.json({okay: true, status:200, message: "Course deleted successfully."})
		
		}
		else res.json({okay: false, message: "This course is no longer on our server."})
	}).catch(err=>{
		console.log(err);
		res.json({okay: false, message: err.message})
	})
}

exports.updateCourse = async (req, res) =>{
	let reqBody = { title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug } = req.body;

	
	const file = files(req.files, ['img']);
	const {id} = req.params;

	if(file.exist()){
		reqBody.thumbnail = `uploads/course/course_thumbnail/${file.image().name}`;
		
		moveFile(file.image().path, reqBody.thumbnail);
	}


		const course = new Course(reqBody);
		// console.log(course.getCourse())
		course.update(id).then(data=>{

			if(data) res.json({okay: true, status: 201, message: data})
			else res.json({okay: false, status: 304, message: "Course not found."})
		}).catch(err=>{
			console.log(err);
			res.json({okay: false, message: "Course not found!"})
		})
	

}