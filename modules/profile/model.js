//jshint esversion:
const path = require("path");
const queries = require("./query.js");
const helper = require(path.resolve("utils", "helpers"));

class Profile {
    #first_name;
    #last_name;
    #other_names;
    #socialLinks;
    #bio;
    constructor(data = {}) {
        this.#first_name = data.firstName;
        this.#last_name = data.lastName;
        this.#other_names = data.otherNames;
        this.#socialLinks = data.socialLinks;
        this.#bio = data.bio;
    }
    async purge(sid) {
        return await queries.getUserPofile(sid)
    }
    profileData() {
        return {
            firstName: this.#first_name,
            lastName: this.#last_name,
            otherNames: this.#other_names,
            socialLinks: this.#socialLinks,
            bio: this.#bio
        }
    }
    async update(sid) {
        const { firstName, lastName, otherNames, socialLinks, bio } = this.profileData();

        const dbData = await this.purge(sid);
        const user = {};

        user.firstName = helper.isEmpty(firstName) ? dbData.first_name : firstName;
        user.lastName = helper.isEmpty(lastName) ? dbData.last_name : lastName;
        user.otherNames = helper.isEmpty(otherNames) ? dbData.other_names : otherNames;
        user.socialLinks = (socialLinks == "" || Object.keys(socialLinks).length==0 || socialLinks == undefined) ? dbData.social_links : socialLinks;
        user.bio = helper.isEmpty(bio) ? dbData.bio : bio;

        const result = await queries.updateProfile(sid, user);
        return result;
    }

    async updatePhoto(link, sid) {
        return await queries.updateProfilePhotoPath(link, sid);
    }
}

module.exports = Profile;