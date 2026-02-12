// importando entidade RefreshToken
import { RefreshToken } from '../entities/refresh-token.entity';

// exportando classe abstrata a ser implementada
export abstract class RefreshTokenRepositories {
  abstract saveRefreshToken(refreshToken: RefreshToken): Promise<RefreshToken>;
  abstract findRefreshToken(
    refresh_token_id: string,
  ): Promise<RefreshToken | null>;
  abstract removeManyRefreshTokens(userId: string): Promise<void>;
}
