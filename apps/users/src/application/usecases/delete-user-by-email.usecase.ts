// importando classe abstrata para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando Inject para a utilização de micro-serviços
import { Inject } from '@nestjs/common';

// importando injectable para mostrar que a classe é um provider
import { Injectable } from '@nestjs/common';

// importando error personalizado
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

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
      throw new RpcException({
        message:
          'Your account has been permanently blocked. Please contact support!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'User Blocked Error',
      });
    }

    // tipos de permissões permitidas
    const rolesPermissions = ['ADMIN', 'SUPERADMIN', 'OWNER'];

    // caso o usuário não seja admin, superadmin ou owner, retorna um erro
    if (!rolesPermissions.includes(userRequests.role)) {
      throw new RpcException({
        message: 'You do not have permissions sufficient!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'Not have permissions sufficient',
      });
    }

    // procurando usuário a ser apagado por e-mail no banco de dados
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    // caso não encontre nenhum usuário vinculado ao e-mail, retorna um erro
    if (!userAlreadyExists) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found error',
      });
    }

    // chamando evento para o envio de e-mail por meio de filas
    this.clientProxy.emit('send_deleted_email', {
      email: userAlreadyExists.email,
      name: userAlreadyExists.name.split(' ')[0],
    });

    // deletando usuário encontrado por e-mail
    await this.userRepository.removeUser(userAlreadyExists.id as string);
  }
}
