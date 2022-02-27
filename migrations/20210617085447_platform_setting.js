
exports.up = function(knex) {
    return knex.schema.createTable("platform_setting", (table) => {
        table.uuid("id").notNullable().primary();
        table.string('key').notNullable();
        table.jsonb('value').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("platform_setting");
};