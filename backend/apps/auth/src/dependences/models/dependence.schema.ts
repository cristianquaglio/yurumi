import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractDocument } from '@app/common';
import { DependenceStatus } from '../constants';

@Schema({ versionKey: false, timestamps: true })
export class DependenceDocument extends AbstractDocument {
  @Prop()
  type: string;

  @Prop({ unique: true })
  shortName: string;

  @Prop({ unique: true })
  fullName: string;

  @Prop()
  tributaryType: string;

  @Prop()
  tributaryId: string;

  @Prop({ default: DependenceStatus.ACTIVE })
  status: string;
}

export const DependenceSchema =
  SchemaFactory.createForClass(DependenceDocument);
