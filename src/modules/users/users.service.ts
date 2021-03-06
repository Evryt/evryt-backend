import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';

import { UserInterface, BanksInfos } from './user.interface';
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

  async getUserByEmail(email: string): Promise<UserInterface> {
    return await this.userModel.findOne({ email });
  }

  async updateUsersSession(email: string, session: string) {
    await this.userModel.updateOne({ email }, { $set: { session } });
  }

  async getUserBySession(session: string): Promise<UserInterface> {
    return this.userModel.findOne({ session });
  }

  async setUsersBanksInfo(email: string, info: BanksInfos) {
    await this.userModel.updateOne({ email }, { $set: { banks: info } });
  }

  async getAll(): Promise<UserInterface[]> {
    return this.userModel.find({});
  }
}
