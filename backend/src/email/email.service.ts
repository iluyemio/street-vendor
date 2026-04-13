// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import * as nodemailer from 'nodemailer';

// @Injectable()
// export class EmailService implements OnModuleInit {
//   private readonly logger = new Logger(EmailService.name);
//   private transporter: nodemailer.Transporter;
//   onModuleInit() {
//     const user = process.env.SMTP_USER;
//     const pass = process.env.SMTP_PASSWORD;

//     if (!user || !pass) {
//       this.logger.error(
//         `SMTP credentials missing! SMTP_USER="${user}" SMTP_PASSWORD="${pass ? '***' : 'MISSING'}"`,
//       );
//       throw new Error('SMTP_USER and SMTP_PASSWORD must be set before starting the server.');
//     }

//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.hostinger.com',
//       port: parseInt(process.env.SMTP_PORT || '587'),
//       secure: process.env.SMTP_SECURE === 'true',
//       auth: { user, pass },
//     });

//     this.logger.log(`Email transporter ready (user: ${user})`);
//   }

// async sendEmail({
//   to,
//   subject,
//   htmlBody,
//   from,
// }: {
//   to?: string;
//   subject: string;
//   htmlBody: string;
//   from?: string;
// }) {
//   const fromAddress = from || process.env.FROM_EMAIL_ADDRESS || process.env.SMTP_USER;
//   const toAddress = to || process.env.TO_EMAIL_ADDRESS;

//   if (!toAddress) {
//     this.logger.error('No recipient address provided and TO_EMAIL_ADDRESS is not set.');
//     return { success: false, error: 'No recipient address.' };
//   }

//   try {
//     this.logger.log(`Sending email to: ${toAddress} | subject: "${subject}"`);
//     const response = await this.transporter.sendMail({
//       from: fromAddress,
//       to: toAddress,
//       subject,
//       html: htmlBody,
//     });
//     this.logger.log(`Email sent! Message ID: ${response.messageId}`);
//     return { success: true, messageId: response.messageId };
//   } catch (error: unknown) {
//     const errMsg = error instanceof Error ? error.message : 'Unknown error while sending email.';
//     this.logger.error(`Failed to send email to ${toAddress}: ${errMsg}`);
//     return { success: false, error: errMsg };
//   }
// }
// }


import { Injectable } from '@nestjs/common';
import axios from 'axios';

const FROM_NAME = process.env.FROM_NAME ?? 'Street Vendor Verified';
const FROM_ADDRESS = process.env.FROM_EMAIL_ADDRESS ?? 'support@mysoundsglobal.com';
const ZEPTOMAIL_API_URL = process.env.ZEPTOMAIL_API_URL ?? 'https://api.zeptomail.com/v1.1/email';

@Injectable()
export class EmailService {
  // async sendEmail(to: string, subject: string, htmlBody: string, from = FROM_NAME) {
  async sendEmail({ to, subject, htmlBody, from = FROM_NAME }: { to: string; subject: string; htmlBody: string; from?: string }) {
    if (!process.env.ZEPTOMAIL_API_KEY) {
      const errorMessage = 'ZEPTOMAIL_API_KEY is not configured.';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    const authHeader = process.env.ZEPTOMAIL_API_KEY;

    try {
      console.log(`Attempting to send email to: ${to} with subject: "${subject}"`);

      const response = await axios.post(
        ZEPTOMAIL_API_URL,
        {
          from: {
            address: FROM_ADDRESS,
            name: from,
          },
          to: [
            {
              email_address: {
                address: to,
              },
            },
          ],
          subject,
          htmlbody: htmlBody,
        },
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      console.log('Email sent successfully! Request ID:', response.data.request_id);
      return { success: true, messageId: response.data.request_id };
    } catch (error: unknown) {
    const errMsg = axios.isAxiosError(error)
  ? JSON.stringify(error.response?.data) || error.message
  : error instanceof Error
  ? error.message
  : 'Unknown error while sending email.';
console.error('Full error:', JSON.stringify(error));
      return { success: false, error: errMsg };
    }
  }
}



// ============ ZEPTOMAIL CODE (COMMENTED OUT) ============
/*
import axios from 'axios';

const FROM_NAME = process.env.FROM_NAME ?? 'Street Vendor Verified';
const FROM_ADDRESS = process.env.FROM_EMAIL_ADDRESS ?? 'Insidesuccesssm@gmail.com';
const ZEPTOMAIL_API_URL = process.env.ZEPTOMAIL_API_URL ?? 'https://api.zeptomail.com/v1.1/email';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, htmlBody: string, from = FROM_NAME) {
    if (!process.env.ZEPTOMAIL_API_KEY) {
      const errorMessage = 'ZEPTOMAIL_API_KEY is not configured.';
      console.error(errorMessage);
      return { success: false, error: errorMessage };
    }

    const authHeader = process.env.ZEPTOMAIL_API_KEY;

    try {
      console.log(`Attempting to send email to: ${to} with subject: "${subject}"`);

      const response = await axios.post(
        ZEPTOMAIL_API_URL,
        {
          from: {
            address: FROM_ADDRESS,
            name: from,
          },
          to: [
            {
              email_address: {
                address: to,
              },
            },
          ],
          subject,
          htmlbody: htmlBody,
        },
        {
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/json',
          },
          timeout: 15000,
        },
      );

      console.log('Email sent successfully! Request ID:', response.data.request_id);
      return { success: true, messageId: response.data.request_id };
    } catch (error: unknown) {
      const errMsg = axios.isAxiosError(error)
        ? error.response?.data || error.message
        : error instanceof Error
        ? error.message
        : 'Unknown error while sending email.';
      console.error(`Failed to send email to ${to}:`, errMsg);
      return { success: false, error: errMsg };
    }
  }
}
*/
