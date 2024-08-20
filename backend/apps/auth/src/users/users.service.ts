import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { UserStatus } from '@app/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private SALT: number = 10;

  async create(dependence: string, createUserDto: CreateUserDto) {
    return await this.usersRepository.create({
      ...createUserDto,
      dependence,
      password: await bcrypt.hash(createUserDto.password, this.SALT),
      status: UserStatus.EMAIL_ACTIVATION_PENDING,
      isPasswordChanged: false,
      refreshToken: undefined,
    });
  }

  async getUser(getUserDto: GetUserDto) {
    return this.usersRepository.findOne(getUserDto);
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Credentials are not valid.');
    return user;
  }

  async activateEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user.status !== UserStatus.EMAIL_ACTIVATION_PENDING)
      throw new BadRequestException(`This link does not work anymore`);
    return await this.usersRepository.findOneAndUpdate(
      { email },
      { status: UserStatus.ACCOUNT_VALIDATION_PENDING },
    );
  }

  async findAll(dependence: string) {
    return await this.usersRepository.find({ dependence });
  }

  async findOne(_id: string, dependence: string) {
    return await this.usersRepository.findOne({ _id, dependence });
  }

  async dependenceHasUsers(dependence: string) {
    try {
      await this.usersRepository.findOne({ dependence });
    } catch (error) {
      if (error?.response?.statusCode === 404) return false;
    }
    return true;
  }

  async update(_id: string, updateUserDto: UpdateUserDto, dependence: string) {
    return await this.usersRepository.findOneAndUpdate(
      { _id, dependence },
      { $set: updateUserDto },
    );
  }

  async remove(_id: string, dependence: string) {
    return await this.usersRepository.findOneAndDelete({ _id, dependence });
  }
}
