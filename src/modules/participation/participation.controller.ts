import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { ParticipationService } from './participation.service';

@Controller('participation')
export class ParticipationController {
  constructor(private readonly participationService: ParticipationService) {}

  @Get()
  async getParticipations(
    @Query('episode') episode: string,
    @Query('page') page: number,
  ) {
    try {
      const part = await this.participationService.getParticipations(
        episode,
        page,
      );
      return part;
    } catch (err) {
      return { error: err.message };
    }
  }

  @Put('add')
  async addParticipation(
    @Body()
    info: {
      episode: string;
      character: string;
      times: { init: string; finish: string };
    },
  ) {
    const { episode, character, times } = info;
    return this.participationService.addParticipation(
      episode,
      character,
      times,
    );
  }

  @Delete('delete/:id')
  async deleteParticipation(@Query('id') id: string) {
    return await this.participationService.deleteParticipation(id);
  }
}
