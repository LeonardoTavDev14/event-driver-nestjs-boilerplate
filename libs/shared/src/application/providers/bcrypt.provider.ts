// exportando classe abstrata a ser implementada
export abstract class BcryptProvider {
  abstract hash(password: string): Promise<string>;
  abstract compare(password: string, hash: string): Promise<boolean>;
}
