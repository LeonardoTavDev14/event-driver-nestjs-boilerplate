// importando classe abstrata a ser implementada nesta classe
import { BcryptProvider } from '@app/shared/application/providers/bcrypt.provider';

// importando hash e compare do bcryptjs
import { hash } from 'bcryptjs';
import { compare } from 'bcryptjs';

// importando injectable para ser um provider
import { Injectable } from '@nestjs/common';

@Injectable()
export class NestBcryptProvider implements BcryptProvider {
  async hash(password: string): Promise<string> {
    return await hash(password, 12);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
