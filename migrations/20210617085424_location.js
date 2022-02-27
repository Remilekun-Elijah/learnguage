
exports.up = function(knex) {
    return knex.schema.createTable("location", (table) => {
        table.uuid("id").notNullable().primary();
        table.uuid("sid")
            .references("id")
            .inTable("users")
            .index();
        table.string('ip').notNullable();
        table.string('country').notNullable();
        table.string('country_code').notNullable();
        table.string('region_name').notNullable();
        table.string('city').notNullable();
        table.string('region').notNullable();
        table.string('zip').notNullable();
        table.string('lat').notNullable();
        table.string('lon').notNullable();
        table.string('timezone').notNullable();
        table.string('isp').notNullable();
        table.string('org').notNullable();
        table.string('as').notNullable();
        table.timestamps(true, true);
  })
};

exports.down = function(knex) {
    return knex.schema.dropTable("location");
};