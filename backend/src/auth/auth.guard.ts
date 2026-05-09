import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // Extraemos el Token del encabezado HTTP
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException('¡Alto ahí! Necesitas tu Gafete Virtual (Token) para acceder aquí.');
    }
    try {
      // Verificamos que el Token fue firmado por nosotros y no ha expirado
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'SECRETO_SAT_2026', // El mismo secreto que usamos en auth.module.ts
      });
      // Si es válido, adjuntamos la información del usuario a la petición
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('El gafete es falso o ya expiró.');
    }
    return true; // Acceso concedido
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    // Busca el encabezado "Authorization: Bearer <token>"
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
