
exports.up = function(knex) {
    return knex.schema.createTable("payment", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.uuid("course")
            .references("id")
            .inTable("course")
            .index();
        table.string("payment_type");
        table.decimal("amount");
        table.decimal("platform_revenue");
        table.decimal("instructor_revenue");
        table.string("instructor_payment_status");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("payment");
};