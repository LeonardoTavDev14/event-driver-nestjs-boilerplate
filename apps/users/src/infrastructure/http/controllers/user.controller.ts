// importando Controller do nest
import { Controller } from '@nestjs/common';

// importando messagePattern para o envio de eventos de filas
import { MessagePattern } from '@nestjs/microservices';

// importando Payload para os dados passados
import { Payload } from '@nestjs/microservices';

// importando usecases
import { CreateUserUseCase } from 'apps/users/src/application/usecases/create-user.usecase';

@Controller()
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @MessagePattern('created_user')
  async createdUser(@Payload() data: any) {
    const createUser = await this.createUserUseCase.execute(data);

    return {
      message: 'User created!',
      data: createUser,
    };
  }
}
