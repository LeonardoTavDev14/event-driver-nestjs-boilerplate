// importando createParamDecorator para a criação de um decorator
import { createParamDecorator } from '@nestjs/common';

// importando ExecutionContext para pegar o usuário logado na aplicação
import { ExecutionContext } from '@nestjs/common';

// pegando usuário logado na aplicação
export const ActiveUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // pegando request das operações http
    const request = ctx.switchToHttp().getRequest();

    // retornando usuário logado
    return request.user;
  },
);
