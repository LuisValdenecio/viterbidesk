import { PrismaClient } from '@prisma/client';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const { token } = params;
  const user = await prisma.user.findFirst({
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
    throw new Error('Invalid token');
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      active: true,
    },
  });

  await prisma.activateToken.update({
    where: {
      token,
    },
    data: {
      activated: new Date(),
    },
  });

  redirect('/setup');
}
