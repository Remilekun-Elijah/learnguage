
exports.up = function(knex) {
    return knex.schema.createTable("newsletter", (table) => {
        table.uuid("id").notNullable().primary();
        table.string("email");
        table.string("name");
        table.string("status");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("newsletter");
};