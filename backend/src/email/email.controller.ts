import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { UserService } from '../user/user.service';

@Controller('api')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {}

  @Post('apply')
  async submitApplication(@Body() payload: SendEmailDto) {
    const { firstName, lastName, email, organisationName } = payload;

    if (!firstName || !lastName || !email || !organisationName) {
      throw new BadRequestException('All fields are required.');
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-8);

    // Create user account
    const userData = {
      firstName,
      lastName,
      email,
      password: tempPassword,
      organization_name: organisationName,
      user_type: 'user',
      status: 'PENDING' as const
    };

    await this.userService.createUser(userData);

    const applicantSubject = `Street Vendor Verification Application Received`;
    const applicantHtmlBody = `
      <h2>Thank you for applying to Street Vendor Verified</h2>
      <p>Hi ${firstName},</p>
      <p>Your application has been received and your account has been registered with the following credentials:</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Temporary Password:</strong> ${tempPassword}</li>
      </ul>
      <p>Please keep this information safe and log in once your application has been reviewed.</p>
      <p>Organisation: ${organisationName}</p>
    `;

    const applicantResult = await this.emailService.sendEmail({
      to: email,
      subject: applicantSubject,
      htmlBody: applicantHtmlBody,
    });

    if (!applicantResult.success) {
      return { success: false, error: applicantResult.error ?? 'Unable to send confirmation email to applicant.' };
    }

    const adminRecipient = process.env.TO_EMAIL_ADDRESS || process.env.FROM_EMAIL_ADDRESS;
    if (adminRecipient && adminRecipient !== email) {
      const adminSubject = `New Vendor Verification Application from ${firstName} ${lastName}`;
      const adminHtmlBody = `
        <h2>New Vendor Verification Application</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Organisation:</strong> ${organisationName}</p>
        <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        <p>Review and approve the application in the admin dashboard.</p>
      `;
      await this.emailService.sendEmail({
        to: adminRecipient,
        subject: adminSubject,
        htmlBody: adminHtmlBody,
      });
    }

    return {
      success: true,
      message: 'Application submitted successfully. Check your email for login credentials.',
      messageId: applicantResult.messageId,
    };
  }
}
