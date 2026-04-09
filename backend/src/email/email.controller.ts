import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('api')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('apply')
  async submitApplication(@Body() payload: SendEmailDto) {
    const { firstName, lastName, email, organisationName } = payload;

    if (!firstName || !lastName || !email || !organisationName) {
      throw new BadRequestException('All fields are required.');
    }

    const recipient = process.env.TO_EMAIL_ADDRESS ?? process.env.FROM_EMAIL_ADDRESS ?? 'Insidesuccesssm@gmail.com';
    const subject = `Street Vendor Verification Application from ${firstName} ${lastName}`;
    const htmlBody = `
      <h2>Street Vendor Verification Application</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Organisation:</strong> ${organisationName}</p>
      <p>Please follow up with the applicant for next steps.</p>
    `;

    // const result = await this.emailService.sendEmail(recipient, subject, htmlBody);
    const result = await this.emailService.sendEmail({ to: recipient, subject, htmlBody });

    if (!result.success) {
      return { success: false, error: result.error ?? 'Unable to send confirmation email.' };
    }

    return {
      success: true,
      message: 'Application submitted successfully. A confirmation email has been sent.',
      messageId: result.messageId,
    };
  }
}
