import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  StatusAsoc,
  StatusAsocDocument,
} from '../database/schemas/statusAsoc.schema';
import { Model } from 'mongoose';
import {
  StatusType,
  StatusTypeDocument,
} from '../database/schemas/statusType.schema';

@Injectable()
export class TypeService {
  constructor(
    @InjectModel(StatusAsoc.name)
    private statusAsocModel: Model<StatusAsocDocument>,
    @InjectModel(StatusType.name)
    private statusTypeModel: Model<StatusTypeDocument>,
  ) {}

  async findStatus(type: string, status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED') {
    const statusType = await this.statusTypeModel.findOne({
      type: type.toUpperCase(),
    });
    return await this.statusAsocModel.findOne({
      status,
      type: statusType,
    });
  }

  async findOrCreateStatus(
    type: string,
    status: 'ACTIVE' | 'SUSPENDED' | 'CANCELED',
  ) {
    const statusType = await this.statusTypeModel.findOneAndUpdate(
      {
        type: type.toUpperCase(),
      },
      {},
      { new: true, upsert: true },
    );
    return await this.statusAsocModel.findOneAndUpdate(
      {
        status,
        type: statusType,
      },
      {},
      { new: true, upsert: true },
    );
  }
}
