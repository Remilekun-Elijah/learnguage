
exports.up = function(knex) {
    return knex.schema.createTable("event", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string("title");
        table.string("thumbnail");
        table.string("description");
        table.string("body");
        table.string("slug");
        table.string("venu");
        table.string("start_date");
        table.string("end_date");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("event");
};