import { Test, TestingModule } from '@nestjs/testing';
import { PropietariosController } from './propietarios.controller';
import { PropietariosService } from './propietarios.service';

describe('PropietariosController', () => {
  let controller: PropietariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropietariosController],
      providers: [PropietariosService],
    }).compile();

    controller = module.get<PropietariosController>(PropietariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
