// importando validações para os dados
import { IsEmail, IsNotEmpty } from 'class-validator';

// exportando classe de dados
export class FindUserDTO {
  @IsEmail()
  @IsNotEmpty({ message: 'E-mail required!' })
  email: string;
}
