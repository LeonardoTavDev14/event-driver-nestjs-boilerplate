// exportando classe abstrata para ser implementada
export abstract class TemplatesMailProvider {
  abstract welcomeMailTemplate(name: string, linkPlataform: string): string;
  abstract removeAccountMailTemplate(name: string): string;
}
