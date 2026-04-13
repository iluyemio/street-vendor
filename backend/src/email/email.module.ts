import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [EmailController],
  providers: [EmailService]
})
export class EmailModule {}
