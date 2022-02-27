
exports.up = function(knex) {
    return knex.schema.createTable("job", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string('company').notNullable();
        table.string('job_title').notNullable();
        table.string('job_location').notNullable();
        table.string('employment_type').notNullable();
        table.string('job_description').notNullable();
        table.string('skills').notNullable();
        table.string('how_you_heard_about_us').notNullable();
        table.string('how_you_like_to_receive_applicants').notNullable();
        table.string('screening_questions').notNullable();
        table.string('auto_rate').notNullable();
        table.string('status').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("job");
};