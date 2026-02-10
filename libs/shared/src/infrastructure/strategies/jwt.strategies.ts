// importando strategy do passport
import { ExtractJwt, Strategy } from 'passport-jwt';

// importando passport strategy
import { PassportStrategy } from '@nestjs/passport';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando configService para carregar variaveis de ambiente
import { ConfigService } from '@nestjs/config';

// importando tipos de permissões para o usuários
import { permissions } from 'apps/users/src/domain/entities/user.entity';

// criando interface para o payload do jwt validate
interface IJwtPayload {
  sub: string;
  role: permissions;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: IJwtPayload) {
    return { id: payload.sub, role: payload.role };
  }
}
