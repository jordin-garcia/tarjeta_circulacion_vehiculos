import { Injectable } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VehiculosService {
  constructor(private prisma: PrismaService) { }

  create(createVehiculoDto: CreateVehiculoDto) {
    return this.prisma.vehiculo.create({
      data: createVehiculoDto,
    });
  }

  findAll() {
    return this.prisma.vehiculo.findMany({
      // "include" es el equivalente a un JOIN en SQL
      // ¡Esto traerá la información completa de la marca, línea y tipo!
      include: {
        linea_vehiculo: {
          include: { marca_vehiculo: true }
        },
        tipo_vehiculo: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.vehiculo.findUnique({
      where: { id_vehiculo: id },
      include: {
        linea_vehiculo: {
          include: { marca_vehiculo: true }
        },
        tipo_vehiculo: true,
      }
    });
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto) {
    return this.prisma.vehiculo.update({
      where: { id_vehiculo: id },
      data: updateVehiculoDto,
    });
  }

  remove(id: number) {
    return this.prisma.vehiculo.delete({
      where: { id_vehiculo: id }
    });
  }
}
