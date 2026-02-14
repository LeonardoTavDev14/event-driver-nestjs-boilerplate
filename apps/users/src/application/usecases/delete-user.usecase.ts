// importando classe abstrata para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando Inject para o userRepositories
import { Inject } from '@nestjs/common';

// importando filas para o envio de e-mail
import { ClientProxy } from '@nestjs/microservices';

// importando error personalizado
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
    @Inject('NOTIFICATION_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  async execute(data: { id: string }): Promise<void> {
    // procurando usuário por meio id do banco de dados
    const userAlreadyExists = await this.userRepository.findUserById(data.id);

    // caso não encontre nenhum usuário vinculado ao id, retorna um erro
    if (!userAlreadyExists) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found error',
      });
    }

    // enviando e-mail de aviso para exclusão de conta para o usuário
    this.clientProxy.emit('send_deleted_email', {
      email: userAlreadyExists.email,
      name: userAlreadyExists.name.split(' ')[0],
    });

    // deletando o usuário no banco de dados
    await this.userRepository.removeUser(userAlreadyExists.id as string);
  }
}
