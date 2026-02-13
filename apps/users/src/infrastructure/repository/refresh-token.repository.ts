// importando classe abstrata a ser implementada nesta classe
import { RefreshTokenRepositories } from '../../domain/repositories/refresh-token.repositories';

// importando entidade RefreshToken
import { RefreshToken } from '../../domain/entities/refresh-token.entity';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando database para ser uma injeção de dependência
import { Database } from '../database/database';

@Injectable()
export class RefreshTokenRepository implements RefreshTokenRepositories {
  constructor(private readonly database: Database) {}

  async saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken> {
    // criando refreshToken no banco de dados
    const newRefreshToken = await this.database.refreshToken.create({
      data: {
        userRole: refreshToken.userRole,
        userId: refreshToken.userId,
      },
    });

    // retornando dados criados em uma nova entidade
    return new RefreshToken(
      newRefreshToken.userRole,
      newRefreshToken.userId,
      newRefreshToken.id,
    );
  }

  async findRefreshToken(
    refresh_token_id: string,
  ): Promise<RefreshToken | null> {
    // procurando refreshToken no banco de dados
    const refreshTokenAlreadyExists =
      await this.database.refreshToken.findFirst({
        where: { id: refresh_token_id },
      });

    // caso não encontre, retorna nulo
    if (!refreshTokenAlreadyExists) {
      return null;
    }

    // retornando dados encontrados
    return new RefreshToken(
      refreshTokenAlreadyExists.userRole,
      refreshTokenAlreadyExists.userId,
      refreshTokenAlreadyExists.id,
    );
  }

  async removeManyRefreshTokens(userId: string): Promise<void> {
    // deletando todos os refreshTokens vinculados ao usuário
    await this.database.refreshToken.deleteMany({ where: { userId } });
  }
}
