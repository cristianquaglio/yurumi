import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { errorHandler, UserStatus } from '@app/common';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUserDto,
  ChangePasswordDto,
} from './dto';
import { UsersRepository } from './users.repository';
import { ICreateUserPayload } from './interfaces';

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

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid)
      throw new UnauthorizedException('Credentials are not valid');
    if (user.status !== UserStatus.ACTIVE)
      throw new UnauthorizedException(`User is not active`);
    return user;
  }

  async activateEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    if (user.status !== UserStatus.EMAIL_ACTIVATION_PENDING)
      throw new BadRequestException(`This link does not work anymore`);
    return await this.usersRepository.findOneAndUpdate(
      { email },
      { status: UserStatus.ACTIVE },
    );
  }

  async changePassword(_id: string, changePasswordDto: ChangePasswordDto) {
    const { password } = changePasswordDto;
    const user = await this.usersRepository.findOne({ _id });
    if (user.status !== UserStatus.ACTIVE) throw new UnauthorizedException();
    if (await bcrypt.compare(password, user.password))
      throw new BadRequestException(`Password can't be the same one`);
    try {
      await this.usersRepository.findOneAndUpdate(
        { _id },
        {
          $set: {
            password: await bcrypt.hash(password, this.SALT),
            isPasswordChanged: true,
          },
        },
      );
      return { statusCode: 200, message: 'Password changed successfully' };
    } catch (error) {
      errorHandler(error);
    }
  }

  async findAll(dependence: string) {
    return await this.usersRepository.find({ dependence });
  }

  async findOne(_id: string, dependence: string) {
    return await this.usersRepository.findOne({ _id, dependence });
  }

  async dependenceHasUsers({ dependence }: ICreateUserPayload) {
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

  async updateCurrentUser(_id: string, updateUserDto: UpdateUserDto) {
    return await this.usersRepository.findOneAndUpdate(
      { _id },
      { $set: updateUserDto },
    );
  }

  async remove(_id: string, dependence: string) {
    return await this.usersRepository.findOneAndDelete({ _id, dependence });
  }
}
