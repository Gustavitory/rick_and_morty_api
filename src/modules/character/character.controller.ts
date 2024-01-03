import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CharacterService } from './character.service';
import {
  CreateCharacterDTO,
  ECharacterStatus,
  GetCharactersDTO,
  UpdateCharacterDTO,
} from './character.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Characters')
@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  // @ApiQuery({ type: GetCharactersDTO })
  async getAllCharacters(@Query() query: GetCharactersDTO) {
    try {
      const characters = await this.characterService.getAllCharacters(
        query.type,
        query.species,
        query.page,
      );
      return characters;
    } catch (error) {
      return { error: error.message };
    }
  }
  @Post('create')
  async createCharacter(
    @Body()
    characterData: CreateCharacterDTO,
  ) {
    try {
      const newCharacter =
        await this.characterService.createCharacter(characterData);
      return newCharacter;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put('update/:id')
  async updateCharacter(
    @Param('id') characterId: string,
    @Body() updatedData: UpdateCharacterDTO,
  ) {
    try {
      const updatedCharacter = await this.characterService.updateCharacter(
        characterId,
        updatedData,
      );
      return updatedCharacter;
    } catch (error) {
      return { error: error.message };
    }
  }

  @Put('delete/:id')
  async deleteCharacter(@Param('id') characterId: string) {
    try {
      const updatedCharacter = await this.characterService.updateCharacter(
        characterId,
        { status: ECharacterStatus.CANCELED },
      );
      return updatedCharacter;
    } catch (error) {
      return { error: error.message };
    }
  }
}
