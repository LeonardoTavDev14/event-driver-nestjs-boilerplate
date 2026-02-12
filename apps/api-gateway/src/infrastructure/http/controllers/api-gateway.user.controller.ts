// importando Controller do nest
import { Body, Controller, Delete, Inject, Param } from '@nestjs/common';

// importando dto para validação de dados passados
import { AuthUserDTO, CreateUserDTO } from '@app/shared';

// importando post do nest
import { Post } from '@nestjs/common';

// importando clientProxy para chamar o rabbitmq
import { ClientProxy } from '@nestjs/microservices';

@Controller('users')
export class ApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @Post('create')
  createdUser(@Body() data: CreateUserDTO) {
    return this.clientProxy.send('created_user', data);
  }

  @Post('login')
  authUser(@Body() data: AuthUserDTO) {
    return this.clientProxy.send('auth_user', data);
  }

  @Delete(':id')
  deletedUser(@Param('id') data: { id: string }) {
    return this.clientProxy.send('deleted_user', data);
  }
}
