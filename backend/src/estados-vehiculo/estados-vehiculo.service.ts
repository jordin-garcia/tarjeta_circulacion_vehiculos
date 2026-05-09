import { Injectable } from '@nestjs/common';
import { CreateEstadosVehiculoDto } from './dto/create-estados-vehiculo.dto';
import { UpdateEstadosVehiculoDto } from './dto/update-estados-vehiculo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EstadosVehiculoService {
  constructor(private prisma: PrismaService) { }

  // Convertimos DD/MM/YYYY a objeto Date nativo
  private parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(`${year}-${month}-${day}T00:00:00Z`);
  }

  create(createEstadosVehiculoDto: CreateEstadosVehiculoDto) {
    return this.prisma.estado_vehiculo.create({
      data: {
        placa: createEstadosVehiculoDto.placa,
        motor: createEstadosVehiculoDto.motor,
        fecha_actualizacion: this.parseDate(createEstadosVehiculoDto.fecha_actualizacion),
        motivo_cambio: createEstadosVehiculoDto.motivo_cambio,
        id_uso_fk: createEstadosVehiculoDto.id_uso_fk,
        id_color_fk: createEstadosVehiculoDto.id_color_fk,
        id_vehiculo_fk: createEstadosVehiculoDto.id_vehiculo_fk,
      },
    });
  }

  findAll() {
    return this.prisma.estado_vehiculo.findMany({
      include: {
        vehiculo: true,
        color: true,
        uso_vehiculo: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.estado_vehiculo.findUnique({
      where: { id_estado: id },
      include: {
        vehiculo: true,
        color: true,
        uso_vehiculo: true
      }
    });
  }

  update(id: number, updateEstadosVehiculoDto: UpdateEstadosVehiculoDto) {
    // Igual que con las tarjetas, validamos si viene la fecha para parsearla
    const dataAActualizar: any = { ...updateEstadosVehiculoDto };
    if (updateEstadosVehiculoDto.fecha_actualizacion) {
      dataAActualizar.fecha_actualizacion = this.parseDate(updateEstadosVehiculoDto.fecha_actualizacion);
    }

    return this.prisma.estado_vehiculo.update({
      where: { id_estado: id },
      data: dataAActualizar,
    });
  }

  remove(id: number) {
    return this.prisma.estado_vehiculo.delete({
      where: { id_estado: id }
    });
  }
}
