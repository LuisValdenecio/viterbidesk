import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';
import prisma_global_instance from '@/db';
import { randomUUID } from 'crypto';
import { sendEmail } from '@/app/lib/email';

export async function POST(request: Request) {
  try {
    return NextResponse.json({ status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
