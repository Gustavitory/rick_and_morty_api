import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Character,
  CharacterSchema,
} from '../database/schemas/character.schema';
import { CategoryModule } from '../category/category.module';
import { TypeModule } from '../type/type.module';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
  imports: [
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
    ]),
    CategoryModule,
    TypeModule,
  ],
})
export class CharacterModule {}
