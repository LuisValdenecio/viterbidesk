import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';
import { signIn } from 'next-auth/react';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);
    let name: string = 'randomName';

    const response = sql`
            INSERT INTO users(name, email, password) 
                VALUES (${name}, ${email}, ${hashedPassword})
        `;

    const signInResponse = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    });
  } catch (e) {
    console.error({ e });
  } finally {
  }

  return NextResponse.json({ message: 'success' });
}
