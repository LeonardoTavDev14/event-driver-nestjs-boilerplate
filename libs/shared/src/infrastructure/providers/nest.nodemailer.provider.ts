// importando classe abstrata a ser implementada nesta classe
import { NodemailerProvider } from '@app/shared/application/providers/nodemailer.provider';

// importando payload para o nodemailer provider
import { INodemailerPayload } from '@app/shared/application/providers/nodemailer.provider';

// importando nodemailer
import nodemailer from 'nodemailer';

// importando injectable para a classe ser um provider
import { Injectable, InternalServerErrorException } from '@nestjs/common';

// importando configService para a capturar de variaveis de ambiente
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NestNodemailerProvider implements NodemailerProvider {
  // pegando variavel do nodemailer para criação de transporter
  private readonly transporter: nodemailer.Transporter;

  // link para o sistema pelo e-mail
  linkPlataform: string;

  // inicializador
  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: configService.get<string>('NODE_SERVICE'),
      auth: {
        user: configService.get<string>('NODE_USER'),
        pass: configService.get<string>('NODE_PASS'),
      },
    });

    this.linkPlataform = configService.get<string>('HOST')!;
  }

  // função para enviar o e-mail
  async sendingMail(payload: INodemailerPayload): Promise<void> {
    // criando opções de envio de e-mail
    const mailOptions = {
      to: payload.email,
      from: this.configService.get<string>('NODE_USER'),
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    };

    // criando try/catch para capturar erros na execução
    try {
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
