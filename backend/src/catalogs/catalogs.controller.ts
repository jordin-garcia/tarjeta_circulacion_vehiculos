import { Controller, Get } from '@nestjs/common';
import { CatalogsService } from './catalogs.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Catálogos') // <- Agrupa estas rutas en Swagger
@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) { }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los catálogos a la vez' })
  findAll() {
    return this.catalogsService.getAllCatalogs();
  }

  @Get('marcas')
  @ApiOperation({ summary: 'Obtener solo la lista de marcas' })
  getMarcas() {
    return this.catalogsService.getAllMarcas();
  }

  @Get('lineas')
  @ApiOperation({ summary: 'Obtener solo la lista de líneas' })
  getLineas() {
    return this.catalogsService.getAllLineas();
  }

  @Get('colores')
  @ApiOperation({ summary: 'Obtener solo la lista de colores' })
  getColores() {
    return this.catalogsService.getAllColores();
  }

  @Get('tipos')
  @ApiOperation({ summary: 'Obtener solo la lista de tipos de vehículo' })
  getTipos() {
    return this.catalogsService.getAllTipos();
  }

  @Get('usos')
  @ApiOperation({ summary: 'Obtener solo la lista de usos' })
  getUsos() {
    return this.catalogsService.getAllUsos();
  }
}
