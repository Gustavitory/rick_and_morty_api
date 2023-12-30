import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { StatusAsocDocument } from './statusAsoc.schema';
import { CategoryDocument } from './category.schema';
import { CharacterDocument } from './character.schema';

export type EpisodeDocument = HydratedDocument<Episode>;

@Schema()
export class Episode {
  @Prop()
  name: string;

  @Prop({ type: () => Types.ObjectId, ref: 'StatusAsoc' })
  status: Types.ObjectId | StatusAsocDocument;

  @Prop({ type: () => Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId | CategoryDocument;

  @Prop()
  duration: string;

  @Prop({ type: () => [Types.ObjectId], ref: 'Character' })
  characters: Types.ObjectId[] | CharacterDocument[];

  @Prop()
  air_date: string;

  @Prop()
  episode: string;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
