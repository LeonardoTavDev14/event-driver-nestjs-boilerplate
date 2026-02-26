import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { UsersModule } from 'apps/users/src/infrastructure/http/module/users.module';

@Module({
  imports: [SharedModule, UsersModule],
  controllers: [],
  providers: [],
})
export class TasksModule {}
