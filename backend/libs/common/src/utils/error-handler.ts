import { BadRequestException, NotFoundException } from '@nestjs/common';

export const errorHandler = (error: any) => {
  console.log('error ==> ', error?.name);
  if (error?.code === 11000)
    throw new BadRequestException({
      statusCode: 401,
      message: `Duplicated data in database`,
    });
  if (error?.name === 'ValidationError')
    throw new BadRequestException({
      statusCode: 400,
      message: `Validation error. Some data is needed`,
    });
  if (error?.name === 'CastError')
    throw new NotFoundException('Related field does not exist');
  return;
};
