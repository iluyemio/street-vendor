import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
}
