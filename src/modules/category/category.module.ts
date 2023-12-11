import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  Subcategory,
  SubcategorySchema,
} from '../database/schemas/subcategory.schema';
import { Category, CategorySchema } from '../database/schemas/category.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [CategoryService],
  imports: [
    MongooseModule.forFeature([
      { name: Subcategory.name, schema: SubcategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
