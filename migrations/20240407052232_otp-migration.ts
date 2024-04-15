import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('otp', (table) => {
    table.string('id', 25).primary();
    table.string('password');
    table.string('user_id', 25).notNullable();

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('cascade')
      .onUpdate('cascade');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('otp');
}
