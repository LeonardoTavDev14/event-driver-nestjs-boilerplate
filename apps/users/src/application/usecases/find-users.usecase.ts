// importando Injectable para mostrar que esta classe é um provider
import { Injectable } from '@nestjs/common';

// Importando inject para utilização do rabbitmq
import { Inject } from '@nestjs/common';

// importando usersRepositories para utlizando de injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// Importando entidade User para ser uma Promise
import { User } from '../../domain/entities/user.entity';

// Importando Rpc para a utilização de erros personalizados
import { RpcException } from '@nestjs/microservices';

// Importando HttpStatus para a resposta de status correta
import { HttpStatus } from '@nestjs/common';

// interface de dados
interface IUserRequest {
  id: string;
}

@Injectable()
export class FindUsersUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
  ) {}

  async execute(data: IUserRequest): Promise<User[]> {
    // procurando usuário que está fazendo a requisição
    const userRequested = await this.userRepository.findUserById(data.id);

    // caso não encontre nenhum usuário vinculado ao id, retorna um erro
    if (!userRequested) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found in application',
      });
    }

    // permissões autorizadas
    const rolesPermissions = ['ADMIN', 'SUPERADMIN', 'OWNER'];

    // verificando se usuário contém a permissão, caso não contenha, retorna um erro
    if (!rolesPermissions.includes(userRequested.role)) {
      throw new RpcException({
        message: 'You do not have permissions sufficient!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'Not have permissions sufficient',
      });
    }

    // procurando lista de usuários no banco de dados
    const users = await this.userRepository.findAll();

    // filtrando usuários com role de USER
    const roleUser = users.filter((user) => user.role === 'USER');

    // validando usuários
    if (!roleUser.length) {
      throw new RpcException({
        message: 'No users found!',
        status: HttpStatus.NOT_FOUND,
        code: 'Users not found!',
      });
    }

    // retornando usuários com permissões de USER
    return roleUser;
  }
}
