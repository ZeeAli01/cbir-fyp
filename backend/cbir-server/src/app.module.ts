import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';

import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ApikeysModule } from './apikeys/apikeys.module';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, ApikeysModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
