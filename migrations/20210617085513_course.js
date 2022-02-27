
exports.up = function(knex) {
    return knex.schema.createTable("course", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("author")
            .references("id")
            .inTable("users")
            .index();
        table.string("title");
        table.string("slug");
        table.string("short_description");
        table.jsonb("outcomes");
        table.string("language");
        table.string("category");
        table.jsonb("requirements");
        table.decimal("price", 14, 2);
        table.boolean("discount_flag");
        table.decimal("discounted_price");
        table.string("difficulty_level");
        table.string("thumbnail");
        table.string("preview_video_url");
        table.boolean("visibility");
        table.boolean("is_top_course");
        table.string("status");
        table.jsonb("meta_keywords");
        table.string("meta_description");
        table.boolean("is_free_course");
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("course");
};