import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatusTypeDocument = HydratedDocument<StatusType>;

@Schema()
export class StatusType {
  @Prop({ required: true, unique: true })
  type: string;
}
// esto sera: CHARACTERS || EPISODES
export const StatusTypeSchema = SchemaFactory.createForClass(StatusType);
