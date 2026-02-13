// importando Controller do nest
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Res,
} from '@nestjs/common';

// importando dto para validação de dados passados
import { AuthUserDTO, CreateUserDTO } from '@app/shared';

// importando post do nest
import { Post } from '@nestjs/common';

// importando clientProxy para chamar o rabbitmq
import { ClientProxy } from '@nestjs/microservices';

// importando response do express
import type { Response } from 'express';
import { firstValueFrom } from 'rxjs';

@Controller('users')
export class ApiGatewayController {
  constructor(
    @Inject('USER_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  createdUser(@Body() data: CreateUserDTO) {
    const newUser = this.clientProxy.send('created_user', data);

    return {
      message: 'User created!',
      data: newUser,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async authUser(
    @Body() data: AuthUserDTO,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authUser = await firstValueFrom(
      this.clientProxy.send('auth_user', data),
    );

    response.cookie('refreshToken', authUser.tokens.refreshToken_id, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return authUser;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deletedUser(@Param('id') data: { id: string }) {
    this.clientProxy.send('deleted_user', data);

    return {
      message: 'User deleted successfully!',
    };
  }
}
