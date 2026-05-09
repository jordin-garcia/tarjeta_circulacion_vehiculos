import { Module } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { TarjetasController } from './tarjetas.controller';

@Module({
  controllers: [TarjetasController],
  providers: [TarjetasService],
})
export class TarjetasModule {}
