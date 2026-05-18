import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateTarjetaDto } from './create-tarjeta.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTarjetaDto extends PartialType(CreateTarjetaDto) {
    @ApiProperty({ description: 'Motivo de inactivación de la tarjeta', example: 'impago', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    motivo_inactivacion?: string;
}
