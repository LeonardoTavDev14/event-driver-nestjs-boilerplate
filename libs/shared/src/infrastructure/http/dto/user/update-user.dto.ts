// importando tipos de validações dos dados
import { Type } from 'class-transformer';
import { IsString, MinLength, IsDate, IsOptional } from 'class-validator';

// exportando classe de DTO
export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'The name must contain at least 3 characters!' })
  name?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateOfBirth?: Date;
}
