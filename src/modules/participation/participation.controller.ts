import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { ParticipationService } from './participation.service';
import { CreateParticipationDTO } from './participation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Participations')
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
    info: CreateParticipationDTO,
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
