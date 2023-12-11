import { Module } from '@nestjs/common';
import { TypeService } from './type.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StatusType,
  StatusTypeSchema,
} from '../database/schemas/statusType.schema';
import {
  StatusAsoc,
  StatusAsocSchema,
} from '../database/schemas/statusAsoc.schema';

@Module({
  providers: [TypeService],
  exports: [TypeService],
  imports: [
    MongooseModule.forFeature([
      { name: StatusType.name, schema: StatusTypeSchema },
      { name: StatusAsoc.name, schema: StatusAsocSchema },
    ]),
  ],
})
export class TypeModule {}
