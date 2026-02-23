// importando Controller do nest
import { Controller } from '@nestjs/common';

// importando messagePattern para o envio de eventos de filas
import { MessagePattern } from '@nestjs/microservices';

// importando Payload para os dados passados
import { Payload } from '@nestjs/microservices';

// importando usecases
import { CreateUserUseCase } from 'apps/users/src/application/usecases/create-user.usecase';
import { DeleteUserUseCase } from 'apps/users/src/application/usecases/delete-user.usecase';
import { AuthUserUseCase } from 'apps/users/src/application/usecases/auth-user.usecase';
import { DeleteUserByEmailUseCase } from 'apps/users/src/application/usecases/delete-user-by-email.usecase';
import { FindUserByEmailUseCase } from 'apps/users/src/application/usecases/find-user-by-email.usecase';
import { FindUsersUseCase } from 'apps/users/src/application/usecases/find-users.usecase';
import { UpdateUserUseCase } from 'apps/users/src/application/usecases/update-user.usecase';

@Controller()
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly deleteUserByEmailUseCase: DeleteUserByEmailUseCase,
    private readonly authUserUseCase: AuthUserUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
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

  @MessagePattern('deleted_user_admin')
  async deletedUserByAdmin(@Payload() data: { id: string; email: string }) {
    return await this.deleteUserByEmailUseCase.execute(data);
  }

  @MessagePattern('auth_user')
  async authUser(@Payload() data: any) {
    return await this.authUserUseCase.execute(data);
  }

  @MessagePattern('find_user')
  async findUserByEmail(@Payload() data: any) {
    return await this.findUserByEmailUseCase.execute(data);
  }

  @MessagePattern('find_users')
  async findUsers(@Payload() data: any) {
    return await this.findUsersUseCase.execute(data);
  }

  @MessagePattern('update_user')
  async updateUser(@Payload() data: any) {
    return await this.updateUserUseCase.execute(data);
  }
}
