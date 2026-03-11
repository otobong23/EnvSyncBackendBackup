
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import Mail from 'nodemailer/lib/mailer'; // still needed for attachment typing
import { ENVIRONMENT } from './constant/enivronment/enviroment';

@Injectable()
export class EmailService {

  private transport = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    port: 587,
    tls: {
      rejectUnauthorized: false,  // This is necessary in some environments (e.g., local testing)
    },
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  })

  async sendMail(to: string, subject: string, content: string): Promise<void> {
    try {
      const sendMail = await this.transport.sendMail({
        from: `"Pedxo" <${ENVIRONMENT.OWNER.OWNER_EMAIL}>`,
        to,
        subject,
        html: content,
      });
      if (!sendMail) throw new Error('failed to send');
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendPlainTextEmail(
    to: string,
    subject: string,
    text: string,
  ): Promise<void> {
    try {
      const sendMail = await this.transport.sendMail({
        from: `"Pedxo" <${ENVIRONMENT.OWNER.OWNER_EMAIL}>`,
        to,
        subject,
        text,
      });
      if (!sendMail) throw new Error('failed to send');
      console.log(`Plain text email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send plain text email to ${to}:`, error);
      throw new Error('Failed to send plain text email');
    }
  }

  async sendEmailWithAttachment(
    to: string,
    subject: string,
    content: string,
    attachments: Mail.Attachment[],
  ): Promise<void> {
    try {
      const sendMail = await this.transport.sendMail({
        from: `"Pedxo" <${ENVIRONMENT.OWNER.OWNER_EMAIL}>`,
        to,
        subject,
        html: content,
        attachments: attachments.map((a) => ({
          filename: a.filename,
          content: a.content as any, // Resend accepts Buffer or string
        })),
      });
      if (!sendMail) throw new Error('failed to send');
      console.log(`Email with attachment sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email with attachment to ${to}:`, error);
      throw new Error('Failed to send email with attachment');
    }
  }
}
