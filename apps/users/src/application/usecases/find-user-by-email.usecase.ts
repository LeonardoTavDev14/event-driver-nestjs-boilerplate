// importando classe abstrata para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando inject para a utilização de filas na aplicação
import { Inject } from '@nestjs/common';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando entidade usuário
import { User } from '../../domain/entities/user.entity';

// importando error personalizado
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
  ) {}

  async execute(data: { id: string; email: string }): Promise<User> {
    // procurando usuário que está realizando a requisição
    const userRequested = await this.userRepository.findUserById(data.id);

    // caso o usuário não exista, retorna um erro
    if (!userRequested) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found error',
      });
    }

    // permissões que o usuário deve conter para acessar esta usecase
    const allowedRoles = ['ADMIN', 'SUPERADMIN', 'OWNER'];

    // caso o usuário não tenha permissão suficiente para acessar a usecase, retorna um erro
    if (!allowedRoles.includes(userRequested.role)) {
      throw new RpcException({
        message: 'You do not have permission to access this information!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'User request not have permission error',
      });
    }

    // procurando usuário por meio do e-mail
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    // caso o usuário não exista no banco de dados, retorna um erro
    if (!userAlreadyExists) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found error',
      });
    }

    // retornando usuário encontrado
    return userAlreadyExists;
  }
}
