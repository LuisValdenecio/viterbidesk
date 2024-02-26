import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'; // ES Modules import
import { ActivateToken, PrismaClient } from '@prisma/client';

const SES_CONFIG: any = {
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
};

const sesClient = new SESClient(SES_CONFIG);
const prisma = new PrismaClient();

export async function sendEmail({
  recipientEmail,
  userId,
  message,
}: {
  recipientEmail: string;
  userId: string;
  message: string;
}) {
  const params = {
    Source: 'ls04af@gmail.com',
    Destination: { ToAddresses: [recipientEmail] },
    Message: {
      Subject: { Data: 'Account verification' },
      Body: { Text: { Data: message } },
    },
  };

  try {
    const sendEmailCommand = new SendEmailCommand(params);
    const res = await sesClient.send(sendEmailCommand);

    if (res['$metadata']?.httpStatusCode !== 200) {
      return {
        message: 'Email was not delivered',
        code: 500,
      };
    } else {
      console.log('survived');
      console.log(userId);

      await prisma.activateToken.update({
        where: {
          user_id: userId,
        },
        data: {
          email_sent: true,
        },
      });

      return {
        message: 'Email was delivered',
      };
    }
  } catch (error) {
    return {
      message: 'Email was not delivered',
      code: 500,
    };
  }
}
