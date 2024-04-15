import { Knex } from 'knex';

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex('industry').del();

  // Inserts seed entries
  await knex('industry').insert([
    { name: 'Technology' },
    { name: 'Education' },
    { name: 'Services' },
  ]);
}
