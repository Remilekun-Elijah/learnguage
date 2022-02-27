const path = require("path");
const query = require(__dirname + "/query");

class Preference {
    #preferences;

    constructor(data) {
        this.#preferences = data
    }

    async create(sid) {
        return await query.createPreference(sid, this.#preferences);
    }
    async delete(sid) {

    }
    async get(sid) {
        return await query.getPreference(sid);
    }
    async update(sid) {
        return await query.updatePreference(sid, this.#preferences);
    }
}


module.exports = Preference;