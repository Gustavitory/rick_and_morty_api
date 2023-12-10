import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CharacterDocument = HydratedDocument<Character>;

@Schema()
export class Character {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'StatusAsoc' })
  status: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop()
  url: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character).set(
  'autoIndex',
  true,
);
