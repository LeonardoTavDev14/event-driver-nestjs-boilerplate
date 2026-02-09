// importando classe abstrata a ser implementada nesta classe
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando injectable para essa classe ser um provider
import { Injectable } from '@nestjs/common';

// importando database a ser uma injeção de dependência no inicializador
import { Database } from '../database/database';

// importando entidade user
import { User } from '../../domain/user.entity';

// importando mappers para a não repetição de codigo
import { DatabaseUserMapper } from '../mappers/database.user.mapper';

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
}
