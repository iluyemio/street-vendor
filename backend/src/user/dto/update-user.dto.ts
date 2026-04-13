import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';
import { Status } from '../../../generated/prisma/enums';

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
  @IsUrl()
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
