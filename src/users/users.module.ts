import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { userProviders } from './entities/user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    DatabaseModule,
    AuthModule
  ],
  controllers: [
    UsersController
  ],
  providers: [
    ...userProviders,
    UsersService,
    AuthService
  ],
})
export class UsersModule {}
