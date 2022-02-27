
exports.up = function(knex) {
    return knex.schema.createTable("blog", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string("title");
        table.string("short_description");
        table.string("body");
        table.string("tag");
        table.string("category");
        table.string("thumbnail");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog");
};