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
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard, Roles, UserRoles } from '@app/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR, UserRoles.SA)
  @Get()
  @ApiCookieAuth()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: [
      {
        _id: '66d63dea8dad4d74487b34bc',
        firstName: 'Cristian',
        lastName: 'Quagliozzi',
        username: 'cristian.q',
        email: 'cristianquaglio@gmail.com',
        roles: ['SA', 'ADMINISTRATOR'],
        status: 'ACTIVE',
      },
    ],
  })
  findAll(@Req() request: Request) {
    return this.usersService.findAll(request.user['dependence']);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR, UserRoles.SA)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: {
      _id: '66d63dea8dad4d74487b34bc',
      firstName: 'Cristian',
      lastName: 'Quagliozzi',
      username: 'cristian.q',
      email: 'cristianquaglio@gmail.com',
      roles: ['SA', 'ADMINISTRATOR'],
      status: 'ACTIVE',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Related field does not exist',
      error: 'Not Found',
    },
  })
  findOne(@Param('id') id: string, @Req() request: Request) {
    return this.usersService.findOne(id, request.user['dependence']);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @Roles(UserRoles.ADMINISTRATOR, UserRoles.SA)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: {
      _id: '66e46cc2d384fae6472af4f0',
      firstName: 'Cristian',
      lastName: 'Quagliozzi',
      username: 'cristian1.quagliozzi',
      email: 'cristianquaglio1@gmail.com',
      roles: ['ADMINISTRATIVE', 'PROFESSIONAL'],
      status: 'INACTIVE',
      isPasswordChanged: false,
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
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
  @Roles(UserRoles.ADMINISTRATOR, UserRoles.SA)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 200,
    description: 'OK',
    example: { statusCode: 200, message: 'Document deleted' },
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
    example: {
      statusCode: 403,
      message: 'Forbidden resource',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Bad Request',
    example: {
      statusCode: 404,
      message: 'Document was not found',
      error: 'Not Found',
    },
  })
  remove(@Param('id') id: string, @Req() request: Request) {
    const user = this.usersService.remove(id, request.user['dependence']);
    if (user) {
      return { statusCode: 200, message: 'Document deleted' };
    }
  }
}
