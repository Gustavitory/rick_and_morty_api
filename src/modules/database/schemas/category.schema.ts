import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { SubcategoryDocument } from './subcategory.schema';

export type CategoryDocument = HydratedDocument<Category>;
export enum CategoryType {
  SPECIES = 'SPECIES',
  SEASONS = 'SEASONS',
}
@Schema()
export class Category {
  @Prop({ required: true, enum: CategoryType })
  category: string; // SPECIES || SEASONS

  @Prop({
    required: true,
    type: () => Types.ObjectId,
    ref: 'Subcategory',
  })
  subcategories: Types.ObjectId | SubcategoryDocument;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
