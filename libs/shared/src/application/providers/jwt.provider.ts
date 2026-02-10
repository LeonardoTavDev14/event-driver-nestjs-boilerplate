// exportando classe abstrata a ser implementada
export abstract class JwtProvider {
  abstract generateToken(payload: object): Promise<string>;
  abstract verifyToken(token: string): Promise<any>;
}
