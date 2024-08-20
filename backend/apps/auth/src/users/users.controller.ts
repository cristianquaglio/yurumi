import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';

import {
  CurrentUSer,
  JwtAuthGuard,
  Roles,
  UserDocument,
  UserRoles,
} from '@app/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getUser(@CurrentUSer() user: UserDocument) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
