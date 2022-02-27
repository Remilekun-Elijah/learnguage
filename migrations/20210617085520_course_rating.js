
exports.up = function(knex) {
    return knex.schema.createTable("course_rating", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.uuid("course")
            .references("id")
            .inTable("course")
            .index();
        table.string("rating_value");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("course_rating");
};