import { BcryptProvider } from '@app/shared/application/providers/bcrypt.provider';
import { Module } from '@nestjs/common';
import { NestBcryptProvider } from '../../providers/nest.bcrypt.provider';
import { NodemailerProvider } from '@app/shared/application/providers/nodemailer.provider';
import { NestNodemailerProvider } from '../../providers/nest.nodemailer.provider';
import { TemplatesMailProvider } from '@app/shared/application/providers/templates.mail.provider';
import { NestTemplatesMailProvider } from '../../providers/nest.templates.mail.provider';
import { JwtProvider } from '@app/shared/application/providers/jwt.provider';
import { NestJwtProvider } from '../../providers/nest.jwt.provider';
import { JwtStrategy } from '../../strategies/jwt.strategies';
import { DayJsProvider } from '@app/shared/application/providers/dayjs.provider';
import { NestDayJsProvider } from '../../providers/nest.dayjs.provider';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Database } from '../../database/database';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [
    Database,
    JwtStrategy,
    { provide: BcryptProvider, useClass: NestBcryptProvider },
    { provide: NodemailerProvider, useClass: NestNodemailerProvider },
    { provide: TemplatesMailProvider, useClass: NestTemplatesMailProvider },
    { provide: JwtProvider, useClass: NestJwtProvider },
    { provide: DayJsProvider, useClass: NestDayJsProvider },
  ],
  exports: [
    JwtStrategy,
    PassportModule,
    JwtModule,
    BcryptProvider,
    NodemailerProvider,
    TemplatesMailProvider,
    JwtProvider,
    DayJsProvider,
  ],
})
export class SharedModule {}
