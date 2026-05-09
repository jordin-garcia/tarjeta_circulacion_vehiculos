import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    // Configuramos el "Generador de Gafetes" para que se use en todo el sistema
    JwtModule.register({
      global: true,
      secret: 'SECRETO_SAT_2026', // En producción, esto NUNCA va aquí, sino en .env
      signOptions: { expiresIn: '8h' }, // El token será válido por 8 horas (una jornada laboral)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
