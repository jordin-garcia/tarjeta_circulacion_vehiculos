import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsInt, Min } from 'class-validator';

export class CreateVehiculoDto {
    @ApiProperty({ example: 'VIN123456789012345' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    vin: string;

    @ApiProperty({ example: 'CHASIS987654321' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    chasis: string;

    @ApiProperty({ example: 'SERIE-A1' })
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    serie: string;

    @ApiProperty({ example: 2024, description: 'Año del modelo' })
    @IsInt()
    @Min(1900)
    modelo: number;

    @ApiProperty({ example: 4 })
    @IsInt()
    @Min(1)
    cilindros: number;

    @ApiProperty({ example: 5 })
    @IsInt()
    @Min(1)
    asientos: number;

    @ApiProperty({ example: 2 })
    @IsInt()
    @Min(1)
    ejes: number;

    @ApiProperty({ example: 1600, description: 'Centímetros cúbicos del motor' })
    @IsInt()
    @Min(1)
    cc: number;

    @ApiProperty({ example: 1, description: 'Tonelaje' })
    @IsInt()
    @Min(0)
    ton: number;

    @ApiProperty({ example: 1, description: 'ID de la línea del vehículo (Catálogo)' })
    @IsInt()
    id_linea_fk: number;

    @ApiProperty({ example: 1, description: 'ID del tipo de vehículo (Catálogo)' })
    @IsInt()
    id_tipo_fk: number;
}
