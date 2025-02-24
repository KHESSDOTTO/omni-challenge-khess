import { Module } from '@nestjs/common';
import { TransfersService } from './transfers.service';
import { TransfersController } from './transfers.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { transferProviders } from './entities/transfer.providers';
import { userProviders } from 'src/users/entities/user.providers';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    UsersModule
  ],
  controllers: [
    TransfersController
  ],
  providers: [
    ...transferProviders,
    ...userProviders,
    TransfersService
  ],
})
export class TransfersModule {}
