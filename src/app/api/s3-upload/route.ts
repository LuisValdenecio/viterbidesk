'use server';

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const SES_CONFIG: any = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

const s3Client = new S3Client(SES_CONFIG);

const prisma = new PrismaClient();

async function uploadFileToS3(buffer: Buffer, fileName: string) {
  const fileBuffer = buffer;
  console.log(fileName);

  const params: any = {
    Bucket: process.env.AWS_PHOTO_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    contentType: 'image/jpg',
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);
  return fileName;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = await uploadFileToS3(buffer, file.name);

    return NextResponse.json({ success: true, fileName });
  } catch (error: any) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
