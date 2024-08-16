import { Injectable } from '@nestjs/common';

import { UserStatus } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(dependence: string, createUserDto: CreateUserDto) {
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

  async dependenceHasUsers(dependence: string) {
    try {
      await this.usersRepository.findOne({ dependence });
    } catch (error) {
      if (error?.response?.statusCode === 404) return false;
    }
    return true;
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
