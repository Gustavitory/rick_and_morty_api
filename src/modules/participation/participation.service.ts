import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Participation,
  ParticipationDocument,
} from '../database/schemas/participation.schema';
import { Model } from 'mongoose';
import { EpisodeService } from '../episode/episode.service';
import { CharacterService } from '../character/character.service';
import { TypeService } from '../type/type.service';

@Injectable()
export class ParticipationService {
  constructor(
    @InjectModel(Participation.name)
    private participationModel: Model<ParticipationDocument>,
    private readonly episodeService: EpisodeService,
    private readonly characterService: CharacterService,
    private readonly statusService: TypeService,
  ) {}
  async getParticipations(
    // characterStatus?: 'ACTIVE' | 'SUSPENDED',
    episode?: string,
    page: number = 1,
  ) {
    if (page < 1) {
      throw new BadRequestException(
        'El numero de pagina debe ser mayor o igual a 1',
      );
    }
    const itemsPerPage = 5;
    const filter = {};

    // if (characterStatus) {
    //   const status = await this.statusService.findStatus(
    //     'CHARACTERS',
    //     characterStatus,
    //   );
    //   if (!status)
    //     throw new NotFoundException('No hay personajes con ese estatus.');
    //   filter['character.status'] = status;
    // }

    if (episode) {
      const epi = await this.episodeService.finForId(episode);
      if (epi) filter['episode'] = epi._id;
    }
    try {
      const totalItems = await this.participationModel.countDocuments(filter);
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      console.log(filter);
      const episodes = await this.participationModel
        .find(filter)
        .populate({ path: 'character', populate: { path: 'status' } })
        .skip((page - 1) * itemsPerPage)
        .limit(itemsPerPage)
        .exec();

      return {
        info: {
          page,
          count: totalItems,
          totalPages,
        },
        results: episodes,
      };
    } catch (err) {
      return err.message;
    }
  }

  async addParticipation(
    episode: string,
    character: string,
    times: { init: string; finish: string },
  ) {
    if (this.timing(times.init) >= this.timing(times.finish)) {
      throw new BadRequestException(
        'El tiempo de entrada no puede ser mayor al de salida',
      );
    }
    const epi = await this.episodeService.finForId(episode);
    if (!epi) throw new NotFoundException('Episodio inexistente');

    const parti = await this.participationModel.findOneAndUpdate(
      {
        episode,
        character,
      },
      {},
      { new: true, upsert: true },
    );

    let isValid = true;
    for (let i = 0; i < parti.participations.length; i++) {
      const { init, finish } = parti.participations[i];
      if (
        this.timing(init) > this.timing(times.init) &&
        this.timing(times.finish) > this.timing(finish)
      ) {
        isValid = false;
        break;
      }
      if (
        this.timing(init) < this.timing(times.init) &&
        this.timing(times.init) < this.timing(finish)
      ) {
        isValid = false;
        break;
      }
      if (
        this.timing(init) < this.timing(times.finish) &&
        this.timing(times.finish) < this.timing(finish)
      ) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      parti.participations.push(times);
      await parti.save();
    }
  }

  timing(time: string) {
    const raw = time.split(':').map((el) => Number(el));
    return raw[0] * 60 + raw[1];
  }

  async deleteParticipation(id: string) {
    return await this.participationModel.deleteOne({ _id: id });
  }
}
