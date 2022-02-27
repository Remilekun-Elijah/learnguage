
exports.up = function(knex) {
    return knex.schema.createTable("job_application", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string('application_status').notNullable();
        table.timestamp('application_date').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("job_application");
};