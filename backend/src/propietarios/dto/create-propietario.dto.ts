import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreatePropietarioDto {
    @ApiProperty({ description: 'Número de Identificación Tributaria (Llave Primaria)', example: '12345678' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    nit: string;

    @ApiProperty({ description: 'Nombre completo del propietario', example: 'Juan Carlos Pérez López' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    nombre: string;

    @ApiProperty({ description: 'CUI (DPI) del propietario', example: '1234567890101' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    cui_p: string;
}

