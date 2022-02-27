// jshint esversion: 8
const path = require("path");
const db = require(path.resolve("db"));


exports.createEvent = async (reqBody) => {
	const {author, title, description, body, image, slug, venue, start_date, end_date} =  reqBody;

	const text = "INSERT INTO event(author, title, description, body, image, slug, venue, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
	const value = [author, title, description, body, image, slug, venue, start_date, end_date];
	const query = await db.query(text, value);

	return query.rows[0];
}


exports.getEvents = async () => {
	const text = `SELECT * FROM event
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
            ) profile ON event.author = profile.sid;`;
	
	
	const query = await db.query(text);

	return query.rows
}

exports.getSingleEventBySlug = async (slug) => {
	const text = `SELECT * FROM event INNER JOIN (
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
            ) profile ON event.author = profile.sid WHERE slug = $1`;
	const value = [slug];
	const query = await db.query(text, value);

	return query.rows[0];
}

exports.deleteEvent = async (id) => {
	const text = "DELETE FROM event WHERE id = $1 RETURNING *";
	const value = [id];
	const query = await db.query(text, value);

	return query.rows[0]
}

exports.getSingleEventById = async (id) =>{
	const text = `SELECT * FROM event WHERE id = '${id}'`;
	const value = [id];
	const query = await db.query(text);

	return query.rows[0];
}

exports.updateEvent = async (id, reqBody) => {
	const { title, description, body, image, slug, venue, start_date, end_date} =  reqBody;

	const text = `UPDATE event SET title = $1, description = $2, body = $3, image = $4, slug = $5, venue = $6, start_date = $7, end_date = $8 WHERE id = '${id}'  RETURNING *`;
	const value = [ title, description, body, image, slug, venue, start_date, end_date];
	const query = await db.query(text, value);

	return query.rows;
}