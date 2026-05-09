import { PartialType } from '@nestjs/swagger';
import { CreateTarjetaDto } from './create-tarjeta.dto';

export class UpdateTarjetaDto extends PartialType(CreateTarjetaDto) {}
