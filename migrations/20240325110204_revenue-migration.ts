import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('revenue', (table) => {
    table.string('revenue', 255).primary();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('revenue');
}
