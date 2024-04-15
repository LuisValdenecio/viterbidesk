import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users_to_organizations', (table) => {
    table.string('id', 25).primary();
    table.string('user_id', 25).notNullable();
    table.string('org_id', 25).notNullable();
    table.string('role_name', 100).notNullable();

    table
      .foreign('user_id')
      .references('users.id')
      .onDelete('cascade')
      .onUpdate('cascade');
    table
      .foreign('org_id')
      .references('organizations.id')
      .onDelete('cascade')
      .onUpdate('cascade');
    table
      .foreign('role_name')
      .references('roles.name')
      .onDelete('cascade')
      .onUpdate('cascade');

    table.timestamp('createdAt').defaultTo(knex.fn.now()).index();
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users_to_organizations');
}
