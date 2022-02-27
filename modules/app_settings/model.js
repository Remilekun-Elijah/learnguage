const path = require("path");
const query = require(__dirname + "/query");

class Settings {
    #key;
    #data;

    constructor(data) {
        this.#key = data.key
        this.#data = data.data
    }

    async create(key, data) {
        // return await query.createMaterial(this.getMaterial());
    }
    
    async get(key) {
        
    }
    async update(key) {
    }
}


module.exports= Settings;