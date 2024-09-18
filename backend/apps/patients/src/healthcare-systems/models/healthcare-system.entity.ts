import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractDocument } from '@app/common';

class ContactData {
  @Prop()
  address: string;

  @Prop()
  phones: string[];

  @Prop()
  email: string;

  @Prop()
  web: string;
}

@Schema({ versionKey: false, timestamps: true })
export class HealthcareSystemDocument extends AbstractDocument {
  @Prop({ unique: true })
  code: string;

  @Prop({ unique: true })
  fullName: string;

  @Prop({ unique: true })
  shortName: string;

  @Prop({ required: false })
  contactData: ContactData;
}

export const HealthcareSystemSchema = SchemaFactory.createForClass(
  HealthcareSystemDocument,
);
