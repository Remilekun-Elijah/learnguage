
exports.up = function(knex) {
    return knex.schema.createTable("currency", (table) => {
        table.uuid("id").notNullable().primary();
        table.string("code");
        table.string("symbol");
        table.string("name");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("currency");
};