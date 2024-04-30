import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginDto) {
    const userFound = await this.usersService.getUserByEmailWithPassword(email);
    if (!userFound || userFound instanceof HttpException) {
      return new HttpException('User with this email not found', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordValid = await bcryptjs.compare(password, userFound.password);
    if (!isPasswordValid) {
      return new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: userFound.email, role: userFound.role };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }

  async register(password: string, registerDto: RegisterDto) {
    const registerByEmail = await this.userRepository.findOne({ where : { email: registerDto.email } });
    if (registerByEmail) {
      return new HttpException('Email already exists', HttpStatus.CONFLICT);
    }
    const registerByUsername = await this.userRepository.findOne({ where : { username: registerDto.username } });
    if (registerByUsername) {
      return new HttpException('Username already exists', HttpStatus.CONFLICT);
    }
    await this.usersService.createUser({
      ...registerDto,
      password: await bcryptjs.hashSync(password, 10)
    });
    return new HttpException('User created successfully', HttpStatus.CREATED);
  }

  async profile({ email, role }: { email: string, role: string }) {
    return await this.userRepository.findOne({ where: { email } });
  }

}
