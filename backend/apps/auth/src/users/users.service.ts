import { Injectable, Query } from '@nestjs/common';

import { UserStatus } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ICreateUserPayload } from './interfaces/create-user-payload.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(
    @Query() { dependence }: ICreateUserPayload,
    createUserDto: CreateUserDto,
  ) {
    return await this.usersRepository.create({
      ...createUserDto,
      dependence,
      status: UserStatus.EMAIL_ACTIVATION_PENDING,
      isPasswordChanged: false,
      refreshToken: undefined,
    });
  }

  async findAll() {
    return await this.usersRepository.find({});
  }

  async findOne(_id: string) {
    return await this.usersRepository.findOne({ _id });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: updateUserDto },
    );
  }

  async remove(_id: string) {
    return await this.usersRepository.findOneAndDelete({ _id });
  }
}
