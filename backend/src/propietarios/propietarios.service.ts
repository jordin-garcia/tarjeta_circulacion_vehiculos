import { Injectable } from '@nestjs/common';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PropietariosService {
  constructor(private prisma: PrismaService) { }

  async create(createPropietarioDto: CreatePropietarioDto) {
    return this.prisma.propietario.create({
      data: {
        nit: createPropietarioDto.nit,
        nombre: createPropietarioDto.nombre,
        cui_p: createPropietarioDto.cui_p,
      },
    });
  }

  findAll() {
    return this.prisma.propietario.findMany();
  }

  findOne(nit: string) {
    return this.prisma.propietario.findUnique({
      where: { nit: nit }
    });
  }

  update(nit: string, updatePropietarioDto: UpdatePropietarioDto) {
    return this.prisma.propietario.update({
      where: { nit: nit },
      data: updatePropietarioDto,
    });
  }

  remove(nit: string) {
    return this.prisma.propietario.delete({
      where: { nit: nit }
    });
  }
}
