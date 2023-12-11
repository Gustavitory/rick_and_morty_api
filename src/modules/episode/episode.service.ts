import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Episode, EpisodeDocument } from '../database/schemas/episode.schema';
import { CategoryService } from '../category/category.service';
import { TypeService } from '../type/type.service';
import { CreateEpisodeDTO, EditEpisodeDTO } from './espisode.dto';
import { Character } from '../database/schemas/character.schema';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectModel(Episode.name)
    private episodeModel: Model<EpisodeDocument>,
    private readonly categoryService: CategoryService,
    private readonly typeService: TypeService,
  ) {}

  async getAllEpisodes(season?: number, page: number = 1) {
    if (page < 1) {
      throw new BadRequestException(
        'El numero de pagina debe ser mayor o igual a 1',
      );
    }
    const itemsPerPage = 5;
    const filter = {};

    if (season) {
      const category = await this.categoryService.findCat(
        `SEASON ${season < 10 ? `0${season}` : season}`,
        'SEASON',
      );
      filter['category'] = category._id;
    }

    try {
      const totalItems = await this.episodeModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const episodes = await this.episodeModel
        .find(filter)
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .populate({
          path: 'status',
          populate: { path: 'type' },
        })
        .populate({
          path: 'category',
          populate: { path: 'subcategories' },
        })
        .exec();
      return {
        info: {
          page,
          count: totalItems,
          totalPages,
        },
        results: episodes,
      };
    } catch (err) {}
  }
  async createEpisode(info: CreateEpisodeDTO) {
    const {
      name,
      air_date,
      duration,
      episode,
      participation,
      season,
      status: std,
    } = info;
    const existEpisode = await this.episodeModel.findOne({
      name,
      'category.subcategories.subcategory': `SEASON ${
        season < 10 ? `0${season}` : season
      }`,
    });

    if (existEpisode) {
      throw new BadRequestException(
        'Ya existe un episodio con el mismo nombre en esa temporada',
      );
    }

    const status = await this.typeService.findOrCreateStatus('EPISODES', std);
    const category = await this.categoryService.findOrCreateCat(
      `SEASON ${season < 10 ? `0${season}` : `${season}`}`,
      'SEASON',
    );

    const newEpisode = new this.episodeModel({
      name,
      air_date,
      status,
      category,
      duration,
      episode,
    });
    await newEpisode.save();
    return newEpisode;
  }

  async editEpisode(episodeId: string, updatedData: EditEpisodeDTO) {
    const { name, status, season, duration, air_date, episode } = updatedData;
    const filter: Record<string, any> = {
      _id: { $ne: episodeId },
    };
    if (name || season) {
      const oldEpisode = await this.episodeModel
        .findOne({ _id: episodeId })
        .exec();
      if (season) {
        const category = await this.categoryService.findOrCreateCat(
          `SEASON ${season < 10 ? `0${season}` : season}`,
          'SEASON',
        );
        filter['category'] = category._id;
      } else filter['category'] = oldEpisode.category._id;
      filter.name = name ?? oldEpisode.name;
      const existEpisode = await this.episodeModel.findOne(filter);
      if (existEpisode)
        throw new Error(
          'ya existe un episodio en esta temporada que tiene ese nombre',
        );
    }
    const updateFields: Record<string, any> = {};
    if (name) updateFields.name = name;
    if (status)
      updateFields.status = await this.typeService.findOrCreateStatus(
        'EPISODES',
        status,
      );
    if (season) updateFields.category = filter['category'];
    if (duration) updateFields.duration = duration;
    if (air_date) updateFields.air_date = air_date;
    if (episode) updateFields.episode = episode;

    const updatedEpisode = await this.episodeModel
      .findOneAndUpdate(
        { _id: episodeId },
        { $set: updateFields },
        { new: true, runValidators: true },
      )
      .exec();
    if (!updatedEpisode) throw new NotFoundException('Episodio no encontrado');
    return updatedEpisode;
  }
}
