import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { HttpErrorInterceptor } from './common/interceptors/http-error.interceptor';

async function bootstrap() {
  // Asegurar que existe el directorio de datos
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }

  const app = await NestFactory.create(AppModule);

  // Configuración de CORS
  app.enableCors();

  // Pipes globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Interceptores globales
  app.useGlobalInterceptors(new HttpErrorInterceptor());

  // Prefijo global para las rutas de la API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
