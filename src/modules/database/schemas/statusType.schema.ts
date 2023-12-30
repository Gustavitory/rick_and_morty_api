import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StatusTypeDocument = HydratedDocument<StatusType>;
enum StatusTypeEnum {
  CHARACTERS = 'CHARACTERS',
  EPISODES = 'EPISODES',
}
@Schema()
export class StatusType {
  @Prop({ required: true, unique: true, enum: StatusTypeEnum })
  type: StatusTypeEnum;
}
// esto sera: CHARACTERS || EPISODES
export const StatusTypeSchema = SchemaFactory.createForClass(StatusType);
