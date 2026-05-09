import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Vehículos')
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly vehiculosService: VehiculosService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo vehículo' })
  create(@Body() createVehiculoDto: CreateVehiculoDto) {
    return this.vehiculosService.create(createVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los vehículos' })
  findAll() {
    return this.vehiculosService.findAll();
  }

  // ParseIntPipe nos asegura que 'id' será un número y no un texto como en los propietarios
  @Get(':id')
  @ApiOperation({ summary: 'Buscar un vehículo por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos de un vehículo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateVehiculoDto: UpdateVehiculoDto) {
    return this.vehiculosService.update(id, updateVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un vehículo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.vehiculosService.remove(id);
  }
}
