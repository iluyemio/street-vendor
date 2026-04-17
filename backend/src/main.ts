import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true,
    transform:true
  }))
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
