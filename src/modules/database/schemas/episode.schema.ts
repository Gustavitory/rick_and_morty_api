import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type EpisodeDocument = HydratedDocument<Episode>;

@Schema()
export class Episode {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'StatusAsoc' })
  status: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop()
  duration: string;

  @Prop({ type: Types.ObjectId, ref: 'Participation' })
  participation: Types.ObjectId;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
