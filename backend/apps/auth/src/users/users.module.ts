import { Module } from '@nestjs/common';

import { DatabaseModule, UserDocument, UserSchema } from '@app/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
