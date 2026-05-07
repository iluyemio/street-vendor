import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEmail, IsOptional, IsString } from 'class-validator';
import { Status } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  profile_picture?: string;

  @IsOptional()
  @IsString()
  organization_name?: string;

  @IsOptional()
  @IsString()
  vendorName?: string;

  @IsOptional()
  @IsString()
  posterAddress?: string;

  @IsOptional()
  @IsString()
  mainAddress?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  businessSector?: string;

  @IsOptional()
  @IsString()
  businessRegion?: string;

  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  governmentIdType?: string;

  @IsOptional()
  @IsString()
  governmentIdFront?: string;

  @IsOptional()
  @IsString()
  governmentIdBack?: string;

  @IsOptional()
  @IsString()
  selfiePhoto?: string;

  @IsOptional()
  @IsString()
  postcode?: string;

  @IsOptional()
  @IsString()
  proofOfAddressUpload?: string;

  @IsOptional()
  @IsString()
  emergencyContactName?: string;

  @IsOptional()
  @IsString()
  emergencyContactPhone?: string;

  @IsOptional()
  @IsString()
  preferredDisplayName?: string;

  @IsOptional()
  @IsString()
  shortBio?: string;

  @IsOptional()
  @IsString()
  reasonForSelling?: string;

  @IsOptional()
  @IsString()
  reasonForSellingCustom?: string;

  @IsOptional()
  @IsString()
  affiliatedOrganisation?: string;

  @IsOptional()
  @IsString()
  primarySellingLocations?: string;

  @IsOptional()
  @IsString()
  intendedWorkingDays?: string;

  @IsOptional()
  @IsString()
  intendedWorkingHours?: string;

  @IsOptional()
  @IsString()
  productType?: string;

  @IsOptional()
  @IsString()
  supervisorName?: string;

  @IsOptional()
  @IsBoolean()
  agreeCodeOfConduct?: boolean;

  @IsOptional()
  @IsBoolean()
  agreeApprovedProductsOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  agreeDisplayBadge?: boolean;

  @IsOptional()
  @IsBoolean()
  agreeSuspensionForBreaches?: boolean;

  @IsOptional()
  @IsBoolean()
  gdprConsent?: boolean;

  @IsOptional()
  @IsString()
  digitalSignature?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  submissionTimestamp?: Date;

  @IsOptional()
  @IsString()
  submissionIp?: string;

  @IsOptional()
  @IsBoolean()
  isUnder18?: boolean;

  @IsOptional()
  @IsString()
  guardianFullName?: string;

  @IsOptional()
  @IsString()
  guardianContactNumber?: string;

  @IsOptional()
  @IsString()
  guardianEmail?: string;

  @IsOptional()
  @IsBoolean()
  guardianConsent?: boolean;

  @IsOptional()
  @IsString()
  qrCodeData?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  approvalDate?: Date;

  @IsOptional()
  @IsString()
  reviewerNotes?: string;

  @IsOptional()
  @IsString()
  accountStatus?: string;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  mobileVerified?: boolean;

  @IsOptional()
  @IsString()
  emailVerificationCode?: string;

  @IsOptional()
  @IsString()
  mobileOtpCode?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  verificationCodeExpiresAt?: Date;

  @IsOptional()
  @IsString()
  user_type?: string;

  @IsOptional()
  @IsString()
  vendor_id?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expires_at?: Date;

  @IsOptional()
  @IsString()
  status?: Status;

  @IsOptional()
  id?: number;
}
