
exports.up = function(knex) {
    return knex.schema.createTable("language", (table) => {
        table.uuid("id").notNullable().primary();
        table.string("name");
        table.jsonb("phrase");
        table.string("status");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("language");
};