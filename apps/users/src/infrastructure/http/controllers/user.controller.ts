// importando Controller do nest
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';

// importando messagePattern para o envio de eventos de filas
import { MessagePattern } from '@nestjs/microservices';

// importando Payload para os dados passados
import { Payload } from '@nestjs/microservices';

// importando usecases
import { CreateUserUseCase } from 'apps/users/src/application/usecases/create-user.usecase';
import { DeleteUserUseCase } from 'apps/users/src/application/usecases/delete-user.usecase';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @MessagePattern('created_user')
  async createdUser(@Payload() data: any) {
    const createUser = await this.createUserUseCase.execute(data);

    return {
      message: 'User created!',
      data: {
        createUser,
      },
    };
  }

  @MessagePattern('deleted_user')
  @HttpCode(HttpStatus.OK)
  async deletedUser(@Payload() data: any) {
    await this.deleteUserUseCase.execute(data);

    return {
      message: 'User deleted successfully!',
    };
  }
}
