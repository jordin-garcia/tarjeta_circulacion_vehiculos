import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, Matches } from 'class-validator';

export class CreateEstadosVehiculoDto {
    @ApiProperty({ description: 'Número de Placa', example: 'P-123ABC' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    placa: string;

    @ApiProperty({ description: 'Número de Motor (Puede cambiar si se reemplaza)', example: 'MTR-99887766' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    motor: string;

    @ApiProperty({ description: 'Fecha del cambio o registro (DD/MM/YYYY)', example: '08/05/2026' })
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
        message: 'La fecha de actualización debe tener el formato DD/MM/YYYY',
    })
    fecha_actualizacion: string;

    @ApiProperty({ description: 'Razón del nuevo estado (Ej. Primera placa, Cambio de color, Cambio de uso, etc.)', example: 'Primera Placa' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    motivo_cambio: string;

    @ApiProperty({ description: 'ID del uso asignado al vehículo (Ej. 1=Particular, 2=Comercial)', example: 1 })
    @IsInt()
    id_uso_fk: number;

    @ApiProperty({ description: 'ID del color principal del vehículo', example: 1 })
    @IsInt()
    id_color_fk: number;

    @ApiProperty({ description: 'ID del vehículo físico (chasis/VIN)', example: 1 })
    @IsInt()
    id_vehiculo_fk: number;
}
