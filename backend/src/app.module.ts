import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { CatalogsModule } from './catalogs/catalogs.module';
import { PropietariosModule } from './propietarios/propietarios.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';
import { TarjetasModule } from './tarjetas/tarjetas.module';
import { EstadosVehiculoModule } from './estados-vehiculo/estados-vehiculo.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot(), CatalogsModule, PropietariosModule, VehiculosModule, TarjetasModule, EstadosVehiculoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
