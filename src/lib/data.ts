import { sql } from '@vercel/postgres';
import { Customer, Agent } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCustomers() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching customer data...');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Customer>`SELECT * FROM customers`;

    //console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer data.');
  }
}

export async function fetchAgents() {
  // Add noStore() here prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  noStore();
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    //console.log('Fetching agent data...');
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Agent>`SELECT * FROM agents ORDER BY name ASC;`;

    //console.log('Data fetch completed after 3 seconds.');

    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agent data.');
  }
}

export async function fetchAgentById(id: string) {
  noStore();
  try {
    const data = await sql<Agent>`
        SELECT *
        FROM agents
        WHERE agents.id = ${id};
      `;

    const agent = data.rows;

    return agent[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch agent.');
  }
}

export async function fetchCustomerById(id: string) {
  noStore();
  try {
    const data = await sql<Customer>`
        SELECT *
        FROM customers
        WHERE customers.id = ${id};
      `;

    const customers = data.rows;

    return customers[0];
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch customer.');
  }
}
