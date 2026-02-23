// importando classe abstrata a ser implementada nesta classe
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando injectable para essa classe ser um provider
import { Injectable } from '@nestjs/common';

// importando database a ser uma injeção de dependência no inicializador
import { Database } from '../database/database';

// importando entidade user
import { User } from '../../domain/entities/user.entity';

// importando mappers para a não repetição de codigo
import { DatabaseUserMapper } from '../mappers/database.user.mapper';

// importando dayjs para verificar se usuário está bloqueado
import dayjs from 'dayjs';

@Injectable()
export class UserRepository implements UserRepositories {
  constructor(private readonly database: Database) {}

  async saveUser(user: User): Promise<User> {
    // dados necessários para criação do usuário
    const data = DatabaseUserMapper.toDatabase(user);

    // criando usuário no banco de dados
    const newUser = await this.database.user.create({ data });

    // retornando os dados em uma nova entidade
    return DatabaseUserMapper.toDomain(newUser);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    // procurando usuário por e-mail no banco de dados
    const userAlreadyExists = await this.database.user.findUnique({
      where: { email },
    });

    // caso não nenhum usuário vinculado ao e-mail, retorna nulo
    if (!userAlreadyExists) {
      return null;
    }

    // retornando os dados encontrados
    return DatabaseUserMapper.toDomain(userAlreadyExists);
  }

  async findUserById(id: string): Promise<User | null> {
    // procurando usuário pelo id no banco de dados
    const userAlreadyExists = await this.database.user.findFirst({
      where: { id },
    });

    // caso não nenhum usuário vinculado ao id, retorna nulo
    if (!userAlreadyExists) {
      return null;
    }

    // retornando os dados encontrados
    return DatabaseUserMapper.toDomain(userAlreadyExists);
  }

  async removeUser(id: string): Promise<void> {
    // deletando o usuário pelo id no banco de dados
    await this.database.user.delete({
      where: { id },
    });
  }

  async lockAccount(user: User): Promise<boolean> {
    // verificando se existe dados no accountSuspended
    if (!user.accountSuspended) return false;

    // verificando se data existente ainda está ativa
    const isLockAccount = dayjs().isBefore(user.accountSuspended);

    // retornando resultado
    return isLockAccount;
  }

  async patchUser(user: User): Promise<void> {
    // atualizando dados do usuário no banco de dados
    await this.database.user.update({
      where: { id: user.id },
      data: {
        name: user.name,
        password: user.password,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        loginAttempts: user.loginAttempts,
        accountSuspended: user.accountSuspended,
        accountBlocked: user.accountBlocked,
      },
    });
  }

  async findAll(): Promise<User[]> {
    // procurando lista de usuários no banco de dados
    const users = await this.database.user.findMany();

    // retornando lista de usuários encontrados
    return users.map(
      (user) =>
        new User(
          user.name,
          user.email,
          user.password,
          user.dateOfBirth,
          user.role,
          user.loginAttempts,
          user.accountSuspended,
          user.accountBlocked,
          user.id,
        ),
    );
  }
}
