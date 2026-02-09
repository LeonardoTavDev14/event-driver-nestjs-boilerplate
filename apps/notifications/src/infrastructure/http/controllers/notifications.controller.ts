// importando Controller do nest
import { Controller, Inject } from '@nestjs/common';

// importando EventPattern para chamar as filas com o RabbitMQ
import { EventPattern } from '@nestjs/microservices';

// importando nodemailer provider para o envio de e-mail
import { NodemailerProvider } from '@app/shared/application/providers/nodemailer.provider';

// importando templates provider para o envio de e-mail
import { TemplatesMailProvider } from '@app/shared/application/providers/templates.mail.provider';

// importando payload para os dados a serem passados no nodemailerProvider
import { Payload } from '@nestjs/microservices';

// importando configService para a utilização de variaveis de ambiente
import { ConfigService } from '@nestjs/config';

@Controller()
export class NotificationsController {
  // injeção de dependência
  constructor(
    @Inject(ConfigService) private readonly configService: ConfigService,
    private readonly nodemailerProvider: NodemailerProvider,
    private readonly templatesMailProvider: TemplatesMailProvider,
  ) {}

  // chamar o rabbitmq para as filas
  @EventPattern('send_welcome_email')
  async sendWelcomeEmail(@Payload() data: { email: string; name: string }) {
    await this.nodemailerProvider.sendingMail({
      email: data.email,
      subject: 'Welcome to DAILY REMAIDER',
      text: 'INTRODUCTION IN APP',
      html: this.templatesMailProvider.welcomeMailTemplate(
        data.name,
        this.nodemailerProvider.linkPlataform,
      ),
    });
  }

  @EventPattern('send_deleted_email')
  async sendRemoveEmail(@Payload() data: { email: string; name: string }) {
    await this.nodemailerProvider.sendingMail({
      email: data.email,
      subject: 'DELETED ACCOUNT IN DAILY REMAIDER',
      text: 'REMOVED ACCOUNT IN APP',
      html: this.templatesMailProvider.removeAccountMailTemplate(data.name),
    });
  }
}
