import Axios from 'axios';
import { Injectable } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';

@Injectable()
export class PSD2Service {
  static apiPrefix = '/openapipl/sb/v2_1_1.1/';
  async registerApplication(
    bankEndpoint: string,
    applicationName: string,
    applicationDescription: string,
    applicationPublicKey: string,
    privateKey: string,
  ): Promise<string> {
    const url = bankEndpoint + PSD2Service.apiPrefix + 'applications/signup';

    const signature = await CryptographyService.signMessage(
      applicationPublicKey,
      privateKey,
    );

    const response = await Axios.post(
      url,
      {
        appName: applicationName,
        appDescription: applicationDescription,
        pubkey: applicationPublicKey,
      },
      {
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          'Access-Control-Allow-Origin': '*',
          signature,
        },
      },
    );

    if (response.data.error) {
      throw new Error(response.data.message);
    }

    return response.data.appID;
  }
}
