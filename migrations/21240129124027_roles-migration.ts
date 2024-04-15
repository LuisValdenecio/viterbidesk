import type { Knex } from 'knex';
import { transpile } from 'typescript';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.string('name', 100).primary();
    table.string('org_id');

    table
      .foreign('org_id')
      .references('organizations.id')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('roles');
}
