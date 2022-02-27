
exports.up = function(knex) {
    return knex.schema.createTable("subscription", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.string('plan').notNullable();
        table.string('status').notNullable();
        table.timestamp('subscribed_date').notNullable();
        table.timestamp('expiry_date').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("subscription");
};