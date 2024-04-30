import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  firstname?: string;
  lastname?: string;
  username?: string;
  password?: string;
  email?: string;
  role?: string;
  birthdate?: Date;
  age?: number;
  sex?: string;
  country?: string;

}
