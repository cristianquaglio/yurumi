import { PartialType } from '@nestjs/swagger';

import { CreateHealthcareSystemDto } from './create-healthcare-system.dto';

export class UpdateHealthcareSystemDto extends PartialType(
  CreateHealthcareSystemDto,
) {}
