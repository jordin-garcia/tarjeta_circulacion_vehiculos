import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropietariosService } from './propietarios.service';
import { CreatePropietarioDto } from './dto/create-propietario.dto';
import { UpdatePropietarioDto } from './dto/update-propietario.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Propietarios')
@Controller('propietarios')
export class PropietariosController {
  constructor(private readonly propietariosService: PropietariosService) { }

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo propietario' })
  create(@Body() createPropietarioDto: CreatePropietarioDto) {
    return this.propietariosService.create(createPropietarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los propietarios' })
  findAll() {
    return this.propietariosService.findAll();
  }

  @Get(':nit')
  @ApiOperation({ summary: 'Buscar un propietario específico por su NIT' })
  findOne(@Param('nit') nit: string) {
    return this.propietariosService.findOne(nit); // <-- Ya no tiene el símbolo '+'
  }

  @Patch(':nit')
  @ApiOperation({ summary: 'Actualizar datos de un propietario' })
  update(@Param('nit') nit: string, @Body() updatePropietarioDto: UpdatePropietarioDto) {
    return this.propietariosService.update(nit, updatePropietarioDto);
  }

  @Delete(':nit')
  @ApiOperation({ summary: 'Eliminar un propietario' })
  remove(@Param('nit') nit: string) {
    return this.propietariosService.remove(nit);
  }
}
