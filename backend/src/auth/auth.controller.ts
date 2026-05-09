import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Autenticación y Seguridad')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo agente en el sistema' })
  register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión para obtener tu Token JWT' })
  login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }
}
