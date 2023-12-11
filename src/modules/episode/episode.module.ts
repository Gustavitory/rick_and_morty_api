import { Module } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from '../database/schemas/episode.schema';
import { CategoryModule } from '../category/category.module';
import { TypeModule } from '../type/type.module';

@Module({
  providers: [EpisodeService],
  controllers: [EpisodeController],
  imports: [
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    CategoryModule,
    TypeModule,
  ],
  exports: [EpisodeService],
})
export class EpisodeModule {}
