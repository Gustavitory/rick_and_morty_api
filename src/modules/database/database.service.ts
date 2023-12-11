import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Character, CharacterDocument } from './schemas/character.schema';
import { RickAndMortyApiService } from 'src/external-services/rick-and-morty-api/rick-and-morty-api.service';
import { StatusType, StatusTypeDocument } from './schemas/statusType.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StatusAsoc, StatusAsocDocument } from './schemas/statusAsoc.schema';
import { Subcategory, SubcategoryDocument } from './schemas/subcategory.schema';
import { Category, CategoryDocument } from './schemas/category.schema';
import {
  EpisodeDocument,
  Episode as EpisodeSchema,
} from './schemas/episode.schema';
import {
  Participation,
  ParticipationDocument,
} from './schemas/participation.schema';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @Inject(RickAndMortyApiService)
    private readonly rickAndMortyAPIService: RickAndMortyApiService,
    @InjectModel(StatusType.name)
    private statusTypeModel: Model<StatusTypeDocument>,
    @InjectModel(Character.name)
    private characterModel: Model<CharacterDocument>,
    @InjectModel(StatusAsoc.name)
    private statusAsocModel: Model<StatusAsocDocument>,
    @InjectModel(Subcategory.name)
    private subcategoryModel: Model<SubcategoryDocument>,
    @InjectModel(Category.name)
    private categoryModel: Model<CategoryDocument>,
    @InjectModel(EpisodeSchema.name)
    private episodeModel: Model<EpisodeDocument>,
    @InjectModel(Participation.name)
    private participationModel: Model<ParticipationDocument>,
  ) {}
  async onModuleInit() {
    // await this.clearAndRecreateCollection();
    console.log('modulo inicializado');
    await this.chargeStatusType();
    await this.chargeCharactersDataBase().then(
      async () => await this.chargeEpisodesDataBase(),
    );
  }
  async chargeStatusType() {
    const types = ['CHARACTERS', 'EPISODES'];
    await Promise.all(
      types.map(async (type: string) => {
        const existingType = await this.statusTypeModel.findOne({ type });
        if (!existingType) {
          const newType = new this.statusTypeModel({ type });
          await newType.save();
        }
      }),
    );
  }
  async chargeCharactersDataBase() {
    try {
      const allCharacters = await this.rickAndMortyAPIService.getCharacters();
      if (allCharacters.length > 0) {
        await Promise.all(
          allCharacters.map(async (character) => {
            const { species, url, name, status: sta, gender } = character;
            const existCharacter = await this.characterModel.findOne({ name });
            if (!existCharacter) {
              const statusType = await this.statusTypeModel.findOne({
                type: 'CHARACTERS',
              });
              const asocStatus = await this.statusAsocModel.findOneAndUpdate(
                {
                  type: statusType,
                  status: 'ACTIVE',
                },
                {},
                { new: true, upsert: true },
              );
              const subCat = await this.subcategoryModel.findOneAndUpdate(
                {
                  subcategory: species.toUpperCase(),
                },
                {},
                { new: true, upsert: true },
              );
              const cat = await this.categoryModel.findOneAndUpdate(
                {
                  category: 'SPECIES',
                  subcategories: subCat,
                },
                {},
                { new: true, upsert: true },
              );

              await this.characterModel.create({
                name,
                status: asocStatus,
                category: cat,
                url,
                state: sta,
                gender,
              });
            }
          }),
        );
      }
    } catch {}
  }

  async chargeEpisodesDataBase() {
    try {
      const allEpisodes = await this.rickAndMortyAPIService.getEpisodes();
      if (allEpisodes.length > 0) {
        await Promise.all(
          allEpisodes.map(async (epis) => {
            const { name, episode: ode, characters, air_date } = epis;
            const existEpisode = await this.episodeModel.findOne({ name });
            if (!existEpisode) {
              const statusType = await this.statusTypeModel.findOne({
                type: 'EPISODES',
              });
              const asocStatus = await this.statusAsocModel.findOneAndUpdate(
                {
                  type: statusType,
                  status: 'ACTIVE',
                },
                {},
                { new: true, upsert: true },
              );
              const subCat = await this.subcategoryModel.findOneAndUpdate(
                {
                  subcategory: 'SEASON ' + ode.split('E')[0].slice(1),
                },
                {},
                { new: true, upsert: true },
              );

              const cat = await this.categoryModel.findOneAndUpdate(
                {
                  category: 'SEASON',
                  subcategories: subCat,
                },
                {},
                { new: true, upsert: true },
              );
              const participations = await Promise.all(
                characters.map(async (url: string) => {
                  const char = await this.characterModel
                    .findOne({
                      url: url,
                    })
                    .exec();
                  return char._id;
                }),
              );
              const episode = await new this.episodeModel({
                name,
                status: asocStatus,
                category: cat,
                episode: ode,
                air_date,
                duration: '20:30',
                participation: participations,
              }).save();
              await Promise.all(
                episode.participation.map(async (el) => {
                  const char = await this.characterModel.findById(el).exec();
                  await new this.participationModel({
                    characterStatus: char.status,
                    episode: episode._id,
                    character: el,
                  }).save();
                }),
              );
            }
          }),
        );
      }
    } catch {}
  }
  private async clearAndRecreateCollection() {
    try {
      await this.episodeModel.collection.drop();
      await this.participationModel.collection.drop();
      await this.characterModel.collection.drop();
      console.log('Colección User eliminada y recreada.');
    } catch (error) {
      console.error('Error al eliminar y recrear la colección:', error);
    }
  }
}
