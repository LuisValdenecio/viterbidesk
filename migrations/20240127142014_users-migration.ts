import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.string('id', 25).primary();
    table.string('name', 255);
    table.string('img', 255);
    table.string('email').notNullable().unique();
    table.boolean('active').defaultTo(false);
    table.string('password');
    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}
