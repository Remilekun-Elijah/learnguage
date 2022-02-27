
exports.up = function(knex) {
    return knex.schema.createTable("user_log", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.timestamp('login_date').defaultTo(knex.fn.now());
        table.string("machine");
        table.string("browser");
        table.string("location");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("user_log");
};