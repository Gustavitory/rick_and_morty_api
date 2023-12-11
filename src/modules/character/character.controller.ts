import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CreateCharacterDTO, UpdateCharacterDTO } from './character.dto';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Get()
  async getAllCharacters(
    @Query('type') type: 'ACTIVE' | 'SUSPENDED' | 'CANCELED',
    @Query('species') species: string,
    @Query('page') page: number,
  ) {
    try {
      const characters = await this.characterService.getAllCharacters(
        type,
        species,
        page,
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
        { status: 'SUSPENDED' },
      );
      return updatedCharacter;
    } catch (error) {
      return { error: error.message };
    }
  }
}
