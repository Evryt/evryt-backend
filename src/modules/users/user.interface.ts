import { Document } from 'mongoose';
interface BanksApiKeys {
  [bankName: string]: { apiKeyClaimTmpCode: string; apiKey: string };
}

export interface UserInterface extends Document {
  readonly email: string;

  readonly passwordHash: string;

  readonly cipheredPrivateKey: string;

  readonly pubkey: string;

  readonly session: string;

  readonly banks: BanksApiKeys;
}
