import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogsService {
  // Inyectamos nuestro PrismaService
  constructor(private prisma: PrismaService) { }

  async getAllMarcas() {
    return this.prisma.marca_vehiculo.findMany();
  }

  async getAllLineas() {
    return this.prisma.linea_vehiculo.findMany();
  }

  async getAllColores() {
    return this.prisma.color.findMany();
  }

  async getAllTipos() {
    return this.prisma.tipo_vehiculo.findMany();
  }

  async getAllUsos() {
    return this.prisma.uso_vehiculo.findMany();
  }

  // Un método "maestro" que devuelve todos los catálogos a la vez
  // (Esto es súper útil para el Frontend, hace una sola petición en vez de cinco)
  async getAllCatalogs() {
    const [marcas, lineas, colores, tipos, usos] = await Promise.all([
      this.getAllMarcas(),
      this.getAllLineas(),
      this.getAllColores(),
      this.getAllTipos(),
      this.getAllUsos(),
    ]);

    return {
      marcas,
      lineas,
      colores,
      tipos,
      usos
    };
  }
}
