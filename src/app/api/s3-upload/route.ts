'use server';

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

const SES_CONFIG: any = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

const s3Client = new S3Client(SES_CONFIG);

const prisma = new PrismaClient();

async function uploadFileToS3(
  buffer: Buffer,
  fileName: string,
  user_id: string,
) {
  const fileBuffer = buffer;
  const imgExt = fileName.split('.')[fileName.split('.').length - 1];

  const params: any = {
    Bucket: process.env.AWS_PHOTO_BUCKET_NAME,
    Key: `${user_id}.${imgExt}`,
    Body: fileBuffer,
    contentType: ['image/jpg', 'image/png'],
  };

  const command = new PutObjectCommand(params);

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: user_id,
      },
      select: {
        img: true,
      },
    });

    console.log(user?.img?.split('/')[user?.img?.split('/').length - 1]);

    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_PHOTO_BUCKET_NAME,
      Key: user?.img?.split('/')[user?.img?.split('/').length - 1],
    });

    const response = await s3Client.send(deleteCommand);
    console.log(response);
  } catch (err) {
    console.error(err);
  }

  try {
    await s3Client.send(command);
    await prisma.user.update({
      where: {
        id: user_id,
      },
      data: {
        img: `https://viterbidesk-photo-bucket.s3.amazonaws.com/${user_id}.${imgExt}`,
      },
    });

    return `https://viterbidesk-photo-bucket.s3.amazonaws.com/${user_id}.${imgExt}`;
  } catch (error) {
    console.log(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const user_id = formData.get('user-id');

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name, user_id);

    return NextResponse.json({ success: true, fileName: fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
