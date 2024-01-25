import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);
    let name: string = 'randomName';

    const response = await sql`
            INSERT INTO users(name, email, password) 
                VALUES (${name}, ${email}, ${hashedPassword})
        `;
  } catch (e) {
    console.error({ e });
  }

  return NextResponse.json({ message: 'success' });
}
