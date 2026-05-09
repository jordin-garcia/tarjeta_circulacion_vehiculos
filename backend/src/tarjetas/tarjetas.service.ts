import { Injectable } from '@nestjs/common';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TarjetasService {
  constructor(private prisma: PrismaService) { }

  // Función de ayuda: Corta el DD/MM/YYYY y lo vuelve objeto Date
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  }

  // Función de ayuda: Convierte HH:MM en objeto Date (como exige la BD)
  private parseTime(timeStr: string): Date {
    return new Date(`1970-01-01T${timeStr}:00Z`);
  }

  create(createTarjetaDto: CreateTarjetaDto) {
    return this.prisma.tarjeta_circulacion.create({
      data: {
        numero: createTarjetaDto.numero,
        cui_tc: createTarjetaDto.cui_tc,
        fecha_registro: this.parseDate(createTarjetaDto.fecha_registro),
        fecha_vencimiento: this.parseDate(createTarjetaDto.fecha_vencimiento),
        fecha_emision: this.parseDate(createTarjetaDto.fecha_emision),
        hora_emision: this.parseTime(createTarjetaDto.hora_emision),
        estado: createTarjetaDto.estado,
        nit_propietario_fk: createTarjetaDto.nit_propietario_fk,
        id_estado_vehiculo_fk: createTarjetaDto.id_estado_vehiculo_fk,
      },
    });
  }

  findAll() {
    return this.prisma.tarjeta_circulacion.findMany({
      include: {
        propietario: true,
        estado_vehiculo: {
          // Trae todos los detalles del vehículo (incluyendo sus catálogos)
          include: {
            vehiculo: {
              include: {
                linea_vehiculo: { include: { marca_vehiculo: true } },
                tipo_vehiculo: true
              }
            },
            color: true,
            uso_vehiculo: true
          }
        }
      }
    });
  }

  findOne(numero: number) {
    return this.prisma.tarjeta_circulacion.findUnique({
      where: { numero: numero },
      include: {
        propietario: true,
        estado_vehiculo: {
          include: {
            vehiculo: true,
            color: true,
            uso_vehiculo: true
          }
        }
      }
    });
  }

  async update(numero: number, updateTarjetaDto: UpdateTarjetaDto) {
    // Clonamos los datos que envió el usuario
    const datosAActualizar: any = { ...updateTarjetaDto };

    // Si el usuario incluyó alguna fecha en el PATCH, la traducimos a formato Base de Datos
    if (updateTarjetaDto.fecha_registro) {
      datosAActualizar.fecha_registro = this.parseDate(updateTarjetaDto.fecha_registro);
    }
    if (updateTarjetaDto.fecha_vencimiento) {
      datosAActualizar.fecha_vencimiento = this.parseDate(updateTarjetaDto.fecha_vencimiento);
    }
    if (updateTarjetaDto.fecha_emision) {
      datosAActualizar.fecha_emision = this.parseDate(updateTarjetaDto.fecha_emision);
    }
    if (updateTarjetaDto.hora_emision) {
      datosAActualizar.hora_emision = this.parseTime(updateTarjetaDto.hora_emision);
    }

    // Finalmente, le pedimos a Prisma que actualice la tabla en Supabase
    return this.prisma.tarjeta_circulacion.update({
      where: { numero: numero },
      data: datosAActualizar,
    });
  }

  remove(numero: number) {
    return this.prisma.tarjeta_circulacion.delete({
      where: { numero: numero }
    });
  }
}
