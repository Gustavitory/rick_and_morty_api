import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema()
export class Category {
  @Prop({ required: true })
  category: string; // SPECIES || SEASONS

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Subcategory',
  })
  subcategories: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
