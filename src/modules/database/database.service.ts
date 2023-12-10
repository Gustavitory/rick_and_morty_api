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
    console.log(await this.statusTypeModel.find().exec());
  }
  async chargeCharactersDataBase() {
    try {
      const allCharacters = await this.rickAndMortyAPIService.getCharacters();
      if (allCharacters.length > 0) {
        await Promise.all(
          allCharacters.map(async (character) => {
            const { name, status, species, url } = character;
            const existCharacter = await this.characterModel.findOne({ name });
            if (!existCharacter) {
              const statusType = await this.statusTypeModel.findOne({
                type: 'CHARACTERS',
              });
              const existAsocStatus = await this.statusAsocModel.findOne({
                type: statusType,
                status,
              });
              const asocStatus = !existAsocStatus
                ? await new this.statusAsocModel({
                    type: statusType,
                    status,
                  }).save()
                : existAsocStatus;
              const existSubCat = await this.subcategoryModel.findOne({
                subcategory: species,
              });
              const subCat = !existSubCat
                ? await new this.subcategoryModel({
                    subcategory: species,
                  }).save()
                : existSubCat;
              const existCat = await this.categoryModel.findOne({
                category: 'SPECIES',
                subcategories: subCat,
              });
              const cat = !existCat
                ? await new this.categoryModel({
                    category: 'SPECIES',
                    subcategories: subCat,
                  }).save()
                : existCat;

              const newCharacter = new this.characterModel({
                name,
                status: asocStatus,
                category: cat,
                url,
              });
              await newCharacter.save();
            }
          }),
        );
        console.log(
          (
            await this.characterModel
              .find()
              .populate('category')
              .populate('status')
              .exec()
          ).length,
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
            const { name, episode, characters } = epis;
            const existEpisode = await this.episodeModel.findOne({ name });
            if (!existEpisode) {
              const statusType = await this.statusTypeModel.findOne({
                type: 'EPISODES',
              });
              const existAsocStatus = await this.statusAsocModel.findOne({
                type: statusType,
                status: 'ACTIVE',
              });
              const asocStatus = !existAsocStatus
                ? await new this.statusAsocModel({
                    type: statusType,
                    status: 'ACTIVE',
                  }).save()
                : existAsocStatus;
              const existSubCat = await this.subcategoryModel.findOne({
                subcategory: 'SEASON ' + episode.split('E')[0].slice(1),
              });
              const subCat = !existSubCat
                ? await new this.subcategoryModel({
                    subcategory: 'SEASON ' + episode.split('E')[0].slice(1),
                  }).save()
                : existSubCat;
              const existCat = await this.categoryModel.findOne({
                category: 'SEASON',
                subcategories: subCat,
              });
              const cat = !existCat
                ? await new this.categoryModel({
                    category: 'SEASON',
                    subcategories: subCat,
                  }).save()
                : existCat;
              const participations = await Promise.all(
                characters.map(async (url: string) => {
                  const char = await this.characterModel.findOne({ url });
                  if (char) {
                    return await new this.participationModel({
                      character: char,
                    }).save();
                  }
                }),
              );

              await new this.episodeModel({
                name,
                status: asocStatus,
                category: cat,
                participation: participations,
              }).save();
            }
          }),
        );
        console.log(
          (
            await this.episodeModel
              .find()
              .populate('category')
              .populate('status')
              .exec()
          )[0],
        );
      }
    } catch {}
  }
  private async clearAndRecreateCollection() {
    try {
      await this.characterModel.collection.drop();
      console.log('Colección User eliminada y recreada.');
    } catch (error) {
      console.error('Error al eliminar y recrear la colección:', error);
    }
  }
}
