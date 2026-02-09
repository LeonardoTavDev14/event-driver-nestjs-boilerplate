// exportando tipos de permissões do usuário
export const permissions = {
  USER: 'USER',
  DEV: 'DEV',
  BACK_LOG: 'BACK_LOG',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  OWNER: 'OWNER',
} as const;

// exportando tipos de permissões com type
export type permissions = (typeof permissions)[keyof typeof permissions];

// exportando classe de usuário
export class User {
  // atributos
  public readonly id?: string;
  public readonly name: string;
  public readonly email: string;
  public readonly password: string;
  public readonly dateOfBirth: Date;
  public readonly role: permissions;

  // inicializador
  constructor(
    name: string,
    email: string,
    password: string,
    dateOfBirth: Date,
    role: permissions,
    id?: string,
  ) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.dateOfBirth = dateOfBirth;
    this.role = role;

    // opcionais
    if (id) this.id = id;
  }
}
