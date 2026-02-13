import { NestFactory } from '@nestjs/core';
import { UsersModule } from './infrastructure/http/module/users.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // criando contexto para a userModule
  const appContext = await NestFactory.createApplicationContext(UsersModule);

  // utilizando configService para pegar os valores das variaveis de ambiente
  const configService = appContext.get(ConfigService);

  // fechando conexão
  await appContext.close();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.getOrThrow<string>('RABBITMQ_URL')],
        queue: 'users_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
