// importando entidade de usuário
import { User } from '../../domain/user.entity';

// exportando classe de mapper de usuário para não ficar repetindo codigo
export class DatabaseUserMapper {
  // para a uma nova instância de entidade usuário para classe de domain
  static toDomain(raw: any): User {
    return new User(
      raw.name,
      raw.email,
      raw.password,
      raw.dateOfBirth,
      raw.permissions,
      raw.id,
    );
  }

  // para os dados no prisma
  static toDatabase(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      dateOfBirth: user.dateOfBirth,
      role: user.role,
    };
  }
}
