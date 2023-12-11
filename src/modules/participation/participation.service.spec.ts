import { Test, TestingModule } from '@nestjs/testing';
import { ParticipationService } from './participation.service';

describe('ParticipationService', () => {
  let service: ParticipationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipationService],
    }).compile();

    service = module.get<ParticipationService>(ParticipationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
