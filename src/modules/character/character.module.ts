import { Module } from '@nestjs/common';
import { CharacterController } from './character.controller';
import { CharacterService } from './character.service';
import { DatabaseModule } from '../database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Character,
  CharacterSchema,
} from '../database/schemas/character.schema';
import {
  Subcategory,
  SubcategorySchema,
} from '../database/schemas/subcategory.schema';
import {
  StatusType,
  StatusTypeSchema,
} from '../database/schemas/statusType.schema';
import {
  StatusAsoc,
  StatusAsocSchema,
} from '../database/schemas/statusAsoc.schema';
import { Category, CategorySchema } from '../database/schemas/category.schema';

@Module({
  controllers: [CharacterController],
  providers: [CharacterService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Character.name, schema: CharacterSchema },
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: StatusType.name, schema: StatusTypeSchema },
      { name: StatusAsoc.name, schema: StatusAsocSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Subcategory.name, schema: SubcategorySchema },
    ]),
  ],
})
export class CharacterModule {}
