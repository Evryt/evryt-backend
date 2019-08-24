import { Document } from 'mongoose';

export interface UserInterface extends Document {
  readonly email: string;

  readonly passwordHash: string;

  readonly cipheredPrivateKey: string;

  readonly pubkey: string;

  readonly session: string;
}
