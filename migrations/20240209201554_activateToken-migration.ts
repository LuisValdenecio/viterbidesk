import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('activate_tokens', (table) => {
    table.string('id', 25).primary();
    table.string('token', 255).notNullable();
    table.boolean('email_sent').defaultTo(false);
    table.timestamp('activated');

    table.string('user_id', 25).notNullable();

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('activate_tokens');
}
