import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendPermitExpiryEmail(
    to: string,
    employeeName: string,
    endDate: Date,
  ) {
    const formattedDate = endDate.toLocaleDateString('en-GB');

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2 style="color:#d9534f"> ${employeeName} تنبية انتهاء التصريح الخاص ب </h2>
        
        <p>
          ينتهي تصريح العمل بتاريخ 
          <strong>${formattedDate}</strong>.
        </p>
    
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: process.env.MAIL_FROM,
        to,
        subject: '⚠️ تذكير بموعد انتهاء تصريح العمل',
        html,
      });

      this.logger.log(`📧 Permit expiry email sent to ${to}`);
    } catch (error) {
      this.logger.error(
        `❌ Failed to send permit expiry email to ${to}`,
        error.stack,
      );
    }
  }
}
