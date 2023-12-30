import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Participation,
  ParticipationSchema,
} from '../database/schemas/participation.schema';
import { EpisodeModule } from '../episode/episode.module';
import { ParticipationController } from './participation.controller';

@Module({
  providers: [ParticipationService],
  imports: [
    MongooseModule.forFeature([
      { name: Participation.name, schema: ParticipationSchema },
    ]),
    EpisodeModule,
  ],
  controllers: [ParticipationController],
})
export class ParticipationModule {}
