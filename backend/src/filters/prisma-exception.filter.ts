import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

/**
 * Filtro centralizado de excepciones para errores de Prisma.
 * Traduce los códigos de error de PostgreSQL/Prisma a respuestas HTTP legibles.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    switch (exception.code) {
      // Violación de restricción UNIQUE (registro duplicado)
      case 'P2002': {
        status = HttpStatus.CONFLICT;
        console.log('Prisma UNIQUE Violation Exception Meta:', exception.meta);
        let fields = 'campo desconocido';
        const target = exception.meta?.target;
        if (Array.isArray(target)) {
          fields = target.join(', ');
        } else if (typeof target === 'string') {
          fields = target;
        } else {
          // Si no está en target (caso de driver adapters en Prisma 7)
          const driverAdapterMsg = (exception.meta as any)?.driverAdapterError?.cause?.originalMessage;
          fields = exception.message + ' ' + (driverAdapterMsg || '');
        }

        const lowerFields = fields.toLowerCase();
        if (lowerFields.includes('cui_tc')) {
          fields = 'CUI de Tarjeta';
        } else if (lowerFields.includes('cui_p') || lowerFields.includes('cui')) {
          fields = 'CUI';
        } else if (lowerFields.includes('username') || lowerFields.includes('usuario_nit')) {
          fields = 'Nombre de Usuario';
        } else if (lowerFields.includes('propietario_pkey') || lowerFields.includes('nit')) {
          fields = 'NIT';
        } else if (lowerFields.includes('vin')) {
          fields = 'VIN';
        } else if (lowerFields.includes('chasis')) {
          fields = 'Chasis';
        } else if (lowerFields.includes('placa')) {
          fields = 'Placa';
        } else if (lowerFields.includes('motor')) {
          fields = 'Motor';
        } else if (lowerFields.includes('numero')) {
          fields = 'Número de Tarjeta';
        }

        message = `Ya existe un registro con ese valor en el campo: ${fields}`;
        break;
      }

      // Registro no encontrado para update/delete
      case 'P2025': {
        status = HttpStatus.NOT_FOUND;
        message = 'El registro que intentas modificar o eliminar no existe';
        break;
      }

      // Violación de llave foránea (el registro referenciado no existe)
      case 'P2003': {
        status = HttpStatus.BAD_REQUEST;
        const field = (exception.meta?.field_name as string) || 'campo desconocido';
        message = `El registro referenciado no existe. Verifica el campo: ${field}`;
        break;
      }

      // Restricción de FK: no se puede borrar porque otros registros dependen de él
      case 'P2014': {
        status = HttpStatus.CONFLICT;
        message = 'No se puede eliminar este registro porque otros datos dependen de él';
        break;
      }

      // Error genérico de Prisma
      default: {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = `Error de base de datos: ${exception.message}`;
        break;
      }
    }

    response.status(status).json({
      statusCode: status,
      error: HttpStatus[status],
      message,
      prismaCode: exception.code,
    });
  }
}

/**
 * Filtro centralizado para todas las excepciones HTTP no controladas.
 * Garantiza un formato de respuesta uniforme.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Si ya es una HttpException de NestJS, respetar su status y mensaje
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      response.status(status).json(
        typeof exceptionResponse === 'string'
          ? { statusCode: status, message: exceptionResponse }
          : exceptionResponse,
      );
      return;
    }

    // Si es un error de Prisma conocido, lo dejamos pasar al PrismaExceptionFilter
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      throw exception;
    }

    // Error totalmente inesperado
    console.error('🔴 Error no controlado:', exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Ocurrió un error interno en el servidor',
    });
  }
}
