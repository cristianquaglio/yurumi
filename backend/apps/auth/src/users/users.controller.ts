import { Request } from 'express';
import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';

import {
  CurrentUSer,
  JwtAuthGuard,
  Roles,
  UserDocument,
  UserRoles,
} from '@app/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { ICreateUserPayload } from './interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('current')
  getUser(@CurrentUSer() user: UserDocument) {
    return user;
  }

  @Get('check-admin')
  checkAdmin(@Query() createUserPayload: ICreateUserPayload) {
    return this.usersService.dependenceHasUsers(createUserPayload);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  @Get()
  findAll(@Req() request: Request) {
    return this.usersService.findAll(request.user['dependence']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.usersService.findOne(id, request.user['dependence']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
  ) {
    return this.usersService.update(
      id,
      updateUserDto,
      request.user['dependence'],
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR)
  remove(@Param('id') id: string, @Req() request: Request) {
    return this.usersService.remove(id, request.user['dependence']);
  }
}
