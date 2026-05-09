import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; // <- Nuevo import

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
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
