import { Controller, Post, Body, Get, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto, LoginUserDto } from './users.dtos';
import { randomBytes } from 'crypto';
import { SHA256, enc } from 'crypto-js';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { UserRegistrationDro, UserLoginDro } from './users.dros';
import { PayloadError, AuthorizationError } from 'src/utils/responses';
import { ConfigService } from 'src/services/config.service';
import { CryptographyService } from 'src/services/cryptography.service';
import Axios from 'axios';

@ApiUseTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly cryptographyService: CryptographyService,
  ) {
    usersService.getAll().then(console.log);
  }

  @Post('register')
  @ApiResponse({ status: 201, type: UserRegistrationDro })
  async register(@Body() registerUserDto: RegisterUserDto) {
    const session = SHA256(randomBytes(64).toString('utf8')).toString(enc.Hex);
    await this.usersService.create({ ...registerUserDto, session });
    return { error: false, session };
  }

  @Post('login')
  @ApiResponse({ status: 201, type: UserLoginDro })
  @ApiResponse({ status: 400, type: PayloadError })
  @ApiResponse({ status: 401, type: AuthorizationError })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);

    if (!user) {
      return new PayloadError('User with given email does not exist');
    }
    const areCredentialsValid = user.passwordHash === loginUserDto.passwordHash;
    if (!areCredentialsValid) {
      return new AuthorizationError('Invalid credentials');
    }

    const session = SHA256(randomBytes(64).toString('utf8')).toString(enc.Hex);

    await this.usersService.updateUsersSession(user.email, session);

    return { error: false, session };
  }

  @Get('my-accounts')
  async getMyAccounts(@Headers('session') session: string) {
    const user = await this.usersService.getUserBySession(session);

    if (!user) {
      return new AuthorizationError('Invalid session');
    }

    const accessedBanks = Object.keys(user.banks);
    let accounts = [];

    for (const bank of accessedBanks) {
      let appID;
      let apiURL;
      const applicationBanks = this.configService.config.integratedBanks;

      for (const appBank of applicationBanks) {
        if (appBank.name === bank) {
          appID = appBank.appID;
          apiURL = appBank.apiUrl;
        }
      }

      const userBankAccounts = user.banks[bank].accounts;

      for (const bankAccount of userBankAccounts) {
        const serverPrivateKey = this.configService.config.privateKey;
        const payload = SHA256(bankAccount.toString()).toString(enc.Hex);
        const signature = await this.cryptographyService.signMessage(
          payload,
          serverPrivateKey,
        );
        const url =
          apiURL +
          '/openapipl/sb/v2_1_1.1/accounts/get-account-info-as-application' +
          bankAccount.toString();
        const response = await Axios.get(url, {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            appID: appID,
            signature,
          },
        });

        if (response.data.error) {
          throw new Error(response.data.message);
        }
        delete response.data.error;
        const accountInfo = { ...response.data };
        accounts.push(accountInfo);
      }
    }
    return { error: false, accounts };
  }
}
