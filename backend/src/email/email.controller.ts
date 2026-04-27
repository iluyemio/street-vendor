import { Body, Controller, Post, BadRequestException, HttpException } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { UserService } from '../user/user.service';

@Controller('api')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {}

  private getReadableErrorMessage(error: unknown, fallback: string) {
    if (error instanceof HttpException) {
      const response = error.getResponse() as
        | string
        | { message?: string | string[]; error?: string };
      if (typeof response === 'string') return response;
      if (Array.isArray(response?.message)) return response.message[0] || fallback;
      if (typeof response?.message === 'string') return response.message;
      if (typeof response?.error === 'string') return response.error;
    }
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }

  @Post('apply')
  async submitApplication(@Body() payload: SendEmailDto) {
    try {
      const { firstName, lastName, email, organisationName } = payload;

      if (!firstName || !lastName || !email || !organisationName) {
        throw new BadRequestException('All fields are required.');
      }

      const tempPassword = Math.random().toString(36).slice(-8);
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
        const safeMessage =
          'Application was received but we could not send a confirmation email right now. Please contact support if this continues.';
        return {
          success: false,
          message: safeMessage,
          error: safeMessage,
        };
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
    } catch (error) {
      const readableMessage = this.getReadableErrorMessage(error, 'Failed to submit application.');
      return {
        success: false,
        message: readableMessage,
        error: readableMessage,
      };
    }
  }

  @Post('admin/create-vendor-manual')
  async createVendorManually(@Body() payload: {
    firstName: string;
    lastName: string;
    email: string;
    organization_name: string;
    expires_at: string;
    posterAddress?: string;
    mainAddress?: string;
    contactNumber?: string;
    businessSector?: string;
    businessRegion?: string;
    taxId?: string;
    profile_picture?: string;
  }) {
    try {
      const {
        firstName,
        lastName,
        email,
        organization_name,
        expires_at,
        posterAddress,
        mainAddress,
        contactNumber,
        businessSector,
        businessRegion,
        taxId,
        profile_picture,
      } = payload;

      if (!firstName || !lastName || !email || !organization_name || !expires_at) {
        throw new BadRequestException('firstName, lastName, email, organization_name and expires_at are required.');
      }

      const expiresDate = new Date(expires_at);
      if (Number.isNaN(expiresDate.getTime())) {
        throw new BadRequestException('expires_at must be a valid date.');
      }

      const temporaryPassword = Math.random().toString(36).slice(-10);
      const vendorId = `SVV-${Date.now().toString().slice(-6)}`;

      const createdUser = await this.userService.createUser({
        firstName,
        lastName,
        email,
        password: temporaryPassword,
        organization_name,
        posterAddress,
        mainAddress,
        contactNumber,
        businessSector,
        businessRegion,
        taxId,
        profile_picture,
        user_type: 'vendor',
        status: 'VERIFIED' as const,
        vendor_id: vendorId,
        expires_at: expiresDate,
      });

      const manualVendorEmailResult = await this.emailService.sendEmail({
        to: email,
        subject: 'Your Street Vendor Account Has Been Created',
        htmlBody: `
          <h2>Vendor Account Created</h2>
          <p>Hello ${firstName} ${lastName},</p>
          <p>Your vendor account has been created by an administrator and verified automatically.</p>
          <ul>
            <li><strong>Email:</strong> ${email}</li>
            <li><strong>Temporary Password:</strong> ${temporaryPassword}</li>
            <li><strong>Vendor ID:</strong> ${vendorId}</li>
            <li><strong>Valid Until:</strong> ${expiresDate.toDateString()}</li>
          </ul>
          <p>Please sign in and change your password immediately.</p>
        `,
      });

      if (!manualVendorEmailResult.success) {
        const safeMessage =
          'Vendor account was created, but we could not send login credentials by email right now. Please resend later.';
        return {
          success: false,
          message: safeMessage,
          error: safeMessage,
        };
      }

      const { password, ...safeUser } = createdUser as any;
      return {
        success: true,
        user: safeUser,
        message: 'Vendor created, verified, and credentials sent by email.',
      };
    } catch (error) {
      const readableMessage = this.getReadableErrorMessage(error, 'Failed to create vendor manually.');
      return {
        success: false,
        message: readableMessage,
        error: readableMessage,
      };
    }
  }
}
