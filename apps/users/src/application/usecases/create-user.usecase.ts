// importando bcryptProvider para criptografar a senha
import { BcryptProvider } from '@app/shared/application/providers/bcrypt.provider';

// importando userRepositories para utilizar o banco de dados
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando injectable a ser um provider
import { Inject, Injectable } from '@nestjs/common';

// importando entidade de usuário
import { User } from '../../domain/entities/user.entity';

// importando error personalizado
import { userAlreadyExistsError } from '@app/shared/errors/user/user-already-exists.error';

// importando clientProxy para injeção de dependência
import { ClientProxy } from '@nestjs/microservices';

// interface com os tipos de dados a serem passados pelo usuário para a criação da conta
interface IUserRequest {
  name: string;
  email: string;
  password: string;
  dateOfBirth: Date;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(UserRepositories) // inject para a utilização de micro-serviços
    private readonly userRepository: UserRepositories,
    private readonly bcryptProvider: BcryptProvider,
    @Inject('NOTIFICATION_SERVICE') private readonly clientProxy: ClientProxy,
  ) {}

  async execute(data: IUserRequest): Promise<User> {
    // procurando e-mail para ver se o usuário já existe no banco de dados
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    // caso encontre um email vinculado no banco de dados, retorna um erro
    if (userAlreadyExists) {
      throw new userAlreadyExistsError(userAlreadyExists.email);
    }

    // criptografando senha do usuário novo
    const hashedPassword = await this.bcryptProvider.hash(data.password);

    // criando nova instância do usuário
    const newUser = new User(
      data.name,
      data.email,
      hashedPassword,
      data.dateOfBirth,
      'ADMIN',
    );

    // criando usuário no banco de dados
    const saveUser = await this.userRepository.saveUser(newUser);

    // chamando filas para o envio de e-mail para os usuários criados
    this.clientProxy.emit('send_welcome_email', {
      email: saveUser.email,
      name: saveUser.name.split(' ')[0],
    });

    // retornando usuário
    return saveUser;
  }
}
