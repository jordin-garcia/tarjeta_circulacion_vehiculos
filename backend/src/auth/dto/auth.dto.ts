import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Usuario del agente (ej. admin)', example: 'admin' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Contraseña secreta del agente', example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
