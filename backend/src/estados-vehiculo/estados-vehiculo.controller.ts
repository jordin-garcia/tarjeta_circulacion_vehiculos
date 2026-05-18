import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { EstadosVehiculoService } from './estados-vehiculo.service';
import { CreateEstadosVehiculoDto } from './dto/create-estados-vehiculo.dto';
import { UpdateEstadosVehiculoDto } from './dto/update-estados-vehiculo.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Estados de Vehículos (Historial de Placas y Colores)')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('estados-vehiculo')
export class EstadosVehiculoController {
  constructor(private readonly estadosVehiculoService: EstadosVehiculoService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo estado (ej. cambio de placa o color)' })
  create(@Body() createEstadosVehiculoDto: CreateEstadosVehiculoDto) {
    return this.estadosVehiculoService.create(createEstadosVehiculoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver todo el historial de estados de vehículos' })
  findAll() {
    return this.estadosVehiculoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar un estado específico por su ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.estadosVehiculoService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modificar un estado (solo si hubo error de digitación)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEstadosVehiculoDto: UpdateEstadosVehiculoDto) {
    return this.estadosVehiculoService.update(id, updateEstadosVehiculoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un estado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.estadosVehiculoService.remove(id);
  }
}
