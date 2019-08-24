import { readFileSync } from 'fs';

export class ConfigService {
  public config: {
    publicKey: string;
    privateKey: string;
    integratedBanks: Array<{
      name: string;
      apiUrl: string;
      panelUrl: string;
      appID: string;
    }>;
  };
  constructor() {
    this.config = JSON.parse(
      readFileSync(process.env.CONFIG_FILE_PATH, {
        encoding: 'utf8',
      }).toString(),
    );
  }
}
