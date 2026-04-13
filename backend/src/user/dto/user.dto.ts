import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { Status } from "../../../generated/prisma/enums";

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