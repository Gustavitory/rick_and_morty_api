// subcategories.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SubcategoryDocument = HydratedDocument<Subcategory>;
@Schema()
export class Subcategory {
  @Prop({ required: true })
  subcategory: string;
  //PARA SPECIES SERIA TIPO HUMAN,ALIEN,ETC...
  //PARA SEASON SERIA TIPO SEASON1,SEASON2,SEASON3...
}

export const SubcategorySchema = SchemaFactory.createForClass(Subcategory);
