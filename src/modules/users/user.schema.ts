import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    cipheredPrivateKey: {
      type: String,
      required: true,
    },
    pubkey: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
    banks: {
      type: Object,
      default: {},
      required: true,
    },
  },
  { versionKey: false },
);
