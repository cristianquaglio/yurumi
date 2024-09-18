import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ContactData {
  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phones: string[];

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  web: string;
}

export class CreateHealthcareSystemDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  shortName: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ContactData)
  contactData: ContactData;
}
