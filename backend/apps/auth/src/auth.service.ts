import { Injectable } from '@nestjs/common';

import { UserRoles } from '@app/common';
import { CreateUserDto } from './users/dto/create-user.dto';
import { UsersService } from './users/users.service';
import { ICreateUserPayload } from './users/interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(
    createUserPayload: ICreateUserPayload,
    createUserDto: CreateUserDto,
  ) {
    const { dependence } = createUserPayload;
    const isAdmin = await this.usersService.dependenceHasUsers(dependence);
    if (!isAdmin)
      return await this.usersService.create(dependence, {
        ...createUserDto,
        roles: [UserRoles.ADMINISTRATOR],
      });
    else
      return await this.usersService.create(dependence, {
        ...createUserDto,
      });
  }
}
