// importando strategy do passport
import { ExtractJwt, Strategy } from 'passport-jwt';

// importando passport strategy
import { PassportStrategy } from '@nestjs/passport';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

// importando configService para carregar variaveis de ambiente
import { ConfigService } from '@nestjs/config';

export const permissions = {
  USER: 'USER',
  DEV: 'DEV',
  BACK_LOG: 'BACK_LOG',
  ADMIN: 'ADMIN',
  SUPERADMIN: 'SUPERADMIN',
  OWNER: 'OWNER',
} as const;

type permissions = (typeof permissions)[keyof typeof permissions];

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
