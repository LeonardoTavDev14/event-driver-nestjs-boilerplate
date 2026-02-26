// importando Controller do nest
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Res,
} from '@nestjs/common';

// importando dto para validação de dados passados
import {
  AuthUserDTO,
  CreateUserDTO,
  FindUserDTO,
  UpdateUserDTO,
} from '@app/shared';

// importando post do nest
import { Post } from '@nestjs/common';

// importando clientProxy para chamar o rabbitmq
import { ClientProxy } from '@nestjs/microservices';

// importando response do express
import type { Response } from 'express';

// importando firstValueFrom para transformar a função do clientProxy de sincrona para assincrona (promise)
import { firstValueFrom } from 'rxjs';

// importando useguards para utilizar middleware de usuário logado
import { UseGuards } from '@nestjs/common';

// importando activeuser para pegar a sessão do usuário logado
import { ActiveUser } from '@app/shared/infrastructure/decorators/active-user';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class ApiGatewayUserController {
  constructor(
    @Inject('USER_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createdUser(@Body() data: CreateUserDTO) {
    const newUser = await firstValueFrom(
      this.clientProxy.send('created_user', data),
    );

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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletedUser(@Param('id') data: { id: string }) {
    await firstValueFrom(this.clientProxy.send('deleted_user', data));

    return {
      message: 'User deleted successfully!',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('admin')
  @HttpCode(HttpStatus.OK)
  async deletedUserByAdmin(@ActiveUser() user: any, @Body() data: FindUserDTO) {
    await firstValueFrom(
      this.clientProxy.send('deleted_user_admin', {
        id: user.id,
        email: data.email,
      }),
    );

    return {
      message: 'User deleted by admin successfully!',
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find')
  @HttpCode(HttpStatus.OK)
  async findUserByEmail(@ActiveUser() user: any, @Body() data: FindUserDTO) {
    const userFind = await firstValueFrom(
      this.clientProxy.send('find_user', {
        id: user.id,
        email: data.email,
      }),
    );

    return {
      message: 'Data search!',
      data: userFind,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('find-users')
  @HttpCode(HttpStatus.OK)
  async findUsers(@ActiveUser() user: any) {
    const users = await firstValueFrom(
      this.clientProxy.send('find_users', {
        id: user.id,
      }),
    );

    return {
      datas: users,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('patch')
  @HttpCode(HttpStatus.OK)
  async patchUser(@ActiveUser() user: any, @Body() data: UpdateUserDTO) {
    const userUpdated = await firstValueFrom(
      this.clientProxy.send('update_user', {
        id: user.id,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
      }),
    );

    return {
      message: 'User updated successfully!',
      userUpdate: userUpdated.user,
    };
  }
}
