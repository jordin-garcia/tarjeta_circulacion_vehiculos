import { Test, TestingModule } from '@nestjs/testing';
import { EstadosVehiculoController } from './estados-vehiculo.controller';
import { EstadosVehiculoService } from './estados-vehiculo.service';

describe('EstadosVehiculoController', () => {
  let controller: EstadosVehiculoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadosVehiculoController],
      providers: [EstadosVehiculoService],
    }).compile();

    controller = module.get<EstadosVehiculoController>(EstadosVehiculoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
