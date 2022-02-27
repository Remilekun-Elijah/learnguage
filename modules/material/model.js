const path = require("path");
const randomstring = require("randomstring");
const { deleteFileFrom } = require(path.resolve("utils", "helpers"));
const { moveFile } = require(path.resolve("utils", "helpers"));
const query = require(__dirname + "/query");

class Material {
    #author;
    #type;
    #title;
    #image;
    #description;
    #body;
    #material;

    constructor(material) {
        this.#author = material.author
        this.#type = material.type
        this.#title = material.title
        this.#image = material.image
        this.#description = material.description
        this.#body = material.body
        this.#material = material.material
    }

    getMaterial() {
        return {
            author: this.#author,
            type: this.#type,
            title: this.#title,
            image: this.#image,
            description: this.#description,
            body: this.#body,
            material: this.#material
        }
    }

    async exist(id) {
        let data = await query.getSingleMaterialById(id)
        return data
    }
    async create() {
        return await query.createMaterial(this.getMaterial());
    }
    async delete(id) {
        return await query.deleteMaterial(id)
    }
    async update(id) {
        const toUpdate = await this.exist(id);

        if (toUpdate) {
            const type = this.#type || toUpdate.type,
                title = this.#title || toUpdate.title,
                description = this.#description || toUpdate.description,
                body = this.#body || toUpdate.body,
                image = this.#image || toUpdate.image,
                material = this.#material || toUpdate.material;

            if (this.#image) deleteFileFrom(toUpdate.image, () => console.log("Old data deleted successfully"));
            if (this.#material) deleteFileFrom(toUpdate.material, () => console.log("Old data deleted successfully"));

            return await query.updateMaterial(id, { type, title, image, description, body, material })
        } else return null

    }
    async one(id) {
        return query.getSingleMaterial(id)
    }
    async all() {
        return await query.getMaterials()
    }

}


module.exports= Material;