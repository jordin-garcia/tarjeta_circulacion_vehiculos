import { Test, TestingModule } from '@nestjs/testing';
import { EstadosVehiculoService } from './estados-vehiculo.service';

describe('EstadosVehiculoService', () => {
  let service: EstadosVehiculoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadosVehiculoService],
    }).compile();

    service = module.get<EstadosVehiculoService>(EstadosVehiculoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
