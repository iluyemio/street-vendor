import { Body, Controller, Post, BadRequestException, HttpException, Req } from '@nestjs/common';
import { EmailService } from './email.service';
import { SendEmailDto } from './dto/send-email.dto';
import { UserService } from '../user/user.service';
import type { Request } from 'express';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import QRCode from 'qrcode';

@Controller('api')
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService
  ) {}

  private saveBase64Asset(dataUrl: string | undefined, folder: string) {
    if (!dataUrl || !dataUrl.startsWith('data:')) return undefined;
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return undefined;
    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.includes('png')
      ? 'png'
      : mimeType.includes('jpeg') || mimeType.includes('jpg')
      ? 'jpg'
      : mimeType.includes('pdf')
      ? 'pdf'
      : 'bin';
    const uploadDir = join(process.cwd(), 'uploads', folder);
    mkdirSync(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${randomBytes(6).toString('hex')}.${extension}`;
    const absolutePath = join(uploadDir, filename);
    writeFileSync(absolutePath, Buffer.from(base64Data, 'base64'));
    return `/uploads/${folder}/${filename}`;
  }

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
  async submitApplication(@Body() payload: SendEmailDto, @Req() req: Request) {
    try {
      const {
        firstName,
        lastName,
        email,
        organisationName,
        fullLegalName,
        dateOfBirth,
        governmentIdType,
        governmentIdFront,
        governmentIdBack,
        selfiePhoto,
        currentAddress,
        postcode,
        proofOfAddressUpload,
        mobileNumber,
        emergencyContactName,
        emergencyContactPhone,
        preferredDisplayName,
        shortBio,
        reasonForSelling,
        reasonForSellingCustom,
        affiliatedOrganisation,
        primarySellingLocations,
        intendedWorkingDays,
        intendedWorkingHours,
        productType,
        supervisorName,
        agreeCodeOfConduct,
        agreeApprovedProductsOnly,
        agreeDisplayBadge,
        agreeSuspensionForBreaches,
        gdprConsent,
        digitalSignature,
        isUnder18,
        guardianFullName,
        guardianContactNumber,
        guardianEmail,
        guardianConsent,
      } = payload;

      if (!firstName || !lastName || !email || !organisationName || !fullLegalName || !dateOfBirth) {
        throw new BadRequestException('All fields are required.');
      }
      if (!agreeCodeOfConduct || !agreeApprovedProductsOnly || !agreeDisplayBadge || !agreeSuspensionForBreaches || !gdprConsent) {
        throw new BadRequestException('All required agreements must be accepted.');
      }
      if (isUnder18 && (!guardianFullName || !guardianContactNumber || !guardianEmail || !guardianConsent)) {
        throw new BadRequestException('Guardian details and consent are required for under-18 applicants.');
      }

      const tempPassword = Math.random().toString(36).slice(-8);
      const savedGovernmentIdFront = this.saveBase64Asset(governmentIdFront, 'ids');
      const savedGovernmentIdBack = this.saveBase64Asset(governmentIdBack, 'ids');
      const savedSelfie = this.saveBase64Asset(selfiePhoto, 'selfies');
      const savedProofOfAddress = this.saveBase64Asset(proofOfAddressUpload, 'proof-of-address');
      const userData = {
        firstName,
        lastName,
        email,
        password: tempPassword,
        organization_name: organisationName,
        contactNumber: mobileNumber,
        mainAddress: currentAddress,
        postcode,
        dateOfBirth: new Date(dateOfBirth),
        governmentIdType,
        governmentIdFront: savedGovernmentIdFront || governmentIdFront,
        governmentIdBack: savedGovernmentIdBack || governmentIdBack,
        selfiePhoto: savedSelfie || selfiePhoto,
        proofOfAddressUpload: savedProofOfAddress || proofOfAddressUpload,
        emergencyContactName,
        emergencyContactPhone,
        preferredDisplayName,
        profile_picture: savedSelfie || selfiePhoto,
        shortBio,
        reasonForSelling,
        reasonForSellingCustom,
        affiliatedOrganisation,
        primarySellingLocations,
        intendedWorkingDays,
        intendedWorkingHours,
        productType,
        supervisorName,
        agreeCodeOfConduct,
        agreeApprovedProductsOnly,
        agreeDisplayBadge,
        agreeSuspensionForBreaches,
        gdprConsent,
        digitalSignature,
        submissionTimestamp: new Date(),
        submissionIp: req.ip,
        emailVerified: false,
        mobileVerified: false,
        isUnder18,
        guardianFullName,
        guardianContactNumber,
        guardianEmail,
        guardianConsent,
        accountStatus: 'Active',
        user_type: 'user',
        status: 'PENDING' as const
      };

      const createdUser = await this.userService.createUser(userData);
      await this.userService.requestEmailVerification(email);

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
          <p><strong>Product Type:</strong> ${productType}</p>
          <p><strong>Locations:</strong> ${primarySellingLocations}</p>
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
        message: 'Application submitted successfully. Check your email for verification code.',
        userId: createdUser.id,
        verificationRequired: true,
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
    fullLegalName?: string;
    dateOfBirth?: string;
    governmentIdType?: string;
    governmentIdFront?: string;
    governmentIdBack?: string;
    selfiePhoto?: string;
    currentAddress?: string;
    postcode?: string;
    proofOfAddressUpload?: string;
    mobileNumber?: string;
    email: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    preferredDisplayName?: string;
    shortBio?: string;
    reasonForSelling?: string;
    reasonForSellingCustom?: string;
    affiliatedOrganisation?: string;
    primarySellingLocations?: string;
    intendedWorkingDays?: string;
    intendedWorkingHours?: string;
    productType?: string;
    supervisorName?: string;
    agreeCodeOfConduct?: boolean;
    agreeApprovedProductsOnly?: boolean;
    agreeDisplayBadge?: boolean;
    agreeSuspensionForBreaches?: boolean;
    gdprConsent?: boolean;
    digitalSignature?: string;
    isUnder18?: boolean;
    guardianFullName?: string;
    guardianContactNumber?: string;
    guardianEmail?: string;
    guardianConsent?: boolean;
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
        fullLegalName,
        dateOfBirth,
        governmentIdType,
        governmentIdFront,
        governmentIdBack,
        selfiePhoto,
        currentAddress,
        postcode,
        proofOfAddressUpload,
        mobileNumber,
        email,
        emergencyContactName,
        emergencyContactPhone,
        preferredDisplayName,
        shortBio,
        reasonForSelling,
        reasonForSellingCustom,
        affiliatedOrganisation,
        primarySellingLocations,
        intendedWorkingDays,
        intendedWorkingHours,
        productType,
        supervisorName,
        agreeCodeOfConduct,
        agreeApprovedProductsOnly,
        agreeDisplayBadge,
        agreeSuspensionForBreaches,
        gdprConsent,
        digitalSignature,
        isUnder18,
        guardianFullName,
        guardianContactNumber,
        guardianEmail,
        guardianConsent,
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

      if (!firstName || !lastName || !email || !organization_name || !expires_at || !fullLegalName || !dateOfBirth) {
        throw new BadRequestException('firstName, lastName, email, organization_name and expires_at are required.');
      }
      if (!agreeCodeOfConduct || !agreeApprovedProductsOnly || !agreeDisplayBadge || !agreeSuspensionForBreaches || !gdprConsent) {
        throw new BadRequestException('All required agreements must be accepted.');
      }
      if (isUnder18 && (!guardianFullName || !guardianContactNumber || !guardianEmail || !guardianConsent)) {
        throw new BadRequestException('Guardian details and consent are required for under-18 vendors.');
      }

      const expiresDate = new Date(expires_at);
      if (Number.isNaN(expiresDate.getTime())) {
        throw new BadRequestException('expires_at must be a valid date.');
      }

      const temporaryPassword = Math.random().toString(36).slice(-10);
      const vendorId = `SVV-${Date.now().toString().slice(-6)}`;
      const qrCodeData = await QRCode.toDataURL(vendorId);
      const savedGovernmentIdFront = this.saveBase64Asset(governmentIdFront, 'ids');
      const savedGovernmentIdBack = this.saveBase64Asset(governmentIdBack, 'ids');
      const savedSelfie = this.saveBase64Asset(selfiePhoto, 'selfies');
      const savedProofOfAddress = this.saveBase64Asset(proofOfAddressUpload, 'proof-of-address');
      const savedProfilePicture = this.saveBase64Asset(profile_picture, 'profile-pictures');

      const createdUser = await this.userService.createUser({
        firstName,
        lastName,
        email,
        password: temporaryPassword,
        organization_name,
        contactNumber: mobileNumber || contactNumber,
        mainAddress: currentAddress || mainAddress,
        postcode,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        governmentIdType,
        governmentIdFront: savedGovernmentIdFront || governmentIdFront,
        governmentIdBack: savedGovernmentIdBack || governmentIdBack,
        selfiePhoto: savedSelfie || selfiePhoto,
        proofOfAddressUpload: savedProofOfAddress || proofOfAddressUpload,
        emergencyContactName,
        emergencyContactPhone,
        preferredDisplayName,
        shortBio,
        reasonForSelling,
        reasonForSellingCustom,
        affiliatedOrganisation,
        primarySellingLocations,
        intendedWorkingDays,
        intendedWorkingHours,
        productType,
        supervisorName,
        agreeCodeOfConduct,
        agreeApprovedProductsOnly,
        agreeDisplayBadge,
        agreeSuspensionForBreaches,
        gdprConsent,
        digitalSignature,
        isUnder18,
        guardianFullName,
        guardianContactNumber,
        guardianEmail,
        guardianConsent,
        qrCodeData,
        approvalDate: new Date(),
        reviewerNotes: 'Created manually by admin',
        accountStatus: 'Active',
        posterAddress,
        businessSector,
        businessRegion,
        taxId,
        profile_picture: savedProfilePicture || profile_picture || savedSelfie || selfiePhoto,
        user_type: 'vendor',
        status: 'VERIFIED' as const,
        emailVerified: true,
        mobileVerified: true,
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
