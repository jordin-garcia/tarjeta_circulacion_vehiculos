import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaExceptionFilter, AllExceptionsFilter } from './filters/prisma-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- CORS RESTRINGIDO ---
  // Solo acepta peticiones desde estos orígenes (el frontend)
  app.enableCors({
    origin: [
      'http://localhost:5173',   // Vite dev server
      'http://localhost:4173',   // Vite preview
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // --- VALIDACIONES GLOBALES ---
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // --- FILTROS DE EXCEPCIONES CENTRALIZADOS ---
  // El orden importa: AllExceptionsFilter es el "catch-all" de último recurso
  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new PrismaExceptionFilter(),
  );

  // --- CONFIGURACIÓN DE SWAGGER ---
  const config = new DocumentBuilder()
    .setTitle('API Tarjeta de Circulación')
    .setDescription('Sistema para la gestión de tarjetas de circulación de vehículos en Guatemala')
    .setVersion('1.0')
    .addBearerAuth() // <--- Le decimos a Swagger que soporte nuestro Token
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);
  // --------------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

