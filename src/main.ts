import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());

  const usersOptions = new DocumentBuilder()
    .addTag('users')
    .setBasePath('api/v1')
    .setHost(process.env.HOST_NAME)
    .build();
  const usersDocument = SwaggerModule.createDocument(app, usersOptions);
  SwaggerModule.setup('/docs', app, usersDocument);

  await app.listen(8090);
}
bootstrap();
