import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDTO, EditEpisodeDTO, StatusEnum } from './espisode.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Episodes')
@Controller('episode')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  async getAllEpisodes(
    @Query('season') season: number,
    @Query('page') page: number,
  ) {
    try {
      const episodes = await this.episodeService.getAllEpisodes(season, page);
      return episodes;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('create')
  async createEpisode(@Body() newEpisode: CreateEpisodeDTO) {
    try {
      return await this.episodeService.createEpisode(newEpisode);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put('update/:id')
  async updateEpisode(
    @Body() changes: EditEpisodeDTO,
    @Param('id') episodeId: string,
  ) {
    try {
      return await this.episodeService.editEpisode(episodeId, changes);
    } catch (err) {
      return { error: err.message };
    }
  }

  @Put('delete/:id')
  async deleteEpisode(@Param('id') episodeId: string) {
    try {
      return await this.episodeService.editEpisode(episodeId, {
        status: StatusEnum.CANCELED,
      });
    } catch (err) {
      return { error: err.message };
    }
  }
}
