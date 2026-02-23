// Importando UserRepositories para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// Importando Injectable para a classe ser um provider
import { Injectable } from '@nestjs/common';

// Importando inject para a utilização de filas na aplicação
import { Inject } from '@nestjs/common';

// Importando entidade User para metodo estatico para atualização
import { User } from '../../domain/entities/user.entity';

// Importando rpc para erros personalizados
import { RpcException } from '@nestjs/microservices';

// Importando HttpStatus para responder com status correto
import { HttpStatus } from '@nestjs/common';

// interface de dados
interface IUserRequest {
  id: string;
  name?: string;
  dateOfBirth?: Date;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
  ) {}

  async execute(data: IUserRequest): Promise<any> {
    // procurando que está fazendo a requisição
    const userRequested = await this.userRepository.findUserById(data.id);

    // caso não tenha nenhum usuário vinculado, retorna um erro
    if (!userRequested) {
      throw new RpcException({
        message: 'User not found!',
        status: HttpStatus.NOT_FOUND,
        code: 'User not found!',
      });
    }

    // verificando se existe valor no name ou dateOfBirth
    if (!data.name && !data.dateOfBirth) {
      throw new RpcException({
        message: 'No data provided to update!',
        status: HttpStatus.BAD_REQUEST,
        code: 'No payload data in body',
      });
    }

    // atualizando usuário com método estático
    const updatesUser = User.updateUser(userRequested, {
      name: data.name,
      dateOfBirth: data.dateOfBirth,
    });

    // criando um try-catch para caso a conexão com o banco de dados caia
    try {
      // mandando atualização para o banco de dados
      await this.userRepository.patchUser(updatesUser);
    } catch (error) {
      throw new RpcException({
        message: 'Failed to update user in database!',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        code: 'Connection to database failed!',
      });
    }

    // desestruturando dados sensiveis para response
    const {
      id,
      password,
      role,
      loginAttempts,
      accountBlocked,
      accountSuspended,
      ...safeUser
    } = updatesUser;

    // retornando algo para o micro-serviço
    return {
      user: safeUser,
    };
  }
}
