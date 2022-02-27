
exports.up = function(knex) {
    return knex.schema.createTable("lesson", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("section")
            .references("id")
            .inTable("section")
            .index();
        table.uuid("course")
            .references("id")
            .inTable("course")
            .index();
        table.string("title");
        table.string("duration");
        table.string("video_type");
        table.string("video_url");
        table.string("lesson_type");
        table.string("attatchment");
        table.string("attatchment_type");
        table.string("summary");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("lesson");
};