const { db } = require('@vercel/postgres');
const {
 agents,
 customers,
} = require('../src/app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedCustomers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        image_url VARCHAR(255) NOT NULL,
        password TEXT NOT NULL
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedAgents = await Promise.all(
        customers.map(async (customer) => {
        const hashedPassword = await bcrypt.hash(customer.password, 10);
        return client.sql`
        INSERT INTO customers (id, name, email, image_url, password)
        VALUES (${customer.id}, ${customer.name}, ${customer.email}, ${customer.imgUrl}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedAgents.length} customers`);

    return {
      createTable,
      users: insertedAgents,
    };
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedAgents(client) {
    try {
      await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  
      // Create the "customers" table if it doesn't exist
      const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS agents (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          image_url VARCHAR(255) NOT NULL
        );
      `;
  
      console.log(`Created "customers" table`);
  
      // Insert data into the "customers" table
      const insertedAgents = await Promise.all(
        agents.map(
          (agent) => client.sql`
          INSERT INTO agents (id, name, email, image_url)
          VALUES (${agent.id}, ${agent.name}, ${agent.email}, ${agent.image_url})
          ON CONFLICT (id) DO NOTHING;
        `,
        ),
      );
  
      console.log(`Seeded ${insertedAgents.length} customers`);
  
      return {
        createTable,
        customers: insertedAgents,
      };
    } catch (error) {
      console.error('Error seeding Agents:', error);
      throw error;
    }
  }

  async function main() {
    const client = await db.connect();
  
    await seedCustomers(client);
    //await seedAgents(client);
    
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });
  