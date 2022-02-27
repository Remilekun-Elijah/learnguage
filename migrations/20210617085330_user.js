exports.up = function(knex) {
    return knex.schema.createTable("users", (table) => {
        table.uuid("id").notNullable().primary();
        table.string("login_id").notNullable();
        table.unique(["login_id"]);
        table.string("password").notNullable();
        table.string("status").notNullable().defaultsTo("pending");
        table.timestamps(true, true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("users");
};