import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('organizations', (table) => {
    table.string('id', 25).primary();
    table.string('name', 255).notNullable();
    table.string('industry', 255).notNullable();
    table.string('revenue', 255).notNullable();
    table.string('country', 255).notNullable();
    table.string('state', 255).notNullable();
    table.string('city', 255).notNullable();

    table.foreign('industry').references('industry.name').onUpdate('cascade');

    table.foreign('revenue').references('revenue.revenue').onUpdate('cascade');

    table.string('email').unique();

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('organizations');
}
