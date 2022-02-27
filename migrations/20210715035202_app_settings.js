
exports.up = function(knex) {
  return knex.schema.createTable("app_settings", (table) =>{
    table.uuid("id").notNullable().primary();
    table.uuid("sid").notNullable();
    table.jsonb("data").notNullable();
    table.timestamps(true,true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("app_settings");
};
