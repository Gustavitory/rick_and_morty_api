import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';

@Module({
  providers: [ParticipationService]
})
export class ParticipationModule {}
