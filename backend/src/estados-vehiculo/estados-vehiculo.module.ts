import { Module } from '@nestjs/common';
import { EstadosVehiculoService } from './estados-vehiculo.service';
import { EstadosVehiculoController } from './estados-vehiculo.controller';

@Module({
  controllers: [EstadosVehiculoController],
  providers: [EstadosVehiculoService],
})
export class EstadosVehiculoModule {}
