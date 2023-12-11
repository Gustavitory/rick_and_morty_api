import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/env/config';
import { StatusType, StatusTypeSchema } from './schemas/statusType.schema';
import { StatusAsoc, StatusAsocSchema } from './schemas/statusAsoc.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { Subcategory, SubcategorySchema } from './schemas/subcategory.schema';
import { Character, CharacterSchema } from './schemas/character.schema';
import { Episode, EpisodeSchema } from './schemas/episode.schema';
import {
  Participation,
  ParticipationSchema,
} from './schemas/participation.schema';
import { DatabaseService } from './database.service';
import { RickAndMortyApiService } from 'src/external-services/rick-and-morty-api/rick-and-morty-api.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const pass = configService.PASSWORD_DB;
        const host = configService.DB_HOST;
        const port = configService.DB_PORT;
        const name = configService.DB_NAME;
        const user = configService.USER_DB;
        return {
          uri: `mongodb://${user}:${pass}@${host}:${port}/${name}?authSource=admin`,
        };
      },
      inject: [config.KEY],
    }),
    MongooseModule.forFeature([
      { name: StatusType.name, schema: StatusTypeSchema },
      { name: StatusAsoc.name, schema: StatusAsocSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: Character.name, schema: CharacterSchema },
      { name: Episode.name, schema: EpisodeSchema },
      { name: Participation.name, schema: ParticipationSchema },
    ]),
  ],
  providers: [DatabaseService, RickAndMortyApiService],
  exports: [MongooseModule],
})
export class DatabaseModule {}
