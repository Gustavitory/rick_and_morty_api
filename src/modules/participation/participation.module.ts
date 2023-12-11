import { Module } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Participation,
  ParticipationSchema,
} from '../database/schemas/participation.schema';
import { EpisodeModule } from '../episode/episode.module';
import { CharacterModule } from '../character/character.module';
import { ParticipationController } from './participation.controller';
import { TypeModule } from '../type/type.module';

@Module({
  providers: [ParticipationService],
  imports: [
    MongooseModule.forFeature([
      { name: Participation.name, schema: ParticipationSchema },
    ]),
    EpisodeModule,
    CharacterModule,
    TypeModule,
  ],
  controllers: [ParticipationController],
})
export class ParticipationModule {}
