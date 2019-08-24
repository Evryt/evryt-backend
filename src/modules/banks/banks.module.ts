import { Module } from '@nestjs/common';
import { BanksController } from './banks.controller';
import { ConfigService } from 'src/services/config.service';
import { PSD2Service } from 'src/services/psd2.service';
import { usersProviders } from '../users/users.providers';
import { UsersService } from '../users/users.service';
import { CryptographyService } from 'src/services/cryptography.service';
import { DatabaseModule } from 'src/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [BanksController],
  providers: [
    ...usersProviders,
    UsersService,
    ConfigService,
    CryptographyService,
  ],
})
export class BanksModule {}
