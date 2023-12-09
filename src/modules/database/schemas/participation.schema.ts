import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ParticipationDocument = HydratedDocument<Participation>;

export class Participation {
  @Prop({ type: Types.ObjectId, ref: 'Character' })
  character: Types.ObjectId;

  @Prop({ default: [] })
  participations: {
    init: string;
    finish: string;
  }[];
}

export const ParticipationSchema = SchemaFactory.createForClass(Participation);
