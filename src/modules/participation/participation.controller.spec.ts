import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationController } from './participation.controller';

describe('ParticipationController', () => {
  let controller: ParticipationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipationController],
    }).compile();

    controller = module.get<ParticipationController>(ParticipationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
