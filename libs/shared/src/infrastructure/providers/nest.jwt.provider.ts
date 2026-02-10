// importando classe abstrata a ser implementada nesta classe
import { JwtProvider } from '@app/shared/application/providers/jwt.provider';

// importando injectable para esta classe ser um provider
import { Injectable } from '@nestjs/common';

// importando jwtService para gerar e verificar o token do usuário
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class NestJwtProvider implements JwtProvider {
  constructor(private readonly jwtService: JwtService) {}

  // gerando o token de acesso do usuário
  async generateToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }

  // verificando token de acesso do usuário
  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token);
  }
}
