import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(authDto: AuthDto) {
    // 1. Verificamos si el username ya está tomado
    const userExists = await this.prisma.usuario.findUnique({
      where: { username: authDto.username },
    });

    if (userExists) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }

    // 2. MAGIA DE BCRYPT: Hasheamos la contraseña
    // El "saltRounds" indica cuántas veces se aplica el algoritmo (10 es el estándar seguro)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(authDto.password, saltRounds);

    // 3. Guardamos al usuario con la contraseña ininteligible
    const newUser = await this.prisma.usuario.create({
      data: {
        username: authDto.username,
        password: hashedPassword,
      },
    });

    return { message: 'Usuario creado exitosamente', username: newUser.username };
  }

  async login(authDto: AuthDto) {
    // 1. Buscamos al usuario
    const user = await this.prisma.usuario.findUnique({
      where: { username: authDto.username },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 2. Comparamos la contraseña en texto plano con el "Hash" de la base de datos
    const isPasswordValid = await bcrypt.compare(authDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // 3. Si todo está bien, le fabricamos su Gafete Virtual (Token)
    const payload = { sub: user.id_usuario, username: user.username };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      message: 'Inicio de sesión exitoso. Guarda tu access_token.'
    };
  }
}
