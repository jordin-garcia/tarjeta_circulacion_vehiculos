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
      include: {
        linea_vehiculo: {
          include: { marca_vehiculo: true }
        },
        tipo_vehiculo: true,
        estado_vehiculo: {
          include: { 
            uso_vehiculo: true,
            color: true
          }
        }
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
        estado_vehiculo: {
          include: { 
            uso_vehiculo: true,
            color: true
          }
        }
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
