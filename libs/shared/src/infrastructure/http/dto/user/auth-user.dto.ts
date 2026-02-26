// importando tipos de validações dos dados
import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

// exportando classe de DTO
export class AuthUserDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail is required!' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required!' })
  password: string;
}
