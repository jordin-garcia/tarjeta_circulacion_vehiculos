import { PartialType } from '@nestjs/swagger';
import { CreateEstadosVehiculoDto } from './create-estados-vehiculo.dto';

export class UpdateEstadosVehiculoDto extends PartialType(CreateEstadosVehiculoDto) {}
