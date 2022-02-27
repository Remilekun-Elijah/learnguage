
exports.up = function(knex) {
    return knex.schema.createTable("section", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.uuid("course")
            .references("id")
            .inTable("course")
            .index();
        table.string("title");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("section");
};