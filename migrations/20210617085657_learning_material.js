exports.up = function(knex) {
    return knex.schema.createTable("learning_material", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string("type");
        table.string("title");
        table.string("thumbnail");
        table.string("description");
        table.string("body");
        table.string("material");
        table.timestamps(true, true);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("learning_material");
};