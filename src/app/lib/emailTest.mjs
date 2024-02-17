import { SendEmailCommand } from '@aws-sdk/client-ses';

import { SESClient } from '@aws-sdk/client-ses';
// Set the AWS Region.
const REGION = 'us-east-1';
// Create SES service object.
const sesClient = new SESClient({ region: REGION });

const createSendEmailCommand = (toAddress, fromAddress) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: 'HTML_FORMAT_BODY',
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'EMAIL_SUBJECT',
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async () => {
  const sendEmailCommand = createSendEmailCommand(
    'cepph2021@gmail.com',
    'ls04af@gmail.com',
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (e) {
    console.error('Failed to send email.');
    return e;
  }
};

export { run };
