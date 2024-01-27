import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable("users", (table) => {
        table.string("id", 25).primary();
        table.string("name", 255).notNullable();
        table.string("email").notNullable();
        table.string("password").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now()).index();
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable("users");
}

