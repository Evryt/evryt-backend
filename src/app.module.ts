import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from './services/config.module';
import { CryptographyModule } from './services/cryptography.module';
import { BanksModule } from './modules/banks/banks.module';

@Module({
  imports: [ConfigModule, CryptographyModule, UsersModule, BanksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
