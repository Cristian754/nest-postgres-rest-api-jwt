import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  firstname: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  lastname: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/)
  password: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  birthdate: Date;

  @IsInt()
  @IsNotEmpty()
  age: number;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  sex: string;

  @Transform(({ value }) => value.trim())
  @IsString()
  @IsNotEmpty()
  country: string;

}
