import { Controller, Get, Param, Post, Body, Headers } from '@nestjs/common';
import { ConfigService } from 'src/services/config.service';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';
import { GetAllBanksDro, GetBankAppIDDro } from './banks.dros';
import { PSD2Service } from 'src/services/psd2.service';
import {
  PayloadError,
  AuthorizationError,
  NoErrorResponse,
} from 'src/utils/responses';
import { UsersService } from '../users/users.service';
import Axios from 'axios';
import { CryptographyService } from 'src/services/cryptography.service';

@ApiUseTags('banks')
@Controller('banks')
export class BanksController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly cryptographyService: CryptographyService,
  ) {}

  @Get('all')
  @ApiResponse({ status: 200, type: GetAllBanksDro })
  async getAllBanks() {
    return {
      error: false,
      integratedBanks: this.configService.config.integratedBanks,
    };
  }

  @Get('get-bank-app-id/:bank')
  @ApiResponse({ status: 200, type: GetBankAppIDDro })
  @ApiResponse({ status: 400, type: PayloadError })
  async getBankAppID(@Param('bank') bank: string) {
    const banks = this.configService.config.integratedBanks;

    for (let i = 0; i < banks.length; i++) {
      if (banks[i].name === bank) {
        return { error: false, appID: banks[i].appID };
      }
    }

    return new PayloadError('Bank with the given name is not supported yet');
  }

  @Get('relay-tmp-token/:appID/:tmpCode')
  @ApiResponse({ status: 200, type: NoErrorResponse })
  @ApiResponse({ status: 401, type: AuthorizationError })
  @ApiResponse({ status: 400, type: PayloadError })
  async relayTmpToken(
    @Headers('session') session: string,
    @Param('tmpCode') tmpCode: string,
    @Param('appID') appID: string,
  ) {
    const user = await this.usersService.getUserBySession(session);

    if (!user) {
      return new AuthorizationError('Invalid session');
    }

    const banks = this.configService.config.integratedBanks;

    let stakeUrl;
    let bankName;
    for (let i = 0; i < banks.length; i++) {
      if (banks[i].appID === appID) {
        stakeUrl = banks[i].apiUrl;
        bankName = banks[i].name;
      }
    }

    if (stakeUrl) {
      return new PayloadError('Invalid appID');
    }

    const signature = await this.cryptographyService.signMessage(
      tmpCode,
      this.configService.config.privateKey,
    );
    const response = await Axios.get(
      stakeUrl + '/openapipl/sb/v2_1_1.1/applications/claim-api-key/' + tmpCode,
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          caller: this.configService.config.publicKey,
          signature,
        },
      },
    );

    const error = response.data.error;

    if (error) {
      console.log(error);
      throw new Error(response.data.message);
    }

    const apiKey = response.data.ApiKey;
    const accountID = response.data.accountID;

    let banksInfo = user.banks;

    banksInfo[bankName].apiKey = apiKey;
    banksInfo[bankName].apiKeyClaimTmpCode = tmpCode;
    const currenctAccounts = banksInfo[bankName].accounts;
    if (!currenctAccounts) {
      banksInfo[bankName].accounts = [];
    }
    banksInfo[bankName].accounts.push(accountID);

    console.log(apiKey);

    await this.usersService.setUsersBanksInfo(user.email, banksInfo);

    return { error: false };
  }
}
