// importando classe abstrata para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando Inject para a utilização de micro-serviços
import { Inject, UnauthorizedException } from '@nestjs/common';

// importando injectable para mostrar que a classe é um provider
import { Injectable } from '@nestjs/common';

// importando error personalizado
import { UserNotFoundError } from '@app/shared/errors/user/user-not-found.error';

// Importando clientProxy para a utilização de filas na aplicação
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeleteUserByEmailUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
    @Inject('NOTIFICATION_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  async execute(data: { id: string; email: string }): Promise<void> {
    // procurando usuário da requisição no banco de dados
    const userRequests = await this.userRepository.findUserById(data.id);

    // caso não encontre nenhum usuário vinculado ao id, retorna um erro
    if (!userRequests) {
      throw new UserNotFoundError();
    }

    // caso o usuário não seja admin, superadmin ou owner, retorna um erro
    if (
      userRequests.role === 'USER' ||
      userRequests.role === 'DEV' ||
      userRequests.role === 'BACK_LOG'
    ) {
      throw new UnauthorizedException('Your not permissions sufficient!');
    }

    // procurando usuário a ser apagado por e-mail no banco de dados
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    // caso não encontre nenhum usuário vinculado ao e-mail, retorna um erro
    if (!userAlreadyExists) {
      throw new UserNotFoundError();
    }

    // chamando evento para o envio de e-mail por meio de filas
    this.clientProxy.emit('send_deleted_user_by_admin', {
      email: userAlreadyExists.email,
      name: userAlreadyExists.name.split(' ')[0],
    });

    // deletando usuário encontrado por e-mail
    await this.userRepository.removeUser(userAlreadyExists.id as string);
  }
}
