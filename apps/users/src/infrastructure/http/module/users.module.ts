import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserController } from '../controllers/user.controller';
import { UserRepositories } from 'apps/users/src/domain/repositories/user.repositories';
import { UserRepository } from '../../repository/user.repository';
import { Database } from '../../database/database';
import { CreateUserUseCase } from 'apps/users/src/application/usecases/create-user.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeleteUserUseCase } from 'apps/users/src/application/usecases/delete-user.usecase';
import { AuthUserUseCase } from 'apps/users/src/application/usecases/auth-user.usecase';
import { RefreshTokenRepositories } from 'apps/users/src/domain/repositories/refresh-token.repositories';
import { RefreshTokenRepository } from '../../repository/refresh-token.repository';
import { DeleteUserByEmailUseCase } from 'apps/users/src/application/usecases/delete-user-by-email.usecase';
import { FindUserByEmailUseCase } from 'apps/users/src/application/usecases/find-user-by-email.usecase';
import { FindUsersUseCase } from 'apps/users/src/application/usecases/find-users.usecase';
import { UpdateUserUseCase } from 'apps/users/src/application/usecases/update-user.usecase';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
            queue: 'notifications_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    SharedModule,
  ],
  controllers: [UserController],
  providers: [
    Database,
    { provide: UserRepositories, useClass: UserRepository },
    { provide: RefreshTokenRepositories, useClass: RefreshTokenRepository },
    CreateUserUseCase,
    DeleteUserUseCase,
    AuthUserUseCase,
    DeleteUserByEmailUseCase,
    FindUserByEmailUseCase,
    FindUsersUseCase,
    UpdateUserUseCase,
  ],
})
export class UsersModule {}
