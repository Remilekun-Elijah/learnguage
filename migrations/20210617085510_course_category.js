
exports.up = function(knex) {
    return knex.schema.createTable("course_category", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string('code').notNullable();
        table.string('name').notNullable();
        table.string('parent').notNullable();
        table.string('slug').notNullable();
        table.string('thumbnail').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("course_category");
};