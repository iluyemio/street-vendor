import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendEmailDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  organisationName!: string;

  @IsString()
  @IsNotEmpty()
  fullLegalName!: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth!: string;

  @IsString()
  @IsNotEmpty()
  governmentIdType!: string;

  @IsString()
  @IsNotEmpty()
  governmentIdFront!: string;

  @IsString()
  @IsOptional()
  governmentIdBack?: string;

  @IsString()
  @IsNotEmpty()
  selfiePhoto!: string;

  @IsString()
  @IsNotEmpty()
  currentAddress!: string;

  @IsString()
  @IsNotEmpty()
  postcode!: string;

  @IsString()
  @IsNotEmpty()
  proofOfAddressUpload!: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber!: string;

  @IsString()
  @IsNotEmpty()
  emergencyContactName!: string;

  @IsString()
  @IsNotEmpty()
  emergencyContactPhone!: string;

  @IsString()
  @IsNotEmpty()
  preferredDisplayName!: string;

  @IsString()
  @IsNotEmpty()
  shortBio!: string;

  @IsString()
  @IsNotEmpty()
  reasonForSelling!: string;

  @IsString()
  @IsOptional()
  reasonForSellingCustom?: string;

  @IsString()
  @IsNotEmpty()
  affiliatedOrganisation!: string;

  @IsString()
  @IsNotEmpty()
  primarySellingLocations!: string;

  @IsString()
  @IsNotEmpty()
  intendedWorkingDays!: string;

  @IsString()
  @IsNotEmpty()
  intendedWorkingHours!: string;

  @IsString()
  @IsNotEmpty()
  productType!: string;

  @IsString()
  @IsOptional()
  supervisorName?: string;

  @IsBoolean()
  agreeCodeOfConduct!: boolean;

  @IsBoolean()
  agreeApprovedProductsOnly!: boolean;

  @IsBoolean()
  agreeDisplayBadge!: boolean;

  @IsBoolean()
  agreeSuspensionForBreaches!: boolean;

  @IsBoolean()
  gdprConsent!: boolean;

  @IsString()
  @IsNotEmpty()
  digitalSignature!: string;

  @IsBoolean()
  isUnder18!: boolean;

  @IsString()
  @IsOptional()
  guardianFullName?: string;

  @IsString()
  @IsOptional()
  guardianContactNumber?: string;

  @IsEmail()
  @IsOptional()
  guardianEmail?: string;

  @IsBoolean()
  @IsOptional()
  guardianConsent?: boolean;
}
