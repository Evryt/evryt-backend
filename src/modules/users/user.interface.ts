import { Document } from 'mongoose';
export interface BanksInfos {
  [bankName: string]: {
    apiKeyClaimTmpCode: string;
    apiKey: string;
    accounts: number[];
  };
}

export interface UserInterface extends Document {
  readonly email: string;

  readonly passwordHash: string;

  readonly cipheredPrivateKey: string;

  readonly pubkey: string;

  readonly session: string;

  readonly banks: BanksInfos;
}
