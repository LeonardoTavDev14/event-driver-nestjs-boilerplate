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
import { AuthUserUseCase } from 'apps/users/src/application/usecases/auth-user-usecase';
import { RefreshTokenRepositories } from 'apps/users/src/domain/repositories/refresh-token.repositories';
import { RefreshTokenRepository } from '../../repository/refresh-token.repository';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATION_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL') || ''],
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
  ],
})
export class UsersModule {}
