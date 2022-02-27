
exports.up = function(knex) {
    return knex.schema.createTable("todo", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.string("content");
        table.timestamp("completed_at");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("todo");
};