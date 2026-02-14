// importando classe de abstrata para ser uma injeção de dependência
import { UserRepositories } from '../../domain/repositories/user.repositories';

// importando classe de abstrata para ser uma injeção de dependência
import { RefreshTokenRepositories } from '../../domain/repositories/refresh-token.repositories';

// importando bcryptProvider para descriptografar a senha
import { BcryptProvider } from '@app/shared/application/providers/bcrypt.provider';

// importando dayJsProvider para datas
import { DayJsProvider } from '@app/shared/application/providers/dayjs.provider';

// importanmdo jwtProvider para gerar o token do usuário
import { JwtProvider } from '@app/shared/application/providers/jwt.provider';

// interface de dados de entrada
interface IAuthUserRequest {
  email: string;
  password: string;
}

// interface de resposta
export interface IAuthUserResponse {
  tokens: {
    accessToken: string;
    refreshToken_id: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// importando injectable para ser uma provider
import { Injectable } from '@nestjs/common';

// importando inject para a utilização de filas na aplicação
import { Inject } from '@nestjs/common';

// importando entidade User
import { User } from '../../domain/entities/user.entity';

// importando error personalizado
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

// importando entidade RefreshToken
import { RefreshToken } from '../../domain/entities/refresh-token.entity';

@Injectable()
export class AuthUserUseCase {
  constructor(
    @Inject(UserRepositories) private readonly userRepository: UserRepositories,
    @Inject(RefreshTokenRepositories)
    private readonly refreshTokenRepository: RefreshTokenRepositories,
    private readonly bcryptProvider: BcryptProvider,
    private readonly dayJsProvider: DayJsProvider,
    private readonly jwtProvider: JwtProvider,
  ) {}

  async execute(data: IAuthUserRequest): Promise<IAuthUserResponse> {
    // procurando usuário por meio do e-mail no banco de dados
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    // caso não encontre nenhum usuário vinculado ao e-mail, retorna um erro
    if (!userAlreadyExists) {
      throw new RpcException({
        message: 'E-mail or password incorrect!',
        status: HttpStatus.BAD_REQUEST,
        code: 'Credentials incorrect!',
      });
    }

    // verificando se o usuário está bloqueado permanentemente
    if (userAlreadyExists.accountBlocked === true) {
      throw new RpcException({
        message:
          'Your account has been permanently blocked. Please contact support!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'User Blocked Error',
      });
    }

    // verificando se a conta está bloqueada temporariamente
    const userSuspended =
      await this.userRepository.lockAccount(userAlreadyExists);

    // caso esteja bloqueada, retorna um erro
    if (userSuspended) {
      throw new RpcException({
        message: 'Your account is temporarily blocked. Please wait!',
        status: HttpStatus.UNAUTHORIZED,
        code: 'User Suspended Account Error',
      });
    }

    // validando senha do usuário
    const isValidPassword = await this.bcryptProvider.compare(
      data.password,
      userAlreadyExists.password,
    );

    // caso a senha não esteja correta, entra no if
    if (!isValidPassword) {
      // verificando quantidade de tentativas de login do usuário pelo banco de dados
      const userAttempts = userAlreadyExists.loginAttempts ?? 0;

      // contador de tentativas de login usuário
      const countAttempts = userAttempts + 1;

      // caso a tentativa seja igual 5 ou maior, entra no if
      if (countAttempts >= 5) {
        // caso a contador seja a 10 ou maior, entra no if
        if (countAttempts >= 10) {
          // utilizando metodo estatico para atualização do usuário
          const updatesUser = User.updateUser(userAlreadyExists, {
            loginAttempts: countAttempts,
            accountBlocked: true,
          });

          // mandando atualização para o banco de dados
          await this.userRepository.patchUser(updatesUser);

          throw new RpcException({
            message:
              'Your account has been permanently blocked. Please contact support!',
            status: HttpStatus.UNAUTHORIZED,
            code: 'User Blocked Error',
          });
        }
        // criando quantidade de tempo com dayjs
        const suspended = this.dayJsProvider.add(5, 'minute');

        // utilizando metodo estatico para atualização do usuário
        const updatesUser = User.updateUser(userAlreadyExists, {
          loginAttempts: countAttempts,
          accountSuspended: suspended,
        });

        // mandando atualização para o banco de dados
        await this.userRepository.patchUser(updatesUser);

        throw new RpcException({
          message: 'Your account is temporarily blocked. Please wait!',
          status: HttpStatus.UNAUTHORIZED,
          code: 'User Suspended Account Error',
        });
      }

      // utilizando metodo estatico para atualização do usuário
      const updatesUser = User.updateUser(userAlreadyExists, {
        loginAttempts: countAttempts,
      });

      // mandando atualização para o banco de dados
      await this.userRepository.patchUser(updatesUser);

      throw new RpcException({
        message: 'E-mail or password incorrect!',
        status: HttpStatus.BAD_REQUEST,
        code: 'Credentials incorrect!',
      });
    }

    // utilizando metodo estatico para atualização do usuário
    const updatesUser = User.updateUser(userAlreadyExists, {
      loginAttempts: 0,
    });

    // mandando atualização para o banco de dados
    await this.userRepository.patchUser(updatesUser);

    // deletando todos os refreshTokens vinculados ao usuário
    await this.refreshTokenRepository.removeManyRefreshTokens(
      userAlreadyExists.id as string,
    );

    // criando novo refreshToken
    const newRefreshToken = new RefreshToken(
      userAlreadyExists.role,
      userAlreadyExists.id as string,
    );

    // criando refreshToken no banco de dados
    const refreshToken =
      await this.refreshTokenRepository.saveRefreshToken(newRefreshToken);

    // gerando token jwt para usuário
    const accessToken = await this.jwtProvider.generateToken({
      sub: userAlreadyExists.id,
      role: userAlreadyExists.role,
    });

    // retornando dados esperados
    return {
      tokens: {
        accessToken,
        refreshToken_id: refreshToken.id!,
      },
      user: {
        id: userAlreadyExists.id!,
        email: userAlreadyExists.email,
        name: userAlreadyExists.name,
      },
    };
  }
}
