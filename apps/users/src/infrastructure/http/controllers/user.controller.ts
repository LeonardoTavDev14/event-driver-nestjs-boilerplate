// importando Controller do nest
import { Controller } from '@nestjs/common';

// importando messagePattern para o envio de eventos de filas
import { MessagePattern } from '@nestjs/microservices';

// importando Payload para os dados passados
import { Payload } from '@nestjs/microservices';

// importando usecases
import { CreateUserUseCase } from 'apps/users/src/application/usecases/create-user.usecase';
import { DeleteUserUseCase } from 'apps/users/src/application/usecases/delete-user.usecase';
import { AuthUserUseCase } from 'apps/users/src/application/usecases/auth-user-usecase';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
  ) {}

  @MessagePattern('created_user')
  async createdUser(@Payload() data: any) {
    const createUser = await this.createUserUseCase.execute(data);

    return createUser;
  }

  @MessagePattern('deleted_user')
  async deletedUser(@Payload() data: any) {
    return await this.deleteUserUseCase.execute(data);
  }

  @MessagePattern('auth_user')
  async authUser(@Payload() data: any) {
    return await this.authUserUseCase.execute(data);
  }
}
