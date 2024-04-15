'use server';

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import prisma_global_instance from '@/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    console.log(formData);

    const response = await prisma_global_instance.organization.create({
      data: {
        name: formData.get('organisation') as string,
        industry: formData.get('industry') as string,
        revenue: formData.get('revenue') as string,
        country: formData.get('country') as string,
        state: formData.get('state') as string,
        city: formData.get('city') as string,
        userToOrganization: {
          create: {
            user_id: formData.get('user_id') as string,
            role_name: 'owner',
          },
        },
      },
    });

    if (response) {
      return NextResponse.json({ success: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
