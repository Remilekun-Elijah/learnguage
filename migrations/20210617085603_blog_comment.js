
exports.up = function(knex) {
    return knex.schema.createTable("blog_comment", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.uuid("blog")
            .references("id")
            .inTable("blog")
            .index();
        table.string("comment");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("blog_comment");
};