import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { TarjetasService } from './tarjetas.service';
import { CreateTarjetaDto } from './dto/create-tarjeta.dto';
import { UpdateTarjetaDto } from './dto/update-tarjeta.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Tarjetas de Circulación')
@ApiBearerAuth() // Le dice a Swagger que aquí exigiremos el candado
@UseGuards(AuthGuard) // El Guardia Físico que detiene las peticiones sin Gafete
@Controller('tarjetas')
export class TarjetasController {
  constructor(private readonly tarjetasService: TarjetasService) { }

  @Post()
  @ApiOperation({ summary: 'Generar una nueva tarjeta de circulación' })
  create(@Body() createTarjetaDto: CreateTarjetaDto) {
    return this.tarjetasService.create(createTarjetaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las tarjetas emitidas' })
  findAll() {
    return this.tarjetasService.findAll();
  }

  @Get(':numero')
  @ApiOperation({ summary: 'Buscar tarjeta por su número impreso' })
  findOne(@Param('numero', ParseIntPipe) numero: number) {
    return this.tarjetasService.findOne(numero);
  }

  @Patch(':numero')
  @ApiOperation({ summary: 'Actualizar o anular una tarjeta' })
  update(@Param('numero', ParseIntPipe) numero: number, @Body() updateTarjetaDto: UpdateTarjetaDto) {
    return this.tarjetasService.update(numero, updateTarjetaDto);
  }

  @Delete(':numero')
  @ApiOperation({ summary: 'Eliminar una tarjeta del sistema' })
  remove(@Param('numero', ParseIntPipe) numero: number) {
    return this.tarjetasService.remove(numero);
  }
}
