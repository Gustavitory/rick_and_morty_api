import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { Character } from './character.schema';
import { Episode } from './episode.schema';

@Schema()
export class Participation {
  @Prop({ default: [] })
  participations: {
    init: string;
    finish: string;
  }[];

  @Prop({ type: () => Types.ObjectId, ref: 'Character' })
  character: Character;

  @Prop({ type: () => Types.ObjectId, ref: 'Episode' })
  episode: Episode;
}
export type ParticipationDocument = HydratedDocument<Participation>;
export const ParticipationSchema = SchemaFactory.createForClass(Participation);
