'use server';

import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';
import { getCsrfToken } from 'next-auth/react';
import { authOptions } from '../../api/auth/[...nextauth]/[...nextauth]';
import prisma_global_instance from '@/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;

  console.log(token);

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

  if (!user) {
    redirect('/invalidtoken');
  }

  redirect(`/invite-setup/${token}`);
}
