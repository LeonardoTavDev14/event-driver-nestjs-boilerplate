// exportando payload para o envio de email
export interface INodemailerPayload {
  email: string;
  subject: string;
  html: string;
  text: string;
}

// exportando classe abstrata a ser implementada
export abstract class NodemailerProvider {
  abstract sendingMail(payload: INodemailerPayload): Promise<void>;
  linkPlataform: string;
}
