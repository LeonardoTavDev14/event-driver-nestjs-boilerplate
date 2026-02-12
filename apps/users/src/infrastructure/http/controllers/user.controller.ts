// importando Controller do nest
import { Controller, HttpCode, HttpStatus } from '@nestjs/common';

// importando activeuser para mostrar usuário logado na aplicação

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

  @MessagePattern('auth_user')
  @HttpCode(HttpStatus.OK)
  async authUser(@Payload() data: any) {
    const { tokens, user } = await this.authUserUseCase.execute(data);

    return {
      token: {
        accessToken: tokens.accessToken,
        refreshToken_id: tokens.refreshToken_id,
      },
      userData: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
