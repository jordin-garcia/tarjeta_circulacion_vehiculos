import { Test, TestingModule } from '@nestjs/testing';
import { PropietariosService } from './propietarios.service';

describe('PropietariosService', () => {
  let service: PropietariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropietariosService],
    }).compile();

    service = module.get<PropietariosService>(PropietariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
