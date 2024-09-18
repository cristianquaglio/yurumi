import {
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { BloodType, DocumentType, GenderType, Nationality } from '../constants';
import { HealthcareSystemDocument } from '../healthcare-systems';

class ContactData {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  country: string;
}

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(GenderType)
  gender: GenderType;

  @IsEnum(BloodType)
  bloodType: BloodType;

  @IsDate()
  @Type(() => Date)
  birthDay: Date;

  @IsString()
  @IsOptional()
  birthTime: string;

  @IsEnum(Nationality)
  nationality: Nationality;

  @IsEnum(DocumentType)
  documentType: DocumentType;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsMongoId()
  @IsNotEmpty()
  healthcareSystem: HealthcareSystemDocument;

  @IsString()
  @IsNotEmpty()
  healthcareNumber: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactData)
  contactData: ContactData;
}
