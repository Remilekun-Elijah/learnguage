
exports.up = function(knex) {
    return knex.schema.createTable("user_session", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.string('ip_address').notNullable();
        table.string('data').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_session");
};