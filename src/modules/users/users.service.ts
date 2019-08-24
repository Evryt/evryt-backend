import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { UserInterface } from './user.interface';
import { USER_SCHEMA_PROVIDER } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_SCHEMA_PROVIDER)
    private readonly userModel: Model<UserInterface>,
  ) {}

  async create(user: {
    email: string;
    passwordHash: string;
    cipheredPrivateKey: string;
    pubkey: string;
    session: string;
  }) {
    await new this.userModel(user).save();
  }
}
