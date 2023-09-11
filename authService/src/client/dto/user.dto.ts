import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 25)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsBoolean()
  active: boolean;
}
