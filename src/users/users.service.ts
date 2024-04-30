import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User | HttpException>  {
    const errors = await validate(createUserDto);
    if (errors.length > 0) {
      return new HttpException(errors.map(error => Object.values(error.constraints).join(', ')), HttpStatus.BAD_REQUEST)
    }
    const userByUsername = await this.userRepository.findOne({ where : { username: createUserDto.username } });
    if (userByUsername) {
      return new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    const userByEmail = await this.userRepository.findOne({ where : { email: createUserDto.email } });
    if (userByEmail) {
      return new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async getUsers(): Promise<User[] | HttpException>{
    const usersFounds = await this.userRepository.find();
    const message = 'There are no users in the database'
    if (usersFounds.length === 0) {
      return new HttpException(`${message}`, HttpStatus.NOT_FOUND);
    }
    return usersFounds;
  }

  async getUserById(id: string): Promise<User | HttpException> {
    const userFound = await this.userRepository.findOne({ where : { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async getUserByEmailWithPassword(email: string): Promise<User | HttpException> {
    const userFound = await this.userRepository.findOne({
      where : { email },
      select: [
        'id',
        'firstname',
        'lastname',
        'email',
        'password',
        'role',
        'birthdate',
        'age',
        'sex',
        'country'
      ]
    });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const userFound = await this.userRepository.findOne({ where : { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const updateUser = Object.assign(userFound, updateUserDto);
    return await this.userRepository.save(updateUser);
  }

  async deleteUser(id: string) {
    const userFound = await this.userRepository.findOne({ where : { id } });
    if (!userFound) {
      return new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const userDeleted = await this.userRepository.delete(id);
    if(userDeleted.affected === 1) {
      return new HttpException('User deleted successfully', HttpStatus.OK);
    } else {
      return new HttpException('Failed to delete user', HttpStatus.NOT_FOUND);
    }
  }

}
