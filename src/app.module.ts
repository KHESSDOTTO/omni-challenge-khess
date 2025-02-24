import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { TransfersModule } from './transfers/transfers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ // Variáveis de ambiente
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    DatabaseModule,
    TransfersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
