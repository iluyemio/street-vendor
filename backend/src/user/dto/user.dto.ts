import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "@prisma/client";

export class UserDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsString()
  email!: string;

  @IsString()
  password!: string;

  @IsString()
  @IsOptional()
  profile_picture?: string;

  @IsString()
  organization_name!: string;

  @IsString()
  @IsOptional()
  posterAddress?: string;

  @IsString()
  @IsOptional()
  mainAddress?: string;

  @IsString()
  @IsOptional()
  contactNumber?: string;

  @IsString()
  @IsOptional()
  businessSector?: string;

  @IsString()
  @IsOptional()
  businessRegion?: string;

  @IsString()
  @IsOptional()
  taxId?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  governmentIdType?: string;

  @IsString()
  @IsOptional()
  governmentIdFront?: string;

  @IsString()
  @IsOptional()
  governmentIdBack?: string;

  @IsString()
  @IsOptional()
  selfiePhoto?: string;

  @IsString()
  @IsOptional()
  postcode?: string;

  @IsString()
  @IsOptional()
  proofOfAddressUpload?: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  preferredDisplayName?: string;

  @IsString()
  @IsOptional()
  shortBio?: string;

  @IsString()
  @IsOptional()
  reasonForSelling?: string;

  @IsString()
  @IsOptional()
  reasonForSellingCustom?: string;

  @IsString()
  @IsOptional()
  affiliatedOrganisation?: string;

  @IsString()
  @IsOptional()
  primarySellingLocations?: string;

  @IsString()
  @IsOptional()
  intendedWorkingDays?: string;

  @IsString()
  @IsOptional()
  intendedWorkingHours?: string;

  @IsString()
  @IsOptional()
  productType?: string;

  @IsString()
  @IsOptional()
  supervisorName?: string;

  @IsBoolean()
  @IsOptional()
  agreeCodeOfConduct?: boolean;

  @IsBoolean()
  @IsOptional()
  agreeApprovedProductsOnly?: boolean;

  @IsBoolean()
  @IsOptional()
  agreeDisplayBadge?: boolean;

  @IsBoolean()
  @IsOptional()
  agreeSuspensionForBreaches?: boolean;

  @IsBoolean()
  @IsOptional()
  gdprConsent?: boolean;

  @IsString()
  @IsOptional()
  digitalSignature?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  submissionTimestamp?: Date;

  @IsString()
  @IsOptional()
  submissionIp?: string;

  @IsBoolean()
  @IsOptional()
  isUnder18?: boolean;

  @IsString()
  @IsOptional()
  guardianFullName?: string;

  @IsString()
  @IsOptional()
  guardianContactNumber?: string;

  @IsString()
  @IsOptional()
  guardianEmail?: string;

  @IsBoolean()
  @IsOptional()
  guardianConsent?: boolean;

  @IsString()
  @IsOptional()
  qrCodeData?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  approvalDate?: Date;

  @IsString()
  @IsOptional()
  reviewerNotes?: string;

  @IsString()
  @IsOptional()
  accountStatus?: string;

  @IsBoolean()
  @IsOptional()
  emailVerified?: boolean;

  @IsBoolean()
  @IsOptional()
  mobileVerified?: boolean;

  @IsString()
  @IsOptional()
  emailVerificationCode?: string;

  @IsString()
  @IsOptional()
  mobileOtpCode?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  verificationCodeExpiresAt?: Date;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsString()
  user_type!: string;

  @IsString()
  @IsOptional()
  vendor_id?: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  expires_at?: Date;
}