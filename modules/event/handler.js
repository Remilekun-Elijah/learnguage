const Joi = require("joi");
const path = require("path");
const randomstring = require("randomstring");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const helper = require(path.resolve("utils", "helpers"));
const files = require(path.resolve("services/file_upload", "uploadAdaptor"));
const Event = require(__dirname + "/model");


exports.createEvent = async(req, res) => {
    //    initialize file
    const file = files(req.files, ['img']);

    let reqBody = { title, description, body, venue, start_date, end_date } = req.body;

    const objectModel = Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        body: Joi.string().required(),
        venue: Joi.string().required(),
        start_date: Joi.string().required(),
        end_date: Joi.string().required(),
    });

    try {
        await objectModel.validateAsync(reqBody);
    } catch (err) {
        return res.status(401).json(err["details"]);
    }

    try {
        const id = helper.getUserIdFromToken(req.headers.authorization);

        if (file.error()) {
            res.json({ okay: false, message: file.error() })
        } else {

            reqBody.author = id;
            reqBody.image = `uploads/event/event_thumbnail/${file.image().name}`;

            const event = new Event(reqBody);

            event.create().then(data => {
                if (data) {
                    moveFile(file.image().path, data.image)
                    res.json({ okay: true, status: 201, message: data });
                } else {
                    console.log(data)
                    res.json({ okay: false, message: "Error: something went wrong!" })
                }

            }).catch(e => {

                res.json({ okay: false, message: "Error: Could not save your post" })
            })
        }
    } catch (e) {
        res.json({ okay: false, status: 400, message: "Error: wrong file selected" })
    }

}

exports.getEvents = async(req, res) => {
    try {
        let event = new Event({});

        await event.all().then(data => {
            if (data) {
                res.json({ okay: true, status: 200, message: data });
            } else res.json({ okay: false, message: "No event at the moment, please check back later." })
        }).catch(err => {
            res.json({ okay: false, message: "Error: something went wrong!" })
        })
    } catch (e) {
        console.log(e.message)
        res.json({ okay: false, status: 500, message: "Something went wrong" })
    }
};

exports.getSingleEvent = async(req, res) => {
    try {
        const { slug } = req.params;
        const event = new Event({});

        await event.one(slug).then(data => {
            if (data) {
                res.json({ okay: true, status: 200, message: data });
            } else res.json({ okay: false, message: "Event not found." })
        }).catch(err => {
            res.json({ okay: false, message: "Error: something went wrong!" })
        })
    } catch (e) {
        res.json({ okay: false, status: 500, message: "Something went wrong" })
    }

}

exports.deleteEvent = async(req, res) => {
    try {
        const { id } = req.params;
        const event = new Event({});
        event.delete(id).then(data => {
            if (data) {
                deleteFileFrom(data.image);
                res.json({ okay: true, status: 200, message: "Event deleted successfully" })
            } else res.json({ okay: true, status: 304, message: "Error: this event is no longer on our server" });
        }).catch(err => {
            res.json({ okay: false, status: 500, message: "Error: failed to delete event" })
        })
    } catch (e) {
        res.json({ okay: false, status: 500, message: "Error: something went wrong" })
    }
}

exports.updateEvent = async(req, res) => {
    //    initialize file
    const file = files(req.files, ['img']);

    let reqBody = { title, description, body, venue, start_date, end_date } = req.body;

    try {
        const { id } = req.params;

        if (file.exist()) {
            if (file.getTypes()[0] == 'img') {
                reqBody.image = file.image()
            } else reqBody.image = false
        } else reqBody.image = false

        const event = new Event(reqBody);

        event.update(id).then(data => {
            if (data) res.json({ okay: true, status: 201, message: data })
            else res.json({ okay: false, message: "This event is no longer on our server" })
        }).catch(err => {
            res.json({ okay: false, message: err.message })
        })
    } catch (e) {
        res.json({ okay: false, message: "Something went wrong" })
    }
}