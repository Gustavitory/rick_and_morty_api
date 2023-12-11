import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ParticipationDocument = HydratedDocument<Participation>;

@Schema()
export class Participation {
  @Prop({ default: [] })
  participations: {
    init: string;
    finish: string;
  }[];

  @Prop({ type: Types.ObjectId, ref: 'Character' })
  character: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode' })
  episode: Types.ObjectId;
}

export const ParticipationSchema = SchemaFactory.createForClass(Participation);
