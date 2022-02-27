
exports.up = function(knex) {
    return knex.schema.createTable("permission", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index()
            .onDelete("CASCADE");
        table.string("permissions").notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("permission");
};