import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

import { AbstractDocument } from '@app/common';
import { HealthcareSystemDocument } from '../healthcare-systems';

class ContactData {
  @Prop()
  email: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  zipCode: string;

  @Prop()
  state: string;

  @Prop()
  country: string;
}

@Schema({ versionKey: false, timestamps: true })
export class PatientDocument extends AbstractDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  gender: string;

  @Prop()
  bloodType: string;

  @Prop()
  birthDay: Date;

  @Prop({ required: false })
  birthTime?: string;

  @Prop()
  nationality: string;

  @Prop()
  documentType: string;

  @Prop()
  documentNumber: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HealthcareSystemDocument',
    required: true,
  })
  healthcareSystem: HealthcareSystemDocument;

  @Prop()
  healthcareNumber: string;

  @Prop({ required: false })
  contactData: ContactData;
}

export const PatientSchema = SchemaFactory.createForClass(
  PatientDocument,
).index(
  { nationality: 1, documentType: 1, documentNumber: 1 },
  { unique: true },
);
