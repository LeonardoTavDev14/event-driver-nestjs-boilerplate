// importando tipos de permissões de usuário
import { permissions } from './user.entity';

// exportando classe de refreshToken
export class RefreshToken {
  // atributos
  public readonly id?: string;
  public readonly userRole: permissions;
  public readonly userId: string;

  // inicializador
  constructor(userRole: permissions, userId: string, id?: string) {
    this.userRole = userRole;
    this.userId = userId;

    if (id) this.id = id;
  }
}
