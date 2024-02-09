import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';
import { PrismaClient } from '@prisma/client';
import { signIn } from 'next-auth/react';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    // validate email and password
    console.log({ email, password });

    const hashedPassword = await hash(password, 10);
    let name: string = 'randomName';

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email,
        active: true,
        password: hashedPassword,
        activateToken: {
          create: {
            token: 'randomToken',
            activated: new Date(),
          },
        },
      },
    });
  } catch (e) {
    console.error({ e });
  }

  return NextResponse.json({ message: 'success' });
}
