
exports.up = function(knex) {
    return knex.schema.createTable("blog_category", (table) => {
        table.uuid("id").notNullable().primary();
        table.string("name");
        table.string("description");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog_category");
};