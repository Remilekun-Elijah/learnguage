const path = require("path");
const db = require(path.resolve("db")); 

exports.createCourse = async (data) => {
	const {author, title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug} = data;
	
	const text = `INSERT INTO course(
	author, title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug)
	VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
	$15, $16, $17, $18, $19, $20, $21) RETURNING *`;
	
	const values = [author, title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug];
	const query = await db.query(text, values);

	return query.rows[0];
}

exports.getCourses = async () => {
	const text = `SELECT * FROM course
		INNER JOIN (
			SELECT profile.sid,
			json_agg(
				json_build_object (
					'id', profile.sid,
					'name', concat(profile.first_name,' ',profile.last_name),
					'image', profile.profile_picture 
				)
			) author
			FROM profile
			GROUP BY profile.sid
		) profile ON course.author = profile.sid
	;`;
	const query = await db.query(text);

	return query.rows;
}

exports.getSingleCourseById = async (id) => {
	const text = `SELECT * FROM course WHERE id = $1`;
	const value = [ id ];

	const query = await db.query(text, value);
	return query.rows[0]
}

exports.getSingleCourseBySlug = async (slug) => {
	const text = `SELECT * FROM course
		INNER JOIN (
			SELECT profile.sid,
			json_agg(
				json_build_object (
					'id', profile.sid,
					'name', concat(profile.first_name,' ',profile.last_name),
					'image', profile.profile_picture 
				)
			) author
			FROM profile
			GROUP BY profile.sid
		) profile ON course.author = profile.sid WHERE slug = $1;`;
	const value = [ slug ];

	const query = await db.query(text, value);
	return query.rows[0]
}

exports.deleteCourse = async (id) => {
	const text = "DELETE FROM course WHERE id = $1 RETURNING *";
	const value = [id];

	const query = await db.query(text, value);

	return query.rows[0]
}

/*
	1"author" uuid, X

    2"title" varchar NOT NULL,
    3"short_description" varchar NOT NULL,
    4"outcomes" varchar,
    5"languages" varchar,
    6"category" uuid NOT NULL,
    7"sub_category_id" uuid,
    8"requirements" varchar,
    9"price" numeric,
    10"discount_flag" bool,
    11"discounted_price" numeric,
    12"difficulty_level" varchar,
    13"thumbnail" varchar,
    14"preview_video_url" varchar,
    15"visibility" bool,
    16"is_top_course" bool,
    17"status" varchar,
    18"meta_keywords" varchar,
    19"meta_description" varchar,
    20"is_free_course" bool
*/

exports.updateCourse = async (id, data) => {
	const { title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug} = data;

	const text = `UPDATE course SET title = $1, short_description = $2, outcomes = $3, languages = $4, category = $5,
	sub_category_id = $6, requirements = $7, price = $8, discount_flag = $9, discounted_price = $10,
	difficulty_level = $11, thumbnail = $12, preview_video_url = $13, visibility = $14, is_top_course = $15,
	status = $16, meta_keywords = $17, meta_description = $18, is_free_course = $19, slug = $20 WHERE id = $21 RETURNING *`;
	
	const values = [title, short_description, outcomes, languages, category,
	sub_category_id, requirements, price, discount_flag, discounted_price,
	difficulty_level, thumbnail, preview_video_url, visibility, is_top_course,
	status, meta_keywords, meta_description, is_free_course, slug, id];
	const query = await db.query(text, values);

	return query.rows[0]
}