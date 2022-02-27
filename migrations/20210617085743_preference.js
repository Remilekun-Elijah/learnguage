exports.up = function(knex) {
    return knex.schema.createTable("preference", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.jsonb("data");
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("preference");
};