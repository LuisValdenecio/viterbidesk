'use server';

import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { getCsrfToken, signIn } from 'next-auth/react';
import { authOptions } from '../../api/auth/[...nextauth]/[...nextauth]';
import prisma_global_instance from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  try {
    const user = await prisma_global_instance.user.findFirst({
      where: {
        activateToken: {
          AND: [
            {
              activated: null,
            },
            {
              createdAt: {
                gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
              },
            },
            {
              token,
            },
          ],
        },
      },
    });

    await prisma_global_instance.user.update({
      where: {
        id: user?.id,
      },
      data: {
        active: true,
      },
    });

    await prisma_global_instance.activateToken.update({
      where: {
        token,
      },
      data: {
        activated: new Date(),
      },
    });

    // auto sign-in the user:
    const response = await signIn('credentials', {
      email: user?.email,
      password: user?.password,
    });

    console.log(response);

    console.log('user is: ', user);

    if (!user) {
      redirect('/invalidtoken');
    }

    redirect(`/dashboard?initial-steps=1`);
  } catch (error) {
    console.log(error);
  }
}
