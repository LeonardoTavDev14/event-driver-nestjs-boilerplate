import { Module } from '@nestjs/common';
import { NotificationsController } from '../controllers/notifications.controller';
import { SharedModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
  ],
  controllers: [NotificationsController],
  providers: [],
})
export class NotificationsModule {}
