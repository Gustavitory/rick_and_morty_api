import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusAsocDocument } from './statusAsoc.schema';
import { CategoryDocument } from './category.schema';

export type CharacterDocument = HydratedDocument<Character>;

@Schema()
export class Character {
  @Prop()
  name: string;
  @Prop()
  state: string;
  @Prop()
  gender: string;

  @Prop({ type: () => Types.ObjectId, ref: 'StatusAsoc' })
  status: Types.ObjectId | StatusAsocDocument;

  @Prop({ type: () => Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId | CategoryDocument;

  @Prop()
  url: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character).set(
  'autoIndex',
  true,
);
