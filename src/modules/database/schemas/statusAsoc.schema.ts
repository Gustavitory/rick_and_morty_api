import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type StatusAsocDocument = HydratedDocument<StatusAsoc>;

@Schema()
export class StatusAsoc {
  @Prop({ required: true, type: Types.ObjectId, ref: 'StatusType' })
  type: Types.ObjectId;

  @Prop({ required: true })
  status: string[];
}
//estados para CHARACTERS=>ACTIVE || SUSPENDED; para EPISODES=> CANCELLED || ACTIVE
export const StatusAsocSchema = SchemaFactory.createForClass(StatusAsoc);
