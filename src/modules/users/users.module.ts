import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { UsersController } from './users.controller';
import { usersProviders } from './users.providers';
import { UsersService } from './users.service';
import { ConfigService } from 'src/services/config.service';
import { CryptographyService } from 'src/services/cryptography.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...usersProviders,
    UsersService,
    ConfigService,
    CryptographyService,
  ],
})
export class UsersModule {}
