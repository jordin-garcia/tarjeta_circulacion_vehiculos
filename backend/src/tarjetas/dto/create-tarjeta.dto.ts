import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, IsBoolean, Matches } from 'class-validator';

export class CreateTarjetaDto {
    @ApiProperty({ description: 'Número pre-impreso en el cartón de la tarjeta', example: 10203040 })
    @IsInt()
    @IsNotEmpty()
    numero: number;

    @ApiProperty({ description: 'CUI o identificador único de la tarjeta', example: 'TC-987654321' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    cui_tc: string;

    @ApiProperty({ description: 'Fecha de registro en la SAT (DD/MM/YYYY)', example: '08/05/2026' })
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
        message: 'La fecha de registro debe tener el formato DD/MM/YYYY',
    })
    fecha_registro: string;

    @ApiProperty({ description: 'Fecha de vencimiento (DD/MM/YYYY)', example: '08/05/2027' })
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
        message: 'La fecha de vencimiento debe tener el formato DD/MM/YYYY',
    })
    fecha_vencimiento: string;

    @ApiProperty({ description: 'Fecha en la que se imprimió (DD/MM/YYYY)', example: '08/05/2026' })
    @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
        message: 'La fecha de emisión debe tener el formato DD/MM/YYYY',
    })
    fecha_emision: string;

    @ApiProperty({ description: 'Hora exacta de emisión (HH:MM)', example: '14:30' })
    @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: 'La hora debe tener el formato HH:MM (24 horas)',
    })
    hora_emision: string;

    @ApiProperty({ description: 'Estado de la tarjeta: true=Activa, false=Inactiva', example: true })
    @IsBoolean()
    estado: boolean;

    @ApiProperty({ description: 'NIT del propietario actual', example: '12345678' })
    @IsString()
    @IsNotEmpty()
    nit_propietario_fk: string;

    @ApiProperty({ description: 'ID del estado actual del vehículo (Placa, color, etc.)', example: 1 })
    @IsInt()
    id_estado_vehiculo_fk: number;
}
