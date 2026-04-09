import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [EmailModule],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
