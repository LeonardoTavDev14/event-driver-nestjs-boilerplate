// importando entidade usuário
import { User } from '../entities/user.entity';

// exportando classe de abstrata a ser implementada
export abstract class UserRepositories {
  abstract saveUser(user: User): Promise<User>;
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract findUserById(id: string): Promise<User | null>;
  abstract removeUser(id: string): Promise<void>;
}
