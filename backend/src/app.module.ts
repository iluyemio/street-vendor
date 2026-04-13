import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [EmailModule, UserModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
