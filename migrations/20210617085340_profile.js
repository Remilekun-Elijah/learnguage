exports.up = function(knex) {
    return knex.schema.createTable("profile", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid").notNullable();
        table.string("first_name");
        table.string("last_name");
        table.string("other_names");
        table.string("bio");
        table.jsonb("social_links");
        table.string("profile_picture");
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("profile");
};