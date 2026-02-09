// importando tipos de validações dos dados
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsDate,
} from 'class-validator';

// exportando classe de DTO
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty({ message: 'Name is required!' })
  @MinLength(3, { message: 'The name must contain at least 3 characters!' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'E-mail is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'The password must contain at least 3 characters!' })
  password: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty({ message: 'Date of birth is required!' })
  dateOfBirth: Date;
}
